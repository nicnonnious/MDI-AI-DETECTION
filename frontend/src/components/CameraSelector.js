import React, { useEffect } from 'react';
import styled from 'styled-components';
import { standardCameras } from '../mockBackend';

const SidebarContainer = styled.div`
  width: 260px;
  background-color: #1e1e1e;
  border-left: 1px solid #333;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  color: white;
  border-bottom: 1px solid #333;
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

// Updated camera selector to use localStorage for camera data
const CameraSelector = ({ activeCamera, onSelectCamera }) => {
  // Load cameras from localStorage or use default list
  const [cameras, setCameras] = React.useState(() => {
    const savedCameras = localStorage.getItem('mdi_cameras');
    if (savedCameras) {
      try {
        const parsedCameras = JSON.parse(savedCameras);
        console.log('CameraSelector: Loaded cameras from localStorage:', parsedCameras.length);
        // Ensure all cameras have required properties
        return parsedCameras.map(camera => ({
          ...camera,
          isLive: camera.isLive !== undefined ? camera.isLive : true,
          isWebcam: camera.isWebcam || camera.type === 'usb' || false
        }));
      } catch (e) {
        console.error('Error parsing saved cameras:', e);
        console.log('CameraSelector: Using default cameras due to parse error');
        return getDefaultCameras();
      }
    } else {
      console.log('CameraSelector: No cameras in localStorage, using default cameras');
      return getDefaultCameras();
    }
  });
  
  // Debug logging when cameras state changes
  useEffect(() => {
    console.log('CameraSelector: Current cameras state:', cameras.length, 'cameras');
  }, [cameras]);
  
  // Function to get default cameras if none in localStorage
  function getDefaultCameras() {
    console.log('CameraSelector: Using standardized camera list:', standardCameras.length, 'cameras');
    return standardCameras;
  }
  
  // Update cameras when localStorage changes - add manual refresh every 3 seconds
  React.useEffect(() => {
    const handleStorageChange = () => {
      const savedCameras = localStorage.getItem('mdi_cameras');
      if (savedCameras) {
        try {
          const parsedCameras = JSON.parse(savedCameras);
          console.log('CameraSelector: Storage event received, updating cameras:', parsedCameras.length);
          // Ensure all cameras have required properties
          setCameras(parsedCameras.map(camera => ({
            ...camera,
            isLive: camera.isLive !== undefined ? camera.isLive : true,
            isWebcam: camera.isWebcam || camera.type === 'usb' || false
          })));
        } catch (e) {
          console.error('Error parsing saved cameras from storage event:', e);
        }
      }
    };
    
    // Set up event listeners
    window.addEventListener('storage', handleStorageChange);
    
    // Also set up an interval to check for changes within the same window - more frequent checks
    const interval = setInterval(() => {
      const savedCameras = localStorage.getItem('mdi_cameras');
      if (savedCameras) {
        try {
          const parsedCameras = JSON.parse(savedCameras);
          if (JSON.stringify(parsedCameras) !== JSON.stringify(cameras)) {
            console.log('CameraSelector: Interval check detected changes, updating cameras:', parsedCameras.length);
            setCameras(parsedCameras.map(camera => ({
              ...camera,
              isLive: camera.isLive !== undefined ? camera.isLive : true,
              isWebcam: camera.isWebcam || camera.type === 'usb' || false
            })));
          }
        } catch (e) {
          console.error('Error parsing saved cameras from interval check:', e);
        }
      }
    }, 1000); // Check every second
    
    // Force a refresh on component mount to ensure we have the latest data
    handleStorageChange();
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [cameras]);
  
  const [draggingCamera, setDraggingCamera] = React.useState(null);
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Filter cameras based on search term
  const filteredCameras = cameras.filter(camera =>
    camera.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Handle drag start
  const handleDragStart = (e, camera) => {
    setDraggingCamera(camera.id);
    
    // Set the drag data with high priority and redundancy
    const cameraData = JSON.stringify(camera);
    e.dataTransfer.setData('text/plain', cameraData);
    e.dataTransfer.setData('application/json', cameraData); // Alternative format
    e.dataTransfer.effectAllowed = 'copy';
    
    // Create a drag image
    const dragImg = document.createElement('div');
    dragImg.textContent = camera.name;
    dragImg.style.padding = '10px';
    dragImg.style.background = '#2c3e50';
    dragImg.style.color = 'white';
    dragImg.style.borderRadius = '4px';
    dragImg.style.position = 'absolute';
    dragImg.style.top = '-1000px';
    document.body.appendChild(dragImg);
    
    e.dataTransfer.setDragImage(dragImg, 20, 20);
    
    // Remove the temp element after a short delay
    setTimeout(() => {
      document.body.removeChild(dragImg);
    }, 100);
    
    console.log(`Started dragging camera: ${camera.id} - ${camera.name}`);
  };
  
  // Handle drag end
  const handleDragEnd = () => {
    setDraggingCamera(null);
  };

  return (
    <SidebarContainer>
      <SidebarHeader>
        <SidebarTitle>Cameras</SidebarTitle>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}>
          {filterIcon}
        </button>
      </SidebarHeader>
      
      <SearchInput>
        <input 
          type="text" 
          placeholder="Search cameras..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </SearchInput>
      
      <DragTip>
        <span className="material-icons">drag_indicator</span>
        Drag a camera to place it in the view
      </DragTip>
      
      <CameraList>
        {filteredCameras.map(camera => (
          <CameraItem 
            key={camera.id} 
            active={activeCamera === camera.id}
            isDragging={draggingCamera === camera.id}
            onClick={() => onSelectCamera && onSelectCamera(camera.id)}
            draggable
            onDragStart={(e) => handleDragStart(e, camera)}
            onDragEnd={handleDragEnd}
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
        ))}
      </CameraList>
    </SidebarContainer>
  );
};

export default CameraSelector; 