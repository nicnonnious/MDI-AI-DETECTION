import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  position: relative;
`;

const LeftControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  z-index: 1;
`;

const CenterControls = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
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
    if (props.type === 'human') return '#2ecc71';
    if (props.type === 'vehicle') return '#3498db';
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
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  }
  
  &:active {
    transform: translate(-50%, -50%) scale(0.9);
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
    box-shadow: 0 0 8px rgba(231, 76, 60, 0.8);
  }
  
  &:before {
    content: '';
    position: absolute;
    top: -4px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    background-color: #e74c3c;
    border-radius: 50%;
    box-shadow: 0 0 4px rgba(231, 76, 60, 0.6);
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
  white-space: nowrap;
  
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

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 4px;
  margin-right: 12px;
`;

const TimeRangeButton = styled.button`
  background-color: ${props => props.active ? 'rgba(52, 152, 219, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
  color: ${props => props.active ? '#fff' : '#e0e0e0'};
  border: none;
  border-radius: 3px;
  padding: 2px 8px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  height: 22px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(52, 152, 219, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
    color: white;
  }
  
  .material-icons {
    font-size: 14px;
  }
`;

const TimeDisplayGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  padding-right: 12px;
`;

const TimeRangeDisplay = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-size: 11px;
  font-weight: 500;
  color: #888;
  display: flex;
  align-items: center;
  gap: 4px;
  
  .material-icons {
    font-size: 14px;
    color: #666;
  }
`;

const DateRangeButton = styled(TimeRangeButton)`
  background-color: ${props => props.active ? 'rgba(156, 39, 176, 0.3)' : 'rgba(0, 0, 0, 0.2)'};
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(156, 39, 176, 0.4)' : 'rgba(255, 255, 255, 0.1)'};
  }
`;

const DateRangePopup = styled.div`
  position: absolute;
  top: 40px;
  left: 50%;
  transform: translateX(-50%);
  background: #1a1f2e;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 100;
  display: ${props => props.show ? 'block' : 'none'};
  
  .date-inputs {
    display: flex;
    gap: 12px;
    margin-bottom: 12px;
  }
  
  .date-input-group {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  
  label {
    font-size: 11px;
    color: #888;
  }
  
  input {
    background: #141722;
    border: 1px solid #2c3040;
    border-radius: 4px;
    padding: 6px 8px;
    color: white;
    font-size: 12px;
    width: 160px;
    
    &:focus {
      outline: none;
      border-color: #9c27b0;
    }
  }
  
  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
`;

const DateRangeAction = styled.button`
  background: ${props => props.primary ? '#9c27b0' : 'transparent'};
  color: ${props => props.primary ? 'white' : '#888'};
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.primary ? '#ba68c8' : 'rgba(255, 255, 255, 0.1)'};
    color: white;
  }
`;

const CropMarker = styled.div`
  position: absolute;
  width: 2px;
  top: 0;
  bottom: 0;
  background-color: #9c27b0;
  left: ${props => props.position}%;
  transform: translateX(-50%);
  z-index: 4;
  cursor: col-resize;
  box-shadow: 0 0 4px rgba(156, 39, 176, 0.6);
  pointer-events: all;
  
  &:hover {
    width: 3px;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: ${props => props.isStart ? '-8px' : 'auto'};
    bottom: ${props => props.isStart ? 'auto' : '-8px'};
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    border-${props => props.isStart ? 'bottom' : 'top'}: 6px solid #9c27b0;
  }
`;

const CropSelection = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  background-color: rgba(156, 39, 176, 0.1);
  border: 1px solid rgba(156, 39, 176, 0.3);
  left: ${props => props.startPosition}%;
  width: ${props => props.endPosition - props.startPosition}%;
  z-index: 3;
  pointer-events: none;
`;

const CropButton = styled(ControlButton)`
  color: ${props => props.active ? '#9c27b0' : '#e0e0e0'};
  
  &:hover {
    color: ${props => props.active ? '#ba68c8' : 'white'};
    background-color: rgba(156, 39, 176, 0.2);
  }
`;

