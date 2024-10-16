// import React, { useEffect,useState , useRef } from 'react' 
// import '@stream-io/video-react-sdk/dist/css/styles.css';
// import { CallingState,  StreamCall, StreamVideo, StreamVideoClient, useCall, useCallStateHooks} from '@stream-io/video-react-sdk';
// import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';
// import { Button, Spinner, Container, Row, Col } from 'react-bootstrap';
// import { useDispatch, useSelector } from 'react-redux'; 

// function InstructorLiveStream({courseId}) {
 
// const instructorInfo = useSelector((state) => state.instructorauth.instructorInfo);
// const dispatch = useDispatch() 
// const apiKey = "mmhfdzb5evj2";
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0dyZWVkbyIsInVzZXJfaWQiOiJHcmVlZG8iLCJ2YWxpZGl0eV9pbl9zZWNvbmRzIjo2MDQ4MDAsImlhdCI6MTcyODQwMTU0MCwiZXhwIjoxNzI5MDA2MzQwfQ.cFDHnR5bLZwh2lTUtZH04fMj8P25rwrxl3tP-M_Lgvc";
// const userId = "Greedo";
// const callId = "QGBQWIUBESGh";
// const user  = {
//   id: userId,
//   name: instructorInfo.name || 'instructor' ,
//   image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
// };

 // const client = StreamVideoClient.getOrCreateInstance({ apiKey, user, token });

// const call = client.call('livestream', callId);
// // call.join({ create: true });
// const hasJoined = useRef(false);
// const [isLive, setIsLive] = useState(false);
// const [loading, setLoading] = useState(true);
// useEffect(() => {
//   const joinCall = async () => {
//     if (!hasJoined.current && call) {
//       try {
//         await call.join({ create: true });
//         hasJoined.current = true;
       
//         setLoading(false); // Set loading to false once joined
//       } catch (error) {
//         console.error('Error joining call:', error);
//         setLoading(false); // Ensure loading is disabled on error
//       }
//     }
//   };

//   joinCall();

//   return () => {
//     if (hasJoined.current && call) {
//       call.endCall().catch((error) => {
//         console.error('Error ending call:', error);
//       });
//       hasJoined.current = false;
//     } 
//     dispatch(removeLiveStream(courseId))
//   };
// }, [callId, call ]);

// return (
//   <Container fluid className="mt-4">
//     {loading ? (
//       <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
//         <Spinner animation="border" variant="primary" />
//       </div>
//     ) : (
//       <StreamVideo client={client}>
//         <StreamCall call={call}>
//           <MyUILayout call={call} isLive={isLive} setIsLive={setIsLive} courseId={courseId} />
//         </StreamCall>
//       </StreamVideo>
//     )}
//   </Container>
// );
// }

// export default InstructorLiveStream;

// import { ParticipantView } from '@stream-io/video-react-sdk';
// import { removeLiveStream } from '../slices/userCourseSlice';
// import { useSocket } from '../context/SocketContext';
// export const MyUILayout = ({ call, isLive, setIsLive , courseId }) => { 
// const socket = useSocket()
// const { useCameraState, useMicrophoneState, useParticipantCount, useParticipants , useCallCallingState } = useCallStateHooks();
// const { camera: cam, isMute: isCamMuted } = useCameraState();
// const { microphone: mic, isMute: isMicMuted } = useMicrophoneState();
// const participantCount = useParticipantCount();
// const [firstParticipant] = useParticipants(); 
// const callingState = useCallCallingState()
// console.log(callingState,"useCallCallingState")

// useEffect(() => {
//   // Join the course room when the component mounts
//   socket.emit('joinRoom', courseId); 
//   return () => {
//     socket.emit('leaveRoom', courseId);
//   };
// }, [courseId]);

// const handleGoLive = async () => {
//   if (!isLive) {
//     try {
//       await call.goLive();
//       setIsLive(true); 
//       socket.emit('start-live', courseId);
//      } catch (error) {
//       console.error('Error starting live stream:', error);
//     }
//   }
// };

