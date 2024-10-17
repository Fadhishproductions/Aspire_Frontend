import React from 'react';
import { Card, Row, Col, Container, Spinner, Alert } from 'react-bootstrap';
import { useGetInstructorStatsQuery } from '../../slices/instructorApiSlice';
// import { useGetInstructorDashboardStatsQuery } from '../slices/instructorApiSlice'; // Assuming we use RTK Query

const InstructorStats = () => {
  const { data: intructorStats, error, isLoading } = useGetInstructorStatsQuery()
  console.log(intructorStats)
  if (isLoading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p>Loading dashboard stats...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error fetching dashboard stats. Please try again later.</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className='text-center'>
              <Card.Title>Total Courses Created</Card.Title>
              <Card.Text>{intructorStats?.totalCourses || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className='text-center'>
              <Card.Title>Total Students Enrolled</Card.Title>
              <Card.Text>{intructorStats?.totalStudents || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className='text-center'>
              <Card.Title>Total Earnings</Card.Title>
              <Card.Text>₹{intructorStats?.totalEarnings?.toLocaleString() || '0'}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InstructorStats;
