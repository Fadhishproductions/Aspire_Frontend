import React, { useEffect, useRef, useState } from "react";
import InstructorLayout from "../../components/InstructorLayout.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useGetCourseQuery,
  useGetSectionsQuery,
  useCreateSectionMutation,
  useAddVideoToSectionMutation,
  useAddQuizMutation,
  useAddPreviewVideoMutation,
  useGetQuizzMutation,
  useEditSectionMutation,
  useEditVideoToSectionMutation,
  useUpdateCoverImageMutation,
} from "../../slices/instructorApiSlice.js";
import { Button, Col, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import Loader from "../../components/Loader.jsx";
import axios from "axios";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import QuizEditorModal from "../../components/QuizEditorModal.jsx";
import VideoUploadModal from "../../components/VideoUploadModal.jsx";
import SingleFileUploadModal from "../../components/SingleVideoUploadModal.jsx";
import SectionForm from "../../components/SectionForm.jsx";
import AddNotificationModal from "../../components/AddNotificationModal.jsx";
import { useDispatch } from "react-redux";
import { addLiveStream } from "../../slices/userCourseSlice.js";
import ConfirmationBox from "../../components/ConfirmationBox"; // Import ConfirmationBox
import config from "../../config.js";

function InstructorCourseDetailsScreen() {
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  let [quizData, setQuizData] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [previewVideo, setPreviewVideo] = useState("");
  const [showSectionForm, setShowSectionForm] = useState(false);
  const [showEditSectionForm, setShowEditSectionForm] = useState(false);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingVideoId, setEditingVideoId] = useState(null);
  const [editingSectionTitle, setEditingSectionTitle] = useState("");
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [showEditVideoForm, setShowEditVideoForm] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoDescription, setNewVideoDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [previewVideoFile, setPreviewVideoFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null); // For cover image upload
  const [showCoverImageModal, setShowCoverImageModal] = useState(false);
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const [quizSectionId, setQuizSectionId] = useState(null);
  const [sections, setSections] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0); // Track upload progress
  const [visibleSectionId, setVisibleSectionId] = useState(null); // Track which section's videos are visible
  const location = useLocation();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const courseId = id;
  const cancelTokenSource = useRef(null);
  const navigate = useNavigate();
  const [showConfirmation, setShowConfirmation] = useState(false); // State to show/hide ConfirmationBox
  const [confirmationCallback, setConfirmationCallback] = useState(null); // Callback for confirm actions

  const [addPreviewvideo, { isLoading: ispreviewVideoUploading }] =
    useAddPreviewVideoMutation();
  const [createSection, { isLoading: isCreatingSection }] =
    useCreateSectionMutation();
  const [addVideoToSection, { isLoading: isAddingVideo }] =
    useAddVideoToSectionMutation();
  const [editVideoToSection, { isLoading: iditingVideo }] =
    useEditVideoToSectionMutation();
  const [updateCoverImage ,{isLoading:isCoverImageUploading}] = useUpdateCoverImageMutation();


  const [addQuiz, { isLoading: isAddingQuiz }] = useAddQuizMutation();
  const [fetchQuiz, { isLoading: isFetchingQuiz, error: FetchingQuizerror }] =
    useGetQuizzMutation();
  const [editSection, { isLoading: isEditingSection }] =
    useEditSectionMutation();

  const {
    data: course,
    isLoading: isCourseLoading,
    error: courseError,
  } = useGetCourseQuery({ id });
  const {
    data: fetchedSections,
    isLoading: isSectionsLoading,
    error: sectionsError,
  } = useGetSectionsQuery({ id });

  useEffect(() => {
    if (course) {
      setTitle(course.title);
      setDescription(course.description);
      setPrice(course.price);
      setCoverImage(course.coverImage);
      setPreviewVideo(course?.previewVideo ? course.previewVideo : "");
    }
  }, [course]);

  useEffect(() => {
    if (fetchedSections) {
      setSections(fetchedSections);
    }
  }, [fetchedSections]);

  const handleAddSection = async (newSectionTitle) => {
    setConfirmationCallback(() => async () => {
      if (!newSectionTitle || !course._id) {
        toast.error("Title field is required");
        return;
      }
      try {
        const newSection = await createSection({
          title: newSectionTitle,
          courseId: course._id,
        }).unwrap();
        toast.success("Section added successfully");
        setSections((prevSections) => [...prevSections, newSection]);
        setShowSectionForm(false);
      } catch (error) {
        toast.error(error.data.message || error.error);
      }
    });
    setShowConfirmation(true);
  };

  const handleEditSectionClick = (section) => {
    setEditingSectionId(section._id);
    setEditingSectionTitle(section.title);
    setShowEditSectionForm(true);
  };

  const handleEditSection = async (newSectionTitle, sectionId) => {
    setConfirmationCallback(() => async () => {
      if (!newSectionTitle || !sectionId) {
        toast.error("Title field is required");
        return;
      }
      try {
        const newSection = await editSection({
          title: newSectionTitle,
          sectionId,
          courseId: course._id,
        }).unwrap();
        toast.success("Section edited successfully");
        setSections((prevSections) => {
          const updatedSection = prevSections.map((prevSection) =>
            prevSection._id === sectionId
              ? { ...prevSection, title: newSectionTitle }
              : prevSection
          );
          return updatedSection;
        });
        setShowEditSectionForm(false);
      } catch (error) {
        toast.error(error.data.message || error.error);
      }
    });
    setShowConfirmation(true);
  };

  const uploadFileToCloudinary = async (file,role) => {
    const formData = new FormData();
    formData.append("file", file);
    const endpoint = role === "video"
    ? `https://api.cloudinary.com/v1_1/${config.CLOUDINARY_CLOUD_NAME}/video/upload`
    : `https://api.cloudinary.com/v1_1/${config.CLOUDINARY_CLOUD_NAME}/image/upload`;
    formData.append("upload_preset",config.CLOUDINARY_API_PRESET); // Replace with your Cloudinary upload preset
    cancelTokenSource.current = axios.CancelToken.source();
    
    try {
      const res = await axios.post(
        endpoint,
        formData,
        {
          onUploadProgress: (progressEvent) => {
            const percentageComplete = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentageComplete);
          },
          cancelToken: cancelTokenSource.current.token,
        }
      );
      return res.data.secure_url;
    } catch (error) {
      if (axios.isCancel(error)) {
        toast.info("File upload canceled");
      } else {
        toast.error("File upload failed");
      }
      return;
    }
  };

  

  const handleAddVideo = async () => {
    setConfirmationCallback(() => async () => {
      if (
        !newVideoTitle ||
        !videoFile ||
        !newVideoDescription ||
        !selectedSectionId
      ) {
        toast.error("All fields are required");
        return;
      }

      setIsUploading(true);

      try {
        const videoUrl = await uploadFileToCloudinary(videoFile,"video");
        if (!videoUrl) {
          return;
        }

        const videoData = {
          videoTitle: newVideoTitle,
          videoUrl,
          videoDescription: newVideoDescription,
        };

        const updatedSection = await addVideoToSection({
          id: selectedSectionId,
          data: videoData,
        }).unwrap();

        toast.success("Video added successfully");
        setSections((prevSections) =>
          prevSections.map((section) =>
            section._id === selectedSectionId ? updatedSection : section
          )
        );
        setShowVideoForm(false);
        setNewVideoTitle("");
        setVideoFile(null);
        setNewVideoDescription("");
      } catch (error) {
        if (error.data && error.data.message) {
          toast.error(error.data.message);
        } else if (error.error) {
          toast.error(error.error);
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setIsUploading(false);
      }
    });
    setShowConfirmation(true);
  };

  const handleEditVideo = async () => {
    setConfirmationCallback(() => async () => {
      if (!newVideoTitle || !newVideoDescription || !selectedSectionId) {
        toast.error("All fields are required");
        return;
      }

      try {
        if (videoFile) {
          setIsUploading(true);
          let videoUrl = await uploadFileToCloudinary(videoFile,"video");
          if (!videoUrl) {
            return;
          }
        }
        const videoData = {
          videoTitle: newVideoTitle,
          videoDescription: newVideoDescription,
        };

        if (videoFile && videoUrl) {
          videoData.videoUrl = videoUrl;
        }
        const updatedSection = await editVideoToSection({
          sectionId: selectedSectionId,
          videoId: editingVideoId,
          data: videoData,
        }).unwrap();

        toast.success("Video added successfully");
        setSections((prevSections) =>
          prevSections.map((section) =>
            section._id === selectedSectionId ? updatedSection : section
          )
        );
        setShowVideoForm(false);
        setNewVideoTitle("");
        setVideoFile(null);
        setNewVideoDescription("");
        setShowEditVideoForm(false);
      } catch (error) {
        if (error.data && error.data.message) {
          toast.error(error.data.message);
        } else if (error.error) {
          toast.error(error.error);
        } else {
          toast.error("An unexpected error occurred");
        }
      } finally {
        setIsUploading(false);
      }
    });
    setShowConfirmation(true);
  };

  const handleEditVideoClick = ({ sectionId, video }) => {
    setSelectedSectionId(sectionId);
    setEditingVideoId(video._id);
    setShowEditVideoForm(true);
    setNewVideoTitle(video.videoTitle);
    setNewVideoDescription(video.videoDescription);
  };

  const toggleSectionVisibility = (sectionId) => {
    setVisibleSectionId(visibleSectionId === sectionId ? null : sectionId);
  };

  const handleCancelUpload = () => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
    }
    setShowEditVideoForm(false);
    setShowVideoForm(false);
    setNewVideoTitle("");
    setVideoFile(null);
    setNewVideoDescription("");
    setUploadProgress(0);
    setIsUploading(false);
  };

  const cancelPreviewUpload = async () => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
    }
    setShowPreviewModal(false);
    setIsUploading(false);
  };

  const handlePreviewVideoUpload = async (previewVideoFile) => {
    setIsUploading(true);
    try {
      const videoUrl = await uploadFileToCloudinary(previewVideoFile,"video");
      if (!videoUrl) {
        return;
      }
      const updatedUrl = await addPreviewvideo({
        courseId: id,
        videoUrl,
      }).unwrap();
      toast.success("Preview video added successfully");
      setPreviewVideo(updatedUrl);
    } catch (error) {
      if (error.data && error.data.message) {
        toast.error(error.data.message);
      } else if (error.error) {
        toast.error(error.error);
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setShowPreviewModal(false);
      setIsUploading(false);
    }
  };

  const handleQuizManageClick = async (sectionId) => {
    setQuizSectionId(sectionId);
    const quiz = await fetchQuiz({ id: sectionId }).unwrap();
    setQuizData(quiz || []);
  };

  const CloseQuizEditor = () => {
    setQuizData([]);
    setQuizSectionId(null);
  };

  const handleSaveQuiz = async (updatedQuiz) => {
    try {
      const Quiz = await addQuiz({
        id: quizSectionId,
        questions: updatedQuiz,
      }).unwrap();
      toast.success("Quiz added", Quiz);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add quiz");
      console.error("Failed to reset password:", err);
    }
  };

  const handleCoverImageUpload = async (coverImageFile) => {
    setIsUploading(true);
    try {
      const imageUrl = await uploadFileToCloudinary(coverImageFile, "image");
      if (!imageUrl) return;

      await updateCoverImage({ courseId: id, imageUrl }).unwrap();
      toast.success("Cover image updated successfully");
      setCoverImage(imageUrl);
    } catch (error) {
      toast.error("Failed to upload cover image");
    } finally {
      setShowCoverImageModal(false);
      setIsUploading(false);
    }
  };

  const cancelCoverImageUpload = async () => {
    if (cancelTokenSource.current) {
      cancelTokenSource.current.cancel();
    }
    setShowCoverImageModal(false);
    setIsUploading(false);
  };

  

  return (
    <>
      {!isCourseLoading ? (
        <div className="p-3">
          <InstructorLayout currentPage="courses">
            <h1 className="mx-2">Course Details</h1>
            <div className="p-3">
              <Button
                onClick={() => {
                  dispatch(addLiveStream(courseId));
                  navigate(`/instructor/course/live/${courseId}`);
                }}
              >
                Go Live
              </Button>
            </div>
            <div className="p-3">
              <Button onClick={() => setShowSectionForm(true)}>
                Add Section
              </Button>
              {showSectionForm && (
                <SectionForm
                  show={showSectionForm}
                  onHide={() => {
                    setShowSectionForm(false);
                  }}
                  title="Add Section"
                  label="Section Name"
                  placeholder="Enter Section Name"
                  isLoading={isCreatingSection}
                  onSubmit={handleAddSection}
                  submitButtonText="Add Section"
                />
              )}

              <Button
                className="mx-2"
                onClick={() => {
                  setShowNotificationModal(true);
                }}
              >
                Add Notification
              </Button>
              <AddNotificationModal
                show={showNotificationModal}
                courseId={courseId}
                setShow={setShowNotificationModal}
              />
            </div>

            <div className="row">
              <div
                className="col-md-12 d-flex justify-content-between align-items-center p-3"
                style={{ borderBottom: "2px solid #e9ecef", borderTop: "2px solid #e9ecef" }}
              >
                <h1 style={styles.titleText}>Title: {title}</h1>
                <h1 style={styles.priceText}>Price: ₹{price}</h1>
              </div>
            </div>

            <Row
              className="p-4 bg-light"
              style={{
                borderRadius: "12px",
                margin: "10px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              }}
            >
              <Col>
                <div className="mt-3 p-3 bg-white" style={coverContainerStyle}>
                  <h4 className="mb-4 text-center" style={headerStyle}>
                    Course Cover Image
                  </h4>
                  <img
                    src={coverImage || "https://via.placeholder.com/300x200"}
                    alt={title}
                    style={coverImageStyle}
                  />
                  <Button onClick={() => setShowCoverImageModal(true)} className="m-2">{coverImage? "Change Cover Image" : "Add Cover Image "}</Button>
                  <SingleFileUploadModal
                show={showCoverImageModal}
                setFile={setCoverImageFile}
                File={coverImageFile}
                cancelUpload={cancelCoverImageUpload}
                handleUpload={handleCoverImageUpload}
                uploadProgress={uploadProgress}
                isUploading={isUploading}
                role="image" // Pass the role as "image"
              />
                </div>
              </Col>

              <Col>
                <div className="mt-3 p-3 bg-white" style={videoContainerStyle}>
                  <h4 className="mb-4 text-center" style={headerStyle}>
                    Preview Video
                  </h4>
                  <video
                    controls
                    width="100%"
                    className="my-3"
                    style={videoStyle}
                  >
                    <source src={course?.previewVideo || previewVideo || "https://via.placeholder.com/300x200"} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                  <Button
                    onClick={() => setShowPreviewModal(true)}
                    style={buttonStyle}
                  >
                    {course?.previewVideo ? "Change Preview" : "Add Preview"}
                  </Button>

                  <SingleFileUploadModal
                    show={showPreviewModal}
                    setFile={setPreviewVideoFile}
                    File={previewVideoFile}
                    cancelUpload={cancelPreviewUpload}
                    handleUpload={handlePreviewVideoUpload}
                    uploadProgress={uploadProgress}
                    isUploading={isUploading}
                    role="video"
                  />
                </div>
              </Col>
            </Row>

            <div className="container mt-2">
              <div className="row">
                <div className="col-md-12" style={styles.descriptionContainer}>
                  <p style={styles.levelText}>
                    <strong>{course?.level.toUpperCase()} LEVEL</strong>
                  </p>
                  <h2 style={styles.descriptionText}>
                    Description: {description}
                  </h2>
                </div>
              </div>

              {sections?.length > 0 && (
                <div className="row">
                  <div
                    className="col-md-12"
                    style={styles.sectionsContainer}
                  >
                    <div className="p-3">
                      <h3 style={styles.sectionTitle}>
                        Sections: {sections?.length}
                      </h3>
                      {isSectionsLoading ? (
                        <Loader />
                      ) : sectionsError ? (
                        <div className="text-danger">
                          {sectionsError?.data?.message || sectionsError.error}
                        </div>
                      ) : (
                        <div>
                          {sections?.length ? (
                            sections.map((section, index) => (
                              <div
                                key={section._id}
                                className="p-2 m-1 bg-light borderRadius-10"
                                style={{
                                  border: "1px solid #ddd",
                                  borderRadius: "10px",
                                }}
                              >
                                <div className="d-flex justify-content-between align-items-center">
                                  <h2>
                                    {index + 1}. {section.title}
                                  </h2>
                                  <div>
                                    <Button
                                      className="me-2"
                                      onClick={() => {
                                        handleEditSectionClick(section);
                                      }}
                                    >
                                      Edit Section
                                    </Button>
                                    <SectionForm
                                      show={showEditSectionForm}
                                      onHide={() => {
                                        setShowEditSectionForm(false);
                                      }}
                                      title="Edit Section"
                                      label="Section Name"
                                      placeholder="Enter New Section Name"
                                      isLoading={isEditingSection}
                                      onSubmit={handleEditSection}
                                      submitButtonText="Edit Section"
                                      sectionId={editingSectionId}
                                      value={editingSectionTitle}
                                    />
                                    <Button
                                      className="me-2"
                                      onClick={() =>
                                        handleQuizManageClick(section._id)
                                      }
                                    >
                                      Manage Quiz
                                    </Button>
                                    {quizSectionId && (
                                      <QuizEditorModal
                                        handleClose={CloseQuizEditor}
                                        isLoading={isFetchingQuiz}
                                        isError={FetchingQuizerror}
                                        saveQuiz={handleSaveQuiz}
                                        quizData={quizData}
                                      />
                                    )}
                                    <Button
                                      className="me-2"
                                      onClick={() => {
                                        setSelectedSectionId(section._id);
                                        setShowVideoForm(true);
                                      }}
                                    >
                                      Add Video
                                    </Button>
                                    {showVideoForm && (
                                      <VideoUploadModal
                                        show={showVideoForm}
                                        handleClose={() => {
                                          setShowVideoForm(false);
                                          setNewVideoTitle("");
                                          setVideoFile(null);
                                          setNewVideoDescription("");
                                        }}
                                        newVideoTitle={newVideoTitle}
                                        setNewVideoTitle={setNewVideoTitle}
                                        newVideoDescription={newVideoDescription}
                                        setNewVideoDescription={
                                          setNewVideoDescription
                                        }
                                        setVideoFile={setVideoFile}
                                        isUploading={isUploading}
                                        uploadProgress={uploadProgress}
                                        handleAddVideo={handleAddVideo}
                                        handleCancelUpload={() =>
                                          handleCancelUpload()
                                        }
                                        mode="Add"
                                      />
                                    )}
                                    <Button
                                      variant="link"
                                      onClick={() =>
                                        toggleSectionVisibility(section._id)
                                      }
                                      style={{ textDecoration: "none" }}
                                    >
                                      {visibleSectionId === section._id ? (
                                        <FaChevronUp size={24} />
                                      ) : (
                                        <FaChevronDown size={24} />
                                      )}
                                    </Button>
                                  </div>
                                </div>

                                <div
                                  className={`section-videos ${
                                    visibleSectionId === section._id
                                      ? "show"
                                      : "hide"
                                  }`}
                                  style={{
                                    transition: "max-height 0.4s ease-in-out",
                                    overflow: "hidden",
                                    maxHeight:
                                      visibleSectionId === section._id
                                        ? "1000px"
                                        : "0",
                                  }}
                                >
                                  {section?.videos?.length ? (
                                    section.videos.map((video, idx) => (
                                      <div
                                        key={idx}
                                        className="p-2 m-3 bg-white border"
                                        style={{
                                          border: "1px solid #ddd",
                                          borderRadius: "10px",
                                        }}
                                      >
                                        <Button
                                          className="m-2"
                                          onClick={() => {
                                            handleEditVideoClick({
                                              sectionId: section._id,
                                              video,
                                            });
                                          }}
                                        >
                                          Edit video
                                        </Button>
                                        {showEditVideoForm && (
                                          <VideoUploadModal
                                            show={showEditVideoForm}
                                            handleClose={() => {
                                              setShowEditVideoForm(false);
                                              setNewVideoTitle("");
                                              setVideoFile(null);
                                              setNewVideoDescription("");
                                            }}
                                            newVideoTitle={newVideoTitle}
                                            setNewVideoTitle={setNewVideoTitle}
                                            newVideoDescription={
                                              newVideoDescription
                                            }
                                            setNewVideoDescription={
                                              setNewVideoDescription
                                            }
                                            setVideoFile={setVideoFile}
                                            isUploading={isUploading}
                                            uploadProgress={uploadProgress}
                                            handleAddVideo={handleEditVideo}
                                            handleCancelUpload={() =>
                                              handleCancelUpload()
                                            }
                                            mode="edit"
                                          />
                                        )}
                                        <h4>
                                          {idx + 1} Video Title:{" "}
                                          {video.videoTitle}
                                        </h4>
                                        <p>
                                          Description: {video.videoDescription}
                                        </p>
                                        <video
                                          controls
                                          className="bg-light mb-2"
                                          style={{
                                            width: "100%",
                                            maxHeight: "400px",
                                            border: "1px solid #ddd",
                                            borderRadius: "10px",
                                          }}
                                        >
                                          <source
                                            src={video.videoUrl}
                                            type="video/mp4"
                                          />
                                        </video>
                                      </div>
                                    ))
                                  ) : (
                                    <div>No videos available</div>
                                  )}
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="bg-light p-2">
                              No sections available
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </InstructorLayout>
        </div>
      ) : (
        "Loading..."
      )}

      <ConfirmationBox
        show={showConfirmation}
        handleClose={() => setShowConfirmation(false)}
        handleConfirm={() => {
          confirmationCallback();
          setShowConfirmation(false);
        }}
        title="Confirm Action"
        message="Are you sure you want to proceed?"
      />
    </>
  );
}

const headerStyle = {
  fontSize: "1.5rem",
  fontWeight: "bold",
  color: "#333",
  letterSpacing: "0.5px",
};

const coverContainerStyle = {
  borderRadius: "15px",
  overflow: "hidden",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
  transition: "transform 0.3s ease",
};

const coverImageStyle = {
  width: "100%",
  height: "300px",
  objectFit: "cover",
  borderRadius: "12px",
  transition: "transform 0.3s ease",
};

const videoContainerStyle = {
  borderRadius: "15px",
  padding: "1.5rem",
  backgroundColor: "#fff",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.1)",
  textAlign: "center",
  transition: "box-shadow 0.3s ease, transform 0.3s ease",
};

const videoStyle = {
  borderRadius: "12px",
  boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
  transition: "box-shadow 0.3s ease, transform 0.3s ease",
  maxHeight: "400px",
};

const buttonStyle = {
  backgroundColor: "#4CAF50",
  color: "#fff",
  borderRadius: "8px",
  padding: "10px 20px",
  fontSize: "1.1rem",
  fontWeight: "600",
  textTransform: "uppercase",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  transition: "background-color 0.3s ease, transform 0.3s ease",
};

const styles = {
  titleText: {
    fontFamily: "'Times New Roman', serif",
    fontSize: "2.8rem",
    color: "#2c3e50",
  },
  priceText: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: "2.4rem",
    color: "#27ae60",
  },
  descriptionContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    marginTop: "20px",
  },
  descriptionText: {
    fontSize: "1.1rem",
    color: "#555",
    fontFamily: "'Roboto', sans-serif",
    lineHeight: "1.8",
  },
  levelText: {
    fontSize: "1.1rem",
    fontWeight: 600,
    color: "#3498db",
    marginBottom: "10px",
  },
  sectionsContainer: {
    backgroundColor: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    marginTop: "20px",
  },
  sectionTitle: {
    fontSize: "1.8rem",
    fontWeight: 700,
    color: "#2c3e50",
  },
};

export default InstructorCourseDetailsScreen;
