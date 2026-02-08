import {
  faCheckCircle,
  faCreditCardAlt,
} from "@fortawesome/free-regular-svg-icons";
import { faDollarSign, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Button, Image, Modal } from "react-bootstrap";

export default function CardPayment() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const steps = {
    "payment info": faCreditCardAlt,
    "check your info": faUserCheck,
    "make a payment": faDollarSign,
    confirmation: faCheckCircle,
  };
  const fakeDeliveryInfo = {
    deliveryTime: new Date(),
    shippingFee: 5.0,
    coupons: 0.0,
  };
  const step = useSearchParams().get("step");

  useEffect(() => {
    if (!router.isReady || !id) return;

    const load = async () => {
      try {
        const res = await fetch(`/api/listings/${id}`);
        const data = await res.json();
        console.log(data.listing);
        setListing(data.listing);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [router.isReady, id]);

  const handleOnClickNext = () => {
    switch (step) {
      case "payment info":
        router.push(`/checkout/pay/${id}?step=check your info`);
        break;
      case "check your info":
        router.push(`/checkout/pay/${id}?step=make a payment`);
        break;
      case "make a payment":
        router.push(`/checkout/pay/${id}?step=confirmation`);
        break;
      default:
        return <Modal />;
    }
  };
  const handleOnClickBack = () => {
    switch (step) {
      case "confirmation":
        router.push(`/checkout/pay/${id}?step=make a payment`);
        break;
      case "make a payment":
        router.push(`/checkout/pay/${id}?step=check your info`);
        break;
      case "check your info":
        router.push(`/checkout/pay/${id}?step=payment info`);
        break;
      default:
        return;
    }
  };
  if (loading) {
    return <p>Loading...</p>;
  } else {
    return (
      <>
        {/* Category Section */}
        <div className="bg-light">
          <div className="container py-5">
            <div className="row">
              {Object.entries(steps).map(([s, icon]) => (
                <div
                  className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center"
                  key={s}
                >
                  <FontAwesomeIcon
                    icon={icon}
                    size="3x"
                    className={
                      step === s ? "text-primary mb-2" : "text-muted mb-2"
                    }
                  />
                  <Link
                    href="#"
                    className={
                      step === s
                        ? "text-primary fw-semibold text-shadow custom-shadow-secondary link-underline link-underline-opacity-0 text-capitalize"
                        : "text-muted link-underline link-underline-opacity-0 text-capitalize"
                    }
                  >
                    {s}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="container-sm my-6">
          {/* Payment form */}
          <div className="row d-flex flex-column flex-md-row mt-5 gap-3">
            <div className="col-12 col-md-6 border border-gray rounded-5 shadow d-flex flex-column">
              <div className=" border-bottom border-gray">
                <p className="text-primary fw-semibold fs-5 mx-5 my-4">
                  Payment
                </p>
              </div>
              <form className="p-5 pb-8 d-flex flex-column gap-1">
                <div className="d-flex justify-content-between">
                  <p className="text-muted fw-semibold text-uppercase opacity-75">
                    Receive option
                  </p>
                  <div className=" d-flex gap-4">
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="nPerson"
                        value="inPerson"
                      />
                      <label
                        className="form-check-label text-primary"
                        htmlFor="inPerson"
                      >
                        In-person
                      </label>
                    </div>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        id="delivery"
                        value="delivery"
                      />
                      <label className="form-check-label" htmlFor="delivery">
                        delivery
                      </label>
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  className="form-control bg-light p-2 rounded-3"
                  id="shippingAddress"
                  placeholder="Shipping Address"
                />
                <label
                  htmlFor="cardholder"
                  className="text-muted fw-semibold text-uppercase opacity-75 mt-3"
                >
                  Pay by using
                </label>
                <div className="d-flex gap-2">
                  <Image
                    src="/images/Visa Streamline Simple Icons.png"
                    height={30}
                    width={30}
                  />
                  <Image
                    src="/images/Mastercard Streamline SVG Logos.png"
                    height={30}
                    width={30}
                  />
                  <Image
                    src="/images/Amex Digital Streamline SVG Logos.png"
                    height={30}
                    width={30}
                  />
                </div>
                <label
                  htmlFor="cardholder"
                  className="text-muted fw-semibold text-uppercase opacity-75 mt-3"
                >
                  Cardholder's name
                </label>
                <input
                  type="text"
                  className="form-control bg-light p-2 rounded-3"
                  id="cardholder"
                  placeholder="John Doe"
                />
                <label
                  fhtmlFor="cardnumber"
                  className="text-muted fw-semibold text-uppercase opacity-75 mt-3"
                >
                  Card number
                </label>
                <input
                  type="text"
                  className="form-control bg-light p-2 rounded-3"
                  id="cardnumber"
                  placeholder="1234-1234-1234-1234"
                />
                <div className="d-grid">
                  <div className="row">
                    <div className="col-6">
                      {" "}
                      <label
                        fhtmlFor="expDate"
                        className="text-muted fw-semibold text-uppercase opacity-75 mt-3"
                      >
                        Expiration date
                      </label>
                      <input
                        type="text"
                        className="form-control bg-light p-2 rounded-3"
                        id="expDate"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div className="col-6">
                      {" "}
                      <label
                        htmlFor="cvv"
                        className="text-muted fw-semibold text-uppercase opacity-75 mt-3"
                      >
                        CVV
                      </label>
                      <input
                        type="number"
                        className="form-control bg-light p-2 rounded-3"
                        id="cvv"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <div className="form-check">
                    <input
                      className="form-check-input text-primary"
                      type="checkbox"
                      id="saveCard"
                    />
                    <label
                      className="form-check-label text-primary text-capitalize"
                      htmlFor="saveCard"
                    >
                      save card
                    </label>
                  </div>
                  <Button
                    onClick={handleOnClickNext}
                    variant="primary rounded-pill"
                  >
                    Next Step
                  </Button>
                </div>
              </form>
            </div>
            <div className=" py-6 col-12 col-md-5 rounded-5 border border-gray shadow d-flex flex-column justify-content-center align-items-center mx-auto">
              <Image
                src={listing.images[0]}
                className="w-25 25 shadow p-3 mb-5 bg-white rounded"
              />
              <p className="fs-5 text-primary text-uppercase text-center mb-1">
                {listing.itemName}
              </p>

              <p className="fw-bold fs-2 text-primary text-uppercase mb-4 text-center">
                ${listing.requestMoney.toFixed(2)}
              </p>
              <div className="d-flex flex-column justify-content-between w-75 border-bottom">
                <div className="d-flex justify-content-between w-75 mx-auto">
                  <p className="text-muted">Delivery Time</p>
                  <p className="text-primary">
                    {fakeDeliveryInfo.deliveryTime.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "2-digit",
                    })}
                  </p>
                </div>
                <div className="d-flex justify-content-between w-75 mx-auto">
                  <p className="text-muted">Ship to</p>
                  <p className="text-primary">Delivery time</p>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-between w-75 border-bottom">
                <div className="d-flex justify-content-between w-75 mx-auto mt-3">
                  <p className="text-muted">Shipping Fee</p>
                  <p className="text-primary">
                    {fakeDeliveryInfo.shippingFee.toFixed(2)}
                  </p>
                </div>
                <div className="d-flex justify-content-between w-75 mx-auto">
                  <p className="text-muted">Coupon</p>
                  <p className="text-primary">
                    {fakeDeliveryInfo.coupons.toFixed(2)}
                  </p>
                </div>
                <div className="d-flex justify-content-between w-75 mx-auto">
                  <p className="text-muted">Subtotal</p>
                  <p className="text-primary">
                    {(
                      listing.requestMoney +
                      fakeDeliveryInfo.shippingFee -
                      fakeDeliveryInfo.coupons
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
              <div className="d-flex flex-column justify-content-between w-75 ">
                <div className="d-flex justify-content-between w-75 mx-auto mt-3">
                  <p className="text-muted">Tax</p>
                  <p className="text-primary">
                    {(
                      (listing.requestMoney +
                        fakeDeliveryInfo.shippingFee -
                        fakeDeliveryInfo.coupons) *
                      0.13
                    ).toFixed(2)}
                  </p>
                </div>
                <div className="d-flex justify-content-between w-75 mx-auto">
                  <p className="text-muted">Total</p>
                  <p className="text-primary fw-semibold">
                    {(
                      listing.requestMoney +
                      fakeDeliveryInfo.shippingFee -
                      fakeDeliveryInfo.coupons +
                      (listing.requestMoney +
                        fakeDeliveryInfo.shippingFee -
                        fakeDeliveryInfo.coupons) *
                        0.13
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Button onClick={handleOnClickBack}>Back</Button>
      </>
    );
  }
}
