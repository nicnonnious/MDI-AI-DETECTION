import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { standardCameras } from '../mockBackend';

const CameraViewContainer = styled.div`
  flex: 1;
  background-color: #000;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  min-height: 500px;
  display: flex;
  flex-wrap: wrap;
`;

const CameraGridCell = styled.div`
  flex: 0 0 ${props => {
    switch (props.layout) {
      case 'single': return '100%';
      case '2x2': return '50%';
      case '3x3': return '33.333%';
      default: return '100%';
    }
  }};
  height: ${props => {
    switch (props.layout) {
      case 'single': return '100%';
      case '2x2': return '50%';
      case '3x3': return '33.333%';
      default: return '100%';
    }
  }};
  padding: 2px;
  box-sizing: border-box;
  position: relative;
`;

const CameraImage = styled.div`
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  background-image: ${props => props.src && !props.isWebcam && !props.videoSrc ? `url(${props.src})` : 'none'};
  background-size: cover;
  background-position: center;
  position: relative;
  cursor: ${props => props.isZoomable ? 'pointer' : 'default'};
  transition: transform 0.2s ease, border 0.3s ease, box-shadow 0.3s ease;
  border: ${props => props.isSelected ? '4px solid #3498db' : 'none'};
  box-shadow: ${props => props.isSelected ? '0 0 20px rgba(52, 152, 219, 0.7)' : 'none'};
  
  &:hover {
    ${props => props.isZoomable && `
      transform: scale(1.01);
    `}
  }
`;

const CameraVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const EmptyCameraSlot = styled.div`
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 14px;
  position: relative;
`;

const AddCameraButton = styled.button`
  background-color: rgba(0, 0, 0, 0.4);
  color: white;
  border: 2px dashed #555;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 10px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(52, 152, 219, 0.3);
    border-color: #3498db;
  }
  
  .material-icons {
    font-size: 32px;
  }
`;

const CameraDropdown = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #222;
  border: 1px solid #444;
  border-radius: 5px;
  width: 80%;
  max-height: 80%;
  overflow-y: auto;
  z-index: 100;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const DropdownHeader = styled.div`
  padding: 10px 15px;
  background-color: #333;
  color: white;
  font-weight: bold;
  border-bottom: 1px solid #444;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DropdownList = styled.div`
  max-height: 300px;
  overflow-y: auto;
`;

const DropdownItem = styled.div`
  padding: 10px 15px;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  border-bottom: 1px solid #333;
  
  &:hover {
    background-color: #2c3e50;
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  .material-icons {
    font-size: 18px;
    color: ${props => props.isLive ? '#2ecc71' : '#e74c3c'};
  }
`;

const DropIndicator = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 3px dashed #3498db;
  background-color: rgba(52, 152, 219, 0.2);
  z-index: 5;
  display: ${props => props.isOver ? 'block' : 'none'};
  pointer-events: none;
`;

const WebcamVideo = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
`;

const CameraOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  color: white;
  z-index: 2;
`;

const CameraInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  width: 100%;
`;

const CameraName = styled.div`
  font-size: ${props => props.isSmall ? '14px' : '18px'};
  font-weight: bold;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
`;

const CameraDateTime = styled.div`
  font-family: monospace;
  font-size: ${props => props.isSmall ? '12px' : '18px'};
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.8);
`;

const DetectionMarker = styled.div`
  position: absolute;
  width: ${props => props.isSmall ? '30px' : '50px'};
  height: ${props => props.isSmall ? '30px' : '50px'};
  border: 2px solid ${props => {
    if (props.type === 'human') return '#2ecc71'; // Green for humans
    if (props.type === 'vehicle') return '#3498db'; // Blue for vehicles
    return props.status === 'confirmed' ? '#2ecc71' : '#e74c3c'; // Fallback colors
  }};
  border-radius: 5px;
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  transform: translate(-50%, -50%);
  z-index: 3;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => {
      if (props.type === 'human') return 'rgba(46, 204, 113, 0.3)'; // Green for humans
      if (props.type === 'vehicle') return 'rgba(52, 152, 219, 0.3)'; // Blue for vehicles
      return props.status === 'confirmed' ? 'rgba(46, 204, 113, 0.3)' : 'rgba(231, 76, 60, 0.3)'; // Fallback
    }};
  }
  
  &::after {
    content: '${props => props.label || props.type || props.status || ''}';
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background: ${props => {
      if (props.type === 'human') return '#2ecc71'; // Green for humans
      if (props.type === 'vehicle') return '#3498db'; // Blue for vehicles
      return props.status === 'confirmed' ? '#2ecc71' : '#e74c3c'; // Fallback
    }};
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: ${props => props.isSmall ? '10px' : '12px'};
    white-space: nowrap;
  }
