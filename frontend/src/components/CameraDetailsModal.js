import React, { useState, useEffect } from 'react';
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

const StatusBadges = styled.div`
  display: flex;
  gap: 10px;
`;

const Badge = styled.span`
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  background-color: ${props => {
    switch (props.type) {
      case 'offline':
        return '#dc3545';
      case 'cloud':
        return '#0d6efd';
      default:
        return '#6c757d';
    }
  }};
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
  padding: 20px;
  flex: 1;
  overflow-y: auto;
  min-height: 0;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #2d2d2d;
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 4px;
    
    &:hover {
      background: #888;
    }
  }
`;

const InfoContainer = styled.div`
  display: flex;
  gap: 24px;
  height: calc(100% - 40px); // Account for padding
  min-height: 500px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  background: #2d2d2d;
  border-radius: 8px;
  padding: 16px;
  height: 100%;
`;

const LeftSection = styled(Section)`
  flex: 0.4;
  min-width: 400px;
`;

const RightSection = styled(Section)`
  flex: 0.6;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #2d2d2d;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 3px;
    
    &:hover {
      background: #888;
    }
  }
`;

const SectionTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #fff;
  padding-bottom: 12px;
  border-bottom: 1px solid #444;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 180px 1fr;
  gap: 12px;
  overflow-y: auto;
  padding-right: 8px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #2d2d2d;
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: #666;
    border-radius: 3px;
    
    &:hover {
      background: #888;
    }
  }
`;

const Label = styled.div`
  color: #999;
  font-size: 14px;
  padding: 8px;
  background: #252525;
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

const VideoContainer = styled.div`
  flex: 1;
  background: #000;
  border-radius: 4px;
  overflow: hidden;
  position: relative;
  margin-top: 16px;
  
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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

const CollapsibleSection = styled.div`
  margin-bottom: 16px;
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #353535;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s;

  &:hover {
    background: #404040;
  }

  .material-icons {
    transition: transform 0.2s;
    transform: rotate(${props => props.isOpen ? '180deg' : '0deg'});
  }
`;

const SectionContent = styled.div`
  padding: 16px 0;
  display: ${props => props.isOpen ? 'block' : 'none'};
`;

const StatGrid = styled(Grid)`
  grid-template-columns: 140px 1fr;
`;

const StatLabel = styled(Label)`
  background: #2a2a2a;
`;

const StatValue = styled(Value)`
  background: #383838;
`;

const Input = styled.input`
  background: #353535;
  border: 1px solid #444;
  border-radius: 4px;
  color: white;
  padding: 8px 12px;
  width: 100%;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #0d6efd;
  }

  &::placeholder {
    color: #666;
  }
`;

const TextArea = styled.textarea`
  background: #353535;
  border: 1px solid #444;
  border-radius: 4px;
  color: white;
  padding: 8px 12px;
  width: 100%;
  font-size: 14px;
  min-height: 100px;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #0d6efd;
  }

  &::placeholder {
    color: #666;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 16px;
`;

const FormLabel = styled.label`
  display: block;
  color: #999;
  font-size: 14px;
  margin-bottom: 8px;
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 24px 0;
`;

const ToggleLabel = styled.label`
  color: #999;
  font-size: 14px;
  user-select: none;
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #484848;
    transition: .4s;
    border-radius: 24px;

    &:before {
      position: absolute;
      content: "";
      height: 16px;
      width: 16px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }
  }

  input:checked + span {
    background-color: #2196F3;
  }

  input:checked + span:before {
    transform: translateX(26px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 24px;
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  border: none;

  &:hover {
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  ${props => props.primary ? `
    background-color: #0d6efd;
    color: white;
    &:hover {
      background-color: #0b5ed7;
    }
  ` : `
    background-color: #6c757d;
    color: white;
    &:hover {
      background-color: #5c636a;
    }
  `}
`;

const NetworkFormGroup = styled(FormGroup)`
  display: flex;
  gap: 12px;
  align-items: flex-start;

  &.with-button {
    .input-container {
      flex: 1;
    }
  }
`;

const PingButton = styled(Button)`
  background-color: #0d6efd;
  color: white;
  margin-top: 24px;
  padding: 8px 20px;
  min-width: 80px;

  &:hover {
    background-color: #0b5ed7;
  }
`;

const Select = styled.select`
  background: #353535;
  border: 1px solid #444;
  border-radius: 4px;
  color: white;
  padding: 8px 12px;
  width: 100%;
  font-size: 14px;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #0d6efd;
  }

  option {
    background: #353535;
    color: white;
  }
`;

const ToggleButtonGroup = styled.div`
  display: flex;
  gap: 2px;
  background: #2d2d2d;
  padding: 2px;
  border-radius: 4px;
  width: fit-content;
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? '#0d6efd' : 'transparent'};
  color: ${props => props.active ? 'white' : '#999'};
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    color: white;
  }
`;

const SliderContainer = styled.div`
  margin-bottom: 24px;
`;

const SliderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const SliderLabel = styled.label`
  color: #999;
  font-size: 14px;
`;

const SliderValue = styled.span`
  color: white;
  font-size: 14px;
  background: #353535;
  padding: 4px 8px;
  border-radius: 4px;
`;

const Slider = styled.input`
  width: 100%;
  height: 4px;
  background: #444;
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
  margin: 10px 0;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${props => props.disabled ? '0.5' : '1'};

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #0d6efd;
    border-radius: 50%;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    transition: all 0.2s;
    margin-top: -6px; /* Centers the thumb on the track */

    &:hover {
      transform: ${props => props.disabled ? 'none' : 'scale(1.1)'};
    }
  }

  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    background: #444;
    border-radius: 2px;
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #0d6efd;
    border-radius: 50%;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    border: none;
    transition: all 0.2s;

    &:hover {
      transform: ${props => props.disabled ? 'none' : 'scale(1.1)'};
    }
  }

  &::-moz-range-track {
    width: 100%;
    height: 4px;
    background: #444;
    border-radius: 2px;
  }

  &::-ms-thumb {
    width: 16px;
    height: 16px;
    background: #0d6efd;
    border-radius: 50%;
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
    border: none;
    transition: all 0.2s;

    &:hover {
      transform: ${props => props.disabled ? 'none' : 'scale(1.1)'};
    }
  }

  &::-ms-track {
    width: 100%;
    height: 4px;
    background: #444;
    border-radius: 2px;
  }
`;

const SubTabList = styled.div`
  display: flex;
  gap: 2px;
  margin-bottom: 24px;
  border-bottom: 1px solid #333;
`;

const SubTab = styled.div`
  padding: 12px 24px;
  cursor: pointer;
  color: ${props => props.active ? '#fff' : '#999'};
  border-bottom: 2px solid ${props => props.active ? '#0d6efd' : 'transparent'};
  transition: all 0.2s;
  
  &:hover {
    color: #fff;
  }
`;

const DetectionRule = styled.div`
  margin-bottom: 24px;
  padding: 16px;
  background: #2d2d2d;
  border-radius: 4px;
