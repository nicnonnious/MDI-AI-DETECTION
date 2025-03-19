import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const OverlayContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(3px);
`;

const DashboardContainer = styled.div`
  width: 90%;
  height: 90%;
  background-color: #181818;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: fadeIn 0.3s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const DashboardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #1e1e1e;
  border-bottom: 1px solid #333;
`;

const HeaderTitle = styled.h2`
  font-size: 20px;
  font-weight: 500;
  color: white;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  
  .material-icons {
    color: #3498db;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #999;
  font-size: 24px;
  cursor: pointer;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: white;
  }
`;

const DashboardContent = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: auto;
  padding: 20px;
`;

const TimeRangeSelector = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

const TimeRangeButton = styled.button`
  padding: 8px 16px;
  background-color: ${props => props.active ? '#3498db' : '#2c2c2c'};
  color: white;
  border: 1px solid ${props => props.active ? '#3498db' : '#444'};
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.active ? '#2980b9' : '#333'};
  }
`;

const DashboardRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  
  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const StatCard = styled.div`
  flex: 1;
  background-color: #1e1e1e;
  border-radius: 6px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  min-width: 200px;
  border: 1px solid #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: #aaa;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  .material-icons {
    font-size: 18px;
    color: #3498db;
  }
`;

const StatValue = styled.div`
  font-size: 28px;
  font-weight: 600;
  color: white;
  
  &.increase {
    color: #2ecc71;
  }
  
  &.decrease {
    color: #e74c3c;
  }
`;

const StatFooter = styled.div`
  margin-top: 10px;
  font-size: 12px;
  color: ${props => props.increase ? '#2ecc71' : props.decrease ? '#e74c3c' : '#aaa'};
  display: flex;
  align-items: center;
  gap: 5px;
  
  .material-icons {
    font-size: 14px;
  }
`;

const ChartCard = styled.div`
  flex: ${props => props.large ? 2 : 1};
  background-color: #1e1e1e;
  border-radius: 6px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border: 1px solid #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  min-height: 300px;
  position: relative;
  overflow: hidden;
  
  @media (max-width: 1200px) {
    flex: 1;
  }
`;

const ChartTitle = styled.div`
  font-size: 16px;
  color: white;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ChartOptions = styled.div`
  display: flex;
  gap: 8px;
`;

const ChartOptionButton = styled.button`
  background: none;
  border: 1px solid #444;
  color: ${props => props.active ? 'white' : '#aaa'};
  border-radius: 4px;
  font-size: 12px;
  padding: 3px 8px;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
  }
`;

const ChartContent = styled.div`
  flex: 1;
  position: relative;
`;

// Mock data visualization (in a real app, use a library like Chart.js, recharts, or D3)
const BarChart = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 200px;
  padding-top: 20px;
`;

const Bar = styled.div`
  width: 30px;
  background-color: ${props => props.color || '#3498db'};
  height: ${props => props.height};
  border-radius: 4px 4px 0 0;
  position: relative;
  transition: height 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    filter: brightness(1.2);
    
    &::after {
      content: '${props => props.value}';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #333;
      color: white;
      padding: 3px 6px;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 5px;
      white-space: nowrap;
    }
  }
`;

const LineChart = styled.div`
  position: relative;
  height: 200px;
  display: flex;
  align-items: flex-end;
`;

const LineChartSvg = styled.svg`
  width: 100%;
  height: 100%;
  overflow: visible;
`;

const HeatmapGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  grid-gap: 3px;
  height: 200px;
`;

const HeatmapCell = styled.div`
  background-color: ${props => {
    const opacity = Math.min(1, props.value / 10);
    return props.type === 'person' 
      ? `rgba(46, 204, 113, ${opacity})` 
      : `rgba(52, 152, 219, ${opacity})`;
  }};
  border-radius: 2px;
  transition: all 0.2s;
  position: relative;
  
  &:hover {
    transform: scale(1.1);
    z-index: 1;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
    
    &::after {
      content: '${props => props.time}: ${props => props.value} ${props => props.type}s';
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background-color: #333;
      color: white;
      padding: 3px 6px;
      border-radius: 4px;
      font-size: 12px;
      margin-bottom: 5px;
      white-space: nowrap;
      z-index: 2;
    }
  }
