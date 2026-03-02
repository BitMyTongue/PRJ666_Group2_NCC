import Link from "next/link";
import { Image } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";
import NextImage from "next/image";

export default function Register() {
  const [formData, setFormData] = useState({ // Setting states for the Form Data
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
    address: "",
    site: "",
    gender: "Not Specified",
    dateOfBirth: "",
    profilePicture: null,
    terms: false,
  });
  const [error, setError] = useState(""); // Setting state for error messages
  const [loading, setLoading] = useState(false); // Setting state for loading indicator
  const [profileImageUrl, setProfileImageUrl] = useState(null); // Profile picture URL
  const [isUploadingProfilePic, setIsUploadingProfilePic] = useState(false); // Profile pic upload loading
  const router = useRouter(); // Initializing the router for navigation

  const handleChange = (e) => { // Handling input changes
    const {id, value, type, checked} = e.target;
    setFormData((prev) => ({ ...prev, [id]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => { // Handling form submission
    e.preventDefault();
    setError(""); // Resetting error state

    //Validation
    if(!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password || !formData.passwordConfirm){
      setError("All fields are required");
      return;
    }
    if(!formData.terms){
      setError("You must agree to the Terms and Conditions");
      return;
    }

    if(formData.password !== formData.passwordConfirm){
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true); //while attemptiing to fetch data from API 

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          username: formData.username,
          email: formData.email,
          password: formData.password,
          address: formData.address,
          site: formData.site,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth || null,
          profilePicture: profileImageUrl || null,
        }),
      });

      const data = await response.json(); // Parsing response data
      console.log(data);

      if (!response.ok) { // Verifying data received
        setError(data.error || "Registration failed");
        return;
      }
      router.push("/login"); // Successful registration redirects to login
    } catch (err) {
      console.log("Error")
      setError("An error occurred while registering. Please try again.");
    }finally { // Finalizing loading state
      setLoading(false);
    }
  };
  return (
    <>
      <div className="container-lg my-7 border border-gray rounded-5 mx-auto shadow col-12 col-md-5 mx-auto position-relative">
        <div className="row pt-5 ">
          <div className="d-flex border-bottom border-gray px-5 px-md-8">
            <p className="text-primary fw-bold fs-3">Create an account</p>
          </div>
          <form className="d-grid gap-3 pb-4 pt-5 px-md-8" onSubmit={handleSubmit}>
          {error && <div className="alert alert-danger">{error}</div>}
            <input
              type="text"
              className="form-control bg-light p-3"
              id="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
            />
            <input
              type="text"
              className="form-control bg-light p-3"
              id="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
            />
            <input
              type="text"
              className="form-control bg-light p-3 mt-5"
              id="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
            />
            <input
              type="email"
              className="form-control bg-light p-3"
              id="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />
            <input
              type="text"
              className="form-control bg-light p-3"
              id="address"
              placeholder="Address (Optional)"
              value={formData.address}
              onChange={handleChange}
            />
            <input
              type="text"
              className="form-control bg-light p-3"
              id="site"
              placeholder="Website (Optional)"
              value={formData.site}
              onChange={handleChange}
            />
            <select
              className="form-control bg-light p-3"
              id="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="Not Specified">Gender (Optional)</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Not Specified">Not Specified</option>
            </select>
            <input
              type="date"
              className="form-control bg-light p-3"
              id="dateOfBirth"
              placeholder="Date of Birth (Optional)"
              value={formData.dateOfBirth}
              onChange={handleChange}
            />
            <input
              type="password"
              className="form-control bg-light p-3"
              id="password"
              placeholder="password"
              value={formData.password}
              onChange={handleChange}
            />
            <input
              type="password"
              className="form-control bg-light p-3 mb-4"
              id="passwordConfirm"
              placeholder="Confirm password"
              value={formData.passwordConfirm}
              onChange={handleChange}
            />
            <div>
              <input
                type="checkbox"
                className="form-check-input me-2 border border-primary"
                id="terms"
                checked={formData.terms}
                onChange={handleChange}
              />
              <label htmlFor="terms" className="text-primary fw-regular">
                I agree to the Terms and Conditions
              </label>
            </div>
            <button
              type="submit"
              disabled={loading || isUploadingProfilePic} // disable while loading or uploading picture
              className="btn btn-primary w-100 mt-4 text-uppercase fw-bold rounded-pill p-3"
            >
              {loading ? "Signing Up..." : isUploadingProfilePic ? "Uploading image..." : "Sign Up"}
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