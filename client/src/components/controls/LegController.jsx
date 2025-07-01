// src/components/controls/LegController.jsx
import { useCallback, useEffect, useRef } from 'react';

const LegController = ({ 
    poseLandmarks, 
    loadedRobotInstanceRef, 
    setRobotJointStates,
    mapRange 
}) => {
    const lastValuesRef = useRef({});

    const updateLegControl = useCallback(() => {
        // Add proper error checking
        if (!poseLandmarks || !loadedRobotInstanceRef?.current || typeof setRobotJointStates !== 'function') {
            return;
        }

        try {
            const leftHip = poseLandmarks[23];
            const leftKnee = poseLandmarks[25];
            const leftAnkle = poseLandmarks[27];
            const rightHip = poseLandmarks[24];
            const rightKnee = poseLandmarks[26];
            const rightAnkle = poseLandmarks[28];

            const newState = {};
            const threshold = 0.01;

            if (leftHip && leftKnee && leftAnkle) {
                const lleg1 = mapRange(leftKnee.y, 0, 1, -Math.PI/6, Math.PI/6);
                const lleg3 = mapRange(leftAnkle.y, 0, 1, 0, Math.PI/3);
                const lleg4 = mapRange(leftAnkle.y, 0, 1, -Math.PI/6, Math.PI/6);

                if (Math.abs(lastValuesRef.current.lleg1 - lleg1) > threshold ||
                    Math.abs(lastValuesRef.current.lleg3 - lleg3) > threshold ||
                    Math.abs(lastValuesRef.current.lleg4 - lleg4) > threshold) {
                    
                    lastValuesRef.current.lleg1 = lleg1;
                    lastValuesRef.current.lleg3 = lleg3;
                    lastValuesRef.current.lleg4 = lleg4;

                    newState['LLEG_JOINT0'] = 0;
                    newState['LLEG_JOINT1'] = lleg1;
                    newState['LLEG_JOINT2'] = 0;
                    newState['LLEG_JOINT3'] = lleg3;
                    newState['LLEG_JOINT4'] = lleg4;
                    newState['LLEG_JOINT5'] = 0;
                }
            }

            if (rightHip && rightKnee && rightAnkle) {
                const rleg1 = mapRange(rightKnee.y, 0, 1, -Math.PI/6, Math.PI/6);
                const rleg3 = mapRange(rightAnkle.y, 0, 1, 0, Math.PI/3);
                const rleg4 = mapRange(rightAnkle.y, 0, 1, -Math.PI/6, Math.PI/6);

                if (Math.abs(lastValuesRef.current.rleg1 - rleg1) > threshold ||
                    Math.abs(lastValuesRef.current.rleg3 - rleg3) > threshold ||
                    Math.abs(lastValuesRef.current.rleg4 - rleg4) > threshold) {
                    
                    lastValuesRef.current.rleg1 = rleg1;
                    lastValuesRef.current.rleg3 = rleg3;
                    lastValuesRef.current.rleg4 = rleg4;

                    newState['RLEG_JOINT0'] = 0;
                    newState['RLEG_JOINT1'] = rleg1;
                    newState['RLEG_JOINT2'] = 0;
                    newState['RLEG_JOINT3'] = rleg3;
                    newState['RLEG_JOINT4'] = rleg4;
                    newState['RLEG_JOINT5'] = 0;
                }
            }

            if (Object.keys(newState).length > 0) {
                setRobotJointStates(prev => ({
                    ...prev,
                    ...newState
                }));
            }
        } catch (error) {
            console.error('Error in LegController:', error);
        }
    }, [poseLandmarks, loadedRobotInstanceRef, setRobotJointStates, mapRange]);

    useEffect(() => {
        updateLegControl();
    }, [poseLandmarks]); // Only depend on poseLandmarks

    return null;
};

export default LegController;   