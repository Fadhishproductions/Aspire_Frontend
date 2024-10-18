import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetCourseProgressQuery,
  useGetCourseQuery,
  useGetQuizQuery,
  useGetSectionsQuery,
  useGetVideoProgressMutation,
  useUpdateVideoProgressMutation,
} from "../../slices/userApiSlice";
import { Row, Col, ListGroup, Card, Button, Container, ProgressBar } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import Loader from "../../components/Loader";
import QuizBox from "../../components/QuizBox"; 
import { useSocket } from "../../context/SocketContext";
import StudentLayout from "../../components/StudentComponents/StudentLayout";

function CourseAttendingScreen() {
  const socket = useSocket()
  const { id } = useParams();
  const courseId = id;
  const navigate = useNavigate(); 
  const { data: sections = [], isLoading, error } = useGetSectionsQuery({ id });
  const { data: course, isLoading: isCourseLoading, error: courseError } = useGetCourseQuery({ id });

  const [selectedVideo, setSelectedVideo] = useState(null);
  const [visibleSectionId, setVisibleSectionId] = useState(null);
  const [currentSection, setCurrentSection] = useState(null);
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [lastWatchedTime, setLastWatchedTime] = useState(null); // Set null to control rendering
  const [lastLoggedPercentage, setLastLoggedPercentage] = useState(0);
  const [isLive, setIsLive] = useState(false);

  const { data: quizData, isLoading: isQuizLoading, isError: isQuizLoadingError } = useGetQuizQuery(currentSection ? { id: currentSection } : null);
  const { data: courseProgress, error :courseProgressError , isLoading :courseProgressLoading } = useGetCourseProgressQuery(courseId)

  const [updateVideoProgress] = useUpdateVideoProgressMutation();
  const [getVideoProgress] = useGetVideoProgressMutation();
 

  const videoRef = useRef(null);


  useEffect(() => {
    if (course) {
      // Update state if course data changes (i.e., when it's first fetched)
      setIsLive(course.isLive);
    }
  }, [course]);

  // Set default video and section on load
  useEffect(() => {
    if (sections.length > 0) {
      const firstSection = sections[0];
      if (firstSection.videos.length > 0) {
        setCurrentSection(firstSection._id);
        setSelectedVideo(firstSection.videos[0]);
      }
    }
  }, [sections]);

  // Fetch quiz data
  useEffect(() => {
    if (quizData) {
      setQuizQuestions(quizData);
    }
  }, [quizData]);

  // Fetch last watched time of the video
  useEffect(() => {
    const fetchVideoProgress = async () => {
      if (selectedVideo && currentSection) {
        try {
          const data = await getVideoProgress({
            courseId,
            sectionId: currentSection,
            videoId: selectedVideo._id,
          }).unwrap();

          if (data && data.lastWatched) {
            setLastWatchedTime(data.lastWatched); // Set the last watched time
          } else {
            setLastWatchedTime(0); // Default to 0 if no last watched time is found
          }
        } catch (error) {
          console.error("Error fetching video progress", error);
          setLastWatchedTime(0); // Default to 0 in case of error
        }
      }
    };

    fetchVideoProgress();
  }, [selectedVideo, currentSection, getVideoProgress, courseId]);


    // Real-time socket listener to update live status
    useEffect(() => {
      if (socket) {
         socket.emit('joinRoom', courseId);
        // Log the live-status-changed event data
        socket.on('live-status-changed', (data) => {
           if (data.courseId === courseId) {
             setIsLive(data.isLive);
          }
        });
        return () => {
          socket.emit('leaveRoom', courseId);
          socket.off('live-status-changed');
        };
      }
    }, [courseId, socket]);
  
    

  // Handle video progress update
  const handleVideoProgress = () => {
    const video = videoRef.current;
    if (video && video.duration) {
      const percentage = (video.currentTime / video.duration) * 100;
      setWatchedPercentage(percentage);

      const flooredPercentage = Math.floor(percentage);
      if (flooredPercentage >= lastLoggedPercentage + 5) {
        setLastLoggedPercentage(flooredPercentage);
        updateProgressOnServer(video.currentTime, percentage);
      }
    }
  };

  // Update video progress on the server
  const updateProgressOnServer = async (currentTime, percentage) => {
    try {
      await updateVideoProgress({
        courseId,
        sectionId: currentSection,
        videoId: selectedVideo._id,
        lastWatched: currentTime,
        watchedPercentage: percentage,
        completed: percentage === 100,
      }).unwrap();
    } catch (error) {
      console.error("Error updating video progress", error);
    }
  };

  // Toggle section visibility
  const toggleSectionVisibility = (sectionId) => {
    setVisibleSectionId(visibleSectionId === sectionId ? null : sectionId);
  };
 
  const handleVideoClick = async (video, sectionId) => {
    setCurrentSection(sectionId);
    setSelectedVideo(video);
    setWatchedPercentage(0);
    setLastWatchedTime(null); // Reset last watched time temporarily
  
    try {
      // Fetch video progress for the newly selected video
      const data = await getVideoProgress({
        courseId,
        sectionId: sectionId,
        videoId: video._id,
      }).unwrap();
  
      if (data && data.lastWatched) {
        setLastWatchedTime(data.lastWatched);
      } else {
        setLastWatchedTime(0); // Default to 0 if no last watched time is found
      }
    } catch (error) {
      console.error("Error fetching video progress", error);
      setLastWatchedTime(0); // Default to 0 in case of error
    }
  };
  

  return (
    <div>
      <StudentLayout>
      <div className="container-fluid p-3">
     
        <div
          className="p-4"
          style={{
            backgroundColor: "#f4f7fc",
            borderRadius: "15px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <Row>
            <div className="courseDetails">  
           { isLive ? (
           <Button onClick={() => navigate(`/enrolled-courses/live/${courseId}`)}>
                Attend Live Class
            </Button>
            ): null}

       <Row className="mt-2">
        <Col>
           {isLoading && <p>Loading progress...</p>}
          {error && <p>Error loading progress: {error.message}</p>}

          {courseProgress && (
            <>
              <h5>{courseProgress.overallProgress}% Completed</h5>
             <ProgressBar now={courseProgress.overallProgress} label={`${courseProgress.overallProgress}%`} />
            </>
          )}
        </Col>
      </Row> 
             
              <h1 style={{ fontSize: "2.5rem", color: "#333", marginBottom: "20px" }}>
                {course?.title} - {course?.description}
              </h1>
              <h5 style={{ color: "#777", marginBottom: "30px" }}>
                {course?.level} Level
              </h5>
            </div>

            <Col md={8} className="h-100">
              <div className="videoPlayer">
                {sections && sections.length > 0 ? (
                  selectedVideo && lastWatchedTime !== null ? ( // Only render the video if lastWatchedTime is fetched
                    <Card
                    style={{
                      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
                      borderRadius: "15px",
                      overflow: "hidden",
                    }}
                  >
                    <Card.Body>
                      <Card.Title
                        style={{
                          fontSize: "1.75rem",
                          color: "#0056b3",
                          fontFamily: "cursive",
                        }}
                      >
                        {selectedVideo.videoTitle}
                      </Card.Title>
                  
                      <div className="video-wrapper" style={{ position: 'relative', width: '100%' }}>
                        <video
                          key={selectedVideo._id}
                          ref={videoRef}
                          onTimeUpdate={handleVideoProgress}
                          muted
                          preload="auto"
                          controls
                          width="100%"
                          style={{
                            borderRadius: "15px",
                            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                            marginBottom: "10px",
                          }}
                        >
                          <source
                            src={`${import.meta.env.VITE_DOMAIN_SERVER}/api/users/live-stream/${currentSection}/video/${selectedVideo._id}#t=${lastWatchedTime}`}
                            type="video/mp4"
                          />
                          Your browser does not support the video tag.
                        </video>
                  
                          <div
                          className="progress-bar-container"
                          style={{
                            width: "100%",
                            height: "5px",
                            background: "#ddd",
                            position: "absolute",
                            bottom: "0",
                            left: "0",
                          }}
                        >
                          <div
                            className="progress-bar"
                            style={{
                              width: `${watchedPercentage}%`,
                              height: "100%",
                              backgroundColor: "red",
                              transition: "width 0.2s ease-in-out",
                            }}
                          ></div>
                        </div>
                      </div>
                  
                      <p>Watched: {watchedPercentage.toFixed(2)}%</p>
                      <Card.Text style={{ fontSize: "1rem", color: "#555" }}>
                        <h5>Description :</h5>
                        {selectedVideo.videoDescription}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                  
                  ) : (
                    <Loader /> // Show a loader while fetching lastWatchedTime
                  )
                ) : (
                  <div
                    className="d-flex justify-content-center align-items-center p-3"
                    style={{
                      width: "100%",
                      height: "100%",
                      textAlign: "center",
                      backgroundColor: "#fff",
                      borderRadius: "15px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    <h1 style={{ color: "#aaa" }}>No Section Available</h1>
                    {isCourseLoading && <Loader />}
                  </div>
                )}
              </div>

              <div>{quizData && <QuizBox questions={quizQuestions} isError={isQuizLoadingError} isLoading={isQuizLoading} />}</div>
            </Col>

            <Col md={4}>
              <ListGroup>
                {sections.map((section, index) => (
                  <ListGroup.Item
                    key={section._id}
                    className="bg-light"
                    style={{
                      borderRadius: "10px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      marginBottom: "10px",
                      padding: "5px",
                    }}
                  >
                    <div
                      className="d-flex justify-content-between align-items-center"
                      style={{
                        padding: "5px",
                        backgroundColor: "#e9ecef",
                        borderRadius: "10px",
                      }}
                    >
                      <h4>
                        {index + 1}. {section.title}
                      </h4>
                      <Button
                        variant="link"
                        onClick={() => toggleSectionVisibility(section._id)}
                        style={{
                          textDecoration: "none",
                          color: "#0056b3",
                          fontSize: "1.25rem",
                        }}
                      >
                        {visibleSectionId === section._id ? <FaChevronUp size={24} color="grey" /> : <FaChevronDown size={24} color="grey" />}
                      </Button>
                    </div>

                    <ListGroup>
                      <div
                        className={`section-videos mt-2 ${
                          visibleSectionId === section._id ? "show" : "hide"
                        }`}
                        style={{
                          transition: "max-height 0.4s ease-in-out",
                          overflow: "hidden",
                          maxHeight: visibleSectionId === section._id ? "1000px" : "0",
                          borderRadius: "15px",
                          cursor: "pointer",
                        }}
                      >
                        {section?.videos?.length ? (
                          section.videos.map((video, idx) => (
                            <div
                              key={idx}
                              className="p-2 m-1 bg-light"
                              style={{
                                borderRadius: "10px",
                                cursor: "pointer",
                                marginBottom: "10px",
                                transition: "background-color 0.3s ease-in-out",
                                boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                              }}
                              onClick={() => handleVideoClick(video, section._id)}
                            >
                              <h4 style={{ fontSize: "1.25rem", color: "#333" }}>
                                {idx + 1}. {video.videoTitle}
                              </h4>
                            </div>
                          ))
                        ) : (
                          <div className="text-center" style={{ padding: "10px", color: "#6c757d" }}>
                            No videos available
                          </div>
                        )}
                      </div>
                    </ListGroup>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
          </Row>
        </div>
      </div>
      </StudentLayout>
    </div>
  );
}

export default CourseAttendingScreen;
