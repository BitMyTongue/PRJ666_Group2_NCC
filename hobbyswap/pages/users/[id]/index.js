import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { faBookmark, faUser } from "@fortawesome/free-regular-svg-icons";
import {
  faLayerGroup,
  faLocationPin,
  faShoppingBag,
  faStar,
} from "@fortawesome/free-solid-svg-icons";
import UserIcon from "@/components/user-icon";
import Link from "next/link";
import { UserContext } from "@/contexts/UserContext";
export default function User() {
  const { user: viewer } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    // Fetch the profile being viewed
    fetch(`/api/users/${router.query.id}`)
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, [router.isReady, router.query.id]);

  if (!profile) return <p>Loading...</p>;
  const isOwnerOfProfile = viewer?._id === profile._id;

  return (
    <>
      {/* Active Tab Section */}
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
                href="#"
                className={
                  router.asPath.includes("/")
                    ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                    : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                }
              >
                {isOwnerOfProfile && "My"} Profile
              </Link>
            </div>
            <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center my-3">
              <FontAwesomeIcon
                icon={faLayerGroup}
                size="3x"
                className="fw-bolder text-primary mb-1"
              />

              <Link
                href={`/users/${profile._id}/listings`} // From 'My profile Tab to My Listings' listings.js
                className={
                  router.asPath.includes("listings")
                    ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                    : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                }
              >
                {isOwnerOfProfile && "My"} Listings
              </Link>
            </div>
            {isOwnerOfProfile && (
              <>
                <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faShoppingBag}
                    size="3x"
                    className="fw-bolder text-primary mb-1"
                  />
                  <Link
                    href="#"
                    className={
                      router.asPath.includes("history")
                        ? "text-primary fw-semibold text-shadow custom-shadow-secondary"
                        : "text-primary fw-semibold link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover"
                    }
                  >
                    My History
                  </Link>
                </div>
                <div className="col-md-2 mx-auto d-flex flex-column justify-content-center align-items-center">
                  <FontAwesomeIcon
                    icon={faBookmark}
                    size="3x"
                    className="fw-bolder text-primary mb-1"
                  />
                  <Link
                    href="#"
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
      {/* User Information Section */}
      <div className="container-ls my-5">
        <div className="row justify-content-center align-items-stretch gap-5">
          <div className="col-12 col-md-4 border border-gray rounded rounded-4 shadow py-8 d-flex flex-column justify-content-center align-items-center gap-3">
            <UserIcon img="/images/default-avatar.png" size={120} />
            <p className="fw-semibold fs-2 text-primary">{`${profile?.firstName} ${profile?.lastName}`}</p>
            <div className="w-100 text-center align-self-center">
              {isOwnerOfProfile && (
                <button className="btn btn-light text-primary border-primary border rounded-pill py-2 fw-semibold w-50 w-md-100">
                  Edit Profile
                </button>
              )}
              <div className="d-flex flex-column align-items-center gap-2 w-50 w-md-100 text-center mt-3 mx-auto">
                <Link
                  href={`${router.asPath}/listings`}
                  className="btn btn-primary rounded-pill py-2 fw-semibold w-100 border border-primary border-3"
                >
                  View {isOwnerOfProfile ? "Your" : "All"} Listings
                </Link>
                {isOwnerOfProfile && (
                  <button className="btn btn-light text-primary border-primary rounded-pill py-2 fw-semibold w-100">
                    <Link
                      className="link-offset-1 link-offset-1-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover fw-semibold"
                      href="/listings/create"
                    >
                      List An Item
                    </Link>
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="col-11 col-md-6 border border-gray rounded rounded-4 shadow p-4 d-flex flex-column justify-content-center align-items-center ">
            <div className="row border-bottom border-gray pb-3 w-100 mb-3">
              <div className="d-flex  justify-content-start align-items-center gap-5 my-3">
                <p className="fw-semibold fs-4 text-primary mb-0">{`${profile?.firstName} ${profile?.lastName}`}</p>
                <div className="d-flex justify-content-start align-items-center gap-2 my-0">
                  <FontAwesomeIcon
                    icon={faLocationPin}
                    className="text-muted"
                  ></FontAwesomeIcon>
                  <p className="fs-6 text-mutedd mb-0">Location</p>
                </div>
              </div>
              <p className="fs-6 text-muted fw-semibold text-uppercase mb-0">
                Rankings
              </p>
              <div className="d-flex justify-content-start align-items-center gap-3 mt-0">
                {/* Hard code for now, implement dynamically later */}
                <p className="fw-semibold fs-3 text-primary mb-0">5.0</p>
                <div className="d-flex">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon
                      key={i}
                      icon={faStar}
                      className="text-secondary"
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="row pb-3 w-100 mb-3">
              <p className="fs-6 text-muted fw-semibold text-uppercase mb-2">
                Contact Information
              </p>
              <div className="container mb-3 mx-3">
                <div className="row mb-2">
                  <p className="fs-6 text-primary fw-semibold mb-0 col-4">
                    Email
                  </p>
                  <p className="text-primary mb-0 col-8">{profile?.email}</p>
                </div>
                <div className="row mb-2">
                  <p className="fs-6 text-primary fw-semibold mb-0 col-4">
                    Address
                  </p>
                  <p className="text-primary mb-0 col-8">
                    {profile?.address ? profile.address : "N/A"}
                  </p>
                </div>
                <div className="row mb-2">
                  <p className="fs-6 text-primary fw-semibold mb-0 col-4">
                    Site
                  </p>
                  <p className="text-primary mb-0 col-8">
                    {profile?.site ? profile.site : "N/A"}
                  </p>
                </div>
              </div>
              <p className="fs-6 text-muted fw-semibold text-uppercase mb-2">
                Basic Information
              </p>
              <div className="container mb-3 mx-3">
                <div className="row mb-2">
                  <p className="fs-6 text-primary fw-semibold mb-0 col-4">
                    Name
                  </p>
                  <p className="text-primary mb-0 col-8">
                    {`${profile?.firstName} ${profile?.lastName}`}
                  </p>
                </div>
                <div className="row mb-2">
                  <p className="fs-6 text-primary fw-semibold mb-0 col-4">
                    Gender
                  </p>
                  <p className="text-primary mb-0 col-8">
                    {profile?.gender ? profile.gender : "N/A"}
                  </p>
                </div>
                <div className="row mb-2">
                  <p className="fs-6 text-primary fw-semibold mb-0 col-4">
                    Date of birth
                  </p>
                  <p className="text-primary mb-0 col-8">
                    {profile?.dateOfBirth ? profile.dateOfBirth : "N/A"}
                  </p>
                </div>
              </div>
              <p className="fs-6 text-muted fw-semibold text-uppercase mb-2">
                Account Information
              </p>
              <div className="container mb-3 mx-3">
                <div className="row mb-2">
                  <p className="fs-6 text-primary fw-semibold mb-0 col-4">
                    Member Since
                  </p>
                  <p className="text-primary mb-0 col-8">
                    {profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "2-digit",
                            year: "numeric",
                          },
                        )
                      : "N/A"}
                  </p>
                </div>
                {isOwnerOfProfile && (
                  <div className="row mb-2">
                    <p className="fs-6 text-primary fw-semibold mb-0 col-4 align-self-center">
                      Password
                    </p>
                    {/* <p className="text-primary mb-0 col-4 align-self-center">
                      {profile?.password ? profile.password : "N/A"}
                    </p>                     */}
                    <button className="btn btn-light text-muted rounded-pill p-3 fw-semibold col-4">
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