`;

const InfoIcon = styled.span`
  color: #999;
  cursor: help;
  margin-left: 8px;
  font-size: 16px;
  vertical-align: middle;
`;

const UnitLabel = styled.span`
  color: #999;
  margin-left: 8px;
`;

const ChangeButton = styled(Button)`
  padding: 4px 12px;
  font-size: 12px;
  background: transparent;
  border: 1px solid #0d6efd;
  color: #0d6efd;

  &:hover {
    background: #0d6efd15;
  }
`;

const MapContainer = styled.div`
  width: 100%;
  height: 400px;
  background: #2d2d2d;
  border-radius: 8px;
  margin-bottom: 24px;
  position: relative;
  overflow: hidden;
`;

const LocationGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 24px;
`;

const CoordinateInput = styled(Input)`
  text-align: right;
  font-family: monospace;
`;

const AddressTextArea = styled(TextArea)`
  height: 100px;
`;

const SearchContainer = styled.div`
  margin-bottom: 16px;
  display: flex;
  gap: 12px;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
`;

const LocationButton = styled(Button)`
  background: #353535;
  border: 1px solid #444;
  color: #fff;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 180px;

  &:hover {
    background: #404040;
    transform: translateY(-1px);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .material-icons {
    font-size: 18px;
  }
`;

const SearchInput = styled(Input)`
  padding-right: 40px;
  background: #353535;
`;

const SearchIcon = styled.span`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  pointer-events: none;
`;

const EventsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  color: #fff;
`;

const TableHeader = styled.th`
  text-align: left;
  padding: 12px;
  background: #2d2d2d;
  color: #999;
  font-weight: normal;
  font-size: 14px;
  border-bottom: 1px solid #444;

  &:first-child {
    border-top-left-radius: 4px;
  }

  &:last-child {
    border-top-right-radius: 4px;
  }
`;

const TableRow = styled.tr`
  &:hover {
    background: #2d2d2d;
  }
`;

const TableCell = styled.td`
  padding: 12px;
  border-bottom: 1px solid #333;
  font-size: 14px;
  color: ${props => props.highlight ? '#fff' : '#999'};
`;

const NoEventsMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 14px;
  background: #2d2d2d;
  border-radius: 4px;
  margin-top: 16px;
`;

const EventTypeChip = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.type) {
      case 'error':
        return '#dc3545';
      case 'warning':
        return '#ffc107';
      case 'info':
        return '#0dcaf0';
      case 'success':
        return '#198754';
      default:
        return '#6c757d';
    }
  }};
  color: ${props => props.type === 'warning' ? '#000' : '#fff'};
`;

const DateText = styled.span`
  color: #999;
  white-space: nowrap;
`;

const LogsHeader = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const FilterLabel = styled.span`
  color: #999;
  font-size: 14px;
  white-space: nowrap;
`;

const TimeFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  select {
    width: 100px;
  }
`;

const SearchFilter = styled.div`
  flex: 1;
  min-width: 200px;
  position: relative;

  input {
    padding-left: 36px;
  }

  .material-icons {
    position: absolute;
    left: 8px;
    top: 50%;
    transform: translateY(-50%);
    color: #999;
    font-size: 20px;
  }
`;

const FilterSelect = styled(Select)`
  min-width: 150px;
`;

const TimezoneToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px;
  background: #2d2d2d;
  border-radius: 4px;
`;

const TimezoneOption = styled.button`
  padding: 4px 12px;
  border: none;
  border-radius: 4px;
  background: ${props => props.active ? '#0d6efd' : 'transparent'};
  color: ${props => props.active ? '#fff' : '#999'};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;

  &:hover {
    color: #fff;
  }
`;

const PaginationFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 16px;
  padding: 16px 0;
  border-top: 1px solid #333;
`;

const PageInfo = styled.div`
  color: #999;
  font-size: 14px;
`;

const PaginationControls = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

const PageSizeSelect = styled(Select)`
  width: 80px;
`;

const NavigationButton = styled.button`
  background: transparent;
  border: none;
  color: ${props => props.disabled ? '#666' : '#fff'};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  padding: 4px;
  display: flex;
  align-items: center;
  opacity: ${props => props.disabled ? '0.5' : '1'};

  &:hover:not(:disabled) {
    color: #0d6efd;
  }
`;

const BillingContainer = styled.div`
  padding: 24px;
  background: #2d2d2d;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const BillingOption = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: ${props => props.selected ? '#353535' : 'transparent'};
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #353535;
  }
`;

const BillingCheckbox = styled.div`
  margin-top: 2px;
  width: 20px;
  height: 20px;
  border: 2px solid ${props => props.checked ? '#0d6efd' : '#666'};
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.checked ? '#0d6efd' : 'transparent'};
  color: white;
  transition: all 0.2s;
`;

const BillingInfo = styled.div`
  flex: 1;
`;

const BillingTitle = styled.div`
  font-size: 16px;
  font-weight: 500;
  color: #fff;
  margin-bottom: 8px;
`;

const BillingDescription = styled.div`
  font-size: 14px;
  color: #999;
  line-height: 1.5;
`;

const BillingAdvanceLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  color: #fff;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #0d6efd;
  }
`;

const DeleteContainer = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 32px;
  background: #2d2d2d;
  border-radius: 8px;
  text-align: center;
`;

const DeleteIcon = styled.div`
  width: 80px;
  height: 80px;
  background: #dc3545;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  
  .material-icons {
    font-size: 40px;
    color: white;
  }
`;

const DeleteTitle = styled.h3`
  font-size: 24px;
  color: #fff;
  margin-bottom: 16px;
`;

const DeleteDescription = styled.p`
  color: #999;
  margin-bottom: 32px;
  line-height: 1.5;
`;

const DeleteConfirmation = styled.div`
  margin-bottom: 32px;
  text-align: left;
`;

const DeleteInputContainer = styled.div`
  position: relative;
  margin-top: 16px;
`;

const DeleteInput = styled.input`
  width: 100%;
  padding: 12px;
  background: #353535;
  border: 2px solid ${props => {
    if (props.value === '') return '#444';
    return props.value === 'delete' ? '#28a745' : '#dc3545';
  }};
  border-radius: 4px;
  color: white;
  font-size: 16px;
  text-align: center;
  letter-spacing: 2px;
  transition: all 0.3s;

  &:focus {
    outline: none;
    border-color: #0d6efd;
  }
`;

const DeleteProgress = styled.div`
  height: 4px;
  background: #444;
  border-radius: 2px;
  margin-top: 16px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  width: ${props => (props.value.length / 6) * 100}%;
  background: ${props => {
    if (props.value === '') return '#444';
    return props.value === 'delete' ? '#28a745' : '#dc3545';
  }};
  transition: all 0.3s;
`;

