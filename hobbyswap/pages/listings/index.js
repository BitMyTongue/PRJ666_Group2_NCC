import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Image, Button } from "react-bootstrap";
FontAwesomeIcon;
import { useMemo, useState } from "react";
import ItemCard from "../../components/item-card";
import img1 from '../../public/images/charizard-card.png';

const pokemonCards = [
  { id: 1, name: "Raichu Card", img: img1 },
  { id: 2, name: "Arceus V Card", img: img1 },
  { id: 3, name: "Charizard Card", img: img1 },
  { id: 4, name: "Pikachu Card", img: img1 },
  { id: 5, name: "Mewtwo Card", img: img1 },
  { id: 6, name: "Gengar Card", img: img1 },
];

const blindBoxs = [
  { id: 1, name: "Smiski Speaker", img: img1 },
  { id: 2, name: "Smiski Angel", img: img1 },
  { id: 3, name: "Smiski Devil", img: img1 },
  { id: 4, name: "Smiski Thief", img: img1 },
  { id: 5, name: "Smiski Musician", img: img1 },
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
  { id: 6, name: "Gundam Strike Freedom", img: img1 },
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



export default function DashboardHome() {
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
      <div className="hero-section"/>
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
              <Button className="btn-light text-muted px-5 rounded-pill" onClick={() => setShowFilters((v) => !v)}>
                All Filters &#9662;
              </Button>
              <Button className="btn-light text-muted px-5 rounded-pill mx-3">
                &#9734; All Types &#9662;
              </Button>
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
                <span className="me-2 text-primary fw-semibold ms-auto">Sort By</span>
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
    </>
  )
}
