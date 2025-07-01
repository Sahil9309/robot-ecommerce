// src/components/VideoRecorder.jsx
import React, { useRef, useState, useCallback, useEffect } from 'react';

const VideoRecorder = ({
    recordingSourceRef, // This will be drawingCanvasRef from UrdfUploader
    onRecordingStatusChange,
    onVideoAvailable,
    isRobotLoaded,
    isPlayingRecordedVideo,
    setIsPlayingRecordedVideo,
    recordedJointStatesData,
    onPlayRecordedData,
    recordedVideoPlayerRef // Ref to the playback video element in UrdfUploader
}) => {
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    const [isRecording, setIsRecording] = useState(false);
    const [localRecordedVideoBlob, setLocalRecordedVideoBlob] = useState(null);

    const startRecording = useCallback(() => {
        console.log("[VideoRecorder] startRecording called.");
        if (!recordingSourceRef.current) {
            console.warn("[VideoRecorder] Recording source ref is not available for recording.");
            onRecordingStatusChange("Error: Recording source (camera feed) not ready.", false);
            return;
        }

        recordedChunksRef.current = [];
        setLocalRecordedVideoBlob(null); // Clear any previous blob
        if (recordedVideoPlayerRef.current) {
            recordedVideoPlayerRef.current.src = ''; // Clear previous video src
            recordedVideoPlayerRef.current.load(); // Ensure video element updates
        }
        setIsPlayingRecordedVideo(false); // Ensure playback state is off when starting new recording

        let stream;
        try {
            stream = recordingSourceRef.current.captureStream(30); // 30 FPS
            if (!stream) {
                throw new Error("Failed to capture stream from recording source.");
            }
        } catch (error) {
            console.error("[VideoRecorder] Error capturing stream:", error);
            onRecordingStatusChange("Error capturing video stream from camera feed. Check browser permissions.", false);
            return;
        }

        try {
            const mimeType = MediaRecorder.isTypeSupported('video/webm; codecs=vp8') 
                             ? 'video/webm; codecs=vp8' 
                             : (MediaRecorder.isTypeSupported('video/webm') ? 'video/webm' : '');
            
            if (!mimeType) {
                console.error("[VideoRecorder] No supported video mimeType found for MediaRecorder.");
                onRecordingStatusChange("Error: No supported video format for recording in your browser.", false);
                return;
            }

            mediaRecorderRef.current = new MediaRecorder(stream, {
                mimeType: mimeType
            });

            mediaRecorderRef.current.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunksRef.current.push(event.data);
                    // console.log(`[VideoRecorder] Data available: ${event.data.size} bytes. Total chunks: ${recordedChunksRef.current.length}`);
                }
            };

            mediaRecorderRef.current.onstop = () => {
                console.log("[VideoRecorder] MediaRecorder onstop event fired. Final chunks count:", recordedChunksRef.current.length);
                const currentBlob = new Blob(recordedChunksRef.current, { type: mediaRecorderRef.current.mimeType });
                
                if (localRecordedVideoBlob) {
                    URL.revokeObjectURL(localRecordedVideoBlob);
                    console.log("[VideoRecorder] Revoked previous local recorded video Blob URL.");
                }
                
                setLocalRecordedVideoBlob(currentBlob);
                onVideoAvailable(currentBlob);
                onRecordingStatusChange("Recording stopped. Video is ready to play.", false);
                setIsRecording(false);
                console.log("[VideoRecorder] Blob created with size:", currentBlob.size, "bytes. Type:", currentBlob.type);
            };

            mediaRecorderRef.current.onerror = (event) => {
                console.error("[VideoRecorder] MediaRecorder error:", event.error);
                onRecordingStatusChange(`Recording error: ${event.error.name} - ${event.error.message}`, false);
                setIsRecording(false);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            onRecordingStatusChange("Recording started...", true);
            console.log("[VideoRecorder] Recording started with mimeType:", mimeType);
        } catch (error) {
            console.error("[VideoRecorder] Error initializing MediaRecorder:", error);
            onRecordingStatusChange(`Error starting recording: ${error.message}`, false);
            setIsRecording(false);
        }
    }, [recordingSourceRef, onRecordingStatusChange, onVideoAvailable, localRecordedVideoBlob, recordedVideoPlayerRef, setIsPlayingRecordedVideo]);

    const stopRecording = useCallback(() => {
        console.log("[VideoRecorder] stopRecording called. Current isRecording:", isRecording);
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') { // Check actual state of MediaRecorder
            mediaRecorderRef.current.stop();
        } else {
            console.warn("[VideoRecorder] MediaRecorder is not in 'recording' state. State:", mediaRecorderRef.current?.state);
            setIsRecording(false);
            onRecordingStatusChange("Recording not active.", false);
        }
    }, [isRecording]);

    const playRecordedVideo = useCallback(() => {
        const playerElement = recordedVideoPlayerRef.current;
        console.log("[VideoRecorder] Attempting to play recorded video.");
        console.log("  localRecordedVideoBlob:", localRecordedVideoBlob);
        console.log("  playerElement:", playerElement);
        console.log("  recordedJointStatesData length:", recordedJointStatesData.length);
        console.log("  isPlayingRecordedVideo:", isPlayingRecordedVideo, "isRecording:", isRecording);


        if (!localRecordedVideoBlob || localRecordedVideoBlob.size === 0 || !playerElement) { 
            console.warn("[VideoRecorder] Playback conditions not met (video or player missing).");
            console.warn(`  Blob available: ${!!localRecordedVideoBlob} (size: ${localRecordedVideoBlob?.size}), Player element available: ${!!playerElement}`);
            onRecordingStatusChange("Cannot play: Video not recorded or player unavailable.", false);
            return;
        }

        const videoUrl = URL.createObjectURL(localRecordedVideoBlob);
        playerElement.src = videoUrl;
        playerElement.loop = false;
        playerElement.controls = true; 
        
        setIsPlayingRecordedVideo(true);

        // Only trigger joint data playback if there is joint data
        if (onPlayRecordedData && recordedJointStatesData.length > 0) {
            onPlayRecordedData(recordedJointStatesData);
            console.log("[VideoRecorder] Triggered onPlayRecordedData with", recordedJointStatesData.length, "frames.");
        } else {
            console.warn("[VideoRecorder] No joint data available for robot animation during playback.");
            onPlayRecordedData([]); // Explicitly send empty array to reset robot if necessary
        }

        playerElement.onended = () => {
            console.log("[VideoRecorder] Recorded video playback ended.");
            setIsPlayingRecordedVideo(false);
            URL.revokeObjectURL(videoUrl);
            playerElement.src = '';
            playerElement.controls = false;
        };

        playerElement.play().then(() => {
            console.log("[VideoRecorder] Playback successfully initiated.");
        }).catch(e => {
            console.error("[VideoRecorder] Error playing recorded video (possible autoplay block or codec issue):", e);
            onRecordingStatusChange(`Error playing video: ${e.name} - ${e.message}. Check browser console for details.`, false);
            setIsPlayingRecordedVideo(false);
            try { URL.revokeObjectURL(videoUrl); } catch (revokeErr) { console.warn("Error revoking URL after playback error:", revokeErr); }
        });
        console.log("[VideoRecorder] Attempted to play video from blob URL:", videoUrl);
    }, [localRecordedVideoBlob, setIsPlayingRecordedVideo, onPlayRecordedData, recordedJointStatesData, recordedVideoPlayerRef, onRecordingStatusChange, isRecording]);

    useEffect(() => {
        console.log("--- Current Button States ---");
        console.log("Start Recording disabled:", isRecording || !isRobotLoaded || isPlayingRecordedVideo);
        console.log("Stop Recording disabled:", !isRecording);
        console.log("Play Recorded Video disabled:", !localRecordedVideoBlob || localRecordedVideoBlob.size === 0 || isPlayingRecordedVideo || isRecording);
        console.log("----------------------------");
    }, [isRecording, isRobotLoaded, isPlayingRecordedVideo, localRecordedVideoBlob, recordedJointStatesData]);


    useEffect(() => {
        return () => {
            if (localRecordedVideoBlob) {
                try {
                    URL.revokeObjectURL(localRecordedVideoBlob);
                    console.log("[VideoRecorder] Revoked recorded video Blob URL on cleanup (component unmount).");
                } catch (e) {
                    console.warn("[VideoRecorder] Error revoking recorded video Blob URL on cleanup:", e);
                }
            }
            if (recordedVideoPlayerRef.current) {
                if (!recordedVideoPlayerRef.current.paused) {
                    recordedVideoPlayerRef.current.pause();
                    console.log("[VideoRecorder] Paused playing video on component unmount.");
                }
                recordedVideoPlayerRef.current.currentTime = 0;
                recordedVideoPlayerRef.current.src = '';
                recordedVideoPlayerRef.current.controls = false;
            }
        };
    }, [localRecordedVideoBlob, recordedVideoPlayerRef]);

    return (
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl p-4 border border-slate-700/50 mb-6">
            <h3 className="text-lg font-semibold mb-3 text-slate-200 flex items-center gap-2">
                <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                Video Recording
            </h3>
            <div className="flex flex-col space-y-3">
                <button
                    onClick={startRecording}
                    disabled={isRecording || !isRobotLoaded || isPlayingRecordedVideo}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-red-500/25 flex items-center justify-center gap-2"
                >
                    {isRecording ? (
                        <>
                            <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                            Recording...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Start Recording
                        </>
                    )}
                </button>
                <button
                    onClick={stopRecording}
                    disabled={!isRecording} 
                    className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
                >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                    </svg>
                    Stop Recording
                </button>
                <button
                    onClick={playRecordedVideo}
                    disabled={!localRecordedVideoBlob || localRecordedVideoBlob.size === 0 || isPlayingRecordedVideo || isRecording}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg hover:shadow-blue-500/25 flex items-center justify-center gap-2"
                >
                    {isPlayingRecordedVideo ? (
                        <>
                            <div className="w-2 h-2 bg-white rounded-full animate-bounce"></div>
                            Playing...
                        </>
                    ) : (
                        <>
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            Play Recorded Video
                        </>
                    )}
                </button>
            </div>
            {localRecordedVideoBlob && (
                <div className="mt-3 bg-emerald-900/20 border border-emerald-600/30 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-medium text-emerald-400">Recording Complete</span>
                    </div>
                    <div className="text-xs text-emerald-300">
                        Size: {(localRecordedVideoBlob.size / 1024).toFixed(2)} KB
                        {recordedJointStatesData.length > 0 ? ` • Joint frames: ${recordedJointStatesData.length}` : ' • No joint data recorded'}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoRecorder;