// import Image from "next/image";
// import { Button } from "react-bootstrap";
// import BookmarkIcon from "./bookmark-icon";
// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";

// export default function ItemCard({
//   img,
//   name,
//   desc,
//   saved,
//   url,
//   listingId,
//   ownerId,
//   currentUserId,
// }) {
//   const router = useRouter();

//   // Local state for bookmark
//   const [isSaved, setIsSaved] = useState(saved);

//   const handleTradeNow = () => {
//     if (!currentUserId) {
//       alert("You need to be logged in to propose a trade.");
//       return;
//     }

//     if (ownerId === currentUserId) {
//       alert("You can’t propose an offer on your own listing.");
//       return;
//     }

//     router.push(`/tradeOffers/create?listingId=${listingId}`);
//   };

//   useEffect(() => {
//     setIsSaved(saved);
//   }, [saved]);


//   return (
//     <div style={{ width: 280 }}>
//       <Image
//         className="drop-shadow"
//         alt={name}
//         src={img}
//         width={278}
//         height={385}
//         style={{ objectFit: "contain" }}
//       />

//       <div>
//         <div
//           className="d-flex justify-content-between"
//           style={{ marginTop: 20 }}
//         >
//           <p className="fw-semibold text-primary h3">{name}</p>

//           {/* ✅ Functional Bookmark */}
//           <BookmarkIcon
//             fill={isSaved}
//             onChange={(next) => setIsSaved(next)}
//           />
//         </div>

//         <p className="text-primary">{desc}</p>
//       </div>

//       <div className="d-flex gap-2">
//         <Button
//           className="w-100"
//           variant="light"
//           href={url}
//         >
//           View Details
//         </Button>

//         <Button
//           className="w-100"
//           variant="primary"
//           onClick={handleTradeNow}
//         >
//           Trade Now
//         </Button>
//       </div>
//     </div>
//   );
// }


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

  // ✅ add these so we can save full bookmark info (required by schema)
  category,
  brand,
  condition,
  images = [], // full images array (strings)
}) {
  const router = useRouter();

  const [isSaved, setIsSaved] = useState(saved);
  const [busy, setBusy] = useState(false);
  const safeImg = (img && !img.includes("your-bucket.s3.amazonaws.com"))
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
    if (!currentUserId) {
      alert("You need to be logged in to bookmark.");
      return;
    }
    if (!listingId) {
      alert("Missing listingId.");
      return;
    }
    if (busy) return;

    const next = !isSaved;

    // optimistic UI update
    setIsSaved(next);
    setBusy(true);

    try {
      if (next) {
        // ✅ CREATE bookmark (send all required fields)
        const payload = {
          userId: currentUserId,
          listingId,
          title: name || "Untitled",
          description: desc || "",
          category: category || "Uncategorized",
          brand: brand || "Unknown",
          condition: condition || "Unknown",
          images: Array.isArray(images) && images.length > 0 ? images : (img ? [img] : []),
        };

        const res = await fetch("/api/bookmarks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (!res.ok) throw new Error(data?.error || "Failed to bookmark");
      } else {
        // ✅ DELETE bookmark by userId + listingId (requires server support)
        const res = await fetch(
          `/api/bookmarks?userId=${encodeURIComponent(currentUserId)}&listingId=${encodeURIComponent(listingId)}`,
          { method: "DELETE" }
        );

        const text = await res.text();
        const data = text ? JSON.parse(text) : {};
        if (!res.ok) throw new Error(data?.error || "Failed to remove bookmark");
      }
    } catch (e) {
      console.error(e);
      // rollback
      setIsSaved(!next);
      alert(e.message);
    } finally {
      setBusy(false);
    }
  };

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
        <div className="d-flex justify-content-between" style={{ marginTop: 20 }}>
          <p className="fw-semibold text-primary h3">{name}</p>

          <button
            type="button"
            onClick={toggleBookmark}
            disabled={busy}
            aria-label="Bookmark"
            style={{
              background: "transparent",
              border: 0,
              padding: 0,
              cursor: busy ? "not-allowed" : "pointer",
            }}
          >
            <BookmarkIcon fill={isSaved} />
          </button>
        </div>

        <p className="text-primary">{desc}</p>
      </div>

      <div className="d-flex gap-2">
        <Button className="w-100" variant="light" href={url}>
          View Details
        </Button>

        <Button className="w-100" variant="primary" onClick={handleTradeNow}>
          Trade Now
        </Button>
      </div>
    </div>
  );
}