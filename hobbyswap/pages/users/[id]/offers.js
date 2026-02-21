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
import UserNavbar from "@/components/user-navbar";
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
    setLoading(true);
    if (!router.isReady) return;
    const checkOwner = user?._id === id;
    setIsOwner(checkOwner);

    const load = async () => {
      setLoadError("");
      const listingsData = await fetch("/api/listings").then((res) =>
        res.json(),
      );
      if (!listingsData) {
        setLoading(false);
        return;
      }
      const userRes = await fetch("/api/users", {
        method: "GET",
        cache: "no-store",
      });
      if (userRes.ok) {
        try {
          const { users } = await userRes.json();

          const profileFetch = await fetch(`/api/users/${id}`);
          const profileData = await profileFetch.json();
          setProfile(profileData);

          const res = await fetch(`/api/tradeOffers/`);
          const data = await res.json();
          if (!res.ok) throw new Error(data?.error || "Failed to load offer");
          const userOffer = data.tradeOffers.filter((offer) => {
            offer.listing = listingsData.listings.find(
              (l) => offer.listingId == l._id,
            );
            offer.owner = users.find((u) => offer.ownerId === u._id);
            return offer.requesterId === id;
          });
          setoffers(userOffer);
        } catch (e) {
          setLoadError(e.message);
        } finally {
          setLoading(false);
        }
      } else setLoading(false);
    };

    load();
  }, [router.isReady, id, user]);

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

  return (
    isOwner && (
      <>
        <UserNavbar id={id} loading={loading}>
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
                      let status = StatusType.AWAIT_P_APPROVAL;
                      if (offer.offerStatus === "ACCEPTED")
                        status = StatusType.P_ACCEPTED;
                      else if (offer.offerStatus === "DECLINED")
                        status = StatusType.DECLINED;
                      else if (offer.offerStatus === "RETRACTED")
                        status = StatusType.RETRACTED;
                      return (
                        <div key={idx} className="my-4">
                          {isOwner && (
                            <StatusCard
                              offerId={offer._id}
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
        </UserNavbar>
      </>
    )
  );
}
