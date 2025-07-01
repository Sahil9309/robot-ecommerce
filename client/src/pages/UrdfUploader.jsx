// src/pages/UrdfUploader.jsx
import React, { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Text } from '@react-three/drei';
import { UrdfRobotModel, CameraUpdater } from '../components/UrdfRobotModel';
import BodyController from '../components/controls/BodyController';
import MediaPipeTracker from './MediaPipeTracker';
import FileUploadPanel from '../components/FileUploadPanel';
import RobotErrorBoundary from '../components/RobotErrorBoundary';
import VideoRecorder from '../components/VideoRecorder';
import VideoRecordingPanel from '../components/VideoRecordingPanel';

const UrdfUploader = () => {
    // File states
    const [urdfFile, setUrdfFile] = useState(null);
    const [meshFiles, setMeshFiles] = useState(new Map());
    const [status, setStatus] = useState("Upload your URDF and mesh files.");
    const [robotLoadRequested, setRobotLoadRequested] = useState(false);
    const [canvasError, setCanvasError] = useState(null);
    const [loadingProgress, setLoadingProgress] = useState(0);

    // Tracking states
    const [isTracking, setIsTracking] = useState(false);
    const [poseLandmarks, setPoseLandmarks] = useState(null);
    const [leftHandLandmarks, setLeftHandLandmarks] = useState(null);
    const [rightHandLandmarks, setRightHandLandmarks] = useState(null);

    // Video recording states
    const [recordingStatus, setRecordingStatus] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [recordedVideoBlob, setRecordedVideoBlob] = useState(null);
    const [isPlayingRecordedVideo, setIsPlayingRecordedVideo] = useState(false);
    const [recordedJointStatesData, setRecordedJointStatesData] = useState([]);

    // Refs
    const loadedRobotInstanceRef = useRef(null);
    const robotJointStatesRef = useRef({}); // This will store the joint states
    const blobUrlsRef = useRef([]);
    const robotLoadedRef = useRef(false);
    const [cameraUpdateTrigger, setCameraUpdateTrigger] = useState(0);
    
    // Video recording refs
    const drawingCanvasRef = useRef(null);
    const recordedVideoPlayerRef = useRef(null);
    const recordingIntervalRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    // Process URDF file - Fixed to prevent infinite re-renders
    const processedUrdfData = useMemo(() => {
        if (!urdfFile) return null;
        
        try {
            const blobUrl = URL.createObjectURL(urdfFile);
            blobUrlsRef.current.push(blobUrl);
            
            return {
                file: urdfFile,
                blobUrl: blobUrl,
                name: urdfFile.name
            };
        } catch (error) {
            console.error('Error creating URDF blob URL:', error);
            setStatus('Error processing URDF file.');
            return null;
        }
    }, [urdfFile]);

    // Process mesh files - Fixed to prevent infinite re-renders
    const processedMeshData = useMemo(() => {
        if (!meshFiles || meshFiles.size === 0) {
            return { fileMap: {} };
        }
        
        const fileMap = {};
        
        try {
            meshFiles.forEach((arrayBuffer, filename) => {
                const blob = new Blob([arrayBuffer]);
                const blobUrl = URL.createObjectURL(blob);
                fileMap[filename] = blobUrl;
                blobUrlsRef.current.push(blobUrl);
            });
            
            return { fileMap };
        } catch (error) {
            console.error('Error creating mesh blob URLs:', error);
            setStatus('Error processing mesh files.');
            return { fileMap: {} };
        }
    }, [meshFiles]);

    // Cleanup blob URLs
    const cleanupBlobUrls = useCallback(() => {
        blobUrlsRef.current.forEach(blobUrl => {
            try {
                URL.revokeObjectURL(blobUrl);
            } catch (e) {
                console.warn('Error revoking blob URL:', e);
            }
        });
        blobUrlsRef.current = [];
    }, []);

    // Handle robot loading
    const handleLoadRobot = useCallback(() => {
        if (!urdfFile) {
            setStatus("Please select a URDF file first.");
            return;
        }
        
        if (meshFiles.size === 0) {
            setStatus("Please select mesh files (.dae, .stl, .obj, etc.).");
            return;
        }

        if (!processedUrdfData || !processedMeshData.fileMap) {
            setStatus("Error processing files. Please try reselecting your files.");
            return;
        }

        try {
            if (!processedUrdfData.blobUrl) throw new Error("URDF blob URL is invalid");
            Object.values(processedMeshData.fileMap).forEach(url => {
                if (!url) throw new Error("Mesh blob URL is invalid");
            });
        } catch (error) {
            console.error("Invalid blob URLs detected:", error);
            setStatus("File loading error. Please reselect your files.");
            return;
        }

        // Initialize joint states
        robotJointStatesRef.current = {};
        setRobotLoadRequested(true);
        robotLoadedRef.current = false;
        setCanvasError(null);
        setStatus("Loading robot model...");
    }, [urdfFile, meshFiles, processedUrdfData, processedMeshData]);

    const handleRobotLoaded = useCallback((robotInstance) => {
        if (robotLoadedRef.current) return;
        
        loadedRobotInstanceRef.current = robotInstance;
        robotLoadedRef.current = true;
        
        // Initialize joint states with robot's available joints
        if (robotInstance && robotInstance.joints) {
            const initialJointStates = {};
            Object.keys(robotInstance.joints).forEach(jointName => {
                initialJointStates[jointName] = 0; // Initialize to 0 or default position
            });
            robotJointStatesRef.current = initialJointStates;
            console.log('Robot loaded with joints:', Object.keys(robotInstance.joints));
        }
        
        setCameraUpdateTrigger(prev => prev + 1);
        setStatus(`Robot loaded successfully! Use your body to control the robot.`);
    }, []);

    const handleRobotError = useCallback((error) => {
        console.error("Robot loading error:", error);
        setStatus(`Error loading robot: ${error.message || 'Unknown error'}`);
        setCanvasError(error.message || 'Failed to load robot model');
        setRobotLoadRequested(false);
        robotLoadedRef.current = false;
        robotJointStatesRef.current = {};
    }, []);

    const handleClearFiles = useCallback(() => {
        setUrdfFile(null);
        setMeshFiles(new Map());
        setRobotLoadRequested(false);
        loadedRobotInstanceRef.current = null;
        robotLoadedRef.current = false;
        robotJointStatesRef.current = {};
        setCanvasError(null);
        setStatus("Files cleared. Upload new URDF and mesh files.");
        
        // Clear video recording states
        setRecordedVideoBlob(null);
        setRecordedJointStatesData([]);
        setIsPlayingRecordedVideo(false);
        setRecordingStatus("");
        
        cleanupBlobUrls();
    }, [cleanupBlobUrls]);

    const handleCanvasError = useCallback((error) => {
        console.error('Canvas error:', error);
        setCanvasError('WebGL rendering error. Please try refreshing the page.');
        setStatus('Rendering error occurred. Please refresh and try again.');
    }, []);

    const handleMediaPipeResults = useCallback((results) => {
        const hasTracking = !!results.poseLandmarks;
        setIsTracking(hasTracking);
        setPoseLandmarks(results.poseLandmarks || null);
        setLeftHandLandmarks(results.leftHandLandmarks || null);
        setRightHandLandmarks(results.rightHandLandmarks || null);
    }, []);

    const resetErrorBoundary = useCallback(() => {
        setRobotLoadRequested(false);
        robotLoadedRef.current = false;
        robotJointStatesRef.current = {};
        setCanvasError(null);
        setStatus("Try loading the robot again.");
    }, []);

    // Video recording handlers
    const handleStartRecording = useCallback(() => {
        console.log("[UrdfUploader] Starting recording...");
        if (!drawingCanvasRef.current) {
            console.warn("[UrdfUploader] Drawing canvas ref not available for recording.");
            setRecordingStatus("Error: Recording source not ready.");
            return;
        }

        recordedChunksRef.current = [];
        setRecordedVideoBlob(null);
        if (recordedVideoPlayerRef.current) {
            recordedVideoPlayerRef.current.src = '';
            recordedVideoPlayerRef.current.load();
        }
        setIsPlayingRecordedVideo(false);

        let stream;
        try {
            stream = drawingCanvasRef.current.captureStream(30); // 30 FPS
            if (!stream) {
                throw new Error("Failed to capture stream from canvas.");
            }
        } catch (error) {
            console.error("[UrdfUploader] Error capturing stream:", error);
            setRecordingStatus("Error capturing video stream. Check browser permissions.");
            return;
        }

        try {
            const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp8') 
                             ? 'video/webm; codecs=vp8' 
                             : (MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : '');
            
            if (!mimeType) {
                console.error("[UrdfUploader] No supported video mimeType found.");
                setRecordingStatus("Error: No supported video format for recording.");
                return;
            }

            mediaRecorderRef.current = new MediaRecorder(stream, { mimeType });

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                console.log("[UrdfUploader] Recording stopped. Creating blob...");
                const blob = new Blob(recordedChunksRef.current, { type: mediaRecorderRef.current.mimeType });
                setRecordedVideoBlob(blob);
                setRecordingStatus("Recording stopped. Video is ready to play.");
                setIsRecording(false);
            };

            mediaRecorderRef.current.onerror = (event) => {
                console.error("[UrdfUploader] MediaRecorder error:", event.error);
                setRecordingStatus(`Recording error: ${event.error.message}`);
                setIsRecording(false);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingStatus("Recording started...");

            // Start recording joint states
            setRecordedJointStatesData([]);
            recordingIntervalRef.current = setInterval(() => {
                if (robotJointStatesRef.current) {
                    setRecordedJointStatesData(prev => [...prev, { 
                        ...robotJointStatesRef.current,
                        timestamp: Date.now()
                    }]);
                }
            }, 33); // ~30 FPS

        } catch (error) {
            console.error("[UrdfUploader] Error initializing MediaRecorder:", error);
            setRecordingStatus(`Error starting recording: ${error.message}`);
            setIsRecording(false);
        }
    }, []);

    const handleStopRecording = useCallback(() => {
        console.log("[UrdfUploader] Stopping recording...");
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
        } else {
            console.warn("[UrdfUploader] MediaRecorder not in recording state.");
            setIsRecording(false);
            setRecordingStatus("Recording not active.");
        }

        // Stop recording joint states
        if (recordingIntervalRef.current) {
            clearInterval(recordingIntervalRef.current);
            recordingIntervalRef.current = null;
        }
    }, []);

    const handlePlayRecordedVideo = useCallback(() => {
        const playerElement = recordedVideoPlayerRef.current;
        console.log("[UrdfUploader] Playing recorded video...");

        if (!recordedVideoBlob || recordedVideoBlob.size === 0 || !playerElement) {
            console.warn("[UrdfUploader] Playback conditions not met.");
            setRecordingStatus("Cannot play: Video not recorded or player unavailable.");
            return;
        }

        const videoUrl = URL.createObjectURL(recordedVideoBlob);
        playerElement.src = videoUrl;
        playerElement.loop = false;
        playerElement.controls = true;
        
        setIsPlayingRecordedVideo(true);

        // Play joint data if available
        if (recordedJointStatesData.length > 0) {
            handlePlayRecordedData(recordedJointStatesData);
        }

        playerElement.onended = () => {
            console.log("[UrdfUploader] Video playback ended.");
            setIsPlayingRecordedVideo(false);
            URL.revokeObjectURL(videoUrl);
            playerElement.src = '';
            playerElement.controls = false;
        };

        playerElement.play().then(() => {
            console.log("[UrdfUploader] Playback started successfully.");
        }).catch(error => {
            console.error("[UrdfUploader] Error playing video:", error);
            setRecordingStatus(`Error playing video: ${error.message}`);
            setIsPlayingRecordedVideo(false);
            URL.revokeObjectURL(videoUrl);
        });
    }, [recordedVideoBlob, recordedJointStatesData]);

    const handlePlayRecordedData = useCallback((jointStatesData) => {
        if (!robotLoadedRef.current || !loadedRobotInstanceRef.current) {
            console.warn('Robot not loaded, cannot play recorded data');
            return;
        }

        if (jointStatesData.length === 0) {
            console.log('No joint data to play');
            return;
        }

        let frameIndex = 0;
        const playbackInterval = setInterval(() => {
            if (frameIndex >= jointStatesData.length) {
                clearInterval(playbackInterval);
                return;
            }

            const frameData = jointStatesData[frameIndex];
            if (frameData) {
                // Apply joint states to robot
                Object.keys(frameData).forEach(jointName => {
                    if (jointName !== 'timestamp') {
                        robotJointStatesRef.current[jointName] = frameData[jointName];
                    }
                });
            }
            frameIndex++;
        }, 33); // ~30 FPS playback

        // Store interval ref for cleanup if needed
        setTimeout(() => {
            clearInterval(playbackInterval);
        }, jointStatesData.length * 33 + 1000); // Add 1 second buffer
    }, []);

    // Generate stable key for robot component
    const robotKey = useMemo(() => {
        if (!processedUrdfData || !meshFiles.size) return null;
        return `robot-${processedUrdfData.name}-${meshFiles.size}`;
    }, [processedUrdfData?.name, meshFiles.size]);

    // Effect to update robot joints when joint states change
    useEffect(() => {
        const robot = loadedRobotInstanceRef.current;
        const jointStates = robotJointStatesRef.current;
        
        if (!robot || !robotLoadedRef.current || !jointStates) {
            return;
        }

        // Apply joint updates to the robot
        Object.keys(jointStates).forEach(jointName => {
            const urdfJoint = robot.joints[jointName];
            const targetAngle = jointStates[jointName];
            
            if (urdfJoint && typeof targetAngle === 'number' && !isNaN(targetAngle)) {
                if (Math.abs(urdfJoint.angle - targetAngle) > 0.001) {
                    urdfJoint.setJointValue(targetAngle);
                }
            }
        });
    }, [robotJointStatesRef.current, robotLoadedRef.current]);

    // Cleanup on unmount
    React.useEffect(() => {
        return () => {
            cleanupBlobUrls();
            if (recordingIntervalRef.current) {
                clearInterval(recordingIntervalRef.current);
            }
        };
    }, [cleanupBlobUrls]);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-white">
            <div className="max-w-full mx-auto h-screen flex flex-col">
                <div className="flex-1 flex relative">
                    {/* File Upload Sidebar */}
                    <div className="w-80 bg-slate-900/80 backdrop-blur-sm border-r border-purple-500/20 p-4 overflow-y-auto">
                        <FileUploadPanel
                            urdfFile={urdfFile}
                            meshFiles={meshFiles}
                            status={status}
                            canvasError={canvasError}
                            loadingProgress={loadingProgress}
                            robotLoadRequested={robotLoadRequested}
                            onUrdfFileChange={setUrdfFile}
                            onMeshFilesChange={setMeshFiles}
                            onLoadRobot={handleLoadRobot}
                            onClearFiles={handleClearFiles}
                            onStatusChange={setStatus}
                            onLoadingProgressChange={setLoadingProgress}
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 relative">
                        {/* Body Controller - This is the key component that connects MediaPipe to robot */}
                        <BodyController 
                            poseLandmarks={poseLandmarks}
                            leftHandLandmarks={leftHandLandmarks}
                            rightHandLandmarks={rightHandLandmarks}
                            loadedRobotInstanceRef={loadedRobotInstanceRef}
                            robotJointStatesRef={robotJointStatesRef}
                        />

                        {/* Top Right Controls - Fixed positioning and z-index */}
                        <div className="absolute z-30 flex flex-col gap-4">
                            {/* MediaPipe Camera Feed */}
                            <div className="z-40">
                                <MediaPipeTracker
                                    onResults={handleMediaPipeResults}
                                    isTracking={isTracking}
                                    width={320}
                                    height={240}
                                />
                            </div>

                            {/* Video Recording Panel - Positioned below camera feed */}
                            {robotLoadedRef.current && (
                                <div className="w-80 z-30">
                                    <VideoRecordingPanel
                                        recordingStatus={recordingStatus}
                                        recordedVideoBlob={recordedVideoBlob}
                                        recordedVideoPlayerRef={recordedVideoPlayerRef}
                                        isRecording={isRecording}
                                        isPlayingRecordedVideo={isPlayingRecordedVideo}
                                        recordedJointStatesData={recordedJointStatesData}
                                        onStartRecording={handleStartRecording}
                                        onStopRecording={handleStopRecording}
                                        onPlayRecordedVideo={handlePlayRecordedVideo}
                                        isRobotLoaded={robotLoadedRef.current}
                                    />
                                </div>
                            )}
                        </div>

