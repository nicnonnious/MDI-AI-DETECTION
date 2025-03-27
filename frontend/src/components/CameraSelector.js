import React, { useEffect, useCallback, useMemo, useState, useRef } from 'react';
import styled from 'styled-components';
import { standardCameras } from '../mockBackend';

const SidebarContainer = styled.div`
  width: 260px;
  background-color: #1e1e1e;
  border-left: 1px solid #333;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  transition: all 0.3s ease;
  z-index: 100;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  color: white;
  border-bottom: 1px solid #333;
  background-color: #1e1e1e;
`;

const HeaderControls = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ControlButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .material-icons {
    font-size: 18px;
  }
`;

const SidebarTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: 500;
`;

const SearchInput = styled.div`
  position: relative;
  padding: 10px 15px;
  border-bottom: 1px solid #333;
  
  input {
    width: 100%;
    padding: 8px 10px;
    background-color: #2c2c2c;
    border: 1px solid #444;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #3498db;
    }
    
    &::placeholder {
      color: #999;
    }
  }
`;

const CameraList = styled.div`
  flex: 1;
  overflow-y: auto;
`;

const CameraItem = styled.div`
  padding: 10px 15px;
  border-bottom: 1px solid #333;
  color: ${props => props.active ? 'white' : '#aaa'};
  background-color: ${props => props.active ? '#2c3e50' : 'transparent'};
  cursor: ${props => props.isDragging ? 'grabbing' : 'grab'};
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition: background-color 0.2s;
  opacity: ${props => props.isDragging ? 0.5 : 1};
  
  &:hover {
    background-color: ${props => props.active ? '#2c3e50' : '#2c2c2c'};
  }
`;

const CameraThumb = styled.div`
  width: 100%;
  height: 100px;
  background-color: #151515;
  border-radius: 4px;
  background-image: ${props => props.image && !props.videoSrc ? `url(${props.image})` : 'linear-gradient(45deg, #1a1a1a 25%, transparent 25%, transparent 50%, #1a1a1a 50%, #1a1a1a 75%, transparent 75%, transparent)'};
  background-size: ${props => props.image && !props.videoSrc ? 'cover' : '20px 20px'};
  background-position: center;
  position: relative;
  overflow: hidden;
`;

const VideoThumb = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 4px;
`;

const LiveBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #e74c3c;
  color: white;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 10px;
  font-weight: bold;
`;

const WebcamIcon = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #4CAF50;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .material-icons {
    font-size: 16px;
  }
`;

const CameraName = styled.div`
  font-size: 14px;
  color: ${props => props.active ? 'white' : '#aaa'};
`;

const DragTip = styled.div`
  padding: 10px 15px;
  background-color: rgba(52, 152, 219, 0.1);
  border-left: 3px solid #3498db;
  margin: 10px;
  color: #999;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  .material-icons {
    font-size: 18px;
    color: #3498db;
  }
`;

// Sample filter icon - this would be replaced with a proper icon in production
const filterIcon = <span className="material-icons">filter_alt</span>;

// Add a new component for the drag handle
const DragHandle = styled.div`
  cursor: ${props => props.isDocked ? 'default' : 'move'};
  user-select: none;
  flex: 1;
  display: flex;
  align-items: center;
