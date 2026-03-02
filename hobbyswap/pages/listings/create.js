"use client";

import { useSearchParams } from "next/navigation";
import { Image } from "react-bootstrap";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useState, useRef, useEffect } from "react";
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

export default function CreateListing() { // http://localhost:3000/listings/create
  const router = useRouter();
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const [error, setError] = useState("");

  // for displaying confirmation
  const listingId = searchParams.get("id");
  const [createdListing, setCreatedListing] = useState(null);
  const [createdListingError, setCreatedListingError] = useState("")

  useEffect(() => {
    const load = async () => {
      if (status !== "true" || !listingId) return;

      try {
        setCreatedListingError("");
        const res = await fetch(`/api/listings/${listingId}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to load listing");

        setCreatedListing(data.listing);
      } catch (e) {
        setCreatedListingError(e.message);
      }
    };

    load();
  }, [status, listingId]);

  // Snap to the top of the form if error to better display the alert
  const errorRef = useRef(null);
  useEffect(() => {
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView();
    }
  }, [error]);

  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");

  const [requestItemInput, setRequestItemInput] = useState("");
  const [requestItems, setRequestItems] = useState([]);

  const [requestMoney, setRequestMoney] = useState("");

  const [meetUp, setMeetUp] = useState(false);
  const [meetUpLocation, setMeetUpLocation] = useState("");   // store selectedLocation.name
  const [user,setUser]=useState(null)

  // Keep preview URLs for selected files so we can remove files before upload
  const [selectedFilePreviews, setSelectedFilePreviews] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Logged in user from localStorage
    const userId = user?._id;

    // --------- Validation --------- //
    if(!userId) {
      setError("You must be logged in to create a listing.");
      return;
    }
    if (!itemName || !itemName.trim()) {
      setError("Item name is required.");
      return;
    }
    if (!condition) {
      setError("Condition is required.");
      return;
    }
    if (!category) {
      setError("Category is required.");
      return;
    }
    if (!description || !description.trim()) {
      setError("Description is required.");
      return;
    }
    if (meetUp && (!meetUpLocation || meetUpLocation.trim() === "")) {
      setError("If meet up option is offered, you must provide a meet up location.");
      return;
    }
    // Must request item(s) and/or money
    const itemArr = Array.isArray(requestItems) ? requestItems : [];
    const moneyNum = Number(requestMoney) || 0;
    if (!(itemArr.length > 0) && !(moneyNum > 0)) {
      setError("You must request item(s) and/or money.");
      return;
    }

    if (!selectedFile.length) {
      setError("Please select at least one image.");
      return;
    }

    let uploadedImageUrls = [];

    // Upload Images
    const formData = new FormData();
    selectedFile.forEach((file) => formData.append("files", file));
    formData.append("userId", userId); // Added for file Creation (TO BE: corrected.)
    try {
      const response = await fetch("/api/listings/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        setImageUrl(result.imageUrl); // Assuming backend returns an array
        uploadedImageUrls = result.imageUrl;
      } else {
        setError(result.message || "Upload failed");
        return;
      }
    } catch (err) {
      console.error(err);
      setError("Error uploading files");
      return;
    }
    
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          userId, itemName, description, category, condition, images: uploadedImageUrls, meetUp, location: meetUp ? meetUpLocation : "", requestItems: itemArr, requestMoney: moneyNum, userId: userId})

          //Focuse on images: uploadedImageUrls
        });

      const data = await res.json();

      // Fail
      if (!res.ok) {
        throw new Error(data?.error || "Create listing failed");
      }

      // Success
      router.push(`/listings/create?status=true&id=${data.listing._id}`);
    } catch (err) {
      setError(err.message);
    }
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
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  //TODO: Upload images
  const [selectedFile, setSelectedFile] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; //Image File
    if (!file) return;

    const previewUrl = URL.createObjectURL(file); //Url saved

    setSelectedFile((prev) => [...prev, file]);
    setSelectedFilePreviews((prev) => [...prev, previewUrl]);
    setImageUrl((prev) => [...prev, previewUrl]); // Array of Images

    // reset input so user can upload the SAME file again if they want
    e.target.value = "";
  };

  // Remove image at given index from both imageUrl and selectedFile/selectedFilePreviews when appropriate
  const handleRemoveImage = (index) => {
    const urlToRemove = imageUrl[index];

    // If this is a preview for a newly selected file, remove the file + its preview
    const previewIndex = selectedFilePreviews.indexOf(urlToRemove);
    if (previewIndex !== -1) {
      // Revoke preview URL to free memory
      try { URL.revokeObjectURL(urlToRemove); } catch (e) {}

      setSelectedFile((prev) => prev.filter((_, i) => i !== previewIndex));
      setSelectedFilePreviews((prev) => prev.filter((_, i) => i !== previewIndex));
    }

    // Always remove from imageUrl so it won't be sent to server
    setImageUrl((prev) => prev.filter((_, i) => i !== index)); // Keep the ones tha are not the index (deleted)
  };

  const handleAddRequestItem = () => {
    const trimmedItem = requestItemInput.trim();
    if (!trimmedItem) return;       // clicking Add button with no input 

    setRequestItems((prev) => [...prev, trimmedItem]);    // spread existing Requested Items array, add trimmed to the end
    setRequestItemInput("");    // Reset field
  }

  const handleRemoveItem = (index) => {
    setRequestItems((prev) => prev.filter((_, i) => i !== index)); // Removing past element
  };

  const trimmedRequestItem = requestItemInput.trim();

  if (status === "true") {
    // createdListing is null on first render
    if (!createdListing) return <h1>Loading the created listing...</h1>;
    
    const selectedMeetUpLocation = pickUpLocations.find(
      (loc) => loc.name === createdListing.location,
    );

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
                src={createdListing.images[0]}
                alt={`${createdListing.itemName} img`}
                className="w-75 align-self-center rounded-3"
                fluid
              />
            </div>
            <div className="col-12 col-md-5 mt-4 mt-md-0 pe-md-5">
              <div className="d-flex flex-column gap-3 border-bottom border-gray">
                <p className="text-primary text-uppercase fw-semibold fs-3">
                  {createdListing.itemName}
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
                        {createdListing.category}
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
                        {createdListing.condition}
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
                            user={user.username}
                            img={user.avatar}
                            size={45}
                          />
                        </div>
                        <div>
                          <p className="mb-1">{user.username}</p>
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
              </div>
              {createdListing.meetUp && (
                <div className="d-flex justify-content-start align-items-center gap-2 mt-3 mb-2">
                  <FontAwesomeIcon
                    icon={faPeopleLine}
                    className="text-primary opacity-75"
                  />
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
                query: { id: createdListing._id },
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
          {error && (
            <div ref={errorRef} className="alert alert-danger">
              {error}
            </div>
          )}
          {/* Listing basic info */}
          <div className="row mb-3 d-flex justify-content-center gap-md-3 mt-5">
            <div className="col-md-4 col-12 text-center text-md-start">
              {imageUrl.length > 0 ? (
                <Image
                  src={imageUrl[imageUrl.length - 1]}
                  alt="upload icon"
                  width={350}
                  className="mb-3 border border-gray rounded shadow img-fluid"
                />
              ) : (
                <Image
                  src="/images/white-square-photo-frame.png"
                  alt="upload icon"
                  width={350}
                  className="mb-3 border border-gray rounded shadow img-fluid"
                />
              )}
              <div className="d-flex justify-content-start align-items-center gap-3">
              {imageUrl.map((url, index) => (
                <div key={index} style={{ position: "relative", display: "inline-block", marginRight: 8 }}>
                  <button
                    type="button"
                    aria-label="Remove image"
                    className="btn btn-danger btn-sm position-absolute"
                    style={{ top: -8, right: -8, zIndex: 2, borderRadius: 20, padding: '0 6px' }} // Top right Corner
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </button>
                  <Image src={url} alt={`thumb-${index}`} width={55} height={55} className="border rounded shadow" /> 
                  {/* Image Thumbnails */}
                </div>
              ))}

                <input
                  type="file"
                  id="file-upload"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Image
                    src="/images/upload-icon.png"
                    alt="upload icon"
                    width={55}
                    height={55}
                    className="my-3"
                  />
                </label>
              </div>
            </div>
            <div className="col-md-7 col-12">
              <div className="form-group mb-3">
                <input
                  type="text"
                  className="form-control bg-light text-gray p-3 fs-regular rounded-3"
                  placeholder="Item Name*"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                />
              </div>
              <div className="form-group mb-3">
                <select
                  id="condition"
                  className="form-control bg-light text-gray p-3 fs-regular rounded-3"
                  value={condition}
                  onChange={(e) => setCondition(e.target.value)}
                >
                  <option value="">Condition*</option>
                  <option value="NEW">New</option>
                  <option value="USED">Used</option>
                </select>
              </div>
              <div className="form-group mb-5">
                <select
                  id="Category"
                  className="form-control bg-light text-gray p-3 fs-regular rounded-3"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option value="">Category</option>
                  <option value="POKEMON CARD">Pokemon Card</option>
                  <option value="BLIND BOX">Blind Box</option>
                  <option value="YUGIOH CARD">Yu-gi-oh Card</option>
                  <option value="FIGURINE">Figurine</option>
                </select>
              </div>
              <div className="form-group mb-3">
                <textarea
                  className="form-control bg-light text-gray p-3 fs-regular rounded-3"
                  placeholder="Description"
                  rows="5"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Request Items */}
          <div className="row mb-3">
            <p className="text-primary mt-4 mb-4 fw-bold fs-5">Request Items</p>
            <div className="d-flex col-12 gap-4">
              <div className="form-group col-md-5 col-9">
                <input
                  type="text"
                  className="form-control bg-light text-gray p-3 fs-regular rounded-3"
                  placeholder="Item Name*"
                  value={requestItemInput}
                  onChange={(e) => setRequestItemInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddRequestItem();  
                    }
                  }}
                />
              </div>
              <button
                type="button"
                onClick={handleAddRequestItem}
                disabled={!trimmedRequestItem}
                className="btn btn-primary fw-semibold rounded-pill px-4 py-2 mb-5"
                aria-label="Add requested item"
              >Add Requested Item
              </button>
            </div>
            <p className="text-muted fw-semibold mt-2 mb-2">Requested Items: </p>
            {/* Showing the requested items */}
            <div className="col-md-5 col-9">
                {requestItems.map((item, i) => (
                  <div key={i} style={{ position: "relative", display: "inline-block", marginRight: 8 }}>
                  <button
                    type="button"
                    aria-label="Remove image"
                    className="btn btn-danger btn-sm position-absolute"
                    style={{ top: -8, right: -8, zIndex: 2, borderRadius: 20, padding: '0 6px' }} // Top right Corner
                    onClick={() => handleRemoveItem(i)}
                  >
                    ×
                  </button>
                    <span key={i} className="badge bg-secondary me-2 p-2">{item}</span>
                  </div>
                ))}
            </div>
          </div>

          {/* Request Money */}
          <div className="row mb-3">
            <p className="text-primary mt-4 mb-4 fw-bold fs-5">Request Money</p>
            <div className="form-group col-md-6 col-lg-5 col-12">
              <input
                type="number"
                className="form-control bg-light text-gray p-3 fs-regular rounded-3"
                placeholder="0"
                min="0"
                value={requestMoney}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value < 0) return;   // ignore negatives
                  setRequestMoney(value);
                }}
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
                checked={meetUp}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setMeetUp(checked);

                  // if they turn it off, clear selection
                  if (!checked) {
                    setMeetUpLocation("");
                    setSelectedLocation(null);
                  }
                }}
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
                    position={{ lat: location.latitude, lng: location.longitude }}
                    onClick={() => {
                      if (location === selectedLocation) {
                        setSelectedLocation(null);
                        setMeetUpLocation("");
                      } else {
                        setSelectedLocation(location);
                        setMeetUpLocation(location.name);
                      }
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
          >
            Post Listing
          </button>
        </form>
      </div>
    );
  }
}