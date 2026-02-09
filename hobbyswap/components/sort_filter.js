import { Button } from "react-bootstrap";
import { useState } from "react";

const SORT_OPTIONS = [
  { key: "popular", label: "Most Relevant" },
  { key: "az", label: "A - Z" },
  { key: "za", label: "Z - A" },
];

export default function SortFilter({ 
  sortKey, 
  setSortKey, 
  query, 
  setQuery, 
  showSearch, 
  setShowSearch,
  isFilterVisible = false // The parameter you requested
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const sortLabel = SORT_OPTIONS.find((o) => o.key === sortKey)?.label ?? "Most Relevant";

  return (
    <div className="container my-5 mx-auto">
      <div className="d-flex flex-column gap-3">
        <div className="d-flex align-items-center gap-3">
          {isFilterVisible ? (
            <>
              {/* Complex Filter Buttons */}
              <Button className="btn-light text-muted px-5 rounded-pill">
                All Filters &#9662; &#9662;
              </Button>
              <Button className="btn-light text-muted px-5 rounded-pill">
                &#9734; All Types &#9662;
              </Button>
            </>
          ) : (
            /* Standard Search Toggle */
            <Button 
              className="btn-light text-muted px-5 rounded-pill" 
              onClick={() => setShowSearch(!showSearch)}
            >
              Search By Title {showSearch ? "▴" : "▾"}
            </Button>
          )}

          {/* Sort Dropdown */}
          <div className="position-relative ms-auto">
            <button
              type="button"
              className="btn btn-link p-0 text-decoration-none fw-semibold text-primary"
              onClick={() => setSortOpen(!sortOpen)}
            >
              <span className="me-2 text-primary">Sort By</span>
              <span className="text-muted">|</span>
              <span className="ms-2 fw-light text-dark">{sortLabel}</span>
              <span className="ms-1">▾</span>
            </button>

            {sortOpen && (
              <div className="dropdown-menu dropdown-menu-end show" style={{ position: "absolute", right: 0, top: "100%", zIndex: 10 }}>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    className={`dropdown-item ${sortKey === opt.key ? "active" : ""}`}
                    onClick={() => { setSortKey(opt.key); setSortOpen(false); }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Search Input (Visible if not in complex filter mode OR if search is toggled) */}
        {(showSearch || !isFilterVisible) && (
          <div className="mt-2">
            <input
              className="form-control rounded-pill px-4"
              placeholder="Filter by name or description..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}