`;

const MapVisualization = styled.div`
  height: 300px;
  background-color: #2c2c2c;
  position: relative;
  border-radius: 4px;
  overflow: hidden;
`;

const MapOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect x="0" y="0" width="100" height="100" fill="%23222"/><path d="M20,20 L80,20 L80,40 L60,40 L60,80 L40,80 L40,40 L20,40 Z" fill="%23333"/><path d="M85,85 L95,85 L95,95 L85,95 Z" fill="%23333"/><path d="M5,85 L15,85 L15,95 L5,95 Z" fill="%23333"/><path d="M5,5 L15,5 L15,15 L5,15 Z" fill="%23333"/><path d="M85,5 L95,5 L95,15 L85,15 Z" fill="%23333"/></svg>') repeat;
  opacity: 0.6;
`;

const MapHotspot = styled.div`
  position: absolute;
  width: ${props => Math.max(20, props.intensity * 4)}px;
  height: ${props => Math.max(20, props.intensity * 4)}px;
  border-radius: 50%;
  background-color: ${props => props.type === 'person' ? 'rgba(46, 204, 113, 0.7)' : 'rgba(52, 152, 219, 0.7)'};
  transform: translate(-50%, -50%);
  box-shadow: 0 0 ${props => Math.max(10, props.intensity * 2)}px ${props => props.type === 'person' ? 'rgba(46, 204, 113, 0.5)' : 'rgba(52, 152, 219, 0.5)'};
  left: ${props => props.x}%;
  top: ${props => props.y}%;
  transition: all 0.3s ease;
  cursor: pointer;
  
  &:hover {
    transform: translate(-50%, -50%) scale(1.2);
    z-index: 10;
  }
  
  &::after {
    content: '${props => props.count}';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    font-weight: bold;
    font-size: ${props => Math.max(10, props.intensity * 1.5)}px;
    text-shadow: 0 0 3px rgba(0, 0, 0, 0.8);
  }
`;

const TableCard = styled.div`
  flex: 1;
  background-color: #1e1e1e;
  border-radius: 6px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  border: 1px solid #333;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
`;

const TableTitle = styled.div`
  font-size: 16px;
  color: white;
  margin-bottom: 15px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 10px;
  color: #aaa;
  font-weight: 500;
  font-size: 13px;
  border-bottom: 1px solid #333;
`;

const TableRow = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #252525;
  }
  
  &:not(:last-child) {
    border-bottom: 1px solid #333;
  }
`;

const TableCell = styled.td`
  padding: 10px;
  color: white;
  font-size: 13px;
`;

const SeverityBadge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  background-color: ${props => {
    switch(props.severity) {
      case 'high': return 'rgba(231, 76, 60, 0.2)';
      case 'medium': return 'rgba(230, 126, 34, 0.2)';
      case 'low': return 'rgba(241, 196, 15, 0.2)';
      default: return 'rgba(149, 165, 166, 0.2)';
    }
  }};
  color: ${props => {
    switch(props.severity) {
      case 'high': return '#e74c3c';
      case 'medium': return '#e67e22';
      case 'low': return '#f1c40f';
      default: return '#95a5a6';
    }
  }};
`;

