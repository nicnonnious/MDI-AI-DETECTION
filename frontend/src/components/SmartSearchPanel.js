import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const PanelOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const PanelContainer = styled.div`
  width: 80%;
  max-width: 1200px;
  height: 80%;
  background-color: #1a1a1a;
  border-radius: 8px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #222;
  border-bottom: 1px solid #333;
`;

const PanelTitle = styled.h2`
  margin: 0;
  color: white;
  font-size: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
  
  .material-icons {
    color: #7b68ee;
  }
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #999;
  font-size: 24px;
  cursor: pointer;
  
  &:hover {
    color: white;
  }
`;

const PanelContent = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  gap: 20px;
  overflow: hidden;
`;

const SearchSection = styled.div`
  width: 300px;
  background-color: #222;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const SearchInput = styled.div`
  display: flex;
  position: relative;
  
  input {
    width: 100%;
    padding: 10px 40px 10px 15px;
    background-color: #333;
    border: 1px solid #444;
    border-radius: 4px;
    color: white;
    font-size: 16px;
    
    &:focus {
      outline: none;
      border-color: #7b68ee;
    }
    
    &::placeholder {
      color: #888;
    }
  }
  
  .material-icons {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    color: #7b68ee;
    cursor: pointer;
  }
`;

const SearchFilters = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FilterLabel = styled.div`
  color: #ccc;
  font-size: 14px;
  font-weight: 500;
`;

const FilterOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const FilterOption = styled.div`
  background-color: ${props => props.selected ? '#7b68ee' : '#333'};
  color: ${props => props.selected ? 'white' : '#ccc'};
  padding: 6px 12px;
  border-radius: 50px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
  
  &:hover {
    background-color: ${props => props.selected ? '#6a5acd' : '#444'};
  }
  
  .icon {
    font-size: 16px;
  }
`;

const TimeRangeFilter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  
  .time-inputs {
    display: flex;
    gap: 10px;
    
    input {
      flex: 1;
      background-color: #333;
      border: 1px solid #444;
      border-radius: 4px;
      color: white;
      padding: 8px;
      font-size: 14px;
      
      &:focus {
        outline: none;
        border-color: #7b68ee;
      }
    }
  }
`;

const SearchButton = styled.button`
  background-color: #7b68ee;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 10px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
  
  &:hover {
    background-color: #6a5acd;
  }
  
  &:disabled {
    background-color: #555;
    cursor: not-allowed;
  }
`;

const ResultsSection = styled.div`
  flex: 1;
  background-color: #222;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ResultsHeader = styled.div`
  padding: 15px;
  border-bottom: 1px solid #333;
  color: white;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ResultsCount = styled.div`
  font-weight: 500;
  
  span {
    color: #7b68ee;
    margin-right: 5px;
  }
`;

const ResultsSort = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  
  select {
    background-color: #333;
    border: 1px solid #444;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    
    &:focus {
      outline: none;
    }
  }
`;

const ResultsGrid = styled.div`
  flex: 1;
  padding: 15px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  grid-gap: 15px;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: #333;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #555;
    border-radius: 4px;
  }
`;

const ResultCard = styled.div`
  background-color: #2a2a2a;
  border-radius: 6px;
  overflow: hidden;
  transition: transform 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
  }
