import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axiosClient from "../../../../axios-client";

const DeleteUserModal = ({ showModal, setShowModal, user, onUserDeleted }) => {
  const [saving, setSaving] = useState(false);
  
  const handleDeleteUser = async () => {
    setSaving(true);
    
    try {
      // Make API call to delete user
      await axiosClient.delete(`/users/${user.id}`);
      
      setShowModal(false);
      
      // Notify parent component
      if (onUserDeleted && typeof onUserDeleted === 'function') {
        onUserDeleted();
      }
      
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Deletion</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Are you sure you want to delete the user <strong>{user?.name}</strong>? This action cannot be undone.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteUser} disabled={saving}>
          {saving ? 'Deleting...' : 'Delete User'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteUserModal; 