// Mock data for charts
const generateMockData = (timeRange) => {
  const hourly = [
    { time: '08:00', person: 8, vehicle: 3 },
    { time: '09:00', person: 12, vehicle: 5 },
    { time: '10:00', person: 7, vehicle: 2 },
    { time: '11:00', person: 9, vehicle: 4 },
    { time: '12:00', person: 15, vehicle: 3 },
    { time: '13:00', person: 11, vehicle: 1 },
    { time: '14:00', person: 13, vehicle: 6 },
    { time: '15:00', person: 9, vehicle: 3 },
    { time: '16:00', person: 11, vehicle: 4 },
    { time: '17:00', person: 18, vehicle: 7 },
    { time: '18:00', person: 14, vehicle: 5 },
    { time: '19:00', person: 8, vehicle: 3 },
  ];
  
  const daily = [
    { time: 'Mon', person: 45, vehicle: 22 },
    { time: 'Tue', person: 52, vehicle: 28 },
    { time: 'Wed', person: 49, vehicle: 24 },
    { time: 'Thu', person: 62, vehicle: 30 },
    { time: 'Fri', person: 78, vehicle: 35 },
    { time: 'Sat', person: 73, vehicle: 31 },
    { time: 'Sun', person: 41, vehicle: 19 },
  ];
  
  const weekly = [
    { time: 'W1', person: 310, vehicle: 180 },
    { time: 'W2', person: 280, vehicle: 165 },
    { time: 'W3', person: 350, vehicle: 195 },
    { time: 'W4', person: 290, vehicle: 170 }
  ];
  
  const monthly = [
    { time: 'Jan', person: 1250, vehicle: 720 },
    { time: 'Feb', person: 1100, vehicle: 650 },
    { time: 'Mar', person: 1350, vehicle: 780 },
    { time: 'Apr', person: 1480, vehicle: 820 },
    { time: 'May', person: 1290, vehicle: 700 },
    { time: 'Jun', person: 1530, vehicle: 840 }
  ];
  
  switch(timeRange) {
    case 'today': return hourly;
    case 'week': return daily;
    case 'month': return weekly;
    case 'year': return monthly;
    default: return hourly;
  }
};

// Generate mock map hotspots data
const generateHotspots = () => {
  return [
    { id: 1, type: 'person', x: 25, y: 30, count: 12, intensity: 6 },
    { id: 2, type: 'person', x: 75, y: 20, count: 8, intensity: 4 },
    { id: 3, type: 'vehicle', x: 40, y: 70, count: 6, intensity: 3 },
    { id: 4, type: 'person', x: 65, y: 65, count: 15, intensity: 7.5 },
    { id: 5, type: 'vehicle', x: 85, y: 85, count: 4, intensity: 2 },
    { id: 6, type: 'vehicle', x: 15, y: 50, count: 3, intensity: 1.5 },
    { id: 7, type: 'person', x: 50, y: 40, count: 9, intensity: 4.5 },
  ];
};

// Generate mock recent incidents
const generateRecentIncidents = () => {
  return [
    { id: 1, type: 'person', location: 'North Entrance', time: '18:43', camera: 'Cam 1', severity: 'high' },
    { id: 2, type: 'vehicle', location: 'Parking Lot A', time: '18:15', camera: 'Cam 3', severity: 'medium' },
    { id: 3, type: 'person', location: 'South Gate', time: '17:52', camera: 'Cam 6', severity: 'medium' },
    { id: 4, type: 'person', location: 'East Wing', time: '17:30', camera: 'Cam 7', severity: 'high' },
    { id: 5, type: 'vehicle', location: 'Loading Dock', time: '16:45', camera: 'Cam 4', severity: 'low' },
  ];
};

