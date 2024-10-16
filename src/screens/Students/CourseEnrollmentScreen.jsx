import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useCreatePaymentSessionMutation,
  useGetCourseQuery,
  useGetSectionsQuery,
} from "../../slices/userApiSlice";
import { Container, Row, Col, Button, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { setCredentials } from "../../slices/authSlice";
import StudentLayout from "../../components/StudentComponents/StudentLayout";
import Loader from "../../components/Loader";

function CourseEnrollmentScreen() {
  const { id } = useParams();
  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
  } = useGetCourseQuery({ id });
  const { data: sections = [], isLoading: sectionsLoading, error: sectionsError } = useGetSectionsQuery({ id });

  useEffect(() => {
    if (course) {
      console.log(course?.previewVideo);
    }
  }, [course]);

  const userInfo = useSelector((state) => state.auth.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [createSession] = useCreatePaymentSessionMutation();

  const handleEnroll = async () => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    try {
      const res = await createSession({
        userId: userInfo._id,
        courseId: course._id,
        title: course.title,
        price: course.price,
        imageUrl: course.coverImage,
      }).unwrap();

      // Adding the course to the credentials
      dispatch(
        setCredentials({
          ...userInfo,
          courses: [...userInfo.courses, course._id],
        })
      );

      window.location.href = res.url;
    } catch (error) {
      toast.error("Error creating checkout session:", error);
    }
  };

  const videoStyle = {
    borderRadius: "12px",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.2)",
  };

  const sectionStyle = {
    borderRadius: "10px",
    boxShadow: "0 6px 12px rgba(0, 0, 0, 0.1)",
    padding: "10px",
    marginBottom: "10px",
    backgroundColor: "#f8f9fa",
  };

  return (
    <StudentLayout>
      <Container fluid>
        {isCourseLoading ? (
          <div className="d-flex justify-content-center align-items-center m-5">
            <Loader />
          </div>
        ) : courseError ? (
          <div className="d-flex justify-content-center align-items-center m-5">
            <p>Error loading course: {courseError.message}</p>
          </div>
        ) : (
          <Row className="my-1">
            {/* Left Column: Course Details */}
            <Col md={8}>
              <div className="bg-white p-2 shadow-sm rounded">
                <h1 className="mb-2 " style={styles.courseTitle}>
                  {course.title}
                </h1>
                <p style={styles.courseDescription}>{course.description}</p>
                <img
                  src={course.coverImage || "https://via.placeholder.com/800x400"}
                  alt={course.title}
                  className="img-fluid"
                  style={styles.courseCoverImage}
                />
                <p className="mt-4 text-muted" style={styles.coursePrice}>
                  <strong>Price:</strong> ₹{course.price}
                </p>
                <div className="instructor my-4 d-flex align-items-center">
                  <img
                    src={course.instructor.imageUrl || "https://via.placeholder.com/150"}
                    alt={course.instructor.name}
                    style={styles.instructorImage}
                  />
                  <div>
                    <h5 style={styles.instructorName}>
                      Instructor: <strong>{course.instructor.name}</strong>
                    </h5>
                    <p style={styles.instructorBio}>{course.instructor.bio}</p>
                  </div>
                </div>
                {userInfo?.courses && userInfo?.courses.includes(course._id) ? (
                  <Button
                    style={{ ...styles.premiumButton, ...styles.attendCourseButton }}
                    onClick={() => navigate(`/enrolled-courses/attend/${course._id}`)}
                    className="mt-1 w-100"
                  >
                    Attend the Course
                  </Button>
                ) : (
                  <Button
                    style={{ ...styles.premiumButton, ...styles.enrollButton }}
                    onClick={handleEnroll}
                    className="mt-1 w-100"
                  >
                    Enroll Now for ₹{course.price}
                  </Button>
                )}
              </div>
            </Col>

            {/* Right Column: Preview Video and Sections */}
            <Col md={4}>
              <div className="bg-light p-4 shadow-sm rounded">
                <h4 className="mb-4 text-center">Preview Video</h4>
                <video controls width="100%" className="my-3" style={videoStyle}>
                  <source
                    src={course?.previewVideo || "https://via.placeholder.com/300x200"}
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
                <p className="my-3 text-center">
                  <strong>{course.level.toUpperCase()} LEVEL</strong>
                </p>
                <p className="text-center">
                  <strong>Sections:</strong> {Array.isArray(sections) ? sections.length : 0}
                </p>

                <ListGroup>
                  {sections.map((section, index) => (
                    <ListGroup.Item
                      key={section._id}
                      className="bg-light"
                      style={sectionStyle}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <h5>
                          {index + 1}. {section.title}
                        </h5>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            </Col>
          </Row>
        )}
      </Container>
    </StudentLayout>
  );
}

const styles = {
  courseCoverImage: {
    display: "block",
    margin: "20px auto",
    borderRadius: "20px",
    width: "100%",
    height: "auto",
    maxHeight: "450px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
    objectFit: "cover",
  },
  courseTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 600,
    fontSize: "2.8rem",
  },
  courseDescription: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: "1.2rem",
    color: "#555",
  },
  coursePrice: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    fontSize: "1.4rem",
    color: "#27ae60",
  },
  instructorImage: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    marginRight: "15px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  instructorName: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "1.2rem",
  },
  instructorBio: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: "0.95rem",
    color: "#7f8c8d",
  },
  premiumButton: {
    backgroundColor: "#1abc9c",
    color: "#fff",
    fontSize: "1.2rem",
    fontWeight: 600,
    padding: "12px 30px",
    borderRadius: "10px",
    boxShadow: "0 6px 15px rgba(0, 0, 0, 0.1)",
  },
  attendCourseButton: {
    backgroundColor: "#3498db",
  },
  enrollButton: {
    backgroundColor: "#e74c3c",
  },
};

export default CourseEnrollmentScreen;
