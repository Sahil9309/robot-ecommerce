// src/pages/PhoneCam.jsx
import React, { useEffect, useRef, useState, Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import URDFLoader from 'urdf-loader';
import { OrbitControls, Environment, Text } from "@react-three/drei";
import * as THREE from 'three';
// Import ColladaLoader explicitly
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';

// Define robot configurations for both models
const ROBOT_MODELS = {
    hexapod_robot: {
        urdfPath: "/hexapod_robot/crab_model.urdf",
        packagePath: "/", // Assuming public/hexapod_robot/ contains meshes folder
        name: "Hexapod Robot"
    },
    humanoid_robot: {
        urdfPath: "/humanoid_robot/jaxon_jvrc.urdf",
        packagePath: "/", // Assuming public/humanoid_robot/ contains meshes folder
        name: "Humanoid Robot"
    },
    // Add more robots here as needed
    // example_robot: {
    //     urdfPath: "/example_robot/model.urdf",
    //     packagePath: "/",
    //     name: "Example Robot"
    // }
};

/**
 * React component for loading and displaying a URDF robot model in a Three.js canvas.
 * Handles joint state updates based on control commands.
 * @param {object} props - Component props
 * @param {object} props.jointStates - Object containing robot joint commands (e.g., { cmd: 'forward' })
 * @param {function} props.onRobotLoaded - Callback function when the robot model is loaded,
 * passing the loaded THREE.Object3D
 * @param {string} props.selectedRobotName - The key of the currently selected robot model (e.g., 'hexapod_robot')
 * @param {object} props.jointValues - Object containing individual joint values for slider control
 */
const UrdfRobotModel = ({ jointStates, onRobotLoaded, selectedRobotName, jointValues }) => {
    // Get the URDF and package paths based on the selected robot name
    const robotConfig = ROBOT_MODELS[selectedRobotName] || ROBOT_MODELS.hexapod_robot; // Default to hexapod_robot

    // Use the useLoader hook from @react-three/fiber to load the URDF model
    const robot = useLoader(URDFLoader, robotConfig.urdfPath, (loader) => {
        // Ensure meshLoaders object exists before assigning to it
        if (!loader.meshLoaders) {
            loader.meshLoaders = {};
        }
        // Crucial fix: Assign ColladaLoader to handle .dae files
        loader.meshLoaders['dae'] = new ColladaLoader();

        // Set the working path for the URDF loader to resolve relative mesh paths (e.g., "meshes/...")
        loader.workingPath = robotConfig.packagePath;
        loader.parseVisual = true; // Parse visual elements
        loader.parseCollision = false; // Do not parse collision elements (optional, can be true)
    });

    // Effect to run once the robot model is loaded
    useEffect(() => {
        if (robot) {
            console.log(`URDF Robot Loaded (${robotConfig.name}):`, robot);
            console.log(`Available Joints (${robotConfig.name}):`, Object.keys(robot.joints));

            // Apply a scale factor to make the robot visible and appropriately sized
            // These scale and position values might need adjustment per robot model
            const scaleFactor = selectedRobotName === 'humanoid_robot' ? 1 : 10;
            robot.scale.set(scaleFactor, scaleFactor, scaleFactor);
            // Adjust the robot's initial position for better viewing in the scene
            // This position brings the robot roughly to the center of the view
            robot.position.set(0, selectedRobotName === 'humanoid_robot' ? 0 : -2.0 * scaleFactor, 0);

            // Call the callback if provided, to notify parent component about the loaded robot
            if (onRobotLoaded) {
                onRobotLoaded(robot);
            }
        }
    }, [robot, onRobotLoaded, robotConfig.name, selectedRobotName]); // Depend on robot, callback, and config name

    // Effect to update robot joint states and position based on received commands (for hexapod)
    useEffect(() => {
        // Apply commands ONLY if the selected robot is the 'hexapod_robot' AND a command is issued
        if (selectedRobotName === 'hexapod_robot' && robot && jointStates.cmd) {
            const rotationAmount = 0.1; // Amount for joint rotation
            const liftAmount = 0.1;     // Amount for vertical lift (jump)
            const moveAmount = 0.5;     // Amount for translational movement

            // Helper function to safely get a joint's current value
            const getJointValue = (jointName) => {
                const joint = robot.joints[jointName];
                // Return current joint angle or 0 if not found/defined
                return joint ? (joint.angle || 0) : 0;
            };

            // Process different control commands for Hexapod Robot
            if (jointStates.cmd === 'left') {
                // Rotate right coxa joints positively and left coxa joints negatively for turning
                ['coxa_joint_r1', 'coxa_joint_r2', 'coxa_joint_r3'].forEach(jointName => {
                    const joint = robot.joints[jointName];
                    if (joint) {
                        joint.setJointValue(getJointValue(jointName) + rotationAmount);
                    }
                });
                ['coxa_joint_l1', 'coxa_joint_l2', 'coxa_joint_l3'].forEach(jointName => {
                    const joint = robot.joints[jointName];
                    if (joint) {
                        joint.setJointValue(getJointValue(jointName) - rotationAmount);
                    }
                });
                console.log("Hexapod: Attempting 'left' turn.");
            } else if (jointStates.cmd === 'right') {
                // Rotate right coxa joints negatively and left coxa joints positively for turning
                ['coxa_joint_r1', 'coxa_joint_r2', 'coxa_joint_r3'].forEach(jointName => {
                    const joint = robot.joints[jointName];
                    if (joint) {
                        joint.setJointValue(getJointValue(jointName) - rotationAmount);
                    }
                });
                ['coxa_joint_l1', 'coxa_joint_l2', 'coxa_joint_l3'].forEach(jointName => {
                    const joint = robot.joints[jointName];
                    if (joint) {
                        joint.setJointValue(getJointValue(jointName) + rotationAmount);
                    }
                });
                console.log("Hexapod: Attempting 'right' turn.");
            } else if (jointStates.cmd === 'jump') {
                const allFemurJoints = [
                    'femur_joint_r1', 'femur_joint_r2', 'femur_joint_r3',
                    'femur_joint_l1', 'femur_joint_l2', 'femur_joint_l3'
                ];

                // Lower all femur joints for jump preparation (simulated)
                allFemurJoints.forEach(jointName => {
                    const joint = robot.joints[jointName];
                    if (joint) {
                        joint.setJointValue(getJointValue(jointName) - liftAmount);
                    }
                });

                // After a short delay, lift them back up to simulate jump
                setTimeout(() => {
                    allFemurJoints.forEach(jointName => {
                        const joint = robot.joints[jointName];
                        if (joint) {
                            joint.setJointValue(getJointValue(jointName) + liftAmount);
                        }
                    });
                }, 300); // 300ms delay

                console.log("Hexapod: Attempting 'jump'.");
            } else if (jointStates.cmd === 'forward') {
                robot.position.z -= moveAmount; // Move robot along the Z-axis
                console.log("Hexapod: Moving forward. New Z:", robot.position.z);
            } else if (jointStates.cmd === 'backward') {
                robot.position.z += moveAmount; // Move robot along the Z-axis
                console.log("Hexapod: Moving backward. New Z:", robot.position.z);
            } else if (jointStates.cmd === 'up') {
                robot.position.y += moveAmount; // Move robot along the Y-axis (up)
                console.log("Hexapod: Moving up. New Y:", robot.position.y);
            } else if (jointStates.cmd === 'down') {
                robot.position.y -= moveAmount; // Move robot along the Y-axis (down)
                console.log("Hexapod: Moving down. New Y:", robot.position.y);
            }
        } else if (selectedRobotName !== 'hexapod_robot' && jointStates.cmd) {
            // Log if commands are ignored for other robots
            console.log(`Command '${jointStates.cmd}' ignored for ${robotConfig.name}. Only Hexapod Robot supports movement.`);
        }
    }, [jointStates, robot, selectedRobotName]); // Depend on relevant states for re-evaluation

    // Effect to update individual joint values from sliders (for humanoid robot)
    useEffect(() => {
        if (selectedRobotName === 'humanoid_robot' && robot && jointValues) {
            Object.entries(jointValues).forEach(([jointName, value]) => {
                const joint = robot.joints[jointName];
                if (joint && typeof value === 'number') {
                    joint.setJointValue(value);
                }
            });
        }
    }, [jointValues, robot, selectedRobotName]);

    // Render the loaded robot model
    return <primitive object={robot} />;
};

/**
 * Joint slider component for individual joint control
 */
const JointSlider = ({ jointName, value, onChange, min = -Math.PI, max = Math.PI }) => {
    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-slate-700 truncate" title={jointName}>
                    {jointName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </label>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                    {value.toFixed(2)}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={0.01}
                value={value}
                onChange={(e) => onChange(jointName, parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer slider"
                style={{
                    background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #e2e8f0 ${((value - min) / (max - min)) * 100}%, #e2e8f0 100%)`
                }}
            />
        </div>
    );
};

/**
 * Main PhoneCam component to display URDF robot models.
 */
const PhoneCam = () => {
    // Refs for Three.js camera and OrbitControls for dynamic adjustments
    const orbitControlsRef = useRef();
    const cameraRef = useRef();

    // State variables for UI and robot control
    const [jointStates, setJointStates] = useState({});
    // State for selected robot model
    const [selectedRobotName, setSelectedRobotName] = useState('hexapod_robot'); // Default to hexapod_robot
    // State for loading indicator when switching models
    const [isLoadingModel, setIsLoadingModel] = useState(false);
    // State for individual joint values (for slider control)
    const [jointValues, setJointValues] = useState({});
    // State for available joints
    const [availableJoints, setAvailableJoints] = useState([]);

    // State to hold the loaded robot object for camera adjustments
    const [loadedRobot, setLoadedRobot] = useState(null);

    // Callback when the URDF robot model finishes loading
    const handleRobotLoaded = (robotObject) => {
        setLoadedRobot(robotObject);
        setIsLoadingModel(false); // Model loaded successfully
        
        // Extract available joints and initialize joint values
        if (robotObject && robotObject.joints) {
            const joints = Object.keys(robotObject.joints);
            setAvailableJoints(joints);
            
            // Initialize joint values to 0 for all joints
            const initialJointValues = {};
            joints.forEach(jointName => {
                initialJointValues[jointName] = 0;
            });
            setJointValues(initialJointValues);
        }
    };

    // Handle robot model selection change
    const handleRobotChange = (newRobotName) => {
        if (newRobotName !== selectedRobotName) {
            setIsLoadingModel(true); // Start loading
            setLoadedRobot(null); // Clear previous robot
            setJointStates({}); // Reset joint states
            setJointValues({}); // Reset joint values
            setAvailableJoints([]); // Reset available joints
            setSelectedRobotName(newRobotName);
        }
    };

    // Handle joint value change from sliders
    const handleJointValueChange = (jointName, value) => {
        setJointValues(prev => ({
            ...prev,
            [jointName]: value
        }));
    };

    // Reset all joints to zero
    const resetAllJoints = () => {
        const resetValues = {};
        availableJoints.forEach(jointName => {
            resetValues[jointName] = 0;
        });
        setJointValues(resetValues);
    };

    // Effect to adjust camera and orbit controls when the robot model is loaded
    useEffect(() => {
        if (loadedRobot && orbitControlsRef.current && cameraRef.current) {
            console.log("Adjusting camera and orbit controls for the loaded robot...");
            // Calculate bounding box of the loaded robot
            const box = new THREE.Box3().setFromObject(loadedRobot);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // Determine max dimension for camera distance calculation
            const maxDim = Math.max(size.x, size.y, size.z);
            const fov = cameraRef.current.fov * (Math.PI / 180); // Convert FOV to radians
            let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));

            // Adjust camera distance for better view, and slightly above the robot
            cameraZ *= 1.5; // Zoom out a bit
            // Position camera relative to the robot's center and adjusted height
            cameraRef.current.position.set(center.x, center.y + size.y / 2, cameraZ + center.z);
            cameraRef.current.lookAt(center); // Make camera look at the robot's center

            // Update OrbitControls target to the robot's center
            orbitControlsRef.current.target.copy(center);
            orbitControlsRef.current.update();

            // Adjust camera clipping planes based on scene size for better rendering
            cameraRef.current.far = cameraZ * 2;
            cameraRef.current.near = 0.01;
            cameraRef.current.updateProjectionMatrix();

            console.log("Camera adjusted to center:", center, "and position:", cameraRef.current.position);
        }
    }, [loadedRobot]); // Depend on loadedRobot

    // Function to trigger robot commands manually
    const triggerCommand = (command) => {
        if (selectedRobotName === 'hexapod_robot') {
            setJointStates({ cmd: command, timestamp: Date.now() });
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent mb-4">
                        🤖 URDF Robot Viewer
                    </h1>
                    <p className="text-slate-600 text-lg sm:text-xl max-w-2xl mx-auto">
                        Interactive 3D robot simulation and control interface
                    </p>
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
                    {/* Control Panel */}
                    <div className="lg:col-span-1 space-y-6 max-h-[800px] overflow-y-auto">
                        {/* Robot Selection Card */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                Robot Selection
                            </h3>
                            <div className="space-y-3">
                                <label htmlFor="robot-select" className="block text-sm font-medium text-slate-700">
                                    Choose Robot Model
                                </label>
                                <select
                                    id="robot-select"
                                    value={selectedRobotName}
                                    onChange={(e) => handleRobotChange(e.target.value)}
                                    disabled={isLoadingModel}
                                    className={`w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-slate-700 font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm hover:shadow-md ${
                                        isLoadingModel ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {Object.entries(ROBOT_MODELS).map(([key, value]) => (
                                        <option key={key} value={key}>{value.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Control Buttons (only for hexapod robot) */}
                        {selectedRobotName === 'hexapod_robot' && (
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                                <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                    Robot Controls
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                                    {[
                                        { cmd: 'forward', label: 'Forward', icon: '↑', color: 'blue' },
                                        { cmd: 'backward', label: 'Backward', icon: '↓', color: 'blue' },
                                        { cmd: 'left', label: 'Turn Left', icon: '↺', color: 'purple' },
                                        { cmd: 'right', label: 'Turn Right', icon: '↻', color: 'purple' },
                                        { cmd: 'up', label: 'Move Up', icon: '⬆', color: 'green' },
                                        { cmd: 'down', label: 'Move Down', icon: '⬇', color: 'green' },
                                        { cmd: 'jump', label: 'Jump', icon: '⚡', color: 'orange' }
                                    ].map(({ cmd, label, icon, color }) => (
                                        <button
                                            key={cmd}
                                            onClick={() => triggerCommand(cmd)}
                                            className={`group relative overflow-hidden px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl ${
                                                color === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white' :
                                                color === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white' :
                                                color === 'green' ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white' :
                                                'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white'
                                            }`}
                                        >
                                            <div className="flex items-center justify-center gap-2">
                                                <span className="text-lg">{icon}</span>
                                                <span>{label}</span>
                                            </div>
                                            <div className="absolute inset-0 bg-white/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Joint Controls (only for humanoid robot) */}
                        {selectedRobotName === 'humanoid_robot' && availableJoints.length > 0 && (
                            <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                        Joint Controls
                                    </h3>
                                    <button
                                        onClick={resetAllJoints}
                                        className="px-3 py-1 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs rounded-lg transition-colors duration-200"
                                    >
                                        Reset All
                                    </button>
                                </div>
                                <div className="space-y-4 max-h-[400px] overflow-y-auto">
                                    {availableJoints.map(jointName => (
                                        <JointSlider
                                            key={jointName}
                                            jointName={jointName}
                                            value={jointValues[jointName] || 0}
                                            onChange={handleJointValueChange}
                                            min={-Math.PI}
                                            max={Math.PI}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Status Panel */}
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-white/50">
                            <h3 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                                Status
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Active Robot:</span>
                                    <span className="font-medium text-slate-800">
                                        {ROBOT_MODELS[selectedRobotName]?.name}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-600">Status:</span>
                                    <span className={`font-medium ${isLoadingModel ? 'text-yellow-600' : 'text-green-600'}`}>
                                        {isLoadingModel ? 'Loading...' : 'Active'}
                                    </span>
                                </div>
                                {selectedRobotName === 'humanoid_robot' && (
                                    <div className="flex justify-between">
                                        <span className="text-slate-600">Joints:</span>
                                        <span className="font-medium text-slate-800">
                                            {availableJoints.length}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 3D Viewport */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-4 shadow-2xl border border-white/50 h-[500px] sm:h-[600px] lg:h-[700px]">
                            <div className="h-full rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 shadow-inner">
                                <Canvas
                                    camera={{ fov: 50, near: 0.1, far: 2000 }}
                                    onCreated={({ camera }) => { cameraRef.current = camera; }}
                                    className="w-full h-full"
                                >
                                    {/* Enhanced Lighting */}
                                    <ambientLight intensity={0.6} />
                                    <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
                                    <directionalLight position={[-10, -10, -5]} intensity={0.6} />
                                    <pointLight position={[0, 10, 0]} intensity={0.8} />
                                    
                                    {/* Environment for realistic lighting and reflections */}
                                    <Environment preset="studio" />
                                    
                                    {/* Suspense to handle loading state of the URDF model */}
                                    <Suspense fallback={
                                        <Text 
                                            color="#3b82f6" 
                                            anchorX="center" 
                                            anchorY="middle"
                                            fontSize={1.5}
                                        >
                                            Loading Robot...
                                        </Text>
                                    }>
                                        <UrdfRobotModel
                                            jointStates={jointStates}
                                            onRobotLoaded={handleRobotLoaded}
                                            selectedRobotName={selectedRobotName}
                                            jointValues={jointValues}
                                        />
                                    </Suspense>
                                    
                                    {/* OrbitControls for interactive camera manipulation */}
                                    <OrbitControls 
                                        ref={orbitControlsRef}
                                        enableDamping
                                        dampingFactor={0.05}
                                        maxPolarAngle={Math.PI * 0.75}
                                        minDistance={5}
                                        maxDistance={100}
                                    />
                                </Canvas>
                            </div>
                        </div>
                    </div>
                </div>

              

                {/* Footer */}
                <div className="text-center mt-8 text-slate-500 text-sm">
                    <p>Use mouse to rotate, zoom, and pan the 3D viewport</p>
                </div>
            </div>

            {/* Custom CSS for slider styling */}
            <style>{` // Removed the 'jsx' attribute from here
                .slider::-webkit-slider-thumb {
                    appearance: none;
                    height: 16px;
                    width: 16px;
                    border-radius: 8px;
                    background: #3b82f6;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    border: 2px solid white;
                }
                
                .slider::-moz-range-thumb {
                    height: 16px;
                    width: 16px;
                    border-radius: 8px;
                    background: #3b82f6;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                    border: 2px solid white;
                }
            `}</style>
        </div>
    );
};

export default PhoneCam;