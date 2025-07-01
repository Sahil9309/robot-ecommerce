// src/components/controls/ArmController.jsx
import { useCallback, useEffect, useRef } from 'react';

const ArmController = ({ 
    poseLandmarks,
    leftHandLandmarks, 
    rightHandLandmarks,
    loadedRobotInstanceRef, 
    setRobotJointStates,
    mapRange 
}) => {
    const lastLeftValuesRef = useRef({ shoulderRoll: null, shoulderPitch: null });
    const lastRightValuesRef = useRef({ shoulderRoll: null, shoulderPitch: null });

    const updateArmControls = useCallback(() => {
        // Add proper error checking
        if (!loadedRobotInstanceRef?.current || typeof setRobotJointStates !== 'function') {
            return;
        }
        try {
            const threshold = 0.01;
            const newState = {};

            // Left arm control
            if (leftHandLandmarks && poseLandmarks) {
                const wrist = leftHandLandmarks[0];
                const elbow = poseLandmarks[13]; // Left elbow landmark

                if (wrist && elbow) {
                    const shoulderPitch = mapRange(wrist.y, 0, 1, -Math.PI/2, Math.PI/2);
                    const shoulderRoll = mapRange(wrist.x, 0, 1, -Math.PI/2, Math.PI/2);
                    
                    if (Math.abs(lastLeftValuesRef.current.shoulderRoll - shoulderRoll) > threshold ||
                        Math.abs(lastLeftValuesRef.current.shoulderPitch - shoulderPitch) > threshold) {
                        
                        lastLeftValuesRef.current.shoulderRoll = shoulderRoll;
                        lastLeftValuesRef.current.shoulderPitch = shoulderPitch;
                        
                        newState['LARM_JOINT0'] = shoulderRoll;
                        newState['LARM_JOINT1'] = shoulderPitch;
                    }
                }
            }

            // Right arm control
            if (rightHandLandmarks && poseLandmarks) {
                const wrist = rightHandLandmarks[0];
                const elbow = poseLandmarks[14]; // Right elbow landmark

                if (wrist && elbow) {
                    const shoulderPitch = mapRange(wrist.y, 0, 1, -Math.PI/2, Math.PI/2);
                    const shoulderRoll = mapRange(wrist.x, 0, 1, -Math.PI/2, Math.PI/2);
                    
                    if (Math.abs(lastRightValuesRef.current.shoulderRoll - shoulderRoll) > threshold ||
                        Math.abs(lastRightValuesRef.current.shoulderPitch - shoulderPitch) > threshold) {
                        
                        lastRightValuesRef.current.shoulderRoll = shoulderRoll;
                        lastRightValuesRef.current.shoulderPitch = shoulderPitch;
                        
                        newState['RARM_JOINT0'] = -shoulderRoll; // Invert for right arm
                        newState['RARM_JOINT1'] = shoulderPitch;
                    }
                }
            }

            // Only update if there are changes
            if (Object.keys(newState).length > 0) {
                setRobotJointStates(prev => ({
                    ...prev,
                    ...newState
                }));
            }
        } catch (error) {
            console.error('Error in ArmController:', error);
        }
    }, [leftHandLandmarks, rightHandLandmarks, poseLandmarks, loadedRobotInstanceRef, setRobotJointStates, mapRange]);

    useEffect(() => {
        updateArmControls();
    }, [leftHandLandmarks, rightHandLandmarks, poseLandmarks]); // Only depend on landmarks

    return null;
};

export default ArmController;