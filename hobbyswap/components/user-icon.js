import Image from "next/image";

export default function UserIcon(props) {
  return (
    <>
      <div
        style={{
          display: "block",
          borderRadius: "100px",
          overflow: "hidden",
          width: props.size,
          height: props.size,
          backgroundColor: "white",
        }}
      >
        <Image
          alt={props.user ?? "user"}
          src={props.img}
          width={props.size}
          height={props.size}
          style={{
            objectFit: "cover",
            aspectRatio: "1/1",
          }}
        />
      </div>
    </>
  );
}
