import { useState } from "react";
import { Button, Col, Container, Form, Modal, Row } from "react-bootstrap";
import ItemCard from "../item-card";
import UserWithRating from "../user-with-rating";

const ReportUserType = {
  hate: 0,
  bully: 1,
  spam: 2,
  illegal: 3,
};

export default function ReviewListingModal({
  listingId,
  listingImg,
  listingName,
  saved,
  userId,
  userName,
  userImg,
  userRating,
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
          Review
        </Modal.Title>
      </Modal.Header>
      <Form className="gap-5" onSubmit={handleSubmit}>
        <Modal.Body>
          <Container className="d-flex gap-5">
            <div className="w-40">
              <ItemCard
                img={listingImg}
                name={listingName}
                desc={""}
                saved={saved}
                buttonLabel=""
              />
              <UserWithRating
                userId={userId}
                userImg={userImg}
                userName={userName}
                rating={userRating}
              />
            </div>
            <div className="w-100">
              <Form.Group className="mt-4">
                <Form.Label>Title</Form.Label>
                <Form.Control
                  type="text"
                  rows={5}
                  onChange={(e) => {
                    setReviewTitle(e.target.value);
                  }}
                />
              </Form.Group>
              <Form.Group className="mt-4">
                <Form.Label>Description</Form.Label>
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
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
}
