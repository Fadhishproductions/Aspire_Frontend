import React from 'react';
import { Modal, Button, Form, ProgressBar } from 'react-bootstrap';

const SingleFileUploadModal = ({ show, handleUpload, uploadProgress, isUploading, cancelUpload, File, setFile, role }) => {
  
  const handleUploadClick = () => {
    if (File) {
      handleUpload(File);
    }
  };

  return (
    <Modal show={show} onHide={cancelUpload}>
      <Modal.Header closeButton>
        <Modal.Title>{role === "video" ? "Upload Video" : "Upload Image"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>{role === "video" ? "Select Video File" : "Select Image File"}</Form.Label>
            {/* Accept different file types based on role */}
            <Form.Control 
              type="file" 
              accept={role === "video" ? "video/*" : "image/*"} 
              onChange={(e) => setFile(e.target.files[0])} 
            />
          </Form.Group>

          {isUploading && (
            <ProgressBar now={uploadProgress} label={`${uploadProgress}%`} />
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={cancelUpload}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleUploadClick} disabled={!File || isUploading}>
          Upload
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SingleFileUploadModal;