// const handleStopLive = async () => {
//   try {
//     await call.stopLive();
//     setIsLive(false);
//     socket.emit('stop-live', courseId);
//   } catch (error) {
//     console.error('Error stopping live stream:', error);
//   }
// };

// const handleToggleCamera = async () => {
//   try {
//     cam.toggle()
//   } catch (error) {
//     console.error('Error toggling camera:', error.message || error);
//   }
// };

// return (
//   <Container className="mt-4">
//     <Row className="justify-content-center mb-2">
//     <Col  className="p-2 bg-light rounded">
//   <div className="d-flex justify-content-start">
//     <div className="bg-primary text-white py-1 px-3 rounded">
//       {isLive ? `Live: ${participantCount}` : `In Backstage`}
//     </div>
//   </div>
//   <div className="text-center ">
//     <h5>
//       Live {callingState}
//     </h5>
//   </div>
// </Col>
//     </Row>

//     <Row className="justify-content-center">
//       <Col >
//       {firstParticipant ? (
//   <div className="video-container mb-4" style={{ width: '100%', height: '350px' }}>
//     <ParticipantView 
//       participant={firstParticipant} 
//       style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
//     />
//   </div>
// ) : (
//   <div className="alert alert-info d-flex justify-content-center align-items-center" style={{ width: '100%', height: '350px' }}>
//     <h5 className="text-center">The host hasn't joined yet</h5>
//   </div>
// )}

//         <div className="d-flex justify-content-around">
//           {/* Live/Stop Button */}
//           <Button variant={isLive ? "danger" : "success"} onClick={() => (isLive ? handleStopLive() : handleGoLive())}>
//             {isLive ? 'Stop Live' : 'Go Live'}
//           </Button>

//           {/* Toggle Camera */}
//           <Button
//       variant={!isCamMuted ? "secondary" : "primary"}
//       onClick={()=>cam.toggle()}
//     >
//       {!isCamMuted ? <FaVideoSlash /> : <FaVideo />} {!isCamMuted ? 'Disable Camera' : 'Enable Camera'}
//     </Button>
//           {/* Toggle Microphone */}
//           <Button
//             variant={!isMicMuted ? "secondary" : "primary"}
//             onClick={async () => {
//               try {
//                 await mic.toggle();
//               } catch (error) {
//                 console.error('Error toggling microphone:', error.message || error);
//               }
//             }}
//           >
//             {!isMicMuted ? <FaMicrophoneSlash /> : <FaMicrophone />} {!isMicMuted ? 'Mute Mic' : 'Unmute Mic'}
//           </Button>
//         </div>
//       </Col>
//     </Row>
//   </Container>
// );
// }


import React, { useEffect, useRef } from 'react';
import {
  StreamVideoClient,
  StreamVideo, 
  StreamCall,
  useCall,
} from "@stream-io/video-react-sdk";
  

export default function InstructorLiveStream({courseId}) {
  const apiKey = "mmhfdzb5evj2";
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL3Byb250by5nZXRzdHJlYW0uaW8iLCJzdWIiOiJ1c2VyL0dlbmVyYWxfVmVlcnMiLCJ1c2VyX2lkIjoiR2VuZXJhbF9WZWVycyIsInZhbGlkaXR5X2luX3NlY29uZHMiOjYwNDgwMCwiaWF0IjoxNzI4NTY1ODg1LCJleHAiOjE3MjkxNzA2ODV9.1LDLpQdD8o8hmvt56KPFBOBvjYceR-SBkP7Y6eWJDwA";
  const userId = "General_Veers";
  const callId = "uDShwfvZ6uhJ";
  
  const user = { id: userId, name: "Instructor" };
  const client = new StreamVideoClient({ apiKey, user, token }); 
  const call = client.call("livestream", callId);
  const hasJoined = useRef(false);

  useEffect(() => { 
    const joinCall = async () => {
      if (!hasJoined.current && call) {
        try {
          await call.microphone.enable();
          await call.join({ create: true });
          hasJoined.current = true;
        } catch (error) {
          console.error("Error joining call:", error);
        }
      }
    };

    joinCall();

    return () => {
      if (hasJoined.current && call) {
        call.endCall().catch((error) => {
          console.error("Error ending call:", error);
        });
        hasJoined.current = false;
      }
    };
  }, [callId, call]);
  return (
    <StreamVideo client={client}>
      {call && (
      <StreamCall call={call}>
        <LivestreamView call={call}  courseId={courseId}/> {/* Pass the `call` prop to LivestreamView */}
      </StreamCall>
      )}
    </StreamVideo>
  );
}

