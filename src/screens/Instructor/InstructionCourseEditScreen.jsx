import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import InstructorLayout from '../../components/InstructorLayout';
import FormContainer from '../../components/FormContainer';
import { useLocation } from 'react-router-dom';
import { useGetCategoriessQuery, useEditCourseMutation, useGetCourseQuery } from '../../slices/instructorApiSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loader from '../../components/Loader';
import ConfirmationBox from '../../components/ConfirmationBox'; // Import ConfirmationBox

function InstructionCourseEditScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false); // State to manage confirmation modal
  const [confirmationCallback, setConfirmationCallback] = useState(null); // Callback to run after confirming

  const { data: categories } = useGetCategoriessQuery();
  const [editCourse, { isLoading }] = useEditCourseMutation();
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const { data: currentCourse } = useGetCourseQuery({ id });

  useEffect(() => {
    if (currentCourse) {
      setTitle(currentCourse.title);
      setDescription(currentCourse.description);
      setCategory(currentCourse.category);
      setLevel(currentCourse.level);
      setPrice(currentCourse.price);
      if (currentCourse.coverImage) {
        setImageUrl(currentCourse.coverImage);
      }
    }
  }, [currentCourse]);

  const handleImageUpload = async (imageFile) => {
    if (!imageFile) return '';

    const formData = new FormData();
    formData.append('file', imageFile);
    formData.append('upload_preset', 'ogirxwal');
    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/dtdanu3ez/image/upload`,
        formData
      );
      return response.data.secure_url;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Image upload failed');
      return '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isNaN(price) || parseFloat(price) <= 0) {
      toast.error('Price must be a positive number');
      return;
    }

    // Trigger confirmation modal instead of JavaScript confirm
    setConfirmationCallback(() => handleConfirm);
    setShowConfirmation(true);
  };

  const handleConfirm = async () => {
    try {
      let imageUrl = '';
      if (image) {
        imageUrl = await handleImageUpload(image);
      }

      const data = {
        title,
        description,
        category,
        level,
        price,
        coverImage: imageUrl || currentCourse.coverImage,
      };

      await editCourse({ id, data }).unwrap();
      toast.success('Course edited successfully');
      navigate('/instructor/courses');
    } catch (error) {
      toast.error(error?.data?.message || 'An error occurred while editing the course');
    }
  };

  return (
    <InstructorLayout currentPage="courses">
      <FormContainer>
        <h1 style={{ display: 'flex', justifyContent: 'center' }}>Edit Course</h1>

        <Form.Group className="my-2" controlId="image">
          <img
            alt="Cover Pic"
            width="200px"
            height="200px"
            src={image ? URL.createObjectURL(image) : imageUrl}
            style={{
              width: '200px',
              height: '200px',
              borderRadius: '10%',
              objectFit: 'cover',
              display: 'block',
              margin: '0 auto',
              backgroundColor: 'grey',
            }}
          />
        </Form.Group>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="title" className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter course title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="description" className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter course description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="category" className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              as="select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="level" className="mb-3">
            <Form.Label>Level</Form.Label>
            <Form.Control
              as="select"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="" disabled>
                Select any level
              </option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="expert">Expert</option>
              <option value="professional-certification">Professional/Certification</option>
              <option value="refresher">Refresher</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="price" className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter course price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="my-2" controlId="image">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          {isLoading && <Loader />}
          <Button type="submit" variant="primary">
            Edit
          </Button>
        </Form>

        {/* Confirmation Box for edit action */}
        <ConfirmationBox
          show={showConfirmation}
          handleClose={() => setShowConfirmation(false)}
          handleConfirm={confirmationCallback}
          title="Edit Course"
          message="Are you sure you want to edit this course?"
        />
      </FormContainer>
    </InstructorLayout>
  );
}

export default InstructionCourseEditScreen;
