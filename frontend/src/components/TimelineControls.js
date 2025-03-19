import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { standardCameras } from '../mockBackend';

const TimelineContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #141722;
  border-top: 1px solid #2c3040;
  padding: 4px 0 6px;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  @media (max-width: 768px) {
    padding: 5px 8px;
    border-radius: 0;
  }
`;

const ControlsRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3px;
  padding: 0 12px;
  height: 30px;
`;

const ControlButton = styled.button`
  background-color: transparent;
  border: none;
  color: #e0e0e0;
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  border-radius: 50%;
  width: 28px;
  height: 28px;

  @media (max-width: 768px) {
    width: 24px;
    height: 24px;
    font-size: 14px;
  }

  &:hover {
    color: white;
    background-color: rgba(52, 152, 219, 0.2);
    transform: translateY(-1px);
  }

  &:disabled {
    color: #555;
    cursor: not-allowed;
    transform: none;
  }

  &.primary {
    background-color: rgba(52, 152, 219, 0.15);
    
    &:hover {
      background-color: rgba(52, 152, 219, 0.3);
    }
  }
`;

const PlaybackGroup = styled.div`
  display: flex;
  gap: 3px;
  margin-right: 12px;
  background: rgba(20, 28, 45, 0.6);
  padding: 2px 4px;
  border-radius: 4px;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 3px;
  margin-right: 10px;
`;

const FilterToggle = styled.button`
  background-color: ${props => props.active ? props.activeColor || '#00bcd4' : 'rgba(0, 0, 0, 0.3)'};
  border: none;
  border-radius: 3px;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  font-size: 12px;
  padding: 0;
  transition: all 0.2s;
  box-shadow: ${props => props.active ? `0 0 8px ${props.activeColor || 'rgba(0, 188, 212, 0.4)'}` : 'none'};
  
  .material-icons {
    font-size: 14px;
  }
  
  &:hover {
    background-color: ${props => props.active ? props.activeColor || '#00bcd4' : 'rgba(255, 255, 255, 0.15)'};
    transform: translateY(-1px);
  }
`;

const LiveButton = styled.button`
  background-color: ${props => props.isLive ? 'rgba(231, 76, 60, 0.25)' : 'rgba(0, 0, 0, 0.2)'};
  color: ${props => props.isLive ? '#fc5c65' : '#e0e0e0'};
  border: none;
  border-radius: 4px;
  padding: 2px 6px;
  font-size: 11px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 22px;
  cursor: pointer;
  box-shadow: ${props => props.isLive ? '0 0 5px rgba(231, 76, 60, 0.3)' : 'none'};
  transition: all 0.2s;
  
  .material-icons {
    font-size: 12px;
    animation: ${props => props.isLive ? 'pulse 1.5s infinite' : 'none'};
  }
  
  @keyframes pulse {
    0% { opacity: 1; }
    50% { opacity: 0.4; }
    100% { opacity: 1; }
  }
  
  &:hover {
    color: ${props => props.isLive ? '#fc5c65' : 'white'};
    background-color: ${props => props.isLive ? 'rgba(231, 76, 60, 0.35)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const TimeDisplay = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  background: rgba(0, 0, 0, 0.2);
  padding: 3px 6px;
  border-radius: 3px;
  letter-spacing: 0.5px;
  color: #00bcd4;
  height: 22px;
  display: flex;
  align-items: center;
`;

const TimelineTrackContainer = styled.div`
  position: relative;
  margin-bottom: 10px;
  height: 60px;
  user-select: none;
`;

const TimelineTrack = styled.div`
  position: relative;
  height: 40px;
  background-color: #1a1f2e;
  border-radius: 0;
  overflow: visible;
  cursor: pointer;
  
  &:hover {
    background-color: #1e2335;
  }
`;

const TimelineTicks = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const TimelineTick = styled.div`
  width: 1px;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  position: relative;
  top: 0;

  &::after {
    content: "${props => props.label}";
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 9px;
    color: rgba(255, 255, 255, 0.6);
    white-space: nowrap;
  }
  
  &:nth-child(even) {
    height: 5px;
    width: 1px;
  }
`;

