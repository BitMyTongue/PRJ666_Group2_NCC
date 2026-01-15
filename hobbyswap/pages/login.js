import Link from "next/link";
import { Image } from "react-bootstrap";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const {id, value} = e.target;
    setFormData((prev) => ({...prev, [id]: value}));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }
    setLoading(true);

    try {
      const response = await fetch("api/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      // Store user data and redirect to home
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/");
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="container-lg my-8 border border-gray rounded-5 mx-auto shadow">
      <div className="row pt-5">
        <div className="d-flex border-bottom border-gray">
          <div className="col-md-7 d-none d-md-block"></div>
          <div className="col-md-5 col-12 d-flex flex-column px-5">
            <p className="text-primary fw-bold fs-3">Welcome, Login Now</p>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="d-flex border-bottom border-gray">
          <div className="col-md-7 d-none d-md-block position-relative">
            <Image
              src="images/bullbasaur.png"
              alt="Bullbasaur"
              className="position-absolute bullbasaur-position"
            />
          </div>
          <div className="col-md-5 col-12 d-flex flex-column border-bottom ">
            <form className="d-grid gap-4 px-2 px-sm-3 px-md-5 py-4" onSubmit={handleSubmit}>
              {error && <div className="alert alert-danger">{error}</div>}
              <input
                type="email"
                className="form-control bg-light p-2"
                id="email"
                placeholder="Email or Username"
                value={formData.email}
                onChange={handleChange}
              />
              <input
                type="password"
                className="form-control bg-light p-2"
                id="password"
                placeholder="password"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-100 my-3 text-uppercase fw-bold rounded-pill"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
              <p className="text-center text-primary text-capitalize fw-regular fs-5 mb-0">
                Or login with
              </p>
              <div className="d-flex justify-content-between gap-4">
                <div className="d-flex gap-2">
                  <Image
                    src="images/facebook-icon.png"
                    alt="Facebook Icon"
                    width={25}
                    height={25}
                  />
                  <Link
                    href=""
                    className="link-offset-1 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover fw-semibold"
                  >
                    Facebook
                  </Link>
                </div>
                <div className="d-flex gap-2">
                  <Image
                    src="images/google-icon.png"
                    alt="Google Icon"
                    width={25}
                    height={25}
                  />
                  <Link
                    href=""
                    className="link-offset-1 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover fw-semibold"
                  >
                    Google
                  </Link>
                </div>
                <div className="d-flex gap-2">
                  <Image
                    src="images/instagram-icon.png"
                    alt="Instagram Icon"
                    width={25}
                    height={25}
                  />
                  <Link
                    href=""
                    className="link-offset-1 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover fw-semibold"
                  >
                    Instagram
                  </Link>
                </div>
              </div>
              <div className="d-flex">
                <p className="fw-semibold text-primary">Not a member?</p>
                <Link
                  href="/register"
                  className="fw-semibold text-secondary ms-2"
                >
                  Create a new account
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
