import React, { useState } from "react";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";
import CustomButton from "../../components/CustomButton";

const Profile = ({ profileData }) => {
  const [showUpdatePasswordModal, setShowUpdatePasswordModal] = useState(false);
  if (!profileData) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div className="d-flex align-items-center justify-content-between border-bottom pb-4 mb-4">
        <div className="d-flex align-items-center">
          <img
            src={`${process.env.REACT_APP_MEDIA_LINK}/${profileData.profile}`}
            alt="Profile"
            className="rounded-circle border border-4 border-primary me-4"
            style={{ width: "160px", height: "160px", objectFit: "cover" }}
          />
          <div>
            <h1 className="h2 fw-bold mb-2">
              {profileData.firstName} {profileData.lastName}
            </h1>
            <p className="mb-1 text-muted">
              Employee ID: {profileData.employeeId}
            </p>
            <p className="text-primary fw-semibold mb-0">
              {profileData.designation}
              {profileData.isSuperAdmin && " (Super Admin)"}
            </p>
          </div>
        </div>
        <CustomButton onClick={() => setShowUpdatePasswordModal(true)}>
          Update Password
        </CustomButton>
        {showUpdatePasswordModal && (
          <UpdatePasswordLoggedIn
            onClose={() => setShowUpdatePasswordModal(false)}
          />
        )}
      </div>

      {/* Personal Information */}
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 fw-bold border-bottom pb-2 mb-4">
            Personal Information
          </h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Email</small>
              <p className="mb-0">{profileData.email}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Phone</small>
              <p className="mb-0">{profileData.phone}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Gender</small>
              <p className="mb-0 text-capitalize">{profileData.gender}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Blood Group</small>
              <p className="mb-0">{profileData.bloodGroup}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Date of Birth</small>
              <p className="mb-0">{formatDate(profileData.dob)}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Joining Date</small>
              <p className="mb-0">{formatDate(profileData.joiningDate)}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Salary</small>
              <p className="mb-0">₹{profileData.salary.toLocaleString()}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Status</small>
              <p className="mb-0 text-capitalize">{profileData.status}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Role</small>
              <p className="mb-0">
                {profileData.isSuperAdmin ? "Super Admin" : "Admin"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Address Information */}
      <div className="card mb-4">
        <div className="card-body">
          <h2 className="h4 fw-bold border-bottom pb-2 mb-4">
            Address Information
          </h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Address</small>
              <p className="mb-0">{profileData.address}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">City</small>
              <p className="mb-0">{profileData.city}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">State</small>
              <p className="mb-0">{profileData.state}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Pincode</small>
              <p className="mb-0">{profileData.pincode}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Country</small>
              <p className="mb-0">{profileData.country}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Contact */}
      <div className="card">
        <div className="card-body">
          <h2 className="h4 fw-bold border-bottom pb-2 mb-4">
            Emergency Contact
          </h2>
          <div className="row g-4">
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Name</small>
              <p className="mb-0">{profileData.emergencyContact.name}</p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Relationship</small>
              <p className="mb-0">
                {profileData.emergencyContact.relationship}
              </p>
            </div>
            <div className="col-md-6 col-lg-4">
              <small className="text-muted">Phone</small>
              <p className="mb-0">{profileData.emergencyContact.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;