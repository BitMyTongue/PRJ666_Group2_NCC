import { Button, Modal, Stack } from "react-bootstrap";
import Rating from "./rating";
import Image from "next/image";
import BookmarkIcon from "./bookmark-icon";
import UserIcon from "./user-icon";
import { useState } from "react";
import { useRouter } from "next/router";

const StatusType = {
  DECLINED: 1,
  IN_PROGRESS: 2,
  COMPLETED: 3,
  CANCELLED: 4,
  RES_NEEDED: 5,
  AWAIT_PROPOSAL: 6,
  AWAIT_APPROVAL: 7,
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
}) {
  const [showModal, setShowModal] = useState(false);
  const [saved, setSaved] = useState(isBookmarked);
  const router = useRouter();
  const bookmarkCallback = () => {
    setSaved(!saved);
  };

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

              alignItems: "center",
            }}
            onClick={() => {
              if (user?._id) router.push("/users/" + user._id);
            }}
          >
            <strong>FROM:</strong>
            <UserIcon user={user.username} img={user.avatar} size={40} />
            <div>{user.username}</div>
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
                <strong>OFFERING</strong>
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
                  <div style={{ display: "flex", gap: 10 }}>
                    <UserIcon
                      user={requestUser.username}
                      img={requestUser.avatar}
                      size={20}
                    />
                    <span>{requestUser.username}</span>
                  </div>
                ) : (
                  <strong>REQUESTING</strong>
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
                  <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
                    <UserIcon
                      user={requestUser.username}
                      img={requestUser.avatar}
                      size={20}
                    />
                    <span>{requestUser.username}</span>
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
        {hasMultiple && requestItem?.length > 1 && (
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
                gap={5}
              >
                {requestItem.map((it, idx) => (
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
        <Button variant="light rounded-pill text-primary">Trade Now</Button>
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
  user,
  offerItem,
  requestItem,
  statusType,
  hasMultiple = false,
  requestMoney = 0.0,
  requestUser = null,
  cancelCallback = null,
}) {
  // TODO: Button implementation
  const handleViewOffer = () => {};
  const handleEditOffer = () => {};
  const handleViewTrade = () => {};
  const handleMessage = () => {};
  const handleAccept = () => {};
  const handleDecline = () => {};

  const ButtonLayout = {
    MAIN_LAYOUT1: (
      <>
        <TradeButton variant={"primary"} onClick={handleViewTrade} />
        <OfferButton variant={"secondary"} onClick={handleViewOffer} />
        <MsgButton onClick={handleMessage} />
      </>
    ),
    MAIN_LAYOUT2: (
      <>
        <OfferButton variant={"primary"} onClick={handleViewOffer} />
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
      id: 1,
      msg: "trade declined",
      color: "#D00018",
      layout: ButtonLayout.MAIN_LAYOUT2,
      cancel: null,
      cancelLabel: "Dismiss",
    },
    {
      id: 2,
      msg: "trade in progress",
      color: "#F79E1B",
      layout: ButtonLayout.MAIN_LAYOUT1,
      cancel: () => {},
      cancelLabel: "Cancel",
    },
    {
      id: 3,
      msg: "trade completed",
      color: "#3A8402",
      layout: ButtonLayout.MAIN_LAYOUT1,
      cancel: null,
      cancelLabel: "Dismiss",
    },
    {
      id: 4,
      msg: "trade cancelled",
      color: "#777070",
      layout: ButtonLayout.MAIN_LAYOUT1,
      cancel: null,
      cancelLabel: "Dismiss",
    },
    {
      id: 5,
      msg: "proposal response needed",
      color: "#00BAE8",
      layout: ButtonLayout.CHOICE_LAYOUT,
      cancel: () => {},
      cancelLabel: "Cancel",
    },
    {
      id: 6,
      msg: "awaiting proposals...",
      color: "#006FCF",
      layout: ButtonLayout.EDIT_OFFER,
      cancel: () => {},
      cancelLabel: "Delete",
    },
    {
      id: 7,
      msg: "awaiting trade approval...",
      color: "#8895B4",
      layout: ButtonLayout.MAIN_LAYOUT2,
      cancel: null,
      cancelLabel: "Cancel",
    },
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
