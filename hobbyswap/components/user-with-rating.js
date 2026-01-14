import { useRouter } from "next/router";
import Rating from "./rating";
import UserIcon from "./user-icon";

export default function UserWithRating({ userName, userImg, rating }) {
  const router = useRouter();
  return (
    <div
      style={{ display: "flex", gap: 20, cursor: "pointer" }}
      onClick={() => {
        router.reload();
      }}
    >
      <UserIcon user={userName} img={userImg} size={50} />
      <div>
        <em>{userName}</em>
        <Rating rating={rating} size={16} />
      </div>
    </div>
  );
}
