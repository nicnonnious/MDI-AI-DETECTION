import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import './App.css';
import CameraView from './components/CameraView';
import CameraSelector from './components/CameraSelector';
import TimelineControls from './components/TimelineControls';
import AlertPanel from './components/AlertPanel';
import SettingsPanel from './components/SettingsPanel';
import SmartSearchPanel from './components/SmartSearchPanel';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import SavedViewsManager from './components/SavedViewsManager';
import SuperAdminPanel from './components/SuperAdminPanel';
import LoginPage from './components/LoginPage';
// Import mock backend functions
import { fetchDetections } from './mockBackend';
// Import the mockAlerts array to get the alert count
import { mockAlerts } from './mockAlerts';
import { standardCameras } from './mockBackend';

// Add Material Icons for the control buttons
import '@fontsource/roboto';

// Add a link to Material Icons
const IconsLink = () => {
  return (
    <link
      href="https://fonts.googleapis.com/icon?family=Material+Icons"
      rel="stylesheet"
    />
  );
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #0f0f0f;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
  z-index: 10;
`;

const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  color: #3498db;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  align-items: center;
`;

const TabGroup = styled.div`
  display: flex;
  margin-left: 20px;
`;

const Tab = styled.div`
  padding: 8px 16px;
  background-color: ${props => props.active ? '#2c2c2c' : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: ${props => props.active ? 'white' : '#ccc'};
  
  &:hover {
    background-color: ${props => props.active ? '#2c2c2c' : '#1e1e1e'};
  }
  
  .alert-indicator {
    width: 8px;
    height: 8px;
    background-color: #e74c3c;
    border-radius: 50%;
    margin-left: 5px;
  }
`;

const ProfileButton = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  position: relative;
  
  &:hover {
    background-color: #2980b9;
  }
`;

const AdminBadge = styled.div`
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: #e74c3c;
  border: 2px solid #1a1a1a;
  display: flex;
  align-items: center;
  justify-content: center;
  
  .material-icons {
    font-size: 8px;
    color: white;
  }
`;

const ProfileDropdown = styled.div`
  position: absolute;
  top: 45px;
  right: 0;
  width: 220px;
  background-color: #2c2c2c;
  border-radius: 4px;
  border: 1px solid #444;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  z-index: 100;
  display: ${props => props.isOpen ? 'block' : 'none'};
  overflow: hidden;
`;

const ProfileHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid #444;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ProfileAvatar = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: #3498db;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.div`
  color: white;
  font-weight: 500;
  margin-bottom: 4px;
`;

const ProfileEmail = styled.div`
  color: #aaa;
  font-size: 12px;
`;

const ProfileMenuItems = styled.div`
  padding: 8px 0;
`;

const ProfileMenuItem = styled.div`
  padding: 10px 15px;
  color: ${props => props.danger ? '#e74c3c' : 'white'};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:hover {
    background-color: ${props => props.danger ? 'rgba(231, 76, 60, 0.1)' : '#3a3a3a'};
  }
  
  .material-icons {
    font-size: 18px;
    opacity: 0.8;
  }
`;

const AdminProfileMenuItem = styled(ProfileMenuItem)`
  background-color: rgba(52, 152, 219, 0.1);
  border-radius: 4px;
  margin: 0 8px;
  
  &:hover {
    background-color: rgba(52, 152, 219, 0.2);
  }
  
  .material-icons {
    color: #3498db;
  }
`;

const LayoutSelector = styled.div`
  position: relative;
`;

const LayoutButton = styled.button`
  display: flex;
  align-items: center;
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 6px 12px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: #333;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const LayoutDropdown = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #2c2c2c;
  border: 1px solid #444;
  border-radius: 4px;
  width: 150px;
  z-index: 10;
  margin-top: 5px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const LayoutOption = styled.div`
  padding: 8px 12px;
  color: ${props => props.active ? '#3498db' : 'white'};
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  
  &:hover {
    background-color: #3a3a3a;
  }
  
  svg {
    margin-right: 8px;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
  position: relative;
`;

const CameraViewContainer = styled.div`
  flex: ${props => props.isAlertsDocked ? '0.7' : '1'};
  padding: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: flex 0.3s ease;
  position: relative;
`;

const CameraContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 6px;
  background-color: #181818;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
`;

const CameraStatusTabs = styled.div`
  display: flex;
  margin-top: 15px;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
`;

const CameraStatusTab = styled.div`
  flex: 1;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background-color: ${props => props.online 
    ? props.active ? '#234941' : '#1e3a3a' 
    : props.active ? '#412828' : '#3a2222'};
  color: white;
  border-right: 1px solid ${props => props.online ? '#285245' : '#522828'};
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  
  &:last-child {
    border-right: none;
  }
  
  &:hover {
    background-color: ${props => props.online ? '#234941' : '#412828'};
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    background-color: ${props => props.active 
      ? (props.online ? '#2ecc71' : '#e74c3c') 
      : 'transparent'};
    transition: all 0.2s ease;
  }
  
  .status-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: ${props => props.online ? '#2ecc71' : '#e74c3c'};
    box-shadow: 0 0 8px ${props => props.online ? 'rgba(46, 204, 113, 0.6)' : 'rgba(231, 76, 60, 0.6)'};
    position: relative;
    
    ${props => props.online && props.active && `
      &::after {
        content: '';
        position: absolute;
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid #2ecc71;
        animation: pulse 1.5s infinite;
      }
      
      @keyframes pulse {
        0% { transform: scale(1); opacity: 1; }
        70% { transform: scale(1.5); opacity: 0; }
        100% { transform: scale(1); opacity: 0; }
      }
    `}
  }
  
  .count {
    font-weight: bold;
    margin-right: 4px;
    transition: all 0.2s ease;
    ${props => props.active && 'font-size: 16px;'}
  }
  
  &:hover .count {
    color: ${props => props.online ? '#2ecc71' : '#e74c3c'};
  }
