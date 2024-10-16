// src/screens/NotFoundScreen.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Navbar } from 'react-bootstrap';

const NotFoundScreen = () => {
  return (
    <Container 
      fluid 
      className="d-flex flex-column align-items-center justify-content-center" 
      style={{ height: '100vh', backgroundColor: '#f8f9fa' }}
    >
      {/* App Name */}
      <Navbar.Brand 
        className="mb-4" 
        style={{ fontSize: '4rem', fontWeight: '800', color: '#007bff' }}
      >
        Aspire
      </Navbar.Brand>

      <Row>
        <Col className="text-center">
          <h1 className="display-1" style={{ fontSize: '7rem', fontWeight: '700', color: '#343a40' }}>404</h1>
          <h2 style={{ fontSize: '2.5rem', color: '#6c757d' }}>Oops! Page Not Found</h2>
          <p style={{ fontSize: '1.25rem', color: '#6c757d' }} className="mb-4">
            Sorry, the page you’re looking for doesn’t exist. It might have been removed or the URL might be incorrect.
          </p>
          <Link to="/">
            <Button variant="primary" style={{ padding: '0.75rem 1.5rem', fontSize: '1.25rem' }}>
              Go to Home
            </Button>
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFoundScreen;
