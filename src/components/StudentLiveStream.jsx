import React, { useEffect, useState } from 'react';
import {
  StreamCall,
  LivestreamLayout,
  StreamVideo,
  StreamVideoClient
} from '@stream-io/video-react-sdk';
import '@stream-io/video-react-sdk/dist/css/styles.css';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhoneSlash } from '@fortawesome/free-solid-svg-icons';
import { useGetCourseQuery } from '../slices/userApiSlice'; // Import the course query
import { useSocket } from '../context/SocketContext';  // Import the socket

function StudentLiveStream({ courseId }) {
  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(false); // Local state to track if the stream is live
  const [instructorEnded, setInstructorEnded] = useState(false); // New state for tracking if instructor ended the live stream
  const socket = useSocket(); // Get the socket instance

  const apiKey = "mmhfdzb5evj2";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0dlbmVyYWxfVmVlcnMiLCJ1c2VyX2lkIjoiR2VuZXJhbF9WZWVycyIsInZhbGlkaXR5X2luX3NlY29uZHMiOjYwNDgwMCwiaWF0IjoxNzI4NTY1ODg1LCJleHAiOjE3MjkxNzA2ODV9.1LDLpQdD8o8hmvt56KPFBOBvjYceR-SBkP7Y6eWJDwA";
  const userId = "General_Veers";
  const callId = "uDShwfvZ6uhJ";

  const user = {
    id: userId,
    name: userInfo.name,
    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
  };

  // Fetch course details using courseId to get live status
  const { data: course, isLoading: isCourseLoading, error: courseError } = useGetCourseQuery({ id: courseId });

  const client = StreamVideoClient.getOrCreateInstance({ apiKey, user, token });
  const call = client.call('livestream', callId);

  // Handle live status changes via socket
  useEffect(() => {
    if (course) {
      setIsLive(course.isLive); // Set the isLive status from the course details
    }

    if (socket) {
      socket.emit('joinRoom', courseId);

      socket.on('live-status-changed', (data) => {
        if (data.courseId === courseId) {
          setIsLive(data.isLive);
          if (!data.isLive) {
            setInstructorEnded(true); // Set state when instructor stops the live stream
          }
        }
      });

      return () => {
        socket.emit('leaveRoom', courseId);
        socket.off('live-status-changed');
      };
    }
  }, [courseId, course, socket]);

  // Only join the call if `isLive` is true
  useEffect(() => {
    if (isLive) {
      const joinCall = async () => {
        try {
          await call.join();
        } catch (error) {
          console.error("Error joining call:", error);
        }
      };
      joinCall();
    }

    return () => {
      if (isLive) {
        call.leave().catch((error) => {
          console.error("Error leaving call:", error);
        });
      }
    };
  }, [isLive, call]);

  const handleLeave = () => {
    navigate(-1); // Navigate to the previous page
  };

  // Render Attend Live Class button or loading/error states
  if (isCourseLoading) {
    return <Alert variant="info">Loading course details...</Alert>;
  }

  if (courseError) {
    return <Alert variant="danger">Error loading course: {courseError.message}</Alert>;
  }

  return (
    <Container fluid className="d-flex justify-content-center align-items-center mt-4">
      <Row className="w-100 border">
        <Col className="bg-light rounded shadow p-2 d-flex flex-column align-items-center" style={{ height: '470px', width: '700px' }}>
          
          {isLive ? (
            <StreamVideo client={client} style={{ width: '100%', height: '100%' }}>
              <StreamCall call={call}>
                <LivestreamLayout
                  showParticipantCount={true}
                  showDuration={true}
                  showLiveBadge={true}
                />
              </StreamCall>
            </StreamVideo>
          ) : instructorEnded ? (
            <Alert variant="warning" className="text-center w-100">
               instructor 
            </Alert>
          ) : (
            <Alert variant="info" className="text-center w-100">
              The instructor hasn't started the stream yet.
            </Alert>
          )}

          <div className="d-flex justify-content-center mt-2">
            <Button
              variant="danger"
              onClick={handleLeave}
              className="btn-lg d-flex align-items-center"
            >
              <FontAwesomeIcon icon={faPhoneSlash} />
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default StudentLiveStream;
