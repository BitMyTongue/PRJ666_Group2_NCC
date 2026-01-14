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

export default function Rating({ rating = 0, size = 24 }) {
  return (
    <div style={{ gap: "5px", display: "flex" }}>
      <Star fill={rating > 0} size={size} />
      <Star fill={rating > 1} size={size} />
      <Star fill={rating > 2} size={size} />
      <Star fill={rating > 3} size={size} />
      <Star fill={rating > 4} size={size} />
    </div>
  );
}
