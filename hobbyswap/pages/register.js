import Link from "next/link";
import { Image } from "react-bootstrap";
import { useState } from "react";

export default function Register() {
    const emailRegex = /^[^@]+@[^@]+\.[^@]+$/;

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [terms, setTerms] = useState(false);
    const [error, setError] = useState("");

    function handleSubmit(e) {
      e.preventDefault();
      setError("");

      if (firstName.trim() === "")
        return setError("Please enter your first name.");

      if (lastName.trim() === "")
        return setError("Please enter your last name.");

      if (username.trim() === "")
        return setError("Please enter a username.");

      if (email.trim() === "")
        return setError("Please enter your email.");

      if (!emailRegex.test(email))
        return setError("Email address is invalid.");

      if (password === "")
        return setError("Please enter a password.");

      if (passwordConfirm === "")
        return setError("Please re-type your password.");

      if (password !== passwordConfirm)
        return setError("Passwords must match.");

      if (!terms)
        return setError("You must agree to the Terms and Conditions.");

      // Submit Logic TODO

    }

  return (
    <>
      <div className="container-lg my-7 border border-gray rounded-5 mx-auto shadow col-12 col-md-5 mx-auto position-relative">
        <div className="row pt-5 ">
          <div className="d-flex border-bottom border-gray px-5 px-md-8">
            <p className="text-primary fw-bold fs-3">Create an account</p>
          </div>
          <form className="d-grid gap-3 pb-4 pt-5 px-md-8" onSubmit={handleSubmit}>
            {/*Display alert if error encountered*/}
              {error !== "" ? (
                <div className="alert alert-danger">
                  {error}
                </div>
            ) : null}
            <input
              type="text"
              className="form-control bg-light p-3"
              id="firstName"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              className="form-control bg-light p-3"
              id="lastName"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="text"
              className="form-control bg-light p-3 mt-5"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="email"
              className="form-control bg-light p-3"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="form-control bg-light p-3"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="form-control bg-light p-3 mb-4"
              id="passwordConfirm"
              placeholder="Re-enter password"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
            <div>
              <input
                type="checkbox"
                className="form-check-input me-2 border border-primary"
                id="terms"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
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
