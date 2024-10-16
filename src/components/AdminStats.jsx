import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { useGetStatsQuery } from '../slices/adminApiSlice';

const AdminStats = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { data: statsData } = useGetStatsQuery();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        if (statsData) {
          setStats(statsData);
          setLoading(false);
        }
      } catch (error) {
        setError('Error fetching admin stats');
        setLoading(false);
      }
    };

    fetchStats();
  }, [statsData]);

  if (loading) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="mt-5">
      <Row>
        <Col xs={12} md={3}>
          <Card className="mb-4 text-center d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
            <Card.Body>
              <Card.Title>Total Users</Card.Title>
              <Card.Text>{stats?.totalUsers || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="mb-4 text-center d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
            <Card.Body>
              <Card.Title>Total Instructors</Card.Title>
              <Card.Text>{stats?.totalInstructors || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="mb-4 text-center d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
            <Card.Body>
              <Card.Title>Total Courses</Card.Title>
              <Card.Text>{stats?.totalCourses || 0}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={12} md={3}>
          <Card className="mb-4 text-center d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
            <Card.Body>
              <Card.Title>Total Revenue</Card.Title>
              <Card.Text>₹{stats?.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminStats;
