import { useRouter } from "next/router";
import { useState } from "react";

export const getServerSideProps = async ({ req, query }) => {
  const { token } = query;
  if (!token) return { redirect: { destination: "/" } };
  const check = await fetch(
    process.env.NEXT_PUBLIC_API_URL +
      "/api/auth/forgot-password?callback=" +
      token,
    {
      method: "GET",
      headers: req.headers,
    },
  );
  if (!check.ok) return { redirect: { destination: "/" } };
  return { props: { callback: token } };
};

export default function Forgot({ callback }) {
  const [formData, setFormData] = useState({
    // Setting states for the Form Data
    password: "",
    passwordConfirm: "",
  });
  const [error, setError] = useState(""); // Setting state for error messages
  const [loading, setLoading] = useState(false); // Setting state for loading indicator
  const router = useRouter(); // Initializing the router for navigation

  const handleChange = (e) => {
    // Handling input changes
    const { id, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    // Handling form submission
    e.preventDefault();
    setError(""); // Resetting error state

    //Validation
    if (!formData.password || !formData.passwordConfirm) {
      setError("All fields are required");
      return;
    }

    if (formData.password !== formData.passwordConfirm) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true); //while attemptiing to fetch data from API

    try {
      const response = await fetch("/api/auth/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callback: callback,
          password: formData.password,
        }),
      });

      const data = await response.json(); // Parsing response data
      console.log(data);

      if (!response.ok) {
        // Verifying data received
        setError(data.error || "Password change failed");
        return;
      }

      router.push("/login"); // Successful registration redirects to login
    } catch (err) {
      console.log("Error");
      setError("An error occurred while changing password. Please try again.");
    } finally {
      // Finalizing loading state
      setLoading(false);
    }
  };
  return (
    <>
      <div className="container-lg my-7 border border-gray rounded-5 mx-auto shadow col-12 col-md-5 mx-auto position-relative">
        <div className="row pt-5 ">
          <div className="d-flex border-bottom border-gray px-5 px-md-8">
            <p className="text-primary fw-bold fs-3">New Password</p>
          </div>
          <form
            className="d-grid gap-3 pb-4 pt-5 px-md-8"
            onSubmit={handleSubmit}
          >
            {error && <div className="alert alert-danger">{error}</div>}

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

            <button
              type="submit"
              disabled={loading} // disable while loading or uploading picture
              className="btn btn-primary w-100 mt-4 text-uppercase fw-bold rounded-pill p-3"
            >
              Confirm
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
