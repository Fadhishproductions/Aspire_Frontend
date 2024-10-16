import React, { useState } from 'react';
import { Table, Container, Spinner, Alert, Pagination, Row, Col } from 'react-bootstrap';
import { useGetInstructorEarningsQuery } from '../../slices/instructorApiSlice';
 
const InstructorEarningsBreakdown = () => {
  const [page, setPage] = useState(1); // To track the current page
  const limit = 5; // Limit for number of courses per page
  const { data: earningsData, error, isLoading } = useGetInstructorEarningsQuery({ page, limit });

  // Handle page change
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading earnings data...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error fetching earnings data. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Course Earnings</h2>
        </Col>
      </Row>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Course Name</th>
            <th>Total Earnings</th>
            <th>Total Students Enrolled</th>
            <th>Last Enrollment Date</th>
          </tr>
        </thead>
        <tbody>
          {earningsData.courses.map((course) => (
            <tr key={course.courseId}>
              <td>{course.courseName}</td>
              <td>₹{course.totalEarnings?.toLocaleString()}</td>
              <td>{course.totalStudents}</td>
              <td>{new Date(course.lastEnrollmentDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Pagination */}
      <Pagination className="justify-content-center">
        {[...Array(earningsData.totalPages).keys()].map((x) => (
          <Pagination.Item
            key={x + 1}
            active={x + 1 === page}
            onClick={() => handlePageChange(x + 1)}
          >
            {x + 1}
          </Pagination.Item>
        ))}
      </Pagination>
    </Container>
  );
};

export default InstructorEarningsBreakdown;
