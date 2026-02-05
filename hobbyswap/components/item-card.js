import Image from "next/image";
import { Button } from "react-bootstrap";
import BookmarkIcon from "./bookmark-icon";

export default function ItemCard({ img, name, desc, saved,url }) {
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
          <p className="fw-semibold text-primary h3">{name}</p>
          <BookmarkIcon fill={saved} />
        </div>
        <p className="text-primary">{desc}</p>
      </div>
      <div className="d-flex gap-2">
        <Button className="w-100" variant="light rounded-pill text-primary" href={url}>
          View Details
        </Button>
        <Button className="w-100" variant="primary rounded-pill">
          Trade Now
        </Button>
      </div>
    </div>
  );
}
