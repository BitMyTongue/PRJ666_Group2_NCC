export default function BookmarkIcon({ fill, size = 32, ...props }) {
  return (
    <div {...props}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_473_375)">
          <path
            d="M25 29L16 22.8889L7 29V9.44444C7 8.79614 7.27092 8.17438 7.75315 7.71596C8.23539 7.25754 8.88944 7 9.57143 7H22.4286C23.1106 7 23.7646 7.25754 24.2468 7.71596C24.7291 8.17438 25 8.79614 25 9.44444V29Z"
            fill={fill ? "#001F54" : ""}
            stroke="#001F54"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
}
