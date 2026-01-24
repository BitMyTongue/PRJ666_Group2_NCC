import Image from "next/image";

export default function UserIcon({ user, img, size }) {
  return (
    <>
      <div
        style={{
          display: "block",
          borderRadius: "100px",
          overflow: "hidden",
          width: size,
          height: size,
          backgroundColor: "white",
        }}
      >
        <Image
          alt={user ?? "null"}
          src={img ?? "/images/default-avatar.png"}
          width={size}
          height={size}
          style={{
            objectFit: "cover",
            aspectRatio: "1/1",
          }}
        />
      </div>
    </>
  );
}
