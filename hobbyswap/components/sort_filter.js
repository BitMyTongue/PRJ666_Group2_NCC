import { Button } from "react-bootstrap";
import { useState } from "react";

const SORT_OPTIONS = [
  { key: "most-recent", label: "Most Recent" },
  { key: "popular",     label: "Most Popular" },
  { key: "az",          label: "A - Z" },
  { key: "za",          label: "Z - A" },
  { key: "none",        label: "No Sorting" },
];

const STATUS_OPTIONS = [
  { key: "ACTIVE",    label: "Active" },
  { key: "COMPLETE",  label: "Completed" },
  { key: "IN TRADE",  label: "In Trade" },
];

const CATEGORY_OPTIONS = [
  { key: "POKEMON CARD", label: "Pokemon Card" },
  { key: "BLIND BOX",    label: "Blind Box" },
  { key: "YUGIOH CARD",  label: "Yu-Gi-Oh Card" },
  { key: "FIGURINE",     label: "Figurine" },
];

const CONDITION_OPTIONS = [
  { key: "NEW",  label: "New" },
  { key: "USED", label: "Used" },
];

export default function SortFilter({
  sortKey,
  setSortKey,
  query,
  setQuery,
  showSearch,
  setShowSearch,
  isFilterVisible = false,
  selectedCategory = null,
  setSelectedCategory = () => {},
  selectedCondition = null,
  setSelectedCondition = () => {},
  selectedStatus = null,
  setSelectedStatus = () => {},
  isConditionVisible = true,
  isStatusVisible = false,
  statusOptions = STATUS_OPTIONS,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [conditionOpen, setConditionOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  const sortLabel = SORT_OPTIONS.find((o) => o.key === sortKey)?.label ?? "Most Recent";
  const categoryLabel = selectedCategory
    ? CATEGORY_OPTIONS.find((o) => o.key === selectedCategory)?.label ?? "All Types"
    : "All Types";
  const conditionLabel = selectedCondition
    ? CONDITION_OPTIONS.find((o) => o.key === selectedCondition)?.label ?? "All Conditions"
    : "All Conditions";
  const statusLabel = selectedStatus
    ? statusOptions.find((o) => o.key === selectedStatus)?.label ?? "All Status"
    : "All Status";

  return (
    <div className="container my-5 mx-auto">
      <div className="d-flex flex-column gap-3">
        <div className="d-flex align-items-center gap-3 flex-wrap">
          {isFilterVisible ? (
            <>
              {/* Condition Filter */}
              {isConditionVisible && (
                <div className="position-relative">
                  <button
                    type="button"
                    className="btn btn-light text-muted px-4 rounded-pill"
                    onClick={() => { setConditionOpen(!conditionOpen); setCategoryOpen(false); setStatusOpen(false); }}
                  >
                    {conditionLabel} &#9662;
                  </button>
                  {conditionOpen && (
                    <div className="dropdown-menu show" style={{ position: "absolute", left: 0, top: "100%", zIndex: 10 }}>
                      <button
                        className={`dropdown-item ${selectedCondition === null ? "active" : ""}`}
                        onClick={() => { setSelectedCondition(null); setConditionOpen(false); }}
                      >
                        All Conditions
                      </button>
                      {CONDITION_OPTIONS.map((opt) => (
                        <button
                          key={opt.key}
                          className={`dropdown-item ${selectedCondition === opt.key ? "active" : ""}`}
                          onClick={() => { setSelectedCondition(opt.key); setConditionOpen(false); }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Category Filter */}
              <div className="position-relative">
                <button
                  type="button"
                  className="btn btn-light text-muted px-4 rounded-pill"
                  onClick={() => { setCategoryOpen(!categoryOpen); setConditionOpen(false); setStatusOpen(false); }}
                >
                  &#9734; {categoryLabel} &#9662;
                </button>
                {categoryOpen && (
                  <div className="dropdown-menu show" style={{ position: "absolute", left: 0, top: "100%", zIndex: 10 }}>
                    <button
                      className={`dropdown-item ${selectedCategory === null ? "active" : ""}`}
                      onClick={() => { setSelectedCategory(null); setCategoryOpen(false); }}
                    >
                      All Types
                    </button>
                    {CATEGORY_OPTIONS.map((opt) => (
                      <button
                        key={opt.key}
                        className={`dropdown-item ${selectedCategory === opt.key ? "active" : ""}`}
                        onClick={() => { setSelectedCategory(opt.key); setCategoryOpen(false); }}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Status Filter */}
              {isStatusVisible && (
                <div className="position-relative">
                  <button
                    type="button"
                    className="btn btn-light text-muted px-4 rounded-pill"
                    onClick={() => { setStatusOpen(!statusOpen); setConditionOpen(false); setCategoryOpen(false); }}
                  >
                    {statusLabel} &#9662;
                  </button>
                  {statusOpen && (
                    <div className="dropdown-menu show" style={{ position: "absolute", left: 0, top: "100%", zIndex: 10 }}>
                      <button
                        className={`dropdown-item ${selectedStatus === null ? "active" : ""}`}
                        onClick={() => { setSelectedStatus(null); setStatusOpen(false); }}
                      >
                        All Status
                      </button>
                      {statusOptions.map((opt) => (
                        <button
                          key={opt.key}
                          className={`dropdown-item ${selectedStatus === opt.key ? "active" : ""}`}
                          onClick={() => { setSelectedStatus(opt.key); setStatusOpen(false); }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
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
              onClick={() => { setSortOpen(!sortOpen); setConditionOpen(false); setCategoryOpen(false); setStatusOpen(false); }}
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

        {/* Search Input */}
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
