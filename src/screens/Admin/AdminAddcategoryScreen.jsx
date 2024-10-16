import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Form, Button, Container } from 'react-bootstrap';
import { useAddCategoryMutation } from '../../slices/adminApiSlice';
import Loader from '../../components/Loader';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ConfirmationBox from '../../components/ConfirmationBox'; 

function AdminAddcategoryScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [showAddCategoryConfirmation, setShowAddCategoryConfirmation] = useState(false); // More descriptive state name
  const [addCategory, { isLoading }] = useAddCategoryMutation();
  const navigate = useNavigate();

  const validateForm = () => {
    let formErrors = {};
    if (!name.trim()) {
      formErrors.name = 'Category name is required.';
    }
    if (!description.trim()) {
      formErrors.description = 'Category description is required.';
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setShowAddCategoryConfirmation(true); // Show confirmation modal
    }
  };

  const handleConfirm = async () => {
    setShowAddCategoryConfirmation(false); // Hide confirmation modal
    try {
      await addCategory({ name, description }).unwrap(); // Add category
      toast.success('Category added successfully');
      navigate('/admin/categories');
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'An error occurred while adding category');
    }
  };

  return (
    <AdminLayout>
      <Container className="mt-4">
        <h2>Add New Category</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCategoryName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              isInvalid={!!errors.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formCategoryDescription" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter category description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" disabled={isLoading}>
            Add Category
          </Button>
          {isLoading && <Loader />}
        </Form>
        
        {/* Confirmation Box for adding new category */}
        <ConfirmationBox
          show={showAddCategoryConfirmation}
          handleClose={() => setShowAddCategoryConfirmation(false)} // Close modal
          handleConfirm={handleConfirm} // Confirm action
          title="Add New Category"
          message="Are you sure you want to add this new category?"
        />
      </Container>
    </AdminLayout>
  );
}

export default AdminAddcategoryScreen;
