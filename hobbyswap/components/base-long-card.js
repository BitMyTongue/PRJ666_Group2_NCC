import { Button, Modal, Stack } from "react-bootstrap";
import Rating from "./rating";
import Image from "next/image";
import BookmarkIcon from "./bookmark-icon";
import UserIcon from "./user-icon";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import { UserContext } from "@/contexts/UserContext";

const StatusType = {
  DECLINED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  CANCELLED: 4,
  RES_NEEDED: 5,
  AWAIT_PROPOSAL: 6,
  AWAIT_P_APPROVAL: 7,
  P_ACCEPTED: 8,
  RETRACTED: 9,
};

const SubtractSVG = function SubtractSVG({
  width = 580,
  height = 340,
  ...props
}) {
  return (
    <div {...props}>
      <svg
        width={width}
        height={height}
        viewBox="0 0 580 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filter0_i_187_295)">
          <path
            d="M579.214 340H0V338.159L65.8008 170L0 1.83984V0H579.214V340Z"
            fill="#E6E9EE"
          />
        </g>
        <defs>
          <filter
            id="filter0_i_187_295"
            x="0"
            y="0"
            width="579.214"
            height="343"
            filterUnits="userSpaceOnUse"
            colorInterpolationFilters="sRGB"
          >
            <feFlood floodOpacity="0" result="BackgroundImageFix" />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="BackgroundImageFix"
              result="shape"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feMorphology
              radius="2"
              operator="erode"
              in="SourceAlpha"
              result="effect1_innerShadow_187_295"
            />
            <feOffset dy="3" />
            <feGaussianBlur stdDeviation="2.5" />
            <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="shape"
              result="effect1_innerShadow_187_295"
            />
          </filter>
        </defs>
      </svg>
    </div>
  );
};

