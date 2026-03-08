import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";

import UserNavbar from "@/components/user-navbar";
import Pagination from "@/components/pagination";
import SortFilter from "@/components/sort_filter";
import { ItemLongCardInline } from "@/components/base-long-card";

export default function UserBookmarksPage() {
  const router = useRouter();
  const { id } = router.query; // profile userId from /users/[id]
  const { user } = useContext(UserContext);

  const [bookmarks, setBookmarks] = useState([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState([]);
  const [pageBookmarks, setPageBookmarks] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const resultsPerPage = 10;
  const [currP, setCurrP] = useState(0);

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("popular");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);

  const isOwner = user?._id === id;

  useEffect(() => {
    if (!router.isReady || !id) return;

    const load = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const res = await fetch(`/api/bookmarks?userId=${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load bookmarks");

        setBookmarks(data.bookmarks || []);
      } catch (e) {
        setLoadError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router.isReady, id]);

  // ✅ Filter + Sort
  useEffect(() => {
    let filtered = [...bookmarks];

    // Category filter
    if (selectedCategory) {
      filtered = filtered.filter((b) => b.category === selectedCategory);
    }

    // Condition filter
    if (selectedCondition) {
      filtered = filtered.filter((b) => b.condition === selectedCondition);
    }

    // Search filter (title/description)
    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          (b.title || "").toLowerCase().includes(q) ||
          (b.description || "").toLowerCase().includes(q),
      );
    }

    // Sort
    if (sortKey === "az") {
      filtered.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortKey === "za") {
      filtered.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    } else if (sortKey === "newest") {
      filtered.sort(
        (a, b) => new Date(b.dateBookmarked) - new Date(a.dateBookmarked),
      );
    }

    setCurrP(0);
    setFilteredBookmarks(filtered);
  }, [bookmarks, query, sortKey, selectedCategory, selectedCondition]);

  // ✅ Pagination slice
  useEffect(() => {
    const startIdx = currP * resultsPerPage;
    const endIdx = startIdx + resultsPerPage;
    setPageBookmarks(filteredBookmarks.slice(startIdx, endIdx));
  }, [currP, filteredBookmarks]);

  // If user is not the owner, don’t show bookmarks page
  if (!isOwner) return null;

  return (
    <UserNavbar id={id} loading={loading}>
      {loadError ? (
        <div className="container my-5 text-center">
          <p className="text-danger">{loadError}</p>
        </div>
      ) : (
        <>
          <SortFilter
            isFilterVisible={true}
            sortKey={sortKey}
            setSortKey={setSortKey}
            query={query}
            setQuery={setQuery}
            showSearch={showSearch}
            setShowSearch={setShowSearch}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedCondition={selectedCondition}
            setSelectedCondition={setSelectedCondition}
          />

          {/* Cards */}
          <div className="container my-5 mx-auto">
            {filteredBookmarks.length > 0 ? (
              <>
                <Pagination
                  dataLength={filteredBookmarks.length}
                  currPage={currP}
                  setCurrPage={setCurrP}
                  resultsPerPage={resultsPerPage}
                />

                {pageBookmarks.map((b) => (
                  <div key={b._id} className="my-4">
                    <ItemLongCardInline
                      img={b.images?.[0]}
                      name={b.title}
                      desc={b.description}
                      category={b.category}
                      brand={b.brand}
                      condition={b.condition}
                      images={b.images}
                      dateBookmarked={b.dateBookmarked}
                      createdAt={b.createdAt}

                      saved={true}
                      onViewOffers={() => router.push(`/listings/${b.listingId}`)}
                      onCreateListing={() => router.push(`/listings/create?listingId=${b.listingId}`)}
                    />
                  </div>
                ))}

              </>
            ) : (
              <div className="text-center my-8">
                <p className="text-muted text-capitalize fs-4 fst-italic">
                  No bookmarks match your search
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </UserNavbar>
  );
}