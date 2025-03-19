import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const SavedViewsContainer = styled.div`
  position: fixed;
  top: 70px;
  right: 280px;
  width: 350px;
  background-color: rgba(30, 30, 30, 0.95);
  border-radius: 8px;
  border: 1px solid #444;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  z-index: 50;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  backdrop-filter: blur(4px);
  transform: ${props => props.show ? 'translateY(0)' : 'translateY(-20px)'};
  opacity: ${props => props.show ? 1 : 0};
  pointer-events: ${props => props.show ? 'auto' : 'none'};
  transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94), opacity 0.3s ease;
`;

const SavedViewsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #2c2c2c;
  border-bottom: 1px solid #444;
  
  h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 500;
    color: white;
    display: flex;
    align-items: center;
    gap: 10px;
    
    .material-icons {
      color: #3498db;
    }
  }
  
  .header-actions {
    display: flex;
    gap: 8px;
  }
  
  .header-button {
    background: none;
    border: none;
    color: #999;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
      color: white;
    }
  }
`;

const SavedViewsContent = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const SavedViewsList = styled.div`
  padding: 10px;
`;

const SavedViewItem = styled.div`
  padding: 10px;
  border-radius: 4px;
  background-color: ${props => props.isActive ? 'rgba(52, 152, 219, 0.2)' : 'rgba(44, 44, 44, 0.5)'};
  margin-bottom: 8px;
  cursor: pointer;
  border: 1px solid ${props => props.isActive ? '#3498db' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    background-color: ${props => props.isActive ? 'rgba(52, 152, 219, 0.3)' : 'rgba(44, 44, 44, 0.8)'};
  }
  
  .view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }
  
  .view-title {
    font-weight: 500;
    color: white;
    font-size: 14px;
  }
  
  .view-actions {
    display: flex;
    gap: 5px;
  }
  
  .view-action {
    background: none;
    border: none;
    color: #999;
    font-size: 16px;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover {
      color: white;
    }
  }
  
  .view-info {
    color: #999;
    font-size: 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .view-layout {
    display: flex;
    align-items: center;
    gap: 5px;
  }
  
  .view-cameras {
    display: flex;
    align-items: center;
    gap: 5px;
  }
`;

const CreateViewForm = styled.div`
  padding: 15px;
  border-top: 1px solid #444;
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: white;
    font-weight: 500;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 10px;
  
  label {
    display: block;
    color: #ccc;
    font-size: 12px;
    margin-bottom: 5px;
  }
  
  input {
    width: 100%;
    padding: 8px 10px;
    background-color: #2c2c2c;
    border: 1px solid #444;
    border-radius: 4px;
    color: white;
    font-size: 14px;
    
    &:focus {
      outline: none;
      border-color: #3498db;
    }
  }
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 15px;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#3498db' : '#2c2c2c'};
  color: white;
  border: ${props => props.primary ? 'none' : '1px solid #444'};
  border-radius: 4px;
  padding: 8px 15px;
  cursor: pointer;
  font-size: 13px;
  
  &:hover {
    background-color: ${props => props.primary ? '#2980b9' : '#333'};
  }
  
  &:disabled {
    background-color: ${props => props.primary ? '#85c1e9' : '#2c2c2c'};
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: #999;
  text-align: center;
  
  .material-icons {
    font-size: 48px;
    margin-bottom: 15px;
    opacity: 0.5;
  }
  
  h3 {
    margin: 0 0 10px 0;
    font-size: 16px;
    color: #ccc;
  }
  
  p {
    margin: 0 0 20px 0;
    font-size: 14px;
  }
`;

const SavedViewsManager = ({ 
  show, 
  onClose, 
  currentLayout, 
  currentCameras, 
  activeCamera,
  onLoadView 
}) => {
  // Load saved views from localStorage on component mount
  const [savedViews, setSavedViews] = useState(() => {
    const storedViews = localStorage.getItem('savedCameraViews');
    if (storedViews) {
      try {
        return JSON.parse(storedViews);
      } catch (e) {
        console.error('Error parsing saved views from localStorage:', e);
        return [];
      }
    }
    
    // Default sample views for first-time users
    return [
      {
        id: 1,
        name: 'Main Entrances',
        layout: 'single',
        cameras: [1, 5, 6],
        activeCamera: 1,
        createdAt: '2025-03-14T10:30:00'
      },
      {
        id: 2,
        name: 'Parking Overview',
        layout: '2x2',
        cameras: [3, 4, 7, 8],
        activeCamera: 3,
        createdAt: '2025-03-14T11:45:00'
      },
      {
        id: 3,
        name: 'Full Building',
        layout: '3x3',
        cameras: [1, 2, 3, 4, 5, 6, 7, 8, 9],
        activeCamera: 1,
        createdAt: '2025-03-14T14:15:00'
      }
    ];
  });
  
  const [viewName, setViewName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [activeViewId, setActiveViewId] = useState(null);
  
  // Save to localStorage whenever savedViews changes
  useEffect(() => {
    localStorage.setItem('savedCameraViews', JSON.stringify(savedViews));
  }, [savedViews]);
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };
  
  const handleCreateView = () => {
    if (!viewName.trim()) return;
    
    const newView = {
      id: Date.now(),
      name: viewName,
      layout: currentLayout,
      cameras: currentCameras,
      activeCamera: activeCamera,
      createdAt: new Date().toISOString()
    };
    
    setSavedViews([...savedViews, newView]);
    setViewName('');
    setIsCreating(false);
  };
  
  const handleDeleteView = (id, event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this saved view?')) {
      setSavedViews(savedViews.filter(view => view.id !== id));
      if (activeViewId === id) {
        setActiveViewId(null);
      }
    }
  };
  
  const handleLoadView = (view) => {
    setActiveViewId(view.id);
    onLoadView(view);
  };
  
  // Icon mapping for layout display
  const getLayoutIcon = (layout) => {
    switch (layout) {
      case 'single':
        return <span className="material-icons">fullscreen</span>;
      case '2x2':
        return <span className="material-icons">grid_view</span>;
      case '3x3':
        return <span className="material-icons">apps</span>;
      default:
        return <span className="material-icons">fullscreen</span>;
    }
  };
  
  return (
    <SavedViewsContainer show={show}>
      <SavedViewsHeader>
        <h2>
          <span className="material-icons">bookmark</span>
          Saved Views
        </h2>
        <div className="header-actions">
          <button className="header-button" title="Create New View" onClick={() => setIsCreating(!isCreating)}>
            <span className="material-icons">{isCreating ? 'remove' : 'add'}</span>
          </button>
          <button className="header-button" title="Close" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>
      </SavedViewsHeader>
      
      <SavedViewsContent>
        {savedViews.length > 0 ? (
          <SavedViewsList>
            {savedViews.map(view => (
              <SavedViewItem 
                key={view.id} 
                isActive={view.id === activeViewId}
                onClick={() => handleLoadView(view)}
              >
                <div className="view-header">
                  <div className="view-title">{view.name}</div>
                  <div className="view-actions">
                    <button className="view-action" title="Delete View" onClick={(e) => handleDeleteView(view.id, e)}>
                      <span className="material-icons">delete</span>
                    </button>
                  </div>
                </div>
                <div className="view-info">
                  <div className="view-layout">
                    {getLayoutIcon(view.layout)}
                    {view.layout === 'single' ? 'Single' : view.layout === '2x2' ? '2×2 Grid' : '3×3 Grid'}
                  </div>
                  <div className="view-cameras">
                    <span className="material-icons">videocam</span>
                    {view.cameras.length} Cameras
                  </div>
                </div>
              </SavedViewItem>
            ))}
          </SavedViewsList>
        ) : (
          <EmptyState>
            <span className="material-icons">bookmarks</span>
            <h3>No Saved Views</h3>
            <p>Save your current camera layout to quickly access it later</p>
            <Button primary onClick={() => setIsCreating(true)}>Create First View</Button>
          </EmptyState>
        )}
      </SavedViewsContent>
      
      {isCreating && (
        <CreateViewForm>
          <h3>Save Current View</h3>
          <FormGroup>
            <label>View Name</label>
            <input 
              type="text" 
              placeholder="Enter a name for this view" 
              value={viewName} 
              onChange={(e) => setViewName(e.target.value)}
            />
          </FormGroup>
          <ButtonRow>
            <Button onClick={() => setIsCreating(false)}>Cancel</Button>
            <Button primary onClick={handleCreateView} disabled={!viewName.trim()}>
              Save View
            </Button>
          </ButtonRow>
        </CreateViewForm>
      )}
    </SavedViewsContainer>
  );
};

export default SavedViewsManager; 