/// children is ONLY used to layout buttons
const BaseLongCard = function BaseLongCard({
  children,
  user,
  offerItem,
  requestItem,
  status = "",
  requestMoney = 0.0,
  isBookmarked = false,
  showBookmark = true,
  cancelCallback = null,
  rating = -1,
  color = null,
  requestUser = null,
  modalTitle = "View Requests",
  cancelBthLabel: cancelBtnLabel = "Cancel",
  offerLabel = "OFFERING",
  requestLabel = "REQUESTING",
}) {
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(isBookmarked);
  const router = useRouter();
  const bookmarkCallback = () => {
    setSaved(!saved);
  };

  const { user: currUser } = useContext(UserContext);

  const isSameUser = user && currUser && user._id === currUser._id;
  const isSameReqUser =
    requestUser && currUser && requestUser._id === currUser._id;
  const hasMultiple = requestItem?.length > 1;
  return (
    <>
      <div
        style={{
          backgroundColor: color ?? "#334C76",
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
            color: "white",

            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: 10,
              height: 40,
              alignItems: "center",
              cursor: !isSameUser && "pointer",
            }}
            onClick={() => {
              if (isSameUser) return;
              if (user?._id) router.push("/users/" + user._id);
            }}
          >
            <strong>FROM:</strong>
            {!isSameUser && (
              <UserIcon
                user={user?._id === currUser?._id ? "YOU" : user.username}
                img={user.avatar}
                size={40}
              />
            )}
            <div>{isSameUser ? "YOU" : user.username}</div>
          </div>
          {rating > -1 && <Rating rating={rating} />}
          {status && (
            <strong style={{ textTransform: "uppercase" }}>{status}</strong>
          )}
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
            className="card-min"
            style={{
              width: "100%",
              flexDirection: "column",
              overflowY: "auto",
              borderRightColor: "#E6E9EE",
              borderRightStyle: "solid",
            }}
          >
            <div style={{ width: "100%", paddingBlock: 20, paddingInline: 40 }}>
              <div style={{ marginBottom: 5 }}>
                <strong>{offerLabel}</strong>
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  margin: 0,
                }}
              >
                {offerItem.images && (
                  <Image
                    className="object-fit-contain"
                    alt={offerItem.itemName}
                    src={offerItem.images[0]}
                    width={69}
                    height={96}
                  />
                )}
                <div>
                  <p className="h4">{offerItem.itemName}</p>
                  <p style={{ height: "50px", overflowY: "auto" }}>
                    {offerItem.description}
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                width: "100%",
                paddingBlock: 20,
                paddingInline: 40,
                backgroundColor: "#E6E9EE",
                boxShadow: "inset 1px 1px 5px gray",
              }}
            >
              <div style={{ marginBottom: 5 }}>
                {requestUser ? (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      cursor: !isSameReqUser && "pointer",
                    }}
                    onClick={() => {
                      if (isSameReqUser) return;
                      if (requestUser?._id)
                        router.push("/users/" + requestUser._id);
                    }}
                  >
                    {!isSameReqUser && (
                      <UserIcon
                        user={
                          requestUser?._id === currUser?._id
                            ? "YOU"
                            : requestUser.username
                        }
                        img={requestUser.avatar}
                        size={20}
                      />
                    )}
                    <span
                      className={
                        isSameReqUser &&
                        "fs-4 text-capitalize fw-semibold text-primary opacity-75 mb-3"
                      }
                    >
                      {requestUser?._id === currUser?._id
                        ? "YOU PROPOSE..."
                        : requestUser.username}
                    </span>
                  </div>
                ) : (
                  <strong>{requestLabel}</strong>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                }}
              >
                {/* {!hasMultiple && requestItem && requestItem.images && (
                  <Image
                    className="object-fit-contain"
                    alt={requestItem.itemName}
                    src={requestItem.images && requestItem.images[0]}
                    width={69}
                    height={96}
                  />
                )} */}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p className="fs-4 text-primary fw-semibold">
                      {hasMultiple ? (
                        <a
                          className="text-underline"
                          role="button"
                          onClick={() => {
                            setShowModal(true);
                          }}
                        >
                          Multiple Items
                        </a>
                      ) : requestItem === undefined ? (
                        "Unspecified"
                      ) : !requestItem && requestMoney ? (
                        `$${requestMoney.toFixed(2)}`
                      ) : (
                        requestItem
                      )}
                    </p>
                  </div>
                  {(requestItem || requestItem === undefined) &&
                    requestMoney > 0.0 && (
                      <div>
                        <span>OR</span>
                        <p className="fs-4 text-primary fw-semibold">
                          ${requestMoney.toFixed(2)}
                        </p>
                      </div>
                    )}
                </div>
              </div>
            </div>
          </div>
          <div className="card-max" style={{ width: "100%" }}>
            <div style={{ width: "45%", paddingBlock: 20, paddingInline: 40 }}>
              <p
                className="fs-4 text-capitalize fw-semibold text-success"
                style={{ marginBottom: 20 }}
              >
                OFFERING
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  margin: 0,
                }}
              >
                {offerItem.images && (
                  <Image
                    className="object-fit-contain"
                    alt={offerItem.itemName}
                    src={offerItem.images[0]}
                    width={149}
                    height={196}
                  />
                )}
                <div>
                  <p className="fw-semibold fs-4 text-primary text-capitalize">
                    {offerItem.itemName}
                  </p>
                  <p
                    className="text-primary"
                    style={{ height: "100px", overflowY: "auto" }}
                  >
                    {offerItem.description}
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                gap: 10,
                width: "55%",
                overflowX: "hidden",
                overflowY: "clip",
                contain: "paint",
              }}
            >
              <SubtractSVG
                width={580}
                height={340}
                style={{
                  position: "fixed",
                  top: 0,
                  zIndex: 0,
                  overflow: "clip",
                }}
              />
              <div
                style={{
                  zIndex: 1,
                  paddingBlock: 20,
                  paddingInline: 40,
                  marginLeft: 80,
                }}
              >
                {requestUser ? (
                  <div
                    style={{
                      display: "flex",
                      gap: 10,
                      marginBottom: 20,
                      cursor: !isSameReqUser && "pointer",
                    }}
                    onClick={() => {
                      if (isSameReqUser) return;
                      if (requestUser?._id)
                        router.push("/users/" + requestUser._id);
                    }}
                  >
                    {!isSameReqUser && (
                      <UserIcon
                        user={
                          requestUser?._id === currUser?._id
                            ? "YOU"
                            : requestUser.username
                        }
                        img={requestUser.avatar}
                        size={20}
                      />
                    )}
                    <span
                      className={
                        isSameReqUser &&
                        "fs-4 text-capitalize fw-semibold text-primary opacity-75 mb-3"
                      }
                    >
                      {requestUser?._id === currUser?._id
                        ? "YOU PROPOSE..."
                        : requestUser.username}
                    </span>
                  </div>
                ) : (
                  <p className="fs-4 text-capitalize fw-semibold text-primary opacity-75 mb-3">
                    REQUESTING
                  </p>
                )}

                <div
                  style={{
                    display: "flex",
                    gap: 20,
                  }}
                >
                  {/* {!hasMultiple && requestItem && requestItem.images && (
                    <Image
                      className="object-fit-contain"
                      alt={requestItem.itemName}
                      src={requestItem.images && requestItem.images[0]}
                      width={149}
                      height={196}
                    />
                  )} */}
                  <div>
                    <p className="h4">
                      {hasMultiple ? (
                        <a
                          className="text-underline"
                          role="button"
                          onClick={() => {
                            setShowModal(true);
                          }}
                        >
                          Multiple Items
                        </a>
                      ) : requestItem === undefined ? (
                        "Unspecified"
                      ) : !requestItem && requestMoney ? (
                        `$${requestMoney.toFixed(2)}`
                      ) : (
                        requestItem
                      )}
                    </p>
                    <p style={{ height: "100px", overflowY: "auto" }}>
                      {!hasMultiple && requestItem?.description}
                    </p>
                    {(requestItem || requestItem === undefined) &&
                      requestMoney > 0.0 && (
                        <>
                          <hr />
                          <p className="fs-4 text-primary fw-semibold">
                            ${requestMoney.toFixed(2)}
                          </p>
                        </>
                      )}
                  </div>
                </div>
              </div>
            </div>
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
              {children}
            </div>
            <div className="w-100" style={{ float: "left" }}>
              {showBookmark && (
                <Button
                  variant="none"
                  style={{ position: "absolute", bottom: 5, right: 5 }}
                  onClick={() => {
                    bookmarkCallback();
                  }}
                >
                  <BookmarkIcon fill={saved} />
                </Button>
              )}
              {cancelCallback && (
                <Button
                  className="w-100 text-white rounded-pill"
                  variant=""
                  style={{ backgroundColor: "#A9A8A8" }}
                  onClick={() => {
                    cancelCallback();
                  }}
                >
                  {cancelBtnLabel}
                </Button>
              )}
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
                {modalTitle}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Stack
                className=" pb-5 w-100 overflow-scroll"
                direction="vertical"
                gap={2}
              >
                {requestItem?.map((it, idx) => (
                  <p key={idx}>{it}</p>
                ))}
              </Stack>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </>
  );
};

