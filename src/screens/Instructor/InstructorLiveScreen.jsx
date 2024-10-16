import React from 'react'
import { useParams } from 'react-router-dom'
import InstructorLiveStream from '../../components/InstructorLiveStream.jsx'
import InstructorLayout from '../../components/InstructorLayout.jsx'
import { Col, Row } from 'react-bootstrap'
import Chat from '../../components/Chat.jsx'
 
function InstructorLiveScreen() {
    const {courseId} = useParams()
    return (
    <div>
      <InstructorLayout currentPage={"courses"}>
       <Row>
        <Col md={8}>
        <InstructorLiveStream courseId={courseId} />
        </Col>
        <Col md={4}>
           <Chat  role='instructor' courseId={courseId} />
        </Col>
       </Row>
      
      </InstructorLayout>
     </div>
  )
}

export default InstructorLiveScreen
