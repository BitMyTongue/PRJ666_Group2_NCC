import { useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import ItemCard from "../item-card";

export default function ConfirmModal({ show, setShow, onConfirm }) {
  // TODO: create submit logic
  const handleConfirm = () => {
    onConfirm();
    setShow(false);
  };
  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
      }}
      backdrop="static"
      keyboard={true}
    >
      <Modal.Header closeButton>
        <Modal.Title className="h1 text-uppercase color-primary">
          Are you sure?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>This action is irreversible!</Modal.Body>
      <Modal.Footer>
        <Button onClick={handleConfirm}>Yes</Button>
        <Button
          onClick={() => {
            setShow(false);
          }}
        >
          No
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
