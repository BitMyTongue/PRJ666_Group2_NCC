import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, Button } from "react-bootstrap";
FontAwesomeIcon;
import {
  faUserCircle,
  faArrowDown,
  faShoppingBag,
  faMessage,
  faRotate,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { useMemo, useState } from "react";
import ItemCard from "../components/item-card";
import img1 from '../public/images/fake-card.png';
import img2 from '../public/images/charizard-card.png';

const pokemonCards = [
  { id: 1, name: "Raichu Card", img: img1 },
  { id: 2, name: "Arceus V Card", img: img1 },
  { id: 3, name: "Charizard Card", img: img1 },
  { id: 4, name: "Pikachu Card", img: img2 },
  { id: 5, name: "Mewtwo Card", img: img2 },
  { id: 6, name: "Gengar Card", img: img2 },
];

const blindBoxs = [
  { id: 1, name: "Smiski Speaker", img: img1 },
  { id: 2, name: "Smiski Angel", img: img1 },
  { id: 3, name: "Smiski Devil", img: img1 },
  { id: 4, name: "Smiski Thief", img: img2 },
  { id: 5, name: "Smiski Musician", img: img2 },
  { id: 6, name: "Smiski Sleeper", img: img1 },
]

const yugiohCards = [
  { id: 1, name: "Blue-Eyes White Dragon",img: img1 },
  { id: 2, name: "Dark Magician", img: img1 },
  { id: 3, name: "Red-Eyes Black Dragon", img: img1},
  { id: 4, name: "Exodia the Forbidden One", img: img1 },
  { id: 5, name: "Summoned Skull", img: img1 },
  { id: 6, name: "Slifer the Sky Dragon", img: img1 },
];

const figurines = [
  { id: 1, name: "Gundam RX-78-2", img: img1 },
  { id: 2, name: "Gundam Wing Zero", img: img1 },
  { id: 3, name: "Gundam Exia", img: img1 },
  { id: 4, name: "Gundam Barbatos", img: img1 },
  { id: 5, name: "Gundam Unicorn", img: img1 },
  { id: 6, name: "Gundam Strike Freedom", img: img2 },
];


const SORT_OPTIONS = [
  { key: "popular", label: "Most Popular" },
  { key: "az", label: "A - Z" },
  { key: "za", label: "Z - A" },
];

const sortItems = (items, sortKey) => {
  const arr = [...items];

  if (sortKey === "az") arr.sort((a, b) => a.name.localeCompare(b.name));
  if (sortKey === "za") arr.sort((a, b) => b.name.localeCompare(a.name));
  return arr;
};


export default function Home() {
  const [activeCategory, setActiveCategory] = useState("pokemon"); // default

  const CATEGORY = {
    pokemon: { title: "POKEMON CARDS", items: pokemonCards, icon: "/images/pokemon-icon.png", label: "Pokemon Card" },
    blindbox: { title: "BLIND BOXES", items: blindBoxs, icon: "/images/blindbox-icon.png", label: "Blind Box" },
    yugioh: { title: "YU-GI-OH CARDS", items: yugiohCards, icon: "/images/yugioh-icon.png", label: "Yu-Gi-Oh Card" },
    figurine: { title: "FIGURINES", items: figurines, icon: "/images/gundam-icon.png", label: "Figurine" },
  };

  const active = useMemo(() => CATEGORY[activeCategory], [activeCategory]);

  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("popular");
  const [sortOpen, setSortOpen] = useState(false);

  const sortLabel =
    SORT_OPTIONS.find((o) => o.key === sortKey)?.label ?? "Most Popular";

  const visibleItems = useMemo(() => {
    let items = [...active.items];

    // filter
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((x) => x.name.toLowerCase().includes(q));
    }

    // sort
    return sortItems(items, sortKey);
  }, [active.items, query, sortKey]);

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
            {Object.entries(CATEGORY).map(([key, c]) => (
              <div
                key={key}
                className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center"
              >
                <button
                  type="button"
                  onClick={() => setActiveCategory(key)}
                  className="bg-transparent border-0 p-0 d-flex flex-column align-items-center"
                  style={{ cursor: "pointer" }}
                  aria-pressed={activeCategory === key}
                  aria-label={`Show ${c.label}`}
                >
                  <Image src={c.icon} alt={`${c.label} Icon`} fluid />
                  <p
                    className={`fw-semibold mt-2 ${
                      activeCategory === key ? "text-primary" : "text-secondary"
                    }`}
                  >
                    {c.label}
                  </p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      
      {/* Quick Browse section */}
      <section className="quick-browse">
        <div className="container-md px-4">
          <h2 className="quick-browse text-center text-sm font-extrabold tracking-[0.25em] text-slate-900 mt-5">
            {active.title}
          </h2>

          <hr
            className="my-4 w-100 border-0"
            style={{ height: "2px", backgroundColor: "#c2d1e4ff" }}
            aria-hidden="true"
          />

          {/* Top controls */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <Button onClick={() => setShowFilters((v) => !v)}>All Filters</Button>
              <Button className="mx-3">All Types</Button>
            </div>

            <div className="position-relative">
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none fw-semibold"
                style={{ color: "#0f172a" }}
                aria-label="Sort items"
                aria-expanded={sortOpen}
                onClick={() => setSortOpen((v) => !v)}
              >
                <span className="me-2">Sort By</span>
                <span className="text-muted">|</span>
                <span className="ms-2">{sortLabel}</span>
                <span className="ms-2">▾</span>
              </button>

              {sortOpen && (
                <div
                  className="dropdown-menu dropdown-menu-end show"
                  style={{ position: "absolute", right: 0, top: "100%", zIndex: 10 }}
                >
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.key}
                      type="button"
                      className={`dropdown-item ${sortKey === opt.key ? "active" : ""}`}
                      onClick={() => {
                        setSortKey(opt.key);
                        setSortOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filters panel */}
          {showFilters && (
            <div className="border rounded-3 p-3 mb-4 bg-white">
              <label className="form-label fw-semibold mb-1">Search</label>
              <input
                className="form-control"
                placeholder="Search by name..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}

          {/* Cards list (sorted + filtered) */}
          <div className="row justify-content-center g-5 p-6">
            {visibleItems.slice(0, 6).map((item) => (
              <div
                key={item.id}
                className="col-12 col-sm-6 col-md-4 d-flex justify-content-center"
              >
                <ItemCard
                  img={item.img}
                  name={item.name}
                  desc="Lorem ipsum dolor sit amet abc consectetur, dolor sit."
                  saved={false}
                />
              </div>
            ))}
          </div>

          <hr
            className="my-4 w-100 border-0"
            style={{ height: "2px", backgroundColor: "#c2d1e4ff" }}
            aria-hidden="true"
          />

          <div className="d-flex justify-content-center mb-5">
            <Button variant="primary" className="px-4 py-2 fw-semibold">
              View More
            </Button>
          </div>
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