const WarningList = styled.ul`
  text-align: left;
  margin: 24px 0;
  padding: 16px 24px;
  background: #353535;
  border-radius: 4px;
  
  li {
    color: #dc3545;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .material-icons {
      font-size: 18px;
    }
  }
`;

const CameraDetailsModal = ({ camera, onClose }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [generalInfoOpen, setGeneralInfoOpen] = useState(true);
  const [statisticsOpen, setStatisticsOpen] = useState(false);
  const [cameraForm, setCameraForm] = useState({
    name: camera.name || '',
    manufacturer: camera.manufacturer || '',
    model: camera.model || '',
    serialNumber: camera.serialNumber || '',
    description: camera.description || '',
    enabled: camera.enabled !== false
  });
  const [networkForm, setNetworkForm] = useState({
    rtspPort: camera.rtspPort || '',
    httpUrl: camera.httpUrl || '',
    httpPort: camera.httpPort || '',
    username: camera.username || ''
  });
  const [qualityForm, setQualityForm] = useState({
    streamChannel: camera.streamChannel || '',
    isCustom: false,
    resolution: '1920x1080',
    fps: 30,
    bitrate: 3000
  });
  const [recordingForm, setRecordingForm] = useState({
    cloudRecording: true,
    duration: '1',
    recordingType: '24x7'
  });
  const [activeAnalyticsTab, setActiveAnalyticsTab] = useState('general');
  const [analyticsForm, setAnalyticsForm] = useState({
    cameraAnalytics: true,
    cloudAnalytics: true,
    detectionRule: '',
    confidence: 25,
    minObjectSize: 30,
    sensitivity: 30,
    alarmOnDelay: 40,
    alarmOffDelay: 50,
    tamperingSensitivity: 60
  });
  const [locationForm, setLocationForm] = useState({
    latitude: camera.latitude || 0,
    longitude: camera.longitude || 0,
    address: camera.address || '',
    building: camera.building || '',
    floor: camera.floor || '',
    room: camera.room || '',
    notes: camera.locationNotes || ''
  });
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [searchBox, setSearchBox] = useState(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [events, setEvents] = useState([
    // Sample events data - in a real app, this would come from an API
    {
      id: 1,
      event: 'Camera Offline',
      type: 'error',
      message: 'Connection lost to camera',
      timestamp: '2024-01-20T14:30:00'
    },
    {
      id: 2,
      event: 'Motion Detected',
      type: 'info',
      message: 'Motion detected in zone 1',
      timestamp: '2024-01-20T14:25:00'
    },
    {
      id: 3,
      event: 'Recording Started',
      type: 'success',
      message: 'Cloud recording initiated',
      timestamp: '2024-01-20T14:20:00'
    }
  ]);
  const [logsFilter, setLogsFilter] = useState({
    timezone: 'local',
    viewEvents: '',
    hours: '0',
    minutes: '0',
    searchQuery: '',
    operation: '',
    user: '',
    pageSize: '20',
    currentPage: 1
  });
  const [logs, setLogs] = useState([
    {
      id: 1,
      timestamp: '2024-01-20T14:30:00',
      message: 'Camera went offline',
      operation: 'status',
      user: 'System',
      type: 'error'
    },
    {
      id: 2,
      timestamp: '2024-01-20T14:00:00',
      message: 'Camera is online',
      operation: 'status',
      user: 'System',
      type: 'success'
    },
    {
      id: 3,
      timestamp: '2024-01-20T13:45:00',
      message: 'Camera settings updated',
      operation: 'update',
      user: 'Admin',
      type: 'info'
    }
  ]);
  const [billingForm, setBillingForm] = useState({
    payAsYouGo: true
  });
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const toggleSection = (section) => {
    switch (section) {
      case 'general':
        setGeneralInfoOpen(!generalInfoOpen);
        break;
      case 'statistics':
        setStatisticsOpen(!statisticsOpen);
        break;
      default:
        break;
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCameraForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleNetworkInputChange = (e) => {
    const { name, value } = e.target;
    setNetworkForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQualityInputChange = (name, value) => {
    setQualityForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRecordingInputChange = (name, value) => {
    setRecordingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAnalyticsInputChange = (name, value) => {
    setAnalyticsForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLocationInputChange = (e) => {
    const { name, value } = e.target;
    setLocationForm(prev => ({
      ...prev,
      [name]: value
    }));

    // Update marker position if coordinates change
    if ((name === 'latitude' || name === 'longitude') && map && marker) {
      const lat = name === 'latitude' ? parseFloat(value) : locationForm.latitude;
      const lng = name === 'longitude' ? parseFloat(value) : locationForm.longitude;
      if (!isNaN(lat) && !isNaN(lng)) {
        const newPosition = { lat, lng };
        marker.setPosition(newPosition);
        map.panTo(newPosition);
      }
    }
  };

  const handleUpdate = () => {
    // Here you would typically make an API call to update the camera
    console.log('Updating camera with:', cameraForm);
  };

  const handlePing = (type) => {
    // Here you would typically make an API call to ping the camera
    console.log(`Pinging camera ${type}:`, networkForm);
  };

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setIsGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPosition = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };

        // Update marker and map
        if (map && marker) {
          marker.setPosition(newPosition);
          map.panTo(newPosition);
          map.setZoom(15);
        }

        // Update form with new coordinates
        setLocationForm(prev => ({
          ...prev,
          latitude: newPosition.lat,
          longitude: newPosition.lng
        }));

        // Reverse geocode to get address
        if (window.google) {
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: newPosition }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setLocationForm(prev => ({
                ...prev,
                address: results[0].formatted_address
              }));
            }
          });
        }

        setIsGettingLocation(false);
      },
      (error) => {
        setIsGettingLocation(false);
        switch(error.code) {
          case error.PERMISSION_DENIED:
            alert('Location permission was denied');
            break;
          case error.POSITION_UNAVAILABLE:
            alert('Location information is unavailable');
            break;
          case error.TIMEOUT:
            alert('Location request timed out');
            break;
          default:
            alert('An unknown error occurred');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    }).format(date);
  };

  const renderEventsTab = () => (
    <div>
      <EventsTable>
        <thead>
          <tr>
            <TableHeader>Event</TableHeader>
            <TableHeader>Event Type</TableHeader>
            <TableHeader>Message</TableHeader>
            <TableHeader>Date and Time</TableHeader>
          </tr>
        </thead>
        <tbody>
          {events.length > 0 ? (
            events.map(event => (
              <TableRow key={event.id}>
                <TableCell highlight>{event.event}</TableCell>
                <TableCell>
                  <EventTypeChip type={event.type}>
                    {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                  </EventTypeChip>
                </TableCell>
                <TableCell highlight>{event.message}</TableCell>
                <TableCell>
                  <DateText>{formatDate(event.timestamp)}</DateText>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <NoEventsMessage>No events found</NoEventsMessage>
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </EventsTable>
    </div>
  );

  const handleLogsFilterChange = (name, value) => {
    setLogsFilter(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleClearFilter = () => {
    setLogsFilter({
      timezone: 'local',
      viewEvents: '',
      hours: '0',
      minutes: '0',
      searchQuery: '',
      operation: '',
      user: '',
      pageSize: '20',
      currentPage: 1
    });
  };

  const renderLogsTab = () => (
    <div>
      <LogsHeader>
        <FilterGroup>
          <FilterLabel>Timezone:</FilterLabel>
          <TimezoneToggle>
            <TimezoneOption 
              active={logsFilter.timezone === 'local'}
              onClick={() => handleLogsFilterChange('timezone', 'local')}
            >
              Local
            </TimezoneOption>
            <TimezoneOption 
              active={logsFilter.timezone === 'utc'}
              onClick={() => handleLogsFilterChange('timezone', 'utc')}
            >
              UTC
            </TimezoneOption>
          </TimezoneToggle>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>View Events</FilterLabel>
          <FilterSelect
            value={logsFilter.viewEvents}
            onChange={(e) => handleLogsFilterChange('viewEvents', e.target.value)}
          >
            <option value="">All Events</option>
            <option value="error">Errors</option>
            <option value="warning">Warnings</option>
            <option value="info">Info</option>
            <option value="success">Success</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>Last</FilterLabel>
          <TimeFilter>
            <Select
              value={logsFilter.hours}
              onChange={(e) => handleLogsFilterChange('hours', e.target.value)}
            >
              {Array.from({ length: 25 }, (_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </Select>
            <FilterLabel>hours</FilterLabel>
          </TimeFilter>
          <TimeFilter>
            <Select
              value={logsFilter.minutes}
              onChange={(e) => handleLogsFilterChange('minutes', e.target.value)}
            >
              {Array.from({ length: 60 }, (_, i) => (
                <option key={i} value={i}>{i}</option>
              ))}
            </Select>
            <FilterLabel>minutes</FilterLabel>
          </TimeFilter>
        </FilterGroup>

        <Button onClick={handleClearFilter}>
          <span className="material-icons">close</span>
          Clear Filter
        </Button>
      </LogsHeader>

      <LogsHeader>
        <SearchFilter>
          <span className="material-icons">search</span>
          <Input
            type="text"
            value={logsFilter.searchQuery}
            onChange={(e) => handleLogsFilterChange('searchQuery', e.target.value)}
            placeholder="Search message..."
          />
        </SearchFilter>

        <FilterGroup>
          <FilterLabel>Operation</FilterLabel>
          <FilterSelect
            value={logsFilter.operation}
            onChange={(e) => handleLogsFilterChange('operation', e.target.value)}
          >
            <option value="">All Operations</option>
            <option value="status">Status Changes</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </FilterSelect>
        </FilterGroup>

        <FilterGroup>
          <FilterLabel>User</FilterLabel>
          <FilterSelect
            value={logsFilter.user}
            onChange={(e) => handleLogsFilterChange('user', e.target.value)}
          >
            <option value="">All Users</option>
            <option value="System">System</option>
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="viewer">Viewer</option>
          </FilterSelect>
        </FilterGroup>

        <Button primary onClick={() => {
          // Here you would typically make an API call to fetch filtered logs
          console.log('Fetching logs with filters:', logsFilter);
        }}>
          Show
        </Button>
      </LogsHeader>

      <EventsTable>
        <thead>
          <tr>
            <TableHeader>Date & Time</TableHeader>
            <TableHeader>Message</TableHeader>
            <TableHeader>Operation</TableHeader>
            <TableHeader>User</TableHeader>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map(log => (
              <TableRow key={log.id}>
                <TableCell>
                  <DateText>{formatDate(log.timestamp)}</DateText>
                </TableCell>
                <TableCell highlight>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <EventTypeChip type={log.type}>
                      {log.type.charAt(0).toUpperCase() + log.type.slice(1)}
                    </EventTypeChip>
                    {log.message}
                  </div>
                </TableCell>
                <TableCell>{log.operation}</TableCell>
                <TableCell>{log.user}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4}>
                <NoEventsMessage>No data found</NoEventsMessage>
              </TableCell>
            </TableRow>
          )}
        </tbody>
      </EventsTable>

      <PaginationFooter>
        <PageInfo>
          Rows per page:
          <PageSizeSelect
            value={logsFilter.pageSize}
            onChange={(e) => handleLogsFilterChange('pageSize', e.target.value)}
          >
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </PageSizeSelect>
        </PageInfo>
        <PageInfo>1-3 of 3</PageInfo>
        <PaginationControls>
          <NavigationButton disabled>
            <span className="material-icons">chevron_left</span>
          </NavigationButton>
          <NavigationButton disabled>
            <span className="material-icons">chevron_right</span>
          </NavigationButton>
        </PaginationControls>
      </PaginationFooter>
    </div>
  );

  const renderBillingTab = () => (
    <div>
      <BillingContainer>
        <BillingOption 
          selected={billingForm.payAsYouGo}
          onClick={() => setBillingForm(prev => ({ ...prev, payAsYouGo: true }))}
        >
          <BillingCheckbox checked={billingForm.payAsYouGo}>
            {billingForm.payAsYouGo && <span className="material-icons" style={{ fontSize: '16px' }}>check</span>}
          </BillingCheckbox>
          <BillingInfo>
            <BillingTitle>Pay as You go+ Analytics</BillingTitle>
            <BillingDescription>
              Pay only for what you use. Includes cloud recording and analytics features.
              Perfect for flexible usage patterns and scalable deployments.
            </BillingDescription>
          </BillingInfo>
        </BillingOption>
      </BillingContainer>

      <BillingContainer>
        <BillingAdvanceLink>
          <span>Analytics</span>
          <span>Advance</span>
        </BillingAdvanceLink>
      </BillingContainer>

      <ButtonGroup>
        <Button onClick={() => setActiveTab('info')}>Back</Button>
        <Button primary onClick={() => {
          // Here you would typically make an API call to update the billing settings
          console.log('Updating billing settings:', billingForm);
        }}>Update</Button>
      </ButtonGroup>
    </div>
  );

  const handleDelete = async () => {
    if (deleteConfirmation !== 'delete') return;
    
    setIsDeleting(true);
    try {
      // Here you would typically make an API call to delete the camera
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulated API call
      console.log('Deleting camera:', camera.id);
      onClose();
    } catch (error) {
      console.error('Error deleting camera:', error);
      setIsDeleting(false);
    }
  };

  const renderDeleteTab = () => (
    <DeleteContainer>
      <DeleteIcon>
        <span className="material-icons">delete_forever</span>
      </DeleteIcon>
      
      <DeleteTitle>Delete Camera</DeleteTitle>
      <DeleteDescription>
        You are about to delete the camera "{camera.name}". This action is permanent and cannot be undone.
        All associated data including recordings, events, and settings will be permanently removed.
      </DeleteDescription>

      <WarningList>
        <li>
          <span className="material-icons">warning</span>
          All recorded footage will be permanently deleted
        </li>
        <li>
          <span className="material-icons">warning</span>
          All analytics data and event history will be lost
        </li>
        <li>
          <span className="material-icons">warning</span>
          Camera configuration and settings cannot be recovered
        </li>
        <li>
          <span className="material-icons">warning</span>
          Associated alerts and notifications will be removed
        </li>
      </WarningList>

      <DeleteConfirmation>
        <FormLabel>Type "delete" to confirm:</FormLabel>
        <DeleteInputContainer>
          <DeleteInput
            type="text"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value.toLowerCase())}
            placeholder="Type 'delete' here"
            spellCheck="false"
            autoComplete="off"
            disabled={isDeleting}
          />
        </DeleteInputContainer>
        <DeleteProgress>
          <ProgressBar value={deleteConfirmation} />
        </DeleteProgress>
      </DeleteConfirmation>

      <ButtonGroup>
        <Button onClick={() => setActiveTab('info')}>Cancel</Button>
        <Button 
          style={{ 
            backgroundColor: deleteConfirmation === 'delete' ? '#dc3545' : '#666',
            cursor: deleteConfirmation === 'delete' ? 'pointer' : 'not-allowed',
          }}
          onClick={handleDelete}
          disabled={deleteConfirmation !== 'delete' || isDeleting}
        >
          {isDeleting ? (
            <>
              <span className="material-icons" style={{ animation: 'spin 1s linear infinite' }}>sync</span>
              Deleting...
            </>
          ) : (
            <>
              <span className="material-icons">delete_forever</span>
              Delete Camera
            </>
          )}
        </Button>
      </ButtonGroup>
    </DeleteContainer>
  );

  useEffect(() => {
    // Initialize Google Maps
    if (window.google && !map) {
      const defaultPosition = { 
        lat: parseFloat(locationForm.latitude) || 0, 
        lng: parseFloat(locationForm.longitude) || 0 
      };

      const mapInstance = new window.google.maps.Map(document.getElementById('map'), {
        center: defaultPosition,
        zoom: 15,
        styles: [
          { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
          { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
          {
            featureType: "administrative.locality",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi",
            elementType: "labels.text.fill",
            stylers: [{ color: "#d59563" }],
          },
          {
            featureType: "poi.park",
            elementType: "geometry",
            stylers: [{ color: "#263c3f" }],
          },
          {
            featureType: "poi.park",
            elementType: "labels.text.fill",
            stylers: [{ color: "#6b9a76" }],
          },
          {
            featureType: "road",
            elementType: "geometry",
            stylers: [{ color: "#38414e" }],
          },
          {
            featureType: "road",
            elementType: "geometry.stroke",
            stylers: [{ color: "#212a37" }],
          },
          {
            featureType: "road",
            elementType: "labels.text.fill",
            stylers: [{ color: "#9ca5b3" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry",
            stylers: [{ color: "#746855" }],
          },
          {
            featureType: "road.highway",
            elementType: "geometry.stroke",
            stylers: [{ color: "#1f2835" }],
          },
          {
            featureType: "road.highway",
            elementType: "labels.text.fill",
            stylers: [{ color: "#f3d19c" }],
          },
          {
            featureType: "water",
            elementType: "geometry",
            stylers: [{ color: "#17263c" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.fill",
            stylers: [{ color: "#515c6d" }],
          },
          {
            featureType: "water",
            elementType: "labels.text.stroke",
            stylers: [{ color: "#17263c" }],
          },
        ],
      });

      const markerInstance = new window.google.maps.Marker({
        position: defaultPosition,
        map: mapInstance,
        draggable: true,
        title: camera.name
      });

      // Initialize the search box
      const searchBoxInput = document.getElementById('location-search');
      if (searchBoxInput) {
        const searchBoxInstance = new window.google.maps.places.SearchBox(searchBoxInput);
        
        // Bias the SearchBox results towards current map's viewport
        mapInstance.addListener('bounds_changed', () => {
          searchBoxInstance.setBounds(mapInstance.getBounds());
        });

        // Listen for the event when the user selects a prediction
        searchBoxInstance.addListener('places_changed', () => {
          const places = searchBoxInstance.getPlaces();

          if (places.length === 0) {
            return;
          }

          const place = places[0];
          if (!place.geometry || !place.geometry.location) {
            console.log('Returned place contains no geometry');
            return;
          }

          // Update marker and map position
          const newPosition = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng()
          };
          
          markerInstance.setPosition(newPosition);
          mapInstance.setCenter(newPosition);

          // If the place has a geometry, update the form
          setLocationForm(prev => ({
            ...prev,
            latitude: newPosition.lat,
            longitude: newPosition.lng,
            address: place.formatted_address || prev.address
          }));
        });

        setSearchBox(searchBoxInstance);
      }

      // Update form when marker is dragged
      markerInstance.addListener('dragend', () => {
        const position = markerInstance.getPosition();
        setLocationForm(prev => ({
          ...prev,
          latitude: position.lat(),
          longitude: position.lng()
        }));

        // Optionally, you can also reverse geocode the new position to get the address
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: position }, (results, status) => {
          if (status === 'OK' && results[0]) {
            setLocationForm(prev => ({
              ...prev,
              address: results[0].formatted_address
            }));
          }
        });
      });

      setMap(mapInstance);
      setMarker(markerInstance);
    }
  }, []);

  const renderGeneralInfo = () => (
    <CollapsibleSection>
      <SectionHeader isOpen={generalInfoOpen} onClick={() => toggleSection('general')}>
        <span className="material-icons">expand_more</span>
        <span className="material-icons">info</span>
        General Info
      </SectionHeader>
      <SectionContent isOpen={generalInfoOpen}>
        <Grid>
          <Label>Camera ID</Label>
          <Value>{camera.id}</Value>
          
          <Label>Camera Name</Label>
          <Value>{camera.name}</Value>
          
          <Label>Manufacturer</Label>
          <Value>{camera.manufacturer || 'Unknown'}</Value>
          
          <Label>Model</Label>
          <Value>{camera.model || 'Unknown'}</Value>
          
          <Label>Serial number</Label>
          <Value>{camera.serialNumber || 'Unknown'}</Value>
          
          <Label>Enabled</Label>
          <Value>On</Value>
          
          <Label>Video source url</Label>
          <Value>{camera.rtsp_url || camera.url}</Value>
          
          <Label>HTTP access url</Label>
          <Value>{camera.http_url || 'Not configured'}</Value>
          
          <Label>Username</Label>
          <Value>{camera.username || 'Not set'}</Value>
          
          <Label>Stream channel</Label>
          <Value>{camera.streamChannel || 'Default'}</Value>
          
          <Label>Quality</Label>
          <Value>{camera.quality || 'Auto'}</Value>
          
          <Label>Alerts</Label>
          <Value>On</Value>
          
          <Label>Cloud recording</Label>
          <Value>on, 1 week</Value>
          
          <Label>Plan</Label>
          <Value>Pay as You Go + Analytics (PayAsYouGo)</Value>
        </Grid>
      </SectionContent>
    </CollapsibleSection>
  );

  const renderStatistics = () => (
    <CollapsibleSection>
      <SectionHeader isOpen={statisticsOpen} onClick={() => toggleSection('statistics')}>
        <span className="material-icons">expand_more</span>
        <span className="material-icons">analytics</span>
        Statistics
      </SectionHeader>
      <SectionContent isOpen={statisticsOpen}>
        <StatGrid>
          <StatLabel>Uptime</StatLabel>
          <StatValue>99.9% (30 days)</StatValue>
          
          <StatLabel>Total Recording</StatLabel>
          <StatValue>720 hours</StatValue>
          
          <StatLabel>Storage Used</StatLabel>
          <StatValue>245.8 GB</StatValue>
          
          <StatLabel>Bandwidth</StatLabel>
          <StatValue>2.5 Mbps (avg)</StatValue>
          
          <StatLabel>Detection Events</StatLabel>
          <StatValue>1,234 (30 days)</StatValue>
          
          <StatLabel>Alert Triggers</StatLabel>
          <StatValue>45 (30 days)</StatValue>
          
          <StatLabel>Last Motion</StatLabel>
          <StatValue>2 minutes ago</StatValue>
          
          <StatLabel>Peak Hours</StatLabel>
          <StatValue>9:00 AM - 5:00 PM</StatValue>
          
          <StatLabel>Resolution</StatLabel>
          <StatValue>1920x1080 (FHD)</StatValue>
          
          <StatLabel>Frame Rate</StatLabel>
          <StatValue>30 fps</StatValue>
        </StatGrid>
      </SectionContent>
    </CollapsibleSection>
  );

  const renderGeneralTab = () => (
    <div>
      <FormGroup>
        <FormLabel>Camera Name</FormLabel>
        <Input
          type="text"
          name="name"
          value={cameraForm.name}
          onChange={handleInputChange}
          placeholder="Enter camera name"
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Manufacturer</FormLabel>
        <Input
          type="text"
          name="manufacturer"
          value={cameraForm.manufacturer}
          onChange={handleInputChange}
          placeholder="Enter manufacturer"
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Model</FormLabel>
        <Input
          type="text"
          name="model"
          value={cameraForm.model}
          onChange={handleInputChange}
          placeholder="Enter model"
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Serial Number</FormLabel>
        <Input
          type="text"
          name="serialNumber"
          value={cameraForm.serialNumber}
          onChange={handleInputChange}
          placeholder="Enter serial number"
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Description</FormLabel>
        <TextArea
          name="description"
          value={cameraForm.description}
          onChange={handleInputChange}
          placeholder="Enter description"
        />
      </FormGroup>

      <ToggleContainer>
        <ToggleLabel>Enabled</ToggleLabel>
        <ToggleSwitch>
          <input
            type="checkbox"
            name="enabled"
            checked={cameraForm.enabled}
            onChange={handleInputChange}
          />
          <span />
        </ToggleSwitch>
      </ToggleContainer>

      <ButtonGroup>
        <Button onClick={() => setActiveTab('info')}>Back</Button>
        <Button primary onClick={handleUpdate}>Update</Button>
      </ButtonGroup>
    </div>
  );

  const renderNetworkTab = () => (
    <div>
      <NetworkFormGroup className="with-button">
        <div className="input-container">
          <FormLabel>RTSP port</FormLabel>
          <Input
            type="text"
            name="rtspPort"
            value={networkForm.rtspPort}
            onChange={handleNetworkInputChange}
            placeholder="null"
          />
        </div>
        <PingButton onClick={() => handlePing('rtsp')}>
          Ping
        </PingButton>
      </NetworkFormGroup>

      <NetworkFormGroup className="with-button">
        <div className="input-container">
          <FormLabel>HTTP Access URL</FormLabel>
          <Input
            type="text"
            name="httpUrl"
            value={networkForm.httpUrl}
            onChange={handleNetworkInputChange}
          />
        </div>
        <div className="input-container" style={{ maxWidth: '150px' }}>
          <FormLabel>Port</FormLabel>
          <Input
            type="text"
            name="httpPort"
            value={networkForm.httpPort}
            onChange={handleNetworkInputChange}
            placeholder="null"
          />
        </div>
        <PingButton onClick={() => handlePing('http')}>
          Ping
        </PingButton>
      </NetworkFormGroup>

      <FormGroup>
        <FormLabel>User Name</FormLabel>
        <Input
          type="text"
          name="username"
          value={networkForm.username}
          onChange={handleNetworkInputChange}
        />
      </FormGroup>

      <ButtonGroup>
        <Button onClick={() => setActiveTab('info')}>Back</Button>
        <Button primary onClick={() => {
          // Here you would typically make an API call to update the network settings
          console.log('Updating network settings:', networkForm);
        }}>Update</Button>
      </ButtonGroup>
    </div>
  );

  const renderQualityTab = () => (
    <div>
      <FormGroup>
        <FormLabel>Stream Channel</FormLabel>
        <Select
          value={qualityForm.streamChannel}
          onChange={(e) => handleQualityInputChange('streamChannel', e.target.value)}
        >
          <option value="">Select</option>
          <option value="primary">Primary</option>
          <option value="secondary">Secondary</option>
          <option value="tertiary">Tertiary</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <FormLabel>Setting</FormLabel>
        <ToggleButtonGroup>
          <ToggleButton
            active={!qualityForm.isCustom}
            onClick={() => handleQualityInputChange('isCustom', false)}
          >
            Default
          </ToggleButton>
          <ToggleButton
            active={qualityForm.isCustom}
            onClick={() => handleQualityInputChange('isCustom', true)}
          >
            Customize
          </ToggleButton>
        </ToggleButtonGroup>
      </FormGroup>

      <FormGroup>
        <FormLabel>Resolution</FormLabel>
        <Select
          value={qualityForm.resolution}
          onChange={(e) => handleQualityInputChange('resolution', e.target.value)}
          disabled={!qualityForm.isCustom}
        >
          <option value="3840x2160">4K (3840x2160)</option>
          <option value="2560x1440">2K (2560x1440)</option>
          <option value="1920x1080">FHD (1920x1080)</option>
          <option value="1280x720">HD (1280x720)</option>
          <option value="854x480">SD (854x480)</option>
        </Select>
      </FormGroup>

      <SliderContainer>
        <SliderHeader>
          <SliderLabel>FPS (frames per second)</SliderLabel>
          <SliderValue>{qualityForm.fps}</SliderValue>
        </SliderHeader>
        <Slider
          type="range"
          min="0"
          max="60"
          value={qualityForm.fps}
          onChange={(e) => handleQualityInputChange('fps', parseInt(e.target.value))}
          disabled={!qualityForm.isCustom}
        />
      </SliderContainer>

      <SliderContainer>
        <SliderHeader>
          <SliderLabel>Bitrate</SliderLabel>
          <SliderValue>{qualityForm.bitrate} Kbps</SliderValue>
        </SliderHeader>
        <Slider
          type="range"
          min="0"
          max="6000"
          step="100"
          value={qualityForm.bitrate}
          onChange={(e) => handleQualityInputChange('bitrate', parseInt(e.target.value))}
          disabled={!qualityForm.isCustom}
        />
      </SliderContainer>

      <ButtonGroup>
        <Button onClick={() => setActiveTab('info')}>Back</Button>
        <Button primary onClick={() => {
          // Here you would typically make an API call to update the quality settings
          console.log('Updating quality settings:', qualityForm);
        }}>Update</Button>
      </ButtonGroup>
    </div>
  );

  const renderRecordingTab = () => (
    <div>
      <div style={{ marginBottom: '24px' }}>
        <FormLabel>Current Archive: On, 1 Week</FormLabel>
      </div>

      <FormGroup>
        <FormLabel>Cloud Recording</FormLabel>
        <Select
          value={recordingForm.duration}
          onChange={(e) => handleRecordingInputChange('duration', e.target.value)}
        >
          <option value="">Weeks</option>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <FormLabel>What to Record</FormLabel>
        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="recordingType"
              value="24x7"
              checked={recordingForm.recordingType === '24x7'}
              onChange={(e) => handleRecordingInputChange('recordingType', e.target.value)}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ color: '#fff' }}>24x7</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input
              type="radio"
              name="recordingType"
              value="motion"
              checked={recordingForm.recordingType === 'motion'}
              onChange={(e) => handleRecordingInputChange('recordingType', e.target.value)}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ color: '#fff' }}>Motion Events</span>
          </label>
        </div>
      </FormGroup>

      <ButtonGroup>
        <Button onClick={() => setActiveTab('info')}>Back</Button>
        <Button primary onClick={() => {
          // Here you would typically make an API call to update the recording settings
          console.log('Updating recording settings:', recordingForm);
        }}>Update</Button>
      </ButtonGroup>
    </div>
  );

  const renderAnalyticsGeneralTab = () => (
    <div>
      <ToggleContainer>
        <ToggleLabel>Camera Analytics</ToggleLabel>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={analyticsForm.cameraAnalytics}
            onChange={(e) => handleAnalyticsInputChange('cameraAnalytics', e.target.checked)}
          />
          <span />
        </ToggleSwitch>
        <InfoIcon className="material-icons">help_outline</InfoIcon>
      </ToggleContainer>

      <ToggleContainer>
        <ToggleLabel>Cloud Analytics</ToggleLabel>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={analyticsForm.cloudAnalytics}
            onChange={(e) => handleAnalyticsInputChange('cloudAnalytics', e.target.checked)}
          />
          <span />
        </ToggleSwitch>
        <InfoIcon className="material-icons">help_outline</InfoIcon>
      </ToggleContainer>

      <DetectionRule>
        <FormGroup>
          <FormLabel>Detection Rule#1</FormLabel>
          <Select
            value={analyticsForm.detectionRule}
            onChange={(e) => handleAnalyticsInputChange('detectionRule', e.target.value)}
          >
            <option value="">Select</option>
            <option value="rule1">Rule 1</option>
            <option value="rule2">Rule 2</option>
            <option value="rule3">Rule 3</option>
          </Select>
        </FormGroup>

        <SliderContainer>
          <SliderHeader>
            <SliderLabel>Confidence</SliderLabel>
            <SliderValue>{analyticsForm.confidence}%</SliderValue>
          </SliderHeader>
          <Slider
            type="range"
            min="0"
            max="100"
            value={analyticsForm.confidence}
            onChange={(e) => handleAnalyticsInputChange('confidence', parseInt(e.target.value))}
          />
        </SliderContainer>
      </DetectionRule>

      <ButtonGroup>
        <Button onClick={() => setActiveTab('info')}>Back</Button>
        <Button primary>Add Rule</Button>
      </ButtonGroup>
    </div>
  );

  const renderAnalyticsMotionTab = () => (
    <div>
      <ToggleContainer>
        <ToggleLabel>Enabled</ToggleLabel>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={analyticsForm.motionEnabled}
            onChange={(e) => handleAnalyticsInputChange('motionEnabled', e.target.checked)}
          />
          <span />
        </ToggleSwitch>
      </ToggleContainer>

      <FormGroup style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{ flex: 1 }}>
          <FormLabel>Min. Object Size<InfoIcon className="material-icons">help_outline</InfoIcon></FormLabel>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Input
              type="text"
              value={analyticsForm.minObjectSize}
              disabled
              style={{ width: '60px' }}
            />
            <UnitLabel>%</UnitLabel>
            <ChangeButton>Change</ChangeButton>
          </div>
        </div>
      </FormGroup>

      <SliderContainer>
        <SliderHeader>
          <SliderLabel>Sensitivity<InfoIcon className="material-icons">help_outline</InfoIcon></SliderLabel>
          <SliderValue>{analyticsForm.sensitivity}%</SliderValue>
        </SliderHeader>
        <Slider
          type="range"
          min="0"
          max="100"
          value={analyticsForm.sensitivity}
          onChange={(e) => handleAnalyticsInputChange('sensitivity', parseInt(e.target.value))}
        />
      </SliderContainer>

      <SliderContainer>
        <SliderHeader>
          <SliderLabel>Alarm ON delay (in sec):<InfoIcon className="material-icons">help_outline</InfoIcon></SliderLabel>
          <SliderValue>{analyticsForm.alarmOnDelay} sec.</SliderValue>
        </SliderHeader>
        <Slider
          type="range"
          min="0"
          max="120"
          value={analyticsForm.alarmOnDelay}
          onChange={(e) => handleAnalyticsInputChange('alarmOnDelay', parseInt(e.target.value))}
        />
      </SliderContainer>

      <SliderContainer>
        <SliderHeader>
          <SliderLabel>Alarm OFF delay (in sec):<InfoIcon className="material-icons">help_outline</InfoIcon></SliderLabel>
          <SliderValue>{analyticsForm.alarmOffDelay} sec.</SliderValue>
        </SliderHeader>
        <Slider
          type="range"
          min="0"
          max="120"
          value={analyticsForm.alarmOffDelay}
          onChange={(e) => handleAnalyticsInputChange('alarmOffDelay', parseInt(e.target.value))}
        />
      </SliderContainer>

      <ButtonGroup>
        <Button>Delete</Button>
        <Button primary>Apply Settings</Button>
      </ButtonGroup>
    </div>
  );

  const renderAnalyticsTamperingTab = () => (
    <div>
      <ToggleContainer>
        <ToggleLabel>Enabled</ToggleLabel>
        <ToggleSwitch>
          <input
            type="checkbox"
            checked={analyticsForm.tamperingEnabled}
            onChange={(e) => handleAnalyticsInputChange('tamperingEnabled', e.target.checked)}
          />
          <span />
        </ToggleSwitch>
      </ToggleContainer>

      <SliderContainer>
        <SliderHeader>
          <SliderLabel>Sensitivity<InfoIcon className="material-icons">help_outline</InfoIcon></SliderLabel>
          <SliderValue>{analyticsForm.tamperingSensitivity} sec.</SliderValue>
        </SliderHeader>
        <Slider
          type="range"
          min="0"
          max="100"
          value={analyticsForm.tamperingSensitivity}
          onChange={(e) => handleAnalyticsInputChange('tamperingSensitivity', parseInt(e.target.value))}
        />
      </SliderContainer>

      <ButtonGroup>
        <Button>Delete</Button>
        <Button primary>Apply Settings</Button>
      </ButtonGroup>
    </div>
  );

  const renderAnalyticsTab = () => (
    <div>
      <SubTabList>
        <SubTab
          active={activeAnalyticsTab === 'general'}
          onClick={() => setActiveAnalyticsTab('general')}
        >
          General
        </SubTab>
        <SubTab
          active={activeAnalyticsTab === 'motion'}
          onClick={() => setActiveAnalyticsTab('motion')}
        >
          Motion Detection
        </SubTab>
        <SubTab
          active={activeAnalyticsTab === 'tampering'}
          onClick={() => setActiveAnalyticsTab('tampering')}
        >
          Tampering Detection
        </SubTab>
      </SubTabList>

      {activeAnalyticsTab === 'general' && renderAnalyticsGeneralTab()}
      {activeAnalyticsTab === 'motion' && renderAnalyticsMotionTab()}
      {activeAnalyticsTab === 'tampering' && renderAnalyticsTamperingTab()}
    </div>
  );

  const renderLocationTab = () => (
    <div>
      <SearchContainer>
        <SearchBox>
          <SearchInput
            id="location-search"
            type="text"
            placeholder="Search for a location..."
          />
          <SearchIcon className="material-icons">search</SearchIcon>
        </SearchBox>
        <LocationButton 
          onClick={handleGetCurrentLocation}
          disabled={isGettingLocation}
        >
          <span className="material-icons">my_location</span>
          {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
        </LocationButton>
      </SearchContainer>

      <MapContainer id="map" />

      <LocationGrid>
        <FormGroup>
          <FormLabel>Latitude</FormLabel>
          <CoordinateInput
            type="number"
            name="latitude"
            value={locationForm.latitude}
            onChange={handleLocationInputChange}
            step="0.000001"
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Longitude</FormLabel>
          <CoordinateInput
            type="number"
            name="longitude"
            value={locationForm.longitude}
            onChange={handleLocationInputChange}
            step="0.000001"
          />
        </FormGroup>
      </LocationGrid>

      <FormGroup>
        <FormLabel>Address</FormLabel>
        <AddressTextArea
          name="address"
          value={locationForm.address}
          onChange={handleLocationInputChange}
          placeholder="Enter full address"
        />
      </FormGroup>

      <LocationGrid>
        <FormGroup>
          <FormLabel>Building</FormLabel>
          <Input
            type="text"
            name="building"
            value={locationForm.building}
            onChange={handleLocationInputChange}
            placeholder="Building name/number"
          />
        </FormGroup>

        <FormGroup>
          <FormLabel>Floor</FormLabel>
          <Input
            type="text"
            name="floor"
            value={locationForm.floor}
            onChange={handleLocationInputChange}
            placeholder="Floor number"
          />
        </FormGroup>
      </LocationGrid>

      <FormGroup>
        <FormLabel>Room</FormLabel>
        <Input
          type="text"
          name="room"
          value={locationForm.room}
          onChange={handleLocationInputChange}
          placeholder="Room number/name"
        />
      </FormGroup>

      <FormGroup>
        <FormLabel>Additional Notes</FormLabel>
        <TextArea
          name="notes"
          value={locationForm.notes}
          onChange={handleLocationInputChange}
          placeholder="Any additional location details"
        />
      </FormGroup>

      <ButtonGroup>
        <Button onClick={() => setActiveTab('info')}>Back</Button>
        <Button primary onClick={() => {
          // Here you would typically make an API call to update the location
          console.log('Updating location:', locationForm);
        }}>Update Location</Button>
      </ButtonGroup>
    </div>
  );

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Header>
          <Title>
            <span className="material-icons">videocam</span>
            Camera
          </Title>
          <StatusBadges>
            <Badge type="offline">Video Offline</Badge>
            <Badge type="cloud">Cloud</Badge>
          </StatusBadges>
        </Header>

        <TabContainer>
          <TabList>
            <Tab active={activeTab === 'info'} onClick={() => handleTabChange('info')}>Info</Tab>
            <Tab active={activeTab === 'general'} onClick={() => handleTabChange('general')}>General</Tab>
            <Tab active={activeTab === 'network'} onClick={() => handleTabChange('network')}>Network</Tab>
            <Tab active={activeTab === 'quality'} onClick={() => handleTabChange('quality')}>Quality</Tab>
            <Tab active={activeTab === 'recording'} onClick={() => handleTabChange('recording')}>Recording</Tab>
            <Tab active={activeTab === 'analytics'} onClick={() => handleTabChange('analytics')}>Analytics</Tab>
            <Tab active={activeTab === 'location'} onClick={() => handleTabChange('location')}>Location</Tab>
            <Tab active={activeTab === 'events'} onClick={() => handleTabChange('events')}>Events</Tab>
            <Tab active={activeTab === 'logs'} onClick={() => handleTabChange('logs')}>Logs</Tab>
            <Tab active={activeTab === 'billing'} onClick={() => handleTabChange('billing')}>Billing</Tab>
            <Tab active={activeTab === 'delete'} onClick={() => handleTabChange('delete')}>Delete</Tab>
          </TabList>
        </TabContainer>

        <ContentArea>
          {activeTab === 'info' && (
            <InfoContainer>
              <LeftSection>
                <SectionTitle>
                  <span className="material-icons">photo</span>
                  Last Thumbnail
                </SectionTitle>
                <VideoContainer>
                  <video 
                    controls
                    poster={camera.lastThumbnail}
                    src={camera.videoSrc || camera.rtsp_url}
                  >
                    Your browser does not support the video tag.
                  </video>
                </VideoContainer>
              </LeftSection>
              
              <RightSection>
                {renderGeneralInfo()}
                {renderStatistics()}
              </RightSection>
            </InfoContainer>
          )}
          {activeTab === 'general' && renderGeneralTab()}
          {activeTab === 'network' && renderNetworkTab()}
          {activeTab === 'quality' && renderQualityTab()}
          {activeTab === 'recording' && renderRecordingTab()}
          {activeTab === 'analytics' && renderAnalyticsTab()}
          {activeTab === 'location' && renderLocationTab()}
          {activeTab === 'events' && renderEventsTab()}
          {activeTab === 'logs' && renderLogsTab()}
          {activeTab === 'billing' && renderBillingTab()}
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

export default CameraDetailsModal; 