`;

const TimelineControlsWrapper = styled.div`
  width: 100%;
  margin-top: auto;
`;

const DockedAlertsContainer = styled.div`
  flex: 0.3;
  display: ${props => props.isDocked ? 'flex' : 'none'};
  flex-direction: column;
  border-left: 1px solid #333;
  background-color: #1a1a1a;
  overflow: hidden;
  transition: flex 0.3s ease;
  
  @media (max-width: 1200px) {
    flex: 0.4;
  }
  
  @media (max-width: 768px) {
    flex: 0.5;
  }
`;

const DockedAlertsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #2c2c2c;
  border-bottom: 1px solid #444;
  
  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
    
    .material-icons {
      color: #e74c3c;
    }
    
    .alert-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 22px;
      height: 22px;
      background-color: #e74c3c;
      color: white;
      border-radius: 11px;
      font-size: 12px;
      padding: 0 6px;
      margin-left: 6px;
    }
  }
  
  .header-actions {
    display: flex;
    gap: 8px;
  }
  
  .header-button {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }
`;

const DockedAlertsContent = styled.div`
  flex: 1;
  overflow: hidden;
`;

const AlertOverlay = styled.div`
  position: absolute;
  top: 80px;
  right: 280px; /* Adjusted to leave space for CameraSelector */
  width: 400px;
  max-height: calc(100% - 140px);
  background-color: rgba(30, 30, 30, 0.95);
  border-radius: 8px;
  border: 1px solid #444;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease;
  transform: ${props => props.show ? 'translateY(0)' : 'translateY(-20px)'};
  opacity: ${props => props.show && !props.isDocked ? 1 : 0};
  pointer-events: ${props => props.show && !props.isDocked ? 'auto' : 'none'};
  backdrop-filter: blur(4px);
  resize: both;
  
  @media (max-width: 768px) {
    width: 90%;
    right: 5%;
    left: 5%;
  }
`;

const AlertOverlayHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #2c2c2c;
  border-bottom: 1px solid #444;
  cursor: move;
  
  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
    
    .material-icons {
      color: #e74c3c;
    }
    
    .alert-count {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 22px;
      height: 22px;
      background-color: #e74c3c;
      color: white;
      border-radius: 11px;
      font-size: 12px;
      padding: 0 6px;
      margin-left: 6px;
    }
  }
  
  .header-actions {
    display: flex;
    gap: 8px;
  }
  
  .header-button {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }
`;

const AlertOverlayContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  /* Content will be provided by the AlertPanel component */
`;

