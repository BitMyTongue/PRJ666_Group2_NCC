"use client";

import { useSearchParams } from "next/navigation";
import { Image } from "react-bootstrap";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPeopleLine,
  faTruck,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import UserIcon from "@/components/user-icon";
import Link from "next/link";
import { pickUpLocations } from "@/lib/data/pickupLocations";

const containerStyle = {
  width: "100%",
  maxWidth: "769px",
  height: "450px",
  borderRadius: "20px",
  border: "1px solid #dee2e6",
  overflow: "hidden",
  margin: "10px",
};

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
//TODO: WILL BE UPDATE TO PULL FROM THE DATA PAGE
const currentUser = {
  userName: "test1",
  avatar: "/images/default-avatar.png",
  rating: 5,
};
const fakeSuccessfullyCreatedData = {
  id: 1,
  itemName: "Charizard Card",
  category: "Pokemon Card",
  condition: "New",
  description:
    "Lorem ipsum dolor sit amet consectetur. A commodo arcu dictum volutpat donec magna magna lacus eu. Ornare aliquam tristique feugiat amet lobortis. Erat dolor gravida augue tristique dolor. Metus donec viverra pulvinar enim est sagittis. ",
  imageUrl: ["/images/charizard-card.png"],
  meetUp: true,
  location: "Wheels &Wings Hobbies",
};

