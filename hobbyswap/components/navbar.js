import Image from "next/image";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope } from "@fortawesome/free-regular-svg-icons";
import { useState, useContext } from "react";
import { useRouter } from "next/router";
import CurrentUserDropdown from "./dropdowns/current-user-options";
import UserIcon from "./user-icon";
import { UserContext } from "@/contexts/UserContext";
import SearchBar from "./searchbar";
import { SearchProvider } from "@/contexts/SearchContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useContext(UserContext);
  const router = useRouter();

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <SearchProvider>
      <nav className="bg-primary mx-auto p-3 px-5 z-2">
        <div className="d-flex justify-content-between align-items-center">
          <Link href="/" className="navbar-brand d-flex">
            <Image src="/images/logo.png" width={255} height={54} alt="Logo" />
          </Link>

          <SearchBar
            className="d-none d-xl-flex h-50 position-relative"
            role="search"
          />

          <ul className="d-none d-xl-flex list-unstyled mb-0">
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
                  <CurrentUserDropdown
                    user={user}
                    handleLogout={handleLogout}
                  />
                  <FontAwesomeIcon
                    role="button"
                    icon={faEnvelope}
                    color="white"
                    size="2x"
                    onClick={() => router.push("/message")}
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
            <SearchBar
              className="d-flex h-25 position-relative mb-3"
              role="search"
            />

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
                        <UserIcon
                          user={user.name}
                          img="/images/gundam.png"
                          size={40}
                        />
                        <FontAwesomeIcon
                          role="button"
                          icon={faEnvelope}
                          color="white"
                          size="2x"
                          onClick={() => router.push("/message")}
                        />
                      </div>

                      <div className="d-flex flex-column justify-content-start align-items-start">
                        <Link
                          href="/listings/create"
                          className="text-white btn btn-success mx-2 mt-1 mb-3"
                        >
                          Create Listing
                        </Link>
                        <Link as="button" className="btn btn-primary" href="#">
                          View Your Store Page
                        </Link>
                        <Link
                          className="btn btn-primary"
                          href={`/users/${user._id}/listings`}
                        >
                          View Your Listings
                        </Link>
                        <Link as="button" className="btn btn-primary" href="#">
                          View Your Trade History
                        </Link>
                        <Link as="button" className="btn btn-primary" href="#">
                          View Your Bookmarks
                        </Link>
                        <Link
                          className="btn btn-primary"
                          href={`/users/${user._id}`}
                        >
                          View Your Profile
                        </Link>
                        <button
                          className="btn btn-danger mt-3"
                          onClick={handleLogout}
                        >
                          <strong>Log Out</strong>
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="nav-link text-uppercase fw-bold text-white"
                  >
                    Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        )}
      </nav>
    </SearchProvider>
  );
};

export default Navbar;