const TradeCard = function TradeCard({
  user,
  img,
  offerItem,
  requestItem,
  isBookmarked = false,
  hasMultiple = false,
  requestMoney = 0.0,
  rating = 0,
  url,
}) {

  const router = useRouter();
  const { user: currUser } = useContext(UserContext);

  const handleTradeNow = () => {
    if (!currUser?._id) {
      alert("You need to be logged in to propose a trade.");
      return;
    }

    if (offerItem.userId === currUser._id) {
      alert("You can’t propose an offer on your own listing.");
      return;
    }

    router.push(`/tradeOffers/create?listingId=${offerItem._id}`);
  };

  // TODO: Button implementation
  return (
    <BaseLongCard
      user={user}
      img={img}
      offerItem={offerItem}
      requestItem={requestItem}
      isBookmarked={isBookmarked}
      hasMultiple={hasMultiple}
      requestMoney={requestMoney}
      rating={rating}
    >
      <Button variant="primary rounded-pill" href={url}>
        View
      </Button>
      {requestItem !== null && (
        <Button variant="light rounded-pill text-primary" onClick={handleTradeNow}>Trade Now</Button>
      )}
      {requestMoney && (
        <Button variant="light rounded-pill text-primary">Buy Now</Button>
      )}
    </BaseLongCard>
  );
};

/// buttons below are meant for StatusCard, mostly for organizing

const OfferButton = function OfferButton({ variant, link }) {
  return (
    <Button variant={variant} href={link}>
      View Listing
    </Button>
  );
};

const EditOfferButton = function EditOfferButton({ variant, link }) {
  return (
    <Button variant={variant} href={link}>
      Edit Listing
    </Button>
  );
};

const TradeButton = function TradeButton({ variant, onClick }) {
  return (
    <Button variant={variant} onClick={onClick}>
      View Trade
    </Button>
  );
};

const MsgButton = function MsgButton({ onClick }) {
  return (
    <Button
      variant={"light rounded-pill border border-primary text-primary"}
      onClick={onClick}
    >
      Message
    </Button>
  );
};

const AcceptButton = function AcceptButton({ onClick }) {
  return (
    <Button variant="success rounded-pill" onClick={onClick}>
      Accept
    </Button>
  );
};

const DeclineButton = function DeclineButton({ onClick }) {
  return (
    <Button variant={"danger rounded-pill"} onClick={onClick}>
      Decline
    </Button>
  );
};