export default function CreateListing() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  const handleSubmit = (e) => {
    e.preventDefault();
    router.push("/listings/create?status=true");
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  });
  //TODO: CHANGE TO RETRIEVE DYNAMICALLY
  const meetUpLocation = pickUpLocations.find(
    (loc) => loc.name === fakeSuccessfullyCreatedData.location,
  );
  const getCityProvince = (address) => {
    if (!address) return "";
    const parts = address.split(",");
    if (parts.length < 2) return "";

    const city = parts[parts.length - 2].trim();
    const province = parts[parts.length - 1].trim().split(" ")[0];
    return `${city}, ${province}`;
  };
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  if (status === "true") {
    return (
      <>
        <div className="container-sm border border-gray rounded-4 shadow mt-7 mb-3 px-5 py-4">
          <div className="row text-success">
            <p className="text-green mt-4 mb-4 fw-semibold fs-2">
              Offer Posted!
            </p>
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-center align-item-center">
            <div className="col-12 col-md-3 text-center text-md-start">
              <Image
                src={fakeSuccessfullyCreatedData.imageUrl[0]}
                alt={`${fakeSuccessfullyCreatedData.itemName} img`}
                className="w-75 align-self-center rounded-3"
                fluid
              />
            </div>
            <div className="col-12 col-md-5 mt-4 mt-md-0 pe-md-5">
              <div className="d-flex flex-column gap-3 border-bottom border-gray">
                <p className="text-primary text-uppercase fw-semibold fs-3">
                  {fakeSuccessfullyCreatedData.itemName}
                </p>
                <div className="d-grid">
                  <div className="row">
                    <div className="col-5">
                      <p className="text-primary text-capitalize fw-semibold fs-5">
                        category
                      </p>
                    </div>
                    <div className="col-6">
                      <p className="text-primary text-capitalize fw-light">
                        {fakeSuccessfullyCreatedData.category}
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
                        {fakeSuccessfullyCreatedData.condition}
                      </p>
                    </div>
                  </div>
                  <div className="row mb-4">
                    <div className="col-5">
                      <p className="text-primary text-capitalize fw-semibold fs-5">
                        owner
                      </p>
                    </div>
                    <div className="col-6">
                      <div className="d-flex gap-3">
                        <div>
                          <UserIcon
                            user={currentUser.userName}
                            img={currentUser.avatar}
                            size={45}
                          />
                        </div>
                        <div>
                          <p className="mb-1">{currentUser.userName}</p>
                          <div className="d-flex">
                            {Array.from({ length: 5 }, (_, i) => (
                              <FontAwesomeIcon
                                key={i}
                                icon={
                                  i < currentUser.rating ? solidStar : emptyStar
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
              </div>
              {fakeSuccessfullyCreatedData.meetUp && (
                <div className="d-flex justify-content-start align-items-center gap-2 mt-3 mb-2">
                  <FontAwesomeIcon
                    icon={faPeopleLine}
                    className="text-primary opacity-75"
                  />
                  <p className="text-primary fw-light mb-0 custom-sm-text opacity-75">
                    {meetUpLocation ? (
                      <>
                        Free Meet up at{" "}
                        <span className="fw-bold">{meetUpLocation.name}</span> (
                        {getCityProvince(meetUpLocation.address)})
                      </>
                    ) : (
                      "Free Meet up location not found"
                    )}
                  </p>
                </div>
              )}
              <div className="d-flex justify-content-start align-items-center gap-2">
                <FontAwesomeIcon
                  icon={faTruck}
                  className="text-primary opacity-75"
                />
                <p className="text-primary fw-light mb-0 custom-sm-text opacity-75">
                  Free Delivery, Arrives{" "}
                  <span className="fw-bold">Tomorrow</span>
                </p>
              </div>
            </div>
            <div className="col-12 col-md-4 mt-4 my-md-0 mb-5">
              <p className="fw-semibold fs-5 text-primary">Meet up location</p>

              {isLoaded && meetUpLocation && (
                <GoogleMap
                  mapContainerStyle={smallMapStyle}
                  center={{
                    lat: meetUpLocation.latitude,
                    lng: meetUpLocation.longitude,
                  }}
                  zoom={13}
                  onLoad={onLoad}
                  onUnmount={onUnmount}
                >
                  <MarkerF
                    position={{
                      lat: meetUpLocation.latitude,
                      lng: meetUpLocation.longitude,
                    }}
                    onClick={() => setSelectedLocation(meetUpLocation)}
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

              {!meetUpLocation && (
                <p className="text-danger">Meet up location not found</p>
              )}
            </div>
          </div>
        </div>
        <div className="container-sm border border-gray rounded-4 shadow my-5 px-5 py-4">
          <p className="text-primary mt-4 mb-4 fw-semibold fs-4">
            You can View your Listing Below:
          </p>
          <button className="btn btn-primary rounded-5 fw-semibold px-4 text-white">
            <Link
              href={{
                pathname: "/listings/[id]",
                query: { id: fakeSuccessfullyCreatedData.id },
              }}
              className="link-light link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover fw-semibold text-white"
            >
              View Listing
            </Link>
          </button>
        </div>
      </>
    );
  } else {
    return (
      <div className="container-sm border border-gray rounded-4 shadow my-8 px-6 py-4">
        <div className="row border-bottom border-gray">
          <p className="text-primary mt-4 mb-4 fw-semibold fs-3">
            List An Item
          </p>
        </div>

        {/* SINGLE FORM WRAP */}
        <form onSubmit={handleSubmit}>
          {/* Listing basic info */}
          <div className="row mb-3 d-flex justify-content-center gap-md-3 mt-5">
            <div className="col-md-4 col-12 text-center text-md-start">
              <Image
                src="/images/white-square-photo-frame.png"
                alt="upload icon"
                width={350}
                className="mb-3 border border-gray rounded shadow img-fluid"
              />
              <div className="d-flex justify-content-start gap-3">
                <Image
                  src="/images/white-square-photo-frame.png"
                  alt="upload icon"
                  width={55}
                  height={55}
                  className="my-3 border border-gray rounded-2 shadow"
                />
                <Image
                  src="/images/upload-icon.png"
                  alt="upload icon"
                  width={55}
                  height={55}
                  className="my-3"
                />
              </div>
            </div>
            <div className="col-md-7 col-12">
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control bg-light text-gray p-3 fs-regular rounded-3"
                  placeholder="Item Name*"
                />
              </div>
              <div className="form-group mb-5">
                <select
                  id="condition"
                  className="form-control bg-light text-gray p-3 fs-regular rounded-3"
                  required
                >
                  <option value="">Condition*</option>
                  <option value="">New</option>
                  <option value="">Used</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <textarea
                  className="form-control bg-light text-gray p-3 fs-regular rounded-3"
                  placeholder="Description"
                  rows="7"
                />
              </div>
            </div>
          </div>

          {/* Request Items */}
          <div className="row mb-3">
            <p className="text-primary mt-4 mb-4 fw-bold fs-5">Request Items</p>
            <div className="d-flex col-12 gap-4 mb-5">
              <div className="form-group col-md-5 col-9">
                <input
                  type="text"
                  className="form-control bg-light text-gray p-3 fs-regular rounded-3"
                  placeholder="Item Name*"
                />
              </div>
              <Image
                src="/images/upload-icon.png"
                alt="upload icon"
                width={55}
                height={55}
              />
            </div>
            <div className="form-group my-3">
              <textarea
                className="form-control shadow text-gray p-3 fs-regular rounded-3"
                placeholder="Description"
                rows="7"
              />
            </div>
          </div>

          {/* Request Money */}
          <div className="row mb-3">
            <p className="text-primary mt-4 mb-4 fw-bold fs-5">Request Money</p>
            <div className="form-group col-md-6 col-lg-5 col-12">
              <input
                type="text"
                className="form-control bg-light text-gray p-3 fs-regular rounded-3"
                placeholder="$0"
              />
            </div>
          </div>

          {/* Pickup Option */}
          <div className="row mb-3">
            <p className="text-primary mt-4 mb-4 fw-bold fs-5">Pickup Option</p>
            <div className="form-check ms-3">
              <input
                className="form-check-input border-primary rounded-0"
                type="checkbox"
                id="meetUpOption"
              />
              <label
                className="form-check-label text-primary fw-semibold"
                htmlFor="meetUpOption"
              >
                Provide Meet Up Option
              </label>
            </div>
            <p className="text-primary mt-4 mb-3 fw-semibold">
              Meet up location
            </p>
            {isLoaded && (
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={10}
                onLoad={onLoad}
                onUnmount={onUnmount}
              >
                {pickUpLocations.map((location) => (
                  <MarkerF
                    key={`${location.address}-${location.name}`}
                    onClick={() =>
                      location === selectedLocation
                        ? setSelectedLocation(null)
                        : setSelectedLocation(location)
                    }
                    position={{
                      lat: location.latitude,
                      lng: location.longitude,
                    }}
                  />
                ))}
                {selectedLocation && (
                  <InfoWindowF
                    position={{
                      lat: selectedLocation.latitude,
                      lng: selectedLocation.longitude,
                    }}
                    zIndex={1}
                  >
                    <div className="lh-1">
                      <p className="fw-semibold text-secondary">
                        {selectedLocation.name}
                      </p>
                      <p>{selectedLocation.address}</p>
                    </div>
                  </InfoWindowF>
                )}
              </GoogleMap>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary fw-semibold rounded-pill px-4 py-2 mt-3 mb-5"
            onClick={handleSubmit}
          >
            Post Listing
          </button>
        </form>
      </div>
    );
  }
}
