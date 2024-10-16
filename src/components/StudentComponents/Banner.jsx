import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

// Google Fonts - Example: Import via index.html or dynamically in the component
// <link href="https://fonts.googleapis.com/css2?family=Lora:wght@700&family=Open+Sans:wght@400;600&display=swap" rel="stylesheet">

const Banner = () => {
  return (
    <Container fluid className='py-5' style={{ backgroundColor: '#f3f4f6' }}>
      <Row className='pb-4'>
        <Col className='bg-white p-4 mx-5 rounded shadow' md={6} sm={8} lg={5}>
          <h2 style={{
            fontFamily: "'Lora', serif",
            fontWeight: 700,
            fontSize: '2rem',
            color: '#2c3e50',
            marginBottom: '15px',
            marginLeft:'5px'
           }}>
            Learning for All
          </h2>
          <p style={{
            fontFamily: "'Open Sans', sans-serif",
            fontSize: '1rem',
            color: '#34495e',
            lineHeight: '1.8',
           }}>
            With thousands of expert-led courses, ASPIRE empowers you to reach your goals—whether you're aiming 
            to advance your career, develop new skills, or simply pursue your passions. From professional 
            development to personal growth, we've got you covered.
          </p>
          <p style={{
            fontFamily: "'Open Sans', sans-serif",
            fontWeight: 600,
            fontSize: '1.2rem',
            color: '#2F327D', 
            marginTop: '15px'
          }}>
            Join Now and Unlock Your Full Potential..!
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Banner;
