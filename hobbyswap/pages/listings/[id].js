import { useRouter } from "next/router";

export default function Listing() {
  const router = useRouter();
  const { id } = router.query;
  return <h1>Listing ID: {id}</h1>;
}
