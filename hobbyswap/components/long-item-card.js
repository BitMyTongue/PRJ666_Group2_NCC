import { Button } from "react-bootstrap";
import Image from "next/image";
import BookmarkIcon from "./bookmark-icon";
import { useState } from "react";
import StatLabel from "./stat-label";
export default function LongItemCard({
  item,
  monthStats,
  yearStats,
  allTimeStats,
  isBookmarked = false,
}) {
  const [saved, setSaved] = useState(isBookmarked);
  const bookmarkCallback = () => {
    setSaved(!saved);
  };

  // TODO: Implement button functions
  const handleViewOffer = () => {};
  const handleCreateListing = () => {};

  return (
    <>
      <div
        style={{
          backgroundColor: "#D9D9D9",
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
            <strong>ITEM</strong>
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
          <div className="card-max" style={{ width: "100%" }}>
            <div style={{ width: "70%", paddingBlock: 40, paddingInline: 40 }}>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  margin: 0,
                }}
              >
                <Image
                  alt={item.title}
                  src={item.img}
                  width={149}
                  height={196}
                />
                <div>
                  <p className="h4">{item.title}</p>
                  <p style={{ height: "100px", overflowY: "auto" }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                width: "30%",
                overflowX: "hidden",
                overflowY: "clip",
                contain: "paint",
                paddingBlock: 40,
                paddingInline: 40,
              }}
            >
              <StatLabel label="total traded this month" stat={monthStats} />
              <StatLabel label="total traded this year" stat={yearStats} />
              <StatLabel label="total traded all time" stat={allTimeStats} />
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
              <Button variant={"primary"} onClick={handleViewOffer}>
                View Offers
              </Button>
              <Button variant={"secondary"} onClick={handleCreateListing}>
                Create Listing
              </Button>
            </div>
            <div className="w-100" style={{ float: "left" }}>
              <Button
                variant="none"
                style={{ position: "absolute", bottom: 5, right: 5 }}
                onClick={() => {
                  bookmarkCallback();
                }}
              >
                <BookmarkIcon fill={saved} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
