import { UserContext } from "@/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLayerGroup, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { StatusCard, StatusType, TradeCard } from "@/components/base-long-card";
import { Button } from "react-bootstrap";
import Pagination from "@/components/pagination";
import SortFilter from "@/components/sort_filter";
import UserNavbar from "@/components/user-navbar";

const getStatusType = (status) => {
  if (status === "IN TRADE") return StatusType.IN_PROGRESS;
  if (status === "COMPLETE") return StatusType.COMPLETED;
  return StatusType.AWAIT_PROPOSAL;
};

export default function UserListing() {
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
  const [profile, setProfile] = useState(null);

  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("most-recent");
  const [showSearch, setShowSearch] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  const listingStatusOptions = [
    { key: "ACTIVE",    label: "Active" },
    { key: "IN TRADE",  label: "In Trade" },
    { key: "COMPLETE",  label: "Completed" },
  ];

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
        const profileFetch = await fetch(`/api/users/${id}`);
        const profileData = await profileFetch.json();
        console.log(profileData);
        setProfile(profileData);

        const res = await fetch(`/api/listings`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to load listing");
        const userListing = data.listings.filter(
          (listing) => listing.userId === id,
        );
        setListings(userListing);
        console.log(userListing);
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
      filtered = filtered.filter((listing) => listing.category === selectedCategory);
    }

    // Step 2: Apply Status Filter
    if (selectedStatus) {
      filtered = filtered.filter((listing) => listing.status === selectedStatus);
    }

    // Step 4: Apply Search Filter
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (listing) =>
          listing.itemName.toLowerCase().includes(lowerQuery) ||
          listing.description.toLowerCase().includes(lowerQuery),
      );
    }

    // Step 5: Apply Sort
    if (sortKey === "most-recent") {
      filtered.sort((a, b) => new Date(b.datePosted || 0) - new Date(a.datePosted || 0));
    } else if (sortKey === "popular") {
      filtered.sort((a, b) => new Date(a.datePosted || 0) - new Date(b.datePosted || 0));
    } else if (sortKey === "az") {
      filtered.sort((a, b) => a.itemName.localeCompare(b.itemName));
    } else if (sortKey === "za") {
      filtered.sort((a, b) => b.itemName.localeCompare(a.itemName));
    }
    // "none" — no sort applied

    // Step 6: Reset pagination
    setCurrP(0);

    // Step 7: Set filtered results
    setFilteredListings(filtered);
  }, [listings, query, sortKey, selectedCategory, selectedStatus]);

  // Handle Pagination - Slice filtered results
  useEffect(() => {
    const startIdx = currP * resultsPerPage;
    const endIdx = startIdx + resultsPerPage;
    const paginatedListings = filteredListings.slice(startIdx, endIdx);
    setPageListings(paginatedListings);
  }, [currP, filteredListings]);

  return (
    <>
      <UserNavbar id={id} loading={loading}>
        {listings.length > 0 ? (
          <>
            {/* Filter Section */}

            <SortFilter
              isFilterVisible={true}
              isConditionVisible={false}
              isStatusVisible={true}
              statusOptions={listingStatusOptions}
              sortKey={sortKey}
              setSortKey={setSortKey}
              query={query}
              setQuery={setQuery}
              showSearch={showSearch}
              setShowSearch={setShowSearch}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              setSelectedStatus={setSelectedStatus}
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
                      {isOwner ? (
                        <StatusCard
                          statusType={getStatusType(listing.status)}
                          user={profile}
                          offerItem={listing}
                          requestItem={listing.requestItems}
                          requestMoney={listing.requestMoney}
                          url={`/users/${id}`}
                        />
                      ) : (
                        <TradeCard
                          user={profile}
                          offerItem={listing}
                          requestMoney={listing.requestMoney}
                          url={`/listings/${listing._id}`}
                        />
                      )}
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
                    No listings match your search
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="container mx-auto my-8 text-center">
            <p className="text-muted text-capitalize fs-4 fst-italic">
              No Listings Added yet
            </p>
          </div>
        )}
      </UserNavbar>
    </>
  );
}
