// src/components/controls/BodyController.jsx
import { useCallback, useEffect } from 'react';
import HeadController from './HeadController';
import ArmController from './ArmController';
import LegController from './LegController';

const BodyController = ({ 
    poseLandmarks,
    leftHandLandmarks, 
    rightHandLandmarks,
    loadedRobotInstanceRef, 
    robotJointStatesRef
}) => {
    const mapRange = useCallback((value, inMin, inMax, outMin, outMax) => {
        const clampedValue = Math.max(inMin, Math.min(value, inMax));
        return (clampedValue - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }, []);

    // Directly update the ref, no forceUpdate
    const updateRobotJointStates = useCallback((newJointStates) => {
        if (!robotJointStatesRef || !robotJointStatesRef.current) return;
        if (typeof newJointStates === 'function') {
            const currentState = robotJointStatesRef.current || {};
            const updatedState = newJointStates(currentState);
            robotJointStatesRef.current = { ...currentState, ...updatedState };
        } else {
            robotJointStatesRef.current = { 
                ...robotJointStatesRef.current, 
                ...newJointStates 
            };
        }
    }, [robotJointStatesRef]);

    // Enhanced error checking
    useEffect(() => {
        if (!robotJointStatesRef) {
            console.error('BodyController: robotJointStatesRef is required but not provided');
            return;
        }

        if (!loadedRobotInstanceRef) {
            console.warn('BodyController: loadedRobotInstanceRef is missing');
            return;
        }

        // Initialize joint states if not already done
        if (!robotJointStatesRef.current) {
            robotJointStatesRef.current = {};
        }
    }, [robotJointStatesRef, loadedRobotInstanceRef]);

    // Debug logging when landmarks are detected
    useEffect(() => {
        if (poseLandmarks) {
            console.log('BodyController: Pose landmarks detected, joints:', Object.keys(robotJointStatesRef.current || {}));
        }
    }, [poseLandmarks, robotJointStatesRef]);

    if (!robotJointStatesRef) {
        console.error('BodyController: robotJointStatesRef is required');
        return null;
    }

    return (
        <>
            <HeadController 
                poseLandmarks={poseLandmarks}
                loadedRobotInstanceRef={loadedRobotInstanceRef}
                setRobotJointStates={updateRobotJointStates}
                mapRange={mapRange}
            />
            
            <ArmController 
                poseLandmarks={poseLandmarks}
                leftHandLandmarks={leftHandLandmarks}
                rightHandLandmarks={rightHandLandmarks}
                loadedRobotInstanceRef={loadedRobotInstanceRef}
                setRobotJointStates={updateRobotJointStates}
                mapRange={mapRange}
            />
            
            <LegController 
                poseLandmarks={poseLandmarks}
                loadedRobotInstanceRef={loadedRobotInstanceRef}
                setRobotJointStates={updateRobotJointStates}
                mapRange={mapRange}
            />
        </>
    );
};

// Add default props to prevent undefined errors
BodyController.defaultProps = {
    poseLandmarks: null,
    leftHandLandmarks: null,
    rightHandLandmarks: null,
    loadedRobotInstanceRef: null,
    robotJointStatesRef: null
};

export default BodyController;