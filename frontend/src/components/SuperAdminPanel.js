import React, { useState } from 'react';
import styled from 'styled-components';
import { standardCameras } from '../mockBackend';

const SuperAdminContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #0f0f0f;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const AdminHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #1a1a1a;
  border-bottom: 1px solid #333;
  color: white;
`;

const AdminLogo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 20px;
  font-weight: 600;
  color: #3498db;
  
  .material-icons {
    font-size: 24px;
  }
`;

const AdminMain = styled.main`
  display: flex;
  flex: 1;
  overflow: hidden;
`;

const AdminSidebar = styled.aside`
  width: 240px;
  background-color: #1e1e1e;
  border-right: 1px solid #333;
  padding: 20px 0;
  overflow-y: auto;
`;

const AdminContent = styled.div`
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: #121212;
`;

const AdminNav = styled.nav`
  display: flex;
  flex-direction: column;
`;

const NavSection = styled.div`
  margin-bottom: 20px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h3`
  color: #999;
  font-size: 12px;
  text-transform: uppercase;
  padding: 0 16px;
  margin: 0 0 12px 0;
  letter-spacing: 1px;
`;

const NavItem = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  color: ${props => props.active ? 'white' : '#bbb'};
  background-color: ${props => props.active ? 'rgba(52, 152, 219, 0.2)' : 'transparent'};
  border-left: 3px solid ${props => props.active ? '#3498db' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.active ? 'rgba(52, 152, 219, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
    color: white;
  }
  
  .material-icons {
    font-size: 20px;
    color: ${props => props.active ? '#3498db' : '#999'};
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`;

const HeaderButton = styled.button`
  background: none;
  border: none;
  color: #ccc;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 4px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
  
  .material-icons {
    font-size: 18px;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 30px;
`;

const DashboardCard = styled.div`
  background-color: #1a1a1a;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #333;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  
  h3 {
    margin: 0 0 16px 0;
    color: white;
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
    justify-content: space-between;
    
    .material-icons {
      color: #3498db;
      font-size: 20px;
    }
  }
`;

const StatsValue = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: ${props => props.color || 'white'};
  margin-bottom: 8px;
  display: flex;
  align-items: baseline;
  
  .stat-unit {
    font-size: 14px;
    color: #999;
    margin-left: 6px;
    font-weight: normal;
  }
`;

const StatsLabel = styled.div`
  font-size: 14px;
  color: #999;
`;

const StatsChange = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: ${props => props.positive ? '#2ecc71' : '#e74c3c'};
  margin-top: 8px;
  padding: 4px 8px;
  background-color: ${props => props.positive ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)'};
  border-radius: 4px;
  
  .material-icons {
    font-size: 14px;
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #333;
  margin-bottom: 24px;
`;

const Tab = styled.div`
  padding: 12px 16px;
  color: ${props => props.active ? 'white' : '#999'};
  font-weight: ${props => props.active ? '500' : 'normal'};
  border-bottom: 2px solid ${props => props.active ? '#3498db' : 'transparent'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    color: white;
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const TableContainer = styled.div`
  border: 1px solid #333;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 30px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #333;
  }
  
  th {
    background-color: #1a1a1a;
    color: #999;
    font-weight: 500;
    font-size: 14px;
  }
  
  td {
    color: #ccc;
    font-size: 14px;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover td {
    background-color: rgba(255, 255, 255, 0.03);
  }
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.status) {
      case 'active': return 'rgba(46, 204, 113, 0.2)';
      case 'inactive': return 'rgba(231, 76, 60, 0.2)';
      case 'pending': return 'rgba(243, 156, 18, 0.2)';
      default: return 'rgba(52, 152, 219, 0.2)';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'active': return '#2ecc71';
      case 'inactive': return '#e74c3c';
      case 'pending': return '#f39c12';
      default: return '#3498db';
    }
  }};
`;

const ActionButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  
  &:hover {
    color: #2980b9;
    text-decoration: underline;
  }
  
  & + & {
    margin-left: 12px;
  }
`;

// Sample data for the SuperAdmin panel
const mockStats = {
  totalUsers: 48,
  activeUsers: 32,
  totalCameras: 28,
  activeCameras: 24,
  storageUsed: 2.83,
  alertsToday: 72
};

const mockUsers = [
  { id: 1, name: 'John Smith', email: 'john.smith@example.com', role: 'Admin', status: 'active', lastActive: '2025-03-14 09:23' },
  { id: 2, name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Viewer', status: 'active', lastActive: '2025-03-14 10:05' },
  { id: 3, name: 'Michael Chen', email: 'mchen@example.com', role: 'Operator', status: 'inactive', lastActive: '2025-03-12 15:47' },
  { id: 4, name: 'Lisa Wong', email: 'lwong@example.com', role: 'Admin', status: 'active', lastActive: '2025-03-14 08:30' },
  { id: 5, name: 'Robert Davis', email: 'rdavis@example.com', role: 'Viewer', status: 'pending', lastActive: 'Never' }
];

// Use standardized camera data
const mockCameras = standardCameras.map(camera => ({
  ...camera,
  status: camera.isLive ? 'active' : 'inactive',
  lastPing: camera.isLive ? '2025-03-14 11:00' : '2025-03-13 18:42'
}));

// Add mockRoles data after mockUsers
const mockRoles = [
  { id: 1, name: 'Admin', description: 'Full system access and configuration', userCount: 2, permissions: ['all'] },
  { id: 2, name: 'Operator', description: 'Camera monitoring and alert management', userCount: 8, permissions: ['view', 'manage_alerts', 'manage_cameras'] },
  { id: 3, name: 'Viewer', description: 'View-only access to cameras and alerts', userCount: 15, permissions: ['view'] },
  { id: 4, name: 'Security', description: 'Security operations and response', userCount: 5, permissions: ['view', 'manage_alerts'] }
];

// Add mockSubscriptionData after mockRoles
const mockSubscriptionData = {
  currentPlan: 'Enterprise',
  status: 'active',
  billingCycle: 'yearly',
  nextBilling: '2025-04-15',
  features: [
    { name: 'Camera Limit', value: '100 cameras', used: '28 cameras' },
    { name: 'Storage', value: '5 TB', used: '2.83 TB' },
    { name: 'Users', value: 'Unlimited', used: '48 users' },
    { name: 'AI Detection', value: 'Advanced', used: 'Enabled' }
  ],
  billingHistory: [
    { id: 1, date: '2024-03-15', amount: '$4,999', status: 'paid', invoice: '#INV-2024-001' },
    { id: 2, date: '2023-03-15', amount: '$4,499', status: 'paid', invoice: '#INV-2023-001' },
    { id: 3, date: '2022-03-15', amount: '$3,999', status: 'paid', invoice: '#INV-2022-001' }
  ]
};

// Add mockEvents data after mockRoles
const mockEvents = [
  { 
    id: 1, 
    type: 'person_detected',
    camera: 'North Entrance',
    timestamp: '2025-03-14 10:45:22',
    details: { confidence: 95.5, location: 'Entry Zone', direction: 'entering' },
    status: 'processed',
    alert_generated: true
  },
  { 
    id: 2, 
    type: 'vehicle_detected',
    camera: 'Parking Lot A',
    timestamp: '2025-03-14 10:44:15',
    details: { confidence: 88.2, type: 'car', color: 'blue' },
    status: 'processed',
    alert_generated: false
  },
  { 
    id: 3, 
    type: 'person_detected',
    camera: 'Loading Dock',
    timestamp: '2025-03-14 10:42:33',
    details: { confidence: 92.1, location: 'Restricted Area', action: 'loitering' },
    status: 'processing',
    alert_generated: true
  },
  { 
    id: 4, 
    type: 'object_detected',
    camera: 'Warehouse Floor',
    timestamp: '2025-03-14 10:40:55',
    details: { confidence: 85.5, type: 'package', duration: '15min' },
    status: 'processed',
    alert_generated: true
  },
  { 
    id: 5, 
    type: 'vehicle_detected',
    camera: 'South Gate',
    timestamp: '2025-03-14 10:39:12',
    details: { confidence: 91.8, type: 'truck', direction: 'exiting' },
    status: 'processed',
    alert_generated: false
  }
];

// Add mockAlerts data after mockEvents
const mockAlerts = [
  {
    id: 1,
    type: 'intrusion',
    camera: 'Loading Dock',
    timestamp: '2025-03-14 10:42:33',
    severity: 'high',
    message: 'Unauthorized person detected in restricted area',
    status: 'new',
    assignedTo: null,
    event_id: 3
  },
  {
    id: 2,
    type: 'object',
    camera: 'Warehouse Floor',
    timestamp: '2025-03-14 10:40:55',
    severity: 'medium',
    message: 'Unattended package detected for over 15 minutes',
    status: 'in_progress',
    assignedTo: 'John Smith',
    event_id: 4
  },
  {
    id: 3,
    type: 'system',
    camera: 'South Gate',
    timestamp: '2025-03-14 10:39:12',
    severity: 'low',
    message: 'Camera connection unstable',
    status: 'resolved',
    assignedTo: 'System',
    event_id: null
  },
  {
    id: 4,
    type: 'intrusion',
    camera: 'North Entrance',
    timestamp: '2025-03-14 10:45:22',
    severity: 'high',
    message: 'Multiple people detected outside business hours',
    status: 'new',
    assignedTo: null,
    event_id: 1
  },
  {
    id: 5,
    type: 'vehicle',
    camera: 'Parking Lot A',
    timestamp: '2025-03-14 10:44:15',
    severity: 'medium',
    message: 'Vehicle parked in restricted zone',
    status: 'in_progress',
    assignedTo: 'Sarah Johnson',
    event_id: 2
  }
];

// Add mockDetections data after mockAlerts
const mockDetections = [
  {
    id: 1,
    model: 'person_v2',
    type: 'Person',
    camera: 'North Entrance',
    timestamp: '2025-03-14 10:45:22',
    confidence: 95.5,
    bbox: { x: 120, y: 240, width: 80, height: 160 },
    attributes: { pose: 'standing', direction: 'entering', clothing: 'dark' },
    status: 'verified',
    processing_time: '45ms'
  },
  {
    id: 2,
    model: 'vehicle_v1',
    type: 'Vehicle',
    camera: 'Parking Lot A',
    timestamp: '2025-03-14 10:44:15',
    confidence: 88.2,
    bbox: { x: 350, y: 200, width: 200, height: 150 },
    attributes: { type: 'car', color: 'blue', direction: 'parked' },
    status: 'pending_review',
    processing_time: '52ms'
  },
  {
    id: 3,
    model: 'object_v3',
    type: 'Object',
    camera: 'Warehouse Floor',
    timestamp: '2025-03-14 10:42:33',
    confidence: 92.1,
    bbox: { x: 500, y: 300, width: 100, height: 100 },
    attributes: { type: 'package', size: 'medium', duration: '15min' },
    status: 'verified',
    processing_time: '38ms'
  },
  {
    id: 4,
    model: 'weapon_v2',
    type: 'Weapon',
    camera: 'Security Gate',
    timestamp: '2025-03-14 10:41:18',
    confidence: 97.3,
    bbox: { x: 280, y: 150, width: 120, height: 40 },
    attributes: { type: 'knife', concealment: 'visible' },
    status: 'alert_generated',
    processing_time: '41ms'
  },
  {
    id: 5,
    model: 'behavior_v1',
    type: 'Behavior',
    camera: 'Loading Dock',
    timestamp: '2025-03-14 10:40:55',
    confidence: 85.5,
    bbox: { x: 400, y: 250, width: 160, height: 160 },
    attributes: { action: 'loitering', duration: '5min' },
    status: 'verified',
    processing_time: '60ms'
  }
];

const ConfigurationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  color: #ccc;
  font-size: 14px;
`;

const Input = styled.input`
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 8px 12px;
  color: white;
  font-size: 14px;
  
  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const Select = styled.select`
  background-color: #2a2a2a;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 8px 12px;
  color: white;
  font-size: 14px;
  
  &:focus {
    border-color: #3498db;
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#3498db' : '#2a2a2a'};
  border: 1px solid ${props => props.primary ? '#2980b9' : '#444'};
  border-radius: 4px;
  padding: 8px 16px;
  color: white;
  cursor: pointer;
  font-size: 14px;
  
  &:hover {
    background-color: ${props => props.primary ? '#2980b9' : '#333'};
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  z-index: 1050;
`;

const ConfigModal = ({ onClose, children, title, width = '500px' }) => (
  <>
    <ModalOverlay onClick={onClose} />
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#1a1a1a',
      padding: '24px',
      borderRadius: '8px',
      border: '1px solid #333',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
      zIndex: 1100,
      width: width,
      maxHeight: '90vh',
      overflowY: 'auto'
    }}>
      <h2 style={{ margin: '0 0 16px 0', color: 'white', fontSize: '20px' }}>{title}</h2>
      {children}
    </div>
  </>
);

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <>
      <ModalOverlay onClick={onCancel} />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#1a1a1a',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #333',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
        zIndex: 1100,
        width: '400px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <h2 style={{ margin: '0 0 16px 0', color: 'white', fontSize: '20px' }}>{title}</h2>
        <p style={{ color: '#ccc', marginBottom: '24px' }}>{message}</p>
        <ButtonGroup>
          <Button primary onClick={onConfirm}>Confirm</Button>
          <Button onClick={onCancel}>Cancel</Button>
        </ButtonGroup>
      </div>
    </>
  );
};

