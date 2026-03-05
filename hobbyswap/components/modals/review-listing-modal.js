import { useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import ItemCard from "../item-card";
import UserWithRating from "../user-with-rating";
import {StarRating} from "../rating"
import UserIcon from "../user-icon";

const ReportUserType = {
  hate: 0,
  bully: 1,
  spam: 2,
  illegal: 3,
};

export default function ReviewUserModal({
  reviewer,
  user,
  show,
  setShow,
}) {
  const [reportTitle, setReviewTitle] = useState("");
  const [reportDesc, setReviewDesc] = useState("");

  // TODO: create submit logic
  const handleSubmit = () => {};

  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        setReviewTitle("");
        setReviewDesc("");
      }}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title className="h1 text-uppercase color-primary">
          Tell us your experience with {user.username}
        </Modal.Title>
      </Modal.Header>
      <Form className="gap-5" onSubmit={handleSubmit}>
        <Modal.Body>
          <Container className="d-flex gap-5">
            <div className="w-100">
              <Form.Group>
                <Form.Label className="text-muted text-capitalize mt-2">How do you rate this user?</Form.Label>
                <div className="d-flex gap-3">
                  <UserIcon user={user.username} img={user.avatar} size="50" />
                  <StarRating />
                </div>
                <Form.Label className="text-muted text-capitalize mt-3">How is the experience with this user</Form.Label>
                <Form.Control
                  type="text"
                  rows={5}
                  onChange={(e) => {
                    setReviewTitle(e.target.value);
                  }}
                />
                <Form.Label className="text-capitalize text-muted mt-3">More details</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  onChange={(e) => {
                    setReviewDesc(e.target.value);
                  }}
                />
              </Form.Group>
            </div>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary px-5" type="submit" >
            Submit
          </Button>
          <Button variant="light px-5"onClick={()=>setShow(!show)} >
            Cancel
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
