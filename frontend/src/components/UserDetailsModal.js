import React, { useState } from 'react';
import styled from 'styled-components';

const ModalOverlay = styled.div`
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

const ModalContent = styled.div`
  background-color: #1e1e1e;
  border-radius: 8px;
  width: 90%;
  max-width: 1200px;
  height: 90vh;
  color: white;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  padding: 20px;
  border-bottom: 1px solid #333;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h2`
  margin: 0;
  font-size: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
`;

const TabContainer = styled.div`
  border-bottom: 1px solid #333;
`;

const TabList = styled.div`
  display: flex;
  padding: 0 20px;
`;

const Tab = styled.div`
  padding: 15px 20px;
  cursor: pointer;
  color: ${props => props.active ? '#fff' : '#999'};
  border-bottom: 2px solid ${props => props.active ? '#0d6efd' : 'transparent'};
  
  &:hover {
    color: #fff;
  }
`;

const ContentArea = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const Label = styled.div`
  color: #999;
  font-size: 14px;
  padding: 8px;
  background: #2a2a2a;
  border-radius: 4px;
`;

const Value = styled.div`
  color: #fff;
  font-size: 14px;
  padding: 8px;
  background: #353535;
  border-radius: 4px;
  word-break: break-all;
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

const TableContainer = styled.div`
  margin: 20px 0;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid #333;
  }
  
  th {
    background-color: #2a2a2a;
    color: #999;
    font-weight: 500;
  }
  
  tr:hover td {
    background-color: #2c3e50;
  }
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#3498db' : '#2c3e50'};
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background-color: ${props => props.primary ? '#2980b9' : '#34495e'};
  }
  
  &:disabled {
    background-color: #444;
    cursor: not-allowed;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
`;

const Footer = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #333;
  background: #1e1e1e;
