// Improved MediaPipeTracker.jsx with lower latency and more responsive hand tracking

import { useRef, useEffect, useCallback, useState } from 'react';
import { Holistic } from '@mediapipe/holistic';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { POSE_CONNECTIONS, HAND_CONNECTIONS, FACEMESH_TESSELATION } from '@mediapipe/holistic';

const MediaPipeTracker = ({ onResults, isTracking, width = 320, height = 240 }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const holisticRef = useRef(null);
    const cameraInstanceRef = useRef(null);
    const animationFrameRef = useRef(null);
    const isInitializedRef = useRef(false);
    const isMountedRef = useRef(true);
    const latestResultsRef = useRef(null);
    const isProcessingFrameRef = useRef(false);
    const lastFrameTimeRef = useRef(0);

    const [initializationError, setInitializationError] = useState(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    // Lower latency: allow up to 60 FPS (16ms per frame)
    const FRAME_THROTTLE_MS = 16;

    // Function to draw landmarks on canvas with improved colors
    const drawLandmarksOnCanvas = useCallback((results) => {
        const canvas = canvasRef.current;
        if (!canvas || !results || !isMountedRef.current) return;

        try {
            const ctx = canvas.getContext('2d');
            ctx.save();

            // Clear the canvas
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Set canvas size to match video
            const video = videoRef.current;
            if (video && video.videoWidth && video.videoHeight) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
            }

            // Mirror the canvas horizontally to match the flipped video
            ctx.scale(-1, 1);
            ctx.translate(-canvas.width, 0);

            // Draw pose landmarks
            if (results.poseLandmarks) {
                drawConnectors(ctx, results.poseLandmarks, POSE_CONNECTIONS, {
                    color: '#00FF41',
                    lineWidth: 3
                });
                drawLandmarks(ctx, results.poseLandmarks, {
                    color: '#FF0080',
                    lineWidth: 2,
                    radius: 4
                });
            }

            // Draw left hand landmarks
            if (results.leftHandLandmarks) {
                drawConnectors(ctx, results.leftHandLandmarks, HAND_CONNECTIONS, {
                    color: '#00BFFF',
                    lineWidth: 2
                });
                drawLandmarks(ctx, results.leftHandLandmarks, {
                    color: '#0080FF',
                    lineWidth: 1,
                    radius: 3
                });
            }

            // Draw right hand landmarks
            if (results.rightHandLandmarks) {
                drawConnectors(ctx, results.rightHandLandmarks, HAND_CONNECTIONS, {
                    color: '#FFD700',
                    lineWidth: 2
                });
                drawLandmarks(ctx, results.rightHandLandmarks, {
                    color: '#FF8C00',
                    lineWidth: 1,
                    radius: 3
                });
            }

            // Draw face landmarks (subtle)
            if (results.faceLandmarks && results.faceLandmarks.length > 0) {
                drawConnectors(ctx, results.faceLandmarks, FACEMESH_TESSELATION, {
                    color: '#FFFFFF20',
                    lineWidth: 1
                });
            }

            ctx.restore();
        } catch (error) {
            console.error("[MediaPipeTracker] Error drawing landmarks:", error);
        }
    }, []);

    const stableOnResults = useCallback((results) => {
        if (!isMountedRef.current) return;

        try {
            latestResultsRef.current = results;
            drawLandmarksOnCanvas(results);
            if (onResults) {
                onResults(results);
            }
        } catch (error) {
            console.error("[MediaPipeTracker] Error in onResults callback:", error);
        } finally {
            isProcessingFrameRef.current = false;
        }
    }, [onResults, drawLandmarksOnCanvas]);

    useEffect(() => {
        isMountedRef.current = true;

        const initializeMediaPipe = async () => {
            if (isInitializedRef.current || !isMountedRef.current) return;

            try {
                setInitializationError(null);

                holisticRef.current = new Holistic({
                    locateFile: (file) => {
                        return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
                    }
                });

                holisticRef.current.setOptions({
                    modelComplexity: 1,
                    smoothLandmarks: true,
                    enableSegmentation: false,
                    smoothSegmentation: false,
                    refineFaceLandmarks: false,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });

                holisticRef.current.onResults(stableOnResults);

                await initializeCamera();

                isInitializedRef.current = true;
            } catch (error) {
                console.error("[MediaPipeTracker] MediaPipe initialization error:", error);
                setInitializationError(error.message);
            }
        };

        const initializeCamera = async () => {
            try {
                if (!videoRef.current || !isMountedRef.current) return;

                const stream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: { ideal: 320 },
                        height: { ideal: 240 },
                        facingMode: 'user'
                    }
                });

                if (!isMountedRef.current) {
                    stream.getTracks().forEach(track => track.stop());
                    return;
                }

                cameraInstanceRef.current = new Camera(videoRef.current, {
                    onFrame: async () => {
                        if (!holisticRef.current || !videoRef.current || !isMountedRef.current) {
                            return;
                        }

                        // Throttle frame processing for lower latency
                        const now = Date.now();
                        if (now - lastFrameTimeRef.current < FRAME_THROTTLE_MS) {
                            return;
                        }

                        if (isProcessingFrameRef.current) {
                            return;
                        }

                        try {
                            isProcessingFrameRef.current = true;
                            lastFrameTimeRef.current = now;
                            await holisticRef.current.send({ image: videoRef.current });
                        } catch (error) {
                            console.error("[MediaPipeTracker] Error sending frame:", error);
                            isProcessingFrameRef.current = false;
                        }
                    },
                    width: 320,
                    height: 240,
                    facingMode: 'user'
                });

                await cameraInstanceRef.current.start();
                setCameraReady(true);
            } catch (error) {
                console.error("[MediaPipeTracker] Camera initialization error:", error);
                setInitializationError(`Camera error: ${error.message}`);
            }
        };

        const timer = setTimeout(initializeMediaPipe, 100);

        return () => {
            clearTimeout(timer);
            isMountedRef.current = false;

            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            if (cameraInstanceRef.current) {
                try {
                    cameraInstanceRef.current.stop();
                } catch (error) {
                    console.warn("[MediaPipeTracker] Error stopping camera:", error);
                }
                cameraInstanceRef.current = null;
            }

            setTimeout(() => {
                if (holisticRef.current) {
                    try {
                        holisticRef.current.close();
                    } catch (error) {
                        console.warn("[MediaPipeTracker] Error closing holistic:", error);
                    }
                    holisticRef.current = null;
                }
            }, 100);

            isInitializedRef.current = false;
        };
    }, [stableOnResults]);

    useEffect(() => {
        if (!cameraReady) return;

        const draw = () => {
            if (!isMountedRef.current) return;

            if (latestResultsRef.current) {
                drawLandmarksOnCanvas(latestResultsRef.current);
            }

            if (isMountedRef.current) {
                animationFrameRef.current = requestAnimationFrame(draw);
            }
        };

        animationFrameRef.current = requestAnimationFrame(draw);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [cameraReady, drawLandmarksOnCanvas]);

    const handleRetryInitialization = useCallback(() => {
        setInitializationError(null);
        isInitializedRef.current = false;
        setCameraReady(false);
        isProcessingFrameRef.current = false;
        window.location.reload();
    }, []);

    const toggleMinimize = useCallback(() => {
        setIsMinimized(prev => !prev);
    }, []);

    return (
        <div
            className={`relative bg-black rounded-lg overflow-hidden shadow-2xl border-2 border-purple-500/30 transition-all duration-300 ${
                isMinimized ? 'w-16 h-12' : ''
            }`}
            style={{
                width: isMinimized ? '64px' : `${width}px`,
                height: isMinimized ? '48px' : `${height}px`
            }}
        >
            <video
                ref={videoRef}
                className={`w-full h-full object-cover transform -scale-x-100 transition-opacity duration-300 ${
                    isMinimized ? 'opacity-30' : 'opacity-100'
                }`}
                autoPlay
                muted
                playsInline
                style={{ position: 'absolute', top: 0, left: 0 }}
            />

            <canvas
                ref={canvasRef}
                className={`absolute top-0 left-0 w-full h-full pointer-events-none transition-opacity duration-300 ${
                    isMinimized ? 'opacity-0' : 'opacity-100'
                }`}
                style={{ zIndex: 10 }}
            />

            {/* Header with controls */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-900/80 to-blue-900/80 backdrop-blur-sm p-1 flex justify-between items-center z-20">
                <div className="text-white text-xs font-semibold">Body Tracking</div>
                <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500 animate-pulse' : 'bg-red-500'} shadow-lg`}></div>
                </div>
            </div>

            {/* Legend - only show when not minimized */}
            {!isMinimized && (
                <div className="absolute bottom-1 left-1 bg-black/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs z-20">
                    <div className="flex items-center space-x-3">
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-pink-500 rounded-full mr-1"></div>
                            <span>Pose</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                            <span>L Hand</span>
                        </div>
                        <div className="flex items-center">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-1"></div>
                            <span>R Hand</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Status indicator */}
            {cameraReady && !isMinimized && (
                <div className="absolute bottom-1 right-1 bg-green-600/80 backdrop-blur-sm text-white px-2 py-1 rounded text-xs font-medium z-20">
                    Ready
                </div>
            )}

            {/* Error state */}
            {initializationError && (
                <div className="absolute inset-0 bg-red-900/90 backdrop-blur-sm flex items-center justify-center z-30">
                    <div className="text-center text-white p-2">
                        <div className="mb-2">
                            <svg className="w-6 h-6 mx-auto mb-1 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <h3 className="text-xs font-semibold">Error</h3>
                        </div>
                        <p className="text-xs mb-2">{initializationError}</p>
                        <button
                            onClick={handleRetryInitialization}
                            className="bg-red-600 hover:bg-red-700 px-2 py-1 rounded text-xs font-medium transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            )}

            {/* Loading state */}
            {!cameraReady && !initializationError && (
                <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-30">
                    <div className="text-center text-white">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500 mx-auto mb-2"></div>
                        <p className="text-xs">Loading...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MediaPipeTracker;