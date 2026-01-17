import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as solidBookmark } from "@fortawesome/free-solid-svg-icons";
import { faBookmark as outlineBookmark } from "@fortawesome/free-regular-svg-icons";

export default function BookmarkIcon({ fill, size = "xl", ...props }) {
  return (
    <FontAwesomeIcon
      color="#001F54"
      size={size}
      icon={fill ? solidBookmark : outlineBookmark}
      {...props}
    />
  );
}
