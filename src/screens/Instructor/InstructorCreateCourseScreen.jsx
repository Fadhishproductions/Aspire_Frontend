import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import InstructorLayout from '../../components/InstructorLayout';
import FormContainer from '../../components/FormContainer';
import { useSelector } from 'react-redux';
import { useGetCategoriessQuery, useInstructorCreateCourseMutation } from '../../slices/instructorApiSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Loader from '../../components/Loader';
import ConfirmationBox from '../../components/ConfirmationBox'
import {handleImageUpload} from '../../Utils/uploadMedia'
function InstructorCreateCourseScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false); // State to show/hide confirmation modal
  const [confirmedAction, setConfirmedAction] = useState(null); // State to track the confirmed action

  const instructorInfo = useSelector((state) => state.instructorauth.instructorInfo);
  const { data: categories } = useGetCategoriessQuery()
  const instructor = instructorInfo._id;
  const [createCourse, { isLoading }] = useInstructorCreateCourseMutation();
  const navigate = useNavigate();

  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!title.trim() || !description.trim() || !category || !level || !price || !image) {
      toast.error('All fields are required');
      return;
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      toast.error('Price must be a positive number');
      return;
    }

    // Show confirmation modal
    setShowConfirmation(true);
    setConfirmedAction(() => async () => {
      try {
        let imageUrl = '';
        if (image) {
          imageUrl = await handleImageUpload(image);
        }

        const courseData = {
          title,
          description,
          category,
          instructor,
          level,
          price,
          coverImage: imageUrl
        };

        await createCourse(courseData).unwrap();
        toast.success('Course created successfully');
        navigate('/instructor/courses');
      } catch (error) {
        toast.error(error?.data?.message || 'An error occurred while creating the course');
      }
    });
  };

  const handleConfirm = () => {
    if (confirmedAction) {
      confirmedAction(); // Call the confirmed action
    }
    setShowConfirmation(false); // Close the confirmation modal
  };

  const handleClose = () => {
    setShowConfirmation(false); // Close the confirmation modal without doing anything
  };

  return (
    <InstructorLayout currentPage="courses">
      <FormContainer>
        <h1 style={{ display: "flex", justifyContent: "center" }}>Add Course</h1>

        <Form.Group className='my-2' controlId='image'>
          <img
            alt="Cover Pic"
            width="200px"
            height="200px"
            src={image ? URL.createObjectURL(image) : ""}
            style={{ width: '200px', height: '200px', borderRadius: '10%', objectFit: 'cover', display: 'block', margin: '0 auto', backgroundColor: 'grey' }}
          />
        </Form.Group>

        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='title' className='mb-3'>
            <Form.Label>Title</Form.Label>
            <Form.Control
              type='text'
              placeholder='Enter course title'
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='description' className='mb-3'>
            <Form.Label>Description</Form.Label>
            <Form.Control
              as='textarea'
              rows={3}
              placeholder='Enter course description'
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId='category' className='mb-3'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              as='select'
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value='' disabled>Select Category</option>
              {categories?.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='level' className='mb-3'>
            <Form.Label>Level</Form.Label>
            <Form.Control
              as='select'
              placeholder='Enter course level'
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="" disabled>Select any level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
              <option value="Professional-certification">Professional/Certification</option>
              <option value="Refresher">Refresher</option>
            </Form.Control>
          </Form.Group>

          <Form.Group controlId='price' className='mb-3'>
            <Form.Label>Price</Form.Label>
            <Form.Control
              type='number'
              placeholder='Enter course price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>

          <Form.Group className='my-2' controlId='image'>
            <Form.Label>Image</Form.Label>
            <Form.Control
              type='file'
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          {isLoading && <Loader />}
          <Button type='submit' variant='primary'>
            Submit
          </Button>
        </Form>

        {/* Confirmation modal */}
        <ConfirmationBox
          show={showConfirmation}
          handleClose={handleClose}
          handleConfirm={handleConfirm}
          title="Confirm Course Creation"
          message="Are you sure you want to create this course?"
        />
      </FormContainer>
    </InstructorLayout>
  );
}

export default InstructorCreateCourseScreen;
