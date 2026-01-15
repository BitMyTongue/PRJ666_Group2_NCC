import { Button } from "react-bootstrap";
import Rating from "./rating";
import Image from "next/image";
import BookmarkIcon from "./bookmark-icon";
import UserIcon from "./user-icon";
import { useState } from "react";

// Item Example (for now)
const item = {
  img: "/images/fake-card.png",
  title: "Raichu Card",
  desc: "This is a description",
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
  userName,
  userImg,
  offerItem,
  requestItem,
  status = "",
  hasMultiple = false,
  requestMoney = 0.0,
  isBookmarked = false,
  showBookmark = true,
  cancelCallback = null,
  rating = -1,
  color = null,
}) {
  const [saved, setSaved] = useState(isBookmarked);
  const bookmarkCallback = () => {
    setSaved(!saved);
  };

  return (
    <>
      <div
        style={{
          backgroundColor: color ?? "#334C76",
          borderRadius: 18,
          width: "90%",
          minWidth: "550px",
          height: "400px",
          boxShadow: "1px 1px 5px gray",
          marginBlock: "10px",
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
          >
            <strong>FROM:</strong>
            <UserIcon user={userName} img={userImg} size={40} />
            <div>{userName}</div>
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
              <p style={{ marginBottom: 5 }}>
                <strong>OFFERING</strong>
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  margin: 0,
                }}
              >
                <Image
                  alt={offerItem.title}
                  src={offerItem.img}
                  width={69}
                  height={96}
                />
                <div>
                  <h4>{offerItem.title}</h4>
                  <p style={{ height: "50px", overflowY: "auto" }}>
                    {offerItem.desc}
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
              <p style={{ marginBottom: 5 }}>
                <strong>REQUESTING</strong>
              </p>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                }}
              >
                {!hasMultiple && requestItem && (
                  <Image
                    alt={requestItem.title}
                    src={requestItem.img}
                    width={69}
                    height={96}
                  />
                )}
                <div style={{ display: "flex", gap: 10 }}>
                  <div>
                    <h4>
                      {hasMultiple
                        ? "Multiple Items"
                        : requestItem
                        ? requestItem.title
                        : "Unspecified"}
                    </h4>
                    <p style={{ height: "50px", overflowY: "auto" }}>
                      {!hasMultiple && requestItem?.desc}
                    </p>
                  </div>
                  {requestMoney > 0.0 && (
                    <div>
                      <span>OR</span>
                      <h4>${requestMoney.toFixed(2)}</h4>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="card-max" style={{ width: "100%" }}>
            <div style={{ width: "45%", paddingBlock: 20, paddingInline: 40 }}>
              <h4 style={{ marginBottom: 20 }}>OFFERING</h4>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  margin: 0,
                }}
              >
                <Image
                  alt={offerItem.title}
                  src={offerItem.img}
                  width={149}
                  height={176}
                />
                <div>
                  <h4>{offerItem.title}</h4>
                  <p style={{ height: "100px", overflowY: "auto" }}>
                    {offerItem.desc}
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
                <h4 style={{ marginBottom: 20 }}>REQUESTING</h4>
                <div
                  style={{
                    display: "flex",
                    gap: 20,
                  }}
                >
                  {!hasMultiple && requestItem && (
                    <Image
                      alt={requestItem.title}
                      src={requestItem.img}
                      width={149}
                      height={176}
                    />
                  )}
                  <div>
                    <h4>
                      {hasMultiple
                        ? "Multiple Items"
                        : requestItem
                        ? requestItem.title
                        : "Unspecified"}
                    </h4>
                    <p style={{ height: "100px", overflowY: "auto" }}>
                      {!hasMultiple && requestItem.desc}
                    </p>
                    {requestMoney > 0.0 && (
                      <>
                        <hr />
                        <h4>${requestMoney.toFixed(2)}</h4>
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
                  variant="gray"
                  onClick={() => {
                    cancelCallback();
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default function TradeCard({
  userName,
  userImg,
  offerItem,
  requestItem,
  isBookmarked = false,
  hasMultiple = false,
  requestMoney = 0.0,
  rating = 0,
}) {
  return (
    <BaseLongCard
      userName={userName}
      userImg={userImg}
      offerItem={offerItem}
      requestItem={requestItem}
      isBookmarked={isBookmarked}
      hasMultiple={hasMultiple}
      requestMoney={requestMoney}
      rating={rating}
    >
      <Button variant="primary">View</Button>
      <Button variant="secondary">Trade Now</Button>
      <Button variant="secondary">Buy Now</Button>
    </BaseLongCard>
  );
}
