import UserIcon from "@/components/user-icon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { Image } from "react-bootstrap";
import {
  faPeopleLine,
  faTruck,
  faStar as solidStar,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { useCallback, useState } from "react";
import BookmarkIcon from "@/components/bookmark-icon";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 768 },
    items: 4,
    slidesToSlide: 1,
  },
  tablet: {
    breakpoint: { max: 768, min: 576 },
    items: 3,
    slidesToSlide: 1,
  },
  mobile: {
    breakpoint: { max: 576, min: 0 },
    items: 2,
    slidesToSlide: 1,
  },
};

//TODO: Pull from database, use fake data for UI implement only
const fakeSuccessfullyCreatedData = {
  id: 1,
  itemName: "Charizard Card",
  category: "Pokemon Card",
  condition: "New",
  description:
    "Lorem ipsum dolor sit amet consectetur. A commodo arcu dictum volutpat donec magna magna lacus eu. Ornare aliquam tristique feugiat amet lobortis. Erat dolor gravida augue tristique dolor. Metus donec viverra pulvinar enim est sagittis. ",
  imageUrl: [
    "/images/charizard-card.png",
    "/images/details-photo-1.png",
    "/images/details-photo-2.jpg",
    "/images/details-photo-3.jpg",
    "/images/details-photo-4.png",
  ],
  meetUp: true,
  location: "Wheels &Wings Hobbies",
};
const currentUser = {
  userName: "test1",
  avatar: "/images/default-avatar.png",
  rating: 5,
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

export default function Listing() {
  const router = useRouter();
  const { id } = router.query;
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);
  const [pickUpLocations] = useState([
    {
      name: "Wheels &Wings Hobbies",
      address: "1880 Danforth Ave, Toronto, ON M4C 1J4",
      latitude: 43.684998,
      longitude: -79.317024,
    },
    {
      name: "VTR Gaming",
      address: "714 Burnhamthorpe Rd E, Mississauga, ON L4Y 2X3",
      latitude: 43.60821,
      longitude: -79.617512,
    },
    {
      name: "Emmett’s ToyStop",
      address: "5324 Dundas St W, Etobicoke, ON M9B 1B4",
      latitude: 43.6348156,
      longitude: -79.542055,
    },
    {
      name: "L&M Trading",
      address: "434 Queen Street West, Toronto, ON",
      latitude: 43.6484492,
      longitude: -79.3987024,
    },
    {
      name: "GameSwap",
      address: "1601 Birchmount Rd, Scarborough, ON M1P 2H5",
      latitude: 43.763242,
      longitude: -79.2908465,
    },
  ]);
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
  const [selectedImage, setSelectedImage] = useState(
    fakeSuccessfullyCreatedData.imageUrl[0],
  );

  return (
    <>
      {/* Category Section */}
      <div className="bg-light">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
              <Image src="/images/pokemon-icon.png" alt="Pokemon Icon" fluid />
              <Link
                href="#"
                className={
                  fakeSuccessfullyCreatedData.category.toLowerCase() ===
                  "pokemon card"
                    ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                    : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                }
              >
                Pokemon Card
              </Link>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
              <Image
                src="/images/blindbox-icon.png"
                alt="Blind Box Icon"
                fluid
              />
              <Link
                href="#"
                className={
                  fakeSuccessfullyCreatedData.category.toLowerCase() ===
                  "blind box"
                    ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                    : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                }
              >
                Blind Box
              </Link>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
              <Image src="/images/yugioh-icon.png" alt="Yugioh Icon" fluid />
              <Link
                href="#"
                className={
                  fakeSuccessfullyCreatedData.category.toLowerCase() ===
                  "yu-gi-oh card"
                    ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                    : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                }
              >
                Yu-Gi-Oh Card
              </Link>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
              <Image src="/images/gundam-icon.png" alt="Figurine Icon" fluid />
              <Link
                href="#"
                className={
                  fakeSuccessfullyCreatedData.category.toLowerCase() ===
                  "figurines"
                    ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                    : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                }
              >
                figurines
              </Link>
            </div>
          </div>
        </div>
      </div>
      {/* Listing Section */}
      <div className="container-sm my-6">
        {/* Product general details */}
        <div className="row d-flex flex-column flex-md-row mt-5 gap-3">
          <div className="col-12 col-md-7 border border-gray rounded-5 shadow d-flex flex-column">
            <div className="text-center mb-2 px-8 py-5">
              <Image
                src={selectedImage}
                alt="Selected"
                fluid
                className=" rounded-4
                 shadow"
              />
            </div>
            {/* Carousel */}
            <div className="row">
              <Carousel
                responsive={responsive}
                arrows
                swipeable
                draggable
                infinite={true}
                keyBoardControl
              >
                {fakeSuccessfullyCreatedData.imageUrl.map((img, index) => (
                  <div
                    key={index}
                    className={`text-center rounded-3 ${
                      selectedImage === img
                        ? "border border-primary border-3"
                        : ""
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`thumb-${index}`}
                      className={`img-thumbnail w-50 thumbnail-img `}
                      style={{ cursor: "pointer" }}
                      onClick={() => setSelectedImage(img)}
                    />
                  </div>
                ))}
              </Carousel>
            </div>

            {/* End Carousel */}
          </div>
          <div className=" py-6 col-12 col-md-4 rounded-5 border border-gray shadow d-flex flex-column justify-content-center align-items-center mx-auto">
            <p className="fw-semibold fs-2 text-primary text-uppercase mb-4">
              {fakeSuccessfullyCreatedData.itemName}
            </p>
            <div className="col-8 d-flex flex-column gap-3">
              <div className="d-flex justify-content-between align-items-center col-12">
                <p className="rounded-pill bg-success text-center py-2 text-white fw-semibold col-4 mb-0">
                  Trade
                </p>
                <Link href="#" className="fw-semibold mb-0 align-self-center">
                  View Requests
                </Link>
              </div>
              <div className="d-flex justify-content-between align-items-center col-12">
                <p className="rounded-pill bg-danger text-center px-4 py-2 text-white fw-semibold col-4 mb-0">
                  Sell
                </p>
                <p className="fw-semibold mb-0 align-self-center text-primary">
                  $ 30.00
                </p>
              </div>
              <div className="d-grid my-3">
                <div className="row">
                  <div className="col-5">
                    <p className="text-primary text-capitalize fw-semibold">
                      category
                    </p>
                  </div>
                  <div className="col-7">
                    <p className="text-primary text-capitalize fw-light">
                      {fakeSuccessfullyCreatedData.category}
                    </p>
                  </div>
                </div>
                <div className="row">
                  <div className="col-5">
                    <p className="text-primary text-capitalize fw-semibold">
                      condition
                    </p>
                  </div>
                  <div className="col-7">
                    <p className="text-primary text-uppercase fw-light">
                      {fakeSuccessfullyCreatedData.condition}
                    </p>
                  </div>
                </div>
                <div className="row mb-4">
                  <div className="col-5">
                    <p className="text-primary text-capitalize fw-semibold">
                      owner
                    </p>
                  </div>
                  <div className="col-7">
                    <div className="d-flex gap-3">
                      <div>
                        <UserIcon
                          user={currentUser.userName}
                          img={currentUser.avatar}
                          size={45}
                        />
                      </div>
                      <div>
                        <p className="mb-1 fst-italic text-capitalize text-primary fw-light custom-sm-text">
                          {currentUser.userName}
                        </p>
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
              <div className="d-flex flex-column gap-3 border-bottom border-primary pb-4">
                <button className="btn btn-primary text-white fw-semibold rounded-pill py-2">
                  Propose Trade
                </button>
                <button className="btn btn-primary text-white fw-semibold rounded-pill py-2">
                  Pay Now
                </button>
                <button className="btn btn-white text-primary fw-semibold rounded-pill py-2 border border-primary border-2">
                  Message Owner
                </button>
              </div>
              <div className="d-flex flex-column gap-1 border-bottom border-primary pb-4">
                {fakeSuccessfullyCreatedData.meetUp && (
                  <div className="d-flex justify-content-start align-items-center gap-2 mt-2">
                    <FontAwesomeIcon
                      icon={faPeopleLine}
                      className="text-primary opacity-75"
                    />
                    <p className="text-primary fw-light mb-0 custom-sm-text opacity-75">
                      {meetUpLocation ? (
                        <>
                          Free Meet up at{" "}
                          <span className="fw-bold">{meetUpLocation.name}</span>{" "}
                          ({getCityProvince(meetUpLocation.address)})
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
              <div className="d-flex justify-content-center align-items-center gap-2">
                <BookmarkIcon size={25}></BookmarkIcon>
                <p className="text-primary fw-light mb-0">Bookmark Listing</p>
              </div>{" "}
            </div>
          </div>
        </div>
        {/* More details and pickup info */}
        <div className="row d-flex flex-column flex-md-row mt-5 gap-3">
          <div className="col-12 col-md-7">
            <p className="text-primary text-capitalize fw-semibold mb-1">
              Description
            </p>
            <p className="text-primary text-capitalize fw-regular">
              {fakeSuccessfullyCreatedData.description}
            </p>
            <p className="text-primary text-capitalize fw-semibold mb-1">
              Owner Details
            </p>
            <div className="d-grid">
              <div className="row">
                <p className="col-5 text-primary ">User Account</p>
                <div className="col-7 d-flex gap-3 align-items-center">
                  {" "}
                  <UserIcon
                    user={currentUser.userName}
                    img={currentUser.avatar}
                    size={30}
                  />
                  <Link
                    href="#"
                    className="align-self-center  mb-0 text-primary fw-semibold"
                  >
                    {currentUser.userName}
                  </Link>
                </div>
              </div>
              <div className="row">
                <p className="col-5 text-primary">Success Trade</p>
                <p className="col-7 text-primary">10</p>
              </div>
            </div>
          </div>
          <div className="col-12 col-md-4 d-flex flex-column justify-content-start mx-auto">
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

        {/*  Review Section*/}
        <div className="">Review Section Implement later</div>
      </div>
    </>
  );
}
