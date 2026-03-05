// import { UserContext } from "@/contexts/UserContext";
// import Link from "next/link";
// import { useRouter } from "next/router";
// import { useContext, useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBookmark, faUser } from "@fortawesome/free-regular-svg-icons";
// import { faLayerGroup, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
// import { StatusCard, StatusType, TradeCard, ItemCard } from "@/components/base-long-card";
// import { Button, Spinner } from "react-bootstrap";
// import Pagination from "@/components/pagination";
// import SortFilter from "@/components/sort_filter";
// import UserNavbar from "@/components/user-navbar";
// export default function UserOffers() {
//   const router = useRouter();
//   const { id } = router.query;
//   const { user } = useContext(UserContext);
//   const [offers, setoffers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [loadError, setLoadError] = useState("");
//   const resultsPerPage = 1;
//   const [currP, setCurrP] = useState(0);
//   const [pageoffers, setPageoffers] = useState([]);
//   const [filteredoffers, setFilteredoffers] = useState([]);
//   let [isOwner, setIsOwner] = useState(false);
//   const [profile, setProfile] = useState(null);

//   const [query, setQuery] = useState("");
//   const [sortKey, setSortKey] = useState("popular");
//   const [showSearch, setShowSearch] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState(null);
//   const [selectedCondition, setSelectedCondition] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     if (!router.isReady) return;
//     const checkOwner = user?._id === id;
//     setIsOwner(checkOwner);

//     const load = async () => {
//       setLoadError("");
//       const listingsData = await fetch("/api/listings").then((res) =>
//         res.json(),
//       );
//       if (!listingsData) {
//         setLoading(false);
//         return;
//       }
//       const userRes = await fetch("/api/users", {
//         method: "GET",
//         cache: "no-store",
//       });
//       if (userRes.ok) {
//         try {
//           const { users } = await userRes.json();

//           const profileFetch = await fetch(`/api/users/${id}`);
//           const profileData = await profileFetch.json();
//           setProfile(profileData);

//           // const res = await fetch(`/api/tradeOffers/`);
//           const res = await fetch(`/api/bookmark?userId=${currentUserId}`);
//           const data = await res.json();
//           if (!res.ok) throw new Error(data?.error || "Failed to load offer");
//           const userOffer = data.tradeOffers.filter((offer) => {
//             offer.listing = listingsData.listings.find(
//               (l) => offer.listingId == l._id,
//             );
//             offer.owner = users.find((u) => offer.ownerId === u._id);
//             return offer.requesterId === id;
//           });
//           setBookmarks(data.bookmarks);
//         } catch (e) {
//           setLoadError(e.message);
//         } finally {
//           setLoading(false);
//         }
//       } else setLoading(false);
//     };

//     load();
//   }, [router.isReady, id, user]);

//   // Filter and Sort offers
//   useEffect(() => {
//     let filtered = [...offers];

//     filtered.filter((offer) => offer.offerStatus !== "RETRACTED");

//     // Step 1: Apply Category Filter
//     if (selectedCategory) {
//       filtered = filtered.filter(
//         (offer) => offer.category === selectedCategory,
//       );
//     }

//     // Step 2: Apply Condition Filter
//     if (selectedCondition) {
//       filtered = filtered.filter(
//         (offer) => offer.condition === selectedCondition,
//       );
//     }

//     // Step 3: Apply Search Filter (by title or description)
//     if (query.trim()) {
//       const lowerQuery = query.toLowerCase();
//       filtered = filtered.filter(
//         (offer) =>
//           offer.itemName.toLowerCase().includes(lowerQuery) ||
//           offer.description.toLowerCase().includes(lowerQuery),
//       );
//     }

//     // Step 4: Apply Sort
//     if (sortKey === "az") {
//       filtered.sort((a, b) => a.itemName.localeCompare(b.itemName));
//     } else if (sortKey === "za") {
//       filtered.sort((a, b) => b.itemName.localeCompare(a.itemName));
//     }
//     // "popular" is the default - no sorting needed

