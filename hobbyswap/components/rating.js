import React, { useState } from 'react';
import { faStar as emptyStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as filledStar } from '@fortawesome/free-solid-svg-icons';
import { faStarHalfAlt as halfStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Star = function Star({ fill, size = 24 }) {
  return (
    <svg
      display={"inline"}
      width={size}
      height={size}
      viewBox={`0 0 24 24`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M11.1797 1L14.3252 8.2408L21.3593 9.40904L16.2695 15.0421L17.4707 23L11.1797 19.2408L4.88863 23L6.08983 15.0421L1 9.40904L8.03414 8.2408L11.1797 1Z"
        fill="#FF6B35"
      />
      <path
        d="M11.1797 1L14.3252 8.2408L21.3593 9.40904L16.2695 15.0421L17.4707 23L11.1797 19.2408L4.88863 23L6.08983 15.0421L1 9.40904L8.03414 8.2408L11.1797 1Z"
        fill="#FF6B35"
      />
      <path
        d="M11.1797 1L14.3252 8.2408L21.3593 9.40904L16.2695 15.0421L17.4707 23L11.1797 19.2408L4.88863 23L6.08983 15.0421L1 9.40904L8.03414 8.2408L11.1797 1Z"
        fill={fill ? "#FF6B35" : "white"}
      />
      <path
        d="M11.1797 1L14.3252 8.2408L21.3593 9.40904L16.2695 15.0421L17.4707 23L11.1797 19.2408L4.88863 23L6.08983 15.0421L1 9.40904L8.03414 8.2408L11.1797 1Z"
        stroke="#FF6B35"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export function Rating({ rating = 0, size = 24 }) {
  return (
    <div className="d-flex gap-1">
      <Star fill={rating > 0} size={size} />
      <Star fill={rating > 1} size={size} />
      <Star fill={rating > 2} size={size} />
      <Star fill={rating > 3} size={size} />
      <Star fill={rating > 4} size={size} />
    </div>
  );
}

export function StarRating ({ onRatingChange = null }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleMouseMove = (e, starValue) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    setHover(isLeftHalf ? starValue - 0.5 : starValue);
  };

  const handleClick = (e, starValue) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    const newRating = isLeftHalf ? starValue - 0.5 : starValue;
    setRating(newRating);
    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  const getStarIcon = (starValue, currentRating) => {
    if (starValue <= currentRating) return filledStar;
    if (starValue - 0.5 <= currentRating) return halfStar;
    return emptyStar;
  };

  const displayRating = hover || rating;

return (
  <div className="star-rating d-flex align-items-center">
    {[...Array(5)].map((_, index) => {
      const starValue = index + 1;
      return (
          <FontAwesomeIcon 
            icon={getStarIcon(starValue, displayRating)} 
            key={starValue} 
            onClick={(e) => handleClick(e, starValue)} 
            onMouseMove={(e) => handleMouseMove(e, starValue)}
            onMouseLeave={() => setHover(0)} 
            className="text-secondary m-0"
            size='2x'
            style={{ cursor: 'pointer' }}
          />
      );
    })}
    <p className='mb-0 ms-2 fs-4 fw-semibold text-primary'>{displayRating.toFixed(1)}/5</p>
  </div>    
);

};
