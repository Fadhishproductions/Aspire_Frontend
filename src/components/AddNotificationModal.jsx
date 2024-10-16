import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useAddNotificationMutation } from '../slices/instructorApiSlice';
import { toast } from 'react-toastify';
import ConfirmationBox from './ConfirmationBox'; // Import the ConfirmationBox component

const AddNotificationModal = ({ show, courseId, setShow }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notificationType, setNotificationType] = useState('general');
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control ConfirmationBox

  const [addNotification] = useAddNotificationMutation();

  const handleClose = () => {
    setShow(false);
    setTitle('');
    setContent('');
    setNotificationType('general');
  };

  const handleConfirm = async () => {
    // Called when user confirms the submission
    try {
      await addNotification({
        courseId,
        data: {
          title,
          content,
          notificationType,
        },
      }).unwrap();
      toast.success('Notification added successfully');
    } catch (error) {
      toast.error(
        error?.data?.message ||
          error?.error ||
          'An error occurred while creating the notification'
      );
    }

    // Reset form fields
    handleClose();
    setShowConfirmation(false); // Close the confirmation box
  };

  const validateInput = (input) => {
    // Basic checks for input validity
    if (!input || input.trim().length === 0) return false; // Check for empty or whitespace
    if (/^\s*$/.test(input)) return false; // Check if only spaces
    if (input.length < 3 || input.length > 100) return false; // Check length constraints
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateInput(title)) {
      toast.error('Title must be between 3 to 200 characters and cannot be empty or just spaces.');
      return;
    }

    if (!validateInput(content)) {
      toast.error('Content must be between 3 to 200 characters and cannot be empty or just spaces.');
      return;
    }

    // Show confirmation box on form submission
    setShowConfirmation(true);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Notification</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="title" className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter Notification Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="content" className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter Notification Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="notificationType" className="mb-3">
              <Form.Label>Notification Type</Form.Label>
              <Form.Select
                value={notificationType}
                onChange={(e) => setNotificationType(e.target.value)}
              >
                <option value="general">General</option>
                <option value="live">Live Class</option>
                <option value="quiz">Quiz Notification</option>
                {/* Add more types if needed */}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit">
              Add Notification
            </Button>
            <Button variant="secondary" onClick={handleClose} className="ms-2">
              Cancel
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Confirmation Box for submitting the notification */}
      <ConfirmationBox
        show={showConfirmation}
        handleClose={() => setShowConfirmation(false)}
        handleConfirm={handleConfirm}
        title="Confirm Submission"
        message="Are you sure you want to submit this notification?"
      />
    </>
  );
};

export default AddNotificationModal;
