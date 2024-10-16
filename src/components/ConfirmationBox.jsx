import React from 'react'
import {Button, Modal} from 'react-bootstrap'
function ConfirmationBox({ show, handleClose, handleConfirm, title, message }) {
  return (
    <div>
      <Modal show={show} onHide={handleClose} centered>
            <Modal.Header  >
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body> 
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    Confirm
                </Button>
            </Modal.Footer>
      </Modal>
    </div>
  )
}

export default ConfirmationBox
