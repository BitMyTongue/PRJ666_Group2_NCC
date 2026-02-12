"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image } from "react-bootstrap";
import { useEffect, useMemo, useState } from "react";
FontAwesomeIcon;
import {
  faUserCircle,
  faArrowDown,
  faShoppingBag,
  faMessage,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import ItemCard from "../components/item-card";

const norm = (v = "") =>
  String(v).toUpperCase().trim().replace(/[_-]/g, " ").replace(/\s+/g, " ");

const isActiveStatus = (status) => {
  if (status === undefined || status === null || status === "") return true;
  if (typeof status === "boolean") return status === true;
  const s = norm(status);
  return s === "ACTIVE" || s === "TRUE";
};

const categoryMatches = (docCategory, aliases) => {
  const c = norm(docCategory);
  if (!c) return false;
  return aliases.some((a) => {
    const n = norm(a);
    return c === n || c.includes(n) || n.includes(c);
  });
};

const getImageSrc = (images) => {
  if (!Array.isArray(images) || images.length === 0)
    return "/images/default-product.png";
  const first = images[0];
  if (typeof first === "string" && first.trim()) return first;
  if (first && typeof first === "object" && typeof first.url === "string")
    return first.url;
  return "/images/default-product.png";
};

const sortNewest = (items) =>
  [...items].sort(
    (a, b) => new Date(b.datePosted || 0) - new Date(a.datePosted || 0),
  );

export default function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        // Get User
        const token = localStorage.getItem("token");
        if (token) {
          fetch("/api/auth/protect", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((res) => res.json())
          .then((data) => setUser(data.user))
        }

        // Get listings
        const res = await fetch("/api/listings", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok)
          throw new Error(data?.error?.message || "Failed to fetch listings");

        const fetched = Array.isArray(data?.listings)
          ? data.listings
          : Array.isArray(data?.data?.listings)
            ? data.data.listings
            : [];

        if (!ignore) setListings(fetched);
      } catch (err) {
        if (!ignore) {
          console.error(err);
          setErrorMsg(err.message || "Failed to load listings");
          setListings([]);
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, []);

  const pokemonCards = useMemo(() => {
    const aliases = ["POKEMON CARD", "POKEMON CARDS", "POKEMON"];
    const filtered = listings
      .filter((x) => categoryMatches(x.category, aliases))
      .filter((x) => isActiveStatus(x.status))
      .map((x) => ({
        id: x._id || x.id,
        ownerId: x.userId || x.ownerId,
        name: x.itemName || x.title || "Untitled",
        desc: x.description || "No description provided.",
        img: getImageSrc(x.images),
        datePosted: x.datePosted || x.createdAt,
      }));

    return sortNewest(filtered).slice(0, 3);
  }, [listings]);

  const blindBoxes = useMemo(() => {
    const aliases = ["BLIND BOX", "BLIND BOXES", "BLINDBOX"];
    const filtered = listings
      .filter((x) => categoryMatches(x.category, aliases))
      .filter((x) => isActiveStatus(x.status))
      .map((x) => ({
        id: x._id || x.id,
        ownerId: x.userId || x.ownerId,
        name: x.itemName || x.title || "Untitled",
        desc: x.description || "No description provided.",
        img: getImageSrc(x.images),
        datePosted: x.datePosted || x.createdAt,
      }));

    return sortNewest(filtered).slice(0, 3);
  }, [listings]);

  return (
    <>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container-md d-flex flex-column justify-content-center align-items-start vh-100 ">
          <p className="text-white fw-regular fs-5">
            Trade Smarter. Collect Better.
          </p>
          <p className="text-white fw-bold fs-1 text-capitalize">
            Join a community built for safe, <br />
            fair, and fun swaps.
          </p>
          <p className="text-white">
            Lorem ipsum dolor sit amet consectetur. Congue aliquam sit quis
            ultrices interdum sit.
          </p>
          <button className="btn btn-light text-primary rounded-5 fw-bold mt-4 px-4 fs-5">
            <Link
              href="/register"
              className="link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover fw-semibold"
            >
              Join Now
            </Link>
          </button>
        </div>
      </div>
      {/* Category Section */}
      <div className="bg-light">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
              <Image src="/images/pokemon-icon.png" alt="Pokemon Icon" fluid />
              <p className="text-primary fw-semibold">Pokemon Card</p>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
              <Image
                src="/images/blindbox-icon.png"
                alt="Blind Box Icon"
                fluid
              />
              <p className="text-primary fw-semibold">Blind Box</p>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
              <Image src="/images/yugioh-icon.png" alt="Yugioh Icon" fluid />
              <p className="text-primary fw-semibold">Yu-Gi-Oh Card</p>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
              <Image src="/images/gundam-icon.png" alt="Figurine Icon" fluid />
              <p className="text-primary fw-semibold">Figurine</p>
            </div>
          </div>
        </div>
      </div>
      {/* Quick Browse section */}

      <section className="quick-browse">
        <div className="container-md px-4">
          {/* Loading / Error */}
          {loading && <p className="text-center mt-4">Loading listings...</p>}
          {!loading && errorMsg && (
            <p className="text-center text-danger mt-4">{errorMsg}</p>
          )}

          {/* Pokemon Section */}
          <h2 className="quick-browse text-center text-sm fw-semibold text-primary tracking-[0.25em] text-slate-900 mt-8">
            Pokemon Cards
          </h2>
          <div className="row justify-content-center g-5 px-6 pt-0 pb-5">
            {!loading &&
              !errorMsg &&
              pokemonCards.map((item) => (
                <div
                  key={item.id}
                  className="col-12 col-sm-6 col-md-4 d-flex justify-content-center"
                >
                  <ItemCard
                    img={item.img}
                    name={item.name}
                    desc={item.desc}
                    saved={false}
                    url={`/listings/${item.id}`}
                    listingId={item.id}
                    ownerId={item.ownerId}
                    currentUserId={user?._id}
                  />
                </div>
              ))}
          </div>
          {!loading && !errorMsg && pokemonCards.length === 0 && (
            <p className="text-center text-muted">No Pokemon listings found.</p>
          )}

          {/* Blind Box Section */}
          <h2 className="quick-browse text-center text-sm fw-semibold text-primary tracking-[0.25em] text-slate-900 mt-5">
            Blind Boxes
          </h2>
          <div className="row justify-content-center g-5 p-6 pt-0">
            {!loading &&
              !errorMsg &&
              blindBoxes.map((item) => (
                <div
                  key={item.id}
                  className="col-12 col-sm-6 col-md-4 d-flex justify-content-center"
                >
                  <ItemCard
                    img={item.img}
                    name={item.name}
                    desc={item.desc}
                    saved={false}
                    url={`/listings/${item.id}`}
                    listingId={item.id}
                    ownerId={item.ownerId}
                    currentUserId={user?._id}
                  />
                </div>
              ))}
          </div>
          {!loading && !errorMsg && blindBoxes.length === 0 && (
            <p className="text-center text-muted">
              No Blind Box listings found.
            </p>
          )}
        </div>
      </section>

      {/* Join Community Section */}
      <div className="bg-light text-primary py-5 my-5 text-center d-flex justify-content-center align-items-center flex-column position-relative">
        <Image
          src="/images/pikachu.png"
          alt="Pikachu"
          className="position-absolute pikachu-position d-none d-md-block"
        />
        <div className="d-flex flex-column justify-content-center align-items-start">
          <p className="fw-bold fs-4">Check out more feature collections</p>
          <button className="btn btn-primary text-white rounded-5 fw-bold mt-0 px-4 fs-5">
            Explore the market
          </button>
        </div>
        <Image
          src="/images/smiski-speaker.png"
          alt="Smiski"
          className="position-absolute smiski-position d-none d-md-block"
        />
      </div>
      {/* Explore Section */}
      <div className="container-md">
        <div className="row my-5 align-items-start">
          <p className="text-center fw-regular fs-5 text-primary my-4">
            Ready to explore
          </p>
          <p className="fw-bold fs-2 text-center text-primary text-uppercase">
            Just 4 steps, it works really easy
          </p>
          <div className="container d-flex justify-content-center align-items-center gap-5 mt-3">
            <div className="col-md-6">
              <Image
                src="/images/open-online-store.png"
                alt="Open Online Store"
                fluid
                className="d-md-block d-none"
              />
            </div>
            <div className="container justify-content-start align-items-start mb-5">
              {/* Step 1 */}
              <div className="row">
                <div className="col-2 d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faUserCircle}
                    size="3x"
                    className="mb-3 text-primary"
                  />
                  <FontAwesomeIcon
                    icon={faArrowDown}
                    size="2x"
                    className="mb-3 text-primary"
                  />
                </div>
                <div className="col ">
                  <p className="fw-bold fs-5 text-primary mb-1">
                    1. Create an account
                  </p>
                  <p className="text-primary">
                    Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit
                    amet consectetur.
                  </p>
                </div>
              </div>
              {/* Step 2 */}
              <div className="row">
                <div className="col-2 d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faShoppingBag}
                    size="1x"
                    className="mb-3 text-white bg-primary img-thumbnail p-3 rounded-circle"
                  />
                  <FontAwesomeIcon
                    icon={faArrowDown}
                    size="2x"
                    className="mb-3 text-primary"
                  />
                </div>
                <div className="col">
                  <p className="fw-bold fs-5 text-primary mb-1">
                    2. List & Browse Collectibles
                  </p>
                  <p className="text-primary">
                    Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit
                    amet consectetur.
                  </p>
                </div>
              </div>
              {/* Step 3 */}
              <div className="row">
                <div className="col-2 d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faMessage}
                    size="1x"
                    className="mb-3 text-white bg-primary img-thumbnail p-3 rounded-circle"
                  />
                  <FontAwesomeIcon
                    icon={faArrowDown}
                    size="2x"
                    className="mb-3 text-primary"
                  />
                </div>
                <div className="col">
                  <p className="fw-bold fs-5 text-primary mb-1">3. Connect</p>
                  <p className="text-primary">
                    Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit
                    amet consectetur.
                  </p>
                </div>
              </div>
              {/* Step 4 */}
              <div className="row">
                <div className="col-2 d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faRotate}
                    size="1x"
                    className="mb-3 text-white bg-primary img-thumbnail p-3 rounded-circle"
                  />
                </div>
                <div className="col">
                  <p className="fw-bold fs-5 text-primary mb-1">4. Trade</p>
                  <p className="text-primary">
                    Lorem ipsum dolor sit amet consectetur.Lorem ipsum dolor sit
                    amet consectetur.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Short about us */}
      <div className="bg-light text-primary py-md-5 mt-5 position-relative">
        <div className="container-md d-flex flex-column justify-content-start align-items-start">
          <div className="col-md-5 col-12 py-5">
            <p className="fw-bold fs-4 text-primary text-uppercase">About Us</p>
            <p className="fw-regular text-primary lh-lg">
              Lorem ipsum dolor sit amet consectetur. A commodo arcu dictum
              volutpat donec magna magna lacus eu. Ornare aliquam tristique
              feugiat amet lobortis. Erat dolor gravida augue tristique dolor.
              Metus donec viverra pulvinar enim est sagittis. Eu mauris lectus
              enim fringilla faucibus blandit. Sed odio viverra ut enim
              suspendisse. Sapien pharetra quis elit interdum. Sit ultrices nisi
              lectus orci volutpat ullamcorper vitae
            </p>
          </div>
        </div>
        <Image
          src="/images/gundam.png"
          alt="Gundam"
          className="position-absolute gundam-landing-position d-none d-md-block"
        />
      </div>
    </>
  );
}
