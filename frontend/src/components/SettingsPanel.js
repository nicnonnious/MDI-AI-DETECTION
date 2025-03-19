import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { standardCameras } from '../mockBackend';

const SettingsPanelContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SettingsContent = styled.div`
  background-color: #1e1e1e;
  border-radius: 6px;
  width: 80%;
  max-width: 900px;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
`;

const SettingsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #333;
`;

const SettingsTitle = styled.h2`
  margin: 0;
  color: white;
  font-size: 18px;
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 24px;
  cursor: pointer;
  
  &:hover {
    color: white;
  }
`;

const SettingsBody = styled.div`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const Sidebar = styled.div`
  width: 220px;
  background-color: #252525;
  border-right: 1px solid #333;
  overflow-y: auto;
`;

const SidebarItem = styled.div`
  padding: 12px 20px;
  cursor: pointer;
  color: ${props => props.active ? 'white' : '#aaa'};
  background-color: ${props => props.active ? '#3498db' : 'transparent'};
  
  &:hover {
    background-color: ${props => props.active ? '#3498db' : '#2c2c2c'};
  }
`;

const SettingsContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const SettingSection = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 15px;
  color: white;
  font-size: 16px;
  font-weight: 500;
  border-bottom: 1px solid #333;
  padding-bottom: 10px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  color: #ccc;
  font-size: 14px;
`;

const Input = styled.input`
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
`;

const Select = styled.select`
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
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.primary ? '#3498db' : '#2c2c2c'};
  color: white;
  border: 1px solid ${props => props.primary ? '#3498db' : '#444'};
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.primary ? '#2980b9' : '#3a3a3a'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const Checkbox = styled.input`
  margin-right: 10px;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 15px;
`;

const SliderRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const Slider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  height: 5px;
  background: #444;
  border-radius: 5px;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #3498db;
    cursor: pointer;
  }
`;

const SliderValue = styled.span`
  color: #ccc;
  min-width: 30px;
  text-align: right;
`;

const CameraList = styled.div`
  background-color: #252525;
  border-radius: 4px;
  border: 1px solid #333;
  margin-bottom: 15px;
`;

const CameraItem = styled.div`
  padding: 12px 15px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &:last-child {
    border-bottom: none;
  }
`;

const CameraDetails = styled.div`
  color: #ccc;
  
  .camera-name {
    color: white;
    font-weight: 500;
    margin-bottom: 3px;
  }
  
  .camera-url {
    font-size: 12px;
    opacity: 0.7;
  }
`;

const CameraActions = styled.div`
  display: flex;
  gap: 10px;
`;

const TestConnectionResult = styled.div`
  margin-top: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: ${props => props.success ? 'rgba(46, 204, 113, 0.2)' : 'rgba(231, 76, 60, 0.2)'};
  color: ${props => props.success ? '#2ecc71' : '#e74c3c'};
  font-size: 14px;
