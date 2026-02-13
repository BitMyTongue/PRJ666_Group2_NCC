import { UserContext } from "@/contexts/UserContext";
import { faBookmark, faUser } from "@fortawesome/free-regular-svg-icons";
import { faLayerGroup, faShoppingBag } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { Spinner } from "react-bootstrap";

export default function UserNavbar({ children, id, loading }) {
  const router = useRouter();
  const { user } = useContext(UserContext);

  const isOwner = user?._id === id;
  return (
    <>
      <div className="bg-light">
        <div className="container py-5">
          <div className="row">
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center my-3">
              <FontAwesomeIcon
                icon={faUser}
                size="3x"
                className="fw-bolder text-primary mb-1"
              />
              <Link
                href={`/users/${id}`}
                className={
                  false
                    ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                    : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                }
              >
                {isOwner && "My"} Profile
              </Link>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center my-3">
              <FontAwesomeIcon
                icon={faLayerGroup}
                size="3x"
                className="fw-bolder text-primary mb-1"
              />

              <Link
                href={`/users/${id}/listings`} //Now in {`/users/${profile._id}/offers`}
                className={
                  router.asPath.includes("listings")
                    ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                    : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                }
              >
                {isOwner && "My"} Listings
              </Link>
            </div>
            {user && isOwner && (
              <>
                <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faShoppingBag}
                    size="3x"
                    className="fw-bolder text-primary mb-1"
                  />
                  <Link
                    href={`/users/${user._id}/offers`}
                    className={
                      router.asPath.includes("offers")
                        ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                        : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                    }
                  >
                    My Offers
                  </Link>
                </div>

                <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faBookmark}
                    size="3x"
                    className="fw-bolder text-primary mb-1"
                  />
                  <Link
                    href={`/users/${user._id}/bookmarks`}
                    className={
                      router.asPath.includes("bookmarks")
                        ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                        : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                    }
                  >
                    My Bookmarks
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {loading ? <Spinner className="m-5" /> : children}
    </>
  );
}
