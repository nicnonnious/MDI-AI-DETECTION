import React from 'react';
import styled from 'styled-components';

const DetectionListContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ListTitle = styled.h2`
  margin: 0;
  color: #2c3e50;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
`;

const TableHeader = styled.thead`
  background-color: #f8f9fa;
`;

const TableHeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  border-bottom: 2px solid #ddd;
  color: #34495e;
  font-weight: 600;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f8f9fa;
  }

  &:hover {
    background-color: #ecf0f1;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #ddd;
`;

const StatusIndicator = styled.span`
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${props => props.status === 'confirmed' ? '#2ecc71' : '#e74c3c'};
  margin-right: 8px;
`;

const ConfidenceBar = styled.div`
  width: 100%;
  height: 8px;
  background-color: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
`;

const ConfidenceFill = styled.div`
  height: 100%;
  width: ${props => props.value * 100}%;
  background-color: ${props => {
    if (props.value >= 0.8) return '#2ecc71';
    if (props.value >= 0.6) return '#f39c12';
    return '#e74c3c';
  }};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 20px;
  color: #7f8c8d;
  font-style: italic;
`;

const DetectionList = ({ detections, loading, onDelete, onRefresh }) => {
  if (loading) {
    return (
      <DetectionListContainer>
        <ListHeader>
          <ListTitle>Detection List</ListTitle>
          <button onClick={onRefresh} disabled={loading}>Refresh</button>
        </ListHeader>
        <div className="loading">Loading detections...</div>
      </DetectionListContainer>
    );
  }

  return (
    <DetectionListContainer>
      <ListHeader>
        <ListTitle>Detection List</ListTitle>
        <button onClick={onRefresh}>Refresh</button>
      </ListHeader>

      {!detections || detections.length === 0 ? (
        <NoDataMessage>No detections available</NoDataMessage>
      ) : (
        <Table>
          <TableHeader>
            <tr>
              <TableHeaderCell>ID</TableHeaderCell>
              <TableHeaderCell>Time</TableHeaderCell>
              <TableHeaderCell>Type</TableHeaderCell>
              <TableHeaderCell>Status</TableHeaderCell>
              <TableHeaderCell>Confidence</TableHeaderCell>
              <TableHeaderCell>Actions</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {detections.map(detection => (
              <TableRow key={detection.id}>
                <TableCell>{detection.id}</TableCell>
                <TableCell>
                  {new Date(detection.timestamp).toLocaleTimeString()}
                </TableCell>
                <TableCell>{detection.type}</TableCell>
                <TableCell>
                  <StatusIndicator status={detection.status} />
                  {detection.status}
                </TableCell>
                <TableCell>
                  <ConfidenceBar>
                    <ConfidenceFill value={detection.confidence} />
                  </ConfidenceBar>
                  <div style={{ textAlign: 'right', fontSize: '12px', marginTop: '4px' }}>
                    {Math.round(detection.confidence * 100)}%
                  </div>
                </TableCell>
                <TableCell>
                  <ButtonGroup>
                    <button 
                      className="button-danger" 
                      onClick={() => onDelete(detection.id)}
                    >
                      Delete
                    </button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </tbody>
        </Table>
      )}
    </DetectionListContainer>
  );
};

export default DetectionList; 