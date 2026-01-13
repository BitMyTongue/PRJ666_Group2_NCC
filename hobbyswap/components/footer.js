import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-primary text-dark p-5">
      <div className="container">
        <div className="row">
          <div className="col-12 col-md-9">
            <div className="row">
              <div className="col-6 col-md-3 mb-4">
                <h5 className="text-white text-uppercase fw-bold">Privacy</h5>
                <ul className="list-unstyled mb-0">
                  <li className="nav-item my-2">
                    <Link
                      href="/"
                      className="nav-link text-white text-capitalize fs-5 fw-light p-0"
                    >
                      Terms of Use
                    </Link>
                  </li>
                  <li className="nav-item my-2">
                    <Link
                      href="/"
                      className="nav-link text-white text-capitalize fs-5 fw-light p-0"
                    >
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="nav-item my-2">
                    <Link
                      href="/"
                      className="nav-link text-white text-capitalize fs-5 fw-light p-0"
                    >
                      Cookies
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-6 col-md-3 mb-4">
                <h5 className="text-white text-uppercase fw-bold">About Us</h5>
                <ul className="list-unstyled mb-0">
                  <li className="nav-item my-2">
                    <Link
                      href="/"
                      className="nav-link text-white text-capitalize fs-5 fw-light p-0"
                    >
                      Our Story
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-6 col-md-3 mb-4">
                <h5 className="text-white text-uppercase fw-bold">
                  Information
                </h5>
                <ul className="list-unstyled mb-0">
                  <li className="nav-item my-2">
                    <Link
                      href="/"
                      className="nav-link text-white text-capitalize fs-5 fw-light p-0"
                    >
                      Careers
                    </Link>
                  </li>
                  <li className="nav-item my-2">
                    <Link
                      href="/"
                      className="nav-link text-white text-capitalize fs-5 fw-light p-0"
                    >
                      Plans & Pricing
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="col-6 col-md-3 mb-4">
                <h5 className="text-white text-uppercase fw-bold">Support</h5>
                <ul className="list-unstyled mb-0">
                  <li className="nav-item my-2">
                    <Link
                      href="/"
                      className="nav-link text-white text-capitalize fs-5 fw-light p-0"
                    >
                      Help Center
                    </Link>
                  </li>
                  <li className="nav-item my-2">
                    <Link
                      href="/"
                      className="nav-link text-white text-capitalize fs-5 fw-light p-0"
                    >
                      Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Logo Section */}
          <div className="col-12 col-md-3 d-flex justify-content-center justify-content-md-end align-items-end mt-4 mt-md-0">
            <Link href="/" className="navbar-brand d-flex">
              <Image
                src="/images/logo.png"
                width={255}
                height={54}
                alt="Logo"
              />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
