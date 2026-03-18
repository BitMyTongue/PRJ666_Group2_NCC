import { useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import ItemCard from "../item-card";

export default function ForgotPasswordModal({ show, setShow }) {
  const [userEmail, setUserEmail] = useState("");
  const [showMsg, setShowMsg] = useState(false);
  // TODO: create submit logic
  const handleConfirm = async (e) => {
    e.preventDefault();
    setUserEmail("");
    setShowMsg(true);
    await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: userEmail }),
    });
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
      <Form onSubmit={handleConfirm}>
        <Modal.Header closeButton>
          <Modal.Title className="h1 text-uppercase color-primary">
            Forgot Password?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Text>Email</Form.Text>
            <Form.Control
              type="email"
              required={true}
              onChange={(e) => {
                setUserEmail(e.target.value);
              }}
            />
          </Form.Group>
          {showMsg && (
            <span>
              Email sent. Click on the link in the email to reset your password.
            </span>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Form.Control className="btn btn-primary" type="submit" />
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