import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from 'react-icons/fa';
import { ParticipantView, useCallStateHooks } from '@stream-io/video-react-sdk'; 
import { Button, Col, Container, Row } from 'react-bootstrap';
import { useSocket } from '../context/SocketContext';
import { useNavigate } from 'react-router-dom';
export const LivestreamView = ({courseId}) => {  
  useEffect(() => {
    // Join the course room when the component mounts
  socket.emit('joinRoom', courseId); 
  return () => {
    socket.emit('leaveRoom', courseId);
                    socket.emit('stop-live', courseId);

  };
}, [courseId]); 
const {
  useCameraState,
  useMicrophoneState,
  useParticipantCount,
  useIsCallLive,
  useParticipants,
} = useCallStateHooks();
const call = useCall();
const { camera: cam, isEnabled: isCamEnabled } = useCameraState();
const { microphone: mic, isEnabled: isMicEnabled } = useMicrophoneState();
const socket = useSocket()
const navigate = useNavigate() 
  const participantCount = useParticipantCount();
  const isLive = useIsCallLive(); 
  const [firstParticipant] = useParticipants(); 

  return (
    <div style={{ display: "flex", flexDirection: 'column', gap: '4px' }}>
      <Container className="mt-4">
        <Row className="justify-content-center mb-2">
          <Col  className="p-2 bg-light rounded">
           <div className="d-flex justify-content-start">
             <div className="bg-primary text-white py-1 px-3 rounded">
               {isLive ? `Live: ${participantCount}`: `In Backstage`}
               {}
             </div>
            </div>
          </Col>
        </Row> 
      </Container>
      {firstParticipant ? (
         <div className="video-container mb-4" style={{ width: '100%', height: '400px' }}>
           <ParticipantView participant={firstParticipant} />
         </div>
      ) : (
        <div className="alert alert-info d-flex justify-content-center align-items-center" style={{ width: '100%', height: '350px' }}>
          <h5 className="text-center">The host hasn't joined yet</h5>
        </div>     
       )}
      
        <div style={{ display: 'flex', gap: '4px', justifyContent: 'center', marginTop: '20px', marginBottom:'20px' }}>
        <Button className={`btn btn-${isLive ? 'danger' : 'success'} btn-circle`}  onClick={() => {
            if (call) {
              if (!isLive) {
                socket.emit('start-live', courseId);
                 call
                  ?.join()
                  .catch((error) => console.error("Error joining call:", error));
                call
                  ?.goLive()
                  .catch((error) => console.error("Error going live:", error));
              } else {
                navigate(-1);
                socket.emit('stop-live', courseId);
                 call
                  ?.endCall() 
                  .catch((error) => {
                    console.error("Error ending call:", error);
                  });
              }
            }
          }}>
          {isLive ? "Stop Live" : "Go Live"}
        </Button>
  <Button
    className={`btn btn-${isCamEnabled ? 'danger' : 'success'} btn-circle`}
    style={{ borderRadius: '50%', padding: '10px 16px', fontSize: '20px' }}
    onClick={() => cam.toggle()}
  >
    {isCamEnabled ? <FaVideoSlash /> : <FaVideo />}
  </Button>

  <Button
    className={`btn btn-${isMicEnabled ? 'danger' : 'success'} btn-circle`}
    style={{ borderRadius: '50%', padding: '10px 16px', fontSize: '20px' }}
    onClick={() => mic.toggle()}
  >
    {isMicEnabled ? <FaMicrophoneSlash /> : <FaMicrophone />}
  </Button>
</div> 
    </div>
  );
};

 
