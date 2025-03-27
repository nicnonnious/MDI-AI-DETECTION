import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import styled from 'styled-components';

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

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #1a1a1a;
  border-bottom: 1px solid #333;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0;
  color: #fff;
  font-weight: bold;
`;

const AlertCount = styled.span`
  background: #dc3545;
  color: white;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 14px;
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
      case 'error': return '#2c1215';
      case 'warning': return '#332811';
      case 'info': return '#0f1b2d';
      case 'motion': return '#1a1a1a';
      case 'offline': return '#1a1a1a';
      default: return '#1a1a1a';
    }
  }};
  color: ${props => {
    switch (props.type.toLowerCase()) {
      case 'error': return '#ff4d4f';
      case 'warning': return '#faad14';
      case 'info': return '#177ddc';
      case 'motion': return '#177ddc';
      case 'offline': return '#999';
      default: return '#999';
    }
  }};
  border: 1px solid ${props => {
    switch (props.type.toLowerCase()) {
      case 'error': return '#ff4d4f';
      case 'warning': return '#faad14';
      case 'info': return '#177ddc';
      case 'motion': return '#177ddc';
      case 'offline': return '#333';
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
      border-color: #0d6efd;
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
    color: #0d6efd;
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

const Alerts = () => {
  // Use refs for filter toggles to prevent unnecessary re-renders
  const filterRefs = useRef({
    type: false,
    camera: false,
    message: false,
    timestamp: false,
    status: false
  });

  // Memoize initial alerts data
  const [alerts] = useState([
    {
      id: 1,
      type: 'Motion',
      camera: 'Front Door Camera',
      message: 'Motion detected in zone 1',
      timestamp: '2024-01-20T14:30:00',
      status: 'New'
    },
    {
      id: 2,
      type: 'Error',
      camera: 'Parking Lot Camera',
      message: 'Camera went offline',
      timestamp: '2024-01-20T14:25:00',
      status: 'Acknowledged'
    },
    {
      id: 3,
      type: 'Warning',
      camera: 'Back Door Camera',
      message: 'Low light conditions',
      timestamp: '2024-01-20T14:20:00',
      status: 'New'
    }
  ]);

  // Separate state for filters
  const [filters, setFilters] = useState({
    type: '',
    camera: '',
    message: '',
    dateRange: {
      start: '',
      end: ''
    },
    status: ''
  });

  // Separate state for active filters
  const [activeFilters, setActiveFilters] = useState({
    type: false,
    camera: false,
    message: false,
    timestamp: false,
    status: false
  });

  const [quickFilter, setQuickFilter] = useState('all');

  // Memoize unique values for dropdowns
  const uniqueTypes = useMemo(() => [...new Set(alerts.map(alert => alert.type))], [alerts]);
  const uniqueCameras = useMemo(() => [...new Set(alerts.map(alert => alert.camera))], [alerts]);
  const uniqueStatuses = useMemo(() => [...new Set(alerts.map(alert => alert.status))], [alerts]);

  // Memoize filter handlers
  const handleFilterChange = useCallback((column, value) => {
    setFilters(prev => ({
      ...prev,
      // If clicking the same value, clear it
      [column]: prev[column] === value ? '' : value
    }));
    // Close the dropdown after selection
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
      
      // If both dates are set, close the dropdown immediately
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

  // Add clear filter handler
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

  // Memoize filtered alerts
  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      const typeMatch = !filters.type || alert.type.toLowerCase().includes(filters.type.toLowerCase());
      const cameraMatch = !filters.camera || alert.camera.toLowerCase().includes(filters.camera.toLowerCase());
      const messageMatch = !filters.message || alert.message.toLowerCase().includes(filters.message.toLowerCase());
      const statusMatch = !filters.status || alert.status === filters.status;
      
      let dateMatch = true;
      if (filters.dateRange.start && filters.dateRange.end) {
        const alertDate = new Date(alert.timestamp);
        const startDate = new Date(filters.dateRange.start);
        const endDate = new Date(filters.dateRange.end);
        dateMatch = alertDate >= startDate && alertDate <= endDate;
      }

      if (quickFilter !== 'all') {
        switch (quickFilter) {
          case 'new':
            return alert.status === 'New' && typeMatch && cameraMatch && messageMatch && dateMatch && statusMatch;
          case 'error':
            return alert.type === 'Error' && typeMatch && cameraMatch && messageMatch && dateMatch && statusMatch;
          case 'warning':
            return alert.type === 'Warning' && typeMatch && cameraMatch && messageMatch && dateMatch && statusMatch;
          default:
            return typeMatch && cameraMatch && messageMatch && dateMatch && statusMatch;
        }
      }

      return typeMatch && cameraMatch && messageMatch && dateMatch && statusMatch;
    });
  }, [alerts, filters, quickFilter]);

  // Memoize date formatter
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

  // Error boundary wrapper for filter dropdowns
  const FilterDropdownWrapper = ({ children }) => {
    try {
      return children;
    } catch (error) {
      console.error('Filter dropdown error:', error);
      return null;
    }
  };

  // Update click outside handler
  const containerRef = useRef(null);
  const dropdownRefs = useRef({});

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Check if click is outside any active dropdown
      const isOutsideDropdowns = Object.entries(activeFilters).every(([key, isActive]) => {
        if (!isActive) return true;
        const dropdownElement = dropdownRefs.current[key];
        return dropdownElement && !dropdownElement.contains(event.target);
      });

      // Check if click is not on a filter button
      const isNotFilterButton = !event.target.closest('[data-filter-button]');

      if (isOutsideDropdowns && isNotFilterButton) {
        setActiveFilters({
          type: false,
          camera: false,
          message: false,
          timestamp: false,
          status: false
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
            All Alerts
          </QuickFilterButton>
          <QuickFilterButton 
            active={quickFilter === 'new'} 
            onClick={() => setQuickFilter('new')}
          >
            New Alerts
          </QuickFilterButton>
          <QuickFilterButton 
            active={quickFilter === 'error'} 
            onClick={() => setQuickFilter('error')}
          >
            Errors
          </QuickFilterButton>
          <QuickFilterButton 
            active={quickFilter === 'warning'} 
            onClick={() => setQuickFilter('warning')}
          >
            Warnings
          </QuickFilterButton>
        </QuickFilters>

        <TableContainer>
          <Table>
            <thead>
              <tr>
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
                        <FilterInput
                          placeholder="Search types..."
                          value={filters.type}
                          onChange={(e) => handleFilterChange('type', e.target.value)}
                        />
                        <FilterDropdown>
                          {uniqueTypes.map(type => (
                            <DropdownItem
                              key={type}
                              selected={filters.type === type}
                              onClick={() => handleFilterChange('type', type)}
                            >
                              <TypeBadge type={type}>{type}</TypeBadge>
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
                        <FilterInput
                          placeholder="Search cameras..."
                          value={filters.camera}
                          onChange={(e) => handleFilterChange('camera', e.target.value)}
                        />
                        <FilterDropdown>
                          {uniqueCameras.map(camera => (
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
                    Message
                    <FilterButton 
                      data-filter-button="message"
                      active={activeFilters.message || filters.message}
                      onClick={() => toggleFilter('message')}
                    >
                      <span className="material-icons">filter_list</span>
                    </FilterButton>
                  </HeaderContent>
                  {activeFilters.message && (
                    <FilterContainer ref={el => dropdownRefs.current.message = el}>
                      <FilterContent>
                        <FilterHeader>
                          <span>Filter by Message</span>
                          {filters.message && (
                            <ClearButton onClick={() => handleClearFilter('message')}>
                              <span className="material-icons">close</span>
                              Clear
                            </ClearButton>
                          )}
                        </FilterHeader>
                        <FilterInput
                          placeholder="Search messages..."
                          value={filters.message}
                          onChange={(e) => handleFilterChange('message', e.target.value)}
                        />
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
                          {uniqueStatuses.map(status => (
                            <DropdownItem
                              key={status}
                              selected={filters.status === status}
                              onClick={() => handleFilterChange('status', status)}
                            >
                              <TypeBadge type={status === 'New' ? 'error' : 'info'}>
                                {status}
                              </TypeBadge>
                            </DropdownItem>
                          ))}
                        </FilterDropdown>
                      </FilterContent>
                    </FilterContainer>
                  )}
                </Th>
              </tr>
            </thead>
            <tbody>
              {filteredAlerts.map(alert => (
                <tr key={alert.id}>
                  <Td>
                    <TypeBadge type={alert.type}>{alert.type}</TypeBadge>
                  </Td>
                  <Td>
                    <CameraLink href="#">
                      <span className="material-icons">videocam</span>
                      {alert.camera}
                    </CameraLink>
                  </Td>
                  <Td>{alert.message}</Td>
                  <Td>{formatDate(alert.timestamp)}</Td>
                  <Td>
                    <TypeBadge type={alert.status === 'New' ? 'error' : 'info'}>
                      {alert.status}
                    </TypeBadge>
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

export default React.memo(Alerts); 