const AnalyticsDashboard = ({ detections, cameras, onClose }) => {
  const [timeRange, setTimeRange] = useState('today');
  const [chartData, setChartData] = useState([]);
  const [hotspots, setHotspots] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [personChartType, setPersonChartType] = useState('bar');
  const [vehicleChartType, setVehicleChartType] = useState('line');
  
  // Update chart data when time range changes
  useEffect(() => {
    setChartData(generateMockData(timeRange));
    setHotspots(generateHotspots());
    setIncidents(generateRecentIncidents());
  }, [timeRange]);
  
  // Calculate summary statistics
  const totalDetections = detections.length;
  const personDetections = detections.filter(d => d.type === 'person').length;
  const vehicleDetections = detections.filter(d => d.type === 'vehicle').length;
  const confirmedDetections = detections.filter(d => d.status === 'confirmed').length;
  const alertDetections = Math.floor(totalDetections * 0.15); // For demo: 15% of detections trigger alerts
  
  // Chart rendering functions
  const renderBarChart = (data, property, color) => {
    const maxValue = Math.max(...data.map(item => item[property]));
    
    return (
      <BarChart>
        {data.map((item, index) => (
          <Bar 
            key={index} 
            height={`${(item[property] / maxValue) * 100}%`} 
            color={color}
            value={`${item[property]} ${property}s at ${item.time}`}
          />
        ))}
      </BarChart>
    );
  };
  
  const renderLineChart = (data, property, color) => {
    if (!data.length) return null;
    
    const maxValue = Math.max(...data.map(item => item[property]));
    const points = data.map((item, index) => {
      const x = `${(index / (data.length - 1)) * 100}%`;
      const y = `${100 - (item[property] / maxValue) * 100}%`;
      return { x, y, value: item[property], time: item.time };
    });
    
    const pointsPath = points.map(point => `${point.x},${point.y}`).join(' ');
    
    return (
      <LineChart>
        <LineChartSvg viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            points={pointsPath}
            fill="none"
            stroke={color}
            strokeWidth="2"
          />
          {points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill={color}
              />
              <circle
                cx={point.x}
                cy={point.y}
                r="8"
                fill="transparent"
                stroke={color}
                strokeWidth="1"
                opacity="0.5"
              >
                <title>{`${point.value} ${property}s at ${point.time}`}</title>
              </circle>
            </g>
          ))}
        </LineChartSvg>
      </LineChart>
    );
  };
  
  const renderHeatmap = (data, property, type) => {
    const maxValue = Math.max(...data.map(item => item[property]));
    
    return (
      <HeatmapGrid>
        {data.map((item, index) => (
          <HeatmapCell 
            key={index} 
            value={item[property]} 
            type={type}
            time={item.time}
          />
        ))}
      </HeatmapGrid>
    );
  };
  
  return (
    <OverlayContainer>
      <DashboardContainer>
        <DashboardHeader>
          <HeaderTitle>
            <span className="material-icons">insights</span>
            Detection Analytics
          </HeaderTitle>
          <CloseButton onClick={onClose}>
            <span className="material-icons">close</span>
          </CloseButton>
        </DashboardHeader>
        
        <DashboardContent>
          <TimeRangeSelector>
            <TimeRangeButton 
              active={timeRange === 'today'} 
              onClick={() => setTimeRange('today')}
            >
              Today
            </TimeRangeButton>
            <TimeRangeButton 
              active={timeRange === 'week'} 
              onClick={() => setTimeRange('week')}
            >
              This Week
            </TimeRangeButton>
            <TimeRangeButton 
              active={timeRange === 'month'} 
              onClick={() => setTimeRange('month')}
            >
              This Month
            </TimeRangeButton>
            <TimeRangeButton 
              active={timeRange === 'year'} 
              onClick={() => setTimeRange('year')}
            >
              This Year
            </TimeRangeButton>
          </TimeRangeSelector>
          
          {/* Statistics Row */}
          <DashboardRow>
            <StatCard>
              <StatTitle>
                <span className="material-icons">people_alt</span>
                People Detected
              </StatTitle>
              <StatValue>{personDetections}</StatValue>
              <StatFooter increase>
                <span className="material-icons">trending_up</span>
                +12% from last {timeRange}
              </StatFooter>
            </StatCard>
            
            <StatCard>
              <StatTitle>
                <span className="material-icons">directions_car</span>
                Vehicles Detected
              </StatTitle>
              <StatValue>{vehicleDetections}</StatValue>
              <StatFooter increase>
                <span className="material-icons">trending_up</span>
                +5% from last {timeRange}
              </StatFooter>
            </StatCard>
            
            <StatCard>
              <StatTitle>
                <span className="material-icons">verified</span>
                Confirmed Detections
              </StatTitle>
              <StatValue>{confirmedDetections}</StatValue>
              <StatFooter>
                <span>Accuracy: 92%</span>
              </StatFooter>
            </StatCard>
            
            <StatCard>
              <StatTitle>
                <span className="material-icons">notifications_active</span>
                Alerts Triggered
              </StatTitle>
              <StatValue className="decrease">{alertDetections}</StatValue>
              <StatFooter decrease>
                <span className="material-icons">trending_down</span>
                -8% from last {timeRange}
              </StatFooter>
            </StatCard>
          </DashboardRow>
          
          {/* Charts Row */}
          <DashboardRow>
            <ChartCard>
              <ChartTitle>
                Person Detections
                <ChartOptions>
                  <ChartOptionButton 
                    active={personChartType === 'bar'} 
                    onClick={() => setPersonChartType('bar')}
                  >
                    Bar
                  </ChartOptionButton>
                  <ChartOptionButton 
                    active={personChartType === 'line'} 
                    onClick={() => setPersonChartType('line')}
                  >
                    Line
                  </ChartOptionButton>
                  <ChartOptionButton 
                    active={personChartType === 'heat'} 
                    onClick={() => setPersonChartType('heat')}
                  >
                    Heat
                  </ChartOptionButton>
                </ChartOptions>
              </ChartTitle>
              <ChartContent>
                {personChartType === 'bar' && renderBarChart(chartData, 'person', '#2ecc71')}
                {personChartType === 'line' && renderLineChart(chartData, 'person', '#2ecc71')}
                {personChartType === 'heat' && renderHeatmap(chartData, 'person', 'person')}
              </ChartContent>
            </ChartCard>
            
            <ChartCard>
              <ChartTitle>
                Vehicle Detections
                <ChartOptions>
                  <ChartOptionButton 
                    active={vehicleChartType === 'bar'} 
                    onClick={() => setVehicleChartType('bar')}
                  >
                    Bar
                  </ChartOptionButton>
                  <ChartOptionButton 
                    active={vehicleChartType === 'line'} 
                    onClick={() => setVehicleChartType('line')}
                  >
                    Line
                  </ChartOptionButton>
                  <ChartOptionButton 
                    active={vehicleChartType === 'heat'} 
                    onClick={() => setVehicleChartType('heat')}
                  >
                    Heat
                  </ChartOptionButton>
                </ChartOptions>
              </ChartTitle>
              <ChartContent>
                {vehicleChartType === 'bar' && renderBarChart(chartData, 'vehicle', '#3498db')}
                {vehicleChartType === 'line' && renderLineChart(chartData, 'vehicle', '#3498db')}
                {vehicleChartType === 'heat' && renderHeatmap(chartData, 'vehicle', 'vehicle')}
              </ChartContent>
            </ChartCard>
          </DashboardRow>
          
          {/* Detection Map and Recent Incidents */}
          <DashboardRow>
            <ChartCard large>
              <ChartTitle>
                Detection Hotspots Map
                <ChartOptionButton onClick={() => setHotspots(generateHotspots())}>
                  Refresh
                </ChartOptionButton>
              </ChartTitle>
              <MapVisualization>
                <MapOverlay />
                {hotspots.map(spot => (
                  <MapHotspot
                    key={spot.id}
                    type={spot.type}
                    x={spot.x}
                    y={spot.y}
                    count={spot.count}
                    intensity={spot.intensity}
                  />
                ))}
              </MapVisualization>
            </ChartCard>
            
            <TableCard>
              <TableTitle>Recent Detection Incidents</TableTitle>
              <Table>
                <thead>
                  <tr>
                    <TableHeader>Type</TableHeader>
                    <TableHeader>Location</TableHeader>
                    <TableHeader>Time</TableHeader>
                    <TableHeader>Camera</TableHeader>
                    <TableHeader>Severity</TableHeader>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map(incident => (
                    <TableRow key={incident.id}>
                      <TableCell>
                        <span className="material-icons" style={{ verticalAlign: 'middle', marginRight: '5px' }}>
                          {incident.type === 'person' ? 'person' : 'directions_car'}
                        </span>
                        {incident.type === 'person' ? 'Person' : 'Vehicle'}
                      </TableCell>
                      <TableCell>{incident.location}</TableCell>
                      <TableCell>{incident.time}</TableCell>
                      <TableCell>{incident.camera}</TableCell>
                      <TableCell>
                        <SeverityBadge severity={incident.severity}>
                          {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                        </SeverityBadge>
                      </TableCell>
                    </TableRow>
                  ))}
                </tbody>
              </Table>
            </TableCard>
          </DashboardRow>
        </DashboardContent>
      </DashboardContainer>
    </OverlayContainer>
  );
};

export default AnalyticsDashboard; 