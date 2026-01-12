import Link from "next/link";
import Navbar from "./navbar";
import Footer from "./footer";

export default function Layout(props) {
  return (
    <>
      <Navbar />
      {props.children}
      <Footer />
    </>
  );
}
