import Image from "next/image";

export default function UserIcon({ user, img, size }) {
  return (
    <>
      <Image
        alt={user ?? "null"}
        src={img ?? "/images/default-avatar.png"}
        width={size}
        height={size}
        style={{
          display: "block",
          borderRadius: "100px",
          overflow: "hidden",
          objectFit: "cover",
          aspectRatio: "1/1",
        }}
      />
    </>
  );
}
