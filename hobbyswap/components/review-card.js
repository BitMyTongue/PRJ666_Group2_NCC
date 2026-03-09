import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import UserIcon from "./user-icon";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const ReviewCard = function ReviewCard({
  reviewer,
  reviewerId,
  rating = 0,
  title = "",
  description = "",
  createdAt = null,
}) {
  const [reviewerData, setReviewerData] = useState(reviewer);
  const [loading, setLoading] = useState(!reviewer && !!reviewerId);

  useEffect(() => {
    // Only fetch if we don't have the object but we DO have an ID
    if (!reviewerData && reviewerId) {
    //   setLoading(true);
      fetch(`/api/users/${reviewerId}`)
        .then((res) => res.json())
        .then((data) => {
          setReviewerData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching reviewer:", err);
          setLoading(false);
        });
    }
  }, [reviewerId]); // Removed reviewerData from dependency to avoid logic loops

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => {
      const fullStars = Math.floor(rating);
      const hasHalfStar = rating % 1 >= 0.5;
      
      let colorClass = "text-secondary";
      let opacity = 0.3;

      if (i < fullStars) {
        colorClass = "text-warning";
        opacity = 1;
      } else if (i === fullStars && hasHalfStar) {
        colorClass = "text-warning";
        opacity = 0.5;
      }

      return (
        <FontAwesomeIcon
          key={`star-${i}`}
          icon={faStar}
          className={colorClass}
          size="sm"
          style={{ opacity }}
        />
      );
    });
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="border border-gray rounded rounded-4 shadow p-4 mb-4 animate-pulse">
        <p className="text-muted">Loading review...</p>
      </div>
    );
  }

  if (!reviewerData) return null;

  return (
    <div className="border border-gray rounded rounded-4 shadow p-4 mb-4">
      {/* Reviewer Info */}
      <div className="d-flex align-items-center gap-3 mb-3">
        <Link href={`/users/${reviewerData?._id}`} className="text-decoration-none">
          {reviewerData?.profilePicture ? (
            <Image
              src={reviewerData.profilePicture}
              alt={reviewerData.username || "User"}
              width={50}
              height={50}
              className="rounded-circle"
              style={{ objectFit: "cover" }}
            />
          ) : (
            <UserIcon img="/images/default-avatar.png" size={50} />
          )}
        </Link>
        
        <div className="flex-grow-1">
          <Link href={`/users/${reviewerData?._id}`} className="text-decoration-none">
            <p className="fw-semibold text-primary mb-0">
              {reviewerData?.firstName} {reviewerData?.lastName}
            </p>
            <p className="text-muted mb-0 small">@{reviewerData?.username}</p>
          </Link>
        </div>
        
        <div className="text-end">
          <p className="text-muted small mb-0">{formatDate(createdAt)}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <div className="d-flex gap-1">{getRatingStars(rating)}</div>
        <p className="fw-semibold text-primary mb-0">{Number(rating).toFixed(1)}/5</p>
      </div>

      {/* Content */}
      <h6 className="fw-semibold text-primary mb-2">{title}</h6>
      <p className="text-secondary mb-0" style={{ whiteSpace: "pre-wrap" }}>
        {description}
      </p>
    </div>
  );
};

export default ReviewCard;