import React from 'react';
import { Card, Row, Col, Container, Spinner, Alert } from 'react-bootstrap';
import { useGetStatsQuery } from '../../slices/instructorApiSlice';
// import { useGetInstructorDashboardStatsQuery } from '../slices/instructorApiSlice'; // Assuming we use RTK Query

const InstructorStats = () => {
  const { data: stats, error, isLoading } = useGetStatsQuery()
  console.log(stats)
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
              <Card.Text>{stats?.totalCourses || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className='text-center'>
              <Card.Title>Total Students Enrolled</Card.Title>
              <Card.Text>{stats?.totalUsers || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="mb-4">
            <Card.Body className='text-center'>
              <Card.Title>Total Earnings</Card.Title>
              <Card.Text>₹{stats?.totalRevenue?.toLocaleString() || '0'}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default InstructorStats;