const SuperAdminPanel = ({ onClose, activeSection = 'dashboard' }) => {
  const [section, setSection] = useState(activeSection);
  const [activeTab, setActiveTab] = useState('all');
  const [showConfigureModal, setShowConfigureModal] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [processingConfig, setProcessingConfig] = useState(null);
  const [configForm, setConfigForm] = useState({});
  const [selectedRole, setSelectedRole] = useState(null);
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showAddCameraModal, setShowAddCameraModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Viewer',
    password: '',
    confirmPassword: '',
    status: 'active'
  });
  const [newCamera, setNewCamera] = useState({
    name: '',
    location: '',
    type: 'rtsp',
    url: '',
    username: '',
    password: '',
    onvifAddress: '',
    isRecordingEnabled: false,
    status: 'active'
  });
  
  // Update roleSettings state with more granular permissions
  const [roleSettings, setRoleSettings] = useState({
    Admin: {
      users: {
        canViewUsers: true,
        canCreateUsers: true,
        canEditUsers: true,
        canDeleteUsers: true,
        canAssignRoles: true
      },
      roles: {
        canViewRoles: true,
        canCreateRoles: true,
        canEditRoles: true,
        canDeleteRoles: true,
        canAssignPermissions: true
      },
      cameras: {
        canViewCameras: true,
        canAddCameras: true,
        canEditCameras: true,
        canDeleteCameras: true,
        canConfigureAI: true
      },
      alerts: {
        canViewAlerts: true,
        canManageAlerts: true,
        canConfigureAlertRules: true,
        canDismissAlerts: true
      },
      system: {
        canAccessSystemSettings: true,
        canConfigureSystem: true,
        canViewLogs: true,
        canManageBackups: true,
        canUpdateSystem: true
      }
    },
    Operator: {
      users: {
        canViewUsers: true,
        canCreateUsers: false,
        canEditUsers: false,
        canDeleteUsers: false,
        canAssignRoles: false
      },
      roles: {
        canViewRoles: true,
        canCreateRoles: false,
        canEditRoles: false,
        canDeleteRoles: false,
        canAssignPermissions: false
      },
      cameras: {
        canViewCameras: true,
        canAddCameras: true,
        canEditCameras: true,
        canDeleteCameras: false,
        canConfigureAI: false
      },
      alerts: {
        canViewAlerts: true,
        canManageAlerts: true,
        canConfigureAlertRules: false,
        canDismissAlerts: true
      },
      system: {
        canAccessSystemSettings: true,
        canConfigureSystem: false,
        canViewLogs: true,
        canManageBackups: false,
        canUpdateSystem: false
      }
    },
    Viewer: {
      users: {
        canViewUsers: true,
        canCreateUsers: false,
        canEditUsers: false,
        canDeleteUsers: false,
        canAssignRoles: false
      },
      roles: {
        canViewRoles: true,
        canCreateRoles: false,
        canEditRoles: false,
        canDeleteRoles: false,
        canAssignPermissions: false
      },
      cameras: {
        canViewCameras: true,
        canAddCameras: false,
        canEditCameras: false,
        canDeleteCameras: false,
        canConfigureAI: false
      },
      alerts: {
        canViewAlerts: true,
        canManageAlerts: false,
        canConfigureAlertRules: false,
        canDismissAlerts: false
      },
      system: {
        canAccessSystemSettings: false,
        canConfigureSystem: false,
        canViewLogs: false,
        canManageBackups: false,
        canUpdateSystem: false
      }
    }
  });

  // Add new state for role templates
  const [roleTemplates] = useState([
    {
      name: 'Full Administrator',
      description: 'Complete system access with all permissions',
      template: 'Admin'
    },
    {
      name: 'Security Manager',
      description: 'Manage security operations and camera systems',
      template: 'Operator'
    },
    {
      name: 'Basic User',
      description: 'View-only access to cameras and alerts',
      template: 'Viewer'
    }
  ]);

  // Add new state for confirmation dialogs
  const [confirmDialog, setConfirmDialog] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Helper function to show confirmation dialog
  const showConfirmation = (title, message, onConfirm) => {
    setConfirmDialog({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmDialog(prev => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Add handleEditRole function
  const handleEditRole = (role) => {
    setSelectedRole(role);
    setSection('roles');
    setActiveTab('edit');
  };

  const handleCreateRole = () => {
    setSelectedRole({
      id: null,
      name: '',
      description: '',
      permissions: []
    });
    setSection('roles');
    setActiveTab('edit');
  };

  // Handler for model configuration
  const handleConfigureModel = (model) => {
    setSelectedModel(model);
    setConfigForm({
      threshold: model.threshold || 70,
      mode: model.mode || 'GPU Accelerated',
      minConfidence: model.type === 'Weapon Detection' ? 85 : 70,
      maxBatchSize: model.mode === 'GPU Accelerated' ? 32 : 16,
      roiEnabled: false,
      customClasses: [],
      modelSpecificSettings: {
        nmsThreshold: 0.45,
        inferenceSize: 640,
        augmentation: false,
        ensembleMode: false
      }
    });
    setShowConfigureModal(true);
  };

  // Handler for model updates
  const handleUpdateModel = (model) => {
    setSelectedModel(model);
    setShowUpdateModal(true);
  };

  // Handler for processing settings configuration
  const handleConfigureProcessing = (setting) => {
    setProcessingConfig(setting);
    setConfigForm({
      value: setting.value,
      enabled: setting.value !== 'Disabled',
      options: setting.options || [],
      min: setting.min,
      max: setting.max,
      unit: setting.unit,
      advanced: {
        powerMode: 'High Performance',
        scheduledDowntime: false,
        loadBalancing: true,
        resourceAllocation: 80
      }
    });
    setShowConfigureModal(true);
  };

  // Update save handlers to use confirmation
  const handleSaveModelConfig = (e) => {
    e.preventDefault();
    showConfirmation(
      'Save Model Configuration',
      `Are you sure you want to save the configuration changes for ${selectedModel.type}? This may affect system performance.`,
      () => {
        console.log('Saving model configuration:', {
          model: selectedModel.type,
          config: configForm
        });
        setShowConfigureModal(false);
      }
    );
  };

  const handleSaveProcessingConfig = (e) => {
    e.preventDefault();
    showConfirmation(
      'Save Processing Configuration',
      `Are you sure you want to save the processing configuration changes for ${processingConfig.name}? This may affect system performance.`,
      () => {
        console.log('Saving processing configuration:', {
          setting: processingConfig.name,
          config: configForm
        });
        setShowConfigureModal(false);
      }
    );
  };

  const handleSaveRoleSettings = () => {
    showConfirmation(
      'Save Role Settings',
      `Are you sure you want to save the permission changes for the ${selectedRole.name} role? This will affect all users with this role.`,
      () => {
        console.log('Saving role settings:', {
          role: selectedRole.name,
          settings: roleSettings[selectedRole.name]
        });
        setSelectedRole(null);
      }
    );
  };

  const handleSaveStorageSettings = () => {
    showConfirmation(
      'Save Storage Settings',
      'Are you sure you want to save the storage configuration changes? This may affect system performance and data retention.',
      () => {
        console.log('Saving storage settings');
        // Add your storage settings save logic here
      }
    );
  };

  const handleSaveNotificationSettings = () => {
    showConfirmation(
      'Save Notification Settings',
      'Are you sure you want to save the notification configuration changes? This will affect how alerts are delivered to all users.',
      () => {
        console.log('Saving notification settings');
        // Add your notification settings save logic here
      }
    );
  };

  const handleSaveSecuritySettings = () => {
    showConfirmation(
      'Save Security Settings',
      'Are you sure you want to save the security configuration changes? This may affect system access and security policies.',
      () => {
        console.log('Saving security settings');
        // Add your security settings save logic here
      }
    );
  };

  // Handler for applying model update
  const handleApplyUpdate = async () => {
    // Here you would typically make an API call to trigger the update
    console.log('Applying update for:', selectedModel.type);
    setShowUpdateModal(false);
  };

  // Handler for restarting AI processing
  const handleRestartAI = () => {
    if (window.confirm('Are you sure you want to restart AI processing? This may cause brief interruption in detection services.')) {
      // Here you would typically make an API call to restart the AI processing service
      console.log('Restarting AI processing service...');
      // Show a temporary success message
      alert('AI Processing restart initiated. The system will be temporarily unavailable.');
    }
  };

  const handleSaveAllChanges = () => {
    showConfirmation(
      'Save All Changes',
      'Are you sure you want to save all general settings changes? This will affect system-wide configurations.',
      () => {
        console.log('Saving all general settings changes');
        // Add your general settings save logic here
      }
    );
  };

  const handleAddUser = () => {
    showConfirmation(
      'Add New User',
      'Are you sure you want to create this new user? They will receive an email with their login credentials.',
      () => {
        // Here you would typically make an API call to create the user
        console.log('Creating new user:', newUser);
        // Add the new user to mockUsers
        const newId = Math.max(...mockUsers.map(u => u.id)) + 1;
        mockUsers.push({
          id: newId,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          status: newUser.status,
          lastActive: 'Never'
        });
        // Reset form and close modal
        setNewUser({
          name: '',
          email: '',
          role: 'Viewer',
          password: '',
          confirmPassword: '',
          status: 'active'
        });
        setShowAddUserModal(false);
      }
    );
  };

  const handleAddCamera = () => {
    showConfirmation(
      'Add New Camera',
      'Are you sure you want to add this camera? The system will attempt to connect to the camera using the provided settings.',
      () => {
        // Here you would typically make an API call to create the camera
        console.log('Creating new camera:', newCamera);
        // Add the new camera to mockCameras
        const newId = Math.max(...mockCameras.map(c => c.id)) + 1;
        mockCameras.push({
          id: newId,
          name: newCamera.name,
          location: newCamera.location,
          status: newCamera.status,
          lastPing: new Date().toISOString().slice(0, 16).replace('T', ' '),
          alertCount: 0,
          isLive: true,
          ...newCamera
        });
        // Reset form and close modal
        setNewCamera({
          name: '',
          location: '',
          type: 'rtsp',
          url: '',
          username: '',
          password: '',
          onvifAddress: '',
          isRecordingEnabled: false,
          status: 'active'
        });
        setShowAddCameraModal(false);
      }
    );
  };
  
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '00:00',
    retentionDays: 30,
    includeVideoData: false,
    backupLocation: 'local',
    encryptBackups: true
  });

  const [backups] = useState([
    { 
      id: 1, 
      timestamp: '2024-03-15 02:00:00', 
      size: '256MB', 
      type: 'Auto', 
      status: 'completed',
      includes: ['System Settings', 'User Data', 'Camera Config']
    },
    { 
      id: 2, 
      timestamp: '2024-03-14 02:00:00', 
      size: '255MB', 
      type: 'Auto', 
      status: 'completed',
      includes: ['System Settings', 'User Data', 'Camera Config']
    },
    { 
      id: 3, 
      timestamp: '2024-03-13 14:22:31', 
      size: '258MB', 
      type: 'Manual', 
      status: 'completed',
      includes: ['System Settings', 'User Data', 'Camera Config', 'Video Data']
    }
  ]);

  const handleCreateBackup = () => {
    showConfirmation(
      'Create Backup',
      'Are you sure you want to create a new system backup? This may take several minutes to complete.',
      () => {
        console.log('Creating new backup...');
        // Add backup creation logic here
      }
    );
  };

  const handleRestoreBackup = (backupId) => {
    showConfirmation(
      'Restore Backup',
      'Warning: Restoring from a backup will override current system settings and data. This action cannot be undone. Are you sure you want to proceed?',
      () => {
        console.log('Restoring from backup:', backupId);
        // Add backup restoration logic here
      }
    );
  };

  const handleSaveBackupSettings = () => {
    showConfirmation(
      'Save Backup Settings',
      'Are you sure you want to save the backup configuration changes? This will affect how system backups are performed.',
      () => {
        console.log('Saving backup settings:', backupSettings);
        // Add settings save logic here
      }
    );
  };

  const handleDeleteBackup = (backupId) => {
    showConfirmation(
      'Delete Backup',
      'Are you sure you want to delete this backup? This action cannot be undone.',
      () => {
        console.log('Deleting backup:', backupId);
        // Add backup deletion logic here
      }
    );
  };
  
  const renderDashboard = () => (
    <>
      <DashboardGrid>
        <DashboardCard>
          <h3>
            Total Users
            <span className="material-icons">people</span>
          </h3>
          <StatsValue>{mockStats.totalUsers}</StatsValue>
          <StatsLabel>
            {mockStats.activeUsers} active users
          </StatsLabel>
          <StatsChange positive>
            <span className="material-icons">arrow_upward</span>
            3 new this month
          </StatsChange>
        </DashboardCard>
        
        <DashboardCard>
          <h3>
            Total Cameras
            <span className="material-icons">videocam</span>
          </h3>
          <StatsValue>{mockStats.totalCameras}</StatsValue>
          <StatsLabel>
            {mockStats.activeCameras} cameras online
          </StatsLabel>
          <StatsChange positive={false}>
            <span className="material-icons">arrow_downward</span>
            2 offline
          </StatsChange>
        </DashboardCard>
        
        <DashboardCard>
          <h3>
            Storage Used
            <span className="material-icons">storage</span>
          </h3>
          <StatsValue>
            {mockStats.storageUsed}
            <span className="stat-unit">TB</span>
          </StatsValue>
          <StatsLabel>
            of 5 TB total capacity
          </StatsLabel>
          <StatsChange positive>
            <span className="material-icons">arrow_upward</span>
            58% of capacity
          </StatsChange>
        </DashboardCard>
        
        <DashboardCard>
          <h3>
            Alerts Today
            <span className="material-icons">notifications</span>
          </h3>
          <StatsValue color="#e74c3c">{mockStats.alertsToday}</StatsValue>
          <StatsLabel>
            12 require attention
          </StatsLabel>
          <StatsChange positive={false}>
            <span className="material-icons">arrow_upward</span>
            18% increase
          </StatsChange>
        </DashboardCard>
      </DashboardGrid>
      
      <h2>Recent Activity</h2>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-03-14 10:32 AM</td>
              <td>George M.</td>
              <td>User permissions updated</td>
              <td>Added admin rights to Lisa Wong</td>
            </tr>
            <tr>
              <td>2025-03-14 09:15 AM</td>
              <td>Admin</td>
              <td>Camera configuration changed</td>
              <td>Updated Office Entrance settings</td>
            </tr>
            <tr>
              <td>2025-03-13 04:22 PM</td>
              <td>System</td>
              <td>Admin login</td>
              <td>From IP 192.168.1.105</td>
            </tr>
            <tr>
              <td>2025-03-13 02:13 PM</td>
              <td>Admin</td>
              <td>Password reset</td>
              <td>For user Tech1</td>
            </tr>
          </tbody>
        </Table>
      </TableContainer>
    </>
  );
  
  const renderUsers = () => (
    <>
      <TabsContainer>
        <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All Users</Tab>
        <Tab active={activeTab === 'admins'} onClick={() => setActiveTab('admins')}>Administrators</Tab>
        <Tab active={activeTab === 'operators'} onClick={() => setActiveTab('operators')}>Operators</Tab>
        <Tab active={activeTab === 'viewers'} onClick={() => setActiveTab('viewers')}>Viewers</Tab>
      </TabsContainer>
      
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Last Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers
              .filter(user => {
                if (activeTab === 'admins') return user.role === 'Admin';
                if (activeTab === 'operators') return user.role === 'Operator';
                if (activeTab === 'viewers') return user.role === 'Viewer';
                return true;
              })
              .map(user => (
              <tr key={user.id}>
                <td>#{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <StatusBadge status={user.status}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </StatusBadge>
                </td>
                <td>{user.lastActive}</td>
                <td>
                  <ActionButton>Edit</ActionButton>
                  <ActionButton>Delete</ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>
      
      <HeaderButton onClick={() => setShowAddUserModal(true)}>
        <span className="material-icons">add</span>
        Add New User
      </HeaderButton>

      {/* Add User Modal */}
      {showAddUserModal && (
        <ConfigModal
          title="Add New User"
          onClose={() => setShowAddUserModal(false)}
          width="600px"
        >
          <ConfigurationForm onSubmit={(e) => {
            e.preventDefault();
            handleAddUser();
          }}>
            <FormGroup>
              <Label>Full Name</Label>
              <Input
                type="text"
                placeholder="Enter user's full name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Email Address</Label>
              <Input
                type="email"
                placeholder="Enter user's email address"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Role</Label>
              <Select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                required
              >
                <option value="Admin">Administrator</option>
                <option value="Operator">Operator</option>
                <option value="Viewer">Viewer</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label>Password</Label>
              <Input
                type="password"
                placeholder="Enter password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Confirm Password</Label>
              <Input
                type="password"
                placeholder="Confirm password"
                value={newUser.confirmPassword}
                onChange={(e) => setNewUser({ ...newUser, confirmPassword: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Status</Label>
              <Select
                value={newUser.status}
                onChange={(e) => setNewUser({ ...newUser, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending Activation</option>
              </Select>
            </FormGroup>

            <ButtonGroup>
              <Button type="submit" primary disabled={
                !newUser.name ||
                !newUser.email ||
                !newUser.password ||
                !newUser.confirmPassword ||
                newUser.password !== newUser.confirmPassword
              }>
                Create User
              </Button>
              <Button type="button" onClick={() => setShowAddUserModal(false)}>Cancel</Button>
            </ButtonGroup>
          </ConfigurationForm>
        </ConfigModal>
      )}
    </>
  );
  
  const renderRoles = () => (
    <>
      <TabsContainer>
        <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All Roles</Tab>
        <Tab active={activeTab === 'edit'} onClick={() => setActiveTab('edit')}>Role Editor</Tab>
        <Tab active={activeTab === 'templates'} onClick={() => setActiveTab('templates')}>Templates</Tab>
      </TabsContainer>
      
      {activeTab === 'all' ? (
        <>
          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Role Name</th>
                  <th>Description</th>
                  <th>Users</th>
                  <th>Last Modified</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockRoles.map(role => (
                  <tr key={role.id}>
                    <td>{role.name}</td>
                    <td>{role.description}</td>
                    <td>{role.userCount} users</td>
                    <td>2025-03-14</td>
                    <td>
                      <ActionButton onClick={() => handleEditRole(role)}>Edit Role</ActionButton>
                      <ActionButton onClick={() => showConfirmation(
                        'Delete Role',
                        `Are you sure you want to delete the ${role.name} role? This action cannot be undone.`,
                        () => console.log('Deleting role:', role.name)
                      )}>Delete</ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
          
          <ButtonGroup style={{ marginTop: '24px' }}>
            <Button primary onClick={handleCreateRole}>
              <span className="material-icons">add</span>
              Create New Role
            </Button>
            <Button onClick={() => setActiveTab('templates')}>
              <span className="material-icons">content_copy</span>
              Use Template
            </Button>
          </ButtonGroup>
        </>
      ) : activeTab === 'edit' ? (
        <DashboardCard>
          <h3>
            {selectedRole?.id ? `Edit Role: ${selectedRole.name}` : 'Create New Role'}
            <span className="material-icons">admin_panel_settings</span>
          </h3>
          
          <ConfigurationForm onSubmit={(e) => {
            e.preventDefault();
            showConfirmation(
              selectedRole?.id ? 'Update Role' : 'Create Role',
              `Are you sure you want to ${selectedRole?.id ? 'update' : 'create'} this role?`,
              () => {
                console.log('Saving role:', selectedRole);
                setActiveTab('all');
              }
            );
          }}>
            <FormGroup>
              <Label>Role Name</Label>
              <Input
                type="text"
                placeholder="Enter role name"
                value={selectedRole?.name || ''}
                onChange={(e) => setSelectedRole(prev => ({ ...prev, name: e.target.value }))}
              />
            </FormGroup>

            <FormGroup>
              <Label>Description</Label>
              <Input
                type="text"
                placeholder="Enter role description"
                value={selectedRole?.description || ''}
                onChange={(e) => setSelectedRole(prev => ({ ...prev, description: e.target.value }))}
              />
            </FormGroup>

            {Object.entries(roleSettings.Admin).map(([category, permissions]) => (
              <div key={category} style={{ marginBottom: '24px' }}>
                <h4 style={{ 
                  color: '#ccc', 
                  marginBottom: '16px',
                  textTransform: 'capitalize',
                  borderBottom: '1px solid #333',
                  paddingBottom: '8px'
                }}>
                  {category} Permissions
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {Object.entries(permissions).map(([permission]) => (
                    <Label key={permission} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      margin: 0,
                      padding: '8px',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '4px'
                    }}>
                      <Input
                        type="checkbox"
                        checked={selectedRole?.permissions?.includes(permission)}
                        onChange={(e) => {
                          const newPermissions = e.target.checked
                            ? [...(selectedRole?.permissions || []), permission]
                            : (selectedRole?.permissions || []).filter(p => p !== permission);
                          setSelectedRole(prev => ({ ...prev, permissions: newPermissions }));
                        }}
                      />
                      {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </Label>
                  ))}
                </div>
              </div>
            ))}

            <ButtonGroup>
              <Button type="submit" primary>
                {selectedRole?.id ? 'Update Role' : 'Create Role'}
              </Button>
              <Button type="button" onClick={() => setActiveTab('all')}>Cancel</Button>
            </ButtonGroup>
          </ConfigurationForm>
        </DashboardCard>
      ) : (
        <>
          <DashboardGrid>
            {roleTemplates.map((template, index) => (
              <DashboardCard key={index}>
                <h3>
                  {template.name}
                  <span className="material-icons">content_copy</span>
                </h3>
                <p style={{ color: '#ccc', marginBottom: '16px' }}>{template.description}</p>
                <Button onClick={() => {
                  setSelectedRole({
                    id: null,
                    name: `${template.name} Copy`,
                    description: template.description,
                    permissions: [...(roleSettings[template.template]?.permissions || [])]
                  });
                  setActiveTab('edit');
                }}>Use Template</Button>
              </DashboardCard>
            ))}
          </DashboardGrid>
        </>
      )}
    </>
  );
  
  const renderCameras = () => (
    <>
      <TabsContainer>
        <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All Cameras</Tab>
        <Tab active={activeTab === 'active'} onClick={() => setActiveTab('active')}>Active</Tab>
        <Tab active={activeTab === 'inactive'} onClick={() => setActiveTab('inactive')}>Inactive</Tab>
      </TabsContainer>
      
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Location</th>
              <th>Status</th>
              <th>Last Check-in</th>
              <th>Alerts</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockCameras
              .filter(camera => {
                if (activeTab === 'active') return camera.status === 'active';
                if (activeTab === 'inactive') return camera.status === 'inactive';
                return true;
              })
              .map(camera => (
                <tr key={camera.id}>
                  <td>#{camera.id}</td>
                  <td>{camera.name}</td>
                  <td>{camera.location}</td>
                  <td>
                    <StatusBadge status={camera.status}>
                      {camera.status.charAt(0).toUpperCase() + camera.status.slice(1)}
                    </StatusBadge>
                  </td>
                  <td>{camera.lastPing}</td>
                  <td>{camera.alertCount} alerts</td>
                  <td>
                    <ActionButton>Configure</ActionButton>
                    <ActionButton>View</ActionButton>
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </TableContainer>
      
      <HeaderButton onClick={() => setShowAddCameraModal(true)}>
        <span className="material-icons">add</span>
        Add New Camera
      </HeaderButton>

      {/* Add Camera Modal */}
      {showAddCameraModal && (
        <ConfigModal
          title="Add New Camera"
          onClose={() => setShowAddCameraModal(false)}
          width="600px"
        >
          <ConfigurationForm onSubmit={(e) => {
            e.preventDefault();
            handleAddCamera();
          }}>
            <FormGroup>
              <Label>Camera Name</Label>
              <Input
                type="text"
                placeholder="Enter camera name"
                value={newCamera.name}
                onChange={(e) => setNewCamera({ ...newCamera, name: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Location</Label>
              <Input
                type="text"
                placeholder="Enter camera location"
                value={newCamera.location}
                onChange={(e) => setNewCamera({ ...newCamera, location: e.target.value })}
                required
              />
            </FormGroup>

            <FormGroup>
              <Label>Camera Type</Label>
              <Select
                value={newCamera.type}
                onChange={(e) => setNewCamera({ ...newCamera, type: e.target.value })}
                required
              >
                <option value="rtsp">RTSP Camera</option>
                <option value="onvif">ONVIF Camera</option>
                <option value="ip">IP Camera</option>
                <option value="usb">USB Camera</option>
                <option value="test">Test Video Source</option>
              </Select>
            </FormGroup>

            {newCamera.type === 'onvif' && (
              <FormGroup>
                <Label>ONVIF Address</Label>
                <Input
                  type="text"
                  placeholder="e.g., http://192.168.1.100:8080/onvif/device_service"
                  value={newCamera.onvifAddress}
                  onChange={(e) => setNewCamera({ ...newCamera, onvifAddress: e.target.value })}
                />
              </FormGroup>
            )}

            {newCamera.type !== 'usb' && newCamera.type !== 'test' && (
              <FormGroup>
                <Label>Stream URL</Label>
                <Input
                  type="text"
                  placeholder={
                    newCamera.type === 'rtsp' ? 'rtsp://192.168.1.100:554/stream1' :
                    newCamera.type === 'ip' ? 'http://192.168.1.100/video.mjpg' :
                    'Enter stream URL'
                  }
                  value={newCamera.url}
                  onChange={(e) => setNewCamera({ ...newCamera, url: e.target.value })}
                />
              </FormGroup>
            )}

            {newCamera.type === 'test' && (
              <FormGroup>
                <Label>Test Video Source</Label>
                <Select
                  value={newCamera.url}
                  onChange={(e) => setNewCamera({ ...newCamera, url: e.target.value })}
                >
                  <option value="">Select a test video...</option>
                  <option value="sample1">Sample Video 1 (Indoor)</option>
                  <option value="sample2">Sample Video 2 (Outdoor)</option>
                  <option value="sample3">Sample Video 3 (Parking)</option>
                </Select>
              </FormGroup>
            )}

            {newCamera.type !== 'usb' && newCamera.type !== 'test' && (
              <>
                <FormGroup>
                  <Label>Username</Label>
                  <Input
                    type="text"
                    placeholder="Enter camera username"
                    value={newCamera.username}
                    onChange={(e) => setNewCamera({ ...newCamera, username: e.target.value })}
                  />
                </FormGroup>

                <FormGroup>
                  <Label>Password</Label>
                  <Input
                    type="password"
                    placeholder="Enter camera password"
                    value={newCamera.password}
                    onChange={(e) => setNewCamera({ ...newCamera, password: e.target.value })}
                  />
                </FormGroup>
              </>
            )}

            <FormGroup>
              <Label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Input
                  type="checkbox"
                  checked={newCamera.isRecordingEnabled}
                  onChange={(e) => setNewCamera({ ...newCamera, isRecordingEnabled: e.target.checked })}
                />
                Enable Recording
              </Label>
            </FormGroup>

            <FormGroup>
              <Label>Initial Status</Label>
              <Select
                value={newCamera.status}
                onChange={(e) => setNewCamera({ ...newCamera, status: e.target.value })}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending Setup</option>
              </Select>
            </FormGroup>

            <ButtonGroup>
              <Button type="submit" primary disabled={!newCamera.name || (!newCamera.url && newCamera.type !== 'usb')}>
                Add Camera
              </Button>
              <Button type="button" onClick={() => setShowAddCameraModal(false)}>Cancel</Button>
            </ButtonGroup>
          </ConfigurationForm>
        </ConfigModal>
      )}
    </>
  );
  
  const renderEvents = () => (
    <>
      <TabsContainer>
        <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All Events</Tab>
        <Tab active={activeTab === 'person'} onClick={() => setActiveTab('person')}>Person Detection</Tab>
        <Tab active={activeTab === 'vehicle'} onClick={() => setActiveTab('vehicle')}>Vehicle Detection</Tab>
        <Tab active={activeTab === 'object'} onClick={() => setActiveTab('object')}>Object Detection</Tab>
      </TabsContainer>
      
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Camera</th>
              <th>Timestamp</th>
              <th>Confidence</th>
              <th>Details</th>
              <th>Status</th>
              <th>Alert</th>
            </tr>
          </thead>
          <tbody>
            {mockEvents
              .filter(event => {
                if (activeTab === 'person') return event.type === 'person_detected';
                if (activeTab === 'vehicle') return event.type === 'vehicle_detected';
                if (activeTab === 'object') return event.type === 'object_detected';
                return true; // 'all' tab shows all events
              })
              .map(event => (
                <tr key={event.id}>
                  <td>#{event.id}</td>
                  <td>
                    <StatusBadge status={
                      event.type === 'person_detected' ? 'active' :
                      event.type === 'vehicle_detected' ? 'pending' : 'inactive'
                    }>
                      {event.type.split('_')[0].charAt(0).toUpperCase() + event.type.split('_')[0].slice(1)}
                    </StatusBadge>
                  </td>
                  <td>{event.camera}</td>
                  <td>{event.timestamp}</td>
                  <td>{event.details.confidence}%</td>
                  <td>
                    {Object.entries(event.details)
                      .filter(([key]) => key !== 'confidence')
                      .map(([key, value]) => (
                        <div key={key} style={{ fontSize: '12px' }}>
                          {key}: {value}
                        </div>
                      ))
                    }
                  </td>
                  <td>
                    <StatusBadge status={event.status === 'processed' ? 'active' : 'pending'}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </StatusBadge>
                  </td>
                  <td>
                    {event.alert_generated ? (
                      <StatusBadge status="inactive">Generated</StatusBadge>
                    ) : (
                      <StatusBadge status="pending">None</StatusBadge>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </TableContainer>
      
      <HeaderButton>
        <span className="material-icons">download</span>
        Export Events
      </HeaderButton>
    </>
  );
  
  const renderAlerts = () => (
    <>
      <TabsContainer>
        <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All Alerts</Tab>
        <Tab active={activeTab === 'new'} onClick={() => setActiveTab('new')}>New</Tab>
        <Tab active={activeTab === 'in_progress'} onClick={() => setActiveTab('in_progress')}>In Progress</Tab>
        <Tab active={activeTab === 'resolved'} onClick={() => setActiveTab('resolved')}>Resolved</Tab>
      </TabsContainer>
      
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Camera</th>
              <th>Timestamp</th>
              <th>Severity</th>
              <th>Message</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockAlerts
              .filter(alert => {
                if (activeTab === 'new') return alert.status === 'new';
                if (activeTab === 'in_progress') return alert.status === 'in_progress';
                if (activeTab === 'resolved') return alert.status === 'resolved';
                return true; // 'all' tab shows all alerts
              })
              .map(alert => (
                <tr key={alert.id}>
                  <td>#{alert.id}</td>
                  <td>
                    <StatusBadge status={
                      alert.type === 'intrusion' ? 'inactive' :
                      alert.type === 'system' ? 'pending' : 'active'
                    }>
                      {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}
                    </StatusBadge>
                  </td>
                  <td>{alert.camera}</td>
                  <td>{alert.timestamp}</td>
                  <td>
                    <StatusBadge status={
                      alert.severity === 'high' ? 'inactive' :
                      alert.severity === 'medium' ? 'pending' : 'active'
                    }>
                      {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                    </StatusBadge>
                  </td>
                  <td>{alert.message}</td>
                  <td>
                    <StatusBadge status={
                      alert.status === 'new' ? 'inactive' :
                      alert.status === 'in_progress' ? 'pending' : 'active'
                    }>
                      {alert.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </StatusBadge>
                  </td>
                  <td>{alert.assignedTo || '—'}</td>
                  <td>
                    <ActionButton>View</ActionButton>
                    {alert.status !== 'resolved' && (
                      <ActionButton>Resolve</ActionButton>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </Table>
      </TableContainer>
      
      <HeaderButton>
        <span className="material-icons">download</span>
        Export Alerts
      </HeaderButton>
    </>
  );
  
  const renderModelConfigurationForm = () => (
    <ConfigurationForm onSubmit={handleSaveModelConfig}>
      <FormGroup>
        <Label>Confidence Threshold (%)</Label>
        <Input
          type="number"
          min={configForm.minConfidence}
          max="100"
          value={configForm.threshold}
          onChange={(e) => setConfigForm({ ...configForm, threshold: e.target.value })}
        />
      </FormGroup>

      <FormGroup>
        <Label>Processing Mode</Label>
        <Select
          value={configForm.mode}
          onChange={(e) => setConfigForm({ ...configForm, mode: e.target.value })}
        >
          <option value="GPU Accelerated">GPU Accelerated (CUDA)</option>
          <option value="GPU Accelerated OpenCL">GPU Accelerated (OpenCL)</option>
          <option value="CPU Only">CPU Only</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>NMS Threshold</Label>
        <Input
          type="number"
          min="0"
          max="1"
          step="0.05"
          value={configForm.modelSpecificSettings.nmsThreshold}
          onChange={(e) => setConfigForm({
            ...configForm,
            modelSpecificSettings: {
              ...configForm.modelSpecificSettings,
              nmsThreshold: e.target.value
            }
          })}
        />
        <span style={{ color: '#999', fontSize: '12px' }}>
          Non-maximum suppression threshold for overlapping detections
        </span>
      </FormGroup>

      <FormGroup>
        <Label>Inference Size</Label>
        <Select
          value={configForm.modelSpecificSettings.inferenceSize}
          onChange={(e) => setConfigForm({
            ...configForm,
            modelSpecificSettings: {
              ...configForm.modelSpecificSettings,
              inferenceSize: parseInt(e.target.value)
            }
          })}
        >
          <option value="416">416x416 (Faster)</option>
          <option value="640">640x640 (Balanced)</option>
          <option value="1024">1024x1024 (More Accurate)</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>
          <Input
            type="checkbox"
            checked={configForm.modelSpecificSettings.augmentation}
            onChange={(e) => setConfigForm({
              ...configForm,
              modelSpecificSettings: {
                ...configForm.modelSpecificSettings,
                augmentation: e.target.checked
              }
            })}
          />
          Enable Test Time Augmentation
        </Label>
      </FormGroup>

      <FormGroup>
        <Label>
          <Input
            type="checkbox"
            checked={configForm.modelSpecificSettings.ensembleMode}
            onChange={(e) => setConfigForm({
              ...configForm,
              modelSpecificSettings: {
                ...configForm.modelSpecificSettings,
                ensembleMode: e.target.checked
              }
            })}
          />
          Enable Model Ensemble
        </Label>
      </FormGroup>

      {selectedModel.type === 'Object Detection' && (
        <FormGroup>
          <Label>Custom Object Classes</Label>
          <Input
            type="text"
            placeholder="Enter comma-separated class names"
            value={configForm.customClasses.join(', ')}
            onChange={(e) => setConfigForm({ 
              ...configForm, 
              customClasses: e.target.value.split(',').map(s => s.trim())
            })}
          />
        </FormGroup>
      )}

      <ButtonGroup>
        <Button type="submit" primary>Save Model Configuration</Button>
        <Button type="button" onClick={() => setShowConfigureModal(false)}>Cancel</Button>
      </ButtonGroup>
    </ConfigurationForm>
  );

  const renderProcessingConfigurationForm = () => (
    <ConfigurationForm onSubmit={handleSaveProcessingConfig}>
      {processingConfig.options ? (
        <FormGroup>
          <Label>{processingConfig.name}</Label>
          <Select
            value={configForm.value}
            onChange={(e) => setConfigForm({ ...configForm, value: e.target.value })}
          >
            {processingConfig.options.map(option => (
              <option key={option} value={option}>
                {typeof option === 'boolean' ? (option ? 'Enabled' : 'Disabled') : option}
              </option>
            ))}
          </Select>
        </FormGroup>
      ) : (
        <FormGroup>
          <Label>{processingConfig.name}</Label>
          <Input
            type="number"
            min={configForm.min}
            max={configForm.max}
            value={configForm.value}
            onChange={(e) => setConfigForm({ ...configForm, value: e.target.value })}
          />
          <span style={{ color: '#999', fontSize: '12px' }}>
            Range: {configForm.min} - {configForm.max} {configForm.unit}
          </span>
        </FormGroup>
      )}

      <FormGroup>
        <Label>Power Mode</Label>
        <Select
          value={configForm.advanced.powerMode}
          onChange={(e) => setConfigForm({
            ...configForm,
            advanced: { ...configForm.advanced, powerMode: e.target.value }
          })}
        >
          <option value="High Performance">High Performance</option>
          <option value="Balanced">Balanced</option>
          <option value="Power Saver">Power Saver</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label>Resource Allocation (%)</Label>
        <Input
          type="number"
          min="10"
          max="100"
          value={configForm.advanced.resourceAllocation}
          onChange={(e) => setConfigForm({
            ...configForm,
            advanced: { ...configForm.advanced, resourceAllocation: e.target.value }
          })}
        />
        <span style={{ color: '#999', fontSize: '12px' }}>
          Percentage of system resources allocated to this process
        </span>
      </FormGroup>

      <FormGroup>
        <Label>
          <Input
            type="checkbox"
            checked={configForm.advanced.loadBalancing}
            onChange={(e) => setConfigForm({
              ...configForm,
              advanced: { ...configForm.advanced, loadBalancing: e.target.checked }
            })}
          />
          Enable Load Balancing
        </Label>
      </FormGroup>

      <FormGroup>
        <Label>
          <Input
            type="checkbox"
            checked={configForm.advanced.scheduledDowntime}
            onChange={(e) => setConfigForm({
              ...configForm,
              advanced: { ...configForm.advanced, scheduledDowntime: e.target.checked }
            })}
          />
          Enable Scheduled Downtime
        </Label>
      </FormGroup>

      <ButtonGroup>
        <Button type="submit" primary>Save Processing Configuration</Button>
        <Button type="button" onClick={() => setShowConfigureModal(false)}>Cancel</Button>
      </ButtonGroup>
    </ConfigurationForm>
  );
  
  const renderSettings = () => (
    <>
      <TabsContainer>
        <Tab active={activeTab === 'general'} onClick={() => setActiveTab('general')}>
          <span className="material-icons">settings</span>
          General
        </Tab>
        <Tab active={activeTab === 'security'} onClick={() => setActiveTab('security')}>
          <span className="material-icons">security</span>
          Security
        </Tab>
        <Tab active={activeTab === 'ai'} onClick={() => setActiveTab('ai')}>
          <span className="material-icons">psychology</span>
          AI & Detection
        </Tab>
        <Tab active={activeTab === 'storage'} onClick={() => setActiveTab('storage')}>
          <span className="material-icons">storage</span>
          Storage
        </Tab>
        <Tab active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>
          <span className="material-icons">notifications</span>
          Notifications
        </Tab>
        <Tab active={activeTab === 'maintenance'} onClick={() => setActiveTab('maintenance')}>
          <span className="material-icons">build</span>
          Maintenance
        </Tab>
        <Tab active={activeTab === 'integrations'} onClick={() => setActiveTab('integrations')}>
          <span className="material-icons">extension</span>
          Integrations
        </Tab>
      </TabsContainer>
      
      {activeTab === 'ai' ? (
        <>
          <DashboardCard>
            <h3>
              AI Model Configuration
              <span className="material-icons">psychology</span>
            </h3>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <th>Model Type</th>
                    <th>Version</th>
                    <th>Status</th>
                    <th>Confidence Threshold</th>
                    <th>Processing Mode</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Person Detection</td>
                    <td>v2.3.0</td>
                    <td><StatusBadge status="active">Active</StatusBadge></td>
                    <td>85%</td>
                    <td>GPU Accelerated</td>
                    <td>
                      <ActionButton onClick={() => handleConfigureModel({
                        type: 'Person Detection',
                        version: 'v2.3.0',
                        threshold: 85,
                        mode: 'GPU Accelerated'
                      })}>Configure</ActionButton>
                      <ActionButton onClick={() => handleUpdateModel({
                        type: 'Person Detection',
                        version: 'v2.3.0',
                        latestVersion: 'v2.4.0'
                      })}>Update</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Vehicle Detection</td>
                    <td>v1.8.5</td>
                    <td><StatusBadge status="active">Active</StatusBadge></td>
                    <td>80%</td>
                    <td>GPU Accelerated</td>
                    <td>
                      <ActionButton onClick={() => handleConfigureModel({
                        type: 'Vehicle Detection',
                        version: 'v1.8.5',
                        threshold: 80,
                        mode: 'GPU Accelerated'
                      })}>Configure</ActionButton>
                      <ActionButton onClick={() => handleUpdateModel({
                        type: 'Vehicle Detection',
                        version: 'v1.8.5',
                        latestVersion: 'v2.0.0'
                      })}>Update</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Object Detection</td>
                    <td>v3.1.2</td>
                    <td><StatusBadge status="active">Active</StatusBadge></td>
                    <td>75%</td>
                    <td>GPU Accelerated</td>
                    <td>
                      <ActionButton onClick={() => handleConfigureModel({
                        type: 'Object Detection',
                        version: 'v3.1.2',
                        threshold: 75,
                        mode: 'GPU Accelerated'
                      })}>Configure</ActionButton>
                      <ActionButton onClick={() => handleUpdateModel({
                        type: 'Object Detection',
                        version: 'v3.1.2',
                        latestVersion: 'v3.2.0'
                      })}>Update</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Behavior Analysis</td>
                    <td>v1.2.0</td>
                    <td><StatusBadge status="pending">Beta</StatusBadge></td>
                    <td>70%</td>
                    <td>CPU Only</td>
                    <td>
                      <ActionButton onClick={() => handleConfigureModel({
                        type: 'Behavior Analysis',
                        version: 'v1.2.0',
                        threshold: 70,
                        mode: 'CPU Only'
                      })}>Configure</ActionButton>
                      <ActionButton onClick={() => handleUpdateModel({
                        type: 'Behavior Analysis',
                        version: 'v1.2.0',
                        latestVersion: 'v1.3.0-beta'
                      })}>Update</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Weapon Detection</td>
                    <td>v2.0.1</td>
                    <td><StatusBadge status="active">Active</StatusBadge></td>
                    <td>90%</td>
                    <td>GPU Accelerated</td>
                    <td>
                      <ActionButton onClick={() => handleConfigureModel({
                        type: 'Weapon Detection',
                        version: 'v2.0.1',
                        threshold: 90,
                        mode: 'GPU Accelerated'
                      })}>Configure</ActionButton>
                      <ActionButton onClick={() => handleUpdateModel({
                        type: 'Weapon Detection',
                        version: 'v2.0.1',
                        latestVersion: 'v2.1.0'
                      })}>Update</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <DashboardCard style={{ marginTop: '24px' }}>
            <h3>
              AI Processing Settings
              <span className="material-icons">settings_suggest</span>
            </h3>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <th>Setting</th>
                    <th>Value</th>
                    <th>Status</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>GPU Acceleration</td>
                    <td>Enabled (CUDA)</td>
                    <td><StatusBadge status="active">Active</StatusBadge></td>
                    <td>Hardware acceleration for AI processing</td>
                    <td>
                      <ActionButton onClick={() => handleConfigureProcessing({
                        name: 'GPU Acceleration',
                        value: 'Enabled (CUDA)',
                        options: ['Enabled (CUDA)', 'Enabled (OpenCL)', 'Disabled']
                      })}>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Batch Processing</td>
                    <td>32 frames</td>
                    <td><StatusBadge status="active">Active</StatusBadge></td>
                    <td>Number of frames processed in parallel</td>
                    <td>
                      <ActionButton onClick={() => handleConfigureProcessing({
                        name: 'Batch Processing',
                        value: '32',
                        min: 1,
                        max: 64,
                        unit: 'frames'
                      })}>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Processing Resolution</td>
                    <td>1080p</td>
                    <td><StatusBadge status="active">Active</StatusBadge></td>
                    <td>Resolution for AI processing</td>
                    <td>
                      <ActionButton onClick={() => handleConfigureProcessing({
                        name: 'Processing Resolution',
                        value: '1080p',
                        options: ['720p', '1080p', '1440p', '4K']
                      })}>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Frame Skip Rate</td>
                    <td>2 frames</td>
                    <td><StatusBadge status="active">Active</StatusBadge></td>
                    <td>Number of frames to skip during processing</td>
                    <td>
                      <ActionButton onClick={() => handleConfigureProcessing({
                        name: 'Frame Skip Rate',
                        value: '2',
                        min: 0,
                        max: 10,
                        unit: 'frames'
                      })}>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Auto Model Updates</td>
                    <td>Enabled</td>
                    <td><StatusBadge status="active">Active</StatusBadge></td>
                    <td>Automatic AI model updates</td>
                    <td>
                      <ActionButton onClick={() => handleConfigureProcessing({
                        name: 'Auto Model Updates',
                        value: true,
                        options: [true, false]
                      })}>Configure</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <HeaderButton style={{ marginTop: '24px' }} onClick={handleRestartAI}>
            <span className="material-icons">restart_alt</span>
            Restart AI Processing
          </HeaderButton>

          {/* Configuration Modal */}
          {showConfigureModal && (
            <ConfigModal 
              title={selectedModel ? `Configure ${selectedModel.type}` : `Configure ${processingConfig.name}`}
              onClose={() => setShowConfigureModal(false)}
            >
              {selectedModel ? renderModelConfigurationForm() : renderProcessingConfigurationForm()}
            </ConfigModal>
          )}

          {/* Update Modal */}
          {showUpdateModal && (
            <ConfigModal
              title={`Update ${selectedModel.type}`}
              onClose={() => setShowUpdateModal(false)}
            >
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ color: '#ccc', marginBottom: '8px' }}>Current Version: {selectedModel.version}</h3>
                <h3 style={{ color: '#3498db', marginBottom: '16px' }}>New Version: {selectedModel.latestVersion}</h3>
                
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: '#ccc', marginBottom: '8px' }}>Update Changes:</h4>
                  <ul style={{ color: '#ccc', marginLeft: '24px' }}>
                    <li>Improved detection accuracy by 15%</li>
                    <li>Reduced false positives in low-light conditions</li>
                    <li>Added support for new object classes</li>
                    <li>Optimized GPU memory usage</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ color: '#ccc', marginBottom: '8px' }}>Requirements:</h4>
                  <ul style={{ color: '#ccc', marginLeft: '24px' }}>
                    <li>Minimum 4GB GPU memory</li>
                    <li>CUDA 11.0 or higher</li>
                    <li>System restart required</li>
                  </ul>
                </div>

                <div style={{ color: '#e74c3c', marginBottom: '24px' }}>
                  Note: The system will be temporarily unavailable during the update process.
                </div>
              </div>

              <ButtonGroup>
                <Button primary onClick={handleApplyUpdate}>Apply Update</Button>
                <Button onClick={() => setShowUpdateModal(false)}>Cancel</Button>
              </ButtonGroup>
            </ConfigModal>
          )}
        </>
      ) : activeTab === 'security' ? (
        <>
          <DashboardCard>
            <h3>
              Authentication Settings
              <span className="material-icons">security</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '250px' }}>Password Policy</td>
                    <td>Strong (min 12 chars, special chars required)</td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Multi-Factor Authentication</td>
                    <td>Required for Admin & Operator roles</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Session Timeout</td>
                    <td>30 minutes (auto-logout)</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Failed Login Attempts</td>
                    <td>5 attempts (30-minute lockout)</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <DashboardCard style={{ marginTop: '24px' }}>
            <h3>
              Network Security
              <span className="material-icons">router</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '250px' }}>API Access Control</td>
                    <td>IP Whitelist Enabled (3 addresses)</td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>SSL/TLS Version</td>
                    <td>TLS 1.3 (Required)</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>CORS Policy</td>
                    <td>Strict (2 domains allowed)</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Rate Limiting</td>
                    <td>100 requests/minute per IP</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <DashboardCard style={{ marginTop: '24px' }}>
            <h3>
              Data Security
              <span className="material-icons">lock</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '250px' }}>Data Encryption</td>
                    <td>AES-256 (At rest & in transit)</td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Backup Encryption</td>
                    <td>Enabled (RSA-4096)</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Data Retention Policy</td>
                    <td>90 days (Configurable per data type)</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Access Logging</td>
                    <td>Full audit trail enabled</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <DashboardCard style={{ marginTop: '24px' }}>
            <h3>
              System Security
              <span className="material-icons">gpp_good</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '250px' }}>Automatic Updates</td>
                    <td>Security patches only (Immediate install)</td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Vulnerability Scanning</td>
                    <td>Daily (Automated response enabled)</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Intrusion Detection</td>
                    <td>Active (High sensitivity)</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Emergency Access</td>
                    <td>2 super admins configured</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <ButtonGroup style={{ marginTop: '24px' }}>
            <Button primary onClick={handleSaveSecuritySettings}>Save Security Changes</Button>
            <Button>Security Audit Report</Button>
            <Button>Reset to Defaults</Button>
          </ButtonGroup>
        </>
      ) : activeTab === 'general' ? (
        <>
          <DashboardCard>
            <h3>
              System Information
              <span className="material-icons">info</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '200px' }}>System Name</td>
                    <td>MDI AI Detection System</td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Edit</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Version</td>
                    <td>2.3.1</td>
                    <td>
                      <ActionButton>Update</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Installation Date</td>
                    <td>2024-01-15</td>
                    <td></td>
                  </tr>
                  <tr>
                    <td>Last Update</td>
                    <td>2025-03-10</td>
                    <td></td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <DashboardCard style={{ marginTop: '24px' }}>
            <h3>
              Regional Settings
              <span className="material-icons">language</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '200px' }}>Time Zone</td>
                    <td>UTC-05:00 (Eastern Time)</td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Change</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Date Format</td>
                    <td>YYYY-MM-DD</td>
                    <td>
                      <ActionButton>Change</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Time Format</td>
                    <td>24-hour</td>
                    <td>
                      <ActionButton>Change</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Language</td>
                    <td>English (US)</td>
                    <td>
                      <ActionButton>Change</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <DashboardCard style={{ marginTop: '24px' }}>
            <h3>
              Interface Settings
              <span className="material-icons">palette</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '200px' }}>Theme</td>
                    <td>Dark</td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Change</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Default Layout</td>
                    <td>2x2 Grid</td>
                    <td>
                      <ActionButton>Change</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Session Timeout</td>
                    <td>30 minutes</td>
                    <td>
                      <ActionButton>Change</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Show Welcome Screen</td>
                    <td>Enabled</td>
                    <td>
                      <ActionButton>Change</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <DashboardCard style={{ marginTop: '24px' }}>
            <h3>
              System Maintenance
              <span className="material-icons">build</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '200px' }}>Auto Updates</td>
                    <td>Enabled (Security updates only)</td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>System Backup</td>
                    <td>Daily at 02:00</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Log Retention</td>
                    <td>90 days</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Performance Mode</td>
                    <td>Balanced</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <ButtonGroup style={{ marginTop: '24px' }}>
            <Button primary onClick={handleSaveAllChanges}>Save All Changes</Button>
            <Button>Reset to Defaults</Button>
          </ButtonGroup>
        </>
      ) : activeTab === 'storage' ? (
        <>
          <DashboardCard>
            <h3>
              Storage Overview
              <span className="material-icons">storage</span>
            </h3>
            <DashboardGrid>
              <DashboardCard>
                <h3>Total Storage</h3>
                <StatsValue>5<span className="stat-unit">TB</span></StatsValue>
                <StatsLabel>Total allocated storage</StatsLabel>
              </DashboardCard>
              <DashboardCard>
                <h3>Used Storage</h3>
                <StatsValue>2.83<span className="stat-unit">TB</span></StatsValue>
                <StatsLabel>56.6% of total storage</StatsLabel>
              </DashboardCard>
              <DashboardCard>
                <h3>Available Storage</h3>
                <StatsValue>2.17<span className="stat-unit">TB</span></StatsValue>
                <StatsLabel>43.4% remaining</StatsLabel>
              </DashboardCard>
              <DashboardCard>
                <h3>Growth Rate</h3>
                <StatsValue>12.5<span className="stat-unit">GB/day</span></StatsValue>
                <StatsLabel>Average over 30 days</StatsLabel>
              </DashboardCard>
            </DashboardGrid>
          </DashboardCard>

          <DashboardCard style={{ marginTop: '24px' }}>
            <h3>
              Storage Configuration
              <span className="material-icons">settings_suggest</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '250px' }}>Storage Location</td>
                    <td>
                      <FormGroup style={{ margin: 0 }}>
                        <Label style={{ marginBottom: '8px' }}>Select storage options:</Label>
                        <div style={{ display: 'flex', gap: '16px' }}>
                          <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <Input type="checkbox" defaultChecked /> Local Storage
                          </Label>
                          <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <Input type="checkbox" defaultChecked /> Cloud Storage
                          </Label>
                        </div>
                      </FormGroup>
                    </td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Save</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Compression</td>
                    <td>
                      <Select defaultValue="enabled" style={{ width: '200px' }}>
                        <option value="enabled">Enabled (H.265 + ZSTD)</option>
                        <option value="disabled">Disabled</option>
                      </Select>
                    </td>
                    <td>
                      <ActionButton>Save</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <DashboardCard style={{ marginTop: '24px' }}>
            <h3>
              Retention Policies
              <span className="material-icons">policy</span>
            </h3>
            <div style={{ padding: '20px' }}>
              <FormGroup>
                <Label>Video Footage Retention</Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Input
                    type="range"
                    min="1"
                    max="90"
                    defaultValue="30"
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      const value = e.target.value;
                      e.target.nextElementSibling.textContent = `${value} ${value === '1' ? 'day' : 'days'}`;
                    }}
                  />
                  <span style={{ minWidth: '80px', color: '#ccc' }}>30 days</span>
                </div>
              </FormGroup>

              <FormGroup style={{ marginTop: '16px' }}>
                <Label>Maximum Storage Size</Label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <Input
                    type="range"
                    min="100"
                    max="10000"
                    step="100"
                    defaultValue="5000"
                    style={{ flex: 1 }}
                    onChange={(e) => {
                      const value = e.target.value;
                      const displayValue = value >= 1000 ? `${value/1000} TB` : `${value} GB`;
                      e.target.nextElementSibling.textContent = displayValue;
                    }}
                  />
                  <span style={{ minWidth: '80px', color: '#ccc' }}>5 TB</span>
                </div>
              </FormGroup>
            </div>
          </DashboardCard>

          <ButtonGroup style={{ marginTop: '24px' }}>
            <Button primary onClick={handleSaveStorageSettings}>Save Storage Settings</Button>
            <Button>Storage Health Check</Button>
            <Button>Clean Up Storage</Button>
          </ButtonGroup>
        </>
      ) : activeTab === 'notifications' ? (
        <>
          <DashboardCard>
            <h3>
              Alert Notifications
              <span className="material-icons">notifications_active</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '250px' }}>Email Notifications</td>
                    <td>
                      <FormGroup style={{ margin: 0 }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <Input type="checkbox" defaultChecked /> Enable Email Alerts
                          </Label>
                          <Select defaultValue="high" style={{ width: '200px' }}>
                            <option value="all">All Alerts</option>
                            <option value="high">High Priority Only</option>
                            <option value="custom">Custom Rules</option>
                          </Select>
                        </div>
                      </FormGroup>
                    </td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Push Notifications</td>
                    <td>
                      <FormGroup style={{ margin: 0 }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <Input type="checkbox" defaultChecked /> Enable Push Notifications
                          </Label>
                          <Select defaultValue="all" style={{ width: '200px' }}>
                            <option value="all">All Devices</option>
                            <option value="mobile">Mobile Only</option>
                            <option value="desktop">Desktop Only</option>
                          </Select>
                        </div>
                      </FormGroup>
                    </td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>SMS Notifications</td>
                    <td>
                      <FormGroup style={{ margin: 0 }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <Input type="checkbox" /> Enable SMS Alerts
                          </Label>
                          <Select defaultValue="emergency" style={{ width: '200px' }}>
                            <option value="emergency">Emergency Only</option>
                            <option value="high">High Priority</option>
                            <option value="all">All Alerts</option>
                          </Select>
                        </div>
                      </FormGroup>
                    </td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>In-App Notifications</td>
                    <td>
                      <FormGroup style={{ margin: 0 }}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                          <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                            <Input type="checkbox" defaultChecked /> Enable In-App Alerts
                          </Label>
                          <Select defaultValue="all" style={{ width: '200px' }}>
                            <option value="all">All Alerts</option>
                            <option value="silent">Silent Mode</option>
                            <option value="custom">Custom Settings</option>
                          </Select>
                        </div>
                      </FormGroup>
                    </td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <DashboardCard style={{ marginTop: '24px' }}>
            <h3>
              Alert Rules & Filters
              <span className="material-icons">filter_list</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '250px' }}>Detection Types</td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                          <Input type="checkbox" defaultChecked /> Person Detection
                        </Label>
                        <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                          <Input type="checkbox" defaultChecked /> Vehicle Detection
                        </Label>
                        <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                          <Input type="checkbox" defaultChecked /> Object Detection
                        </Label>
                        <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                          <Input type="checkbox" defaultChecked /> Weapon Detection
                        </Label>
                      </div>
                    </td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Alert Priority</td>
                    <td>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                          <Input type="checkbox" defaultChecked /> Emergency
                        </Label>
                        <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                          <Input type="checkbox" defaultChecked /> High
                        </Label>
                        <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                          <Input type="checkbox" defaultChecked /> Medium
                        </Label>
                        <Label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
                          <Input type="checkbox" /> Low
                        </Label>
                      </div>
                    </td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Time Schedule</td>
                    <td>
                      <Select defaultValue="247" style={{ width: '200px' }}>
                        <option value="247">24/7 (Always)</option>
                        <option value="business">Business Hours</option>
                        <option value="custom">Custom Schedule</option>
                        <option value="off">Off Hours Only</option>
                      </Select>
                    </td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Camera Selection</td>
                    <td>
                      <Select defaultValue="all" style={{ width: '200px' }}>
                        <option value="all">All Cameras</option>
                        <option value="exterior">Exterior Only</option>
                        <option value="interior">Interior Only</option>
                        <option value="custom">Custom Selection</option>
                      </Select>
                    </td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <DashboardCard style={{ marginTop: '24px' }}>
            <h3>
              Notification Recipients
              <span className="material-icons">contact_mail</span>
            </h3>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Alert Types</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>John Smith</td>
                    <td>Admin</td>
                    <td>john.smith@example.com</td>
                    <td>+1 (555) 123-4567</td>
                    <td>All</td>
                    <td><StatusBadge status="active">Active</StatusBadge></td>
                    <td>
                      <ActionButton>Edit</ActionButton>
                      <ActionButton>Remove</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Sarah Johnson</td>
                    <td>Security</td>
                    <td>sarah.j@example.com</td>
                    <td>+1 (555) 234-5678</td>
                    <td>High Priority</td>
                    <td><StatusBadge status="active">Active</StatusBadge></td>
                    <td>
                      <ActionButton>Edit</ActionButton>
                      <ActionButton>Remove</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Emergency Team</td>
                    <td>Group</td>
                    <td>emergency@example.com</td>
                    <td>Multiple</td>
                    <td>Emergency Only</td>
                    <td><StatusBadge status="active">Active</StatusBadge></td>
                    <td>
                      <ActionButton>Edit</ActionButton>
                      <ActionButton>Remove</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <ButtonGroup style={{ marginTop: '24px' }}>
            <Button primary onClick={handleSaveNotificationSettings}>Save Notification Settings</Button>
            <Button>Test Notifications</Button>
            <Button>Reset to Defaults</Button>
          </ButtonGroup>
        </>
      ) : activeTab === 'maintenance' ? (
        <>
          <DashboardCard>
            <h3>
              System Health
              <span className="material-icons">monitor_heart</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '250px' }}>CPU Usage</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, backgroundColor: '#2c3e50', height: '8px', borderRadius: '4px' }}>
                          <div style={{ width: '45%', height: '100%', backgroundColor: '#27ae60', borderRadius: '4px' }}></div>
                        </div>
                        <span>45%</span>
                      </div>
                    </td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Details</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Memory Usage</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, backgroundColor: '#2c3e50', height: '8px', borderRadius: '4px' }}>
                          <div style={{ width: '72%', height: '100%', backgroundColor: '#f39c12', borderRadius: '4px' }}></div>
                        </div>
                        <span>72%</span>
                      </div>
                    </td>
                    <td>
                      <ActionButton>Details</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Storage Usage</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ flex: 1, backgroundColor: '#2c3e50', height: '8px', borderRadius: '4px' }}>
                          <div style={{ width: '85%', height: '100%', backgroundColor: '#e74c3c', borderRadius: '4px' }}></div>
                        </div>
                        <span>85%</span>
                      </div>
                    </td>
                    <td>
                      <ActionButton>Details</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Network Status</td>
                    <td>
                      <StatusBadge status="active">Healthy (250 Mbps)</StatusBadge>
                    </td>
                    <td>
                      <ActionButton>Details</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <DashboardCard style={{ marginTop: '24px' }}>
            <h3>
              Maintenance Tasks
              <span className="material-icons">schedule</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '250px' }}>Database Optimization</td>
                    <td>Last run: 3 days ago</td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Run Now</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Storage Cleanup</td>
                    <td>Last run: 1 day ago</td>
                    <td>
                      <ActionButton>Run Now</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>System Updates</td>
                    <td>2 updates available</td>
                    <td>
                      <ActionButton>Install</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Error Log Cleanup</td>
                    <td>Last run: 7 days ago</td>
                    <td>
                      <ActionButton>Run Now</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <DashboardCard style={{ marginTop: '24px' }}>
            <h3>
              Scheduled Tasks
              <span className="material-icons">calendar_today</span>
            </h3>
            <TableContainer>
              <Table>
                <tbody>
                  <tr>
                    <td style={{ width: '250px' }}>Daily Backup</td>
                    <td>Every day at 02:00</td>
                    <td style={{ width: '100px' }}>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>System Health Check</td>
                    <td>Every 6 hours</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>Storage Optimization</td>
                    <td>Every Sunday at 03:00</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                  <tr>
                    <td>AI Model Updates</td>
                    <td>Check daily at 04:00</td>
                    <td>
                      <ActionButton>Configure</ActionButton>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <ButtonGroup style={{ marginTop: '24px' }}>
            <Button primary>Save Changes</Button>
            <Button>Run All Maintenance Tasks</Button>
            <Button>Reset Schedule</Button>
          </ButtonGroup>
        </>
      ) : (
      <DashboardCard>
        <h3>
          System Settings
          <span className="material-icons">settings</span>
        </h3>
        <p>Configure global system settings and preferences.</p>
        
        <div style={{ color: '#999', fontStyle: 'italic', marginTop: '20px' }}>
          Settings section would contain controls for system configuration,
          security policies, storage management, and notification preferences.
        </div>
      </DashboardCard>
      )}
    </>
  );
  
  const renderLogs = () => (
    <>
      <TabsContainer>
        <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>All Logs</Tab>
        <Tab active={activeTab === 'system'} onClick={() => setActiveTab('system')}>System</Tab>
        <Tab active={activeTab === 'user'} onClick={() => setActiveTab('user')}>User</Tab>
        <Tab active={activeTab === 'alerts'} onClick={() => setActiveTab('alerts')}>Alerts</Tab>
      </TabsContainer>
      
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Level</th>
              <th>Source</th>
              <th>Message</th>
              <th>User</th>
              <th>IP Address</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-03-14 10:32:15</td>
              <td><StatusBadge status="active">INFO</StatusBadge></td>
              <td>User System</td>
              <td>User permissions updated</td>
              <td>George M.</td>
              <td>192.168.1.105</td>
            </tr>
            <tr>
              <td>2025-03-14 09:15:22</td>
              <td><StatusBadge>INFO</StatusBadge></td>
              <td>Camera System</td>
              <td>Camera configuration changed</td>
              <td>Admin</td>
              <td>192.168.1.105</td>
            </tr>
            <tr>
              <td>2025-03-13 18:42:01</td>
              <td><StatusBadge status="inactive">ERROR</StatusBadge></td>
              <td>Camera System</td>
              <td>Camera offline: Loading Dock</td>
              <td>System</td>
              <td>--</td>
            </tr>
            <tr>
              <td>2025-03-13 16:22:45</td>
              <td><StatusBadge status="pending">WARNING</StatusBadge></td>
              <td>Storage System</td>
              <td>Disk space below 50%</td>
              <td>System</td>
              <td>--</td>
            </tr>
          </tbody>
        </Table>
      </TableContainer>
      
      <HeaderButton>
        <span className="material-icons">download</span>
        Export Logs
      </HeaderButton>
    </>
  );
  
  const renderSubscription = () => (
    <>
      <DashboardGrid>
        <DashboardCard>
          <h3>
            Current Plan
            <span className="material-icons">workspace_premium</span>
          </h3>
          <StatsValue>{mockSubscriptionData.currentPlan}</StatsValue>
          <StatsLabel>
            Next billing: {mockSubscriptionData.nextBilling}
          </StatsLabel>
          <StatsChange positive>
            <span className="material-icons">check_circle</span>
            {mockSubscriptionData.status.charAt(0).toUpperCase() + mockSubscriptionData.status.slice(1)}
          </StatsChange>
        </DashboardCard>
      </DashboardGrid>

      <h2>Plan Features & Usage</h2>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Plan Limit</th>
              <th>Current Usage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {mockSubscriptionData.features.map((feature, index) => (
              <tr key={index}>
                <td>{feature.name}</td>
                <td>{feature.value}</td>
                <td>{feature.used}</td>
                <td>
                  <StatusBadge status="active">Active</StatusBadge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <h2>Billing History</h2>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {mockSubscriptionData.billingHistory.map(bill => (
              <tr key={bill.id}>
                <td>{bill.date}</td>
                <td>{bill.invoice}</td>
                <td>{bill.amount}</td>
                <td>
                  <StatusBadge status="active">{bill.status.charAt(0).toUpperCase() + bill.status.slice(1)}</StatusBadge>
                </td>
                <td>
                  <ActionButton>
                    <span className="material-icons" style={{ fontSize: '16px', marginRight: '4px' }}>download</span>
                    Download
                  </ActionButton>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableContainer>

      <HeaderButton>
        <span className="material-icons">card_membership</span>
        Upgrade Plan
      </HeaderButton>
    </>
  );
  
  const renderRoleSettings = () => {
    if (!selectedRole) return null;

    const settings = roleSettings[selectedRole.name];
    if (!settings) return null;

    return (
      <DashboardCard>
        <h3>
          Role Settings: {selectedRole.name}
          <span className="material-icons">admin_panel_settings</span>
        </h3>
        
        {Object.entries(settings).map(([category, permissions]) => (
          <div key={category} style={{ marginBottom: '24px' }}>
            <h4 style={{ 
              color: '#ccc', 
              marginBottom: '16px',
              textTransform: 'capitalize',
              borderBottom: '1px solid #333',
              paddingBottom: '8px'
            }}>
              {category} Settings
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {Object.entries(permissions).map(([permission, enabled]) => (
                <Label key={permission} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  margin: 0,
                  padding: '8px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px'
                }}>
                  <Input
                    type="checkbox"
                    checked={enabled}
                    onChange={(e) => {
                      setRoleSettings(prev => ({
                        ...prev,
                        [selectedRole.name]: {
                          ...prev[selectedRole.name],
                          [category]: {
                            ...prev[selectedRole.name][category],
                            [permission]: e.target.checked
                          }
                        }
                      }));
                    }}
                  />
                  {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </Label>
              ))}
            </div>
          </div>
        ))}
        
        <ButtonGroup>
          <Button primary onClick={handleSaveRoleSettings}>Save Role Settings</Button>
          <Button onClick={() => setSelectedRole(null)}>Cancel</Button>
        </ButtonGroup>
      </DashboardCard>
    );
  };
  
  const renderBackups = () => (
    <>
      <TabsContainer>
        <Tab active={activeTab === 'backups'} onClick={() => setActiveTab('backups')}>Backups</Tab>
        <Tab active={activeTab === 'settings'} onClick={() => setActiveTab('settings')}>Settings</Tab>
        <Tab active={activeTab === 'restore'} onClick={() => setActiveTab('restore')}>Restore</Tab>
      </TabsContainer>

      {activeTab === 'backups' && (
        <>
          <DashboardCard>
            <h3>
              System Backups
              <span className="material-icons">backup</span>
            </h3>
            <TableContainer>
              <Table>
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Status</th>
                    <th>Includes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {backups.map(backup => (
                    <tr key={backup.id}>
                      <td>{backup.timestamp}</td>
                      <td>{backup.type}</td>
                      <td>{backup.size}</td>
                      <td>
                        <StatusBadge status={backup.status}>
                          {backup.status.charAt(0).toUpperCase() + backup.status.slice(1)}
                        </StatusBadge>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {backup.includes.map(item => (
                            <span key={item} style={{
                              padding: '2px 6px',
                              backgroundColor: 'rgba(52, 152, 219, 0.1)',
                              borderRadius: '4px',
                              fontSize: '12px',
                              color: '#3498db'
                            }}>
                              {item}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <ActionButton onClick={() => handleRestoreBackup(backup.id)}>Restore</ActionButton>
                        <ActionButton onClick={() => handleDeleteBackup(backup.id)}>Delete</ActionButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </DashboardCard>

          <HeaderButton onClick={handleCreateBackup}>
            <span className="material-icons">add</span>
            Create New Backup
          </HeaderButton>
        </>
      )}

      {activeTab === 'settings' && (
        <DashboardCard>
          <h3>
            Backup Configuration
            <span className="material-icons">settings_backup_restore</span>
          </h3>
          <ConfigurationForm onSubmit={(e) => {
            e.preventDefault();
            handleSaveBackupSettings();
          }}>
            <FormGroup>
              <Label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Input
                  type="checkbox"
                  checked={backupSettings.autoBackup}
                  onChange={(e) => setBackupSettings({
                    ...backupSettings,
                    autoBackup: e.target.checked
                  })}
                />
                Enable Automatic Backups
              </Label>
            </FormGroup>

            {backupSettings.autoBackup && (
              <>
                <FormGroup>
                  <Label>Backup Frequency</Label>
                  <Select
                    value={backupSettings.backupFrequency}
                    onChange={(e) => setBackupSettings({
                      ...backupSettings,
                      backupFrequency: e.target.value
                    })}
                  >
                    <option value="hourly">Every Hour</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </Select>
                </FormGroup>

                <FormGroup>
                  <Label>Backup Time</Label>
                  <Input
                    type="time"
                    value={backupSettings.backupTime}
                    onChange={(e) => setBackupSettings({
                      ...backupSettings,
                      backupTime: e.target.value
                    })}
                  />
                </FormGroup>
              </>
            )}

            <FormGroup>
              <Label>Retention Period (Days)</Label>
              <Input
                type="number"
                min="1"
                max="365"
                value={backupSettings.retentionDays}
                onChange={(e) => setBackupSettings({
                  ...backupSettings,
                  retentionDays: parseInt(e.target.value)
                })}
              />
            </FormGroup>

            <FormGroup>
              <Label>Backup Location</Label>
              <Select
                value={backupSettings.backupLocation}
                onChange={(e) => setBackupSettings({
                  ...backupSettings,
                  backupLocation: e.target.value
                })}
              >
                <option value="local">Local Storage</option>
                <option value="nas">Network Storage (NAS)</option>
                <option value="cloud">Cloud Storage</option>
              </Select>
            </FormGroup>

            <FormGroup>
              <Label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Input
                  type="checkbox"
                  checked={backupSettings.includeVideoData}
                  onChange={(e) => setBackupSettings({
                    ...backupSettings,
                    includeVideoData: e.target.checked
                  })}
                />
                Include Video Data in Backups
              </Label>
            </FormGroup>

            <FormGroup>
              <Label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Input
                  type="checkbox"
                  checked={backupSettings.encryptBackups}
                  onChange={(e) => setBackupSettings({
                    ...backupSettings,
                    encryptBackups: e.target.checked
                  })}
                />
                Encrypt Backups
              </Label>
            </FormGroup>

            <ButtonGroup>
              <Button type="submit" primary>Save Settings</Button>
              <Button type="button" onClick={() => setBackupSettings({
                autoBackup: true,
                backupFrequency: 'daily',
                backupTime: '00:00',
                retentionDays: 30,
                includeVideoData: false,
                backupLocation: 'local',
                encryptBackups: true
              })}>Reset to Defaults</Button>
            </ButtonGroup>
          </ConfigurationForm>
        </DashboardCard>
      )}

      {activeTab === 'restore' && (
        <DashboardCard>
          <h3>
            Restore System
            <span className="material-icons">restore</span>
          </h3>
          <div style={{ color: '#e74c3c', padding: '16px', backgroundColor: 'rgba(231, 76, 60, 0.1)', borderRadius: '4px', marginBottom: '24px' }}>
            <h4 style={{ color: '#e74c3c', marginBottom: '8px' }}>⚠️ Warning</h4>
            <p>Restoring from a backup will:</p>
            <ul style={{ marginLeft: '24px', marginTop: '8px' }}>
              <li>Override all current system settings</li>
              <li>Replace existing user data and configurations</li>
              <li>Require a system restart</li>
            </ul>
            <p style={{ marginTop: '8px' }}>Make sure to create a backup of your current system before proceeding.</p>
          </div>

          <TableContainer>
            <Table>
              <thead>
                <tr>
                  <th>Backup Date</th>
                  <th>Size</th>
                  <th>Contents</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {backups.map(backup => (
                  <tr key={backup.id}>
                    <td>{backup.timestamp}</td>
                    <td>{backup.size}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                        {backup.includes.map(item => (
                          <span key={item} style={{
                            padding: '2px 6px',
                            backgroundColor: 'rgba(52, 152, 219, 0.1)',
                            borderRadius: '4px',
                            fontSize: '12px',
                            color: '#3498db'
                          }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td>
                      <Button primary onClick={() => handleRestoreBackup(backup.id)}>
                        Restore from this Backup
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableContainer>
        </DashboardCard>
      )}
    </>
  );
  
  const renderContent = () => {
    switch (section) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'roles':
        return renderRoles();
      case 'cameras':
        return renderCameras();
      case 'events':
        return renderEvents();
      case 'alerts':
        return renderAlerts();
      case 'settings':
        return renderSettings();
      case 'logs':
        return renderLogs();
      case 'subscription':
        return renderSubscription();
      case 'backups':
        return renderBackups();
      default:
        return renderDashboard();
    }
  };
  
  return (
    <SuperAdminContainer>
      <AdminHeader>
        <AdminLogo>
          <span className="material-icons">admin_panel_settings</span>
          MDI System Administrator
        </AdminLogo>
        <HeaderActions>
          <HeaderButton>
            <span className="material-icons">help_outline</span>
            Help
          </HeaderButton>
          <HeaderButton onClick={onClose}>
            <span className="material-icons">close</span>
            Return to App
          </HeaderButton>
        </HeaderActions>
      </AdminHeader>
      
      <AdminMain>
        <AdminSidebar>
          <AdminNav>
            <NavSection>
              <SectionTitle>System Management</SectionTitle>
              <NavItem active={section === 'dashboard'} onClick={() => setSection('dashboard')}>
                <span className="material-icons">dashboard</span>
                Dashboard
              </NavItem>
              <NavItem active={section === 'roles'} onClick={() => setSection('roles')}>
                <span className="material-icons">admin_panel_settings</span>
                Roles & Permissions
              </NavItem>
              <NavItem active={section === 'users'} onClick={() => setSection('users')}>
                <span className="material-icons">people</span>
                User Management
              </NavItem>
            </NavSection>
            
            <NavSection>
              <SectionTitle>Security</SectionTitle>
              <NavItem active={section === 'cameras'} onClick={() => setSection('cameras')}>
                <span className="material-icons">videocam</span>
                Cameras
              </NavItem>
              <NavItem active={section === 'alerts'} onClick={() => setSection('alerts')}>
                <span className="material-icons">notifications</span>
                Alerts
              </NavItem>
              <NavItem active={section === 'events'} onClick={() => setSection('events')}>
                <span className="material-icons">event</span>
                Events
              </NavItem>
            </NavSection>
            
            <NavSection>
              <SectionTitle>Configuration</SectionTitle>
              <NavItem active={section === 'settings'} onClick={() => setSection('settings')}>
                <span className="material-icons">settings</span>
                System Settings
              </NavItem>
              <NavItem active={section === 'logs'} onClick={() => setSection('logs')}>
                <span className="material-icons">receipt_long</span>
                Audit Logs
              </NavItem>
              <NavItem active={section === 'backups'} onClick={() => setSection('backups')}>
                <span className="material-icons">backup</span>
                Backup & Restore
              </NavItem>
            </NavSection>
          </AdminNav>
        </AdminSidebar>
        
        <AdminContent>
          <h2>{section.charAt(0).toUpperCase() + section.slice(1)}</h2>
          {renderContent()}
        </AdminContent>
      </AdminMain>
      
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
        onCancel={() => setConfirmDialog(prev => ({ ...prev, isOpen: false }))}
      />
    </SuperAdminContainer>
  );
};

export default SuperAdminPanel; 