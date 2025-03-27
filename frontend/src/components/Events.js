import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';

// Reuse the same styled components from Alerts
const Container = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #1a1a1a;
`;

const Content = styled.div`
  flex: 1;
  padding: 24px;
  overflow: auto;
`;

const TableContainer = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  overflow: visible;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
`;

const Th = styled.th`
  padding: 16px;
  text-align: left;
  background: #1a1a1a;
  color: #999;
  font-weight: 500;
  font-size: 14px;
  border-bottom: 1px solid #333;
  position: relative;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #333;
  background: #1a1a1a;
  font-size: 14px;
  color: #fff;
`;

const FilterContainer = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 250px;
  z-index: 1000;
  margin-top: 4px;
`;

const FilterContent = styled.div`
  background: #1a1a1a;
  border: 1px solid #333;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  overflow: hidden;
`;

const FilterHeader = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid #444;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  span {
    color: #fff;
    font-weight: 500;
  }
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  background: #1a1a1a;
  border: none;
  border-bottom: 1px solid #333;
  color: white;
  font-size: 14px;

  &:focus {
    outline: none;
    background: #2d2d2d;
  }

  &::placeholder {
    color: #666;
  }
`;

const FilterDropdown = styled.div`
  max-height: 300px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2d2d2d;
  }

  &::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 4px;
    
    &:hover {
      background: #888;
    }
  }
`;

const DropdownItem = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #fff;
  transition: all 0.2s;

  &:hover {
    background: #2d2d2d;
  }

  ${props => props.selected && `
    background: #177ddc;
    color: white;

    &:hover {
      background: #3c9ae8;
    }
  `}

  .material-icons {
    font-size: 18px;
    opacity: 0.7;
  }
`;

const TypeBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.type.toLowerCase()) {
      case 'configuration': return '#0f1b2d';
      case 'user': return '#1a1a1a';
      case 'system': return '#2c1215';
      default: return '#1a1a1a';
    }
  }};
  color: ${props => {
    switch (props.type.toLowerCase()) {
      case 'configuration': return '#177ddc';
      case 'user': return '#52c41a';
      case 'system': return '#ff4d4f';
      default: return '#999';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type.toLowerCase()) {
      case 'configuration': return '#177ddc';
      case 'user': return '#52c41a';
      case 'system': return '#ff4d4f';
      default: return '#333';
    }
  }};
`;

const CameraLink = styled.a`
  color: #177ddc;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    color: #3c9ae8;
    text-decoration: none;
  }

  .material-icons {
    font-size: 18px;
  }
`;

const DateRangePicker = styled.div`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  label {
    color: #999;
    font-size: 12px;
    display: block;
    margin-bottom: 4px;
  }

  input {
    width: 100%;
    padding: 8px 12px;
    background: #353535;
    border: 1px solid #444;
    border-radius: 4px;
    color: white;
    font-size: 14px;

    &::-webkit-calendar-picker-indicator {
      filter: invert(1);
      cursor: pointer;
    }

    &:focus {
      outline: none;
      border-color: #177ddc;
    }
  }
`;

const FilterButton = styled.button`
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  margin-left: 8px;

  &:hover {
    color: #fff;
  }

  ${props => props.active && `
    color: #177ddc;
  `}

  .material-icons {
    font-size: 18px;
  }
`;

const QuickFilterButton = styled.button`
  background: transparent;
  color: ${props => props.active ? '#fff' : 'rgba(255, 255, 255, 0.5)'};
  border: none;
  padding: 12px 16px;
  cursor: pointer;
  font-size: 14px;
  position: relative;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }

  ${props => props.active && `
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: #177ddc;
    }
  `}
`;

const QuickFilters = styled.div`
  display: flex;
  border-bottom: 1px solid #333;
  margin-bottom: 24px;
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ClearButton = styled.button`
  background: transparent;
  border: none;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    color: #fff;
    background: #353535;
  }

  .material-icons {
    font-size: 14px;
  }
