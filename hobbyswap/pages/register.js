import Link from "next/link";
import { Image } from "react-bootstrap";

export default function Register() {
  return (
    <>
      <div className="container-lg my-7 border border-gray rounded-5 mx-auto shadow col-12 col-md-5 mx-auto position-relative">
        <div className="row pt-5 ">
          <div className="d-flex border-bottom border-gray px-5 px-md-8">
            <p className="text-primary fw-bold fs-3">Create an account</p>
          </div>
          <form className="d-grid gap-3 pb-4 pt-5 px-md-8">
            <input
              type="text"
              className="form-control bg-light p-3"
              id="firstName"
              placeholder="First Name"
            />
            <input
              type="text"
              className="form-control bg-light p-3"
              id="lastName"
              placeholder="Last Name"
            />
            <input
              type="text"
              className="form-control bg-light p-3 mt-5"
              id="username"
              placeholder="Username"
            />
            <input
              type="email"
              className="form-control bg-light p-3"
              id="email"
              placeholder="Email"
            />
            <input
              type="password"
              className="form-control bg-light p-3"
              id="password"
              placeholder="password"
            />
            <input
              type="password"
              className="form-control bg-light p-3 mb-4"
              id="passwordConfirm"
              placeholder="password"
            />
            <div>
              <input
                type="checkbox"
                className="form-check-input me-2 border border-primary"
                id="terms"
              />
              <label htmlFor="terms" className="text-primary fw-regular">
                I agree to the Terms and Conditions
              </label>
            </div>
            <button
              type="submit"
              className="btn btn-primary w-100 mt-4 text-uppercase fw-bold rounded-pill p-3"
            >
              Sign Up
            </button>
          </form>
          <div className="d-flex text-center justify-content-center mb-5">
            <p className="fw-semibold text-primary">Already have an account?</p>
            <Link href="/login" className="fw-semibold text-secondary ms-2">
              Login Now
            </Link>
          </div>
          <Image
            src="/images/smiski-speaker.png"
            alt="Smiski with Speaker"
            className="position-absolute d-none d-md-block smiski-login-position"
          />
        </div>
      </div>
    </>
  );
}
