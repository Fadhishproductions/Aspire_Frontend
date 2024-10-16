// VideoUploadModal.jsx
import React from 'react';
import { Modal, Button, Form, ProgressBar } from 'react-bootstrap';

const VideoUploadModal = ({
    show,
    handleClose,
    newVideoTitle,
    setNewVideoTitle,
    newVideoDescription,
    setNewVideoDescription,
    setVideoFile,
    isUploading,
    uploadProgress,
    handleAddVideo,
    handleCancelUpload,
    mode
}) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header>
                <Modal.Title>{mode === 'edit' ? 'Edit Video' : 'Add Video'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="videoTitle">
                        <Form.Label>Video Title</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter video title"
                            value={newVideoTitle}
                            onChange={(e) => setNewVideoTitle(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="videoDescription">
                        <Form.Label>Video Description</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter video description"
                            value={newVideoDescription}
                            onChange={(e) => setNewVideoDescription(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="videoFile">
                        <Form.Label>Upload Video</Form.Label>
                        <Form.Control
                            type="file"
                            accept="video/*"
                            onChange={(e) => setVideoFile(e.target.files[0])}
                            required
                        />
                    </Form.Group>
                </Form>
                {isUploading && <ProgressBar className='m-1' animated now={uploadProgress} label={`${uploadProgress}%`} />}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCancelUpload}>Cancel</Button>
                <Button variant="primary" onClick={handleAddVideo} disabled={isUploading }>{mode === 'edit' ? 'Save Changes' : 'Add Video'}</Button> 
            </Modal.Footer>
        </Modal> 
        
        
    );
};  

export default VideoUploadModal;
