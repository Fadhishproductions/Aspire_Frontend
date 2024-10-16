import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetCoursesQuery } from '../slices/userApiSlice';
import Sidebar from '../components/Sidebar';
import Card from '../components/Card';
import { Container, Row, Col, Pagination } from 'react-bootstrap';
import { clearFilters } from '../slices/coursesSlice';
import { useLocation, useNavigate } from 'react-router-dom';
import FormContainer from '../components/FormContainer';
import StudentLayout from '../components/StudentComponents/StudentLayout';
import Loader from '../components/Loader';
import { Alert } from 'react-bootstrap';

const CoursesScreen = () => {
  const searchTerm = useSelector((state) => state.courses.searchTerm);
  const filter = useSelector((state) => state.courses.filter);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const { data, isLoading, error } = useGetCoursesQuery({
    searchTerm,
    category: filter.category,
    level: filter.level,
    sort: filter.sort,
    page: currentPage,
    limit,
  });

  const courses = data?.courses || [];
  const totalPages = data?.totalPages || 1;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filter]);

  useEffect(() => {
    return () => {
      dispatch(clearFilters());
    };
  }, [location, dispatch]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <StudentLayout>
      <Container fluid>
        <Row>
          <Col md={3}>
            <Sidebar />
          </Col>
          <Col md={9}>
            {/* Handle loading and error inside the content area */}
            {isLoading ? (
              <Loader />
            ) : error ? (
              <Alert variant="danger" className="text-center">
                {error?.data?.message || 'An error occurred'}
              </Alert>
            ) : courses.length > 0 ? (
              <Row>
                {courses.map((course) => (
                  <Card
                    key={course._id}
                    image={course.coverImage || 'https://via.placeholder.com/300'}
                    title={course.title}
                    category={course.category.name}
                    price={course.price}
                    level={course.level}
                    instructor={{
                      name: course.instructor.name,
                      imageUrl: course.instructor.imageUrl,
                    }}
                    onClick={() => navigate(`/course/${course._id}`)}
                  />
                ))}
              </Row>
            ) : (
              <div className="text-center w-100">
                <FormContainer>
                  <h4>No courses available</h4>
                </FormContainer>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination className="mt-3">
                {[...Array(totalPages).keys()].map((page) => (
                  <Pagination.Item
                    className="me-2"
                    key={page + 1}
                    active={page + 1 === currentPage}
                    onClick={() => handlePageChange(page + 1)}
                  >
                    {page + 1}
                  </Pagination.Item>
                ))}
              </Pagination>
            )}
          </Col>
        </Row>
      </Container>
    </StudentLayout>
  );
};

export default CoursesScreen;
