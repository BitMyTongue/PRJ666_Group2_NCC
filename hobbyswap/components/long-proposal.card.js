import { Button, Modal, Stack } from "react-bootstrap";
import UserIcon from "./user-icon";
import { useState } from "react";
import { useRouter } from "next/router";

export default function ProposalCard({
  offerObj, // used to process button callbacks
  fromUser, // offerObj only has ids for user, so fromUser has to include the entire user
  /*
    if the comp loads in users instead, it might load in offers where userIds exist but not the user object itself, also might include additional overhead 
   */
  proposedItems,
  proposedMoney = 0.0,
  acceptFn = null,
  declineFn = null,
  messageFn = null,
}) {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  const handleAccept = () => {};
  const handleDecline = () => {};

  const handleMessage = () => {};

  const hasMultiple = proposedItems?.length > 1;
  return (
    <>
      <div
        style={{
          backgroundColor: "#00BAE8",
          borderRadius: 18,
          width: "100%",
          minWidth: "550px",
          height: "400px",
          boxShadow: "1px 1px 5px gray",
          marginBlock: "10px",
          textOverflow: "ellipsis",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBlock: 10,
            paddingInline: 25,

            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              color: "white",
              alignItems: "center",
            }}
            onClick={() => {
              if (fromUser?._id) router.push("/users/" + fromUser._id);
            }}
          >
            <UserIcon
              user={fromUser.username}
              img={fromUser.avatar}
              size={40}
            />
            <div>{fromUser.username}</div>
            <strong> will give:</strong>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            backgroundColor: "white",
            height: "340px",
            borderRadius: 18,
          }}
        >
          <div
            className="proposal p-5"
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              borderRightColor: "#E6E9EE",
              borderRightStyle: "solid",
            }}
          >
            <p className="h4">
              {hasMultiple ? (
                <>
                  <span>
                    {proposedItems.map((it, idx) => {
                      if (idx > 1) return <></>;
                      return (
                        <span key={idx}>{it + (idx < 1 ? ", " : "")}</span>
                      );
                    })}
                  </span>
                  {proposedItems.length > 2 && (
                    <a
                      className="text-underline"
                      role="button"
                      onClick={() => {
                        setShowModal(true);
                      }}
                    >
                      {" "}
                      and more...
                    </a>
                  )}
                </>
              ) : proposedItems === undefined ? (
                "Unspecified"
              ) : !proposedItems && proposedMoney ? (
                `$${proposedMoney.toFixed(2)}`
              ) : (
                proposedItems
              )}
            </p>

            {(proposedItems || proposedItems === undefined) &&
              proposedMoney > 0.0 && (
                <>
                  <hr />
                  <p className="fs-4 text-primary fw-semibold">
                    ${proposedMoney.toFixed(2)}
                  </p>
                </>
              )}
          </div>

          <div
            style={{
              position: "relative",
              display: "flex",
              width: "20%",
              minWidth: "150px",
              paddingBlock: 10,
              paddingInline: 20,
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <div style={{ display: "flex", gap: 10, flexDirection: "column" }}>
              <Button
                className="rounded-pill"
                variant={"success"}
                onClick={acceptFn ?? handleAccept}
              >
                Accept
              </Button>
              <Button
                className="rounded-pill"
                variant={"danger"}
                onClick={declineFn ?? handleDecline}
              >
                Decline
              </Button>
              <Button
                className="rounded-pill"
                variant={"outline-primary"}
                onClick={messageFn ?? handleMessage}
              >
                Message
              </Button>
            </div>
          </div>
        </div>
        {hasMultiple && (
          <Modal
            show={showModal}
            onHide={() => {
              setShowModal(false);
            }}
            keyboard={true}
          >
            <Modal.Header closeButton>
              <Modal.Title className="h1 text-uppercase color-primary">
                Proposed Items
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Stack
                className=" pb-5 w-100 overflow-scroll"
                direction="vertical"
                gap={2}
              >
                {proposedItems?.map((it, idx) => (
                  <p key={idx}>{it}</p>
                ))}
              </Stack>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </>
  );
}