`;

const SettingsPanel = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState('cameras');
  const [cameras, setCameras] = useState(() => {
    // Try to load cameras from localStorage
    const savedCameras = localStorage.getItem('mdi_cameras');
    if (savedCameras) {
      try {
        return JSON.parse(savedCameras);
      } catch (e) {
        console.error('Error parsing saved cameras:', e);
        return standardCameras;
      }
    } else {
      return standardCameras;
    }
  });
  
  // Save cameras to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('mdi_cameras', JSON.stringify(cameras));
  }, [cameras]);
  
  // Add Camera form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCamera, setNewCamera] = useState({
    name: '',
    url: '',
    username: '',
    password: '',
    type: 'onvif',
    enabled: true
  });
  const [testResult, setTestResult] = useState(null);
  
  // Detection settings state
  const [detectionSettings, setDetectionSettings] = useState({
    enablePersonDetection: true,
    enableVehicleDetection: true,
    enableWeaponDetection: true,
    enableLicensePlateDetection: false,
    enablePhoneDetection: false,
    confidence: 70,
    refreshRate: 5
  });
  
  // Alert settings state
  const [alertSettings, setAlertSettings] = useState({
    enableEmailAlerts: false,
    emailRecipients: '',
    enablePushNotifications: true,
    autoResolveAfter: 30,
    playSoundOnAlert: true
  });
  
  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    storageRetention: 14,
    maxStorageSize: 500,
    enableAutoUpdate: true,
    theme: 'dark',
    language: 'en'
  });
  
  // Add a function to refresh cameras from localStorage
  const refreshCamerasFromLocalStorage = () => {
    const savedCameras = localStorage.getItem('mdi_cameras');
    if (savedCameras) {
      try {
        setCameras(JSON.parse(savedCameras));
      } catch (e) {
        console.error('Error refreshing cameras from localStorage:', e);
      }
    }
  };
  
  // Update the handleAddCamera function to trigger UI updates
  const handleAddCamera = () => {
    // Create a properly formatted camera object
    const newCameraObj = {
      ...newCamera,
      id: cameras.length > 0 ? Math.max(...cameras.map(c => c.id)) + 1 : 1,
      isLive: true, // Set as live by default for testing
      rtsp_url: newCamera.url, // Add rtsp_url field for compatibility with backend format
      url: newCamera.url, // Keep url for frontend compatibility
      videoSrc: newCamera.type === 'test-video' ? newCamera.url : null, // Set videoSrc for test videos
      type: newCamera.type // Explicitly store the camera type
    };
    
    const updatedCameras = [...cameras, newCameraObj];
    setCameras(updatedCameras);
    
    // Save to localStorage
    localStorage.setItem('mdi_cameras', JSON.stringify(updatedCameras));
    
    // Force a localStorage event to update all components
    window.dispatchEvent(new Event('storage'));
    
    // Reset form state
    setNewCamera({
      name: '',
      url: '',
      username: '',
      password: '',
      type: 'onvif',
      enabled: true
    });
    setShowAddForm(false);
    
    // Show confirmation to user
    alert(`Camera "${newCameraObj.name}" has been added successfully.`);
  };
  
  // Update the handleDeleteCamera function to trigger UI updates
  const handleDeleteCamera = (id) => {
    const updatedCameras = cameras.filter(camera => camera.id !== id);
    setCameras(updatedCameras);
    
    // Save to localStorage
    localStorage.setItem('mdi_cameras', JSON.stringify(updatedCameras));
    
    // Force a localStorage event to update all components
    window.dispatchEvent(new Event('storage'));
  };
  
  const handleTestConnection = () => {
    // Simulate testing connection
    setTestResult({
      success: Math.random() > 0.3, // 70% chance of success for demo
      message: Math.random() > 0.3 
        ? 'Connection successful! Camera stream is available.' 
        : 'Connection failed. Please check your credentials and URL.'
    });
  };
  
  const renderCameraSettings = () => (
    <SettingSection>
      <SectionTitle>Camera Management</SectionTitle>
      
      <CameraList>
        {cameras.map(camera => (
          <CameraItem key={camera.id}>
            <CameraDetails>
              <div className="camera-name">{camera.name}</div>
              <div className="camera-url">{camera.url}</div>
            </CameraDetails>
            <CameraActions>
              <Button onClick={() => handleDeleteCamera(camera.id)}>Delete</Button>
              <Button primary>Edit</Button>
            </CameraActions>
          </CameraItem>
        ))}
      </CameraList>
      
      {!showAddForm ? (
        <Button primary onClick={() => setShowAddForm(true)}>Add Camera</Button>
      ) : (
        <div>
          <SectionTitle>Add New Camera</SectionTitle>
          
          <FormGroup>
            <Label>Camera Name</Label>
            <Input 
              type="text" 
              placeholder="e.g. North Entrance"
              value={newCamera.name}
              onChange={e => setNewCamera({...newCamera, name: e.target.value})}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Camera Type</Label>
            <Select
              value={newCamera.type}
              onChange={e => setNewCamera({...newCamera, type: e.target.value})}
            >
              <option value="onvif">ONVIF</option>
              <option value="rtsp">RTSP Direct</option>
              <option value="ip">IP Camera</option>
              <option value="usb">USB Camera</option>
              <option value="test-video">Test Video Placeholder</option>
            </Select>
          </FormGroup>
          
          {newCamera.type === 'test-video' ? (
            <FormGroup>
              <Label>Test Video</Label>
              <Select
                value={newCamera.url || 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'}
                onChange={e => setNewCamera({...newCamera, url: e.target.value})}
              >
                <option value="https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4">Big Buck Bunny</option>
                <option value="https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4">Elephants Dream</option>
                <option value="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4">For Bigger Blazes</option>
                <option value="https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4">For Bigger Joyrides</option>
                <option value="https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4">Tears of Steel</option>
              </Select>
            </FormGroup>
          ) : (
            <FormGroup>
              <Label>RTSP URL</Label>
              <Input 
                type="text" 
                placeholder="rtsp://192.168.1.100:554/cam/realmonitor"
                value={newCamera.url}
                onChange={e => setNewCamera({...newCamera, url: e.target.value})}
              />
            </FormGroup>
          )}
          
          <FormGroup>
            <Label>Username</Label>
            <Input 
              type="text" 
              placeholder="admin"
              value={newCamera.username}
              onChange={e => setNewCamera({...newCamera, username: e.target.value})}
            />
          </FormGroup>
          
          <FormGroup>
            <Label>Password</Label>
            <Input 
              type="password" 
              placeholder="Camera password"
              value={newCamera.password}
              onChange={e => setNewCamera({...newCamera, password: e.target.value})}
            />
          </FormGroup>
          
          <Button onClick={handleTestConnection}>Test Connection</Button>
          
          {testResult && (
            <TestConnectionResult success={testResult.success}>
              {testResult.message}
            </TestConnectionResult>
          )}
          
          <ButtonGroup>
            <Button onClick={() => setShowAddForm(false)}>Cancel</Button>
            <Button 
              primary 
              onClick={handleAddCamera}
              disabled={!newCamera.name || !newCamera.url}
            >
              Add Camera
            </Button>
          </ButtonGroup>
        </div>
      )}
    </SettingSection>
  );
  
  const renderDetectionSettings = () => (
    <SettingSection>
      <SectionTitle>AI Detection Settings</SectionTitle>
      
      <FormGroup>
        <Label>Enable Detection Types</Label>
        <CheckboxGroup>
          <Checkbox 
            type="checkbox" 
            id="personDetection"
            checked={detectionSettings.enablePersonDetection}
            onChange={e => setDetectionSettings({
              ...detectionSettings, 
              enablePersonDetection: e.target.checked
            })}
          />
          <Label htmlFor="personDetection" style={{ marginBottom: 0 }}>Person Detection</Label>
        </CheckboxGroup>
        
        <CheckboxGroup>
          <Checkbox 
            type="checkbox" 
            id="vehicleDetection"
            checked={detectionSettings.enableVehicleDetection}
            onChange={e => setDetectionSettings({
              ...detectionSettings, 
              enableVehicleDetection: e.target.checked
            })}
          />
          <Label htmlFor="vehicleDetection" style={{ marginBottom: 0 }}>Vehicle Detection</Label>
        </CheckboxGroup>
        
        <CheckboxGroup>
          <Checkbox 
            type="checkbox" 
            id="weaponDetection"
            checked={detectionSettings.enableWeaponDetection}
            onChange={e => setDetectionSettings({
              ...detectionSettings, 
              enableWeaponDetection: e.target.checked
            })}
          />
          <Label htmlFor="weaponDetection" style={{ marginBottom: 0 }}>Weapon Detection</Label>
        </CheckboxGroup>
        
        <CheckboxGroup>
          <Checkbox 
            type="checkbox" 
            id="licenseDetection"
            checked={detectionSettings.enableLicensePlateDetection}
            onChange={e => setDetectionSettings({
              ...detectionSettings, 
              enableLicensePlateDetection: e.target.checked
            })}
          />
          <Label htmlFor="licenseDetection" style={{ marginBottom: 0 }}>License Plate Recognition</Label>
        </CheckboxGroup>
        
        <CheckboxGroup>
          <Checkbox 
            type="checkbox" 
            id="phoneDetection"
            checked={detectionSettings.enablePhoneDetection}
            onChange={e => setDetectionSettings({
              ...detectionSettings, 
              enablePhoneDetection: e.target.checked
            })}
          />
          <Label htmlFor="phoneDetection" style={{ marginBottom: 0 }}>Phone Detection</Label>
        </CheckboxGroup>
      </FormGroup>
      
      <FormGroup>
        <Label>Minimum Confidence Threshold ({detectionSettings.confidence}%)</Label>
        <SliderContainer>
          <SliderRow>
            <Slider 
              type="range" 
              min="0" 
              max="100"
              value={detectionSettings.confidence}
              onChange={e => setDetectionSettings({
                ...detectionSettings,
                confidence: parseInt(e.target.value)
              })}
            />
            <SliderValue>{detectionSettings.confidence}%</SliderValue>
          </SliderRow>
        </SliderContainer>
      </FormGroup>
      
      <FormGroup>
        <Label>Detection Refresh Rate ({detectionSettings.refreshRate} frames/sec)</Label>
        <SliderContainer>
          <SliderRow>
            <Slider 
              type="range" 
              min="1" 
              max="30"
              value={detectionSettings.refreshRate}
              onChange={e => setDetectionSettings({
                ...detectionSettings,
                refreshRate: parseInt(e.target.value)
              })}
            />
            <SliderValue>{detectionSettings.refreshRate} fps</SliderValue>
          </SliderRow>
        </SliderContainer>
      </FormGroup>
      
      <ButtonGroup>
        <Button>Reset to Defaults</Button>
        <Button primary>Save Settings</Button>
      </ButtonGroup>
    </SettingSection>
  );
  
  const renderAlertSettings = () => (
    <SettingSection>
      <SectionTitle>Alert Settings</SectionTitle>
      
      <FormGroup>
        <Label>Notification Settings</Label>
        <CheckboxGroup>
          <Checkbox 
            type="checkbox" 
            id="emailAlerts"
            checked={alertSettings.enableEmailAlerts}
            onChange={e => setAlertSettings({
              ...alertSettings, 
              enableEmailAlerts: e.target.checked
            })}
          />
          <Label htmlFor="emailAlerts" style={{ marginBottom: 0 }}>Enable Email Alerts</Label>
        </CheckboxGroup>
        
        {alertSettings.enableEmailAlerts && (
          <FormGroup>
            <Label>Email Recipients (comma separated)</Label>
            <Input 
              type="text"
              placeholder="security@example.com, admin@example.com"
              value={alertSettings.emailRecipients}
              onChange={e => setAlertSettings({
                ...alertSettings,
                emailRecipients: e.target.value
              })}
            />
          </FormGroup>
        )}
        
        <CheckboxGroup>
          <Checkbox 
            type="checkbox" 
            id="pushNotifications"
            checked={alertSettings.enablePushNotifications}
            onChange={e => setAlertSettings({
              ...alertSettings, 
              enablePushNotifications: e.target.checked
            })}
          />
          <Label htmlFor="pushNotifications" style={{ marginBottom: 0 }}>Enable Push Notifications</Label>
        </CheckboxGroup>
        
        <CheckboxGroup>
          <Checkbox 
            type="checkbox" 
            id="soundAlerts"
            checked={alertSettings.playSoundOnAlert}
            onChange={e => setAlertSettings({
              ...alertSettings, 
              playSoundOnAlert: e.target.checked
            })}
          />
          <Label htmlFor="soundAlerts" style={{ marginBottom: 0 }}>Play Sound on Alert</Label>
        </CheckboxGroup>
      </FormGroup>
      
      <FormGroup>
        <Label>Auto-resolve alerts after ({alertSettings.autoResolveAfter} minutes)</Label>
        <SliderContainer>
          <SliderRow>
            <Slider 
              type="range" 
              min="0" 
              max="120"
              step="5"
              value={alertSettings.autoResolveAfter}
              onChange={e => setAlertSettings({
                ...alertSettings,
                autoResolveAfter: parseInt(e.target.value)
              })}
            />
            <SliderValue>
              {alertSettings.autoResolveAfter === 0 
                ? "Never" 
                : `${alertSettings.autoResolveAfter}m`}
            </SliderValue>
          </SliderRow>
        </SliderContainer>
      </FormGroup>
      
      <ButtonGroup>
        <Button>Reset to Defaults</Button>
        <Button primary>Save Settings</Button>
      </ButtonGroup>
    </SettingSection>
  );
  
  const renderSystemSettings = () => (
    <SettingSection>
      <SectionTitle>System Settings</SectionTitle>
      
      <FormGroup>
        <Label>Video Storage Retention ({systemSettings.storageRetention} days)</Label>
        <SliderContainer>
          <SliderRow>
            <Slider 
              type="range" 
              min="1" 
              max="90"
              value={systemSettings.storageRetention}
              onChange={e => setSystemSettings({
                ...systemSettings,
                storageRetention: parseInt(e.target.value)
              })}
            />
            <SliderValue>{systemSettings.storageRetention} days</SliderValue>
          </SliderRow>
        </SliderContainer>
      </FormGroup>
      
      <FormGroup>
        <Label>Maximum Storage Size ({systemSettings.maxStorageSize} GB)</Label>
        <SliderContainer>
          <SliderRow>
            <Slider 
              type="range" 
              min="50" 
              max="2000"
              step="50"
              value={systemSettings.maxStorageSize}
              onChange={e => setSystemSettings({
                ...systemSettings,
                maxStorageSize: parseInt(e.target.value)
              })}
            />
            <SliderValue>{systemSettings.maxStorageSize} GB</SliderValue>
          </SliderRow>
        </SliderContainer>
      </FormGroup>
      
      <FormGroup>
        <Label>Theme</Label>
        <Select
          value={systemSettings.theme}
          onChange={e => setSystemSettings({
            ...systemSettings,
            theme: e.target.value
          })}
        >
          <option value="dark">Dark Theme</option>
          <option value="light">Light Theme</option>
          <option value="system">System Default</option>
        </Select>
      </FormGroup>
      
      <FormGroup>
        <Label>Language</Label>
        <Select
          value={systemSettings.language}
          onChange={e => setSystemSettings({
            ...systemSettings,
            language: e.target.value
          })}
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </Select>
      </FormGroup>
      
      <CheckboxGroup>
        <Checkbox 
          type="checkbox" 
          id="autoUpdate"
          checked={systemSettings.enableAutoUpdate}
          onChange={e => setSystemSettings({
            ...systemSettings, 
            enableAutoUpdate: e.target.checked
          })}
        />
        <Label htmlFor="autoUpdate" style={{ marginBottom: 0 }}>Enable Automatic Updates</Label>
      </CheckboxGroup>
      
      <ButtonGroup>
        <Button>Reset to Defaults</Button>
        <Button primary>Save Settings</Button>
      </ButtonGroup>
    </SettingSection>
  );
  
  return (
    <SettingsPanelContainer>
      <SettingsContent>
        <SettingsHeader>
          <SettingsTitle>Settings</SettingsTitle>
          <CloseButton onClick={onClose}>×</CloseButton>
        </SettingsHeader>
        
        <SettingsBody>
          <Sidebar>
            <SidebarItem 
              active={activeSection === 'cameras'} 
              onClick={() => setActiveSection('cameras')}
            >
              Cameras
            </SidebarItem>
            <SidebarItem 
              active={activeSection === 'detection'} 
              onClick={() => setActiveSection('detection')}
            >
              AI Detection
            </SidebarItem>
            <SidebarItem 
              active={activeSection === 'alerts'} 
              onClick={() => setActiveSection('alerts')}
            >
              Alerts
            </SidebarItem>
            <SidebarItem 
              active={activeSection === 'system'} 
              onClick={() => setActiveSection('system')}
            >
              System
            </SidebarItem>
          </Sidebar>
          
          <SettingsContentArea>
            {activeSection === 'cameras' && renderCameraSettings()}
            {activeSection === 'detection' && renderDetectionSettings()}
            {activeSection === 'alerts' && renderAlertSettings()}
            {activeSection === 'system' && renderSystemSettings()}
          </SettingsContentArea>
        </SettingsBody>
      </SettingsContent>
    </SettingsPanelContainer>
  );
};

export default SettingsPanel; 