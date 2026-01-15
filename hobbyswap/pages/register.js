import Link from "next/link";
import { Image } from "react-bootstrap";
import { userState } from "react";
import { userRouter } from "next/router";

export default function Register() {
  const [formData, setFormData] = useState({ // Setting states for the Form Data
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState(""); // Setting state for error messages
  const [loading, setLoading] = useState(false); // Setting state for loading indicator
  const router = useRouter(); // Initializing the router for navigation

  const handleChange = (e) => { // Handling input changes
    const {id, value} = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => { // Handling form submission
    e.preventDefault
    setError(""); // Resetting error state

    //Validation
    if(!formData.firstName || !formData.lastName || !formData.username || !formData.email || !formData.password){
      setError("All fields are required");
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
        }),
      });

      const data = await response.json(); // Parsing response data

      if (!response.ok) { // Verifying data received
        setError(data.error || "Registration failed");
        return;
      }
      router.push("/login"); // Successful registration redirects to login
    } catch (err) {
      setError("An error occurred while registering. Please try again.");
    }finally { // Finalizing loading state
      setLoading(false);
    }
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
              />
              <label htmlFor="terms" className="text-primary fw-regular">
                I agree to the Terms and Conditions
              </label>
            </div>
            <button
              type="submit"
              disabled={loading} //disable the submit button while loading
              className="btn btn-primary w-100 mt-4 text-uppercase fw-bold rounded-pill p-3"
            >
              {loading ? "Signing Up..." : "Sign Up"}
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
  }};