const StatusCard = function StatusCard({
  offerId,
  user,
  offerItem,
  requestItem,
  statusType,
  hasMultiple = false,
  requestMoney = 0.0,
  requestUser = null,
  cancelCallback = null,
}) {
  const { user: currUser } = useContext(UserContext);
  const router = useRouter();

  // TODO: Button implementation
  const handleViewOffer = () => {};
  const handleEditOffer = () => {};
  const handleViewTrade = () => {};
  const handleMessage = () => {};

  const patchOffer = async (action) => {
    if (!currUser?._id) {
      alert("You need to be logged in.");
      return;
    }

    if (!offerId) {
      alert("Offer id missing.");
      return;
    }
console.log("PATCH ACTION:", action, "offerId:", offerId);
    const res = await fetch(`/api/tradeOffers/${offerId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        actorId: currUser._id,
      }),
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      alert(data?.error || "Something went wrong.");
      return;
    }

    router.reload();
  };

  const handleAccept = () => patchOffer("ACCEPT");
  const handleDecline = () => patchOffer("DECLINE");
  const handleCancelTrade = () => patchOffer("CANCEL");
  const handleRetractOffer = () => patchOffer("RETRACT");

  const ButtonLayout = {
    MAIN_LAYOUT1: (
      <>
        <TradeButton
          variant={"primary rounded-pill"}
          onClick={handleViewTrade}
        />
        <OfferButton
          variant={
            "light text-primary border border-primary border-2 rounded-pill"
          }
          link={`/listings/${offerItem._id}`}
        />
        <MsgButton onClick={handleMessage} />
      </>
    ),
    MAIN_LAYOUT2: (
      <>
        <OfferButton
          variant={"primary rounded-pill"}
          link={`/listings/${offerItem._id}`}
        />
        <MsgButton onClick={handleMessage} />
      </>
    ),

    CHOICE_LAYOUT: (
      <>
        <AcceptButton onClick={handleAccept} />
        <DeclineButton onClick={handleDecline} />
        <OfferButton
          variant={"light rounded-pill border border-primary text-primary"}
          onClick={handleViewOffer}
        />
        <MsgButton onClick={handleMessage} />
      </>
    ),
    EDIT_OFFER: (
      <>
        <OfferButton
          variant="primary rounded-pill"
          link={`/listings/${offerItem._id}`}
        />
        <EditOfferButton
          variant="light text-primary border border-primary border-2 rounded-pill"
          link={`/listings/edit/${offerItem._id}`}
        />
        <Button
          variant="light text-primary border border-primary border-2 rounded-pill"
          href={`/tradeOffers?listingId=${offerItem._id}`}
        >
          View All Offers
        </Button>
      </>
    ),
  };

  const StatusLayout = [
    {
      id: StatusType.DECLINED,
      msg: "proposal declined",
      color: "#D00018",
      layout: ButtonLayout.MAIN_LAYOUT2,
      cancel: null,
      cancelLabel: "Dismiss",
      offerLabel: "OFFERING",
      requestLabel: "REQUESTING",
    },
    {
      id: StatusType.IN_PROGRESS,
      msg: "trade in progress",
      color: "#F79E1B",
      layout: ButtonLayout.MAIN_LAYOUT1,
      cancel: handleCancelTrade,
      cancelLabel: "Cancel",
    },
    {
      id: StatusType.COMPLETED,
      msg: "trade completed",
      color: "#3A8402",
      layout: ButtonLayout.MAIN_LAYOUT1,
      cancel: null,
      cancelLabel: "Dismiss",
    },
    {
      id: StatusType.CANCELLED,
      msg: "trade cancelled",
      color: "#777070",
      layout: ButtonLayout.MAIN_LAYOUT1,
      cancel: null,
      cancelLabel: "Dismiss",
    },
    {
      id: StatusType.RES_NEEDED,
      msg: "proposal response needed",
      color: "#00BAE8",
      layout: ButtonLayout.CHOICE_LAYOUT,
      cancel: () => {},
      cancelLabel: "Cancel",
    },
    {
      id: StatusType.AWAIT_PROPOSAL,
      msg: "awaiting proposals...",
      color: "#006FCF",
      layout: ButtonLayout.EDIT_OFFER,
      cancel: () => {},
      cancelLabel: "Delete",
    },
    {
      id: StatusType.AWAIT_P_APPROVAL,
      msg: "awaiting proposal approval...",
      color: "#F79E1B",
      layout: ButtonLayout.MAIN_LAYOUT2,
      cancel: handleRetractOffer,
      cancelLabel: "Cancel",
    },
    {
      id: StatusType.P_ACCEPTED,
      msg: "proposal accepted!",
      color: "#3A8402",
      layout: ButtonLayout.MAIN_LAYOUT2,
      cancel: handleCancelTrade,
      cancelLabel: "Dismiss",
    },
    {
      id: StatusType.RETRACTED,
      msg: "offer retracted",
      color: "#777070",
      layout: ButtonLayout.MAIN_LAYOUT2,
      cancel: null,
      cancelLabel: "Dismiss",
    }
  ];

  const currType = StatusLayout.find((obj) => statusType === obj.id);
  return (
    <BaseLongCard
      user={user}
      status={currType.msg}
      color={currType.color}
      offerItem={offerItem}
      requestItem={requestItem}
      hasMultiple={hasMultiple}
      requestMoney={requestMoney}
      showBookmark={false}
      cancelCallback={cancelCallback ?? currType.cancel}
      cancelBtnLabel={currType.cancelLabel}
      requestUser={requestUser}
    >
      {currType.layout}
    </BaseLongCard>
  );
};

export { TradeCard, StatusCard, StatusType };
