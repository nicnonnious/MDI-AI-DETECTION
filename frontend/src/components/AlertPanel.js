import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { fetchAlerts, severityColors, alertStatusColors, alertTypeIcons } from '../mockAlerts';

const AlertPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  
  /* Adjust styling based on docked state */
  ${props => props.isDocked && `
    border-radius: 0;
    background-color: transparent;
  `}
`;

const CompactFilterSection = styled.div`
  padding: ${props => props.isDocked ? '10px' : '12px'};
  border-bottom: 1px solid #333;
  background-color: ${props => props.isDocked ? 'transparent' : 'rgba(44, 44, 44, 0.7)'};
  
  /* Reduce spacing in docked mode */
  ${props => props.isDocked && `
    .filter-row {
      margin-bottom: 8px;
    }
  `}
`;

const FilterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
  gap: 10px;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  /* Make responsive in docked mode */
  ${props => props.isDocked && `
    @media (max-width: 1200px) {
      flex-direction: ${props.stack ? 'column' : 'row'};
      align-items: ${props.stack ? 'stretch' : 'center'};
      gap: 8px;
    }
  `}
`;

const QuickFilterChips = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  
  /* Adjust sizing in docked mode */
  ${props => props.isDocked && `
    gap: 4px;
  `}
`;

const FilterChip = styled.div`
  padding: 4px 8px;
  background-color: ${props => props.active ? '#3498db' : '#2c2c2c'};
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  color: ${props => props.active ? 'white' : '#ccc'};
  border: 1px solid ${props => props.active ? '#3498db' : '#444'};
  transition: all 0.15s ease;
  
  .icon {
    font-size: 12px;
  }
  
  &:hover {
    background-color: ${props => props.active ? '#2980b9' : '#333'};
  }
  
  /* Smaller in docked mode */
  ${props => props.isDocked && `
    padding: 3px 6px;
    font-size: 10px;
    
    .icon {
      font-size: 11px;
    }
    
    @media (max-width: 1200px) {
      flex: 1;
      justify-content: center;
    }
  `}
`;

const SearchInput = styled.div`
  position: relative;
  width: 100%;
  
  input {
    width: 100%;
    padding: ${props => props.isDocked ? '5px 10px 5px 28px' : '6px 10px 6px 30px'};
    background-color: #2c2c2c;
    border: 1px solid #444;
    border-radius: 4px;
    color: white;
    font-size: ${props => props.isDocked ? '11px' : '12px'};
    
    &:focus {
      outline: none;
      border-color: #3498db;
    }
    
    &::placeholder {
      color: #999;
    }
  }
  
  .search-icon {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    font-size: ${props => props.isDocked ? '12px' : '14px'};
  }
`;

const CameraDropdown = styled.select`
  padding: ${props => props.isDocked ? '5px 6px' : '6px 8px'};
  background-color: #2c2c2c;
  color: white;
  border: 1px solid #444;
  border-radius: 4px;
  font-size: ${props => props.isDocked ? '11px' : '12px'};
  flex: 1;
  
  &:focus {
    outline: none;
    border-color: #3498db;
  }
  
  /* Adjust width in docked mode */
  ${props => props.isDocked && `
    @media (max-width: 1200px) {
      width: 100%;
    }
  `}
`;

const AlertList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 0;
  background-color: ${props => props.isDocked ? 'transparent' : 'rgba(26, 26, 26, 0.9)'};
`;

const NoAlertsMessage = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: ${props => props.isDocked ? '140px' : '180px'};
  color: #777;
  font-style: italic;
  gap: 12px;
  
  .material-icons {
    font-size: ${props => props.isDocked ? '28px' : '32px'};
    opacity: 0.6;
  }
`;

const AlertItem = styled.div`
  padding: ${props => props.isDocked ? '10px 12px' : '12px 15px'};
  border-bottom: 1px solid #333;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  flex-direction: column;
  gap: ${props => props.isDocked ? '10px' : '12px'};
  align-items: flex-start;
  position: relative;
  
  &:hover {
    background-color: ${props => props.isDocked ? 'rgba(44, 44, 44, 0.5)' : 'rgba(44, 44, 44, 0.7)'};
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background-color: ${props => props.color || 'transparent'};
  }
`;

const AlertHeader = styled.div`
  display: flex;
  width: 100%;
  gap: ${props => props.isDocked ? '10px' : '12px'};
