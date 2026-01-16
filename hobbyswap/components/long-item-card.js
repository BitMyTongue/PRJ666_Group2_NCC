import { Button } from "react-bootstrap";
import Rating from "./rating";
import Image from "next/image";
import BookmarkIcon from "./bookmark-icon";
import UserIcon from "./user-icon";
import { useState } from "react";
export default function LongItemCard({
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
                <Image
                  alt={offerItem.title}
                  src={offerItem.img}
                  width={69}
                  height={96}
                />
                <div>
                  <p className="h4">{offerItem.title}</p>
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
              <div style={{ marginBottom: 5 }}>
                {requestItem?.user ? (
                  <div style={{ display: "flex", gap: 10 }}>
                    <UserIcon
                      user={requestItem.user.userName}
                      img={requestItem.user.userImg}
                      size={20}
                    />
                    <span>{requestItem.user.userName}</span>
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
                {!hasMultiple && requestItem && (
                  <Image
                    alt={requestItem.title}
                    src={requestItem.img}
                    width={69}
                    height={96}
                  />
                )}
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    gap: 10,
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <p className="h4">
                      {hasMultiple
                        ? "Multiple Items"
                        : requestItem === undefined
                        ? "Unspecified"
                        : !requestItem && requestMoney
                        ? `$${requestMoney.toFixed(2)}`
                        : requestItem?.title}
                    </p>
                    <p style={{ height: "50px", overflowY: "auto" }}>
                      {!hasMultiple && requestItem?.desc}
                    </p>
                  </div>
                  {(requestItem || requestItem === undefined) &&
                    requestMoney > 0.0 && (
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
              <p className="h4" style={{ marginBottom: 20 }}>
                OFFERING
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
                  width={149}
                  height={196}
                />
                <div>
                  <p className="h4">{offerItem.title}</p>
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
              <div
                style={{
                  zIndex: 1,
                  paddingBlock: 20,
                  paddingInline: 40,
                  marginLeft: 80,
                }}
              >
                <p className="h4" style={{ marginBottom: 20 }}>
                  {requestItem?.user ? (
                    <div style={{ display: "flex", gap: 10 }}>
                      <UserIcon
                        user={requestItem.user.userName}
                        img={requestItem.user.userImg}
                        size={40}
                      />
                      <span>{requestItem.user.userName}</span>
                    </div>
                  ) : (
                    "REQUESTING"
                  )}
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
                      width={149}
                      height={196}
                    />
                  )}
                  <div>
                    <p className="h4">
                      {hasMultiple
                        ? "Multiple Items"
                        : requestItem === undefined
                        ? "Unspecified"
                        : !requestItem && requestMoney
                        ? `$${requestMoney.toFixed(2)}`
                        : requestItem?.title}
                    </p>
                    <p style={{ height: "100px", overflowY: "auto" }}>
                      {!hasMultiple && requestItem?.desc}
                    </p>
                    {(requestItem || requestItem === undefined) &&
                      requestMoney > 0.0 && (
                        <>
                          <hr />
                          <p className="h4">${requestMoney.toFixed(2)}</p>
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
                  className="w-100"
                  variant="info"
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
}
