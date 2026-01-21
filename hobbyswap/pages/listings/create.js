import { Image } from "react-bootstrap";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useState } from "react";

const containerStyle = {
  width: "100%",
  maxWidth: "769px",
  height: "450px",
  borderRadius: "20px",
  border: "1px solid #dee2e6",
  overflow: "hidden",
  margin: "10px",
};

const center = {
  lat: 43.6548,
  lng: -79.3884,
};

export default function CreateListing() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.GOOGLE_MAP_API_KEY,
  });

  const [pickUpLocations] = useState([
    {
      name: "Wheels &Wings Hobbies",
      address: "1880 Danforth Ave, Toronto ON M4C 1J4",
      latitude: 43.684998,
      longitude: -79.317024,
    },
    {
      name: "VTR Gaming",
      address: "714 Burnhamthorpe Rd E, Mississauga ON L4Y 2X3",
      latitude: 43.60821,
      longitude: -79.617512,
    },
    {
      name: "Emmett’s ToyStop",
      address: "5324 Dundas St W, Etobicoke ON M9B 1B4",
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
      address: "1601 Birchmount Rd, Scarborough ON M1P 2H5",
      latitude: 43.763242,
      longitude: -79.2908465,
    },
  ]);

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [map, setMap] = useState(null);

  const onLoad = useCallback(function callback(map) {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map) {
    setMap(null);
  }, []);

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted!");
    alert("Listing posted!");
  };

  return (
    <div className="container-sm border border-gray rounded-4 shadow my-8 px-6 py-4">
      <div className="row border-bottom border-gray">
        <p className="text-primary mt-4 mb-4 fw-semibold fs-3">List An Item</p>
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
                <option selected>Condition*</option>
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
          <p className="text-primary mt-4 mb-3 fw-semibold">Meet up location</p>
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
                  position={{ lat: location.latitude, lng: location.longitude }}
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
