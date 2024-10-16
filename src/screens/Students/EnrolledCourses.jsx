import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Row, Col, Form, Button, Pagination, Container, Alert } from 'react-bootstrap';
import NotificationBox from '../../components/NotificationBox'; 
import { useGetEnrolledCoursesQuery } from '../../slices/userApiSlice';
import StudentLayout from '../../components/StudentComponents/StudentLayout';

function EnrolledCourses() {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 2; // Number of courses per page
  const navigate = useNavigate();

  // Fetch courses with search and pagination parameters
  const { data, error, isLoading } = useGetEnrolledCoursesQuery({ searchTerm, page, limit });
  const courses = data?.courses || [];
  const totalPages = data?.totalPages || 1;

  useEffect(()=>{
    setPage(1);
  },[searchTerm])
  // Handle search form submission
   
  // Handle page navigation
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  return (
    <div>
     <StudentLayout>
      <div className="container mt-4">
        <h1 className="mb-4">Enrolled Courses</h1>
        <NotificationBox />

        {/* Search Form */}
        <Row md={5}>
        <Form   className="mb-4">
          <Form.Group controlId="search">
            <Form.Control
              type="text"
              placeholder="Search courses"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
         </Form>
        </Row>

        {/* Display courses */}
        {isLoading && <p>Loading...</p>}
        {error && <p>Failed to load courses</p>}
        {!isLoading && !error && courses.length === 0 && ( 
          <Container className="mt-5">
            <Alert  >
               No course Found 
              </Alert>
           </Container>)}
        <Row>
          {courses.map((course) => (
            <Col key={course._id} md={4} className="mb-4">
              <Card className="p-1" onClick={() => { navigate(`/enrolled-courses/attend/${course._id}`); }}>
                <Card.Img
                  variant="top"
                  src={course.coverImage || "https://via.placeholder.com/300x200"}
                  alt={course.title}
                  style={{ height: '200px', objectFit: 'cover' }}
                />
                <Card.Body>
                  <Card.Title>{course.title}</Card.Title>
                  <Card.Text>{course.description}</Card.Text>
                  <div className="d-flex align-items-center">
                    <img
                      src={course.instructor.imageUrl || "https://via.placeholder.com/150"}
                      alt={course.instructor.name}
                      className="img-fluid"
                      style={{
                        borderRadius: '50%',
                        width: '30px',
                        height: '30px',
                        objectFit: 'cover',
                      }}
                    />
                    <h5 className="m-2">Instructor:</h5>
                    <p className="mb-0"><strong>{course.instructor.name}</strong></p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Pagination */}
        { courses.length > 0 && (  
        <Pagination className="justify-content-center mt-2">
     <>
      <Pagination.Prev
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
      />
      {Array.from({ length: totalPages }, (_, index) => (
        <Pagination.Item
          key={index + 1}
          active={index + 1 === page}
          onClick={() => handlePageChange(index + 1)}
        >
          {index + 1}
        </Pagination.Item>
      ))}
      <Pagination.Next
        onClick={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
      />
    </>
</Pagination>
        )}

      </div>
    </StudentLayout>
    </div>
  );
}

export default EnrolledCourses;
