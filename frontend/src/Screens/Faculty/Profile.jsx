import React, { useState } from "react";
import CustomButton from "../../components/CustomButton";
import UpdatePasswordLoggedIn from "../../components/UpdatePasswordLoggedIn";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container-fluid p-4 p-lg-5">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row align-items-center justify-content-between border-bottom pb-4 mb-4">
        <div className="d-flex flex-column flex-md-row align-items-center gap-4 mb-4 mb-md-0">
          <img
            src={`${process.env.REACT_APP_MEDIA_LINK}/${profileData.profile}`}
            alt="Profile"
            className="rounded-circle border border-4 border-primary"
            style={{ width: '160px', height: '160px', objectFit: 'cover' }}
          />
          <div className="text-center text-md-start">
            <h1 className="display-5 fw-bold mb-2">
              {`${profileData.firstName} ${profileData.lastName}`}
            </h1>
            <p className="lead mb-1">
              Employee ID: {profileData.employeeId}
            </p>
            <p className="text-primary fw-bold">
              {profileData.designation}
            </p>
          </div>
        </div>
        <div>
          <CustomButton
            onClick={() => setShowPasswordUpdate(!showPasswordUpdate)}
            variant="primary"
            className="btn btn-primary"
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
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title h3 fw-bold mb-4 pb-2 border-bottom">
                Personal Information
              </h2>
              <div className="row g-4">
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Email</label>
                    <p className="fw-normal">{profileData.email}</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Phone</label>
                    <p className="fw-normal">{profileData.phone}</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Gender</label>
                    <p className="fw-normal text-capitalize">{profileData.gender}</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Blood Group</label>
                    <p className="fw-normal">{profileData.bloodGroup}</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Date of Birth</label>
                    <p className="fw-normal">{formatDate(profileData.dob)}</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Joining Date</label>
                    <p className="fw-normal">{formatDate(profileData.joiningDate)}</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Salary</label>
                    <p className="fw-normal">₹{profileData.salary.toLocaleString()}</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Status</label>
                    <p className="fw-normal text-capitalize">{profileData.status}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Address Information */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title h3 fw-bold mb-4 pb-2 border-bottom">
                Address Information
              </h2>
              <div className="row g-4">
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Address</label>
                    <p className="fw-normal">{profileData.address}</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">City</label>
                    <p className="fw-normal">{profileData.city}</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">State</label>
                    <p className="fw-normal">{profileData.state}</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Pincode</label>
                    <p className="fw-normal">{profileData.pincode}</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Country</label>
                    <p className="fw-normal">{profileData.country}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title h3 fw-bold mb-4 pb-2 border-bottom">
                Emergency Contact
              </h2>
              <div className="row g-4">
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Name</label>
                    <p className="fw-normal">{profileData.emergencyContact.name}</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Relationship</label>
                    <p className="fw-normal">{profileData.emergencyContact.relationship}</p>
                  </div>
                </div>
                <div className="col-md-6 col-lg-4">
                  <div className="mb-3">
                    <label className="form-label text-muted">Phone</label>
                    <p className="fw-normal">{profileData.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;