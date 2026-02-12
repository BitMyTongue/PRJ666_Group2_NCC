import { UserContext } from "@/contexts/UserContext";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLayerGroup, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { StatusCard, StatusType, TradeCard } from "@/components/base-long-card";
import { Button, Spinner } from "react-bootstrap";
import Pagination from "@/components/pagination";
import SortFilter from "@/components/sort_filter";
export default function UserOffers() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(UserContext);
  const [offers, setoffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const resultsPerPage = 1;
  const [currP, setCurrP] = useState(0);
  const [pageoffers, setPageoffers] = useState([]);
  const [filteredoffers, setFilteredoffers] = useState([]);
  let [isOwner, setIsOwner] = useState(false);
  const [profile, setProfile] = useState(null);

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
      setLoading(true);
      setLoadError("");
      const listingsData = await fetch("/api/listings").then((res) =>
        res.json(),
      );
      if (!listingsData) return;
      const userRes = await fetch("/api/users", {
        method: "GET",
        cache: "no-store",
      });
      if (userRes.ok) {
        try {
          const { users } = await userRes.json();

          const profileFetch = await fetch(`/api/users/${id}`);
          const profileData = await profileFetch.json();
          console.log(profileData);
          setProfile(profileData);

          const res = await fetch(`/api/tradeOffers/`);
          const data = await res.json();
          console.log(data.tradeOffers);
          if (!res.ok) throw new Error(data?.error || "Failed to load offer");
          const userOffer = data.tradeOffers.filter((offer) => {
            offer.listing = listingsData.listings.find(
              (l) => offer.listingId == l._id,
            );
            offer.owner = users.find((u) => offer.ownerId === u._id);
            return offer.requesterId === id;
          });
          setoffers(userOffer);
          console.log(userOffer);
        } catch (e) {
          setLoadError(e.message);
        } finally {
          setLoading(false);
        }
      }
    };

    load();
  }, [router.isReady, id, user]);
  console.log(isOwner);

  // Filter and Sort offers
  useEffect(() => {
    let filtered = [...offers];

    filtered.filter((offer) => offer.offerStatus !== "RETRACTED");

    // Step 1: Apply Category Filter
    if (selectedCategory) {
      filtered = filtered.filter(
        (offer) => offer.category === selectedCategory,
      );
    }

    // Step 2: Apply Condition Filter
    if (selectedCondition) {
      filtered = filtered.filter(
        (offer) => offer.condition === selectedCondition,
      );
    }

    // Step 3: Apply Search Filter (by title or description)
    if (query.trim()) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(
        (offer) =>
          offer.itemName.toLowerCase().includes(lowerQuery) ||
          offer.description.toLowerCase().includes(lowerQuery),
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
    setFilteredoffers(filtered);
  }, [offers, query, sortKey, selectedCategory, selectedCondition]);

  // Handle Pagination - Slice filtered results
  useEffect(() => {
    const startIdx = currP * resultsPerPage;
    const endIdx = startIdx + resultsPerPage;
    const paginatedoffers = filteredoffers.slice(startIdx, endIdx);
    setPageoffers(paginatedoffers);
  }, [currP, filteredoffers]);

  return isOwner ? (
    <>
      {/* Active Tab Section */}
      <div className="bg-light">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center my-3">
              <FontAwesomeIcon
                icon={faUser}
                size="3x"
                className="fw-bolder text-primary mb-1"
              />
              <Link
                href={`/users/${id}`}
                className={
                  false
                    ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                    : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                }
              >
                {isOwner && "My"} Profile
              </Link>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center my-3">
              <FontAwesomeIcon
                icon={faLayerGroup}
                size="3x"
                className="fw-bolder text-primary mb-1"
              />

              <Link
                href={`/users/${user._id}/listings`} //Now in {`/users/${profile._id}/offers`}
                className={
                  router.asPath.includes("listings")
                    ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                    : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                }
              >
                {isOwner && "My"} Listings
              </Link>
            </div>
            {isOwner && (
              <>
                <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faShoppingBag}
                    size="3x"
                    className="fw-bolder text-primary mb-1"
                  />
                  <Link
                    href="/users/${profile._id}/offers"
                    className={
                      router.asPath.includes("offers")
                        ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                        : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                    }
                  >
                    My Offers
                  </Link>
                </div>

                <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faBookmark}
                    size="3x"
                    className="fw-bolder text-primary mb-1"
                  />
                  <Link
                    href="#"
                    className={
                      router.asPath.includes("bookmarks")
                        ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                        : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                    }
                  >
                    My Bookmarks
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {offers.length > 0 ? (
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
            {filteredoffers.length > 0 ? (
              <>
                <Pagination
                  dataLength={filteredoffers.length}
                  currPage={currP}
                  setCurrPage={setCurrP}
                  resultsPerPage={resultsPerPage}
                />
                {pageoffers.map((offer, idx) => {
                  let status = StatusType.AWAIT_APPROVAL;
                  if (offer.offerStatus === "ACCEPTED")
                    status = StatusType.IN_PROGRESS;
                  else if (offer.offerStatus === "DECLINED")
                    status = StatusType.DECLINED;
                  return (
                    <div key={idx} className="my-4">
                      {isOwner && (
                        <StatusCard
                          statusType={status}
                          user={offer.owner}
                          offerItem={offer.listing}
                          requestItem={offer.proposedItems}
                          requestMoney={offer.requestMoney}
                          requestUser={profile}
                          url={`/users/${id}`}
                        />
                      )}
                    </div>
                  );
                })}
                <Pagination
                  dataLength={filteredoffers.length}
                  currPage={currP}
                  setCurrPage={setCurrP}
                  resultsPerPage={resultsPerPage}
                />
              </>
            ) : (
              <div className="text-center my-8">
                <p className="text-muted text-capitalize fs-4 fst-italic">
                  No offers match your search
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="container mx-auto my-8 text-center">
          <p className="text-muted text-capitalize fs-4 fst-italic">
            No offers Added yet
          </p>
        </div>
      )}
    </>
  ) : (
    <Spinner />
  );
}
