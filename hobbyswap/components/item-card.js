import Image from "next/image";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as outlineBookmark } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { UserContext } from "@/contexts/UserContext";

export default function ItemCard({
  img,
  name,
  desc,
  url,
  listingId,
  ownerId,
  currentUserId,
}) {
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [saved, setSaved] = useState(false);
  const [imgSrc, setImgSrc] = useState(img || "/images/no-image-available-default.jpg");

  useEffect(() => {
    if (!user || !listingId) return;

    const checkBookmark = async () => {
      const res = await fetch("/api/bookmarks");
      const data = await res.json();

      const exists = data.bm.some(
        (b) => b.userId === user._id && b.listingId === listingId
      );

      setSaved(exists);
    };

    checkBookmark();
  }, [user, listingId]);

  const toggleBookmark = async () => {
    if (!user) {
      alert("Please login to bookmark listings");
      return;
    }

    const method = saved ? "DELETE" : "POST";

    const res = await fetch("/api/bookmarks", {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user._id,
        listingId,
      }),
    });

    if (res.ok) {
      setSaved(!saved);
    }
  };

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

  return (
    <div style={{ width: 280 }}>
      <Image
        className="drop-shadow"
        alt={name}
        src={imgSrc}
        width={278}
        height={385}
        style={{ objectFit: "contain" }}
        onError={() => setImgSrc("/images/no-image-available-default.jpg")}
      />

      <div>
        <div
          className="d-flex justify-content-between"
          style={{ marginTop: 20 }}
        >
          <p className="fw-semibold text-primary h3">{name}</p>

          <FontAwesomeIcon
            color="#001F54"
            size="xl"
            icon={saved ? solidBookmark : outlineBookmark}
            style={{ cursor: "pointer" }}
            onClick={toggleBookmark}
          />
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