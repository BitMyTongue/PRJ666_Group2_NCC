import { UserContext } from "@/contexts/UserContext";
import {
  faCheckCircle,
  faCreditCardAlt,
} from "@fortawesome/free-regular-svg-icons";
import { faDollarSign, faUserCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { Button, Image, Modal } from "react-bootstrap";

export default function CardPayment() {
  const router = useRouter();
  const { id } = router.query;
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);
  const [error, setError] = useState("");

  const [paymentData, setPaymentData] = useState({
    receiveOption: "",
    cardholderName: "",
    cardNumber: "",
    expDate: "",
    cvv: "",
  });

  const [personalData, setPersonalData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
  });
  useEffect(() => {
    if (user) {
      setPersonalData({
        fullName: `${user.firstName} ${user.lastName}` || "",
        email: user.email || "",
        address: user.address || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  console.log(user);

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
  const summary = () => {
    return (
      <div className="p-5 pb-8 d-flex flex-column gap-1">
        <div className="row">
          <p className="text-muted fw-semibold text-uppercase opacity-75 col-5">
            Receive option
          </p>
          <p className="text-primary col-7">Receive Option</p>
        </div>
        <div className="row">
          <p className="text-muted fw-semibold text-uppercase opacity-75 col-5">
            Cardholder's name
          </p>
          <p className="text-primary col-7">{paymentData.cardholderName}</p>
        </div>
        <div className="row">
          <p className="text-muted fw-semibold text-uppercase opacity-75 col-5">
            Card number
          </p>
          <p className="text-primary col-7">{paymentData.cardNumber}</p>
        </div>
        <div className="d-flex flex-column flex-md-row gap-2">
          <div className="d-grid w-100">
            <div className="row">
              <p className="text-muted fw-semibold text-uppercase opacity-75 col-5 col-md-7">
                Expiration Date
              </p>
              <p className="text-primary col-7 col-md-5">
                {paymentData.expDate}
              </p>
            </div>
          </div>
          <div className="d-grid w-100 ">
            <div className="row">
              <p className="text-muted fw-semibold text-uppercase opacity-75 col-5 col-md-7">
                CVV
              </p>
              <p className="text-primary col-7 col-md-5">{paymentData.cvv}</p>
            </div>
          </div>
        </div>
        {/* Personal info */}
        {Object.entries(personalData).map(([k, v]) => {
          return (
            <div className="row">
              <p className="text-primary fw-semibold text-capitalize opacity-75 col-5">
                {k === "fullName"
                  ? "Full Name"
                  : k === "address"
                    ? "Home Address"
                    : k}
              </p>
              <p className="text-primary col-7">{v}</p>
            </div>
          );
        })}
        <Button onClick={handleOnClickNext} variant="primary rounded-pill">
          Pay
        </Button>
      </div>
    );
  };
  const paymentInfoForm = () => {
    return (
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
                id="inPerson"
                checked={paymentData.receiveOption === "in person"}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    receiveOption: e.target.value,
                  })
                }
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
                checked={paymentData.receiveOption === "delivery"}
                onChange={(e) =>
                  setPaymentData({
                    ...paymentData,
                    receiveOption: e.target.value,
                  })
                }
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
          value={paymentData.cardholderName}
          onChange={(e) =>
            setPaymentData({ ...paymentData, cardholderName: e.target.value })
          }
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
          value={paymentData.cardNumber}
          onChange={(e) =>
            setPaymentData({ ...paymentData, cardNumber: e.target.value })
          }
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
                value={paymentData.expDate}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, expDate: e.target.value })
                }
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
                value={paymentData.cvv}
                onChange={(e) =>
                  setPaymentData({ ...paymentData, cvv: e.target.value })
                }
              />
            </div>
          </div>
        </div>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
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
          <Button onClick={handleOnClickNext} variant="primary rounded-pill">
            Next Step
          </Button>
        </div>
      </form>
    );
  };
  const checkYourInfoForm = () => {
    return (
      <form className="p-5 pb-8 d-flex flex-column gap-1">
        <label
          htmlFor="userFullname"
          className="text-muted fw-semibold text-uppercase opacity-75 mt-3"
        >
          Full name
        </label>
        <input
          type="text"
          className="form-control bg-light p-2 rounded-3"
          id="userFullname"
          placeholder="John Doe"
          value={personalData.fullName}
          onChange={(e) =>
            setPersonalData({ ...personalData, fullName: e.target.value })
          }
        />
        <label
          htmlFor="userEmail"
          className="text-muted fw-semibold text-uppercase opacity-75 mt-3"
        >
          email
        </label>
        <input
          type="text"
          className="form-control bg-light p-2 rounded-3"
          id="userEmail"
          placeholder="John Doe"
          value={personalData.email}
          onChange={(e) =>
            setPersonalData({ ...personalData, email: e.target.value })
          }
        />
        <label
          htmlFor="userAddress"
          className="text-muted fw-semibold text-uppercase opacity-75 mt-3"
        >
          Address
        </label>
        <input
          type="text"
          className="form-control bg-light p-2 rounded-3"
          id="userAddress"
          placeholder="123 Bay St. ,Toronto, ON 1A2 3A4"
          value={personalData.address}
          onChange={(e) =>
            setPersonalData({ ...personalData, address: e.target.value })
          }
        />
        <label
          htmlFor="userPhone"
          className="text-muted fw-semibold text-uppercase opacity-75 mt-3"
        >
          Phone
        </label>
        <input
          type="text"
          className="form-control bg-light p-2 rounded-3"
          id="userPhone"
          placeholder="123 456 7890"
          value={personalData.phone}
          onChange={(e) =>
            setPersonalData({ ...personalData, phone: e.target.value })
          }
        />
        {error && <div className="alert alert-danger mt-3">{error}</div>}

        <div className="d-flex justify-content-between align-items-center mt-3">
          <div className="form-check">
            <input
              className="form-check-input text-primary"
              type="checkbox"
              id="saveInfo"
            />
            <label
              className="form-check-label text-primary text-capitalize"
              htmlFor="saveInfo"
            >
              save Your Info
            </label>
          </div>
          <Button onClick={handleOnClickNext} variant="primary rounded-pill">
            Next Step
          </Button>
        </div>
      </form>
    );
  };
  const handleOnClickNext = () => {
    setError("");

    if (step === "payment info") {
      if (
        !paymentData.receiveOption ||
        !paymentData.cardholderName ||
        !paymentData.cardNumber ||
        !paymentData.expDate ||
        !paymentData.cvv
      ) {
        setError("Please fill in all payment information.");
        return;
      }

      router.push(`/checkout/pay/${id}?step=check your info`);
      return;
    }

    if (step === "check your info") {
      if (
        !personalData.fullName ||
        !personalData.email ||
        !personalData.phone ||
        !personalData.address
      ) {
        setError("Please complete your personal information.");
        return;
      }

      router.push(`/checkout/pay/${id}?step=make a payment`);
      return;
    }

    if (step === "make a payment") {
      router.push(`/checkout/pay/${id}?step=confirmation`);
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
        <div className="container-sm my-6 mb-2">
          {/* Payment form */}
          <div className="row d-flex flex-column flex-md-row mt-5 gap-3">
            <div className="col-12 col-md-6 border border-gray rounded-5 shadow d-flex flex-column">
              <div className=" border-bottom border-gray">
                <p className="text-primary fw-semibold fs-5 mx-5 my-4 text-capitalize">
                  {step === "payment info"
                    ? "Payment"
                    : step === "check your info"
                      ? "Check Your Info"
                      : step === "make a payment"
                        ? "make a payment"
                        : "Conformation"}
                </p>
              </div>
              {step === "payment info" && paymentInfoForm()}
              {step === "check your info" && checkYourInfoForm()}
              {step === "make a payment" && summary()}
              {step === "confirmation" && (
                <div className="m-5">
                  <p className="alert alert-success">Your order successfully placed</p>
                  <Button variant="primary" href="/">Go back homepage</Button>
                </div>
              )}
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

        <button className="btn btn-transparent text-primary fw-semibold mb-6 mx-5" onClick={handleOnClickBack}> &#60; Back</button>
      </>
    );
  }
}