`;

const LiveIndicator = styled.div`
  display: inline-block;
  background-color: #e74c3c;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: ${props => props.isSmall ? '10px' : '12px'};
  font-weight: bold;
  margin-left: 10px;
`;

const NoFeedMessage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #666;
  font-size: 14px;
  text-align: center;
`;

const CameraControls = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 5px;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s ease;
  
  ${CameraGridCell}:hover & {
    opacity: 1;
  }
`;

const CameraControlButton = styled.button`
  background-color: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
  }
`;

const SelectedCameraBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background: #3498db;
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  z-index: 10;
  opacity: 0.95;
  padding: 4px 10px 4px 8px;
  font-size: 12px;
  font-weight: bold;
  
  .material-icons {
    font-size: 14px;
    margin-right: 4px;
  }
  
  /* Make the badge more noticeable with a stronger pulsing animation */
  animation: pulse-badge 2s infinite;
  
  @keyframes pulse-badge {
    0% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0.8); }
    70% { box-shadow: 0 0 0 10px rgba(52, 152, 219, 0); }
    100% { box-shadow: 0 0 0 0 rgba(52, 152, 219, 0); }
  }
`;

const CameraView = ({
  activeDetections = [],
  layout = 'single',
  activeCamera = 1,
  onCameraFocus,
  isLive = true,
  isPlaying = true,
  playheadPosition = 30,
  cameraFilterMode = 'all',
  selectedCameras = []
}) => {
  const [cameraTime, setCameraTime] = useState(new Date());
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [draggedCamera, setDraggedCamera] = useState(null);
  const [dragOverPosition, setDragOverPosition] = useState(null);
  const [gridCameras, setGridCameras] = useState({});
  const [selectedPosition, setSelectedPosition] = useState(0);
  const webcamRefs = useRef({});
  
  // Add state for video references
  const videoRefs = useRef({});
  
  // Store current playhead position
  const [currentPlayheadPosition, setCurrentPlayheadPosition] = useState(playheadPosition);
  
  // Load camera data from localStorage
  const [storedCameras, setStoredCameras] = useState(() => {
    const savedCameras = localStorage.getItem('mdi_cameras');
    if (savedCameras) {
      try {
        const parsedCameras = JSON.parse(savedCameras);
        console.log('CameraView: Loaded cameras from localStorage:', parsedCameras.length);
        return parsedCameras;
      } catch (e) {
        console.error('Error parsing saved cameras:', e);
        console.log('CameraView: Falling back to standardized camera list');
        return standardCameras; // Fallback to standardized list
      }
    }
    console.log('CameraView: No cameras in localStorage, using standardized list');
    return standardCameras; // Use standardized list if nothing in localStorage
  });
  
  // Listen for changes to localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCameras = localStorage.getItem('mdi_cameras');
      if (savedCameras) {
        try {
          const parsedCameras = JSON.parse(savedCameras);
          console.log('CameraView: Storage event received, updating cameras:', parsedCameras.length);
          setStoredCameras(parsedCameras);
        } catch (e) {
          console.error('Error parsing saved cameras:', e);
        }
      }
    };
    
    // Set up event listeners
    window.addEventListener('storage', handleStorageChange);
    
    // Set up interval check for localStorage changes
    const interval = setInterval(() => {
      handleStorageChange();
    }, 2000); // Check every 2 seconds
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);
  
  // Get camera info by ID, using localStorage data if available
  const getCameraById = (cameraId) => {
    // First check localStorage cameras
    const storedCamera = storedCameras.find(c => c.id === cameraId);
    if (storedCamera) {
      // Create a formatted camera object with all needed properties
      return {
        ...storedCamera,
        isLive: storedCamera.isLive !== undefined ? storedCamera.isLive : true,
        isWebcam: storedCamera.isWebcam || false,
        // For RTSP cameras, use either rtsp_url or url field
        rtsp_url: storedCamera.rtsp_url || storedCamera.url,
        // Use existing videoSrc if provided, otherwise set a default for testing
        videoSrc: storedCamera.videoSrc || (storedCamera.type === 'test-video' ? storedCamera.url : `https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`),
        // Keep image source as fallback
        src: storedCamera.isWebcam ? null : `https://picsum.photos/seed/${cameraId}/800/600`
      };
    }
    
    // Fallback to the standard cameras
    const standardCamera = standardCameras.find(c => c.id === cameraId);
    if (standardCamera) {
      console.log(`CameraView: Using standardized camera for ID ${cameraId}`);
      return {
        ...standardCamera,
        src: standardCamera.isWebcam ? null : `https://picsum.photos/seed/${cameraId}/800/600`
      };
    }
    
    // Last resort fallback
    console.warn(`CameraView: No camera found for ID ${cameraId}, using fallback`);
    return { 
      id: cameraId, 
      name: `Camera ${cameraId}`, 
      isLive: true,
      isWebcam: cameraId === 10, // Special case for webcam
      videoSrc: `https://storage.googleapis.com/gtv-videos-bucket/sample/${cameraId % 2 === 0 ? 'ElephantsDream' : 'ForBiggerBlazes'}.mp4`,
      src: cameraId === 10 ? null : `https://picsum.photos/seed/${cameraId}/800/600`
    };
  };
  
  // Ensure we're using the complete standard cameras list
  const mockCameras = standardCameras;
  console.log('CameraView: Using standardized camera list with', mockCameras.length, 'cameras');
  
  // Create filtered camera list based on mode
  const filteredCameras = mockCameras.filter(camera => {
    if (cameraFilterMode === 'online') return camera.isLive;
    if (cameraFilterMode === 'offline') return !camera.isLive;
    return true; // 'all' mode
  });

  // Initialize grid cameras when layout or selectedCameras changes
  useEffect(() => {
    console.log("CameraView useEffect: Layout or cameras changed");
    console.log("Current selectedCameras:", selectedCameras);
    console.log("Current activeCamera:", activeCamera);
    
    // Initialize grid cameras based on the selected cameras and layout
    const newGridCameras = {};
    const totalCells = layout === 'single' ? 1 : layout === '2x2' ? 4 : 9;
    
    // Use selectedCameras to populate the grid
    if (selectedCameras && selectedCameras.length > 0) {
      // Fill grid positions with selected cameras, maintaining their original positions
      for (let i = 0; i < Math.min(totalCells, selectedCameras.length); i++) {
        newGridCameras[i] = selectedCameras[i];
      }
    } else {
      // Fallback to active camera if no selected cameras
      newGridCameras[0] = activeCamera;
    }
    
    // Set the grid cameras state
    setGridCameras(newGridCameras);
    
    // Find which position contains the active camera
    if (layout !== 'single') {
      console.log(`Looking for active camera ${activeCamera} position in grid`);
      
      // Search for the position of the active camera
      let foundPosition = -1;
      for (let pos = 0; pos < totalCells; pos++) {
        if (newGridCameras[pos] === activeCamera) {
          foundPosition = pos;
          break;
        }
      }
      
      if (foundPosition !== -1) {
        console.log(`Found active camera ${activeCamera} at position ${foundPosition}`);
        // Update the selected position to highlight this camera
        setSelectedPosition(foundPosition);
      } else {
        console.log(`Active camera ${activeCamera} not found in grid`);
        // Don't change grid cameras here; we'll let App.js handle adding the camera if needed
      }
    } else {
      // In single view, there's only position 0
      setSelectedPosition(0);
    }
  }, [layout, selectedCameras, activeCamera]);

  // Remove the second useEffect that was adding cameras at position 0
  // and replace it with one that just tracks activeCamera changes
  useEffect(() => {
    if (layout !== 'single') {
      console.log(`activeCamera changed to ${activeCamera}, updating highlighted position`);
      
      // Find which position has this camera
      const position = Object.entries(gridCameras)
        .find(([_, cameraId]) => cameraId === activeCamera)?.[0];
        
      if (position !== undefined) {
        console.log(`Found active camera at position ${position}, highlighting it`);
        setSelectedPosition(parseInt(position));
      }
    }
  }, [activeCamera, layout, gridCameras]);
  
  // Update the date time every second if live
  React.useEffect(() => {
    if (isLive) {
      const timer = setInterval(() => {
        setCameraTime(new Date());
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isLive]);

  // Handle webcam initialization
  useEffect(() => {
    // Check if we need to display the webcam (active in single mode or included in grid)
    const isWebcamVisible = Object.values(gridCameras).includes(10);
    
    const setupWebcam = async () => {
      try {
        if (isWebcamVisible && !webcamRefs.current.webcamStream) {
          const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 1280 },
              height: { ideal: 720 }
            } 
          });
          webcamRefs.current.webcamStream = stream;
        }
      } catch (err) {
        console.error("Error accessing webcam:", err);
      }
    };
    
    setupWebcam();
    
    // Cleanup on unmount
    return () => {
      if (webcamRefs.current.webcamStream) {
        webcamRefs.current.webcamStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [gridCameras]);
  
  // Connect webcam stream to video element when available
  useEffect(() => {
    if (webcamRefs.current.webcamRef && webcamRefs.current.webcamStream) {
      webcamRefs.current.webcamRef.srcObject = webcamRefs.current.webcamStream;
    }
  }, [webcamRefs.current.webcamStream]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen !== null && !event.target.closest('.camera-dropdown')) {
        setDropdownOpen(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen]);
  
  // Format date and time to match security camera format
  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
  };

  // Add new state for mock detections
  const [mockDetections, setMockDetections] = useState({});
  
  // Mock video durations for each camera (in minutes)
  const videoDurations = {
    1: 5,  // 5 minutes
    2: 8,
    3: 10,
    4: 6,
    5: 7,
    6: 9,
    7: 4,
    8: 11,
    9: 6,
    10: 5
  };
  
  // Function to generate random detections for a camera
  const generateMockDetections = (cameraId) => {
    const videoDuration = videoDurations[cameraId] || 5;
    const totalDetections = Math.floor(Math.random() * 8) + 3; // 3-10 detections
    
    const detections = [];
    for (let i = 0; i < totalDetections; i++) {
      // Generate random position within the camera view
      const x = Math.random() * 400 + 100; // 100-500px from left
      const y = Math.random() * 300 + 50;  // 50-350px from top
      
      // Random timestamp within the video duration
      const timestamp = Math.random() * videoDuration * 60; // in seconds
      const type = Math.random() > 0.5 ? 'human' : 'vehicle';
      
      detections.push({
        id: `${cameraId}-${i}`,
        cameraId,
        coordinates: { x, y },
        timestamp,
        type,
        status: Math.random() > 0.3 ? 'confirmed' : 'pending', // 70% confirmed, 30% pending
        confidence: Math.random() * 0.3 + 0.7 // 0.7-1.0 confidence
      });
    }
    
    return detections;
  };
  
  // Initialize mock detections on first render
  useEffect(() => {
    const allMockDetections = {};
    for (let i = 1; i <= 10; i++) {
      allMockDetections[i] = generateMockDetections(i);
    }
    setMockDetections(allMockDetections);
  }, []);

  // Update the getDetectionsForCamera function to use our mock data
  const getDetectionsForCamera = (cameraId) => {
    // If we have mock data for this camera, use it
    if (mockDetections[cameraId]) {
      // Filter to only show detections at the current playhead position
      // (In a real app, this would be more sophisticated based on timestamps)
      return mockDetections[cameraId];
    }
    
    // Fallback to using the activeDetections passed as prop
    return activeDetections.filter(d => d.id % mockCameras.length === cameraId % mockCameras.length);
  };
  
  // Adjust coordinates based on cell size for layouts
  const adjustCoordinates = (coords, isSmall) => {
    if (!isSmall) return coords;
    
    const scaleFactor = layout === '2x2' ? 0.5 : 0.33;
    return {
      x: coords.x * scaleFactor,
      y: coords.y * scaleFactor
    };
  };

  // Handle double-click on a camera to focus on it in single view mode
  const handleCameraDoubleClick = useCallback((camera) => {
    // Prevent multiple rapid executions
    if (window.lastDoubleClickTime && Date.now() - window.lastDoubleClickTime < 300) {
      return;
    }
    window.lastDoubleClickTime = Date.now();
    
    if (onCameraFocus) {
      if (layout === 'single') {
        // If we're already in single view, this is a request to go back to multi-view
        console.log(`Double-clicked on camera in single view, returning to multi-view layout`);
        onCameraFocus(camera.id, false); // Don't change layout via this call
        
        // Call the global toggle function
        if (window.toggleCameraLayout) {
          window.toggleCameraLayout();
        }
      } else {
        // Normal behavior - go to single view with this camera
        console.log(`Double-clicked on camera ${camera.id} in multi-view, switching to single view`);
        onCameraFocus(camera.id, true);
      }
    }
  }, [layout, onCameraFocus]);

  // Cleanup the lastDoubleClickTime when component unmounts
  useEffect(() => {
    return () => {
      delete window.lastDoubleClickTime;
    };
  }, []);

  // Handle fullscreen button click - same as double-click
  const handleFullscreenClick = useCallback((e, camera) => {
    e.stopPropagation(); // Prevent double-click event from firing
    
    // Prevent multiple rapid executions
    if (window.lastFullscreenClickTime && Date.now() - window.lastFullscreenClickTime < 300) {
      return;
    }
    window.lastFullscreenClickTime = Date.now();
    
    if (onCameraFocus) {
      if (layout === 'single') {
        // If we're already in single view, this is a request to go back to multi-view
        console.log(`Fullscreen button clicked in single view, returning to multi-view layout`);
        onCameraFocus(camera.id, false); // Don't change layout via this call
        
        // Call the global toggle function
        if (window.toggleCameraLayout) {
          window.toggleCameraLayout();
        }
      } else {
        // Normal behavior - go to single view with this camera
        console.log(`Fullscreen button clicked for camera ${camera.id}, switching to single view`);
        onCameraFocus(camera.id, true);
      }
    }
  }, [layout, onCameraFocus]);

  // Cleanup the lastFullscreenClickTime when component unmounts
  useEffect(() => {
    return () => {
      delete window.lastFullscreenClickTime;
    };
  }, []);
  
  // Toggle the camera selection dropdown for a specific grid position
  const toggleDropdown = (position, e) => {
    e.stopPropagation();
    if (dropdownOpen === position) {
      setDropdownOpen(null);
    } else {
      setDropdownOpen(position);
    }
  };
  
  // Handle when a camera is dropped or selected for a specific position in the grid
  const selectCameraForPosition = (position, cameraId) => {
    console.log(`Selecting camera ${cameraId} for position ${position}`);
    
    // IMPORTANT: First update the active camera to ensure it's selected immediately
    // Call onCameraFocus before changing our local state to avoid race conditions
    if (onCameraFocus) {
      console.log(`Immediately setting selected camera ${cameraId} as the active camera`);
      onCameraFocus(cameraId, false);
    }
    
    // Then update grid cameras - maintain positions in the grid
    const updatedCameras = { ...gridCameras, [position]: cameraId };
    setGridCameras(updatedCameras);
    
    // Update the selected position state for visual highlighting
    setSelectedPosition(position);
    
    // Force immediate video synchronization with timeline
    setTimeout(() => {
      console.log(`Synchronizing selected camera ${cameraId} with timeline state`);
      
      const videoEl = videoRefs.current[cameraId];
      if (videoEl) {
        try {
          // Apply current timeline position
          const duration = videoEl.duration || 300;
          const targetTime = (currentPlayheadPosition / 100) * duration;
          videoEl.currentTime = targetTime;
          
          // Apply play/pause state
          if (isPlaying) {
            videoEl.play().catch(e => console.error(`Error starting selected camera playback:`, e));
          } else {
            videoEl.pause();
          }
        } catch (err) {
          console.error(`Error synchronizing selected camera:`, err);
        }
      }
      
      // Re-assert the selected position to ensure it's properly highlighted
      if (position !== selectedPosition) {
        console.log(`Forcing selected position update to ${position}`);
        setSelectedPosition(position);
      }
    }, 50); // Shorter timeout for more immediate response
    
    // Close the dropdown after selection
    setDropdownOpen(null);
  };
  
  // Handle drag start from camera selector
  const handleDragStart = (event, camera) => {
    setDraggedCamera(camera);
    // Set data for external drag sources (like from CameraSelector)
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', JSON.stringify(camera));
    }
  };
  
  // Handle drag over
  const handleDragOver = (event, position) => {
    event.preventDefault();
    setDragOverPosition(position);
  };
  
  // Handle drag leave
  const handleDragLeave = () => {
    setDragOverPosition(null);
  };
  
  // Handle drop
  const handleDrop = (event, position) => {
    event.preventDefault();
    setDragOverPosition(null);
    
    let camera = draggedCamera;
    
    // If dragged from external source (CameraSelector)
    if (!camera && event.dataTransfer) {
      try {
        const data = event.dataTransfer.getData('text/plain');
        camera = JSON.parse(data);
        console.log(`Parsed camera data from drag event:`, camera);
      } catch (e) {
        console.error('Failed to parse dragged camera data:', e);
        return;
      }
    }
    
    if (camera) {
      console.log(`Camera ${camera.id} dropped at position ${position}`);
      
      // IMPORTANT: First update the active camera to ensure it's selected immediately
      // Call onCameraFocus before changing our local state to avoid race conditions
      if (onCameraFocus) {
        console.log(`Immediately setting dropped camera ${camera.id} as the active camera`);
        onCameraFocus(camera.id, false);
      }
      
      // Then update grid cameras for the position - this maintains positions
      const updatedCameras = { ...gridCameras, [position]: camera.id };
      setGridCameras(updatedCameras);
      setDraggedCamera(null);
      
      // Update the selected position to the dropped position
      setSelectedPosition(position);
      
      // Force immediate video synchronization with timeline
      // This is needed because the state updates might not have propagated yet
      setTimeout(() => {
        console.log(`Synchronizing dropped camera ${camera.id} with timeline state`);
        
        const videoEl = videoRefs.current[camera.id];
        if (videoEl) {
          try {
            // Apply current timeline position
            const duration = videoEl.duration || 300;
            const targetTime = (currentPlayheadPosition / 100) * duration;
            videoEl.currentTime = targetTime;
            
            // Apply play/pause state
            if (isPlaying) {
              videoEl.play().catch(e => console.error(`Error starting dropped camera playback:`, e));
            } else {
              videoEl.pause();
            }
          } catch (err) {
            console.error(`Error synchronizing dropped camera:`, err);
          }
        }
        
        // Re-assert the selected position to ensure it's properly highlighted
        if (position !== selectedPosition) {
          console.log(`Forcing selected position update to ${position}`);
          setSelectedPosition(position);
        }
      }, 50); // Shorter timeout for more immediate response
    }
  };
  
  // Special effect to immediately update newly added cameras with correct timeline state
  // This solves the issue where dragged cameras don't respond to timeline until clicked
  useEffect(() => {
    console.log("Grid cameras or active camera changed, checking for newly added videos");
    
    // Find video element for the active camera
    const activeCameraElement = videoRefs.current[activeCamera];
    
    if (activeCameraElement) {
      console.log(`Found video element for active camera ${activeCamera}, synchronizing with timeline...`);
      
      // Immediately apply current timeline position
      const videoDuration = activeCameraElement.duration || 300; // Default to 5 minutes if duration not available
      const targetTime = (currentPlayheadPosition / 100) * videoDuration;
      
      // Only seek if the difference is significant
      if (Math.abs(activeCameraElement.currentTime - targetTime) > 1) {
        console.log(`Setting active camera time to ${targetTime}s based on playhead position ${currentPlayheadPosition}%`);
        activeCameraElement.currentTime = targetTime;
      }
      
      // Apply current play/pause state
      if (isPlaying && activeCameraElement.paused) {
        console.log("Timeline is playing, playing active camera");
        activeCameraElement.play().catch(err => console.error("Error playing video:", err));
      } else if (!isPlaying && !activeCameraElement.paused) {
        console.log("Timeline is paused, pausing active camera");
        activeCameraElement.pause();
      }
    }
  }, [gridCameras, activeCamera, currentPlayheadPosition, isPlaying]);
  
  // Handle single click on a camera to make it the "selected" camera for the timeline
  const handleCameraClick = (camera, position, event) => {
    // Prevent event bubbling to avoid triggering other click events
    event.stopPropagation();
    
    console.log(`Camera ${camera.id} clicked at position ${position}`);
    
    // Update the selected position state immediately for visual feedback
    setSelectedPosition(position);
    
    // Call onCameraFocus with false to not change the layout
    if (onCameraFocus) {
      onCameraFocus(camera.id, false);
    }
  };
  
  // Handle changes to playhead position from props
  useEffect(() => {
    setCurrentPlayheadPosition(playheadPosition);
    
    // Only update the active camera's video position
    const activeCameraElement = videoRefs.current[activeCamera];
    
    if (activeCameraElement) {
      const videoDuration = activeCameraElement.duration || 300; // Default to 5 minutes if duration not available
      const targetTime = (playheadPosition / 100) * videoDuration;
      
      // Only seek if the difference is significant to avoid constant seeking
      if (Math.abs(activeCameraElement.currentTime - targetTime) > 1) {
        activeCameraElement.currentTime = targetTime;
      }
      
      // Handle play/pause state only for the active camera
      if (isPlaying && activeCameraElement.paused) {
        activeCameraElement.play().catch(err => console.error("Error playing video:", err));
      } else if (!isPlaying && !activeCameraElement.paused) {
        activeCameraElement.pause();
      }
    }
  }, [playheadPosition, isPlaying, activeCamera]);
  
  // Handle play/pause state changes
  useEffect(() => {
    // Only control the active camera
    const activeCameraElement = videoRefs.current[activeCamera];
    
    if (activeCameraElement) {
      if (isPlaying && activeCameraElement.paused) {
        activeCameraElement.play().catch(err => console.error("Error playing video:", err));
      } else if (!isPlaying && !activeCameraElement.paused) {
        activeCameraElement.pause();
      }
    }
  }, [isPlaying, activeCamera]);
  
  // Generate cell content
  const renderCellContent = (position) => {
    const camera = gridCameras[position] ? getCameraById(gridCameras[position]) : null;
    
    // If no camera is assigned to this position
    if (camera === null) {
      return (
        <EmptyCameraSlot
          onDragOver={(e) => handleDragOver(e, position)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, position)}
        >
          <DropIndicator isOver={dragOverPosition === position} />
          <AddCameraButton onClick={(e) => toggleDropdown(position, e)}>
            <span className="material-icons">add</span>
          </AddCameraButton>
          <div>Select Camera</div>
          
          <CameraDropdown isOpen={dropdownOpen === position} className="camera-dropdown">
            <DropdownHeader>
              <span>Select Camera</span>
              <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => setDropdownOpen(null)}>close</span>
            </DropdownHeader>
            <DropdownList>
              {filteredCameras.map(camera => (
                <DropdownItem 
                  key={camera.id} 
                  isLive={camera.isLive}
                  onClick={() => selectCameraForPosition(position, camera.id)}
                >
                  <span className="material-icons">{camera.isLive ? 'videocam' : 'videocam_off'}</span>
                  {camera.name}
                </DropdownItem>
              ))}
            </DropdownList>
          </CameraDropdown>
        </EmptyCameraSlot>
      );
    }
    
    return (
      <CameraImage 
        isZoomable={layout !== 'single'}
        isSelected={position === selectedPosition}
        onDoubleClick={() => handleCameraDoubleClick(camera)}
        onClick={(e) => layout !== 'single' && handleCameraClick(camera, position, e)}
        isWebcam={camera.isWebcam}
        src={camera.src}
        videoSrc={camera.videoSrc}
        onDragOver={(e) => handleDragOver(e, position)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, position)}
      >
        <DropIndicator isOver={dragOverPosition === position} />
        
        {/* Show badge on the selected camera - based on position */}
        {position === selectedPosition && layout !== 'single' && (
          <SelectedCameraBadge title="This camera is shown on the timeline">
            <span className="material-icons">timeline</span>
            Timeline Camera
          </SelectedCameraBadge>
        )}
        
        {camera.isWebcam && (
          <WebcamVideo 
            ref={(el) => {
              webcamRefs.current.webcamRef = el;
              webcamRefs.current.webcamStream = webcamRefs.current.webcamRef.srcObject;
            }} 
            autoPlay 
            playsInline 
            muted
          />
        )}
        
        {camera.videoSrc && !camera.isWebcam && (
          <CameraVideo
            key={`camera-${camera.id}-${camera.id === activeCamera ? 'active' : 'inactive'}`}
            ref={el => { videoRefs.current[camera.id] = el; }}
            src={camera.videoSrc}
            autoPlay={camera.id === activeCamera ? isPlaying : true}
            loop
            muted
            playsInline
            onLoadedMetadata={e => {
              // When video is loaded, set to correct position if it's the active camera
              const videoEl = e.target;
              console.log(`Video loaded for camera ${camera.id} (active: ${camera.id === activeCamera})`);
              
              if (camera.id === activeCamera) {
                // This is the active camera, sync with timeline position and play state
                console.log(`Setting active camera ${camera.id} initial position to ${currentPlayheadPosition}%`);
                const videoDuration = videoEl.duration || 300;
                const targetTime = (currentPlayheadPosition / 100) * videoDuration;
                
                // Set the current time to match the timeline
                videoEl.currentTime = targetTime;
                
                // Match the timeline's play/pause state
                if (isPlaying) {
                  console.log(`Starting playback for active camera ${camera.id}`);
                  videoEl.play().catch(err => console.error("Error playing video:", err));
                } else {
                  console.log(`Pausing active camera ${camera.id} to match timeline`);
                  videoEl.pause();
                }
              } else {
                // For non-active cameras, always play and don't sync with timeline
                console.log(`Starting playback for non-active camera ${camera.id}`);
                videoEl.play().catch(err => console.error("Error playing non-active camera:", err));
              }
            }}
            onPlay={() => console.log(`Camera ${camera.id} playback started`)}
            onPause={() => console.log(`Camera ${camera.id} playback paused`)}
            onError={(e) => console.error(`Error with camera ${camera.id} video:`, e)}
          />
        )}
        
        {getDetectionsForCamera(camera.id).map(detection => {
          const coords = adjustCoordinates(detection.coordinates, layout !== 'single');
          return (
            <DetectionMarker
              key={detection.id}
              x={coords.x}
              y={coords.y}
              status={detection.status}
              type={detection.type}
              label={detection.type === 'human' ? 'Person' : 'Vehicle'}
              isSmall={layout !== 'single'}
            />
          );
        })}
        
        <CameraOverlay>
          <CameraInfo>
            <CameraName isSmall={layout !== 'single'}>
              {camera.name}
              {camera.isLive && <LiveIndicator isSmall={layout !== 'single'}>LIVE</LiveIndicator>}
            </CameraName>
            <CameraDateTime isSmall={layout !== 'single'}>{formatDateTime(cameraTime)}</CameraDateTime>
          </CameraInfo>
        </CameraOverlay>
        
        {!camera.isLive && (
          <NoFeedMessage>No Live Feed Available</NoFeedMessage>
        )}
        
        <CameraControls>
          {layout !== 'single' && (
            <CameraControlButton 
              onClick={(e) => handleFullscreenClick(e, camera)}
              title="Switch to Single View"
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>fullscreen</span>
            </CameraControlButton>
          )}
          <CameraControlButton 
            onClick={(e) => toggleDropdown(position, e)}
            title="Change Camera"
          >
            <span className="material-icons" style={{ fontSize: '16px' }}>swap_horiz</span>
          </CameraControlButton>
        </CameraControls>
        
        <CameraDropdown isOpen={dropdownOpen === position} className="camera-dropdown">
          <DropdownHeader>
            <span>Select Camera</span>
            <span className="material-icons" style={{ cursor: 'pointer' }} onClick={() => setDropdownOpen(null)}>close</span>
          </DropdownHeader>
          <DropdownList>
            {filteredCameras.map(camera => (
              <DropdownItem 
                key={camera.id} 
                isLive={camera.isLive}
                onClick={() => selectCameraForPosition(position, camera.id)}
              >
                <span className="material-icons">{camera.isLive ? 'videocam' : 'videocam_off'}</span>
                {camera.name}
              </DropdownItem>
            ))}
          </DropdownList>
        </CameraDropdown>
      </CameraImage>
    );
  };
  
  // Generate grid cells
  const generateGridCells = () => {
    const cellCount = layout === 'single' ? 1 : layout === '2x2' ? 4 : 9;
    return Array.from({ length: cellCount }).map((_, index) => (
      <CameraGridCell key={index} layout={layout}>
        <DropIndicator isOver={dragOverPosition === index} />
        {renderCellContent(index)}
      </CameraGridCell>
    ));
  };
  
  return (
    <CameraViewContainer>
      {generateGridCells()}
    </CameraViewContainer>
  );
};

export default CameraView; 