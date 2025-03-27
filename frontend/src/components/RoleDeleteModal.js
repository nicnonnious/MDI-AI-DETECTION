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
  max-width: 600px;
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
  color: #e74c3c;
`;

const ContentArea = styled.div`
  padding: 24px;
  text-align: center;
`;

const WarningIcon = styled.span`
  font-size: 48px;
  color: #e74c3c;
  margin-bottom: 16px;
  display: block;
`;

const Description = styled.p`
  color: #999;
  margin-bottom: 24px;
  line-height: 1.5;
`;

const DeleteInput = styled.input`
  background: #353535;
  border: 2px solid ${props => props.isValid ? '#2ecc71' : '#e74c3c'};
  border-radius: 4px;
  color: white;
  padding: 8px 16px;
  width: 100%;
  max-width: 300px;
  margin-bottom: 24px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.isValid ? '#27ae60' : '#c0392b'};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const Button = styled.button`
  background-color: ${props => props.danger ? '#e74c3c' : '#2c3e50'};
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
    background-color: ${props => props.danger ? '#c0392b' : '#34495e'};
  }
  
  &:disabled {
    background-color: #444;
    cursor: not-allowed;
  }
`;

const Footer = styled.div`
  padding: 16px 20px;
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #333;
  background: #1e1e1e;
`;

const RoleDeleteModal = ({ role, onClose, onDelete }) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (deleteConfirmation.toLowerCase() === 'delete') {
      setIsDeleting(true);
      // Simulate delete operation
      setTimeout(() => {
        setIsDeleting(false);
        onDelete(role.id);
        onClose();
      }, 2000);
    }
  };

  const isValid = deleteConfirmation.toLowerCase() === 'delete';

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={e => e.stopPropagation()}>
        <Header>
          <Title>
            <span className="material-icons">warning</span>
            Delete Role
          </Title>
        </Header>

        <ContentArea>
          <WarningIcon className="material-icons">warning</WarningIcon>
          <h3 style={{ color: '#e74c3c', marginBottom: '24px' }}>
            Delete Role: {role.name}
          </h3>
          <Description>
            This action cannot be undone. This will permanently delete the role
            and remove all associated permissions. Users with this role will need
            to be reassigned to a different role.
          </Description>
          <DeleteInput
            type="text"
            placeholder="Type 'delete' to confirm"
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
            isValid={isValid}
          />
          <ButtonGroup>
            <Button onClick={onClose}>
              <span className="material-icons">close</span>
              Cancel
            </Button>
            <Button
              danger
              onClick={handleDelete}
              disabled={!isValid || isDeleting}
            >
              {isDeleting ? (
                <>
                  <span className="material-icons">hourglass_empty</span>
                  Deleting...
                </>
              ) : (
                <>
                  <span className="material-icons">delete_forever</span>
                  Delete Role
                </>
              )}
            </Button>
          </ButtonGroup>
        </ContentArea>

        <Footer />
      </ModalContent>
    </ModalOverlay>
  );
};

export default RoleDeleteModal; 