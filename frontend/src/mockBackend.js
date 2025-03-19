// Mock backend data and functions
export const mockDetections = [
  {
    id: 1,
    timestamp: "2025-03-13T14:30:00",
    type: "person",
    confidence: 0.92,
    status: "confirmed",
    coordinates: { x: 450, y: 280 }
  },
  {
    id: 2,
    timestamp: "2025-03-13T14:35:00",
    type: "vehicle",
    confidence: 0.78,
    status: "suspicious",
    coordinates: { x: 320, y: 420 }
  },
  {
    id: 3,
    timestamp: "2025-03-13T14:40:00",
    type: "person",
    confidence: 0.85,
    status: "confirmed",
    coordinates: { x: 520, y: 350 }
  },
  {
    id: 4,
    timestamp: "2025-03-13T14:42:00",
    type: "vehicle",
    confidence: 0.91,
    status: "confirmed",
    coordinates: { x: 390, y: 410 }
  },
  {
    id: 5,
    timestamp: "2025-03-13T14:45:00",
    type: "person",
    confidence: 0.73,
    status: "suspicious",
    coordinates: { x: 220, y: 180 }
  },
  {
    id: 6,
    timestamp: "2025-03-13T14:47:00",
    type: "vehicle",
    confidence: 0.68,
    status: "suspicious",
    coordinates: { x: 480, y: 390 }
  }
];

// Mocked API functions
export const fetchDetections = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([...mockDetections]);
    }, 800); // Simulate network delay
  });
};

export const addDetection = (detection) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newId = Math.max(...mockDetections.map(d => d.id), 0) + 1;
      const newDetection = {
        ...detection,
        id: newId,
        timestamp: detection.timestamp || new Date().toISOString()
      };
      mockDetections.push(newDetection);
      resolve(newDetection);
    }, 800);
  });
};

export const deleteDetection = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockDetections.findIndex(d => d.id === id);
      if (index !== -1) {
        mockDetections.splice(index, 1);
      }
      resolve({ success: true });
    }, 800);
  });
};

// Standardized camera data for the entire application
export const standardCameras = [
  { id: 1, name: 'North Entrance', location: 'Building A', isLive: true, type: 'onvif', url: 'rtsp://192.168.1.100:554/cam/realmonitor', username: 'admin', password: '******', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', alertCount: 12 },
  { id: 2, name: 'Warehouse Floor', location: 'Building B', isLive: true, type: 'onvif', url: 'rtsp://192.168.1.101:554/cam/realmonitor', username: 'admin', password: '******', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', alertCount: 8 },
  { id: 3, name: 'Parking Lot A', location: 'Outdoor', isLive: true, type: 'rtsp', url: 'rtsp://192.168.1.102:554/cam/realmonitor', username: 'admin', password: '******', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', alertCount: 15 },
  { id: 4, name: 'Loading Dock', location: 'Building B', isLive: false, type: 'rtsp', url: 'rtsp://192.168.1.103:554/cam/realmonitor', username: 'admin', password: '******', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', alertCount: 3 },
  { id: 5, name: 'Office Entrance', location: 'Building A', isLive: true, type: 'onvif', url: 'rtsp://192.168.1.104:554/cam/realmonitor', username: 'admin', password: '******', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', alertCount: 6 },
  { id: 6, name: 'South Gate', location: 'Outdoor', isLive: true, type: 'ip', url: 'rtsp://192.168.1.105:554/cam/realmonitor', username: 'admin', password: '******', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', alertCount: 4 },
  { id: 7, name: 'East Wing', location: 'Building C', isLive: true, type: 'ip', url: 'rtsp://192.168.1.106:554/cam/realmonitor', username: 'admin', password: '******', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4', alertCount: 7 },
  { id: 8, name: 'West Wing', location: 'Building C', isLive: false, type: 'onvif', url: 'rtsp://192.168.1.107:554/cam/realmonitor', username: 'admin', password: '******', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', alertCount: 2 },
  { id: 9, name: 'Reception', location: 'Building A', isLive: true, type: 'ip', url: 'rtsp://192.168.1.108:554/cam/realmonitor', username: 'admin', password: '******', videoSrc: 'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4', alertCount: 5 },
  { id: 10, name: 'Laptop Webcam', location: 'Local Device', isLive: true, type: 'usb', isWebcam: true, url: '', username: '', password: '', alertCount: 0 }
];

// Pre-initialize localStorage with the standard cameras if not already set
// Or update localStorage to ensure all standard cameras are present
try {
  const savedCameras = localStorage.getItem('mdi_cameras');
  if (!savedCameras) {
    // No cameras in localStorage, initialize with standard cameras
    localStorage.setItem('mdi_cameras', JSON.stringify(standardCameras));
    console.log('Initialized localStorage with standard cameras');
  } else {
    // Cameras exist in localStorage, ensure all standard cameras are present
    let camerasArray = JSON.parse(savedCameras);
    let updated = false;
    
    // Check if all standard cameras exist in localStorage
    standardCameras.forEach(stdCamera => {
      const existingCamera = camerasArray.find(c => c.id === stdCamera.id);
      if (!existingCamera) {
        // Add missing camera
        camerasArray.push(stdCamera);
        updated = true;
      }
    });
    
    // Update localStorage if changes were made
    if (updated) {
      localStorage.setItem('mdi_cameras', JSON.stringify(camerasArray));
      console.log('Updated localStorage with missing standard cameras');
    }
  }
} catch (e) {
  console.error('Error handling camera localStorage:', e);
  // Reset to standard cameras if there's an error
  localStorage.setItem('mdi_cameras', JSON.stringify(standardCameras));
} 