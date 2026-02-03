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
export default function UserListing() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(UserContext);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const resultsPerPage = 1;
  const [currP, setCurrP] = useState(0);
  const [pageListings, setPageListings] = useState([]);

  useEffect(() => {
    if (!router.isReady) return;

    const load = async () => {
      try {
        setLoading(true);
        setLoadError("");

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
  }, [router.isReady, id]);

  useEffect(() => {
    const effectAsync = async () => {
      const copy = listings.slice(
        currP * resultsPerPage,
        currP * resultsPerPage + resultsPerPage,
      );
      setPageListings(copy);
    };
    effectAsync();
  }, [currP, listings]);

  return (
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
                My Profile
              </Link>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center my-3">
              <FontAwesomeIcon
                icon={faLayerGroup}
                size="3x"
                className="fw-bolder text-primary mb-1"
              />

              <Link
                href="#"
                className={
                  router.asPath.includes("listings")
                    ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                    : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                }
              >
                My Listings
              </Link>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
              <FontAwesomeIcon
                icon={faShoppingBag}
                size="3x"
                className="fw-bolder text-primary mb-1"
              />
              <Link
                href="#"
                className={
                  router.asPath.includes("history")
                    ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                    : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                }
              >
                My History
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
          </div>
        </div>
      </div>
      {listings.length > 0 ? (
        <>
          {/* Filter Section */}
          <div className="container my-5 mx-auto">
            <div className="d-flex gap-3">
              <Button className="btn-light text-muted px-5 rounded-pill">
                All Filters &#9662; &#9662;
              </Button>
              <Button className="btn-light text-muted px-5 rounded-pill">
                &#9734; All Types &#9662;
              </Button>
              <p className="text-primary fw-semibold ms-auto">
                Sort By |{" "}
                <span className="fw-light ms-3">{"Most Relevant"}</span>
              </p>
            </div>
          </div>
          {/* Card Section */}
          <div className="container my-5 mx-auto">
            <Pagination
              dataLength={listings.length}
              currPage={currP}
              setCurrPage={setCurrP}
              resultsPerPage={resultsPerPage}
            />
            {pageListings.map((listing, idx) => (
              <div key={idx} className="my-4">
                <StatusCard
                  statusType={StatusType.AWAIT_PROPOSAL}
                  user={user}
                  offerItem={listing}
                  requestMoney={listing.requestMoney}
                  url={`/users/${id}`}
                />
              </div>
            ))}
            <Pagination
              dataLength={listings.length}
              currPage={currP}
              setCurrPage={setCurrP}
              resultsPerPage={resultsPerPage}
            />
          </div>
        </>
      ) : (
        <div className="container mx-auto my-8 text-center">
          <p className="text-muted text-capitalize fs-4 fst-italic">
            No Listings Added yet
          </p>
        </div>
      )}
    </>
  );
}
