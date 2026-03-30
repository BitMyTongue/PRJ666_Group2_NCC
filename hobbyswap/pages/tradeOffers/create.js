"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { Image } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  faPeopleLine,
  faTruck,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";
import UserIcon from "@/components/user-icon";
import Link from "next/link";
import { pickUpLocations } from "@/lib/data/pickupLocations";

const smallMapStyle = {
  width: "100%",
  height: "250px",
  borderRadius: "20px",
  border: "1px solid #dee2e6",
  overflow: "hidden",
};

const center = {
  lat: 43.6548,
  lng: -79.3884,
};

export default function CreateTradeOffer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);
  const status = searchParams.get("status");
  const [error, setError] = useState("");
  
  const listingId = searchParams.get("listingId");

  const [user, setUser] = useState(null);

  const [listing, setListing] = useState(null);
  const [listingError, setListingError] = useState("")

  // for displaying confirmation
  const offerId = searchParams.get("id");
  const [createdOffer, setCreatedOffer] = useState(null);
  const [createdOfferError, setCreatedOfferError] = useState("")

  // Snap to the top of the form if error to better display the alert
  const errorRef = useRef(null);
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView();
    }
  }, [error]);

  useEffect(()=>{
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/auth/protect", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => res.json())
      .then((data) => setUser(data.user))
    }
  }, []);

  // Load listing
  useEffect(() => {
    const load = async () => {
      if (!listingId) return;

      try {
        setListingError("");
        const res = await fetch(`/api/listings/${listingId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to load listing");

        setListing(data.listing);
      } catch (e) {
        setListingError(e.message);
      }
    };

    load();
  }, [listingId]);

  // After offer is successfully made, load offer
  useEffect(() => {
    const load = async () => {
      if (status !== "true" || !offerId) return;

      try {
        setCreatedOfferError("");
        const res = await fetch(`/api/tradeOffers/${offerId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to load trade offer");

        setCreatedOffer(data.tradeOffer);
      } catch (e) {
        setCreatedOfferError(e.message);
      }
    };

    load();
  }, [status, offerId]);

  const requestItems = Array.isArray(listing?.requestItems) ? listing.requestItems : [];
  const [proposedMoney, setProposedMoney] = useState("");
  const [selectedItem, setSelectedItem] = useState("");
  const [proposedItems, setProposedItems] = useState([]);
  const [meetUp, setMeetUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Logged in user from localStorage
    const userId = user?._id;

    // --------- Validation --------- //
    if(!userId) {
      setError("You must be logged in to create an offer.");
      return;
    }
    if (!listingId) {
      setError("Missing listing id.");
      return;
    }

    // Must propose item(s) and/or money
    const itemArr = Array.isArray(proposedItems) ? proposedItems : [];
    const moneyNum = Number(proposedMoney) || 0;

    if (!(itemArr.length > 0) && !(moneyNum > 0)) {
      setError("You must offer item(s) and/or money.");
      return;
    }

  try {
      const res = await fetch("/api/tradeOffers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requesterId: userId,
          listingId,
          meetUp,
          proposedMoney: moneyNum,
          proposedItems: itemArr,
        }),
      });

      const data = await res.json();

      // Fail
      if (!res.ok) {
        throw new Error(data?.error || "Create trade offer failed");
      }

      // Success
      router.push(`/tradeOffers/create?listingId=${listingId}&status=true&id=${data.tradeOffer._id}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRemoveItem = (index) => {
    setProposedItems((prev) => prev.filter((_, i) => i !== index)); // Removing past element
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  });

  const getCityProvince = (address) => {
    if (!address) return "";
    const parts = address.split(",");
    if (parts.length < 2) return "";

    const city = parts[parts.length - 2].trim();
    const province = parts[parts.length - 1].trim().split(" ")[0];
    return `${city}, ${province}`;
  };
  
  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  const selectedMeetUpLocation = pickUpLocations.find(
    (loc) => loc.name === listing?.location
  );

  // ------------------- //
  // RENDER CONFIRMATION //
  // ------------------- //

  if (status === "true") {

    // createdOffer is null on first render
    if (!createdOffer) return <h1>Loading the created offer...</h1>;
    if (!listing) return <h1>Loading listing...</h1>;

    const offerMoney = Number(createdOffer.proposedMoney) || 0;
    const offerItems = Array.isArray(createdOffer.proposedItems) ? createdOffer.proposedItems : [];

    return (
      <>
        <div className="container-sm border border-gray rounded-4 shadow mt-7 mb-3 px-5 py-4">
          <div className="row text-success">
            <p className="text-green mt-4 mb-4 fw-semibold fs-2">
              Trade Proposal Sent!
            </p>
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-center align-item-center">
            <div className="col-12 col-md-3 text-center text-md-start">
                <Image
                  src={listing?.images?.[0] || "/images/white-square-photo-frame.png"}
                  alt={`${listing?.itemName} img`}
                  className="w-75 align-self-center rounded-3"
                  fluid
                />
            </div>
            <div className={`col-12 ${createdOffer?.meetUp ? "col-md-5" : "col-md-8"} mt-4 mt-md-0 pe-md-5`}>
              <div className="d-flex flex-column gap-3 border-bottom border-gray pb-3">
                <p className="text-primary text-uppercase fw-semibold fs-3 mb-0">
                  {listing?.itemName || "Listing"}
                </p>

                {listing && (
                  <div className="d-grid">
                    <div className="row">
                      <div className="col-5">
                        <p className="text-primary text-capitalize fw-semibold fs-5">
                          category
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-primary text-capitalize fw-light">
                          {listing.category}
                        </p>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-5">
                        <p className="text-primary text-capitalize fw-semibold fs-5">
                          condition
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-primary text-uppercase fw-light">
                          {listing.condition}
                        </p>
                      </div>
                    </div>

                    <div className="row mb-2">
                      <div className="col-5">
                        <p className="text-primary text-capitalize fw-semibold fs-5">
                          owner
                        </p>
                      </div>
                      <div className="col-6">
                        <div className="d-flex gap-3">
                          <div>
                            <UserIcon
                              user={listing.userId.username}
                              img={listing.userId.avatar}
                              size={45}
                            />
                          </div>
                          <div>
                            <p className="mb-1">{listing.userId.username}</p>
                            <div className="d-flex">
                              {Array.from({ length: 5 }, (_, i) => (
                                <FontAwesomeIcon
                                  key={i}
                                  icon={
                                    i < user?.rating ? solidStar : emptyStar
                                  }
                                  className="text-secondary"
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-primary mt-2 mb-3 fw-bold fs-5">
                  Your Offer
                </p>
                <div className="row">
                  <div className="col-12 col-md-6">
                    <div className="form-control bg-light text-gray p-3 fs-regular rounded-3 mb-3">
                      <p className="mb-1 fw-semibold text-primary">Proposed Money</p>
                      <p className="mb-0">{offerMoney > 0 ? `$${offerMoney}` : "None"}</p>
                    </div>
                  </div>
                </div>
                {offerItems.length > 0 && (
                  <>
                    <p className="text-muted fw-semibold mt-2 mb-2">
                      Proposed Items
                    </p>
                    <div className="col-md-6 col-12">
                      {offerItems.map((item, index) => (
                        <div
                          key={index}
                          className="form-control bg-light text-gray p-3 fs-regular rounded-3 mb-3"
                        >
                          {item}
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            {createdOffer?.meetUp && (
              <div className="col-12 col-md-4 mt-4 my-md-0 mb-5">
                <p className="fw-semibold fs-5 text-primary">Meet up location</p>
                {isLoaded && selectedMeetUpLocation && (
                  <GoogleMap
                    mapContainerStyle={smallMapStyle}
                    center={{
                      lat: selectedMeetUpLocation.latitude,
                      lng: selectedMeetUpLocation.longitude,
                    }}
                    zoom={13}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                  >
                    <MarkerF
                      position={{
                        lat: selectedMeetUpLocation.latitude,
                        lng: selectedMeetUpLocation.longitude,
                      }}
                      onClick={() => setSelectedLocation(selectedMeetUpLocation)}
                    />

                    {selectedLocation && (
                      <InfoWindowF
                        position={{
                          lat: selectedLocation.latitude,
                          lng: selectedLocation.longitude,
                        }}
                        onCloseClick={() => setSelectedLocation(null)}
                      >
                        <div className="lh-1">
                          <p className="fw-semibold text-secondary mb-1">
                            {selectedLocation.name}
                          </p>
                          <p className="mb-0">{selectedLocation.address}</p>
                        </div>
                      </InfoWindowF>
                    )}
                  </GoogleMap>
                )}
                {!selectedMeetUpLocation && (
                  <p className="text-danger">Meet up location not found</p>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="container-sm border border-gray rounded-4 shadow my-5 px-5 py-4">
          <p className="text-primary mt-4 mb-4 fw-semibold fs-4">
            You can View the Offer Below:
          </p>
          <button className="btn btn-primary rounded-5 fw-semibold px-4 text-white">
            <Link
              href={{
                pathname: "/tradeOffers/[id]",
                query: { id: createdOffer._id },
              }}
              className="link-light link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover fw-semibold text-white"
            >
              View Offer
            </Link>
          </button>
          {listingId && (
            <Link
              href={{
                pathname: "/listings/[id]",
                query: { id: listingId },
              }}
              className="btn btn-outline-primary rounded-5 fw-semibold px-4 ms-3 text-decoration-none"
            >
              Back to Listing
            </Link>
          )}
        </div>
      </>
    );
  } else 
  
    // ----------------- //
    // RENDER OFFER FORM //
    // ----------------- //

    {
    return (
    <>
      <div className="container-sm border border-gray rounded-4 shadow mt-8 mb-4 px-6 py-4">
        <div className="row border-bottom border-gray">
          <p className="text-primary mt-4 mb-4 fw-semibold fs-3">
            You Are About To Propose A Trade For:
          </p>
        </div>
        {error && (
          <div ref={errorRef} className="alert alert-danger">
            {error}
          </div>
        )}
        {listing && (
          <div className="row mb-3 d-flex justify-content-center mt-5">
            <div className="col-md-3 col-12 text-center text-md-start">
            <Image
              src={listing?.images?.[0] || "/images/white-square-photo-frame.png"}
              alt={`${listing?.itemName} img`}
              className="w-75 align-self-center rounded-3"
              fluid
            />
            </div>
            <div className="col-md-5 col-12">
              <p className="text-primary text-uppercase fw-semibold fs-3">
                {listing.itemName}
              </p>
              <div className="d-grid mb-3">
                <div className="row">
                  <div className="col-5">
                    <p className="text-primary text-capitalize fw-semibold fs-5">
                      category
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="text-primary text-capitalize fw-light">
                      {listing.category}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-5">
                    <p className="text-primary text-capitalize fw-semibold fs-5">
                      condition
                    </p>
                  </div>
                  <div className="col-6">
                    <p className="text-primary text-uppercase fw-light">
                      {listing.condition}
                    </p>
                  </div>
                </div>

                <div className="row">
                  <div className="col-5">
                    <p className="text-primary text-capitalize fw-semibold fs-5">
                      owner
                    </p>
                  </div>
                  <div className="col-6">
                    <div className="d-flex gap-3">
                      <div>
                        <UserIcon
                          user={listing.userId.username}
                          img={listing.userId.avatar}
                          size={45}
                        />
                      </div>
                      <div>
                        <p className="mb-1">{listing.userId.username}</p>
                        <div className="d-flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <FontAwesomeIcon
                              key={i}
                              icon={
                                i < user?.rating ? solidStar : emptyStar
                              }
                              className="text-secondary"
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Listing's requests */}
              <div className="form-control bg-light text-gray p-3 fs-regular rounded-3 mb-3">
                <p className="mb-1 fw-semibold text-primary">Requested Money</p>
                <p className="mb-0">
                  {listing.requestMoney > 0
                    ? `$${listing.requestMoney}`
                    : "None"}
                </p>
              </div>
              <div className="form-control bg-light text-gray p-3 fs-regular rounded-3">
                <p className="mb-2 fw-semibold text-primary">Requested Items</p>
                {requestItems.length > 0 ? (
                  <ul className="list-group list-unstyled">
                    {requestItems.map((it, idx) => (
                      <li key={idx} className="list-group-item">
                        {it}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-0">None</p>
                )}
              </div>
            </div> {/* End Details Column*/}
            {listing?.meetUp && (
              <div className="col-12 col-md-4 mt-4 mt-md-0">
                <p className="fw-semibold fs-5 text-primary">Meet up location</p>

                {isLoaded && selectedMeetUpLocation && (
                  <GoogleMap
                    mapContainerStyle={smallMapStyle}
                    center={{
                      lat: selectedMeetUpLocation.latitude,
                      lng: selectedMeetUpLocation.longitude,
                    }}
                    zoom={13}
                    onLoad={onLoad}
                    onUnmount={onUnmount}
                  >
                    <MarkerF
                      position={{
                        lat: selectedMeetUpLocation.latitude,
                        lng: selectedMeetUpLocation.longitude,
                      }}
                      onClick={() => setSelectedLocation(selectedMeetUpLocation)}
                    />
                    {selectedLocation && (
                      <InfoWindowF
                        position={{
                          lat: selectedLocation.latitude,
                          lng: selectedLocation.longitude,
                        }}
                        onCloseClick={() => setSelectedLocation(null)}
                      >
                        <div className="lh-1">
                          <p className="fw-semibold text-secondary mb-1">
                            {selectedLocation.name}
                          </p>
                          <p className="mb-0">{selectedLocation.address}</p>
                        </div>
                      </InfoWindowF>
                    )}
                  </GoogleMap>
                )}

                {!selectedMeetUpLocation && (
                  <p className="text-danger">Meet up location not found</p>
                )}
              {listing?.meetUp && (
                <div className="d-flex justify-content-start align-items-center gap-2 mt-3 mb-2">
                  <FontAwesomeIcon icon={faPeopleLine} className="text-primary opacity-75" />
                  <p className="text-primary fw-light mb-0 custom-sm-text opacity-75">
                    {selectedMeetUpLocation ? (
                      <>
                        Free Meet up at{" "}
                        <span className="fw-bold">{selectedMeetUpLocation.name}</span> (
                        {getCityProvince(selectedMeetUpLocation.address)})
                      </>
                    ) : (
                      "Free Meet up location not found"
                    )}
                  </p>
                </div>
              )}
            <div className="d-flex justify-content-start align-items-center gap-2">
              <FontAwesomeIcon icon={faTruck} className="text-primary opacity-75" />
              <p className="text-primary fw-light mb-0 custom-sm-text opacity-75">
                Free Delivery, Arrives <span className="fw-bold">Tomorrow</span>
              </p>
            </div>
              </div>
            )}
          </div>
        )} 
      </div> {/* End Listing Details  */}
      <div className="container-sm border border-gray rounded-4 shadow mt-4 mb-8 px-6 py-4">
      {/* OFFER FORM */}
        <form onSubmit={handleSubmit}>
          <div className="row mb-3">
            <p className="text-primary mt-4 mb-4 fw-semibold fs-3">Your Offer</p>

            <div className="form-group col-md-6 col-lg-5 col-12 mb-4">
              <p className="text-primary mt-4 mb-4 fw-bold fs-5">Proposed Money</p>
              <input
                type="number"
                className="form-control bg-light text-gray p-3 fs-regular rounded-3"
                placeholder="0"
                min="0"
                value={proposedMoney}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value < 0) return;   // ignore negatives
                  setProposedMoney(value);
                }}
              />
            </div>

            {/* Dropdown ONLY if listing has request items */}
            {requestItems.length > 0 && (
              <div className="form-group col-md-6 col-lg-5 col-12 mb-4">
                <p className="text-primary mt-4 mb-4 fw-bold fs-5">Select a Requested Item</p>
                <select
                  className="form-control bg-light text-gray p-3 fs-regular rounded-3"
                  value={selectedItem}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (!val) return;

                    // add to proposedItems (no duplicates)
                    if (!proposedItems.includes(val)) {
                      setProposedItems((prev) => [...prev, val]);
                    }

                    // reset dropdown
                    setSelectedItem("");
                  }}
                >
                  <option value="">Requested item</option>

                  {requestItems
                    .filter((it) => !proposedItems.includes(it))
                    .map((it) => (
                      <option key={it} value={it}>
                        {it}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
          <div className="row mb-3">
            {proposedItems.length > 0 && (
              <p className="text-muted fw-semibold mt-2 mb-2">Proposed Items</p>
            )}
            <div className="col-md-5 col-9 d-flex flex-wrap gap-3">
              {proposedItems.map((item, index) => (
                <div
                  key={index}
                  style={{ position: "relative", display: "inline-block" }}
                  className="mb-3"
                >
                  <button
                    type="button"
                    aria-label="Remove proposed item"
                    className="btn btn-danger btn-sm position-absolute"
                    style={{
                      top: -8,
                      right: -8,
                      zIndex: 2,
                      borderRadius: 20,
                      padding: "0 6px",
                    }}
                    onClick={() => handleRemoveItem(index)}
                  >
                    ×
                  </button>

                  <div className="form-control bg-light text-gray p-3 fs-regular rounded-3">
                    {item}
                  </div>
                </div>
              ))}
            </div>
          </div>
          {listing?.meetUp && (
            <div className="row mb-3">
              <p className="text-primary mt-2 mb-3 fw-bold fs-5">Delivery Method</p>
              <div className="form-check ms-3">
                <input
                  className="form-check-input border-primary rounded-0"
                  type="checkbox"
                  id="meetUpOption"
                  checked={meetUp}
                  onChange={(e) => setMeetUp(e.target.checked)}
                />
                <label
                  className="form-check-label text-primary fw-semibold"
                  htmlFor="meetUpOption"
                >
                  Propose Meet Up (optional)
                </label>
              </div>
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary fw-semibold rounded-pill px-4 py-2 mt-3 mb-5"
          >
            Send Offer
          </button>
          <button
            type="button"
            className="btn btn-outline-primary fw-semibold rounded-pill px-4 py-2 mt-3 mb-5 ms-3"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        </form>
      </div>
    </>
  );}
}