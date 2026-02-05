"use client";

import { useSearchParams, useParams } from "next/navigation"; // Use useParams for App Router
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

export default function UpdateListing() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id; // Getting ID from URL /listings/edit/[id]
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Form States
  const [itemName, setItemName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [condition, setCondition] = useState("");
  const [requestItemInput, setRequestItemInput] = useState("");
  const [requestItems, setRequestItems] = useState([]);
  const [requestMoney, setRequestMoney] = useState("");
  const [meetUp, setMeetUp] = useState(false);
  const [meetUpLocation, setMeetUpLocation] = useState("");
  const [selectedFile, setSelectedFile] = useState([]);
  const [imageUrl, setImageUrl] = useState([]);
  // Keep preview URLs for selected files so we can remove files before upload
  const [selectedFilePreviews, setSelectedFilePreviews] = useState([]);
  
  const [user, setUser] = useState(null);
  const [createdListing, setCreatedListing] = useState(null);

  // 1. DATA RETRIEVAL: Load existing listing data to edit
  useEffect(() => {
    if (!id) return;

    const loadListingData = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/listings/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.error || "Failed to load listing");

        const l = data.listing;
        // Populate form fields with existing data
        setItemName(l.itemName || "");
        setDescription(l.description || "");
        setCategory(l.category || "");
        setCondition(l.condition || "");
        setRequestItems(l.requestItems || []);
        setRequestMoney(l.requestMoney || "");
        setMeetUp(l.meetUp || false);
        setMeetUpLocation(l.location || "");
        setImageUrl(l.images || []);
        
        // Find and set the location on the map
        if (l.location) {
          const loc = pickUpLocations.find(p => p.name === l.location);
          if (loc) setSelectedLocation(loc);
        }

        // If we are in the "Success" view, store the result for display
        if (status === "true") {
          setCreatedListing(l);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadListingData();
  }, [id, status]);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("/api/auth/protect", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => setUser(data.user));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user?._id) {
      setError("You must be logged in.");
      return;
    }

    // Validation
    if (!itemName.trim() || !condition || !category || !description.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    // Only keep valid HTTP(s) image URLs (ignore local blob previews) before upload
    let finalImages = Array.isArray(imageUrl) ? imageUrl.filter((u) => typeof u === "string" && /^https?:\/\//.test(u)) : [];

    // If new files were added, upload them first
    if (selectedFile.length > 0) {
      const formData = new FormData();
      selectedFile.forEach((file) => formData.append("files", file));
      formData.append("userId", user._id);

      try {
        const uploadRes = await fetch("/api/listings/upload", {
          method: "POST", // Post the image first and retrieve S3URL
          body: formData,
        });
        const uploadResult = await uploadRes.json();
        if (uploadResult.success) {
          // Combine existing images with newly uploaded ones
          finalImages = [...finalImages, ...uploadResult.imageUrl];
          console.log(uploadResult);
        } else {
          throw new Error(uploadResult.message || "Upload failed");
        }
      } catch (err) {
        setError("Error uploading files");
        return;
      }
    }

    try {
      // 2. SUBMIT UPDATE: Use PUT or PATCH to update the specific ID
      const res = await fetch(`/api/listings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          itemName,
          description,
          category,
          condition,
          images: finalImages, // Updated URLS
          meetUp,
          location: meetUp ? meetUpLocation : "",
          requestItems,
          requestMoney: Number(requestMoney),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Update failed");

      // Redirect to same page with status=true to show success view
      router.push(`/listings/edit/${id}?status=true`);
    } catch (err) {
      setError(err.message);
    }
  };

  // Maps Logic
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
  });

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);
  const onLoad = useCallback((map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setSelectedFile((prev) => [...prev, file]);
    setSelectedFilePreviews((prev) => [...prev, previewUrl]);
    setImageUrl((prev) => [...prev, previewUrl]); // To be updated or deleted
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
    if (!requestItemInput.trim()) return;
    setRequestItems((prev) => [...prev, requestItemInput.trim()]);
    setRequestItemInput("");
  };

  const handleRemoveItem = (index) => {
    setRequestItems((prev) => prev.filter((_, i) => i !== index)); // Removing past element
  };

  const errorRef = useRef(null);
  useEffect(() => {
    if (error && errorRef.current) errorRef.current.scrollIntoView();
  }, [error]);

  const getCityProvince = (address) => {
    if (!address) return "";
    const parts = address.split(",");
    if (parts.length < 2) return "";
    return `${parts[parts.length - 2].trim()}, ${parts[parts.length - 1].trim().split(" ")[0]}`;
  };

  if (loading && !createdListing) return <div className="container mt-5"><h1>Loading Listing Data...</h1></div>;

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
              Offer Updated!
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
                                  i < user.rating ? solidStar : emptyStar
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
        <p className="text-primary mt-4 mb-4 fw-semibold fs-3">Edit Your Listing</p>
      </div>

      <form onSubmit={handleSubmit}>
        {error && <div ref={errorRef} className="alert alert-danger mt-3">{error}</div>}

        <div className="row mb-3 d-flex justify-content-center gap-md-3 mt-5">
          <div className="col-md-4 col-12 text-center text-md-start">
            <Image
              src={imageUrl.length > 0 ? imageUrl[imageUrl.length - 1] : "/images/white-square-photo-frame.png"}
              alt="Preview"
              width={350}
              className="mb-3 border border-gray rounded shadow img-fluid"
            />
            <div className="d-flex flex-wrap gap-2">
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
              <input type="file" id="file-upload" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Image src="/images/upload-icon.png" alt="upload" width={55} height={55} />
              </label>
            </div>
          </div>

          <div className="col-md-7 col-12">
            <input
              className="form-control bg-light p-3 mb-3"
              placeholder="Item Name*"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <select className="form-control bg-light p-3 mb-3" value={condition} onChange={(e) => setCondition(e.target.value)}>
              <option value="">Condition*</option>
              <option value="NEW">New</option>
              <option value="USED">Used</option>
            </select>
            <select className="form-control bg-light p-3 mb-3" value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">Category</option>
              <option value="POKEMON CARD">Pokemon Card</option>
              <option value="BLIND BOX">Blind Box</option>
              {/* ... other options ... */}
            </select>
            <textarea
              className="form-control bg-light p-3 mb-3"
              placeholder="Description"
              rows="5"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Request Items Section */}
        <div className="row mb-3">
            <p className="text-primary fw-bold fs-5">Request Items</p>
            <div className="d-flex gap-2">
                <input 
                    type="text" 
                    className="form-control bg-light w-50" 
                    value={requestItemInput} 
                    onChange={(e) => setRequestItemInput(e.target.value)}
                />
                <button type="button" onClick={handleAddRequestItem} className="btn btn-primary">Add</button>
            </div>
            <div className="mt-3">
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
            <p className="text-primary fw-bold fs-5">Request Money</p>
            <input 
                type="number" 
                className="form-control bg-light w-25 ms-3" 
                value={requestMoney} 
                onChange={(e) => setRequestMoney(e.target.value)} 
            />
        </div>

        {/* Maps Section */}
        <div className="row mb-3">
          <div className="form-check ms-3">
            <input
              type="checkbox"
              className="form-check-input"
              id="meetUpOption"
              checked={meetUp}
              onChange={(e) => setMeetUp(e.target.checked)}
            />
            <label className="form-check-label text-primary fw-semibold" htmlFor="meetUpOption">
              Provide Meet Up Option
            </label>
          </div>

          {isLoaded && (
            <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={10} onLoad={onLoad}>
              {pickUpLocations.map((loc) => (
                <MarkerF
                  key={loc.name}
                  position={{ lat: loc.latitude, lng: loc.longitude }}
                  onClick={() => {
                    setSelectedLocation(loc);
                    setMeetUpLocation(loc.name);
                  }}
                />
              ))}
              {selectedLocation && (
                <InfoWindowF 
                    position={{ lat: selectedLocation.latitude, lng: selectedLocation.longitude }}
                    onCloseClick={() => setSelectedLocation(null)}
                >
                  <div>
                    <strong>{selectedLocation.name}</strong>
                    <p className="m-0">{selectedLocation.address}</p>
                  </div>
                </InfoWindowF>
              )}
            </GoogleMap>
          )}
        </div>

        <button type="submit" className="btn btn-primary rounded-pill px-5 py-2 mt-3">
          Save Changes
        </button>
      </form>
    </div>
  );
}
}