`;

const MediaContainer = styled.div`
  margin-top: 8px;
  width: 100%;
  display: ${props => props.expanded ? 'block' : 'none'};
`;

const ThumbnailContainer = styled.div`
  position: relative;
  margin-bottom: 8px;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  width: 100%;
  height: ${props => props.isDocked ? '120px' : '160px'};
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const BoundingBox = styled.div`
  position: absolute;
  border: 2px solid #f39c12;
  border-radius: 2px;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.5);
  top: ${props => props.y}px;
  left: ${props => props.x}px;
  width: ${props => props.width}px;
  height: ${props => props.height}px;
  
  &::before {
    content: '${props => props.label}';
    position: absolute;
    top: -20px;
    left: 0;
    background-color: #f39c12;
    color: black;
    font-size: 10px;
    padding: 2px 5px;
    border-radius: 2px;
    font-weight: bold;
  }
`;

const VideoClipContainer = styled.div`
  width: 100%;
  border-radius: 4px;
  overflow: hidden;
  background-color: #1a1a1a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
`;

const VideoControls = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 6px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const VideoButton = styled.button`
  background-color: transparent;
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  border-radius: 3px;
  font-size: 11px;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .material-icons {
    font-size: 14px;
    margin-right: 4px;
  }
`;

const AlertBadge = styled.div`
  position: absolute;
  top: -10px;
  right: -10px;
  background-color: #e74c3c;
  color: white;
  font-size: 12px;
  font-weight: bold;
  border-radius: 10px;
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  
  /* Hide badge in docked mode since it appears in the header */
  ${props => props.isDocked && `
    display: none;
  `}
`;

const AlertTypeIcon = styled.div`
  background-color: #2c2c2c;
  width: ${props => props.isDocked ? '28px' : '32px'};
  height: ${props => props.isDocked ? '28px' : '32px'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${props => props.isDocked ? '14px' : '16px'};
`;

const AlertContent = styled.div`
  flex: 1;
`;

const AlertDescription = styled.div`
  color: white;
  font-size: ${props => props.isDocked ? '12px' : '13px'};
  margin-bottom: 4px;
`;

const AlertMeta = styled.div`
  display: flex;
  justify-content: space-between;
  color: #aaa;
  font-size: ${props => props.isDocked ? '10px' : '11px'};
`;

const AlertTimestamp = styled.span``;

const AlertCameraName = styled.span`
  color: #3498db;
`;

const AlertActionsBar = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${props => props.isDocked ? '6px 10px' : '8px 12px'};
  background-color: #2c2c2c;
  border-top: 1px solid #333;
`;

const AlertCounter = styled.div`
  color: #ccc;
  font-size: ${props => props.isDocked ? '11px' : '12px'};
  display: flex;
  align-items: center;
  gap: 5px;
  
  span.count {
    font-weight: bold;
    color: white;
  }
  
  /* Hide non-essential text in very small docked view */
  ${props => props.isDocked && `
    @media (max-width: 992px) {
      .counter-text {
        display: none;
      }
    }
  `}
