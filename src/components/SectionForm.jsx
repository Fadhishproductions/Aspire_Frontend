import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import Loader from './Loader';

const SectionForm = ({
  show,
  onHide,
  title,
  label,
  placeholder, 
  value,
  onSubmit,
  submitButtonText,
  sectionId,
  isLoading
}) => {
    const [newSectionTitle,setNewSectionTitle] = useState("")
    const handleSubmit=()=>{
        onSubmit(newSectionTitle,sectionId)
    }
    const handleHide = ()=>{
        onHide()
        if(value){
            setNewSectionTitle(value)
        }
    }
    useEffect(()=>{
        if(value){
            setNewSectionTitle(value)
        }
    },[value])

  return (
    <Modal show={show} onHide={handleHide}>
      <Modal.Header closeButton>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="inputField">
            <Form.Label>{label}</Form.Label>
            <Form.Control
              type="text"
              placeholder={placeholder}
              value={newSectionTitle}
              onChange={(e)=>setNewSectionTitle(e.target.value)}
              required
            />
          </Form.Group>
        </Form>
        {isLoading && <Loader/>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          {submitButtonText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SectionForm;
