import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Col, Row } from 'react-bootstrap'
import StudentLiveStream from '../../components/StudentLiveStream.jsx'
import Chat from '../../components/Chat.jsx'
import StudentLayout from '../../components/StudentComponents/StudentLayout.jsx'

function CourseLiveScreen() {
  
    const {courseId} = useParams()
    const navigate = useNavigate()
  return (
    <div>
     <StudentLayout>
<Row>
  <Col md={8}>
      <StudentLiveStream courseId={courseId} /> 
  </Col>
   <Col md={3}>
    <Chat courseId={courseId} role='student' />
   </Col>
</Row>
</StudentLayout>
    </div>
  )
}

export default CourseLiveScreen