// Add a styled component for the modal
const AdminModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: ${props => props.show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const AdminModalContent = styled.div`
  background-color: #2c2c2c;
  border-radius: 8px;
  width: 420px;
  max-width: 90%;
  border: 1px solid #444;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  overflow: hidden;
`;

const AdminModalHeader = styled.div`
  background-color: #3498db;
  padding: 15px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  
  h2 {
    margin: 0;
    color: white;
    font-size: 18px;
    font-weight: 500;
  }
  
  .material-icons {
    color: white;
    font-size: 24px;
  }
`;

const AdminModalBody = styled.div`
  padding: 20px;
  color: #eee;
  
  p {
    margin: 0 0 20px 0;
    line-height: 1.5;
  }
`;

const AdminLoginForm = styled.div`
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 6px;
  padding: 15px;
  margin-bottom: 20px;
  
  p {
    margin: 0 0 15px 0;
    font-size: 13px;
    color: #bbb;
  }
`;

const AdminLoginOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  .option-name {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .material-icons {
    font-size: 20px;
    color: #3498db;
  }
`;

const AdminModalFooter = styled.div`
  padding: 15px 20px;
  background-color: #222;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  border-top: 1px solid #444;
`;

const AdminButton = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &.secondary {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.2);
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.15);
    }
  }
  
  &.primary {
    background-color: #3498db;
    color: white;
    border: none;
    
    &:hover {
      background-color: #2980b9;
    }
  }
`;

// Add a styled component for admin activity log
const AdminActivityLog = styled.div`
  margin-top: 20px;
  
  h3 {
    font-size: 14px;
    font-weight: 500;
    margin: 0 0 10px 0;
    color: #eee;
    display: flex;
    align-items: center;
    gap: 8px;
    
    .material-icons {
      font-size: 18px;
      color: #3498db;
    }
  }
`;

const ActivityList = styled.div`
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 2px;
  max-height: 120px;
  overflow-y: auto;
  margin-bottom: 15px;
`;

const ActivityItem = styled.div`
  padding: 8px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 12px;
  color: #bbb;
  display: flex;
  align-items: center;
  gap: 10px;
  
  &:last-child {
    border-bottom: none;
  }
  
  .activity-icon {
    min-width: 18px;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background-color: ${props => props.type === 'login' ? '#2ecc71' : 
                              props.type === 'config' ? '#f39c12' : 
                              props.type === 'security' ? '#e74c3c' : '#3498db'};
    display: flex;
    align-items: center;
    justify-content: center;
    
    .material-icons {
      font-size: 12px;
      color: white;
    }
  }
  
  .activity-info {
    flex: 1;
  }
  
  .activity-time {
    color: #777;
    margin-left: auto;
    white-space: nowrap;
  }
`;

const QuickActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
`;

const QuickActionButton = styled.button`
  flex: 1;
  min-width: 140px;
  padding: 12px 10px;
  background-color: rgba(52, 152, 219, 0.1);
  border: 1px solid rgba(52, 152, 219, 0.2);
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  
  .material-icons {
    font-size: 24px;
    color: #3498db;
  }
  
  .action-name {
    font-size: 12px;
    font-weight: 500;
  }
  
  &:hover {
    background-color: rgba(52, 152, 219, 0.2);
    transform: translateY(-2px);
  }
`;

// Mock recent admin activities data
const recentAdminActivities = [
  { id: 1, type: 'security', action: 'User permissions updated', user: 'George M.', time: '10:32 AM', icon: 'security' },
  { id: 2, type: 'config', action: 'Camera 5 configuration changed', user: 'Admin', time: '09:15 AM', icon: 'settings' },
  { id: 3, type: 'login', action: 'Admin login successful', user: 'System', time: 'Yesterday', icon: 'login' },
  { id: 4, type: 'login', action: 'Password reset for user Tech1', user: 'Admin', time: 'Yesterday', icon: 'password' }
];

function App() {
  const [detections, setDetections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCamera, setActiveCamera] = useState(1);
  const [layoutDropdownOpen, setLayoutDropdownOpen] = useState(false);
  const [selectedLayout, setSelectedLayout] = useState('single'); // 'single', '2x2', '3x3'
  const [previousLayout, setPreviousLayout] = useState('2x2'); // Store the previous layout for toggle functionality
  const [showAlertsPanel, setShowAlertsPanel] = useState(false);
  const [isAlertsDocked, setIsAlertsDocked] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSmartSearch, setShowSmartSearch] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const alertOverlayRef = useRef(null);
  const [cameraFilterMode, setCameraFilterMode] = useState('all'); // 'all', 'online', 'offline'
  const [showSavedViews, setShowSavedViews] = useState(false);
  const [selectedCameras, setSelectedCameras] = useState([1]); // Default to camera 1
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [showSuperAdmin, setShowSuperAdmin] = useState(false);
  const [activeSuperAdminSection, setActiveSuperAdminSection] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // Timeline integration state
  const [playheadPosition, setPlayheadPosition] = useState(30); // Starting position as percentage
  const [isLiveMode, setIsLiveMode] = useState(true); // Track if timeline is in live mode
  const [isPlaying, setIsPlaying] = useState(true); // Track if videos are playing
  
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    role: "",
    initials: "",
    isAdmin: false
  });
  
  const [cameras, setCameras] = useState(() => {
    const savedCameras = localStorage.getItem('mdi_cameras');
    if (savedCameras) {
      try {
        return JSON.parse(savedCameras);
      } catch (e) {
        console.error('Error parsing saved cameras:', e);
        // Fallback to standard cameras
        return standardCameras;
      }
    } else {
      // Default cameras if none in localStorage
      return standardCameras;
    }
  });
  
  useEffect(() => {
    const handleStorageChange = () => {
      const savedCameras = localStorage.getItem('mdi_cameras');
      if (savedCameras) {
        try {
          setCameras(JSON.parse(savedCameras));
        } catch (e) {
          console.error('Error parsing saved cameras from storage event:', e);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Force reset localStorage to standardized cameras on first load
  useEffect(() => {
    const hasReset = localStorage.getItem('cameras_reset_v1');
    if (!hasReset) {
      console.log('Resetting camera data to ensure consistency...');
      localStorage.setItem('mdi_cameras', JSON.stringify(standardCameras));
      localStorage.setItem('cameras_reset_v1', 'true');
      console.log('Camera data reset complete. All standardized cameras now available.');
    }
  }, []);

  const onlineCameras = cameras.filter(camera => camera.isLive).length;
  const offlineCameras = cameras.filter(camera => !camera.isLive).length;

  const alertCount = mockAlerts.length;

  useEffect(() => {
    // Fetch detections when component mounts
    setLoading(true);
    fetchDetections()
      .then(data => {
        setDetections(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching detections:", err);
        setError("Failed to load detections. Please try again.");
        setLoading(false);
      });
  }, []);

  const activeDetections = detections.filter(d => d.id <= 3); // Just showing first 3 for demo

  const toggleLayoutDropdown = () => {
    setLayoutDropdownOpen(!layoutDropdownOpen);
  };

  const selectLayout = (layout) => {
    setSelectedLayout(layout);
    setLayoutDropdownOpen(false);
  };

  const handleCameraFocus = (cameraId, changeLayout = true) => {
    console.log(`handleCameraFocus called with camera ${cameraId}, changeLayout: ${changeLayout}`);
    
    // Always update the active camera immediately
    setActiveCamera(cameraId);
    
    if (changeLayout) {
      // If we're not already in single view, save the current layout as previous
      if (selectedLayout !== 'single') {
        console.log(`Saving current layout '${selectedLayout}' as previous layout`);
        setPreviousLayout(selectedLayout);
      }
      
      // Switch to single view when explicitly requested (double-click/fullscreen)
      console.log(`Changing to single view with camera ${cameraId}`);
      setSelectedLayout('single');
      setSelectedCameras([cameraId]);
    } else {
      // Just update the active camera for the timeline without changing layout
      console.log(`Timeline now focused on Camera ${cameraId} without changing layout or order`);
      
      // Check if camera is not already in the grid
      if (!selectedCameras.includes(cameraId)) {
        console.log(`Camera ${cameraId} not in grid, adding it to the grid`);
        // Add it to the grid, preserving positions of existing cameras as much as possible
        const maxCameras = selectedLayout === '2x2' ? 4 : 9;
        
        // Only drop the last camera if we're at max capacity
        if (selectedCameras.length >= maxCameras) {
          const updatedCameras = [...selectedCameras.slice(0, maxCameras - 1), cameraId];
          console.log(`Grid at capacity, dropping last camera. Updated selectedCameras:`, updatedCameras);
          setSelectedCameras(updatedCameras);
        } else {
          // Otherwise just add the new camera
          const updatedCameras = [...selectedCameras, cameraId];
          console.log(`Added camera to grid. Updated selectedCameras:`, updatedCameras);
          setSelectedCameras(updatedCameras);
        }
      } else {
        // Even if the camera is already in the grid, ensure it's considered the active one
        console.log(`Camera ${cameraId} already in grid, setting as active timeline camera`);
        
        // Force a re-render by creating a new array with the same elements
        // This can help trigger component updates that depend on selectedCameras
        setSelectedCameras([...selectedCameras]);
      }
    }
    
    // Force a timeline update by updating the playhead position slightly
    // This helps ensure the timeline immediately affects the newly selected camera
    setTimeout(() => {
      setPlayheadPosition(prev => {
        // If at the boundaries, move in by 0.01%
        if (prev >= 100) return 99.99;
        if (prev <= 0) return 0.01;
        // Otherwise just make a tiny adjustment to trigger an update
        return prev + 0.01;
      });
    }, 10);
  };

  const toggleAlertsPanel = () => {
    setShowAlertsPanel(!showAlertsPanel);
    // If alerts panel is being closed and is currently docked, undock it
    if (showAlertsPanel && isAlertsDocked) {
      setIsAlertsDocked(false);
    }
  };
  
  const toggleDockMode = () => {
    setIsAlertsDocked(!isAlertsDocked);
    
    // Reset position if switching from floating to docked
    if (!isAlertsDocked && alertOverlayRef.current) {
      alertOverlayRef.current.style.left = '';
      alertOverlayRef.current.style.top = '';
      alertOverlayRef.current.style.right = '280px';
    }
  };

  // Function to toggle between single view and previous multi-view layout
  const toggleCameraLayout = useCallback(() => {
    console.log(`Toggling camera layout from '${selectedLayout}' to '${previousLayout}'`);
    if (selectedLayout === 'single') {
      // We're in single view, switch back to previous layout
      setSelectedLayout(previousLayout);
    } else {
      // We're in a multi-view, save current and switch to single
      setPreviousLayout(selectedLayout);
      setSelectedLayout('single');
    }
  }, [selectedLayout, previousLayout]);
  
  // Make the toggle function globally available for the CameraView component
  useEffect(() => {
    const toggleFn = () => {
      // Debounce the toggle to prevent multiple rapid calls
      if (window.toggleCameraTimeout) {
        clearTimeout(window.toggleCameraTimeout);
      }
      window.toggleCameraTimeout = setTimeout(() => {
        toggleCameraLayout();
        delete window.toggleCameraTimeout;
      }, 300);
    };
    
    window.toggleCameraLayout = toggleFn;
    
    return () => {
      // Clean up when component unmounts
      if (window.toggleCameraTimeout) {
        clearTimeout(window.toggleCameraTimeout);
      }
      delete window.toggleCameraLayout;
      delete window.toggleCameraTimeout;
    };
  }, [toggleCameraLayout]);

  const singleViewIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="18" height="18" rx="2" />
    </svg>
  );
  
  const twoByTwoIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="8" height="8" rx="1" />
      <rect x="13" y="3" width="8" height="8" rx="1" />
      <rect x="3" y="13" width="8" height="8" rx="1" />
      <rect x="13" y="13" width="8" height="8" rx="1" />
    </svg>
  );
  
  const threeByThreeIcon = (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="5" height="5" rx="1" />
      <rect x="9.5" y="3" width="5" height="5" rx="1" />
      <rect x="16" y="3" width="5" height="5" rx="1" />
      <rect x="3" y="9.5" width="5" height="5" rx="1" />
      <rect x="9.5" y="9.5" width="5" height="5" rx="1" />
      <rect x="16" y="9.5" width="5" height="5" rx="1" />
      <rect x="3" y="16" width="5" height="5" rx="1" />
      <rect x="9.5" y="16" width="5" height="5" rx="1" />
      <rect x="16" y="16" width="5" height="5" rx="1" />
    </svg>
  );

  const handleLogin = (profile) => {
    setUserProfile(profile);
    setIsLoggedIn(true);
  };
  
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserProfile({
      name: "",
      email: "",
      role: "",
      initials: "",
      isAdmin: false
    });
    setProfileDropdownOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownOpen && !event.target.closest('.profile-menu')) {
        setProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileDropdownOpen]);

  useEffect(() => {
    if (!showAlertsPanel || isAlertsDocked) return;
    
    const alertOverlay = document.getElementById('alert-overlay');
    const alertHeader = document.getElementById('alert-header');
    
    if (!alertOverlay || !alertHeader) return;
    
    let isDragging = false;
    let offsetX, offsetY;
    
    const handleMouseDown = (e) => {
      // Only allow dragging from the header
      if (e.target.closest('#alert-header')) {
        isDragging = true;
        offsetX = e.clientX - alertOverlay.getBoundingClientRect().left;
        offsetY = e.clientY - alertOverlay.getBoundingClientRect().top;
      }
    };
    
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      
      // Calculate boundaries to keep the overlay within the window
      const maxX = window.innerWidth - alertOverlay.offsetWidth;
      const maxY = window.innerHeight - alertOverlay.offsetHeight;
      
      alertOverlay.style.left = `${Math.max(0, Math.min(x, maxX))}px`;
      alertOverlay.style.top = `${Math.max(0, Math.min(y, maxY))}px`;
      
      // Remove the right position when dragging starts
      alertOverlay.style.right = 'auto';
    };
    
    const handleMouseUp = () => {
      isDragging = false;
    };
    
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [showAlertsPanel, isAlertsDocked]);

  useEffect(() => {
    // When camera filter changes, we might want to update the camera selector UI
    // This would connect to real functionality in a full implementation
    console.log("Camera filter changed to:", cameraFilterMode);
  }, [cameraFilterMode]);

  if (loading) {
    return <div className="loading">Loading data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  const getCurrentLayoutIcon = () => {
    if (selectedLayout === 'single') return singleViewIcon;
    if (selectedLayout === '2x2') return twoByTwoIcon;
    return threeByThreeIcon;
  };

  const toggleCameraFilter = (mode) => {
    setCameraFilterMode(prevMode => prevMode === mode ? 'all' : mode);
  };

  const handleLoadSavedView = (view) => {
    setSelectedLayout(view.layout);
    setActiveCamera(view.activeCamera);
    setSelectedCameras(view.cameras);
    // Close the saved views panel
    setShowSavedViews(false);
  };

  const handleOpenAdminPanel = () => {
    // Close the profile dropdown
    setProfileDropdownOpen(false);
    // Show the admin modal
    setShowAdminModal(true);
  };

  const navigateToAdminPanel = (useCurrentCredentials = false, section = '') => {
    // Set the active section for SuperAdminPanel
    if (section) {
      setActiveSuperAdminSection(section);
    } else {
      setActiveSuperAdminSection('dashboard');
    }
    
    console.log(`Opening admin panel (${section || 'dashboard'}) with current credentials: ${useCurrentCredentials}`);
    
    // Close the admin modal
    setShowAdminModal(false);
    
    // Show the SuperAdminPanel
    setShowSuperAdmin(true);
  };

  const handleCloseSuperAdmin = () => {
    setShowSuperAdmin(false);
  };

  // Handle timeline controls
  const handleTimelineUpdate = (position, isLive, playing) => {
    setPlayheadPosition(position);
    setIsLiveMode(isLive);
    setIsPlaying(playing);
  };

  return (
    <AppContainer>
      <IconsLink />
      {showSuperAdmin ? (
        <SuperAdminPanel 
          onClose={handleCloseSuperAdmin} 
          activeSection={activeSuperAdminSection} 
        />
      ) : (
        <>
          <Header>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Logo>MDI AI Detection</Logo>
              <TabGroup>
                <LayoutSelector>
                  <Tab 
                    active={true} 
                    onClick={() => {
                      if (layoutDropdownOpen) {
                        setLayoutDropdownOpen(false);
                      } else {
                        toggleLayoutDropdown();
                      }
                    }}
                  >
                    {getCurrentLayoutIcon()}
                    Layout
                  </Tab>
                  <LayoutDropdown isOpen={layoutDropdownOpen}>
                    <LayoutOption 
                      active={selectedLayout === 'single'} 
                      onClick={() => selectLayout('single')}
                    >
                      {singleViewIcon} Single View
                    </LayoutOption>
                    <LayoutOption 
                      active={selectedLayout === '2x2'} 
                      onClick={() => selectLayout('2x2')}
                    >
                      {twoByTwoIcon} 2×2 Grid
                    </LayoutOption>
                    <LayoutOption 
                      active={selectedLayout === '3x3'} 
                      onClick={() => selectLayout('3x3')}
                    >
                      {threeByThreeIcon} 3×3 Grid
                    </LayoutOption>
                  </LayoutDropdown>
                </LayoutSelector>
                
                <Tab 
                  active={showSavedViews} 
                  onClick={() => setShowSavedViews(!showSavedViews)}
                >
                  <span className="material-icons">bookmark</span>
                  Saved Views
                </Tab>
                
                <Tab 
                  active={showAlertsPanel} 
                  onClick={toggleAlertsPanel}
                >
                  <span className="material-icons">notifications</span>
                  Alerts
                  <span className="alert-indicator" title="5 unresolved alerts"></span>
                </Tab>
                
                <Tab 
                  active={showAnalytics} 
                  onClick={() => setShowAnalytics(!showAnalytics)}
                >
                  <span className="material-icons">insights</span>
                  Analytics
                </Tab>
              </TabGroup>
            </div>
            <ActionButtons>
              <button className="standard-button" 
                onClick={() => setShowSmartSearch(true)}
                style={{ backgroundColor: '#7b68ee', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <span className="material-icons">search</span>
                Smart Search
              </button>
              <button className="standard-button" onClick={() => setShowSettings(true)}>Settings</button>
              
              <div className="profile-menu">
                <ProfileButton onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}>
                  {userProfile.initials}
                  {userProfile.isAdmin && (
                    <AdminBadge title="Administrator">
                      <span className="material-icons">shield</span>
                    </AdminBadge>
                  )}
                </ProfileButton>
                
                <ProfileDropdown isOpen={profileDropdownOpen}>
                  <ProfileHeader>
                    <ProfileAvatar>{userProfile.initials}</ProfileAvatar>
                    <ProfileInfo>
                      <ProfileName>{userProfile.name}</ProfileName>
                      <ProfileEmail>{userProfile.email}</ProfileEmail>
                    </ProfileInfo>
                  </ProfileHeader>
                  
                  <ProfileMenuItems>
                    <ProfileMenuItem>
                      <span className="material-icons">person</span>
                      My Profile
                    </ProfileMenuItem>
                    <ProfileMenuItem>
                      <span className="material-icons">vpn_key</span>
                      Change Password
                    </ProfileMenuItem>
                    <ProfileMenuItem>
                      <span className="material-icons">notifications</span>
                      Notification Settings
                    </ProfileMenuItem>
                    {userProfile.isAdmin && (
                      <AdminProfileMenuItem 
                        onClick={handleOpenAdminPanel}
                      >
                        <span className="material-icons">admin_panel_settings</span>
                        Admin Panel
                      </AdminProfileMenuItem>
                    )}
                    <ProfileMenuItem danger onClick={handleLogout}>
                      <span className="material-icons">exit_to_app</span>
                      Logout
                    </ProfileMenuItem>
                  </ProfileMenuItems>
                </ProfileDropdown>
              </div>
            </ActionButtons>
          </Header>
          
          <MainContent>
            <CameraViewContainer isAlertsDocked={isAlertsDocked && showAlertsPanel}>
              <CameraContent>
                <CameraView 
                  activeDetections={activeDetections} 
                  layout={selectedLayout}
                  activeCamera={activeCamera}
                  onCameraFocus={handleCameraFocus}
                  isLive={isLiveMode}
                  isPlaying={isPlaying}
                  playheadPosition={playheadPosition}
                  cameraFilterMode={cameraFilterMode}
                  selectedCameras={selectedCameras}
                />
                <TimelineControlsWrapper>
                  <TimelineControls
                    detections={detections}
                    activeCamera={activeCamera}
                    layout={selectedLayout}
                    selectedCameras={selectedCameras}
                    onTimelineUpdate={handleTimelineUpdate}
                    initialPlayheadPosition={playheadPosition}
                    initialIsLive={isLiveMode}
                    initialIsPlaying={isPlaying}
                  />
                </TimelineControlsWrapper>
              </CameraContent>
              
              <CameraStatusTabs>
                <CameraStatusTab 
                  online={true} 
                  active={cameraFilterMode === 'online'}
                  onClick={() => toggleCameraFilter('online')}
                >
                  <div className="status-icon"></div>
                  <span><span className="count">{onlineCameras}</span> Cameras Online</span>
                </CameraStatusTab>
                <CameraStatusTab 
                  online={false} 
                  active={cameraFilterMode === 'offline'}
                  onClick={() => toggleCameraFilter('offline')}
                >
                  <div className="status-icon"></div>
                  <span><span className="count">{offlineCameras}</span> Cameras Offline</span>
                </CameraStatusTab>
              </CameraStatusTabs>
            </CameraViewContainer>
            
            <DockedAlertsContainer isDocked={isAlertsDocked && showAlertsPanel}>
              <DockedAlertsHeader>
                <h2>
                  <span className="material-icons">notifications_active</span>
                  Recent Alerts
                  <span className="alert-count">{alertCount}</span>
                </h2>
                <div className="header-actions">
                  <button className="header-button" title="Refresh Alerts">
                    <span className="material-icons">refresh</span>
                  </button>
                  <button 
                    className="header-button" 
                    title="Undock" 
                    onClick={toggleDockMode}
                  >
                    <span className="material-icons">launch</span>
                  </button>
                  <button className="header-button" onClick={toggleAlertsPanel}>
                    <span className="material-icons">close</span>
                  </button>
                </div>
              </DockedAlertsHeader>
              <DockedAlertsContent>
                <AlertPanel activeCamera={activeCamera} isDocked={true} />
              </DockedAlertsContent>
            </DockedAlertsContainer>
            
            <CameraSelector
              activeCamera={activeCamera}
              onSelectCamera={(cameraId) => {
                console.log(`CameraSelector: Selected camera ${cameraId}`);
                // Simply call our improved handler function to ensure consistent behavior
                handleCameraFocus(cameraId, selectedLayout === 'single');
              }}
            />
            
            <AlertOverlay 
              show={showAlertsPanel} 
              isDocked={isAlertsDocked} 
              id="alert-overlay"
              ref={alertOverlayRef}
            >
              <AlertOverlayHeader id="alert-header">
                <h2>
                  <span className="material-icons">notifications_active</span>
                  Recent Alerts
                  <span className="alert-count">{alertCount}</span>
                </h2>
                <div className="header-actions">
                  <button className="header-button" title="Refresh Alerts">
                    <span className="material-icons">refresh</span>
                  </button>
                  <button 
                    className="header-button" 
                    title="Dock to Side" 
                    onClick={toggleDockMode}
                  >
                    <span className="material-icons">dock</span>
                  </button>
                  <button className="header-button" title="Minimize">
                    <span className="material-icons">minimize</span>
                  </button>
                  <button className="header-button" onClick={toggleAlertsPanel}>
                    <span className="material-icons">close</span>
                  </button>
                </div>
              </AlertOverlayHeader>
              <AlertOverlayContent>
                <AlertPanel activeCamera={activeCamera} isDocked={false} />
              </AlertOverlayContent>
            </AlertOverlay>
          </MainContent>
          
          <SavedViewsManager
            show={showSavedViews}
            onClose={() => setShowSavedViews(false)}
            currentLayout={selectedLayout}
            currentCameras={selectedCameras}
            activeCamera={activeCamera}
            onLoadView={handleLoadSavedView}
          />
          
          {showAnalytics && (
            <AnalyticsDashboard 
              detections={detections} 
              cameras={cameras} 
              onClose={() => setShowAnalytics(false)} 
            />
          )}
          
          {showSettings && <SettingsPanel onClose={() => setShowSettings(false)} />}
          {showSmartSearch && <SmartSearchPanel onClose={() => setShowSmartSearch(false)} />}
          
          <AdminModal show={showAdminModal}>
            <AdminModalContent>
              <AdminModalHeader>
                <span className="material-icons">admin_panel_settings</span>
                <h2>Admin Control Panel</h2>
              </AdminModalHeader>
              <AdminModalBody>
                <p>You are about to access the MDI System Administrator dashboard. This area contains sensitive settings and controls for the entire security system.</p>
                
                <AdminLoginForm>
                  <p>Choose how you would like to proceed:</p>
                  <AdminLoginOption>
                    <div className="option-name">
                      <span className="material-icons">account_circle</span>
                      Continue as {userProfile.name}
                    </div>
                    <AdminButton className="primary" onClick={() => navigateToAdminPanel(true)}>
                      Continue
                    </AdminButton>
                  </AdminLoginOption>
                  <AdminLoginOption>
                    <div className="option-name">
                      <span className="material-icons">login</span>
                      Login with different credentials
                    </div>
                    <AdminButton className="primary" onClick={() => navigateToAdminPanel(false)}>
                      New Login
                    </AdminButton>
                  </AdminLoginOption>
                </AdminLoginForm>
                
                <AdminActivityLog>
                  <h3>
                    <span className="material-icons">history</span>
                    Recent Admin Activity
                  </h3>
                  <ActivityList>
                    {recentAdminActivities.map(activity => (
                      <ActivityItem key={activity.id} type={activity.type}>
                        <div className="activity-icon">
                          <span className="material-icons">{activity.icon}</span>
                        </div>
                        <div className="activity-info">
                          <strong>{activity.action}</strong> by {activity.user}
                        </div>
                        <div className="activity-time">{activity.time}</div>
                      </ActivityItem>
                    ))}
                  </ActivityList>
                  
                  <h3>
                    <span className="material-icons">speed</span>
                    Quick Actions
                  </h3>
                  <QuickActions>
                    <QuickActionButton onClick={() => navigateToAdminPanel(true, 'users')}>
                      <span className="material-icons">people</span>
                      <span className="action-name">Users</span>
                    </QuickActionButton>
                    <QuickActionButton onClick={() => navigateToAdminPanel(true, 'cameras')}>
                      <span className="material-icons">videocam</span>
                      <span className="action-name">Cameras</span>
                    </QuickActionButton>
                    <QuickActionButton onClick={() => navigateToAdminPanel(true, 'settings')}>
                      <span className="material-icons">settings</span>
                      <span className="action-name">System</span>
                    </QuickActionButton>
                    <QuickActionButton onClick={() => navigateToAdminPanel(true, 'logs')}>
                      <span className="material-icons">receipt_long</span>
                      <span className="action-name">Logs</span>
                    </QuickActionButton>
                  </QuickActions>
                </AdminActivityLog>
              </AdminModalBody>
              <AdminModalFooter>
                <AdminButton className="secondary" onClick={() => setShowAdminModal(false)}>
                  Cancel
                </AdminButton>
              </AdminModalFooter>
            </AdminModalContent>
          </AdminModal>
        </>
      )}
    </AppContainer>
  );
}

export default App; 