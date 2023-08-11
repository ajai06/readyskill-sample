import React from "react";

import { Modal, Button, CloseButton } from "react-bootstrap";

import './confirmModal.scss'

function ConfirmationModal({
  btnClassName,
  actionButton,
  actionText,
  onHide,
  onAction,
  ...props
}) {
  return (
    <Modal className="confirmModal" {...props} size="md" aria-labelledby="contained-modal-title-vcenter">
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter" className="subHead-text-learner">
          Are you sure?
        </Modal.Title>
        <CloseButton onClick={onHide} />
      </Modal.Header>
      <Modal.Body>
        <p className="text-white">Are you sure you want to {actionText} </p>
      </Modal.Body>
      <Modal.Footer>
        <a className="close-modal-btn" onClick={onHide}>
          Cancel
        </a>
        <Button className={btnClassName} onClick={onAction}>
          {actionButton}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ConfirmationModal;
