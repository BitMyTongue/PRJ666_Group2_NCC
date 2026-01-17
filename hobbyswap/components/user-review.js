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
    <div style={{ display: "flex", gap: 20, marginBlock: 20, width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column", width: "20%" }}>
        <p>{date}</p>
        <div style={{ display: "flex", gap: 10 }}>
          <UserIcon user={userName} img={userImg} size={40} />
          <div>{userName}</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 20,
          flexDirection: "column",
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
            style={{
              display: "flex",
              gap: 10,
              backgroundColor: "#D9D9D9",
              paddingBlock: 20,
              paddingInline: 30,
              borderRadius: 18,
              boxShadow: "1px 1px 5px gray",
            }}
          >
            <Image alt={item.title} src={item.img} width={149} height={196} />
            <div>
              <h4>{item.title}</h4>
              <p style={{ height: "100px", overflowY: "auto" }}>{item.desc}</p>
            </div>
          </div>
        )}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "end",
          gap: 10,
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
