import Image from "next/image";
import { Button } from "react-bootstrap";
import BookmarkIcon from "./bookmark-icon";
import { useRouter } from "next/router";
import { useState } from "react";

export default function ItemCard({
  img,
  name,
  desc,
  saved = false,
  url,
  listingId,
  ownerId,
  currentUserId,
}) {
  const router = useRouter();

  const handleTradeNow = () => {
    if (!currentUserId) {
      alert("You need to be logged in to propose a trade.");
      return;
    }

    if (ownerId === currentUserId) {
      alert("You can’t propose an offer on your own listing.");
      return;
    }

    router.push(`/tradeOffers/create?listingId=${listingId}`);
  };
  if (!listingId) {
    return (
      <div
        className="base-long-card-loading"
        style={{ minWidth: 550, height: 400 }}
      >
        {/* placeholder or spinner could go here */}
      </div>
    );
  }

  return (
    <div style={{ width: 280 }}>
      <Image
        className="drop-shadow"
        alt={name}
        src={img}
        width={278}
        height={385}
        style={{ objectFit: "contain" }}
      />
      <div>
        <div
          className="d-flex justify-content-between"
          style={{
            marginTop: 20,
          }}
        >
          <p className="fw-semibold text-primary h3">{name}</p>
          <BookmarkIcon listingId={listingId} initialSaved={saved} />
        </div>
        <p className="text-primary">{desc}</p>
      </div>
      <div className="d-flex gap-2">
        <Button
          className="w-100"
          variant="light rounded-pill text-primary"
          href={url}
        >
          View Details
        </Button>
        <Button
          className="w-100"
          variant="primary rounded-pill"
          onClick={handleTradeNow}
        >
          Trade Now
        </Button>
      </div>
    </div>
  );
}
