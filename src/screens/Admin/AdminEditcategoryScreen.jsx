import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout.jsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import { useEditCategoryMutation, useGetCategoryByIdQuery } from '../../slices/adminApiSlice.js';
import { toast } from 'react-toastify';
import Loader from '../../components/Loader.jsx';
import ConfirmationBox from '../../components/ConfirmationBox'; // Import the confirmation box

function AdminEditCategoryScreen() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [initialName, setInitialName] = useState(''); // Track initial name
  const [initialDescription, setInitialDescription] = useState(''); // Track initial description
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const [errors, setErrors] = useState({});
  const [editCategory, { isLoading }] = useEditCategoryMutation();
  const { data: category, isLoading: isLoadingCategory } = useGetCategoryByIdQuery({ id });
  const navigate = useNavigate();

  // State to manage confirmation modal
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Only consider a change if trimmed values differ
  const isChanged = name.trim() !== initialName.trim() || description.trim() !== initialDescription.trim();

  useEffect(() => {
    if (category) {
      setName(category.name); // No need to trim here
      setDescription(category.description); // No need to trim here
      setInitialName(category.name); // Set the initial value as is
      setInitialDescription(category.description); // Set the initial value as is
    }
  }, [category]);

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
      setShowConfirmation(true); // Show confirmation modal
    }
  };

  const handleConfirm = async () => {
    setShowConfirmation(false); // Hide confirmation modal
    try {
      let data = { name: name.trim(), description: description.trim() }; // Ensure data is trimmed before submitting
      await editCategory({ id, data }).unwrap();
      toast.success('Category edited successfully');
      navigate('/admin/categories');
    } catch (err) {
      toast.error(err?.data?.message || err?.error || 'An error occurred while editing the category');
    }
  };

  if (isLoadingCategory) return <Loader />;

  return (
    <AdminLayout>
      <Container className="mt-4">
        <h2>Edit Category</h2>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formCategoryName" className="mb-3">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)} // Set the raw input value
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
              onChange={(e) => setDescription(e.target.value)} // Set the raw input value
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
          <Button variant="primary" type="submit" disabled={!isChanged || isLoading}>
            Edit Category
          </Button>
          {isLoading && <Loader />}
        </Form>

        {/* Confirmation Box */}
        <ConfirmationBox
          show={showConfirmation}
          handleClose={() => setShowConfirmation(false)} // Close the modal
          handleConfirm={handleConfirm} // Confirm the action
          title="Edit Category"
          message="Are you sure you want to edit this category?"
        />
      </Container>
    </AdminLayout>
  );
}

export default AdminEditCategoryScreen;