const SaveCropButton = styled(ControlButton)`
  background-color: #9c27b0;
  color: white;
  margin-left: 4px;
  
  &:hover {
    background-color: #ba68c8;
    color: white;
  }
  
  &:disabled {
    background-color: rgba(156, 39, 176, 0.2);
    color: rgba(255, 255, 255, 0.3);
  }
`;

const RecordingBar = styled.div`
  position: absolute;
  height: 3px;
  background-color: ${props => props.isRecording ? '#3498db' : 'rgba(52, 152, 219, 0.15)'};
  opacity: ${props => props.isRecording ? 0.9 : 0.4};
  bottom: -6px;
  left: ${props => props.startPosition}%;
  width: ${props => props.endPosition - props.startPosition}%;
  z-index: 2;
  border-radius: 1px;
  box-shadow: ${props => props.isRecording ? '0 0 4px rgba(52, 152, 219, 0.4)' : 'none'};
`;

// Add new styled component for future time overlay
const FutureTimeOverlay = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: ${props => 100 - props.currentPosition}%;
  background: rgba(0, 0, 0, 0.4);
  pointer-events: ${props => props.isLive ? 'all' : 'none'};
  display: ${props => props.isLive ? 'block' : 'none'};
  z-index: 4;
  cursor: not-allowed;
