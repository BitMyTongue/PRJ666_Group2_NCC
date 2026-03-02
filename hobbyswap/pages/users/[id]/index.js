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
import UserNavbar from "@/components/user-navbar";
import Image from "next/image";
export default function User() {
  const { user: viewer } = useContext(UserContext);
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    // Fetch the profile being viewed
    fetch(`/api/users/${router.query.id}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setFormData(data); // Pre-filled form data for editting
        setProfileImageUrl(data.profilePicture || null); // Set profile image
      });
  }, [router.isReady, router.query.id]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileImageChange = (e) => {
    console.log('Profile image changed:', e.target.files?.[0]);
    const file = e.target.files?.[0];
    if (!file) return;

    uploadProfileImage(file);
  };

  const uploadProfileImage = async (file) => {
    setIsUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", profile._id);

      const response = await fetch("/api/users/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setProfileImageUrl(data.imageUrl);
        setFormData((prev) => ({ ...prev, profilePicture: data.imageUrl }));
      } else {
        alert("Failed to upload image");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("An error occurred while uploading the image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRemoveProfileImage = () => {
    setProfileImageUrl(null);
    setFormData((prev) => ({ ...prev, profilePicture: null }));
  };

  const handleSubmit = async () => {
    setIsSaving(true);
    try {

      const response = await fetch(`/api/users/${profile._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          site: formData.site,
          gender: formData.gender,
          dateOfBirth: formData.dateOfBirth,
          profilePicture: profileImageUrl, // Include profile picture URL in update
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // data.user contains the fresh document from the database
        setProfile(data.user || { ...formData, profilePicture: profileImageUrl });
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("An error occurred while updating the profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (!profile) return <p>Loading...</p>;
  const isOwnerOfProfile = viewer?._id === profile._id;

  return (
    <>
      <UserNavbar id={router.query.id}>
        {/* User Information Section */}
        <div className="container-ls my-5">
          <div className="row justify-content-center align-items-stretch gap-5">
            <div className="col-12 col-md-4 border border-gray rounded rounded-4 shadow py-8 d-flex flex-column justify-content-center align-items-center gap-3">
              {console.log("profile", profile)}
            {
              !isEditing ? (
              profile?.profilePicture ? (
                <Image
                  src={profile.profilePicture}
                  alt="Profile Picture"
                  width={120}
                  height={120}
                  className="rounded-circle"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <UserIcon img="/images/default-avatar.png" size={120} />
                
              )
            ) : (
              <div style={{ position: "relative", display: "inline-block" }}>
                {profileImageUrl ? (
                  <>
                    <Image
                      src={profileImageUrl}
                      alt="Profile Picture Preview"
                      width={120}
                      height={120}
                      className="rounded-circle"
                      style={{ objectFit: "cover" }}
                    />
                    <button
                      type="button"
                      aria-label="Remove image"
                      className="btn btn-danger btn-sm position-absolute"
                      style={{ top: -8, right: -8, zIndex: 2, borderRadius: 20, padding: '0 6px' }}
                      onClick={handleRemoveProfileImage}
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <UserIcon img="/images/default-avatar.png" size={120} />
                  )}
              </div>
            )}
            <p className="fw-semibold fs-2 text-primary">{`${profile?.firstName} ${profile?.lastName}`}</p>
              <div className="w-100 text-center align-self-center">
                {isOwnerOfProfile && (
                  <>
                  {!isEditing ? (
                    <button 
                      onClick={handleEditClick}
                      className="btn btn-light text-primary border-primary border rounded-pill py-2 fw-semibold w-50 w-md-100"
                    >
                        Edit Profile
                      </button>
                    ) : (
                    <div className="d-flex gap-2 justify-content-center mb-3">
                      <button 
                        onClick={handleCancel}
                        className="btn btn-light text-primary border-primary border rounded-pill py-2 fw-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </>
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
              {!isEditing ? (
              <>
                <div className="row border-bottom border-gray pb-3 w-100 mb-3">
                    <div className="d-flex  justify-content-start align-items-center gap-5 my-3">
                      <p className="fw-semibold fs-4 text-primary mb-0">{`${profile?.firstName} ${profile?.lastName}`}</p>
                      <div className="d-flex justify-content-start align-items-center gap-2 my-0">
                        <FontAwesomeIcon
                          icon={faLocationPin}
                          className="text-muted"
                        ></FontAwesomeIcon>
                        <p className="fs-6 text-mutedd mb-0">{profile?.address ? profile.address : "Location"}</p>
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
                          {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString("en-US", { month: "long", day: "2-digit", year: "numeric" }) : "N/A"}
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
                            <button className="btn btn-light text-muted rounded-pill p-3 fw-semibold col-4">
                            Change Password
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </>
            ) : (
              // Edit Mode
              <div className="row pb-3 w-100 mb-3">
                <p className="fs-6 text-muted fw-semibold text-uppercase mb-2">
                  Edit Profile
                </p>
                
                {/* Profile Picture Upload Section */}
                <div className="container mb-4 mx-3 text-center">
                  <p className="fs-6 text-muted fw-semibold text-uppercase mb-2">
                    Profile Picture
                  </p>
                  <div style={{ position: "relative", display: "inline-block", marginBottom: "1rem" }}>
                    {profileImageUrl ? (
                      <>
                        <Image
                          src={profileImageUrl}
                          alt="Profile Picture Preview"
                          width={150}
                          height={150}
                          className="rounded-circle border border-gray shadow"
                          style={{ objectFit: "cover" }}
                        />
                        <button
                          type="button"
                          aria-label="Remove image"
                          className="btn btn-danger btn-sm position-absolute"
                          style={{ top: -8, right: -8, zIndex: 2, borderRadius: 20, padding: '0 6px' }}
                          onClick={handleRemoveProfileImage}
                        >
                          ×
                        </button>
                      </>
                    ) : (
                      <UserIcon img="/images/default-avatar.png" size={150} />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      id="profile-pic-upload"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      disabled={isUploadingImage}
                      style={{ display: "none" }}
                    />
                    <label htmlFor="profile-pic-upload" className="cursor-pointer">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          document.getElementById("profile-pic-upload").click();
                        }}
                        disabled={isUploadingImage}
                        className="btn btn-light text-primary border-primary border rounded-pill py-2 fw-semibold"
                      >
                        {isUploadingImage ? "Uploading..." : "Upload Picture"}
                      </button>
                    </label>
                  </div>
                </div>

                <hr className="w-100 my-4" />

                {/* Other Form Fields */}
                  <div className="mb-3">
                    <label className="fs-6 text-primary fw-semibold mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName || ""}
                      onChange={handleChange}
                      className="form-control bg-light p-2"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="fs-6 text-primary fw-semibold mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName || ""}
                      onChange={handleChange}
                      className="form-control bg-light p-2"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="fs-6 text-primary fw-semibold mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      onChange={handleChange}
                      className="form-control bg-light p-2"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="fs-6 text-primary fw-semibold mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address || ""}
                      onChange={handleChange}
                      className="form-control bg-light p-2"
                      placeholder="Enter your address"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="fs-6 text-primary fw-semibold mb-1">
                      Website
                    </label>
                    <input
                      type="text"
                      name="site"
                      value={formData.site || ""}
                      onChange={handleChange}
                      className="form-control bg-light p-2"
                      placeholder="Enter your website"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="fs-6 text-primary fw-semibold mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender || "Not Specified"}
                      onChange={handleChange}
                      className="form-control bg-light p-2"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Not Specified">Not Specified</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="fs-6 text-primary fw-semibold mb-1">
                      Date of Birth
                    </label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ""}
                      onChange={handleChange}
                      className="form-control bg-light p-2"
                    />
                  </div>
                  <div className="d-flex gap-2 mt-4">
                    <button 
                      onClick={handleSubmit}
                      disabled={isSaving}
                      className="btn btn-primary rounded-pill py-2 fw-semibold flex-grow-1"
                    >
                      {isSaving ? "Saving..." : "Submit Changes"}
                    </button>
                  </div>
              </div>
            )}
          </div>
          </div>
        </div>
      </UserNavbar>
    </>
  );
}
