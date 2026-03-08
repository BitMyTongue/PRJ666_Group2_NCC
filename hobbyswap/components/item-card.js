import Image from "next/image";
import { Button } from "react-bootstrap";
import BookmarkIcon from "./bookmark-icon";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ItemCard({ 
  img,
  name,
  desc,
  saved,
  url,
  listingId,
  ownerId,
  currentUserId,
  category,
  brand,
  condition,
  images = [],
  onBookmarkChanged,
}) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(saved);
  const [busy, setBusy] = useState(false);

  const safeImg =
    img && !img.includes("your-bucket.s3.amazonaws.com")
      ? img
      : "/images/default-product.png";

  useEffect(() => {
    setIsSaved(saved);
  }, [saved]);


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

  const toggleBookmark = async () => {
    if (!currentUserId) return alert("You need to be logged in to bookmark.");
    if (!listingId) return alert("Missing listingId.");
    if (busy) return;

    const next = !isSaved;
    setBusy(true);

    try {
      const endpoint = next
        ? "/api/bookmarks"
        : `/api/bookmarks?userId=${encodeURIComponent(currentUserId)}&listingId=${encodeURIComponent(listingId)}`;

      const options = next
        ? {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: currentUserId,
              listingId,
              title: name || "Untitled",
              description: desc || "",
              category: category || "Uncategorized",
              brand: brand || "Unknown",
              condition: condition || "Unknown",
              images: Array.isArray(images) && images.length > 0 ? images : img ? [img] : [],
            }),
          }
        : { method: "DELETE" };

      const res = await fetch(endpoint, options);

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { raw: await res.text() };

      if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`);

      setIsSaved(next);
      await onBookmarkChanged?.(); // refresh parent set
    } catch (err) {
      console.error(err);
      alert(err.message || "Bookmark failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div style={{ width: 280 }}>
      <Image
        className="drop-shadow"
        alt={name}
        src={safeImg}
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
          <BookmarkIcon
            fill={isSaved}
            disabled={busy}
            onChange={() => toggleBookmark()}
          />
        </div>
        <p className="text-primary">{desc}</p>
      </div>
      <div className="d-flex gap-2">
        <Button className="w-100" variant="light rounded-pill text-primary" href={url}>
          View Details
        </Button>
        <Button className="w-100" variant="primary rounded-pill"  onClick={handleTradeNow}>
          Trade Now
        </Button>
      </div>
    </div>
  );
}
