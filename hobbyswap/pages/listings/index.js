import { Image, Button } from "react-bootstrap";
import { useMemo, useState, useEffect } from "react";
import ItemCard from "../../components/item-card";

const SORT_OPTIONS = [
  { key: "popular", label: "Most Popular" },
  { key: "az", label: "A - Z" },
  { key: "za", label: "Z - A" },
];

const CATEGORY = {
  pokemon: {
    title: "POKEMON CARDS",
    icon: "/images/pokemon-icon.png",
    label: "Pokemon Card",
    aliases: ["POKEMON CARD", "POKEMON CARDS", "POKEMON"],
  },
  blindbox: {
    title: "BLIND BOXES",
    icon: "/images/blindbox-icon.png",
    label: "Blind Box",
    aliases: ["BLIND BOX", "BLIND BOXES", "BLINDBOX"],
  },
  yugioh: {
    title: "YU-GI-OH CARDS",
    icon: "/images/yugioh-icon.png",
    label: "Yu-Gi-Oh Card",
    aliases: ["YU-GI-OH CARD", "YU-GI-OH CARDS", "YUGIOH CARD", "YUGIOH CARDS", "YUGIOH"],
  },
  figurine: {
    title: "FIGURINES",
    icon: "/images/gundam-icon.png",
    label: "Figurine",
    aliases: ["FIGURINE", "FIGURINES", "GUNDAM"],
  },
};

const norm = (v = "") =>
  String(v).toUpperCase().trim().replace(/[_-]/g, " ").replace(/\s+/g, " ");

const isActiveStatus = (status) => {
  if (status === undefined || status === null || status === "") return true; // don't hide unknowns
  if (typeof status === "boolean") return status === true;
  const s = norm(status);
  return s === "ACTIVE" || s === "TRUE";
};

const categoryMatches = (docCategory, aliases) => {
  const c = norm(docCategory);
  if (!c) return false;
  if (!aliases?.length) return true; 
  // exact match or partial overlap
  return aliases.some((a) => {
    const n = norm(a);
    return c === n || c.includes(n) || n.includes(c);
  });
};

const getImageSrc = (images) => {
  if (!Array.isArray(images) || images.length === 0) return "/images/default-product.png";
  const first = images[0];
  if (typeof first === "string" && first.trim()) return first;
  if (first && typeof first === "object" && typeof first.url === "string") return first.url;
  return "/images/default-product.png";
};

const sortItems = (items, sortKey) => {
  const arr = [...items];
  if (sortKey === "az") arr.sort((a, b) => a.name.localeCompare(b.name));
  if (sortKey === "za") arr.sort((a, b) => b.name.localeCompare(a.name));
  if (sortKey === "popular") {
    arr.sort((a, b) => new Date(b.datePosted || 0) - new Date(a.datePosted || 0));
  }
  return arr;
};

export default function DashboardHome() {
  const [activeCategory, setActiveCategory] = useState("pokemon");
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("popular");
  const [sortOpen, setSortOpen] = useState(false);

  const active = CATEGORY[activeCategory];

  useEffect(() => {
    let ignore = false;

    (async () => {
      try {
        setLoading(true);
        setErrorMsg("");

        const res = await fetch("/api/listings", { cache: "no-store" });
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error?.message || "Failed to fetch listings");

        const fetched = Array.isArray(data?.listings)
          ? data.listings
          : Array.isArray(data?.data?.listings)
          ? data.data.listings
          : [];

        if (!ignore) setListings(fetched);
      } catch (e) {
        if (!ignore) {
          console.error(e);
          setErrorMsg(e.message || "Failed to load listings");
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

  const visibleItems = useMemo(() => {
    let items = listings.filter((x) => categoryMatches(x.category, active.aliases));

    items = items.filter((x) => isActiveStatus(x.status));

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      items = items.filter((x) => {
        const name = String(x.itemName || x.title || "").toLowerCase();
        const desc = String(x.description || "").toLowerCase();
        const loc = String(x.location || "").toLowerCase();
        return name.includes(q) || desc.includes(q) || loc.includes(q);
      });
    }

    const mapped = items.map((x) => ({
      id: x._id || x.id,
      name: x.itemName || x.title || "Untitled",
      desc: x.description || "No description provided.",
      img: getImageSrc(x.images),
      datePosted: x.datePosted || x.createdAt,
    }));

    return sortItems(mapped, sortKey);
  }, [listings, active.aliases, query, sortKey]);

  const sortLabel =
    SORT_OPTIONS.find((o) => o.key === sortKey)?.label ?? "Most Popular";

  return (
    <>
      <div className="hero-section" />

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
                  aria-pressed={activeCategory === key}
                >
                  <Image src={c.icon} alt={`${c.label} Icon`} fluid />
                  <p className={`fw-semibold mt-2 ${activeCategory === key ? "text-primary" : "text-secondary"}`}>
                    {c.label}
                  </p>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="quick-browse">
        <div className="container-md px-4">
          <h2 className="text-center mt-5">{active.title}</h2>
           <hr
            className="my-4 w-100 border-0"
            style={{ height: "2px", backgroundColor: "#c2d1e4ff" }}
            aria-hidden="true"
          />
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <Button className="btn-light text-muted px-5 rounded-pill" onClick={() => setShowFilters((v) => !v)}>Search By Title &#9662;</Button>
            </div>

            <div className="position-relative">
              <button
                type="button"
                className="btn btn-link p-0 text-decoration-none fw-semibold"
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

          {showFilters && (
            <div className="border rounded-3 p-3 mb-4 bg-white">
              <label className="form-label fw-semibold mb-1">Search</label>
              <input
                className="form-control"
                placeholder="Search by item name, description, location..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          )}

          {loading && <p className="text-center">Loading listings...</p>}
          {!loading && errorMsg && <p className="text-center text-danger">{errorMsg}</p>}

          {!loading && !errorMsg && (
            <>
              <div className="row justify-content-center g-5 p-6">
                {visibleItems.slice(0, 6).map((item) => (
                  <div key={item.id} className="col-12 col-sm-6 col-md-4 d-flex justify-content-center">
                    <ItemCard img={item.img} name={item.name} desc={item.desc} saved={false} />
                  </div>
                ))}
              </div>

              {visibleItems.length === 0 && (
                <p className="text-center text-muted py-4">No listings found in this category.</p>
              )}
            </>
          )}
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
  );
}
