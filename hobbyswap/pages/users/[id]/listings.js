import { UserContext } from "@/contexts/UserContext"
import Link from "next/link"
import { useRouter } from "next/router"
import { useContext, useEffect, useMemo, useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookmark, faUser} from "@fortawesome/free-regular-svg-icons"
import { faLayerGroup, faShoppingBag  } from "@fortawesome/free-solid-svg-icons"
import {  StatusCard, StatusType, TradeCard } from "@/components/base-long-card"
import { Button, Dropdown } from "react-bootstrap"
import Pagination from "@/components/pagination"

export default function UserListing(){
    const router=useRouter()
    const {id,status='all status', type="all types", category='all categories',sort}=router.query
    const  {user}=useContext(UserContext)
    const [listings,setListings]=useState([])
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const resultsPerPage = 5;
    const [currP, setCurrP] = useState(0);
    const [pageListings,setPageListings]=useState([])

  
  useEffect(() => {
    if (!router.isReady) return;    
    
    const load = async () => {
      try {
        setLoading(true);
        setLoadError("");
        
        const res = await fetch(`/api/listings`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data?.error || "Failed to load listing");
        const userListing=data.listings.filter((listing)=>listing.userId===id)
        setListings(userListing);
        console.log(userListing)
      } catch (e) {
        setLoadError(e.message);
      } finally {
        setLoading(false);
      }
    };
    
    load();
  }, [router.isReady, id]);

  const matchesType = (listing, type) => {
  const hasMoney = !!listing.requestMoney
  const hasItem = !!listing.itemRequest

  switch (type) {
    case "sell":
      return hasMoney && !hasItem
    case "trade":
      return hasItem && !hasMoney
    case "both":
      return hasMoney && hasItem
    case "all types":
    default:
      return true
  }
}

// Filter and Sort
const filteredListings = useMemo(() => {
  // Filter
  let result = listings.filter((l) => {
    const statusMatch =
      status === "all status" || l.status.toLowerCase() === status

    const typeMatch = matchesType(l, type)

    const categoryMatch =
      category === "all categories" || l.category === category

    return statusMatch && typeMatch && categoryMatch
  })

  // SORT
  switch (sort) {
    case "most recent":
      return [...result].sort(
        (a, b) =>
          new Date(b.datePosted).getTime() -
          new Date(a.datePosted).getTime()
      )

    case "most popular":
      //TODO: Add popularity in the future for this sort
      // return [...result].sort(
      //   (a, b) => (b.popularity || 0) - (a.popularity || 0)
      return result 
    case "az":
      return [...result].sort((a, b) =>
        (a.itemName || "").localeCompare(b.itemName || "", undefined, {
          sensitivity: "base",
        })
    )

  case "za":
    return [...result].sort((a, b) =>
      (b.itemName || "").localeCompare(a.itemName || "", undefined, {
        sensitivity: "base",
      })
    )

    default:
      return result
  }
}, [listings, status, type, category, sort])



  // Pagination (AFTER filtering)
  useEffect(() => {
    const copy = filteredListings.slice(
      currP * resultsPerPage,
      currP * resultsPerPage + resultsPerPage
    )
    setPageListings(copy)
  }, [currP, filteredListings])

  const handleOnClickFilter = (key,value) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, [key]: value },
    })
    setCurrP(0)
  }
  if(loading) return <p>Loading...</p>
 return (
    <>
     {/* Active Tab Section */}
      <div className="bg-light">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center my-3">
              <FontAwesomeIcon icon={faUser} size="3x" className="fw-bolder text-primary mb-1"/>
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
                <FontAwesomeIcon icon={faLayerGroup} size="3x" className="fw-bolder text-primary mb-1"/>

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
               <FontAwesomeIcon icon={faShoppingBag} size="3x" className="fw-bolder text-primary mb-1"/>
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
              <FontAwesomeIcon icon={faBookmark} size="3x" className="fw-bolder text-primary mb-1"/>
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
      {
        listings.length>0?<>
            {/* Filter Section */}
      <div className="container my-5 mx-auto">
        <div className="d-flex gap-3">
          {/* Status */}
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                className="text-muted px-5 rounded-pill text-capitalize"
              >
                {status.replace("-", " ")}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleOnClickFilter('status',"all status")}>
                  All Status
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleOnClickFilter('status',"active")}>
                  Active
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleOnClickFilter('status',"complete")}>
                  Completed
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleOnClickFilter('status',"in trade")}>
                  In Trade
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          {/* Type*/}
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                className="text-muted px-5 rounded-pill text-capitalize"
              >
                &#9734; &nbsp;{type.replace("-", " ")}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item onClick={() => handleOnClickFilter('type',"all types")}>
                  All Types
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleOnClickFilter('type',"trade")}>
                  Trade
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleOnClickFilter('type',"sell")}>
                  For Sale
                </Dropdown.Item>
                <Dropdown.Item onClick={() => handleOnClickFilter('type',"both")}>
                  Both Types
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          {/* Category*/}
            <Dropdown>
              <Dropdown.Toggle
                variant="light"
                className="text-muted px-5 rounded-pill text-capitalize"
              >
                {category.replace("-", " ")}
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item className="text-capitalize" onClick={() => handleOnClickFilter('category',"all categories")}>
                  All Categories
                </Dropdown.Item>
                <Dropdown.Item className="text-capitalize" onClick={() => handleOnClickFilter('category',"POKEMON CARD")}>
                  Pokemon Card
                </Dropdown.Item>
                <Dropdown.Item className="text-capitalize" onClick={() => handleOnClickFilter('category',"BLIND BOX")}>
                  Blind Box
                </Dropdown.Item>
                <Dropdown.Item className="text-capitalize" onClick={() => handleOnClickFilter('category',"YUGIOH CARD")}>
                  Yugioh Card
                </Dropdown.Item>
                <Dropdown.Item className="text-capitalize" onClick={() => handleOnClickFilter('category',"FIGURINE")}>
                  Figurine
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

          <p className="text-primary fw-semibold ms-auto">Sort By | 
            <span className="fw-light ms-3">          
              {/* Sort */}
            <Dropdown className="d-inline">
  <Dropdown.Toggle
    className="text-primary text-capitalize bg-transparent border-0"
  >
    {sort === "az"
      ? "A – Z"
      : sort === "za"
      ? "Z – A"
      : sort === "popular"
      ? "Most Popular"
      : "Most Recent"}
  </Dropdown.Toggle>

  <Dropdown.Menu>
    <Dropdown.Item onClick={() => handleOnClickFilter("sort", "most recent")}>
      Most Recent
    </Dropdown.Item>

    <Dropdown.Item onClick={() => handleOnClickFilter("sort", "most popular")}>
      Most Popular
    </Dropdown.Item>

    <Dropdown.Divider />

    <Dropdown.Item onClick={() => handleOnClickFilter("sort", "az")}>
      Item Name (A – Z)
    </Dropdown.Item>

    <Dropdown.Item onClick={() => handleOnClickFilter("sort", "za")}>
      Item Name (Z – A)
    </Dropdown.Item>

    <Dropdown.Divider />

    <Dropdown.Item onClick={() => handleOnClickFilter("sort", "clear")}>
      No Sorting
    </Dropdown.Item>
  </Dropdown.Menu>
</Dropdown>
</span></p>
        </div>

      </div>
      {/* Card Section */}
      <div className="container my-5 mx-auto">
        {filteredListings.length!==0?
              <Pagination
        dataLength={listings.length}
        currPage={currP}
        setCurrPage={setCurrP}
        resultsPerPage={resultsPerPage}
      />:<div className="container mx-auto my-8 text-center">
       <p className="text-muted text-capitalize fs-4 fst-italic">No Result Found</p>
       </div>}
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
        {filteredListings.length!==0&&
              <Pagination
        dataLength={listings.length}
        currPage={currP}
        setCurrPage={setCurrP}
        resultsPerPage={resultsPerPage}
      />}
      </div>
       </>:
       <div className="container mx-auto my-8 text-center">
       <p className="text-muted text-capitalize fs-4 fst-italic">No Listings Added yet</p>
       </div>
     }
    </>
  );
}

