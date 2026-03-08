import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useState, useCallback } from "react";

import UserNavbar from "@/components/user-navbar";
import Pagination from "@/components/pagination";
import SortFilter from "@/components/sort_filter";
import { ItemLongCardInline } from "@/components/base-long-card";

export default function UserBookmarksPage() {
  const router = useRouter();
  const { id } = router.query;
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

  const loadBookmarks = useCallback(async () => {
    if (!id) return;

    setLoading(true);
    setLoadError("");

    try {
      const res = await fetch(`/api/bookmarks?userId=${encodeURIComponent(id)}`, {
        cache: "no-store",
      });

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { raw: await res.text() };

      if (!res.ok) {
        throw new Error(data?.error || "Failed to load bookmarks");
      }

      setBookmarks(data.bookmarks || []);
    } catch (e) {
      console.error("Failed to load bookmarks", e);
      setLoadError(e.message || "Failed to load bookmarks");
      setBookmarks([]);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (!router.isReady || !id) return;
    loadBookmarks();
  }, [router.isReady, id, loadBookmarks]);

  useEffect(() => {
    let filtered = [...bookmarks];

    if (selectedCategory) {
      filtered = filtered.filter((b) => b.category === selectedCategory);
    }

    if (selectedCondition) {
      filtered = filtered.filter((b) => b.condition === selectedCondition);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      filtered = filtered.filter(
        (b) =>
          (b.title || b.itemName || "").toLowerCase().includes(q) ||
          (b.description || "").toLowerCase().includes(q)
      );
    }

    if (sortKey === "az") {
      filtered.sort((a, b) =>
        (a.title || a.itemName || "").localeCompare(b.title || b.itemName || "")
      );
    } else if (sortKey === "za") {
      filtered.sort((a, b) =>
        (b.title || b.itemName || "").localeCompare(a.title || a.itemName || "")
      );
    } else if (sortKey === "newest" || sortKey === "popular") {
      filtered.sort(
        (a, b) => new Date(b.dateBookmarked || 0) - new Date(a.dateBookmarked || 0)
      );
    }

    setCurrP(0);
    setFilteredBookmarks(filtered);
  }, [bookmarks, query, sortKey, selectedCategory, selectedCondition]);

  useEffect(() => {
    const startIdx = currP * resultsPerPage;
    const endIdx = startIdx + resultsPerPage;
    setPageBookmarks(filteredBookmarks.slice(startIdx, endIdx));
  }, [currP, filteredBookmarks]);

  const handleBookmarkChange = async (bookmark, nextSaved) => {
    if (nextSaved === true) return;

    const bookmarkId = bookmark?._id;
    const listingId = bookmark?.listingId;
    const userId = user?._id || id;

    if (!userId || !listingId) {
      alert("Missing bookmark information.");
      return;
    }

    try {
      let res;

      if (bookmarkId) {
        res = await fetch(`/api/bookmarks/${encodeURIComponent(bookmarkId)}`, {
          method: "DELETE",
        });
      } else {
        res = await fetch(
          `/api/bookmarks?userId=${encodeURIComponent(userId)}&listingId=${encodeURIComponent(listingId)}`,
          {
            method: "DELETE",
          }
        );
      }

      const contentType = res.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await res.json()
        : { raw: await res.text() };

      if (!res.ok) {
        console.error("Failed to remove bookmark:", res.status, data);
        throw new Error(data?.error || "Failed to remove bookmark");
      }

      await loadBookmarks();
    } catch (e) {
      console.error("Failed to update bookmark", e);
      alert(e.message || "Failed to update bookmark");
    }
  };

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
                      bookmarkId={b._id}
                      userId={b.userId}
                      listingId={b.listingId}
                      img={b.images?.[0]}
                      name={b.title || b.itemName}
                      desc={b.description}
                      description={b.description}
                      category={b.category}
                      brand={b.brand}
                      condition={b.condition}
                      images={b.images}
                      dateBookmarked={b.dateBookmarked}
                      createdAt={b.createdAt}
                      updatedAt={b.updatedAt}
                      saved={true}
                      onBookmarkChange={(next) => handleBookmarkChange(b, next)}
                      onViewOffers={() => router.push(`/listings/${b.listingId}`)}
                      onCreateListing={() =>
                        router.push(`/listings/create?listingId=${b.listingId}`)
                      }
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