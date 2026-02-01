import { useState } from "react";
import { Button, Form, Modal, Stack } from "react-bootstrap";
import ItemCard from "../item-card";

const ReportUserType = {
  hate: 0,
  bully: 1,
  spam: 2,
  illegal: 3,
};

// Example item card layout (for now)
const item = {
  img: "",
  name: "",
  desc: "",
  saved: "",
  uri: "",
  buttonLabel: "View",
};

export default function RequestedItemsModal({ items, show, setShow }) {
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
      keyboard={true}
    >
      <Modal.Header closeButton>
        <Modal.Title className="h1 text-uppercase color-primary">
          View Requests
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack
          className=" pb-5 w-100 overflow-scroll"
          direction="horizontal"
          gap={5}
        >
          {items.map((it, idx) => (
            <ItemCard key={idx} {...it} />
          ))}
        </Stack>
      </Modal.Body>
    </Modal>
  );
}