`;

const StatusBadge = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status.toLowerCase()) {
      case 'active': return '#0f1b2d';
      case 'pending': return '#1a1a1a';
      case 'inactive': return '#2c1215';
      default: return '#1a1a1a';
    }
  }};
  color: ${props => {
    switch (props.status.toLowerCase()) {
      case 'active': return '#52c41a';
      case 'pending': return '#ff4d4f';
      case 'inactive': return '#ff4d4f';
      default: return '#999';
    }
  }};
  border: 1px solid ${props => {
    switch (props.status.toLowerCase()) {
      case 'active': return '#52c41a';
      case 'pending': return '#ff4d4f';
      case 'inactive': return '#ff4d4f';
      default: return '#333';
    }
  }};
`;

const Events = () => {
  const filterRefs = useRef({
    type: false,
    camera: false,
    status: false,
    timestamp: false
  });

  // Sample events data matching the original structure
  const [events] = useState([
    {
      id: 1,
      type: 'person_detected',
      camera: 'Front Door Camera',
      timestamp: '2024-01-20T14:30:00',
      details: { confidence: 95.5, location: 'Entry Zone', direction: 'entering' },
      status: 'processed',
      alert_generated: true
    },
    {
      id: 2,
      type: 'vehicle_detected',
      camera: 'Parking Lot Camera',
      timestamp: '2024-01-20T14:25:00',
      details: { confidence: 88.2, type: 'car', color: 'blue' },
      status: 'processing',
      alert_generated: false
    },
    {
      id: 3,
      type: 'object_detected',
      camera: 'Back Door Camera',
      timestamp: '2024-01-20T14:20:00',
      details: { confidence: 92.1, type: 'package', duration: '15min' },
      status: 'processed',
      alert_generated: true
    }
  ]);

  const [filters, setFilters] = useState({
    type: '',
    camera: '',
    status: '',
    dateRange: {
      start: '',
      end: ''
    }
  });

  const [activeFilters, setActiveFilters] = useState({
    type: false,
    camera: false,
    status: false,
    timestamp: false
  });

  const [quickFilter, setQuickFilter] = useState('all');

  const uniqueTypes = useMemo(() => [...new Set(events.map(event => event.type))], [events]);
  const uniqueCameras = useMemo(() => [...new Set(events.map(event => event.camera))], [events]);

  const handleFilterChange = useCallback((column, value) => {
    setFilters(prev => ({
      ...prev,
      [column]: prev[column] === value ? '' : value
    }));
    setActiveFilters(prev => ({
      ...prev,
      [column]: false
    }));
  }, []);

  const handleDateRangeChange = useCallback((type, value) => {
    setFilters(prev => {
      const newDateRange = {
        ...prev.dateRange,
        [type]: value
      };
      
      if (newDateRange.start && newDateRange.end) {
        setActiveFilters(prev => ({
          ...prev,
          timestamp: false
        }));
      }
      
      return {
        ...prev,
        dateRange: newDateRange
      };
    });
  }, []);

  const toggleFilter = useCallback((column) => {
    setActiveFilters(prev => {
      const newState = {
        ...prev,
        [column]: !prev[column]
      };
      filterRefs.current = newState;
      return newState;
    });
  }, []);

  const handleClearFilter = useCallback((column) => {
    setFilters(prev => ({
      ...prev,
      [column]: column === 'dateRange' ? { start: '', end: '' } : ''
    }));
    setActiveFilters(prev => ({
      ...prev,
      [column]: false
    }));
  }, []);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const typeMatch = !filters.type || event.type === filters.type;
      const cameraMatch = !filters.camera || event.camera === filters.camera;
      const statusMatch = !filters.status || event.status === filters.status;
      
      let dateMatch = true;
      if (filters.dateRange.start && filters.dateRange.end) {
        const eventDate = new Date(event.timestamp);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        dateMatch = eventDate >= startDate && eventDate <= endDate;
      }

      if (quickFilter !== 'all') {
        const eventType = event.type.split('_')[0];
        return eventType === quickFilter && typeMatch && cameraMatch && statusMatch && dateMatch;
      }

      return typeMatch && cameraMatch && statusMatch && dateMatch;
    });
  }, [events, filters, quickFilter]);

  const formatDate = useCallback((timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  }, []);

  const containerRef = useRef(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideDropdowns = Object.entries(activeFilters).every(([key, isActive]) => {
        if (!isActive) return true;
        const dropdownElement = dropdownRefs.current[key];
        return dropdownElement && !dropdownElement.contains(event.target);
      });

      const isNotFilterButton = !event.target.closest('[data-filter-button]');

      if (isOutsideDropdowns && isNotFilterButton) {
        setActiveFilters({
          type: false,
          camera: false,
          status: false,
          timestamp: false
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [activeFilters]);

  return (
    <Container ref={containerRef}>
      <Content>
        <QuickFilters>
          <QuickFilterButton 
            active={quickFilter === 'all'} 
            onClick={() => setQuickFilter('all')}
          >
            All Events
          </QuickFilterButton>
          <QuickFilterButton 
            active={quickFilter === 'person'} 
            onClick={() => setQuickFilter('person')}
          >
            Person Detection
          </QuickFilterButton>
          <QuickFilterButton 
            active={quickFilter === 'vehicle'} 
            onClick={() => setQuickFilter('vehicle')}
          >
            Vehicle Detection
          </QuickFilterButton>
          <QuickFilterButton 
            active={quickFilter === 'object'} 
            onClick={() => setQuickFilter('object')}
          >
            Object Detection
          </QuickFilterButton>
        </QuickFilters>

        <TableContainer>
          <Table>
            <thead>
              <tr>
                <Th>
                  <HeaderContent>
                    ID
                  </HeaderContent>
                </Th>
                <Th>
                  <HeaderContent>
                    Type
                    <FilterButton 
                      data-filter-button="type"
                      active={activeFilters.type || filters.type}
                      onClick={() => toggleFilter('type')}
                    >
                      <span className="material-icons">filter_list</span>
                    </FilterButton>
                  </HeaderContent>
                  {activeFilters.type && (
                    <FilterContainer ref={el => dropdownRefs.current.type = el}>
                      <FilterContent>
                        <FilterHeader>
                          <span>Filter by Type</span>
                          {filters.type && (
                            <ClearButton onClick={() => handleClearFilter('type')}>
                              <span className="material-icons">close</span>
                              Clear
                            </ClearButton>
                          )}
                        </FilterHeader>
                        <FilterDropdown>
                          {['person_detected', 'vehicle_detected', 'object_detected'].map(type => (
                            <DropdownItem
                              key={type}
                              selected={filters.type === type}
                              onClick={() => handleFilterChange('type', type)}
                            >
                              {type.split('_')[0].charAt(0).toUpperCase() + type.split('_')[0].slice(1)}
                            </DropdownItem>
                          ))}
                        </FilterDropdown>
                      </FilterContent>
                    </FilterContainer>
                  )}
                </Th>
                <Th>
                  <HeaderContent>
                    Camera
                    <FilterButton 
                      data-filter-button="camera"
                      active={activeFilters.camera || filters.camera}
                      onClick={() => toggleFilter('camera')}
                    >
                      <span className="material-icons">filter_list</span>
                    </FilterButton>
                  </HeaderContent>
                  {activeFilters.camera && (
                    <FilterContainer ref={el => dropdownRefs.current.camera = el}>
                      <FilterContent>
                        <FilterHeader>
                          <span>Filter by Camera</span>
                          {filters.camera && (
                            <ClearButton onClick={() => handleClearFilter('camera')}>
                              <span className="material-icons">close</span>
                              Clear
                            </ClearButton>
                          )}
                        </FilterHeader>
                        <FilterDropdown>
                          {[...new Set(events.map(event => event.camera))].map(camera => (
                            <DropdownItem
                              key={camera}
                              selected={filters.camera === camera}
                              onClick={() => handleFilterChange('camera', camera)}
                            >
                              <span className="material-icons">videocam</span>
                              {camera}
                            </DropdownItem>
                          ))}
                        </FilterDropdown>
                      </FilterContent>
                    </FilterContainer>
                  )}
                </Th>
                <Th>
                  <HeaderContent>
                    Timestamp
                    <FilterButton 
                      data-filter-button="timestamp"
                      active={activeFilters.timestamp || (filters.dateRange.start && filters.dateRange.end)}
                      onClick={() => toggleFilter('timestamp')}
                    >
                      <span className="material-icons">filter_list</span>
                    </FilterButton>
                  </HeaderContent>
                  {activeFilters.timestamp && (
                    <FilterContainer ref={el => dropdownRefs.current.timestamp = el}>
                      <FilterContent>
                        <FilterHeader>
                          <span>Filter by Date Range</span>
                          {(filters.dateRange.start || filters.dateRange.end) && (
                            <ClearButton onClick={() => handleClearFilter('dateRange')}>
                              <span className="material-icons">close</span>
                              Clear
                            </ClearButton>
                          )}
                        </FilterHeader>
                        <DateRangePicker>
                          <div>
                            <label>Start Date</label>
                            <input
                              type="datetime-local"
                              value={filters.dateRange.start}
                              onChange={(e) => handleDateRangeChange('start', e.target.value)}
                            />
                          </div>
                          <div>
                            <label>End Date</label>
                            <input
                              type="datetime-local"
                              value={filters.dateRange.end}
                              onChange={(e) => handleDateRangeChange('end', e.target.value)}
                            />
                          </div>
                        </DateRangePicker>
                      </FilterContent>
                    </FilterContainer>
                  )}
                </Th>
                <Th>Confidence</Th>
                <Th>Details</Th>
                <Th>
                  <HeaderContent>
                    Status
                    <FilterButton 
                      data-filter-button="status"
                      active={activeFilters.status || filters.status}
                      onClick={() => toggleFilter('status')}
                    >
                      <span className="material-icons">filter_list</span>
                    </FilterButton>
                  </HeaderContent>
                  {activeFilters.status && (
                    <FilterContainer ref={el => dropdownRefs.current.status = el}>
                      <FilterContent>
                        <FilterHeader>
                          <span>Filter by Status</span>
                          {filters.status && (
                            <ClearButton onClick={() => handleClearFilter('status')}>
                              <span className="material-icons">close</span>
                              Clear
                            </ClearButton>
                          )}
                        </FilterHeader>
                        <FilterDropdown>
                          {['processed', 'processing'].map(status => (
                            <DropdownItem
                              key={status}
                              selected={filters.status === status}
                              onClick={() => handleFilterChange('status', status)}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </DropdownItem>
                          ))}
                        </FilterDropdown>
                      </FilterContent>
                    </FilterContainer>
                  )}
                </Th>
                <Th>Alert</Th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map(event => (
                <tr key={event.id}>
                  <Td>#{event.id}</Td>
                  <Td>
                    <StatusBadge status={
                      event.type === 'person_detected' ? 'active' :
                      event.type === 'vehicle_detected' ? 'pending' : 'inactive'
                    }>
                      {event.type.split('_')[0].charAt(0).toUpperCase() + event.type.split('_')[0].slice(1)}
                    </StatusBadge>
                  </Td>
                  <Td>
                    <CameraLink href="#">
                      <span className="material-icons">videocam</span>
                      {event.camera}
                    </CameraLink>
                  </Td>
                  <Td>{formatDate(event.timestamp)}</Td>
                  <Td>{event.details.confidence}%</Td>
                  <Td>
                    {Object.entries(event.details)
                      .filter(([key]) => key !== 'confidence')
                      .map(([key, value]) => (
                        <div key={key} style={{ fontSize: '12px' }}>
                          {key}: {value}
                        </div>
                      ))
                    }
                  </Td>
                  <Td>
                    <StatusBadge status={event.status === 'processed' ? 'active' : 'pending'}>
                      {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                    </StatusBadge>
                  </Td>
                  <Td>
                    {event.alert_generated ? (
                      <StatusBadge status="inactive">Generated</StatusBadge>
                    ) : (
                      <StatusBadge status="pending">None</StatusBadge>
                    )}
                  </Td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableContainer>
      </Content>
    </Container>
  );
};

export default React.memo(Events); 