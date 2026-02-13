import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as outlineBookmark } from "@fortawesome/free-regular-svg-icons";

export default function BookmarkIcon({
  fill = false,                 // controlled value
  onChange,                     // REQUIRED for controlled usage
  size = "xl",
  colorFilled = "#001F54",
  colorOutline = "#001F54",
  ariaLabel = "Bookmark",
  disabled = false,
  className = "",
  ...props
}) {
  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    const next = !fill;
    onChange?.(next, e); 
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-pressed={fill}
      aria-label={ariaLabel}
      className={className}
      style={{
        background: "transparent",
        border: "none",
        padding: 0,
        cursor: disabled ? "not-allowed" : "pointer",
        lineHeight: 0,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <FontAwesomeIcon
        icon={fill ? solidBookmark : outlineBookmark}
        size={size}
        color={fill ? colorFilled : colorOutline}
        {...props}
      />
    </button>
  );
}
