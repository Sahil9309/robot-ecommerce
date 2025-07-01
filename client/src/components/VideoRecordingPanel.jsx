// src/components/VideoRecordingPanel.jsx
import React from 'react';

const VideoRecordingPanel = ({
    recordingStatus,
    recordedVideoBlob,
    recordedVideoPlayerRef,
    isRecording,
    isPlayingRecordedVideo,
    recordedJointStatesData,
    onStartRecording,
    onStopRecording,
    onPlayRecordedVideo,
    isRobotLoaded
}) => {
    const getRecordingStatusColor = () => {
        if (isRecording) return 'text-red-400 bg-red-900/20';
        if (recordingStatus.includes('Error')) return 'text-red-400 bg-red-900/20';
        if (recordingStatus.includes('ready') || recordingStatus.includes('stopped')) return 'text-emerald-400 bg-emerald-900/20';
        return 'text-cyan-400 bg-cyan-900/20';
    };

    return (
        <div className="bg-slate-900/60 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 bg-gradient-to-r from-slate-800/80 to-slate-700/80 border-b border-slate-600/30">
                <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
                    <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    Video Recording
                </h3>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Recording Controls */}
                <div className="flex flex-col gap-3 mb-4">
                    <button
                        onClick={onStartRecording}
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
                        onClick={onStopRecording}
                        disabled={!isRecording}
                        className="w-full bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 disabled:from-slate-700 disabled:to-slate-800 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:hover:scale-100 shadow-lg flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                        </svg>
                        Stop Recording
                    </button>

                    <button
                        onClick={onPlayRecordedVideo}
                        disabled={!recordedVideoBlob || recordedVideoBlob.size === 0 || isPlayingRecordedVideo || isRecording}
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

                {/* Recording Status */}
                {recordingStatus && (
                    <div className={`rounded-lg p-3 mb-4 border border-opacity-30 ${getRecordingStatusColor()}`}>
                        <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                            </svg>
                            <p className="text-sm font-medium">{recordingStatus}</p>
                        </div>
                    </div>
                )}

                {/* Video Info */}
                {recordedVideoBlob && (
                    <div className="bg-emerald-900/20 border border-emerald-600/30 rounded-lg p-3 mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <h4 className="text-sm font-semibold text-emerald-400">Recording Complete</h4>
                        </div>
                        <div className="text-xs text-emerald-300 space-y-1">
                            <div>Size: {(recordedVideoBlob.size / 1024).toFixed(2)} KB</div>
                            <div>Joint Frames: {recordedJointStatesData.length > 0 ? recordedJointStatesData.length : 'No joint data'}</div>
                            <div>Duration: ~{Math.round(recordedJointStatesData.length / 30)} seconds</div>
                        </div>
                    </div>
                )}

                {/* Video Player */}
                {recordedVideoBlob && (
                    <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-600/30">
                        <h4 className="text-sm font-semibold text-slate-300 mb-2 flex items-center gap-2">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                            </svg>
                            Recorded Video
                        </h4>
                        <video
                            ref={recordedVideoPlayerRef}
                            className="w-full rounded-lg bg-black border border-slate-600/50"
                            style={{ maxHeight: '200px' }}
                        />
                    </div>
                )}

                {/* Help Text */}
                {!isRobotLoaded && (
                    <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-3 mt-4">
                        <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 mt-0.5 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-xs text-amber-300">
                                Load a robot first to enable video recording with motion tracking.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VideoRecordingPanel;