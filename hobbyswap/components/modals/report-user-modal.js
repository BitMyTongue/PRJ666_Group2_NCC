import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";

const ReportUserType = {
  hate: 0,
  bully: 1,
  spam: 2,
  illegal: 3,
};

export default function ReportUserModal({ user, show, setShow }) {
  const [reportType, setReportType] = useState(-1);
  const [reportMsg, setReportMsg] = useState("");

  // TODO: create submit logic
  const handleSubmit = () => {};
  return (
    <Modal
      show={show}
      onHide={() => {
        setShow(false);
        setReportType(-1);
        setReportMsg("");
      }}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title className="h1 text-uppercase color-primary">
          Report User
        </Modal.Title>
      </Modal.Header>
      <Form className="gap-5">
        <Modal.Body>
          <p className="h5 mb-3">Why are you reporting this user?</p>

          <Form.Check
            required={true}
            type="radio"
            name="report-user"
            label="Hateful Content"
            value="hate"
            onChange={(e) => {
              if (e.target.checked) setReportType(ReportUserType.hate);
            }}
          />
          <Form.Check
            type="radio"
            name="report-user"
            label="Harassment/Bullying"
            value="bully"
            onChange={(e) => {
              if (e.target.checked) setReportType(ReportUserType.bully);
            }}
          />
          <Form.Check
            type="radio"
            name="report-user"
            label="Spam"
            value="spam"
            onChange={(e) => {
              if (e.target.checked) setReportType(ReportUserType.spam);
            }}
          />
          <Form.Check
            type="radio"
            name="report-user"
            label="Illegal Activity"
            value="illegal"
            onChange={(e) => {
              if (e.target.checked) setReportType(ReportUserType.illegal);
            }}
          />
          {reportType > -1 && (
            <Form.Group className="mt-4">
              <Form.Label>Please state the reason for the report:</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                onChange={(e) => {
                  setReportMsg(e.target.value);
                }}
              />
            </Form.Group>
          )}
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