`;

const ResultThumbnail = styled.div`
  position: relative;
  height: 160px;
  background-color: #333;
  background-image: url(${props => props.image});
  background-size: cover;
  background-position: center;
  
  .highlight-box {
    position: absolute;
    border: 2px solid ${props => props.highlightColor || '#7b68ee'};
    background-color: ${props => props.highlightColor || '#7b68ee'}22;
    border-radius: 2px;
    top: ${props => props.boxTop || '20%'};
    left: ${props => props.boxLeft || '30%'};
    width: ${props => props.boxWidth || '40%'};
    height: ${props => props.boxHeight || '60%'};
  }
  
  .camera-badge {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .object-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: ${props => props.objectColor || '#7b68ee'};
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

const ResultInfo = styled.div`
  padding: 12px;
`;

const ResultTime = styled.div`
  color: #aaa;
  font-size: 13px;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ResultTitle = styled.div`
  color: white;
  font-weight: 500;
  font-size: 14px;
  margin-bottom: 8px;
`;

const ResultActions = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  flex: 1;
  background-color: #333;
  border: none;
  color: white;
  padding: 6px 0;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  
  &:hover {
    background-color: #444;
  }
  
  .material-icons {
    font-size: 16px;
  }
`;

const NoResults = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #aaa;
  
  .material-icons {
    font-size: 48px;
    margin-bottom: 15px;
    color: #555;
  }
  
  p {
    font-size: 16px;
    margin-bottom: 8px;
  }
  
  span {
    font-size: 14px;
    max-width: 400px;
    text-align: center;
    line-height: 1.4;
  }
`;

const SmartSearchPanel = ({ onClose }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedObjects, setSelectedObjects] = useState(['person']);
  const [selectedCameras, setSelectedCameras] = useState([]);
  const [timeFrom, setTimeFrom] = useState('');
  const [timeTo, setTimeTo] = useState('');
  const [sortBy, setSortBy] = useState('timestamp');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  
  // Generate random mockup data for search results
  const generateMockResults = () => {
    const objects = ['person', 'vehicle', 'bag', 'face'];
    const actions = ['walking', 'running', 'standing', 'sitting'];
    const colors = ['red', 'blue', 'black', 'white', 'green'];
    const objectColors = {
      person: '#2ecc71',
      vehicle: '#3498db', 
      bag: '#e67e22',
      face: '#9b59b6'
    };
    
    // Only return results if we have a search query or selected objects
    if (!searchQuery && selectedObjects.length === 0) {
      return [];
    }
    
    const matches = [];
    const resultCount = Math.floor(Math.random() * 15) + 1; // 1-15 results
    
    for (let i = 0; i < resultCount; i++) {
      const object = selectedObjects.length > 0 
        ? selectedObjects[Math.floor(Math.random() * selectedObjects.length)]
        : objects[Math.floor(Math.random() * objects.length)];
        
      const action = actions[Math.floor(Math.random() * actions.length)];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const cameraId = Math.floor(Math.random() * 9) + 1;
      
      // Only include cameras that are selected, if any
      if (selectedCameras.length > 0 && !selectedCameras.includes(cameraId.toString())) {
        continue;
      }
      
      // Generate a random time within the last 24 hours
      const timestamp = new Date();
      timestamp.setHours(timestamp.getHours() - Math.floor(Math.random() * 24));
      
      // Positioning of the highlight box
      const boxLeft = `${20 + Math.floor(Math.random() * 40)}%`;
      const boxTop = `${20 + Math.floor(Math.random() * 30)}%`;
      const boxWidth = `${20 + Math.floor(Math.random() * 30)}%`;
      const boxHeight = `${20 + Math.floor(Math.random() * 40)}%`;
      
      // Generate descriptive title based on search and objects
      let title = '';
      if (object === 'person') {
        title = `${color.charAt(0).toUpperCase() + color.slice(1)} ${object} ${action}`;
      } else if (object === 'vehicle') {
        title = `${color.charAt(0).toUpperCase() + color.slice(1)} ${object}`;
      } else {
        title = `${color.charAt(0).toUpperCase() + color.slice(1)} ${object} detected`;
      }
      
      matches.push({
        id: i,
        object,
        action,
        color,
        cameraId,
        timestamp,
        title,
        confidence: Math.floor(Math.random() * 30) + 70, // 70-99% confidence
        boxLeft,
        boxTop,
        boxWidth,
        boxHeight,
        objectColor: objectColors[object]
      });
    }
    
    // Sort results based on sortBy
    if (sortBy === 'timestamp') {
      matches.sort((a, b) => b.timestamp - a.timestamp);
    } else if (sortBy === 'confidence') {
      matches.sort((a, b) => b.confidence - a.confidence);
    } else if (sortBy === 'camera') {
      matches.sort((a, b) => a.cameraId - b.cameraId);
    }
    
    return matches;
  };
  
  const handleSearch = () => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults(generateMockResults());
      setIsSearching(false);
      setHasSearched(true);
    }, 1500);
  };
  
  const toggleObjectFilter = (object) => {
    if (selectedObjects.includes(object)) {
      setSelectedObjects(selectedObjects.filter(o => o !== object));
    } else {
      setSelectedObjects([...selectedObjects, object]);
    }
  };
  
  const toggleCameraFilter = (camera) => {
    if (selectedCameras.includes(camera)) {
      setSelectedCameras(selectedCameras.filter(c => c !== camera));
    } else {
      setSelectedCameras([...selectedCameras, camera]);
    }
  };
  
  // Handle key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    return timestamp.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };
  
  // Calculate confidence color
  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return '#2ecc71';
    if (confidence >= 80) return '#f1c40f';
    return '#e67e22';
  };
  
  // Render different object icons
  const renderObjectIcon = (object) => {
    switch (object) {
      case 'person':
        return <span className="material-icons">person</span>;
      case 'vehicle':
        return <span className="material-icons">directions_car</span>;
      case 'bag':
        return <span className="material-icons">work</span>;
      case 'face':
        return <span className="material-icons">face</span>;
      default:
        return <span className="material-icons">help</span>;
    }
  };

  return (
    <PanelOverlay>
      <PanelContainer>
        <PanelHeader>
          <PanelTitle>
            <span className="material-icons">travel_explore</span>
            Smart Object Search
          </PanelTitle>
          <CloseButton onClick={onClose}>
            <span className="material-icons">close</span>
          </CloseButton>
        </PanelHeader>
        
        <PanelContent>
          <SearchSection>
            <SearchInput>
              <input 
                type="text" 
                placeholder="Search (e.g., 'red car', 'person with bag')" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <span className="material-icons" onClick={handleSearch}>search</span>
            </SearchInput>
            
            <SearchFilters>
              <FilterGroup>
                <FilterLabel>Object Type</FilterLabel>
                <FilterOptions>
                  <FilterOption 
                    selected={selectedObjects.includes('person')}
                    onClick={() => toggleObjectFilter('person')}
                  >
                    <span className="material-icons icon">person</span>
                    Person
                  </FilterOption>
                  <FilterOption 
                    selected={selectedObjects.includes('vehicle')}
                    onClick={() => toggleObjectFilter('vehicle')}
                  >
                    <span className="material-icons icon">directions_car</span>
                    Vehicle
                  </FilterOption>
                  <FilterOption 
                    selected={selectedObjects.includes('bag')}
                    onClick={() => toggleObjectFilter('bag')}
                  >
                    <span className="material-icons icon">work</span>
                    Bag
                  </FilterOption>
                  <FilterOption 
                    selected={selectedObjects.includes('face')}
                    onClick={() => toggleObjectFilter('face')}
                  >
                    <span className="material-icons icon">face</span>
                    Face
                  </FilterOption>
                </FilterOptions>
              </FilterGroup>
              
              <FilterGroup>
                <FilterLabel>Cameras</FilterLabel>
                <FilterOptions>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(camera => (
                    <FilterOption 
                      key={camera}
                      selected={selectedCameras.includes(camera.toString())}
                      onClick={() => toggleCameraFilter(camera.toString())}
                    >
                      <span className="material-icons icon">videocam</span>
                      Cam {camera}
                    </FilterOption>
                  ))}
                </FilterOptions>
              </FilterGroup>
              
              <FilterGroup>
                <FilterLabel>Time Range</FilterLabel>
                <TimeRangeFilter>
                  <div className="time-inputs">
                    <input 
                      type="datetime-local" 
                      value={timeFrom}
                      onChange={(e) => setTimeFrom(e.target.value)}
                    />
                    <input 
                      type="datetime-local" 
                      value={timeTo}
                      onChange={(e) => setTimeTo(e.target.value)}
                    />
                  </div>
                </TimeRangeFilter>
              </FilterGroup>
            </SearchFilters>
            
            <SearchButton onClick={handleSearch} disabled={isSearching}>
              {isSearching ? (
                <>
                  <span className="material-icons">hourglass_top</span>
                  Searching...
                </>
              ) : (
                <>
                  <span className="material-icons">search</span>
                  Search
                </>
              )}
            </SearchButton>
          </SearchSection>
          
          <ResultsSection>
            {searchResults.length > 0 ? (
              <>
                <ResultsHeader>
                  <ResultsCount>
                    <span>{searchResults.length}</span> results found
                  </ResultsCount>
                  <ResultsSort>
                    <span>Sort by:</span>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                      <option value="timestamp">Time (newest)</option>
                      <option value="confidence">Confidence</option>
                      <option value="camera">Camera</option>
                    </select>
                  </ResultsSort>
                </ResultsHeader>
                
                <ResultsGrid>
                  {searchResults.map(result => (
                    <ResultCard key={result.id}>
                      <ResultThumbnail 
                        image={`https://picsum.photos/id/${result.id + 30}/400/200`}
                        objectColor={result.objectColor}
                        boxLeft={result.boxLeft}
                        boxTop={result.boxTop}
                        boxWidth={result.boxWidth}
                        boxHeight={result.boxHeight}
                      >
                        <div className="highlight-box"></div>
                        <div className="camera-badge">
                          <span className="material-icons">videocam</span>
                          Camera {result.cameraId}
                        </div>
                        <div className="object-badge" style={{ backgroundColor: result.objectColor }}>
                          {renderObjectIcon(result.object)}
                          {result.object.charAt(0).toUpperCase() + result.object.slice(1)}
                        </div>
                      </ResultThumbnail>
                      
                      <ResultInfo>
                        <ResultTime>
                          <span className="material-icons">access_time</span>
                          {formatTimestamp(result.timestamp)}
                        </ResultTime>
                        <ResultTitle>{result.title}</ResultTitle>
                        <ResultActions>
                          <ActionButton>
                            <span className="material-icons">play_arrow</span>
                            View
                          </ActionButton>
                          <ActionButton>
                            <span className="material-icons">bookmark</span>
                            Save
                          </ActionButton>
                          <ActionButton>
                            <span className="material-icons">share</span>
                            Share
                          </ActionButton>
                        </ResultActions>
                      </ResultInfo>
                    </ResultCard>
                  ))}
                </ResultsGrid>
              </>
            ) : (
              <NoResults>
                {hasSearched ? (
                  <>
                    <span className="material-icons">search_off</span>
                    <p>No results found</p>
                    <span>Try adjusting your search criteria or try a different search term</span>
                  </>
                ) : (
                  <>
                    <span className="material-icons">manage_search</span>
                    <p>Start searching for objects</p>
                    <span>Use natural language to find specific objects like "red car" or "person with bag", or select object types from the filters</span>
                  </>
                )}
              </NoResults>
            )}
          </ResultsSection>
        </PanelContent>
      </PanelContainer>
    </PanelOverlay>
  );
};

export default SmartSearchPanel; 