`;

// Updated camera selector to use localStorage for camera data
const CameraSelector = ({ 
  activeCamera, 
  onSelectCamera,
  onClose,
  showTab = false
}) => {
  // Use useRef for persisting values without causing rerenders
  const camerasRef = useRef(null);
  const [cameras, setCameras] = useState(() => {
    // Initial load of cameras - only runs once
    const loadCameras = () => {
      const savedCameras = localStorage.getItem('mdi_cameras');
      if (savedCameras) {
        try {
          const parsedCameras = JSON.parse(savedCameras);
          return parsedCameras.map(camera => ({
            ...camera,
            isLive: camera.isLive ?? true,
            isWebcam: camera.isWebcam || camera.type === 'usb' || false
          }));
        } catch (e) {
          console.error('Error parsing saved cameras:', e);
          return standardCameras;
        }
      }
      return standardCameras;
    };
    
    const initialCameras = loadCameras();
    camerasRef.current = initialCameras;
    return initialCameras;
  });

  const [searchTerm, setSearchTerm] = useState('');
  const lastUpdateRef = useRef(Date.now());

  // Memoize the camera update function
  const updateCameras = useCallback((newCameras) => {
    const processed = newCameras.map(camera => ({
      ...camera,
      isLive: camera.isLive ?? true,
      isWebcam: camera.isWebcam || camera.type === 'usb' || false
    }));
    
    // Only update if the data has actually changed
    if (JSON.stringify(processed) !== JSON.stringify(camerasRef.current)) {
      camerasRef.current = processed;
      setCameras(processed);
      lastUpdateRef.current = Date.now();
    }
  }, []);

  // Handle storage events
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e?.key === 'mdi_cameras' && e.newValue) {
        try {
          const parsedCameras = JSON.parse(e.newValue);
          updateCameras(parsedCameras);
        } catch (e) {
          console.error('Error parsing cameras from storage event:', e);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Polling interval for local updates
    const checkInterval = setInterval(() => {
      // Only check if enough time has passed (5 seconds)
      if (Date.now() - lastUpdateRef.current < 5000) return;

      const savedCameras = localStorage.getItem('mdi_cameras');
      if (!savedCameras) return;

      try {
        const parsedCameras = JSON.parse(savedCameras);
        updateCameras(parsedCameras);
      } catch (e) {
        console.error('Error parsing cameras from interval check:', e);
      }
    }, 5000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(checkInterval);
    };
  }, [updateCameras]);

  // Memoize filtered cameras
  const filteredCameras = useMemo(() => {
    if (!searchTerm) return cameras;
    const searchLower = searchTerm.toLowerCase();
    return cameras.filter(camera => 
      camera.name.toLowerCase().includes(searchLower)
    );
  }, [cameras, searchTerm]);

  // Memoize camera item renderer
  const renderCameraItem = useCallback((camera) => (
    <CameraItem 
      key={camera.id} 
      active={activeCamera === camera.id}
      onClick={() => onSelectCamera?.(camera.id)}
      draggable
      onDragStart={(e) => {
        // Set multiple data formats for better compatibility
        e.dataTransfer.setData('application/json', JSON.stringify(camera));
        e.dataTransfer.setData('text/plain', JSON.stringify(camera));
        e.dataTransfer.setData('camera/id', camera.id.toString());
        
        // Set drag effect
        e.dataTransfer.effectAllowed = 'move';
        
        // Optional: Set a drag image
        const dragImage = document.createElement('div');
        dragImage.textContent = camera.name;
        dragImage.style.padding = '8px';
        dragImage.style.background = '#2c3e50';
        dragImage.style.color = 'white';
        dragImage.style.borderRadius = '4px';
        dragImage.style.position = 'absolute';
        dragImage.style.top = '-1000px';
        document.body.appendChild(dragImage);
        e.dataTransfer.setDragImage(dragImage, 0, 0);
        
        // Clean up the drag image element after a short delay
        setTimeout(() => {
          document.body.removeChild(dragImage);
        }, 0);
      }}
    >
      <CameraThumb videoSrc={camera.videoSrc || (camera.type === 'test-video' ? camera.url : null)}>
        {(camera.videoSrc || (camera.type === 'test-video' && camera.url)) && (
          <VideoThumb
            src={camera.videoSrc || camera.url}
            muted
            loop
            autoPlay
            playsInline
          />
        )}
        {camera.isLive && <LiveBadge>LIVE</LiveBadge>}
        {camera.isWebcam && (
          <WebcamIcon>
            <span className="material-icons">videocam</span>
          </WebcamIcon>
        )}
      </CameraThumb>
      <CameraName active={activeCamera === camera.id}>
        {camera.name}
      </CameraName>
    </CameraItem>
  ), [activeCamera, onSelectCamera]);

  // Debounce search input
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    if (searchTerm !== value) {
      setSearchTerm(value);
    }
  }, [searchTerm]);

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>Cameras</SidebarTitle>
        <HeaderControls>
          <ControlButton 
            onClick={onClose}
            title="Close"
          >
            <span className="material-icons">close</span>
          </ControlButton>
        </HeaderControls>
      </SidebarHeader>
      
      <SearchInput>
        <input 
          type="text" 
          placeholder="Search cameras..." 
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </SearchInput>
      
      <DragTip>
        <span className="material-icons">drag_indicator</span>
        Drag a camera to place it in the view
      </DragTip>
      
      <CameraList>
        {filteredCameras.map(renderCameraItem)}
      </CameraList>
    </SidebarContainer>
  );
};

export default React.memo(CameraSelector); 