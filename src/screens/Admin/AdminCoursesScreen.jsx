import React, { useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { Container, Table, Row, Col, Button, Form, Spinner } from 'react-bootstrap';
import { useGetCategoriesQuery, useGetCoursesQuery } from '../../slices/adminApiSlice';  

function AdminCoursesScreen() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [level, setLevel] = useState('');
  const [sort, setSort] = useState('recentCourses');
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);

  // Using RTK Query to fetch courses
  const { data, isLoading, isError, error } = useGetCoursesQuery({
    searchTerm: search,
    category,
    level,
    sort,
    page,
    limit,
  });
  const { data: categories = [], isLoading:categoryLoading, error:categoryError, refetch } = useGetCategoriesQuery();


  const courses = data?.courses || [];
  const totalPages = data?.totalPages || 1;

  return (
    <AdminLayout>
      <Container>
        <Row className="mt-3">
          <Col>
            <h2>Admin Courses Management</h2>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={6}>
            <Form.Control
              type="text"
              placeholder="Search by course name"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </Col>
          <Col md={3}>
            <Form.Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {/* Add category options dynamically here */}
              {categories?.map((category)=>(
                <option value={category._id}>{category.name}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select value={level} onChange={(e) => setLevel(e.target.value)}>
              <option value="">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
              <option value="Professional-certification">Professional/Certification</option>
              <option value="Refresher">Refresher</option>
            </Form.Select>
          </Col>
        </Row>
        <Row className="mt-3">
          <Col md={3}>
            <Form.Select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="recentCourses">Recent Courses</option>
              <option value="nameAsc">Name Ascending</option>
              <option value="nameDesc">Name Descending</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select value={limit} onChange={(e) => setLimit(e.target.value)}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </Form.Select>
          </Col>
        </Row>

        {/* Loading and Error States */}
        {isLoading ? (
          <Spinner animation="border" />
        ) : isError ? (
          <div>{error?.data?.message || 'Error fetching courses'}</div>
        ) : (
          <>
            {Array.isArray(courses) && courses.length > 0 ? (
              <Table striped bordered hover responsive  className="table-sm mt-3">
                <thead>
                  <tr>
                    <th>Course Name</th>
                    <th>Instructor</th>
                    <th>Category</th>
                    <th>Level</th>
                    <th>Created At</th>
                    <th>Status</th>
                   </tr>
                </thead>
                <tbody>
                  {courses.map((course) => (
                    <tr key={course._id}>
                      <td>{course.title}</td>
                      <td>{course.instructor?.name}</td>
                      <td>{course.category?.name}</td>
                      <td>{course.level}</td>
                      <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                      <td>{course.published ? 'Published' : 'Unpublished'}</td>
                     </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div>No courses found</div>
            )}
          </>
        )}

        {/* Pagination */}
        <Row className="mt-3">
          <Col className="d-flex justify-content-center">
            {[...Array(totalPages).keys()].map((x) => (
              <Button
                key={x + 1}
                variant={x + 1 === page ? 'primary' : 'light'}
                onClick={() => setPage(x + 1)}
                className="mx-1"
              >
                {x + 1}
              </Button>
            ))}
          </Col>
        </Row>
      </Container>
    </AdminLayout>
  );
}

export default AdminCoursesScreen;