const EventMarker = styled.div`
  position: absolute;
  width: ${props => props.hover ? '14px' : '8px'};
  height: ${props => props.hover ? '14px' : '8px'};
  top: 50%;
  transform: translate(-50%, -50%);
  background-color: ${props => {
    if (props.type === 'human') return '#2ecc71'; // Green for humans
    if (props.type === 'vehicle') return '#3498db'; // Blue for vehicles
    return '#b0bec5';
  }};
  left: ${props => props.position}%;
  cursor: pointer;
  z-index: 3;
  border-radius: 50%;
  transition: all 0.2s;
  opacity: 0.8;

  &:hover {
    width: 14px;
    height: 14px;
    z-index: 10;
    opacity: 1;
  }
`;

const PlayheadMarker = styled.div`
  position: absolute;
  width: 2px;
  top: 0;
  bottom: 0;
  background-color: #e74c3c;
  left: ${props => props.position}%;
    transform: translateX(-50%);
  z-index: 5;
  cursor: col-resize;
  box-shadow: 0 0 4px rgba(231, 76, 60, 0.6);
  
  &:hover {
    width: 3px;
  }
`;

const TimeRuler = styled.div`
  position: relative;
  height: 25px;
  width: 100%;
  margin-top: 4px;
  opacity: 0.7;
  
  @media (max-width: 768px) {
    height: 20px;
    margin-top: 2px;
  }
`;

const TimeSegment = styled.div`
  position: absolute;
  bottom: 0;
  left: ${props => props.start}%;
  width: ${props => props.width}%;
  height: 22px;
  text-align: center;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.7);
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 4px;
  
  @media (max-width: 768px) {
    height: 18px;
    font-size: 8px;
    padding-top: 2px;
  }
  
  &:hover {
    color: white;
  }
`;

// Add highlighting for sections with events
const EventHighlight = styled.div`
  position: absolute;
  height: 100%;
  left: ${props => props.startPosition}%;
  width: ${props => props.endPosition - props.startPosition}%;
  background: ${props => {
    // Create a gradient based on the detection types
    const humanColor = 'rgba(46, 204, 113, 0.08)'; // Green with transparency
    const vehicleColor = 'rgba(52, 152, 219, 0.08)'; // Blue with transparency
    
    if (props.humanIntensity > 0 && props.vehicleIntensity > 0) {
      // Both human and vehicle detections - create a gradient
      return `linear-gradient(to right, 
        ${humanColor} ${props.humanIntensity * 100}%, 
        ${vehicleColor} ${100 - props.vehicleIntensity * 100}%)`;
    } else if (props.humanIntensity > 0) {
      return humanColor;
    } else if (props.vehicleIntensity > 0) {
      return vehicleColor;
    }
    return 'transparent';
  }};
  opacity: ${props => props.hover ? 0.5 : 0.3};
  transition: opacity 0.2s;
  z-index: 1;
  
  &:hover {
    opacity: 0.5;
  }
`;

// Highlighted time tooltip
const TimeTooltip = styled.div`
  position: absolute;
  top: -40px;
  left: ${props => `calc(${props.position}% - 50px)`};
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 10px;
  border-radius: 6px;
  font-size: 12px;
  pointer-events: none;
  transform: ${props => props.show ? 'translateY(0)' : 'translateY(10px)'};
  opacity: ${props => props.show ? 1 : 0};
  transition: all 0.2s;
  width: 100px;
  text-align: center;
  z-index: 20;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  
  @media (max-width: 768px) {
    font-size: 10px;
    padding: 4px 8px;
    width: 80px;
    top: -35px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-top: 6px solid rgba(0, 0, 0, 0.8);
  }
`;

const TimelineHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
  color: #aaa;
  font-size: 12px;
  padding: 0 8px;
`;

const ActiveCameraBadge = styled.div`
  display: flex;
  align-items: center;
  background: rgba(30, 39, 59, 0.5);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  color: #bbb;
  
  .material-icons {
    font-size: 14px;
    margin-right: 5px;
    color: #3498db;
  }
  
  .camera-name {
    font-weight: 500;
    color: white;
  }
