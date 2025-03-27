import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
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
  layout = '3x3',
  activeCamera = 1,
  onCameraFocus,
  isLive = true,
  isPlaying = true,
  playheadPosition = 30,
  cameraFilterMode = 'all',
  selectedCameras = []
}) => {
  const [cameraPositions, setCameraPositions] = useState({});
  const [dropdownPosition, setDropdownPosition] = useState(null);
  const [draggedCamera, setDraggedCamera] = useState(null);
  const [dragOverPosition, setDragOverPosition] = useState(null);
  const dropdownRef = useRef(null);
  const videoRefs = useRef({});
  const webcamRefs = useRef({});
  const lastUpdateTime = useRef(Date.now());
  const pendingUpdates = useRef(new Set());
  const isTransitioning = useRef(false);
  const lastDoubleClickTimeRef = useRef(0);
  const transitionTimeoutRef = useRef(null);
  const videoLoadingRef = useRef({});
  const lastPlayheadUpdateRef = useRef(playheadPosition);
  
  const [gridCameras, setGridCameras] = useState({});
  const [selectedPosition, setSelectedPosition] = useState(0);
  const [cameraTime, setCameraTime] = useState(new Date());
  const [isDraggingCrop, setIsDraggingCrop] = useState(false);

  const throttledStateUpdate = useCallback((updateFn) => {
    const now = Date.now();
    if (now - lastUpdateTime.current > 50) { // 50ms throttle
      updateFn();
      lastUpdateTime.current = now;
      pendingUpdates.current.clear();
    } else {
      pendingUpdates.current.add(updateFn);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (pendingUpdates.current.size > 0) {
        const updates = Array.from(pendingUpdates.current);
        updates.forEach(update => update());
        pendingUpdates.current.clear();
        lastUpdateTime.current = Date.now();
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const safePlayVideo = async (videoElement) => {
    if (!videoElement) return;
    
    try {
      if (document.body.contains(videoElement)) {
        await videoElement.play();
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error playing video:', err);
      }
    }
  };

  useEffect(() => {
    if (!isPlaying || !activeCamera) return;

    const syncVideo = async () => {
      const video = videoRefs.current[activeCamera];
      if (!video) return;

      const videoDuration = video.duration || 300;
      const targetTime = (playheadPosition / 100) * videoDuration;
      
      if (Math.abs(video.currentTime - targetTime) > 0.5) {
        video.currentTime = targetTime;
      }

      if (isPlaying) {
        await safePlayVideo(video);
      }
    };

    syncVideo();
    const interval = setInterval(syncVideo, 1000);
    return () => clearInterval(interval);
  }, [activeCamera, isPlaying, playheadPosition]);

  useEffect(() => {
    const activeCameraElement = videoRefs.current[activeCamera];
    if (!activeCameraElement) return;

    let isMounted = true;

    const syncVideo = async () => {
      try {
        if (!isMounted || !document.body.contains(activeCameraElement)) return;

        const videoDuration = activeCameraElement.duration || 300;
        const targetTime = (playheadPosition / 100) * videoDuration;
        
        if (Math.abs(activeCameraElement.currentTime - targetTime) > 1) {
          activeCameraElement.currentTime = targetTime;
        }
        
        if (isPlaying && activeCameraElement.paused) {
          if (document.body.contains(activeCameraElement)) {
            await activeCameraElement.play();
          }
        } else if (!isPlaying && !activeCameraElement.paused) {
          activeCameraElement.pause();
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Video sync error:', err);
        }
      }
    };

    syncVideo();

    return () => {
      isMounted = false;
      if (activeCameraElement && document.body.contains(activeCameraElement)) {
        activeCameraElement.pause();
      }
    };
  }, [activeCamera, playheadPosition, isPlaying]);

  const handleVideoLoad = useCallback((videoElement, cameraId, isActive) => {
    if (!videoElement) return;
    
    let isMounted = true;

    const handleLoadedMetadata = async () => {
      try {
        if (!isMounted || !document.body.contains(videoElement)) return;

        if (isActive && !isLive) {
          // Only set currentTime if we have a valid duration
          if (videoElement.duration && isFinite(videoElement.duration)) {
            const videoTime = (playheadPosition / 100) * videoElement.duration;
            if (isFinite(videoTime)) {
              videoElement.currentTime = videoTime;
            }
          }
          
          if (isPlaying && document.body.contains(videoElement)) {
            await videoElement.play();
          }
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Video load error:', err);
        }
      }
    };

    videoElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    return () => {
      isMounted = false;
      if (document.body.contains(videoElement)) {
        videoElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
        videoElement.pause();
      }
    };
  }, [isPlaying, playheadPosition, isLive]);

  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      throttledStateUpdate(() => setCameraTime(new Date()));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [isPlaying, throttledStateUpdate]);

  const storedCameras = useMemo(() => {
    try {
      const savedCameras = localStorage.getItem('mdi_cameras');
      return savedCameras ? JSON.parse(savedCameras) : standardCameras;
    } catch (e) {
      console.error('Error parsing saved cameras:', e);
      return standardCameras;
    }
  }, []);

  const mockCameras = standardCameras;

  const getCameraById = useCallback((cameraId) => {
    return storedCameras.find(c => c.id === cameraId) || null;
  }, [storedCameras]);

  useEffect(() => {
    const totalCells = layout === 'single' ? 1 : layout === '2x2' ? 4 : 9;
    const newGridCameras = {};

    if (selectedCameras?.length > 0) {
      selectedCameras.slice(0, totalCells).forEach((cameraId, index) => {
        newGridCameras[index] = cameraId;
      });
    } else {
      newGridCameras[0] = activeCamera;
    }

    const newSelectedPosition = Object.entries(newGridCameras)
      .find(([_, id]) => id === activeCamera)?.[0] || 0;

    if (JSON.stringify(gridCameras) !== JSON.stringify(newGridCameras)) {
      setGridCameras(newGridCameras);
    }
    if (selectedPosition !== newSelectedPosition) {
      setSelectedPosition(newSelectedPosition);
    }
  }, [layout, selectedCameras, activeCamera]);

  const filteredCameras = useMemo(() => {
    return standardCameras.filter(camera => {
      if (cameraFilterMode === 'online') return camera.isLive;
      if (cameraFilterMode === 'offline') return !camera.isLive;
      return true;
    });
  }, [cameraFilterMode]);

  useEffect(() => {
    if (isLive) {
      const timer = setInterval(() => {
        setCameraTime(new Date());
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [isLive]);

  useEffect(() => {
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
    
    return () => {
      if (webcamRefs.current.webcamStream) {
        webcamRefs.current.webcamStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [gridCameras]);
  
  useEffect(() => {
    if (webcamRefs.current.webcamRef && webcamRefs.current.webcamStream) {
      webcamRefs.current.webcamRef.srcObject = webcamRefs.current.webcamStream;
    }
  }, [webcamRefs.current.webcamStream]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownPosition !== null && !event.target.closest('.camera-dropdown')) {
        setDropdownPosition(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownPosition]);
  
  const formatDateTime = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${month}-${day}-${year} ${hours}:${minutes}:${seconds}`;
  };

  const [mockDetections, setMockDetections] = useState({});
  
  const videoDurations = {
    1: 5,  
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
  
  const generateMockDetections = useCallback((cameraId) => {
    const videoDuration = videoDurations[cameraId] || 5;
    const totalDetections = Math.floor(Math.random() * 8) + 3;
    
    const detections = [];
    for (let i = 0; i < totalDetections; i++) {
      const x = Math.random() * 400 + 100;
      const y = Math.random() * 300 + 50;  
      
      const timestamp = Math.random() * videoDuration * 60;
      const type = Math.random() > 0.5 ? 'human' : 'vehicle';
      
      detections.push({
        id: `${cameraId}-${i}`,
        cameraId,
        coordinates: { x, y },
        timestamp,
        type,
        status: Math.random() > 0.3 ? 'confirmed' : 'pending',
        confidence: Math.random() * 0.3 + 0.7
      });
    }
    
    return detections;
  }, []);
  
  useEffect(() => {
    const allMockDetections = {};
    for (let i = 1; i <= 10; i++) {
      allMockDetections[i] = generateMockDetections(i);
    }
    setMockDetections(allMockDetections);
  }, [generateMockDetections]);

  const getDetectionsForCamera = (cameraId) => {
    if (mockDetections[cameraId]) {
      return mockDetections[cameraId];
    }
    
    return activeDetections.filter(d => d.id % mockCameras.length === cameraId % mockCameras.length);
  };
  
  const adjustCoordinates = (coords, isSmall) => {
    if (!isSmall) return coords;
    
    const scaleFactor = layout === '2x2' ? 0.5 : 0.33;
    return {
      x: coords.x * scaleFactor,
      y: coords.y * scaleFactor
    };
  };

  const handleCameraDoubleClick = useCallback((camera) => {
    if (isTransitioning.current) {
      console.log('Layout transition in progress, ignoring double-click');
      return;
    }

    const now = Date.now();
    if (now - lastDoubleClickTimeRef.current < 300) {
      return;
    }
    lastDoubleClickTimeRef.current = now;
    
    if (onCameraFocus) {
      isTransitioning.current = true;
      
      if (layout === 'single') {
        console.log('Double-clicked in single view, transitioning to multi-view');
        
        Object.entries(videoRefs.current).forEach(([id, videoEl]) => {
          if (videoEl) {
            try {
              videoEl.pause();
              videoEl.src = '';
              videoEl.load();
              delete videoRefs.current[id];
            } catch (err) {
              console.error(`Error cleaning up video ${id}:`, err);
            }
          }
        });

        onCameraFocus(camera.id, false);
        
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
        
        transitionTimeoutRef.current = setTimeout(() => {
          if (window.toggleCameraLayout) {
            window.toggleCameraLayout();
          }
          isTransitioning.current = false;
        }, 100);
        
      } else {
        console.log(`Double-clicked on camera ${camera.id}, transitioning to single view`);
        
        Object.entries(videoRefs.current).forEach(([id, videoEl]) => {
          if (videoEl && parseInt(id) !== camera.id) {
            try {
              videoEl.pause();
              videoEl.src = '';
              videoEl.load();
              delete videoRefs.current[id];
            } catch (err) {
              console.error(`Error cleaning up video ${id}:`, err);
            }
          }
        });
        
        onCameraFocus(camera.id, true);
        
        if (transitionTimeoutRef.current) {
          clearTimeout(transitionTimeoutRef.current);
        }
        
        transitionTimeoutRef.current = setTimeout(() => {
          isTransitioning.current = false;
        }, 100);
      }
    }
  }, [layout, onCameraFocus]);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
      
      Object.entries(videoRefs.current).forEach(([id, videoEl]) => {
        if (videoEl) {
          try {
            videoEl.pause();
            videoEl.src = '';
            videoEl.load();
          } catch (err) {
            console.error(`Error cleaning up video ${id}:`, err);
          }
        }
      });
      
      videoRefs.current = {};
      webcamRefs.current = {};
      isTransitioning.current = false;
      lastDoubleClickTimeRef.current = 0;
      transitionTimeoutRef.current = null;
      videoLoadingRef.current = {};
      lastPlayheadUpdateRef.current = 0;
    };
  }, []);

  useEffect(() => {
    console.log(`Layout changed to ${layout}`);
    
    Object.entries(videoRefs.current).forEach(([id, videoEl]) => {
      const isVideoNeeded = Object.values(gridCameras).includes(parseInt(id));
      if (videoEl && !isVideoNeeded) {
        try {
          console.log(`Cleaning up unused video ${id}`);
          videoEl.pause();
          videoEl.src = '';
          videoEl.load();
          delete videoRefs.current[id];
        } catch (err) {
          console.error(`Error cleaning up video ${id}:`, err);
        }
      }
    });
  }, [layout, gridCameras]);

  const handleFullscreenClick = useCallback((e, camera) => {
    e.stopPropagation();
    
    if (window.lastFullscreenClickTime && Date.now() - window.lastFullscreenClickTime < 300) {
      return;
    }
    window.lastFullscreenClickTime = Date.now();
    
    if (onCameraFocus) {
      if (layout === 'single') {
        console.log(`Fullscreen button clicked in single view, returning to multi-view layout`);
        onCameraFocus(camera.id, false);
        
        if (window.toggleCameraLayout) {
          window.toggleCameraLayout();
        }
      } else {
        console.log(`Fullscreen button clicked for camera ${camera.id}, switching to single view`);
        onCameraFocus(camera.id, true);
      }
    }
  }, [layout, onCameraFocus]);

  useEffect(() => {
    return () => {
      delete window.lastFullscreenClickTime;
    };
  }, []);
  
  const toggleDropdown = (position, e) => {
    e.stopPropagation();
    if (dropdownPosition === position) {
      setDropdownPosition(null);
    } else {
      setDropdownPosition(position);
    }
  };
  
  const selectCameraForPosition = (position, cameraId) => {
    console.log(`Selecting camera ${cameraId} for position ${position}`);
    
    if (onCameraFocus) {
      console.log(`Immediately setting selected camera ${cameraId} as the active camera`);
      onCameraFocus(cameraId, false);
    }
    
    const updatedCameras = { ...gridCameras, [position]: cameraId };
    setGridCameras(updatedCameras);
    
    setSelectedPosition(position);
    
    setTimeout(() => {
      console.log(`Synchronizing selected camera ${cameraId} with timeline state`);
      
      const videoEl = videoRefs.current[cameraId];
      if (videoEl) {
        try {
          const duration = videoEl.duration || 300;
          const targetTime = (playheadPosition / 100) * duration;
          videoEl.currentTime = targetTime;
          
          if (isPlaying) {
            videoEl.play().catch(e => console.error(`Error starting selected camera playback:`, e));
          } else {
            videoEl.pause();
          }
        } catch (err) {
          console.error(`Error synchronizing selected camera:`, err);
        }
      }
      
      if (position !== selectedPosition) {
        console.log(`Forcing selected position update to ${position}`);
        setSelectedPosition(position);
      }
    }, 50);
    
    setDropdownPosition(null);
  };
  
  const handleDragStart = (event, camera) => {
    setDraggedCamera(camera);
    if (event.dataTransfer) {
      event.dataTransfer.setData('text/plain', JSON.stringify(camera));
    }
  };
  
  const handleDragOver = (event, position) => {
    event.preventDefault();
    setDragOverPosition(position);
  };
  
  const handleDragLeave = () => {
    setDragOverPosition(null);
  };
  
  const handleDrop = (event, position) => {
    event.preventDefault();
    setDragOverPosition(null);
    
    let camera = draggedCamera;
    
    if (!camera && event.dataTransfer) {
      try {
        const data = event.dataTransfer.getData('application/json');
        if (data) {
          camera = JSON.parse(data);
        } else {
          const textData = event.dataTransfer.getData('text/plain');
          if (textData) {
            camera = JSON.parse(textData);
          }
        }
        
        if (!camera) {
          const cameraId = parseInt(event.dataTransfer.getData('camera/id'));
          if (!isNaN(cameraId)) {
            camera = getCameraById(cameraId);
          }
        }
        
        if (!camera) {
          console.error('No valid camera data found in drop event');
          return;
        }
        
        console.log(`Parsed camera data from drag event:`, camera);
      } catch (e) {
        console.error('Failed to parse dragged camera data:', e);
        
        try {
          const cameraId = parseInt(event.dataTransfer.getData('camera/id'));
          if (!isNaN(cameraId)) {
            camera = getCameraById(cameraId);
          }
        } catch (e2) {
          console.error('Failed to recover camera data:', e2);
          return;
        }
      }
    }
    
    if (camera) {
      console.log(`Camera ${camera.id} dropped at position ${position}`);
      
      if (onCameraFocus) {
        console.log(`Immediately setting dropped camera ${camera.id} as the active camera`);
        onCameraFocus(camera.id, false);
      }
      
      const updatedCameras = { ...gridCameras, [position]: camera.id };
      setGridCameras(updatedCameras);
      setDraggedCamera(null);
      
      setSelectedPosition(position);
      
      setTimeout(() => {
        console.log(`Synchronizing dropped camera ${camera.id} with timeline state`);
        
        const videoEl = videoRefs.current[camera.id];
        if (videoEl) {
          try {
            const duration = videoEl.duration || 300;
            const targetTime = (playheadPosition / 100) * duration;
            videoEl.currentTime = targetTime;
            
            if (isPlaying) {
              videoEl.play().catch(e => console.error(`Error starting dropped camera playback:`, e));
            } else {
              videoEl.pause();
            }
          } catch (err) {
            console.error(`Error synchronizing dropped camera:`, err);
          }
        }
        
        if (position !== selectedPosition) {
          console.log(`Forcing selected position update to ${position}`);
          setSelectedPosition(position);
        }
      }, 50);
    }
  };
  
  const handleCameraClick = (camera, position, event) => {
    event.stopPropagation();
    
    console.log(`Camera ${camera.id} clicked at position ${position}`);
    
    setSelectedPosition(position);
    
    if (onCameraFocus) {
      onCameraFocus(camera.id, false);
    }
  };
  
  const renderCellContent = useCallback((position) => {
    const camera = gridCameras[position] ? getCameraById(gridCameras[position]) : null;
    
    if (!camera) {
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
          
          <CameraDropdown isOpen={dropdownPosition === position} className="camera-dropdown">
            <DropdownHeader>
              <span>Select Camera</span>
              <span 
                className="material-icons" 
                style={{ cursor: 'pointer' }} 
                onClick={() => setDropdownPosition(null)}
              >
                close
              </span>
            </DropdownHeader>
            <DropdownList>
              {filteredCameras.map(camera => (
                <DropdownItem 
                  key={camera.id} 
                  isLive={camera.isLive}
                  onClick={() => selectCameraForPosition(position, camera.id)}
                >
                  <span className="material-icons">
                    {camera.isLive ? 'videocam' : 'videocam_off'}
                  </span>
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
        
        {position === selectedPosition && layout !== 'single' && (
          <SelectedCameraBadge title="This camera is shown on the timeline">
            <span className="material-icons">timeline</span>
            Timeline Camera
          </SelectedCameraBadge>
        )}
        
        {camera.isWebcam ? (
          <WebcamVideo 
            ref={(el) => {
              if (el) {
                webcamRefs.current.webcamRef = el;
                if (!el.srcObject) {
                  el.srcObject = webcamRefs.current.webcamStream;
                }
              }
            }} 
            autoPlay 
            playsInline 
            muted
          />
        ) : camera.videoSrc && (
          <CameraVideo
            key={`camera-${camera.id}-${isPlaying}-${playheadPosition}`}
            ref={el => {
              if (el) {
                videoRefs.current[camera.id] = el;
                handleVideoLoad(el, camera.id, camera.id === activeCamera);
              }
            }}
            src={camera.videoSrc}
            autoPlay={camera.id === activeCamera ? isPlaying : false}
            loop
            muted
            playsInline
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
            <CameraDateTime isSmall={layout !== 'single'}>
              {formatDateTime(cameraTime)}
            </CameraDateTime>
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
              <span className="material-icons" style={{ fontSize: '16px' }}>
                fullscreen
              </span>
            </CameraControlButton>
          )}
          <CameraControlButton 
            onClick={(e) => toggleDropdown(position, e)}
            title="Change Camera"
          >
            <span className="material-icons" style={{ fontSize: '16px' }}>
              swap_horiz
            </span>
          </CameraControlButton>
        </CameraControls>
        
        <CameraDropdown isOpen={dropdownPosition === position} className="camera-dropdown">
          <DropdownHeader>
            <span>Select Camera</span>
            <span 
              className="material-icons" 
              style={{ cursor: 'pointer' }} 
              onClick={() => setDropdownPosition(null)}
            >
              close
            </span>
          </DropdownHeader>
          <DropdownList>
            {filteredCameras.map(camera => (
              <DropdownItem 
                key={camera.id} 
                isLive={camera.isLive}
                onClick={() => selectCameraForPosition(position, camera.id)}
              >
                <span className="material-icons">
                  {camera.isLive ? 'videocam' : 'videocam_off'}
                </span>
                {camera.name}
              </DropdownItem>
            ))}
          </DropdownList>
        </CameraDropdown>
      </CameraImage>
    );
  }, [
    layout,
    selectedPosition,
    dragOverPosition,
    dropdownPosition,
    filteredCameras,
    activeCamera,
    isPlaying,
    playheadPosition,
    cameraTime,
    handleVideoLoad,
    handleCameraDoubleClick,
    handleCameraClick,
    handleFullscreenClick,
    toggleDropdown,
    selectCameraForPosition,
    getCameraById,
    gridCameras
  ]);

  const gridCells = useMemo(() => {
    const cellCount = layout === 'single' ? 1 : layout === '2x2' ? 4 : 9;
    return Array.from({ length: cellCount }).map((_, index) => (
      <CameraGridCell key={index} layout={layout}>
        {renderCellContent(index)}
      </CameraGridCell>
    ));
  }, [layout, renderCellContent]);

  useEffect(() => {
    if (isLive) {
      // In live mode, ensure all videos are playing at real-time
      Object.values(videoRefs.current).forEach(videoRef => {
        if (videoRef && videoRef.videoElement) {
          const video = videoRef.videoElement;
          if (video.paused) {
            video.play().catch(err => console.warn('Failed to play video:', err));
          }
          video.playbackRate = 1.0;
          
          // For live streams, ensure we're using the stream
          if (videoRef.stream) {
            if (video.srcObject !== videoRef.stream) {
              video.srcObject = videoRef.stream;
            }
          }
          // For recorded videos in live mode, try to sync to current time
          else if (video.duration) {
            const now = new Date();
            const midnight = new Date(now);
            midnight.setHours(0, 0, 0, 0);
            const secondsSinceMidnight = (now - midnight) / 1000;
            const videoTime = (secondsSinceMidnight % video.duration);
            
            if (Math.abs(video.currentTime - videoTime) > 0.5) {
              video.currentTime = videoTime;
            }
          }
        }
      });
    } else {
      // In playback mode, sync all videos to the timeline position
      Object.values(videoRefs.current).forEach(videoRef => {
        if (videoRef && videoRef.videoElement) {
          const video = videoRef.videoElement;
          if (!video.duration) return; // Skip if duration is not available yet
          
          // Convert playhead percentage to video time
          const videoTime = (playheadPosition / 100) * video.duration;
          
          if (Math.abs(video.currentTime - videoTime) > 0.5) {
            video.currentTime = videoTime;
          }
          
          if (isPlaying && video.paused) {
            video.play().catch(err => console.warn('Failed to play video:', err));
          } else if (!isPlaying && !video.paused) {
            video.pause();
          }
        }
      });
    }
  }, [isLive, isPlaying, playheadPosition]);

  return (
    <CameraViewContainer>
      {gridCells}
      {dropdownPosition && (
        <CameraDropdown
          ref={dropdownRef}
          isOpen={!!dropdownPosition}
          style={{
            top: dropdownPosition?.y || '50%',
            left: dropdownPosition?.x || '50%'
          }}
        >
          <DropdownHeader>
            Select Camera
            <span 
              className="material-icons" 
              style={{ cursor: 'pointer' }}
              onClick={() => setDropdownPosition(null)}
            >
              close
            </span>
          </DropdownHeader>
          <DropdownList>
            {standardCameras.map(camera => (
              <DropdownItem
                key={camera.id}
                onClick={() => {
                  selectCameraForPosition(dropdownPosition.position, camera.id);
                  setDropdownPosition(null);
                }}
                isLive={isLive}
              >
                <span className="material-icons">
                  {isLive ? 'videocam' : 'history'}
                </span>
                {camera.name}
              </DropdownItem>
            ))}
          </DropdownList>
        </CameraDropdown>
      )}
    </CameraViewContainer>
  );
};

export default React.memo(CameraView); 