`;

const ActionButton = styled.button`
  background-color: ${props => props.primary ? '#3498db' : '#2c2c2c'};
  color: white;
  border: ${props => props.primary ? 'none' : '1px solid #444'};
  border-radius: 4px;
  padding: ${props => props.isDocked ? '4px 8px' : '5px 10px'};
  cursor: pointer;
  font-size: ${props => props.isDocked ? '10px' : '11px'};
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: ${props => props.primary ? '#2980b9' : '#333'};
  }
  
  .material-icons {
    font-size: ${props => props.isDocked ? '11px' : '12px'};
  }
  
  /* Hide button text in small docked view */
  ${props => props.isDocked && `
    @media (max-width: 992px) {
      .button-text {
        display: none;
      }
      padding: 4px;
      gap: 0;
    }
  `}
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${props => props.isDocked ? '6px' : '8px'};
`;

// Sample camera data (this would be passed in as a prop in a real app)
const cameras = [
  { id: 1, name: 'North Entrance', isLive: true },
  { id: 2, name: 'Warehouse Floor', isLive: true },
  { id: 3, name: 'Parking Lot A', isLive: true },
  { id: 4, name: 'Loading Dock', isLive: false },
  { id: 5, name: 'Office Entrance', isLive: true },
  { id: 6, name: 'South Gate', isLive: true },
  { id: 7, name: 'East Wing', isLive: true },
  { id: 8, name: 'West Wing', isLive: false },
  { id: 9, name: 'Reception', isLive: true }
];

const AlertPanel = ({ activeCamera, isDocked = false }) => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedAlerts, setExpandedAlerts] = useState({});
  const [selectedCamera, setSelectedCamera] = useState(activeCamera || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Quick filters
  const [showCritical, setShowCritical] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [showUnresolved, setShowUnresolved] = useState(true);
  
  // Type filter
  const [selectedType, setSelectedType] = useState('all');
  
  // Fetch alerts when component mounts or filters change
  useEffect(() => {
    const loadAlerts = async () => {
      setLoading(true);
      try {
        const cameraId = selectedCamera === 'all' ? null : parseInt(selectedCamera);
        const alertData = await fetchAlerts(cameraId);
        setAlerts(alertData);
        setError(null);
      } catch (err) {
        console.error("Error fetching alerts:", err);
        setError("Failed to load alerts. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    
    loadAlerts();
  }, [selectedCamera]);
  
  // Handle camera selection change
  const handleCameraChange = (e) => {
    setSelectedCamera(e.target.value);
  };
  
  // Filter alerts based on quick filters and search
  const filteredAlerts = alerts.filter(alert => {
    // Filter by camera
    if (selectedCamera !== 'all' && alert.cameraId !== parseInt(selectedCamera)) {
      return false;
    }
    
    // Filter by type
    if (selectedType !== 'all' && alert.type !== selectedType) {
      return false;
    }
    
    // Filter by critical
    if (showCritical && (alert.severity !== 'critical' && alert.severity !== 'high')) {
      return false;
    }
    
    // Filter by recent (less than 1 hour old)
    if (showRecent) {
      const alertTime = new Date(alert.timestamp);
      const oneHourAgo = new Date();
      oneHourAgo.setHours(oneHourAgo.getHours() - 1);
      if (alertTime < oneHourAgo) {
        return false;
      }
    }
    
    // Filter by unresolved
    if (showUnresolved && alert.status !== 'pending') {
      return false;
    }
    
    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        alert.description.toLowerCase().includes(searchLower) ||
        alert.type.toLowerCase().includes(searchLower) ||
        getCameraName(alert.cameraId).toLowerCase().includes(searchLower)
      );
    }
    
    return true;
  });
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Get camera name by ID
  const getCameraName = (cameraId) => {
    const camera = cameras.find(c => c.id === cameraId);
    return camera ? camera.name : `Camera ${cameraId}`;
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const toggleAlertExpand = (alertId) => {
    setExpandedAlerts(prev => ({
      ...prev,
      [alertId]: !prev[alertId]
    }));
  };
  
  return (
    <AlertPanelContainer isDocked={isDocked}>
      <CompactFilterSection isDocked={isDocked}>
        <FilterRow className="filter-row" isDocked={isDocked}>
          <QuickFilterChips isDocked={isDocked}>
            <FilterChip 
              active={showCritical} 
              onClick={() => setShowCritical(!showCritical)}
              isDocked={isDocked}
            >
              <span className="material-icons icon">priority_high</span>
              Critical
            </FilterChip>
            <FilterChip 
              active={showRecent} 
              onClick={() => setShowRecent(!showRecent)}
              isDocked={isDocked}
            >
              <span className="material-icons icon">schedule</span>
              Recent
            </FilterChip>
            <FilterChip 
              active={showUnresolved} 
              onClick={() => setShowUnresolved(!showUnresolved)}
              isDocked={isDocked}
            >
              <span className="material-icons icon">error_outline</span>
              Unresolved
            </FilterChip>
          </QuickFilterChips>
        </FilterRow>
        
        <FilterRow className="filter-row" isDocked={isDocked}>
          <SearchInput isDocked={isDocked}>
            <span className="material-icons search-icon">search</span>
            <input 
              type="text" 
              placeholder="Search alerts..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </SearchInput>
        </FilterRow>
        
        <FilterRow className="filter-row" isDocked={isDocked} stack={true}>
          <CameraDropdown value={selectedCamera} onChange={handleCameraChange} isDocked={isDocked}>
            <option value="all">All Cameras</option>
            {cameras.map(camera => (
              <option key={camera.id} value={camera.id}>
                {camera.name}
              </option>
            ))}
          </CameraDropdown>
          
          <QuickFilterChips isDocked={isDocked}>
            <FilterChip 
              active={selectedType === 'all'} 
              onClick={() => setSelectedType('all')}
              isDocked={isDocked}
            >
              All
            </FilterChip>
            <FilterChip 
              active={selectedType === 'person'} 
              onClick={() => setSelectedType('person')}
              isDocked={isDocked}
            >
              <span className="icon">{alertTypeIcons.person}</span>
            </FilterChip>
            <FilterChip 
              active={selectedType === 'vehicle'} 
              onClick={() => setSelectedType('vehicle')}
              isDocked={isDocked}
            >
              <span className="icon">{alertTypeIcons.vehicle}</span>
            </FilterChip>
            <FilterChip 
              active={selectedType === 'gun'} 
              onClick={() => setSelectedType('gun')}
              isDocked={isDocked}
            >
              <span className="icon">{alertTypeIcons.gun}</span>
            </FilterChip>
          </QuickFilterChips>
        </FilterRow>
      </CompactFilterSection>
      
      <AlertList isDocked={isDocked}>
        {loading ? (
          <NoAlertsMessage isDocked={isDocked}>
            <span className="material-icons">hourglass_empty</span>
            Loading alerts...
          </NoAlertsMessage>
        ) : error ? (
          <NoAlertsMessage isDocked={isDocked}>
            <span className="material-icons">error_outline</span>
            {error}
          </NoAlertsMessage>
        ) : filteredAlerts.length === 0 ? (
          <NoAlertsMessage isDocked={isDocked}>
            <span className="material-icons">notifications_off</span>
            No alerts match your filters
          </NoAlertsMessage>
        ) : (
          filteredAlerts.map(alert => (
            <AlertItem 
              key={alert.id} 
              color={severityColors[alert.severity]}
              isDocked={isDocked}
              onClick={() => toggleAlertExpand(alert.id)}
            >
              <AlertHeader isDocked={isDocked}>
                <AlertTypeIcon isDocked={isDocked}>
                  {alertTypeIcons[alert.type]}
                </AlertTypeIcon>
                <AlertContent>
                  <AlertDescription isDocked={isDocked}>{alert.description}</AlertDescription>
                  <AlertMeta isDocked={isDocked}>
                    <AlertTimestamp>{formatDate(alert.timestamp)}</AlertTimestamp>
                    <AlertCameraName>{getCameraName(alert.cameraId)}</AlertCameraName>
                  </AlertMeta>
                </AlertContent>
              </AlertHeader>
              
              <MediaContainer expanded={expandedAlerts[alert.id]}>
                {alert.imageSnapshot && (
                  <ThumbnailContainer isDocked={isDocked}>
                    <ThumbnailImage src={alert.imageSnapshot} alt="Detection snapshot" />
                    {alert.boundingBox && (
                      <BoundingBox 
                        x={alert.boundingBox.x} 
                        y={alert.boundingBox.y} 
                        width={alert.boundingBox.width} 
                        height={alert.boundingBox.height}
                        label={alert.type}
                      />
                    )}
                  </ThumbnailContainer>
                )}
                
                {alert.videoClip && (
                  <VideoClipContainer>
                    <video 
                      src={alert.videoClip} 
                      controls 
                      width="100%" 
                      height={isDocked ? "120" : "160"}
                      poster={alert.imageSnapshot}
                    />
                    <VideoControls>
                      <VideoButton>
                        <span className="material-icons">save_alt</span>
                        Save Clip
                      </VideoButton>
                      <VideoButton>
                        <span className="material-icons">share</span>
                        Share
                      </VideoButton>
                    </VideoControls>
                  </VideoClipContainer>
                )}
              </MediaContainer>
            </AlertItem>
          ))
        )}
      </AlertList>
      
      <AlertActionsBar isDocked={isDocked}>
        <AlertCounter isDocked={isDocked}>
          <span className="count">{filteredAlerts.length}</span> <span className="counter-text">of <span className="count">{alerts.length}</span> alerts</span>
        </AlertCounter>
        <ActionButtons isDocked={isDocked}>
          <ActionButton isDocked={isDocked}>
            <span className="material-icons">refresh</span>
            <span className="button-text">Refresh</span>
          </ActionButton>
          <ActionButton primary isDocked={isDocked}>
            <span className="material-icons">mark_email_read</span>
            <span className="button-text">Mark All Read</span>
          </ActionButton>
        </ActionButtons>
      </AlertActionsBar>
      
      {alerts.length > 0 && (
        <AlertBadge isDocked={isDocked}>{alerts.length}</AlertBadge>
      )}
    </AlertPanelContainer>
  );
};

export default AlertPanel; 