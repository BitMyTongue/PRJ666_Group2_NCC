import { useRouter } from "next/router";

export default function Listings() {
  const router = useRouter();
  const { category } = router.query;
  const { page } = router.query;
  if (page && category) {
    return (
      <p>
        {" "}
        Products for page: {page} in category: {category}
      </p>
    );
  } else {
    return <p> Page and/or Category Parameters Missing</p>;
  }
}
