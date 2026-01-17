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
        className="sm-d-shadow"
        style={{
          backgroundColor: "#D9D9D9",
          borderRadius: 18,
          width: "90%",
          minWidth: "550px",
          height: "400px",
          marginBlock: "10px",
        }}
      >
        <div
          className="d-flex justify-content-between align-items-center text-white"
          style={{
            paddingBlock: 18,
            paddingInline: 25,
          }}
        >
          <div className="d-flex gap-2 align-items-center">
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
          <div className="card-max w-100">
            <div style={{ width: "70%", paddingBlock: 40, paddingInline: 40 }}>
              <div
                style={{
                  display: "flex",
                  gap: 20,
                  margin: 0,
                }}
              >
                <Image
                  className="object-fit-contain"
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
            className="position-relative d-flex flex-column justify-content-between"
            style={{
              width: "20%",
              minWidth: "150px",
              paddingBlock: 10,
              paddingInline: 20,
            }}
          >
            <div className="d-flex gap-2 flex-column">
              <Button variant={"primary"} onClick={handleViewOffer}>
                View Offers
              </Button>
              <Button variant={"secondary"} onClick={handleCreateListing}>
                Create Listing
              </Button>
            </div>
            <div className="w-100">
              <Button
                className="position-absolute"
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