`;

// Add these missing styled components
const TimeMarker = styled.div`
  position: absolute;
  width: 1px;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.3);
  left: ${props => props.position}%;
  top: 0;
  
  &.hour {
    height: 15px;
    background-color: rgba(255, 255, 255, 0.6);
  }
`;

const TimeMarkerLabel = styled.div`
  position: absolute;
  font-size: 9px;
  color: rgba(255, 255, 255, 0.6);
  left: ${props => props.position}%;
  bottom: 4px;
  transform: translateX(-50%);
  white-space: nowrap;
`;

const TimelineControls = ({ 
  detections = [], 
  activeCamera, 
  layout, 
  selectedCameras = [],
  onTimelineUpdate,
  initialPlayheadPosition = 30,
  initialIsLive = true,
  initialIsPlaying = true
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [playheadPosition, setPlayheadPosition] = useState(initialPlayheadPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
  const [isLive, setIsLive] = useState(initialIsLive);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showHumans, setShowHumans] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const timelineRef = useRef(null);
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [timelineOffset, setTimelineOffset] = useState(0);
  const mockDetectionsRef = useRef({});
  
  // Use a fixed 12-hour timeline instead of variable video durations
  const timelineDuration = 12 * 60 * 60; // 12 hours in seconds
  
  // Simple pseudo-random number generator with seed
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  // Generate stable mock detections for each camera
  const generateMockDetections = (cameraId) => {
    // Use camera ID as the seed base for consistent random generation
    let seed = cameraId * 1000;
    // Get number of detections (stable for each camera)
    const totalDetections = Math.floor(seededRandom(seed) * 15) + 15;
    
    const detections = [];
    for (let i = 0; i < totalDetections; i++) {
      seed += i; // Change seed for each detection
      // Random timestamp within the 12-hour window
      const timestamp = seededRandom(seed * 3) * timelineDuration;
      // Determine type based on seed (consistent for each position)
      const type = seededRandom(seed * 7) > 0.5 ? 'human' : 'vehicle';
      
      detections.push({
        id: `${cameraId}-${i}`,
        cameraId,
        timestamp,
        type,
        confidence: seededRandom(seed * 11) * 0.3 + 0.7
      });
    }
    
    return detections;
  };
  
  // Initialize mock detections only once
  useEffect(() => {
    // Only generate if our ref is empty
    if (Object.keys(mockDetectionsRef.current).length === 0) {
      const allMockDetections = {};
      for (let i = 1; i <= 10; i++) {
        allMockDetections[i] = generateMockDetections(i);
      }
      mockDetectionsRef.current = allMockDetections;
    }
  }, []);
  
  // Get current camera detections from the ref
  const getCurrentCameraDetections = () => {
    return mockDetectionsRef.current[activeCamera] || [];
  };
  
  // Filter detections by type
  const getFilteredDetections = () => {
    const currentDetections = getCurrentCameraDetections();
    return currentDetections.filter(d => 
      (showHumans && d.type === 'human') || (showVehicles && d.type === 'vehicle')
    );
  };
  
  // Get active camera name
  const getActiveCameraName = () => {
    const camera = standardCameras.find(c => c.id === activeCamera);
    return camera ? camera.name : `Camera ${activeCamera}`;
  };
  
  // Format timestamp from seconds to HH:MM
  const formatTimestamp = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };
  
  // Format timestamp for tooltip with hours, minutes and seconds
  const formatDetailedTimestamp = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };
  
  // Calculate current timestamp in video based on playhead position
  const getCurrentTimestamp = () => {
    return (playheadPosition / 100) * timelineDuration;
  };
  
  // Update time when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      if (isLive) {
        setCurrentTime(new Date());
      } else {
        setPlayheadPosition(prev => {
          const newPosition = prev + (0.1 * playbackRate);
          if (newPosition >= 100) {
            return 0;
          }
          return newPosition;
        });
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [isPlaying, isLive, playbackRate]);
  
  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Handle playhead drag
  const handlePlayheadMouseDown = (e) => {
    setIsDragging(true);
    if (isLive) setIsLive(false);
    updatePlayheadPosition(e);
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    updatePlayheadPosition(e);
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  };
  
  const updatePlayheadPosition = (e) => {
    if (!timelineRef.current) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const position = ((e.clientX - rect.left) / rect.width) * 100;
    setPlayheadPosition(Math.max(0, Math.min(100, position)));
  };
  
  // Handle timeline click
  const handleTimelineClick = (e) => {
    if (isDragging) return;
    updatePlayheadPosition(e);
    if (isLive) setIsLive(false);
  };
  
  // Handle event marker click
  const handleEventMarkerClick = (timestamp) => {
    const position = (timestamp / timelineDuration) * 100;
    setPlayheadPosition(position);
    if (isLive) setIsLive(false);
  };
  
  // Notify parent component when timeline state changes
  useEffect(() => {
    if (onTimelineUpdate) {
      onTimelineUpdate(playheadPosition, isLive, isPlaying);
    }
  }, [playheadPosition, isLive, isPlaying, onTimelineUpdate]);
  
  // Update state when props change
  useEffect(() => {
    setPlayheadPosition(initialPlayheadPosition);
    setIsLive(initialIsLive);
    setIsPlaying(initialIsPlaying);
  }, [initialPlayheadPosition, initialIsLive, initialIsPlaying]);
  
  // Toggle play/pause
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  // Toggle live mode
  const toggleLive = () => {
    if (!isLive) {
      setPlayheadPosition(100);
      setIsPlaying(true);
    }
    setIsLive(!isLive);
  };
  
  // Generate time markers
  const generateTimeMarkers = () => {
    const markers = [];
    const segments = 12; // 12 hours
    
    // Add hour markers
    for (let i = 0; i <= segments; i++) {
      const position = (i / segments) * 100;
      const timestamp = (i / segments) * timelineDuration;
      
      // Add hour marker
      markers.push(
        <React.Fragment key={`hour-${i}`}>
          <TimeMarker 
            position={position} 
            className="hour" 
          />
          <TimeMarkerLabel 
            position={position}
          >
            {i === 12 ? '12 PM' : formatTimestamp(timestamp)}
          </TimeMarkerLabel>
        </React.Fragment>
      );
      
      // Add 5-minute markers between hours (11 markers for every 5 minutes)
      if (i < segments) {
        for (let j = 1; j < 12; j++) {
          const minutePosition = ((i + j/12) / segments) * 100;
          
          // Only add visible label for 15, 30, and 45 minute marks
          const showLabel = (j % 3 === 0);
          
          markers.push(
            <TimeMarker 
              key={`minute-${i}-${j}`}
              position={minutePosition}
            />
          );
          
          if (showLabel) {
            const minuteTimestamp = ((i + j/12) / segments) * timelineDuration;
            markers.push(
              <TimeMarkerLabel 
                key={`minuteLabel-${i}-${j}`}
                position={minutePosition}
              >
                {formatTimestamp(minuteTimestamp)}
              </TimeMarkerLabel>
            );
          }
        }
      }
    }
    
    return markers;
  };
  
  // Generate event markers
  const generateEventMarkers = () => {
    const filteredDetections = getFilteredDetections();
    return filteredDetections.map(detection => {
      const position = (detection.timestamp / timelineDuration) * 100;
      return (
        <EventMarker
          key={detection.id}
          position={position}
          type={detection.type}
          title={`${detection.type === 'human' ? 'Person' : 'Vehicle'} detected at ${formatDetailedTimestamp(detection.timestamp)}`}
          onClick={() => handleEventMarkerClick(detection.timestamp)}
        />
      );
    });
  };
  
  // Generate event highlights - group detections into time clusters
  const generateEventHighlights = () => {
    // Create a map of all detections grouped by timeframe (in 30 minute chunks)
    const timeChunks = {};
    const chunkSize = 30 * 60; // 30 minutes in seconds
  const filteredDetections = getFilteredDetections();
    
    filteredDetections.forEach(detection => {
      const chunkStart = Math.floor(detection.timestamp / chunkSize) * chunkSize;
      if (!timeChunks[chunkStart]) {
        timeChunks[chunkStart] = {
          humans: 0,
          vehicles: 0,
          total: 0
        };
      }
      
      if (detection.type === 'human') {
        timeChunks[chunkStart].humans++;
      } else if (detection.type === 'vehicle') {
        timeChunks[chunkStart].vehicles++;
      }
      timeChunks[chunkStart].total++;
    });
    
    // Convert the chunks to highlight elements
    return Object.entries(timeChunks).map(([startTime, data]) => {
      const startTimeNum = Number(startTime);
      const endTimeNum = startTimeNum + chunkSize;
      
      const startPosition = (startTimeNum / timelineDuration) * 100;
      const endPosition = (endTimeNum / timelineDuration) * 100;
      
      // Calculate intensity for each type
      const maxDetections = 5; // Normalize based on this maximum
      const humanIntensity = Math.min(data.humans / maxDetections, 1);
      const vehicleIntensity = Math.min(data.vehicles / maxDetections, 1);
      
      return (
        <EventHighlight
          key={`highlight-${startTime}`}
          startPosition={startPosition}
          endPosition={endPosition}
          humanIntensity={humanIntensity}
          vehicleIntensity={vehicleIntensity}
          title={`${data.humans} human and ${data.vehicles} vehicle detections`}
        />
      );
    });
  };
  
  return (
    <TimelineContainer>
      <ControlsRow>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <PlaybackGroup>
            <ControlButton onClick={() => {
              setPlayheadPosition(prev => Math.max(0, prev - 1));
              if (isLive) setIsLive(false);
            }} title="Skip Backward">
              <span className="material-icons" style={{ fontSize: '16px' }}>replay_10</span>
          </ControlButton>
            <ControlButton onClick={togglePlayPause} title={isPlaying ? "Pause" : "Play"}>
              <span className="material-icons" style={{ fontSize: '16px' }}>{isPlaying ? "pause" : "play_arrow"}</span>
          </ControlButton>
            <ControlButton onClick={() => {
              setPlayheadPosition(prev => Math.min(100, prev + 1));
              if (isLive) setIsLive(false);
            }} title="Skip Forward">
              <span className="material-icons" style={{ fontSize: '16px' }}>forward_10</span>
          </ControlButton>
        </PlaybackGroup>
          
          <FilterControls>
            <FilterToggle 
              active={showHumans}
              activeColor="#2ecc71"
              onClick={() => setShowHumans(!showHumans)}
              title="Toggle human detections"
            >
              <span className="material-icons">person</span>
            </FilterToggle>
            <FilterToggle 
              active={showVehicles}
              activeColor="#3498db"
              onClick={() => setShowVehicles(!showVehicles)}
              title="Toggle vehicle detections"
            >
              <span className="material-icons">directions_car</span>
            </FilterToggle>
          </FilterControls>
          
          <ActiveCameraBadge>
            <span className="material-icons">videocam</span>
            <span className="camera-name">{getActiveCameraName()}</span>
          </ActiveCameraBadge>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <TimeDisplay>
            {isLive ? "LIVE" : formatDetailedTimestamp(getCurrentTimestamp())}
        </TimeDisplay>
        
        <LiveButton 
          isLive={isLive} 
            onClick={toggleLive}
            title={isLive ? "Exit live mode" : "Go to live"}
        >
          <span className="material-icons">fiber_manual_record</span>
          LIVE
        </LiveButton>
        </div>
      </ControlsRow>
      
      <TimelineTrackContainer>
        <TimelineTrack 
          ref={timelineRef}
          onClick={handleTimelineClick}
        >
          {generateEventHighlights()}
          
          <TimelineTicks>
            {generateTimeMarkers()}
          </TimelineTicks>
          
          {generateEventMarkers()}
          
          <PlayheadMarker 
            position={playheadPosition} 
            onMouseDown={handlePlayheadMouseDown}
          />
        </TimelineTrack>
      </TimelineTrackContainer>
    </TimelineContainer>
  );
};

export default TimelineControls; 