//     // Step 5: Reset pagination to page 0 when filters change
//     setCurrP(0);

//     // Step 6: Set filtered results for pagination
//     setFilteredoffers(filtered);
//   }, [offers, query, sortKey, selectedCategory, selectedCondition]);

//   // Handle Pagination - Slice filtered results
//   useEffect(() => {
//     const startIdx = currP * resultsPerPage;
//     const endIdx = startIdx + resultsPerPage;
//     const paginatedoffers = filteredoffers.slice(startIdx, endIdx);
//     setPageoffers(paginatedoffers);
//   }, [currP, filteredoffers]);

//   return (
//     isOwner && (
//       <>
//         <UserNavbar id={id} loading={loading}>
//           {offers.length > 0 ? (
//             <>
//               {/* Filter Section */}

//               <SortFilter
//                 isFilterVisible={true}
//                 sortKey={sortKey}
//                 setSortKey={setSortKey}
//                 query={query}
//                 setQuery={setQuery}
//                 showSearch={showSearch}
//                 setShowSearch={setShowSearch}
//                 selectedCategory={selectedCategory}
//                 setSelectedCategory={setSelectedCategory}
//                 selectedCondition={selectedCondition}
//                 setSelectedCondition={setSelectedCondition}
//               />

//               {/* Card Section */}
//               <div className="container my-5 mx-auto">
//                 {filteredoffers.length > 0 ? (
//                   <>
//                     <Pagination
//                       dataLength={filteredoffers.length}
//                       currPage={currP}
//                       setCurrPage={setCurrP}
//                       resultsPerPage={resultsPerPage}
//                     />
//                     {pageoffers.map((offer, idx) => {
//                       let status = StatusType.AWAIT_P_APPROVAL;
//                       if (offer.offerStatus === "ACCEPTED")
//                         status = StatusType.P_ACCEPTED;
//                       else if (offer.offerStatus === "DECLINED")
//                         status = StatusType.DECLINED;
//                       return (
//                         <div key={idx} className="my-4">
//                           {isOwner && (
//                             <StatusCard
//                               statusType={status}
//                               user={offer.owner}
//                               offerItem={offer.listing}
//                               requestItem={offer.proposedItems}
//                               requestMoney={offer.requestMoney}
//                               requestUser={profile}
//                               url={`/users/${id}`}
//                             />
//                           )}
//                         </div>
//                       );
//                     })}
//                     <Pagination
//                       dataLength={filteredoffers.length}
//                       currPage={currP}
//                       setCurrPage={setCurrP}
//                       resultsPerPage={resultsPerPage}
//                     />
//                   </>
//                 ) : (
//                   <div className="text-center my-8">
//                     <p className="text-muted text-capitalize fs-4 fst-italic">
//                       No offers match your search
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/*Item Card section*/}
//               <div className="container my-5 mx-auto">
//                   <>
//                     {pageoffers.map((offer, idx) => {
//                       let status = StatusType.AWAIT_P_APPROVAL;
//                       if (offer.offerStatus === "ACCEPTED")
//                         status = StatusType.P_ACCEPTED;
//                       else if (offer.offerStatus === "DECLINED")
//                         status = StatusType.DECLINED;
//                       return (
//                         <div key={idx} className="my-4">
//                           {isOwner && (
//                             <ItemCard
//                               statusType={status}
//                               user={offer.owner}
//                               offerItem={offer.listing}
//                               requestItem={offer.proposedItems}
//                               requestMoney={offer.requestMoney}
//                               requestUser={profile}
//                               url={`/users/${id}`}
//                             />
//                           )}
//                         </div>
//                       );
//                     })}
//                   </>
//               </div>
//             </>
//           ) : (
//             <div className="container mx-auto my-8 text-center">
//               <p className="text-muted text-capitalize fs-4 fst-italic">
//                 No bookmarks Added yet
//               </p>
//             </div>
//           )}
//         </UserNavbar>
//       </>
//     )
//   );
// }

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