`;

const CloseButton = styled.button`
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  min-width: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  &:hover {
    background-color: #bb2d3b;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const UserDetailsModal = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState('info');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleDelete = () => {
    if (deleteConfirmation.toLowerCase() === 'delete') {
      setIsDeleting(true);
      // Simulate delete operation
      setTimeout(() => {
        setIsDeleting(false);
        onClose();
      }, 2000);
    }
  };

  const renderInfoTab = () => (
    <div>
      <Grid>
        <Label>User ID</Label>
        <Value>#{user.id}</Value>
        
        <Label>Full Name</Label>
        <Value>{user.name}</Value>
        
        <Label>Email</Label>
        <Value>{user.email}</Value>
        
        <Label>Role</Label>
        <Value>{user.role}</Value>
        
        <Label>Status</Label>
        <Value>
          <StatusBadge status={user.status}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </StatusBadge>
        </Value>
        
        <Label>Last Active</Label>
        <Value>{user.lastActive}</Value>
        
        <Label>Created At</Label>
        <Value>2025-01-15</Value>
        
        <Label>Last Password Change</Label>
        <Value>2025-03-01</Value>
        
        <Label>2FA Status</Label>
        <Value>
          <StatusBadge status="active">Enabled</StatusBadge>
        </Value>
      </Grid>
    </div>
  );

  const renderActivityTab = () => (
    <div>
      <TableContainer>
        <Table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Action</th>
              <th>IP Address</th>
              <th>Device</th>
              <th>Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-03-14 10:30</td>
              <td>Login successful</td>
              <td>192.168.1.100</td>
              <td>Chrome / Windows</td>
              <td>New York, US</td>
            </tr>
            <tr>
              <td>2025-03-14 09:15</td>
              <td>Password changed</td>
              <td>192.168.1.100</td>
              <td>Chrome / Windows</td>
              <td>New York, US</td>
            </tr>
            <tr>
              <td>2025-03-13 16:45</td>
              <td>Logout</td>
              <td>192.168.1.100</td>
              <td>Chrome / Windows</td>
              <td>New York, US</td>
            </tr>
          </tbody>
        </Table>
      </TableContainer>
    </div>
  );

  const renderPermissionsTab = () => (
    <div>
      <Grid>
        <Label>Role</Label>
        <Value>{user.role}</Value>
        
        <Label>User Management</Label>
        <Value>View Only</Value>
        
        <Label>Camera Access</Label>
        <Value>Full Access</Value>
        
        <Label>Alert Management</Label>
        <Value>View & Respond</Value>
        
        <Label>System Settings</Label>
        <Value>No Access</Value>
        
        <Label>API Access</Label>
        <Value>Read Only</Value>
      </Grid>
    </div>
  );

  const renderUpdateTab = () => (
    <div>
      <Grid>
        <Label>Status</Label>
        <Value>
          <select style={{ background: '#353535', border: 'none', color: 'white', width: '100%', padding: '4px' }}>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </Value>
        
        <Label>Role</Label>
        <Value>
          <select style={{ background: '#353535', border: 'none', color: 'white', width: '100%', padding: '4px' }}>
            <option value="Admin">Administrator</option>
            <option value="Operator">Operator</option>
            <option value="Viewer">Viewer</option>
          </select>
        </Value>
        
        <Label>Email</Label>
        <Value>
          <input 
            type="email" 
            value={user.email}
            style={{ background: '#353535', border: 'none', color: 'white', width: '100%', padding: '4px' }}
          />
        </Value>
      </Grid>
      
      <ButtonGroup>
        <Button primary>
          <span className="material-icons">save</span>
          Save Changes
        </Button>
        <Button>
          <span className="material-icons">refresh</span>
          Reset
        </Button>
      </ButtonGroup>
    </div>
  );

  const renderDeleteTab = () => (
    <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
      <span className="material-icons" style={{ fontSize: '48px', color: '#e74c3c', marginBottom: '16px' }}>
        warning
      </span>
      <h3 style={{ color: '#e74c3c', marginBottom: '24px' }}>Delete User Account</h3>
      <p style={{ color: '#999', marginBottom: '24px' }}>
        This action cannot be undone. This will permanently delete the user account
        and remove all associated data.
      </p>
      <div style={{ marginBottom: '24px' }}>
        <input
          type="text"
          placeholder="Type 'delete' to confirm"
          value={deleteConfirmation}
          onChange={(e) => setDeleteConfirmation(e.target.value)}
          style={{
            background: '#353535',
            border: `2px solid ${deleteConfirmation.toLowerCase() === 'delete' ? '#2ecc71' : '#e74c3c'}`,
            borderRadius: '4px',
            color: 'white',
            padding: '8px 16px',
            width: '100%',
            maxWidth: '300px'
          }}
        />
      </div>
      <ButtonGroup style={{ justifyContent: 'center' }}>
        <Button
          onClick={handleDelete}
          disabled={deleteConfirmation.toLowerCase() !== 'delete' || isDeleting}
          style={{ backgroundColor: '#e74c3c' }}
        >
          {isDeleting ? (
            <>
              <span className="material-icons">hourglass_empty</span>
              Deleting...
            </>
          ) : (
            <>
              <span className="material-icons">delete_forever</span>
              Delete User
            </>
          )}
        </Button>
      </ButtonGroup>
    </div>
  );

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Header>
          <Title>
            <span className="material-icons">person</span>
            User Details
          </Title>
          <StatusBadge status={user.status}>
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </StatusBadge>
        </Header>

        <TabContainer>
          <TabList>
            <Tab active={activeTab === 'info'} onClick={() => handleTabChange('info')}>
              <span className="material-icons">info</span> Info
            </Tab>
            <Tab active={activeTab === 'activity'} onClick={() => handleTabChange('activity')}>
              <span className="material-icons">history</span> Activity
            </Tab>
            <Tab active={activeTab === 'permissions'} onClick={() => handleTabChange('permissions')}>
              <span className="material-icons">security</span> Permissions
            </Tab>
            <Tab active={activeTab === 'update'} onClick={() => handleTabChange('update')}>
              <span className="material-icons">edit</span> Update
            </Tab>
            <Tab active={activeTab === 'delete'} onClick={() => handleTabChange('delete')}>
              <span className="material-icons">delete</span> Delete
            </Tab>
          </TabList>
        </TabContainer>

        <ContentArea>
          {activeTab === 'info' && renderInfoTab()}
          {activeTab === 'activity' && renderActivityTab()}
          {activeTab === 'permissions' && renderPermissionsTab()}
          {activeTab === 'update' && renderUpdateTab()}
          {activeTab === 'delete' && renderDeleteTab()}
        </ContentArea>

        <Footer>
          <CloseButton onClick={onClose}>
            <span className="material-icons">close</span>
            Close
          </CloseButton>
        </Footer>
      </ModalContent>
    </ModalOverlay>
  );
};

export default UserDetailsModal; 