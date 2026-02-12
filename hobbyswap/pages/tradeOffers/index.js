import { OfferRow } from "@/components/pageComponent/OfferRow";
import { UserContext } from "@/contexts/UserContext";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Image } from "react-bootstrap";

export default function ListingOffers() {
  const route = useRouter();
  const { listingId } = route.query;
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(true);
  const [tradeOfferList, setTradeOfferList] = useState([]);
  const [listing, setListing] = useState(null);
  useEffect(() => {
    if (!listingId) return;
    const load = async () => {
      try {
        const listingRes = await fetch(`/api/listings/${listingId}`);
        const listingData = await listingRes.json();
        setListing(listingData.listing);

        const res = await fetch("/api/tradeOffers");
        const data = await res.json();
        console.log(data.tradeOffers);

        const tradeOffers = data.tradeOffers.filter((o) => {
          return o.listingId === listingId;
        });
        setTradeOfferList(tradeOffers);
        setLoading(false);
      } catch (e) {
        console.error(e);
      }
    };
    load();
  }, [listingId]);

  // Statistics
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalOffers = tradeOfferList.length;

  const offersThisMonth = tradeOfferList.filter((offer) => {
    const date = new Date(offer.createdAt);
    return (
      date.getMonth() === currentMonth && date.getFullYear() === currentYear
    );
  }).length;

  const offersThisYear = tradeOfferList.filter((offer) => {
    const date = new Date(offer.createdAt);
    return date.getFullYear() === currentYear;
  }).length;

  //loading
  if (loading) {
    return <p>Loading...</p>;
  }
  console.log(tradeOfferList);
  return (
    <div className="container px-4 py-6">
      <div className="row text-center">
        <p className="fs-3 fw-semibold text-uppercase text-primary">
          Offers for {listing?.itemName}
        </p>

        <div className="d-grid border-bottom border-top border-gray my-4 border-2 ps-6 py-5 w-100">
          <div className="row gap-3">
            <Image
              src={listing?.images[0]}
              className="img-fluid col-6 col-md-2"
              alt={`${listing?.itemName} image`}
            />
            <div className="text-start col-5">
              <p className="fs-4 fw-semibold text-capitalize text-primary">
                {listing?.itemName}
              </p>
              <p className="fs-5 text-capitalize text-primary">
                {listing?.description}
              </p>
            </div>
            <div className="d-flex flex-column text-start col-12 col-md-3">
              <div>
                <p className="fw-semibold text-uppercase text-muted opacity-75 mb-0">
                  Total Offer this month
                </p>
                <p className="fs-4 fw-semibold text-uppercase text-primary">
                  {offersThisMonth}
                </p>
              </div>
              <div>
                <p className="fw-semibold text-uppercase text-muted opacity-75 mb-0">
                  Total Offer this year
                </p>
                <p className="fs-4 fw-semibold text-uppercase text-primary">
                  {offersThisYear}
                </p>
              </div>
              <div>
                <p className="fw-semibold text-uppercase text-muted opacity-75 mb-0">
                  Total Offer all time
                </p>
                <p className="fs-4 fw-semibold text-uppercase text-primary">
                  {totalOffers}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {tradeOfferList.length > 0 ? (
        <div className="row">
          {tradeOfferList.map((offer) => (
            <OfferRow key={offer._id} offer={offer} listing={listing} />
          ))}
        </div>
      ) : (
        <p>No Offers Yet</p>
      )}
    </div>
  );
}

