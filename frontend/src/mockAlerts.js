// Mock alerts data
export const mockAlerts = [
  {
    id: 1,
    timestamp: "2025-03-13T14:22:10",
    cameraId: 1,
    type: "person",
    severity: "high", // red
    description: "Unauthorized person detected in restricted area",
    status: "unresolved",
    imageSnapshot: "https://images.unsplash.com/photo-1504593811423-6dd665756598?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=120",
    videoClip: "https://example.com/clips/alert1.mp4",
    boundingBox: { x: 120, y: 60, width: 80, height: 160 }
  },
  {
    id: 2,
    timestamp: "2025-03-13T14:25:33",
    cameraId: 1,
    type: "gun",
    severity: "critical", // red
    description: "Potential weapon detected at north entrance",
    status: "unresolved",
    imageSnapshot: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=120",
    videoClip: "https://example.com/clips/alert2.mp4",
    boundingBox: { x: 150, y: 80, width: 60, height: 40 }
  },
  {
    id: 3,
    timestamp: "2025-03-13T14:30:15",
    cameraId: 2,
    type: "vehicle",
    severity: "medium", // yellow
    description: "Unregistered vehicle in loading area",
    status: "resolved",
    imageSnapshot: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=120",
    videoClip: "https://example.com/clips/alert3.mp4",
    boundingBox: { x: 40, y: 60, width: 160, height: 90 }
  },
  {
    id: 4,
    timestamp: "2025-03-13T14:32:45",
    cameraId: 3,
    type: "license_plate",
    severity: "low", // blue
    description: "Unrecognized license plate PA-523-XYZ",
    status: "resolved",
    imageSnapshot: "https://images.unsplash.com/photo-1580274455191-1c62238fa333?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=120",
    videoClip: "https://example.com/clips/alert4.mp4",
    boundingBox: { x: 80, y: 70, width: 100, height: 40 }
  },
  {
    id: 5,
    timestamp: "2025-03-13T14:36:20",
    cameraId: 1,
    type: "phone",
    severity: "info", // green
    description: "Cell phone usage detected in secure area",
    status: "unresolved",
    imageSnapshot: "https://images.unsplash.com/photo-1570891836654-d4961a7b6929?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=120",
    videoClip: "https://example.com/clips/alert5.mp4",
    boundingBox: { x: 100, y: 60, width: 40, height: 70 }
  },
  {
    id: 6,
    timestamp: "2025-03-13T14:40:05",
    cameraId: 4,
    type: "person",
    severity: "high", // red
    description: "Multiple people in restricted zone",
    status: "unresolved",
    imageSnapshot: "https://images.unsplash.com/photo-1542909168-82c3e7fdca5c?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=120",
    videoClip: "https://example.com/clips/alert6.mp4",
    boundingBox: { x: 80, y: 40, width: 120, height: 180 }
  },
  {
    id: 7,
    timestamp: "2025-03-13T14:41:30",
    cameraId: 5,
    type: "gun",
    severity: "critical", // red
    description: "Potential weapon detected at office entrance",
    status: "unresolved",
    imageSnapshot: "https://images.unsplash.com/photo-1522735338363-cc7313be0ae0?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=120",
    videoClip: "https://example.com/clips/alert7.mp4",
    boundingBox: { x: 130, y: 70, width: 50, height: 40 }
  },
  {
    id: 8,
    timestamp: "2025-03-13T14:42:12",
    cameraId: 6,
    type: "phone",
    severity: "info", // green
    description: "Prohibited device detected",
    status: "resolved",
    imageSnapshot: "https://images.unsplash.com/photo-1523206489230-c012c64b2b48?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=120",
    videoClip: "https://example.com/clips/alert8.mp4",
    boundingBox: { x: 90, y: 60, width: 30, height: 60 }
  },
  {
    id: 9,
    timestamp: "2025-03-13T14:43:55",
    cameraId: 1,
    type: "license_plate",
    severity: "medium", // yellow
    description: "Flagged license plate TX-889-ABC",
    status: "unresolved",
    imageSnapshot: "https://images.unsplash.com/photo-1535461461742-47fc554004c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=120",
    videoClip: "https://example.com/clips/alert9.mp4",
    boundingBox: { x: 70, y: 80, width: 90, height: 30 }
  },
  {
    id: 10,
    timestamp: "2025-03-13T14:45:20",
    cameraId: 2,
    type: "vehicle",
    severity: "high", // red
    description: "Unauthorized vehicle in secure parking",
    status: "unresolved",
    imageSnapshot: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=120",
    videoClip: "https://example.com/clips/alert10.mp4",
    boundingBox: { x: 60, y: 50, width: 140, height: 80 }
  },
  {
    id: 11,
    timestamp: "2025-03-13T14:46:10",
    cameraId: 3,
    type: "person",
    severity: "low", // blue
    description: "Person lingering in parking lot",
    status: "resolved",
    imageSnapshot: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=120",
    videoClip: "https://example.com/clips/alert11.mp4",
    boundingBox: { x: 100, y: 50, width: 70, height: 150 }
  },
  {
    id: 12,
    timestamp: "2025-03-13T14:47:30",
    cameraId: 1,
    type: "gun",
    severity: "critical", // red
    description: "Weapon detected at north entrance",
    status: "unresolved",
    imageSnapshot: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&h=120",
    videoClip: "https://example.com/clips/alert12.mp4",
    boundingBox: { x: 140, y: 70, width: 50, height: 35 }
  }
];

// Map of severity levels to colors
export const severityColors = {
  "critical": "#e74c3c", // red
  "high": "#e74c3c", // red
  "medium": "#f39c12", // yellow
  "low": "#3498db", // blue
  "info": "#2ecc71", // green
};

// For the black filter, we might want to use unresolved vs resolved
export const alertStatusColors = {
  "unresolved": "#333", // black
  "resolved": "#95a5a6", // gray
};

// Alert type icons (emoji placeholders - would be replaced with actual SVG icons)
export const alertTypeIcons = {
  "person": "👤",
  "vehicle": "🚗",
  "gun": "🔫",
  "phone": "📱",
  "license_plate": "🔢",
};

// API functions
export const fetchAlerts = (cameraId = null) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let alerts = [...mockAlerts];
      if (cameraId) {
        alerts = alerts.filter(alert => alert.cameraId === cameraId);
      }
      resolve(alerts);
    }, 500); // simulate network delay
  });
};

export const markAlertResolved = (alertId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const alertIndex = mockAlerts.findIndex(a => a.id === alertId);
      if (alertIndex !== -1) {
        mockAlerts[alertIndex].status = "resolved";
      }
      resolve({ success: true });
    }, 300);
  });
}; 