{/* Debug Info - Positioned at top center */}
{robotLoadedRef.current && (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/75 text-white p-3 rounded-lg text-sm z-40 backdrop-blur-sm border border-gray-700">
        <div className="space-y-1">
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isTracking ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Tracking: {isTracking ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="text-gray-300">Joints: {Object.keys(robotJointStatesRef.current || {}).length}</div>
            <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isRecording ? ' bg-gradient-to-br from-slate-900/50 to-purple-900/30' : 'bg-gray-500'}`}></div>
                <span>Recording: {isRecording ? 'Active' : 'Inactive'}</span>
            </div>
            <div className="text-gray-300">Recorded Frames: {recordedJointStatesData.length}</div>
            {poseLandmarks && (
                <div className="text-green-400">Pose detected: {poseLandmarks.length} landmarks</div>
            )}
        </div>
    </div>
)}

                        {/* Hidden canvas for video recording - Updated with Tailwind classes */}
                        <canvas
                            ref={drawingCanvasRef}
                            className="absolute inset-0 w-full h-full pointer-events-none opacity-0 -z-10"
                        />

                        {/* 3D Canvas */}
                        {robotLoadRequested && processedUrdfData && !canvasError ? (
                            <div className="w-full h-full bg-gradient-to-br from-slate-900/50 to-purple-900/30">
                                <Canvas
                                    camera={{ position: [2, 2, 2], fov: 50 }}
                                    className="w-full h-full"
                                    gl={{ 
                                        preserveDrawingBuffer: true, 
                                        antialias: true,
                                        alpha: false,
                                        powerPreference: "high-performance"
                                    }}
                                    onError={handleCanvasError}
                                    onCreated={({ gl }) => {
                                        gl.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                                        // Set up canvas for recording
                                        if (drawingCanvasRef.current) {
                                            const canvas = drawingCanvasRef.current;
                                            const ctx = canvas.getContext('2d');
                                            canvas.width = gl.domElement.width;
                                            canvas.height = gl.domElement.height;
                                            
                                            // Copy WebGL canvas to recording canvas periodically
                                            const copyCanvas = () => {
                                                if (canvas && ctx && gl.domElement) {
                                                    ctx.drawImage(gl.domElement, 0, 0);
                                                }
                                                requestAnimationFrame(copyCanvas);
                                            };
                                            copyCanvas();
                                        }
                                    }}
                                >
                                    <ambientLight intensity={0.6} />
                                    <directionalLight position={[5, 5, 5]} intensity={0.8} />
                                    <pointLight position={[-5, 5, 5]} intensity={0.4} />
                                    
                                    <React.Suspense fallback={
                                        <group>
                                            <Text
                                                position={[0, 0.5, 0]}
                                                fontSize={0.5}
                                                color="cyan"
                                                anchorX="center"
                                                anchorY="middle"
                                            >
                                                Loading Robot...
                                            </Text>
                                            <Text
                                                position={[0, -0.5, 0]}
                                                fontSize={0.2}
                                                color="cyan"
                                                anchorX="center"
                                                anchorY="middle"
                                            >
                                                {loadingProgress > 0 ? `${Math.round(loadingProgress)}% loaded` : 'Starting...'}
                                            </Text>
                                        </group>
                                    }>
                                        <RobotErrorBoundary onReset={resetErrorBoundary}>
                                            {robotKey && (
                                                <UrdfRobotModel
                                                    key={robotKey}
                                                    urdfContent={processedUrdfData.blobUrl}
                                                    fileMap={processedMeshData.fileMap}
                                                    jointStates={robotJointStatesRef.current}
                                                    selectedRobotName="uploaded_robot"
                                                    onRobotLoaded={handleRobotLoaded}
                                                    onRobotError={handleRobotError}
                                                    initialPosition={[0, 0, 0]}
                                                    scale={1.0}
                                                />
                                            )}
                                        </RobotErrorBoundary>
                                    </React.Suspense>

                                    <CameraUpdater
                                        loadedRobotInstanceRef={loadedRobotInstanceRef}
                                        triggerUpdate={cameraUpdateTrigger}
                                    />
                                    
                                    <Environment preset="warehouse" />
                                    
                                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]}>
                                        <planeGeometry args={[10, 10]} />
                                        <meshStandardMaterial color="#1a1a2e" />
                                    </mesh>
                                </Canvas>
                            </div>
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-900/50 to-purple-900/30">
                                <div className="text-center">
                                    {canvasError ? (
                                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-red-600 to-pink-600 rounded-full flex items-center justify-center">
                                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                        </div>
                                    ) : (
                                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-600 to-cyan-600 rounded-full flex items-center justify-center">
                                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                                        </div>
                                    )}
                                    <h3 className="text-2xl font-semibold text-white mb-2">
                                        {canvasError ? 'Rendering Error' : 'Upload Robot Files'}
                                    </h3>
                                    <p className="text-slate-400">
                                        {canvasError ? 'Please refresh the page and try again' : 'Select URDF and mesh files to load your robot'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UrdfUploader;