import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as outlineBookmark } from "@fortawesome/free-regular-svg-icons";
import { useEffect, useState, useContext } from "react";
import { UserContext } from "@/contexts/UserContext";

export default function BookmarkIcon({ listingId, size = "xl", ...props }) {
  const { user } = useContext(UserContext);
  const [saved, setSaved] = useState(false);

  // Check if bookmarked
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

  return (
    <FontAwesomeIcon
      color="#001F54"
      size={size}
      icon={saved ? solidBookmark : outlineBookmark}
      style={{ cursor: "pointer" }}
      onClick={toggleBookmark}
      {...props}
    />
  );
}