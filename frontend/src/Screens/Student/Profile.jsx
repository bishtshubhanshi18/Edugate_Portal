import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";

const Profile = ({ profileData }) => {
  const [showPasswordUpdate, setShowPasswordUpdate] = useState(false);
  if (!profileData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container-lg p-5">
      {/* Header Section */}
      <div className="d-flex align-items-center gap-5 mb-5 pb-4 border-bottom flex-column flex-md-row">
        <div className="d-flex align-items-center gap-5 flex-column flex-sm-row text-center text-sm-start">
          <div className="position-relative">
            <img
              src={`${process.env.REACT_APP_MEDIA_LINK}/${profileData.profile}`}
              alt="Profile"
              className="rounded-circle object-fit-cover"
              style={{ width: "160px", height: "160px", border: "4px solid #0d6efd", boxShadow: "0 0 0 4px white" }}
            />
          </div>
          <div>
            <h1 className="display-5 fw-bold text-dark mb-2">
              {`${profileData.firstName} ${profileData.middleName} ${profileData.lastName}`}
            </h1>
            <p className="fs-5 text-secondary mb-1">
              {profileData.enrollmentNo}
            </p>
            <p className="fs-5 text-primary fw-medium">
              {profileData.branchId.name}
            </p>
          </div>
        </div>
        <div className="ms-md-auto">
          <CustomButton
            onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
            variant="primary"
          >
            {showPasswordUpdate ? "Hide" : "Update Password"}
          </CustomButton>
        </div>
        {showPasswordUpdate && (
          <UpdatePasswordLoggedIn
            onClose={() => setShowPasswordUpdate(false)}
          />
        )}
      </div>

      <div className="row g-4">
        {/* Personal Information */}
        <div className="col-12 bg-white rounded shadow-sm p-4">
          <h2 className="h2 fw-bold text-dark mb-4 pb-2 border-bottom">
            Personal Information
          </h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">Email</label>
              <p className="text-dark">{profileData.email}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">Phone</label>
              <p className="text-dark">{profileData.phone}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">Gender</label>
              <p className="text-dark text-capitalize">{profileData.gender}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">Blood Group</label>
              <p className="text-dark">{profileData.bloodGroup}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">Date of Birth</label>
              <p className="text-dark">{formatDate(profileData.dob)}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">Semester</label>
              <p className="text-dark">{profileData.semester}</p>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="col-12 bg-white rounded shadow-sm p-4">
          <h2 className="h2 fw-bold text-dark mb-4 pb-2 border-bottom">
            Address Information
          </h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">Address</label>
              <p className="text-dark">{profileData.address}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">City</label>
              <p className="text-dark">{profileData.city}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">State</label>
              <p className="text-dark">{profileData.state}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">Pincode</label>
              <p className="text-dark">{profileData.pincode}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">Country</label>
              <p className="text-dark">{profileData.country}</p>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="col-12 bg-white rounded shadow-sm p-4">
          <h2 className="h2 fw-bold text-dark mb-4 pb-2 border-bottom">
            Emergency Contact
          </h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">Name</label>
              <p className="text-dark">
                {profileData.emergencyContact.name}
              </p>
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">Relationship</label>
              <p className="text-dark">
                {profileData.emergencyContact.relationship}
              </p>
            </div>
            <div className="col-md-6 col-lg-4">
              <label className="form-label text-muted">Phone</label>
              <p className="text-dark">
                {profileData.emergencyContact.phone}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;