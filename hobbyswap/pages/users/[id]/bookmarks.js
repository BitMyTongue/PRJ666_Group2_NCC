import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { TradeCard } from "@/components/base-long-card";
import Pagination from "@/components/pagination";
import SortFilter from "@/components/sort_filter";
import UserNavbar from "@/components/user-navbar";
export default function UserBookmark() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(UserContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const resultsPerPage = 3;
  const [currP, setCurrP] = useState(0);
  const [pageListings, setPageListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  let [isOwner, setIsOwner] = useState(false);

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("popular");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedCondition, setSelectedCondition] = useState(null);
  useEffect(() => {
    if (!router.isReady) return;
    console.log("User", user?._id);
    console.log("id", id);

    const checkOwner = user?._id === id;
    setIsOwner(checkOwner);

    const load = async () => {
      try {
        setLoading(true);
        setLoadError("");
        const bookmarksRes = await fetch(`/api/bookmarks`);
        const bookmarkData = await bookmarksRes.json();
        console.log(bookmarkData);

        if (!bookmarksRes.ok)
          throw new Error(bookmarkData?.error || "Failed to load bookmarks");

        const userBookmarks = bookmarkData.bm.filter((bm) => bm.userId === id);
        console.log(userBookmarks);

        const res = await fetch(`/api/listings`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to load listing");

        const bookmarkedListingIds = userBookmarks.map((b) => b.listingId);
        const bookmarkedListings = data.listings.filter((listing) =>
          bookmarkedListingIds.includes(listing._id),
        );
        console.log(bookmarkedListings);

        // Fetch user data for each listing's owner
        const uniqueUserIds = [...new Set(bookmarkedListings.map(l => l.userId))];
        const listingsWithUsers = await Promise.all(
          bookmarkedListings.map(async (listing) => {
            const userRes = await fetch(`/api/users/${listing.userId}`);
            const userData = await userRes.json();
            return {
              ...listing,
              owner: userData,
            };
          })
        );

        setListings(listingsWithUsers);
        
      } catch (e) {
        setLoadError(e.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router.isReady, id, user]);
  console.log(isOwner);

  // Filter and Sort Listings
  useEffect(() => {
    let filtered = [...listings];

    // Step 1: Apply Category Filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (listing) => listing.category === selectedCategory,
      );
    }

    // Step 2: Apply Condition Filter
    if (selectedCondition) {
      filtered = filtered.filter(
        (listing) => listing.condition === selectedCondition,
      );
    }

    // Step 3: Apply Search Filter (by title or description)
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.itemName.toLowerCase().includes(lowerQuery) ||
          listing.description.toLowerCase().includes(lowerQuery),
      );
    }

    // Step 4: Apply Sort
    if (sortKey === "az") {
      filtered.sort((a, b) => a.itemName.localeCompare(b.itemName));
    } else if (sortKey === "za") {
      filtered.sort((a, b) => b.itemName.localeCompare(a.itemName));
    }
    // "popular" is the default - no sorting needed

    // Step 5: Reset pagination to page 0 when filters change
    setCurrP(0);

    // Step 6: Set filtered results for pagination
    setFilteredListings(filtered);
  }, [listings, query, sortKey, selectedCategory, selectedCondition]);

  // Handle Pagination - Slice filtered results
  useEffect(() => {
    const startIdx = currP * resultsPerPage;
    const endIdx = startIdx + resultsPerPage;
    const paginatedListings = filteredListings.slice(startIdx, endIdx);
    setPageListings(paginatedListings);
  }, [currP, filteredListings]);
  return  <>
        <UserNavbar id={id} loading={loading}>
          {listings.length > 0 ? (
            <>
              {/* Filter Section */}
  
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
  
              {/* Card Section */}
              <div className="container my-5 mx-auto">
                {filteredListings.length > 0 ? (
                  <>
                    <Pagination
                      dataLength={filteredListings.length}
                      currPage={currP}
                      setCurrPage={setCurrP}
                      resultsPerPage={resultsPerPage}
                    />
                    {pageListings.map((listing, idx) => (
                      <div key={idx} className="my-4">
                          <TradeCard
                            user={listing.owner}
                            offerItem={listing}
                            requestMoney={listing.requestMoney}
                            url={`/listings/${listing._id}`}
                            isBookmarked={true}
                          />
                        
                      </div>
                    ))}
                    <Pagination
                      dataLength={filteredListings.length}
                      currPage={currP}
                      setCurrPage={setCurrP}
                      resultsPerPage={resultsPerPage}
                    />
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
          ) : (
            <div className="container mx-auto my-8 text-center">
              <p className="text-muted text-capitalize fs-4 fst-italic">
                You have not saved any listings yet
              </p>
            </div>
          )}
        </UserNavbar>
      </>
}
