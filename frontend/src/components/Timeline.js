import React from 'react';
import styled from 'styled-components';

const TimelineContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TimelineHeader = styled.h2`
  margin-top: 0;
  color: #2c3e50;
`;

const TimelineTrack = styled.div`
  position: relative;
  height: 60px;
  background-color: #ecf0f1;
  border-radius: 4px;
  margin: 20px 0;
  overflow: hidden;
`;

const TimelineMarker = styled.div`
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.status === 'confirmed' ? '#2ecc71' : '#e74c3c'};
  top: 50%;
  transform: translateY(-50%);
  left: ${props => props.position}%;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  z-index: 2;

  &:hover {
    transform: translateY(-50%) scale(1.5);
    box-shadow: 0 0 8px rgba(0, 0, 0, 0.4);
    z-index: 3;
  }

  &::after {
    content: "${props => props.label}";
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    background-color: #34495e;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.2s;
    pointer-events: none;
  }

  &:hover::after {
    opacity: 1;
  }
`;

const TimelineTicks = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
`;

const TimelineTick = styled.div`
  width: 1px;
  height: 10px;
  background-color: #bdc3c7;
  position: relative;
  top: 50px;

  &::after {
    content: "${props => props.label}";
    position: absolute;
    bottom: -20px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 10px;
    color: #7f8c8d;
  }
`;

const Legend = styled.div`
  display: flex;
  gap: 20px;
  margin-top: 10px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
`;

const LegendMarker = styled.div`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.color};
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
  font-style: italic;
`;

const Timeline = ({ detections, loading }) => {
  if (loading) {
    return (
      <TimelineContainer>
        <TimelineHeader>Detection Timeline</TimelineHeader>
        <div className="loading">Loading detections...</div>
      </TimelineContainer>
    );
  }

  if (!detections || detections.length === 0) {
    return (
      <TimelineContainer>
        <TimelineHeader>Detection Timeline</TimelineHeader>
        <NoDataMessage>No detections available</NoDataMessage>
      </TimelineContainer>
    );
  }

  // Sort detections by timestamp
  const sortedDetections = [...detections].sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  );

  // Get the earliest and latest timestamps
  const earliestTime = new Date(sortedDetections[0].timestamp);
  const latestTime = new Date(sortedDetections[sortedDetections.length - 1].timestamp);
  
  // If only one detection or all same time, add buffer
  const timeRange = latestTime - earliestTime || 3600000; // Default to 1 hour if all same time

  // Calculate position percentage for each detection
  const detectionsWithPosition = sortedDetections.map(detection => {
    const time = new Date(detection.timestamp);
    const position = ((time - earliestTime) / timeRange) * 100;
    return { ...detection, position };
  });

  // Create time ticks for the timeline
  const createTicks = () => {
    const ticks = [];
    const numTicks = 5;
    
    for (let i = 0; i < numTicks; i++) {
      const position = (i / (numTicks - 1)) * 100;
      const time = new Date(earliestTime.getTime() + (timeRange * (i / (numTicks - 1))));
      const label = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      
      ticks.push(
        <TimelineTick key={i} style={{ left: `${position}%` }} label={label} />
      );
    }
    
    return ticks;
  };

  return (
    <TimelineContainer>
      <TimelineHeader>Detection Timeline</TimelineHeader>
      <TimelineTrack>
        <TimelineTicks>
          {createTicks()}
        </TimelineTicks>
        
        {detectionsWithPosition.map(detection => (
          <TimelineMarker
            key={detection.id}
            position={detection.position}
            status={detection.status}
            label={`${detection.type} (${Math.round(detection.confidence * 100)}%)`}
            title={`${detection.type} detected at ${new Date(detection.timestamp).toLocaleTimeString()}`}
          />
        ))}
      </TimelineTrack>
      
      <Legend>
        <LegendItem>
          <LegendMarker color="#2ecc71" />
          <span>Confirmed Detection</span>
        </LegendItem>
        <LegendItem>
          <LegendMarker color="#e74c3c" />
          <span>Suspicious Detection</span>
        </LegendItem>
      </Legend>
    </TimelineContainer>
  );
};

export default Timeline; 