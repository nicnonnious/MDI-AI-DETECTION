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

const SuperAdminPanel = ({ onClose, activeSection = 'dashboard' }) => {
  const [section, setSection] = useState(activeSection);
  const [activeTab, setActiveTab] = useState('all');
  
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
            {mockUsers.map(user => (
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
      
      <HeaderButton>
        <span className="material-icons">add</span>
        Add New User
      </HeaderButton>
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
            {/* Filter cameras based on the selected tab */}
            {mockCameras
              .filter(camera => {
                if (activeTab === 'active') return camera.status === 'active';
                if (activeTab === 'inactive') return camera.status === 'inactive';
                return true; // 'all' tab shows all cameras
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
              ))
            }
          </tbody>
        </Table>
      </TableContainer>
      
      <HeaderButton>
        <span className="material-icons">add</span>
        Add New Camera
      </HeaderButton>
    </>
  );
  
  const renderSettings = () => (
    <>
      <TabsContainer>
        <Tab active={activeTab === 'general'} onClick={() => setActiveTab('general')}>General</Tab>
        <Tab active={activeTab === 'security'} onClick={() => setActiveTab('security')}>Security</Tab>
        <Tab active={activeTab === 'storage'} onClick={() => setActiveTab('storage')}>Storage</Tab>
        <Tab active={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')}>Notifications</Tab>
      </TabsContainer>
      
      <DashboardCard>
        <h3>
          System Settings
          <span className="material-icons">settings</span>
        </h3>
        <p>Configure global system settings and preferences.</p>
        
        {/* This would contain actual settings controls in a real implementation */}
        <div style={{ color: '#999', fontStyle: 'italic', marginTop: '20px' }}>
          Settings section would contain controls for system configuration,
          security policies, storage management, and notification preferences.
        </div>
      </DashboardCard>
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
  
  const renderContent = () => {
    switch (section) {
      case 'dashboard':
        return renderDashboard();
      case 'users':
        return renderUsers();
      case 'cameras':
        return renderCameras();
      case 'settings':
        return renderSettings();
      case 'logs':
        return renderLogs();
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
              <SectionTitle>Main</SectionTitle>
              <NavItem active={section === 'dashboard'} onClick={() => setSection('dashboard')}>
                <span className="material-icons">dashboard</span>
                Dashboard
              </NavItem>
              <NavItem active={section === 'users'} onClick={() => setSection('users')}>
                <span className="material-icons">people</span>
                Users
              </NavItem>
              <NavItem active={section === 'cameras'} onClick={() => setSection('cameras')}>
                <span className="material-icons">videocam</span>
                Cameras
              </NavItem>
            </NavSection>
            
            <NavSection>
              <SectionTitle>Management</SectionTitle>
              <NavItem active={section === 'settings'} onClick={() => setSection('settings')}>
                <span className="material-icons">settings</span>
                Settings
              </NavItem>
              <NavItem active={section === 'logs'} onClick={() => setSection('logs')}>
                <span className="material-icons">receipt_long</span>
                System Logs
              </NavItem>
              <NavItem active={section === 'backup'} onClick={() => setSection('backup')}>
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
    </SuperAdminContainer>
  );
};

export default SuperAdminPanel; 