`;

const TimelineControls = ({ 
  detections = [], 
  activeCamera, 
  layout, 
  selectedCameras = [],
  onTimelineUpdate,
  initialPlayheadPosition = 30,
  initialIsLive = true,
  initialIsPlaying = true,
  cameraFps = 30 // Add default FPS parameter
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [playheadPosition, setPlayheadPosition] = useState(initialPlayheadPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [isPlaying, setIsPlaying] = useState(initialIsPlaying);
  const [isLive, setIsLive] = useState(initialIsLive);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showHumans, setShowHumans] = useState(true);
  const [showVehicles, setShowVehicles] = useState(true);
  const [timeRange, setTimeRange] = useState('12h'); // New state for time range
  const timelineRef = useRef(null);
  const [timelineZoom, setTimelineZoom] = useState(1);
  const [timelineOffset, setTimelineOffset] = useState(0);
  const mockDetectionsRef = useRef({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isHistoricalMode, setIsHistoricalMode] = useState(false);
  const datePickerRef = useRef(null);
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState(null);
  const [cropEnd, setCropEnd] = useState(null);
  const [isDraggingCrop, setIsDraggingCrop] = useState(null); // 'start' or 'end'
  const [recordingPeriods, setRecordingPeriods] = useState([]);
  
  // Add refs at component level
  const timelineUpdateInitialRender = useRef(true);
  const recordingPeriodsInitialRender = useRef(true);
  
  // Add new state for tracking the last update time
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());
  const [lastFrameTime, setLastFrameTime] = useState(0);
  
  // Calculate timeline duration based on selected time range
  const getTimelineDuration = () => {
    switch (timeRange) {
      case '1h':
        return 3600; // 1 hour in seconds
      case '12h':
        return 43200; // 12 hours in seconds
      case '24h':
        return 86400; // 24 hours in seconds
      default:
        return 43200; // Default to 12 hours
    }
  };
  
  const timelineDuration = getTimelineDuration();
  
  // Simple pseudo-random number generator with seed
  const seededRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };
  
  // Generate stable mock detections for each camera
  const generateMockDetections = (cameraId) => {
    // Use camera ID as the seed base for consistent random generation
    let seed = cameraId * 1000;
    
    // Scale number of detections based on time range
    const baseDetections = Math.floor(seededRandom(seed) * 15) + 15;
    const scaleFactor = {
      '1h': 0.3,  // Fewer detections in 1 hour
      '12h': 1,   // Base number of detections
      '24h': 1.5, // More detections for 24 hours
      '7d': 3     // Most detections for a week
    };
    
    const totalDetections = Math.floor(baseDetections * (scaleFactor[timeRange] || 1));
    
    const detections = [];
    const now = Date.now();
    
    for (let i = 0; i < totalDetections; i++) {
      seed += i; // Change seed for each detection
      
      // Generate timestamp relative to current time
      const maxOffset = timelineDuration * 1000; // Convert to milliseconds
      const timestamp = now - (seededRandom(seed * 3) * maxOffset);
      
      // Determine type based on seed (consistent for each position)
      const type = seededRandom(seed * 7) > 0.5 ? 'human' : 'vehicle';
      
      // Generate detection with absolute timestamp
      detections.push({
        id: `${cameraId}-${i}`,
        cameraId,
        timestamp: Math.floor((now - timestamp) / 1000), // Convert to relative seconds
        type,
        confidence: seededRandom(seed * 11) * 0.3 + 0.7
      });
    }
    
    // Sort detections by timestamp
    return detections.sort((a, b) => a.timestamp - b.timestamp);
  };
  
  // Initialize mock detections when time range changes
  useEffect(() => {
    const allMockDetections = {};
    for (let i = 1; i <= 10; i++) {
      allMockDetections[i] = generateMockDetections(i);
    }
    mockDetectionsRef.current = allMockDetections;
  }, [timeRange]); // Regenerate when time range changes
  
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
  
  // Format timestamp from seconds to appropriate format based on time range
  const formatTimestamp = (percentage) => {
    const now = new Date();
    const totalDuration = getTimelineDuration();
    
    if (isLive) {
      // In live mode, calculate time relative to current time (80% mark)
      const secondsFromNow = ((percentage - 80) / 20) * totalDuration;
      const targetTime = new Date(now.getTime() + (secondsFromNow * 1000));
      return formatTimeBasedOnRange(targetTime);
    } else {
      // In history mode, calculate time based on timeline duration and position
      const secondsFromStart = (percentage / 100) * totalDuration;
      const targetTime = new Date(now.getTime() - ((totalDuration - secondsFromStart) * 1000));
      return formatTimeBasedOnRange(targetTime);
    }
  };
  
  // Add helper function for consistent time formatting
  const formatTimeBasedOnRange = (date) => {
    switch (timeRange) {
      case '1h':
        return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      case '12h':
      case '24h':
        return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
      default:
        return date.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        });
    }
  };
  
  // Format timestamp for tooltip with appropriate detail level
  const formatDetailedTimestamp = (percentage) => {
    if (isLive) {
      // In live mode, calculate time based on 80% position
      const now = new Date();
      const currentSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      
      // Calculate how far from current time this position represents
      const secondsOffset = ((percentage - 80) / 20) * timelineDuration;
      const targetSeconds = currentSeconds + secondsOffset;
      
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setSeconds(targetSeconds);
      
      switch (timeRange) {
        case '1h':
          return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          });
        case '12h':
        case '24h':
          return date.toLocaleString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            month: 'short',
            day: 'numeric'
          });
        case '7d':
          return date.toLocaleString([], { 
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        default:
          return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          });
      }
    } else {
      // Non-live mode remains unchanged
      const date = new Date(Date.now() - ((timelineDuration - (percentage / 100 * timelineDuration)) * 1000));
      
      switch (timeRange) {
        case '1h':
          return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          });
        case '12h':
        case '24h':
          return date.toLocaleString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit',
            month: 'short',
            day: 'numeric'
          });
        case '7d':
          return date.toLocaleString([], { 
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });
        default:
          return date.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          });
      }
    }
  };
  
  // Calculate current timestamp in video based on playhead position
  const getCurrentTimestamp = () => {
    return (playheadPosition / 100) * timelineDuration;
  };
  
  // Update time when playing
  useEffect(() => {
    if (!isPlaying) return;
    
    let animationFrameId;
    const frameInterval = 1000 / cameraFps;
    let lastTime = 0;
    
    const updateFrame = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = timestamp - lastTime;
      
      if (deltaTime >= frameInterval) {
        if (isLive) {
          setPlayheadPosition(80);
          setCurrentTime(new Date());
        } else {
          setPlayheadPosition(prev => {
            const pixelsPerFrame = (100 / (timelineDuration * cameraFps)) * playbackRate;
            const newPosition = prev + pixelsPerFrame;
            
            if (newPosition >= 100) {
              return 0; // Loop back to start
            }
            
            // Switch to live mode if we catch up
            if (newPosition >= 80 && timeRange === '1h') {
              setIsLive(true);
              return 80;
            }
            
            return newPosition;
          });
        }
        lastTime = timestamp;
      }
      
      animationFrameId = requestAnimationFrame(updateFrame);
    };
    
    animationFrameId = requestAnimationFrame(updateFrame);
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isPlaying, isLive, playbackRate, timelineDuration, cameraFps, timeRange]);
  
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
    
    // In live mode, limit position to 80%
    if (isLive) {
      const maxPosition = 80;
      setPlayheadPosition(Math.max(0, Math.min(maxPosition, position)));
    } else {
      setPlayheadPosition(Math.max(0, Math.min(100, position)));
    }
  };
  
  // Handle timeline click
  const handleTimelineClick = (e) => {
    if (isDragging || isCropping) return;
    
    const rect = timelineRef.current.getBoundingClientRect();
    const clickPosition = ((e.clientX - rect.left) / rect.width) * 100;
    
    // In live mode, prevent clicking ahead of current time (80% position)
    if (isLive && clickPosition > 80) {
      return;
    }
    
    // Calculate the exact timestamp at click position
    const totalDuration = getTimelineDuration();
    const clickedSeconds = (clickPosition / 100) * totalDuration;
    const now = new Date();
    const targetTime = new Date(now.getTime() - ((totalDuration - clickedSeconds) * 1000));
    
    // Set the playhead to the clicked position
    setPlayheadPosition(Math.max(0, Math.min(isLive ? 80 : 100, clickPosition)));
    
    // Exit live mode when clicking on timeline
    if (isLive) {
      setIsLive(false);
    }
    
    // Start playing from clicked position
    setIsPlaying(true);
    setCurrentTime(targetTime);
    
    // Notify parent component
    if (onTimelineUpdate) {
      onTimelineUpdate({
        isLive: false,
        isPlaying: true,
        playheadPosition: clickPosition,
        timestamp: clickedSeconds
      });
    }
  };
  
  // Handle event marker click
  const handleEventMarkerClick = (timestamp) => {
    // Calculate position on timeline
    const position = (timestamp / timelineDuration) * 100;
    
    // Set playhead position
    setPlayheadPosition(position);
    
    // Exit live mode
    if (isLive) {
      setIsLive(false);
    }
    
    // Start playing from the detection point
    setIsPlaying(true);
    
    // Update current time to the detection timestamp
    const targetTime = new Date(Date.now() - ((timelineDuration - timestamp) * 1000));
    setCurrentTime(targetTime);
    
    // Notify parent component of the change
    if (onTimelineUpdate) {
      onTimelineUpdate({
        isLive: false,
        isPlaying: true,
        playheadPosition: position,
        timestamp: timestamp
      });
    }
  };
  
  // Notify parent component when timeline state changes
  useEffect(() => {
    // Skip initial render
    if (timelineUpdateInitialRender.current) {
      timelineUpdateInitialRender.current = false;
      return;
    }

    // Debounce the update to prevent rapid re-renders
    const timeoutId = setTimeout(() => {
      if (onTimelineUpdate) {
        onTimelineUpdate(playheadPosition, isLive, isPlaying);
      }
    }, 100);

    return () => clearTimeout(timeoutId);
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
  const toggleLive = useCallback(() => {
    const newIsLive = !isLive;
    setIsLive(newIsLive);
    
    if (newIsLive) {
      // When going live, position current time at 80% of the timeline
      const now = new Date();
      const totalSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();
      
      // Calculate the timeline window
      // At 80% position, we show 80% of timelineDuration before now and 20% after
      const timelineStart = totalSeconds - (timelineDuration * 0.8);
      const timelineEnd = totalSeconds + (timelineDuration * 0.2);
      
      // Position should be exactly at 80%
      setPlayheadPosition(80);
      setIsPlaying(true);
      setLastUpdateTime(Date.now());
      
      onTimelineUpdate({
        isLive: true,
        isPlaying: true,
        playheadPosition: 80
      });
    }
  }, [isLive, onTimelineUpdate, timelineDuration]);
  
  // Get time range label
  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case '1h':
        return 'Last Hour';
      case '12h':
        return '12 Hours';
      case '24h':
        return '24 Hours';
      case '7d':
        return 'Week';
      default:
        return '12 Hours';
    }
  };

  // Handle time range change
  const handleTimeRangeChange = (newRange) => {
    const oldDuration = getTimelineDuration();
    const oldPosition = playheadPosition;
    
    setTimeRange(newRange);
    
    // Calculate the current timestamp before changing the range
    const currentTimestamp = (oldPosition / 100) * oldDuration;
    
    // Calculate new position in the new time range
    const newDuration = timeRangeToSeconds(newRange);
    const newPosition = (currentTimestamp / newDuration) * 100;
    
    // If in live mode, maintain the 80% position
    if (isLive) {
      setPlayheadPosition(80);
    } else {
      // Otherwise, maintain the relative position in the timeline
      setPlayheadPosition(Math.min(100, Math.max(0, newPosition)));
    }
  };

  // Add helper function to convert time range to seconds
  const timeRangeToSeconds = (range) => {
    switch (range) {
      case '1h':
        return 60 * 60;
      case '12h':
        return 12 * 60 * 60;
      case '24h':
        return 24 * 60 * 60;
      case '7d':
        return 7 * 24 * 60 * 60;
      default:
        return 12 * 60 * 60;
    }
  };

  // Modify generateTimeMarkers to handle different time ranges
  const generateTimeMarkers = () => {
    const markers = [];
    let segments;
    let subMarkersPerSegment;
    
    switch (timeRange) {
      case '1h':
        segments = 12; // One marker every 5 minutes
        subMarkersPerSegment = 4; // Sub-markers every minute
        break;
      case '12h':
        segments = 12; // One marker per hour
        subMarkersPerSegment = 2; // Sub-markers every 30 minutes
        break;
      case '24h':
        segments = 24; // One marker per hour
        subMarkersPerSegment = 1; // Sub-markers every 30 minutes
        break;
      default:
        segments = 12;
        subMarkersPerSegment = 2;
    }

    // Generate main markers
    for (let i = 0; i <= segments; i++) {
      const position = (i / segments) * 100;
      markers.push(
        <React.Fragment key={`marker-${i}`}>
          <TimeMarker 
            position={position} 
            className="hour" 
          />
          <TimeMarkerLabel 
            position={position}
          >
            {formatTimestamp(position)}
          </TimeMarkerLabel>
        </React.Fragment>
      );

      // Add sub-markers between main markers
      if (i < segments) {
        for (let j = 1; j <= subMarkersPerSegment; j++) {
          const subPosition = ((i + j/(subMarkersPerSegment + 1)) / segments) * 100;
          markers.push(
            <TimeMarker 
              key={`submarker-${i}-${j}`}
              position={subPosition}
            />
          );
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
          title={`${detection.type === 'human' ? 'Person' : 'Vehicle'} detected at ${formatDetailedTimestamp(position)}`}
          onClick={(e) => {
            e.stopPropagation(); // Prevent timeline click
            handleEventMarkerClick(detection.timestamp);
          }}
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
  
  // Handle clicks outside date picker
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle date range selection
  const handleDateRangeSelect = () => {
    if (!startDate || !endDate) return;
    
    setIsHistoricalMode(true);
    setIsLive(false);
    setShowDatePicker(false);
    // Reset playhead to start of selected range
    setPlayheadPosition(0);
    setIsPlaying(false);
    
    // Here you would typically fetch historical data for the selected date range
    // For now, we'll just use mock data
    const allMockDetections = {};
    for (let i = 1; i <= 10; i++) {
      allMockDetections[i] = generateHistoricalDetections(i, new Date(startDate), new Date(endDate));
    }
    mockDetectionsRef.current = allMockDetections;
  };

  // Generate historical detections between start and end dates
  const generateHistoricalDetections = (cameraId, startDate, endDate) => {
    let seed = cameraId * 1000;
    const baseDetections = Math.floor(seededRandom(seed) * 15) + 15;
    const timeRange = endDate - startDate;
    const detections = [];
    
    for (let i = 0; i < baseDetections; i++) {
      seed += i;
      const timestamp = startDate.getTime() + (seededRandom(seed * 3) * timeRange);
      const type = seededRandom(seed * 7) > 0.5 ? 'human' : 'vehicle';
      
      detections.push({
        id: `${cameraId}-${i}`,
        cameraId,
        timestamp: Math.floor((timestamp - startDate.getTime()) / 1000),
        type,
        confidence: seededRandom(seed * 11) * 0.3 + 0.7
      });
    }
    
    return detections.sort((a, b) => a.timestamp - b.timestamp);
  };

  // Reset historical mode
  const handleResetHistorical = () => {
    setIsHistoricalMode(false);
    setStartDate('');
    setEndDate('');
    setTimeRange('12h');
    setPlayheadPosition(30);
    
    // Regenerate regular detections
    const allMockDetections = {};
    for (let i = 1; i <= 10; i++) {
      allMockDetections[i] = generateMockDetections(i);
    }
    mockDetectionsRef.current = allMockDetections;
  };

  // Format timestamp for historical mode
  const formatHistoricalTimestamp = (seconds) => {
    if (!startDate || !isHistoricalMode) return formatTimestamp(seconds);
    
    const start = new Date(startDate);
    const date = new Date(start.getTime() + (seconds * 1000));
    
    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Toggle crop mode
  const toggleCropMode = () => {
    if (!isCropping) {
      setIsCropping(true);
      setCropStart(playheadPosition);
      setCropEnd(Math.min(playheadPosition + 20, 100)); // Default to 20% of timeline
      // Pause playback when entering crop mode
      setIsPlaying(false);
      setIsLive(false);
    } else {
      setIsCropping(false);
      setCropStart(null);
      setCropEnd(null);
    }
  };

  // Handle crop marker drag
  const handleCropMarkerMouseDown = (e, marker) => {
    e.stopPropagation(); // Prevent timeline click
    e.preventDefault(); // Prevent text selection
    setIsDraggingCrop(marker);
    
    const handleMouseMove = (e) => {
      if (!timelineRef.current) return;
      
      const rect = timelineRef.current.getBoundingClientRect();
      const position = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      
      if (marker === 'start') {
        if (position < (cropEnd - 1)) { // Prevent start from passing end
          setCropStart(position);
        }
      } else if (marker === 'end') {
        if (position > (cropStart + 1)) { // Prevent end from passing start
          setCropEnd(position);
        }
      }
    };
    
    const handleMouseUp = () => {
      setIsDraggingCrop(null);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  // Handle save crop
  const handleSaveCrop = () => {
    if (!cropStart || !cropEnd) return;
    
    const startTime = (cropStart / 100) * timelineDuration;
    const endTime = (cropEnd / 100) * timelineDuration;
    
    // Format times for display
    const startTimeFormatted = formatDetailedTimestamp(startTime);
    const endTimeFormatted = formatDetailedTimestamp(endTime);
    
    // Here you would typically handle the actual video cropping
    console.log(`Saving video clip from ${startTimeFormatted} to ${endTimeFormatted}`);
    
    // Reset crop mode
    setIsCropping(false);
    setCropStart(null);
    setCropEnd(null);
  };

  // Modify the generateRecordingPeriods callback to remove unnecessary dependencies
  const generateRecordingPeriods = useCallback(() => {
    const recordingWindow = 300; // 5 minutes in seconds
    const sortedDetections = getCurrentCameraDetections();
    const periods = [];
    
    if (!sortedDetections.length) {
      return [{
        start: 0,
        end: 100,
        isRecording: false
      }];
    }

    let currentPeriod = {
      start: (sortedDetections[0].timestamp / timelineDuration) * 100,
      end: (sortedDetections[0].timestamp / timelineDuration) * 100,
      isRecording: true
    };

    // Process each detection
    for (let i = 1; i < sortedDetections.length; i++) {
      const currentTime = (sortedDetections[i].timestamp / timelineDuration) * 100;
      const timeSinceLastDetection = sortedDetections[i].timestamp - sortedDetections[i-1].timestamp;

      if (timeSinceLastDetection > recordingWindow) {
        // End current recording period
        currentPeriod.end = (sortedDetections[i-1].timestamp / timelineDuration) * 100 + 2;
        periods.push(currentPeriod);

        // Add non-recording period
        if (currentTime - currentPeriod.end > 1) {
          periods.push({
            start: currentPeriod.end,
            end: currentTime,
            isRecording: false
          });
        }

        // Start new recording period
        currentPeriod = {
          start: currentTime,
          end: currentTime,
          isRecording: true
        };
      } else {
        // Extend current recording period
        currentPeriod.end = currentTime;
      }
    }

    // Add final recording period
    currentPeriod.end = Math.min(currentPeriod.end + 2, 100);
    periods.push(currentPeriod);

    // Fill gaps at start and end
    const allPeriods = [];
    
    if (periods[0].start > 0) {
      allPeriods.push({
        start: 0,
        end: periods[0].start,
        isRecording: false
      });
    }

    allPeriods.push(...periods);

    if (periods[periods.length - 1].end < 100) {
      allPeriods.push({
        start: periods[periods.length - 1].end,
        end: 100,
        isRecording: false
      });
    }

    return allPeriods;
  }, [activeCamera, timelineDuration]); // Remove unnecessary dependencies

  // Update recording periods with debouncing
  useEffect(() => {
    // Skip initial render to prevent double updates
    if (recordingPeriodsInitialRender.current) {
      recordingPeriodsInitialRender.current = false;
      return;
    }

    const newPeriods = generateRecordingPeriods();
    if (JSON.stringify(recordingPeriods) !== JSON.stringify(newPeriods)) {
      setRecordingPeriods(newPeriods);
    }
  }, [activeCamera, timeRange, generateRecordingPeriods]);

  // Update the live interval effect to prevent infinite updates
  useEffect(() => {
    let liveInterval;
    if (isLive) {
      // Set initial position
      setPlayheadPosition(80);
      
      // Update time display every second
      liveInterval = setInterval(() => {
        const now = new Date();
        setCurrentTime(now);
        
        if (onTimelineUpdate) {
          onTimelineUpdate({
            isLive: true,
            isPlaying: true,
            playheadPosition: 80
          });
        }
      }, 1000);
    }
    return () => {
      if (liveInterval) clearInterval(liveInterval);
    };
  }, [isLive, onTimelineUpdate]);

  return (
    <TimelineContainer>
      <ControlsRow>
        <LeftControls>
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

          <PlaybackGroup>
            <ControlButton 
              onClick={() => {
                setPlayheadPosition(prev => Math.max(0, prev - 1));
                if (isLive) setIsLive(false);
              }} 
              title="Skip Backward"
              disabled={isCropping}
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>replay_10</span>
            </ControlButton>
            <ControlButton
              onClick={togglePlayPause}
              className="primary"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              <span className="material-icons">
                {isPlaying ? 'pause' : 'play_arrow'}
              </span>
            </ControlButton>
            <ControlButton 
              onClick={() => {
                setPlayheadPosition(prev => Math.min(100, prev + 1));
                if (isLive) setIsLive(false);
              }} 
              title="Skip Forward"
              disabled={isCropping}
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>forward_10</span>
            </ControlButton>
            <CropButton 
              active={isCropping}
              onClick={toggleCropMode}
              title={isCropping ? "Cancel video clip selection" : "Select video clip"}
            >
              <span className="material-icons" style={{ fontSize: '16px' }}>content_cut</span>
            </CropButton>
            {isCropping && cropStart !== null && cropEnd !== null && (
              <SaveCropButton
                onClick={handleSaveCrop}
                title="Save selected video clip"
              >
                <span className="material-icons" style={{ fontSize: '16px' }}>save</span>
              </SaveCropButton>
            )}
          </PlaybackGroup>
          
          <TimeRangeSelector>
            {!isHistoricalMode ? (
              <>
                <TimeRangeButton 
                  active={timeRange === '1h'} 
                  onClick={() => handleTimeRangeChange('1h')}
                  title="Show last hour"
                >
                  <span className="material-icons">schedule</span>
                  1h
                </TimeRangeButton>
                <TimeRangeButton 
                  active={timeRange === '12h'} 
                  onClick={() => handleTimeRangeChange('12h')}
                  title="Show last 12 hours"
                >
                  12h
                </TimeRangeButton>
                <TimeRangeButton 
                  active={timeRange === '24h'} 
                  onClick={() => handleTimeRangeChange('24h')}
                  title="Show last 24 hours"
                >
                  24h
                </TimeRangeButton>
              </>
            ) : (
              <DateRangeButton 
                active={true}
                onClick={handleResetHistorical}
                title="Reset to live timeline"
              >
                <span className="material-icons">event</span>
                {new Date(startDate).toLocaleDateString()} - {new Date(endDate).toLocaleDateString()}
              </DateRangeButton>
            )}
            
            {!isHistoricalMode && (
              <DateRangeButton
                active={showDatePicker}
                onClick={() => setShowDatePicker(!showDatePicker)}
                title="Select custom date range"
              >
                <span className="material-icons">history</span>
                Historical
              </DateRangeButton>
            )}
          </TimeRangeSelector>
          
          <DateRangePopup show={showDatePicker} ref={datePickerRef}>
            <div className="date-inputs">
              <div className="date-input-group">
                <label>Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className="date-input-group">
                <label>End Date & Time</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
            </div>
            <div className="actions">
              <DateRangeAction onClick={() => setShowDatePicker(false)}>
                Cancel
              </DateRangeAction>
              <DateRangeAction 
                primary 
                onClick={handleDateRangeSelect}
                disabled={!startDate || !endDate}
              >
                View Timeline
              </DateRangeAction>
            </div>
          </DateRangePopup>
        </LeftControls>

        <CenterControls>
          <ActiveCameraBadge>
            <span className="material-icons">videocam</span>
            <span className="camera-name">{getActiveCameraName()}</span>
          </ActiveCameraBadge>
        </CenterControls>
        
        <TimeDisplayGroup>
          <TimeRangeDisplay>
            <span className="material-icons">schedule</span>
            {isHistoricalMode ? 'Historical View' : getTimeRangeLabel()}
          </TimeRangeDisplay>
          <TimeDisplay>
            {isHistoricalMode ? formatHistoricalTimestamp(getCurrentTimestamp()) : formatDetailedTimestamp(getCurrentTimestamp())}
          </TimeDisplay>
          {!isHistoricalMode && (
            <LiveButton 
              isLive={isLive} 
              onClick={toggleLive}
              title={isLive ? "Exit live mode" : "Go live"}
            >
              <span className="material-icons">fiber_manual_record</span>
              LIVE
            </LiveButton>
          )}
        </TimeDisplayGroup>
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
          
          {/* Add FutureTimeOverlay */}
          <FutureTimeOverlay 
            currentPosition={80} 
            isLive={isLive}
          />
          
          {/* Update recording periods rendering */}
          {recordingPeriods.map((period, index) => (
            <RecordingBar
              key={`recording-${index}`}
              startPosition={period.start}
              endPosition={period.end}
              isRecording={period.isRecording}
            />
          ))}
          
          {isCropping && cropStart !== null && cropEnd !== null && (
            <>
              <CropSelection
                startPosition={cropStart}
                endPosition={cropEnd}
              />
              <CropMarker 
                position={cropStart}
                isStart={true}
                onMouseDown={(e) => handleCropMarkerMouseDown(e, 'start')}
              />
              <CropMarker 
                position={cropEnd}
                isStart={false}
                onMouseDown={(e) => handleCropMarkerMouseDown(e, 'end')}
              />
            </>
          )}
          
          <PlayheadMarker 
            position={playheadPosition} 
            onMouseDown={handlePlayheadMouseDown}
            style={{ display: isCropping ? 'none' : 'block' }}
          />
        </TimelineTrack>
      </TimelineTrackContainer>
    </TimelineContainer>
  );
};

export default TimelineControls; 