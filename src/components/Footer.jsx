import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer style={footerStyle}>
      <Container fluid className='py-2'>
        <Row className='align-items-center '>
           <Col  className='text-center  '>
            <div style={{   alignItems: 'center' }}>
              <span style={aspireTextStyle}>Aspire</span>
              <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#fff', marginLeft: '10px' }}>
                Virtual Class Room
              </span>
            </div>
          </Col>
        </Row>

        <Row>
          {/* Links */}
          <Col  className='text-center text-md-right'>
            <a href="/careers" style={linkStyle}>Careers</a>
            <span style={{ margin: '0 10px', color: '#ccc' }}>|</span>
            <a href="/privacy-policy" style={linkStyle}>Privacy Policy</a>
            <span style={{ margin: '0 10px', color: '#ccc' }}>|</span>
            <a href="/terms-conditions" style={linkStyle}>Terms & Conditions</a>
          </Col>
        </Row>

        <Row className='mt-3'>
          <Col className='text-center' style={{ color: '#ccc', fontSize: '0.9rem' }}>
            &copy; 2024 Fadhish Productions.
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

// Styles for footer and links
const footerStyle = {
  backgroundColor: '#2c2c54', // Dark background color similar to the image
  color: '#fff',
};

const aspireTextStyle = {
  fontFamily: "'Montserrat', sans-serif", // Use a bold sans-serif font
  fontWeight: 'bold',
  fontSize: '1.5rem', // Adjust font size
  color: '#fff', // White text
};

const linkStyle = {
  color: '#bbb',
  textDecoration: 'none',
  fontSize: '0.9rem',
};

export default Footer;
