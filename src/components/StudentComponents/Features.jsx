import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaVideo, FaBookOpen, FaChalkboardTeacher, FaQuestionCircle } from 'react-icons/fa';

const Features = () => {
  return (
    <Container fluid className='p-5' style={{ backgroundColor: '#f3f4f6' }}>
      <Row className='justify-content-center'>
        <Col className='bg-white p-4 mx-5 rounded shadow' md={10} sm={12}>
          <h2 className='text-center mb-5' style={{ fontFamily: "'Lora', serif", fontWeight: 'bold', fontSize: '2.5rem' }}>
            Key Features of ASPIRE
          </h2>

          <Row className='text-center'>
            {/* Feature 1: Create Courses */}
            <Col md={3} sm={6} className='mb-4'>
              <Card className='h-100 shadow-sm'>
                <Card.Body>
                  <FaBookOpen style={iconStyle} />
                  <Card.Title style={cardTitleStyle}>Create Courses</Card.Title>
                  <Card.Text style={cardTextStyle}>
                    Instructors can easily create and manage courses, adding video lectures and learning materials.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Feature 2: Live Classes */}
            <Col md={3} sm={6} className='mb-4'>
              <Card className='h-100 shadow-sm'>
                <Card.Body>
                  <FaVideo style={iconStyle} />
                  <Card.Title style={cardTitleStyle}>Live Classes</Card.Title>
                  <Card.Text style={cardTextStyle}>
                    Engage in real-time interaction with students through live streaming classes.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Feature 3: Quizzes & Assessments */}
            <Col md={3} sm={6} className='mb-4'>
              <Card className='h-100 shadow-sm'>
                <Card.Body>
                  <FaQuestionCircle style={iconStyle} />
                  <Card.Title style={cardTitleStyle}>Quizzes</Card.Title>
                  <Card.Text style={cardTextStyle}>
                    Add quizzes to your courses to students’ progress and reinforce learning.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>

            {/* Feature 4: Instructor-Student Interaction */}
            <Col md={3} sm={6} className='mb-4'>
              <Card className='h-100 shadow-sm'>
                <Card.Body>
                  <FaChalkboardTeacher style={iconStyle} />
                  <Card.Title style={cardTitleStyle}>Instructor-Student Interaction</Card.Title>
                  <Card.Text style={cardTextStyle}>
                    Students can engage with instructors through discussions, live sessions, and notifications.
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

// Inline styles for consistency
const iconStyle = {
  fontSize: '3rem',
  color: '#3498db',
  marginBottom: '15px'
};

const cardTitleStyle = {
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 'bold',
  fontSize: '1.5rem',
  color: '#2c3e50'
};

const cardTextStyle = {
  fontFamily: "'Poppins', sans-serif",
  fontSize: '1rem',
  color: '#7f8c8d'
};

export default Features;
