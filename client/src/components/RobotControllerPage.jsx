import React, { useState, useEffect } from 'react';

const RobotControllerPage = () => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [showWebcam, setShowWebcam] = useState(false);

  const RENDER_URL = "https://robot-controller-2.onrender.com";
  const PHONE_IP_CAM_URL = "http://192.0.0.4:8080/video";

  useEffect(() => {
    setIsMoving(true);
    saveCoordinates(0, 0);
  }, []);

  const saveCoordinates = async (x, y) => {
    try {
      await fetch(`${RENDER_URL}/set_coordinates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ x, y }),
      });
    } catch (error) {
      console.error("Failed to update coordinates on server:", error);
    }
  };

  const move = (dx, dy) => {
    if (isMoving) {
      const newX = coordinates.x + dx;
      const newY = coordinates.y + dy;
      setCoordinates({ x: newX, y: newY });
      saveCoordinates(newX, newY);
    }
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      switch (event.key.toLowerCase()) {
        case 'w':
        case 'arrowup':
          move(0, 1); break;
        case 's':
        case 'arrowdown':
          move(0, -1); break;
        case 'a':
        case 'arrowleft':
          move(-1, 0); break;
        case 'd':
        case 'arrowright':
          move(1, 0); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [coordinates, isMoving]);

  const buttonStyle = "w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold text-2xl rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 border-2 border-green-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-4xl">

        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Robot Controller
          </h1>
          <p className="text-gray-600">Control your robot remotely with precision</p>
        </div>

        {/* Status Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Robot Status</h2>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isMoving ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isMoving ? 'Active' : 'Inactive'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-800 mb-2">
              Coordinates: ({coordinates.x}, {coordinates.y})
            </div>
            <p className="text-gray-600">Use arrow keys or buttons to control</p>
          </div>
        </div>

        {/* Movement Controls */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 text-center mb-6">Movement Controls</h3>
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-4 w-fit">
              <div></div>
              <button onClick={() => move(0, 1)} className={buttonStyle}>▲</button>
              <div></div>
              <button onClick={() => move(-1, 0)} className={buttonStyle}>◀</button>
              <button onClick={() => move(0, -1)} className={buttonStyle}>▼</button>
              <button onClick={() => move(1, 0)} className={buttonStyle}>▶</button>
            </div>
          </div>
          <div className="text-center mt-6 text-gray-600">
            <p className="mb-2">Use keyboard shortcuts:</p>
            <div className="flex justify-center gap-4 text-sm">
              <span className="bg-gray-100 px-2 py-1 rounded">WASD</span>
              <span className="bg-gray-100 px-2 py-1 rounded">Arrow Keys</span>
            </div>
          </div>
        </div>

        {/* Webcam Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Live Camera Feed (Phone)</h3>
            <button
              onClick={() => setShowWebcam(!showWebcam)}
              className={`px-6 py-2 rounded-xl font-medium transition-all duration-200 ${
                showWebcam ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'
              } text-white`}
            >
              {showWebcam ? 'Hide Feed' : 'Show Feed'}
            </button>
          </div>

          {showWebcam && (
            <div className="text-center">
              <div className="relative inline-block">
                <img
                  src={PHONE_IP_CAM_URL}
                  alt="Mobile Camera Feed"
                  className="rounded-xl border-4 border-gray-300 shadow-lg mx-auto"
                  style={{ maxHeight: "400px", width: "100%" }}
                />
                <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  LIVE
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-3">How to Use</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Movement Controls:</h4>
              <ul className="space-y-1 opacity-90">
                <li>• Click directional buttons to move</li>
                <li>• Use WASD or arrow keys</li>
                <li>• Coordinates update in real-time</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Camera Feed:</h4>
              <ul className="space-y-1 opacity-90">
                <li>• Install IP Webcam app on phone</li>
                <li>• Start server and copy IP address</li>
                <li>• Replace IP in code with your phone IP</li>
                <li>• Click “Show Feed” to view camera</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RobotControllerPage;