import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { useState } from "react";
import CurrentUserDropdown from "./dropdowns/current-user-options";
import UserIcon from "./user-icon";
import { Button } from "react-bootstrap";

const Navbar = ({ user = true }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // TODO: Add other links when possible (store, user listings, trade history, bookmarks, user, etc)
  return (
    <nav
      className="bg-primary mx-auto p-3 px-5
    "
    >
      <div className="d-flex justify-content-between align-items-center">
        <Link href="/" className="navbar-brand d-flex">
          <Image src="/images/logo.png" width={255} height={54} alt="Logo" />
        </Link>
        <form
          className="d-none d-xl-flex  h-50 position-relative"
          role="search"
        >
          <input
            className="form-control me-2 rounded-pill search-bar py-1 border-0"
            type="search"
            aria-label="Search"
          />
          <FontAwesomeIcon
            icon={faSearch}
            className="position-absolute top-50 end-0 translate-middle-y me-3 text-primary"
          />
        </form>
        <ul className="d-none d-xl-flex   list-unstyled mb-0">
          <li className="nav-item mx-4">
            <Link
              href="/about"
              className="nav-link text-white text-uppercase fs-5"
            >
              About us
            </Link>
          </li>
          <li className="nav-item mx-4">
            <Link
              href="/listings"
              className="nav-link text-white text-uppercase fs-5"
            >
              Listings
            </Link>
          </li>
          <li className="nav-item ms-md-5">
            {user ? (
              <div className="d-flex gap-4 align-items-center">
                <CurrentUserDropdown />
                <FontAwesomeIcon
                  icon={faEnvelope}
                  onClick={() => {}}
                  color="white"
                  size="2x"
                />
              </div>
            ) : (
              <Link
                href="/login"
                className="nav-link text-uppercase fw-bold text-white fs-5 ms-md-5"
              >
                Login
              </Link>
            )}
          </li>
        </ul>

        <button
          className="d-xl-none btn text-white"
          onClick={toggleMenu}
          aria-label="Hamburger Menu"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} size="lg" />
        </button>
      </div>
      {isOpen && (
        <div className="d-xl-none mt-3">
          <form className="d-flex h-25 position-relative mb-3" role="search">
            <input
              className="form-control me-2 rounded-pill search-bar py-1 border-0 w-100"
              type="search"
              aria-label="Search"
            />
            <FontAwesomeIcon
              icon={faSearch}
              className="position-absolute top-50 end-0 translate-middle-y me-3 text-primary"
            />
          </form>
          <ul className="list-unstyled mb-0">
            <li className="nav-item my-2">
              <Link
                href="/about"
                className="nav-link text-white text-uppercase"
              >
                About us
              </Link>
            </li>
            <li className="nav-item my-2">
              <Link
                href="/listings"
                className="nav-link text-white text-uppercase"
              >
                Listings
              </Link>
            </li>
            <li className="nav-item my-2">
              {user ? (
                <>
                  <hr className="border-white" />
                  <div>
                    <div className="d-flex mb-4 justify-content-between align-items-start">
                      <UserIcon user="" img="/images/gundam.png" size={40} />
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        onClick={() => {}}
                        color="white"
                        size="2x"
                      />
                    </div>
                    <div className="d-flex flex-column justify-content-start  align-items-start">
                      <Button variant="secondary mx-2 mt-1 mb-3">
                        Create Listing
                      </Button>

                      <Link as="button" className="btn btn-primary" href="#">
                        View Your Store Page
                      </Link>
                      <Link as="button" className="btn btn-primary" href="#">
                        View Your Listings
                      </Link>
                      <Link as="button" className="btn btn-primary" href="#">
                        View Your Trade History
                      </Link>
                      <Link as="button" className="btn btn-primary" href="#">
                        View Your Bookmarks
                      </Link>
                      <Link
                        as="button"
                        className="btn btn-primary"
                        href={`/users/` + user}
                      >
                        View Your Profile
                      </Link>
                      <Link
                        as="button"
                        className="btn btn-primary mt-3"
                        href="#"
                      >
                        <strong>Log Out</strong>
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <Link
                  href="/"
                  className="nav-link text-uppercase fw-bold text-white "
                >
                  Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
};
export default Navbar;
