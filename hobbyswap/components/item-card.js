import Image from "next/image";
import { Button } from "react-bootstrap";
import BookmarkIcon from "./bookmark-icon";

export default function ItemCard({ img, name, desc, saved }) {
  return (
    <div style={{ width: 280 }}>
      <Image
        className="drop-shadow"
        alt={name}
        src={img}
        width={278}
        height={385}
        style={{ objectFit: "contain" }}
      />
      <div>
        <div
          className="d-flex justify-content-between"
          style={{
            marginTop: 20,
          }}
        >
          <p className="h3">{name}</p>
          <BookmarkIcon fill={saved} />
        </div>
        <p>{desc}</p>
      </div>
      <Button className="w-100" variant="secondary">
        Trade Now
      </Button>
    </div>
  );
}
