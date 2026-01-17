import { useState } from "react";
import UserIcon from "./user-icon";
import Rating from "./rating";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbsUp as solidThumbsUp,
  faThumbsDown as solidThumbsDown,
} from "@fortawesome/free-solid-svg-icons";
import {
  faThumbsUp as outlineThumbsUp,
  faThumbsDown as outlineThumbsDown,
} from "@fortawesome/free-regular-svg-icons";
import Image from "next/image";

export default function UserReview({
  userName,
  userImg,
  date,
  title,
  desc,
  rating,
  item,
  likes,
  dislikes,
  isLiked = false,
  isDisliked = false,
}) {
  const [likeToggle, setLikeToggle] = useState(isLiked);
  const [dislikeToggle, setDislikeToggle] = useState(isDisliked);
  const [likesNum, setLikesNum] = useState(likes);
  const [dislikesNum, setDislikesNum] = useState(dislikes);
  return (
    <div className="d-flex gap-3 my-4" style={{ width: "100%" }}>
      <div className="d-flex flex-column" style={{ width: "20%" }}>
        <p>{date}</p>
        <div className="d-flex gap-2">
          <UserIcon user={userName} img={userImg} size={40} />
          <div>{userName}</div>
        </div>
      </div>
      <div
        className="d-flex flex-column gap-3"
        style={{
          width: "60%",
        }}
      >
        <Rating rating={rating} />
        <p>
          <strong>{title}</strong>
        </p>
        <p>{desc}</p>
        {item && (
          <div
            className="d-flex gap-2 py-3 px-4 sm-d-shadow "
            style={{
              backgroundColor: "#D9D9D9",
              borderRadius: 18,
            }}
          >
            <Image
              className="object-fit-contain"
              alt={item.title}
              src={item.img}
              width={149}
              height={196}
            />
            <div>
              <h4>{item.title}</h4>
              <p style={{ height: "100px", overflowY: "auto" }}>{item.desc}</p>
            </div>
          </div>
        )}
      </div>
      <div
        className="d-flex justify-content-end gap-2 "
        style={{
          color: "#9A9393",
          width: "20%",
        }}
      >
        <span>Helpful?</span>
        <div>
          <FontAwesomeIcon
            style={{ cursor: "pointer" }}
            icon={likeToggle ? solidThumbsUp : outlineThumbsUp}
            onClick={() => {
              setLikeToggle(!likeToggle);
            }}
          />
          <span>
            {"("}
            {likesNum}
            {")"}
          </span>
        </div>
        <div>
          <FontAwesomeIcon
            style={{ cursor: "pointer" }}
            icon={dislikeToggle ? solidThumbsDown : outlineThumbsDown}
            onClick={() => {
              setDislikeToggle(!dislikeToggle);
            }}
          />
          <span>
            {"("}
            {dislikesNum}
            {")"}
          </span>
        </div>
      </div>
    </div>
  );
}
