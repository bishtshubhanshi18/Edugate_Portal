import React, { useState, useEffect } from "react"
import { toast } from "react-hot-toast"
import { MdOutlineDelete, MdEdit } from "react-icons/md"
import { IoMdAdd } from "react-icons/io"
import axiosWrapper from "../../utils/AxiosWrapper"
import Heading from "../../components/Heading"
import DeleteConfirm from "../../components/DeleteConfirm"
import CustomButton from "../../components/CustomButton"
import Loading from "../../components/Loading"

const Admin = () => {
  // States
  const [admins, setAdmins] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [file, setFile] = useState(null);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    dob: "",
    bloodGroup: "",
    designation: "",
    joiningDate: "",
    salary: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
  });

  // Handlers
  const resetForm = () => {
    setData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      gender: "",
      dob: "",
      bloodGroup: "",
      designation: "",
      joiningDate: "",
      salary: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    });
    setFile(null);
    setIsEditing(false);
    setShowAddForm(false);
  };

  const handleInputChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const addAdminHandler = async () => {
    try {
      if (isEditing) {
        toast.success("Admin updated successfully");
      } else {
        toast.success("Admin added successfully");
      }
      resetForm();
      fetchAdmins();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  const editAdminHandler = (admin) => {
    setData(admin);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const deleteAdminHandler = (id) => {
    setDeleteId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      toast.success("Admin deleted successfully");
      setIsDeleteConfirmOpen(false);
      setDeleteId(null);
      fetchAdmins();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // =====================
  // API Call to get admins
  // =====================
  const fetchAdmins = async () => {
    setDataLoading(true);
    try {
      // Replace with your API
      // const response = await axiosWrapper.get("/admins");
      // setAdmins(response.data);
      setAdmins([]); // Dummy data
    } catch (error) {
      toast.error("Failed to load admins");
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // =====================
  // Render
  // =====================
  return (
    <div className="container-fluid mt-4 mb-5 position-relative">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Heading title="Admin Management" />
        <CustomButton
          onClick={() => {
            if (showAddForm) {
              resetForm();
            } else {
              setShowAddForm(true);
            }
          }}
        >
          <IoMdAdd className="fs-4" />
        </CustomButton>
      </div>

      {/* Form Modal */}
      {showAddForm && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">
                  {isEditing ? "Edit Admin" : "Add New Admin"}
                </h2>
                <button onClick={resetForm} className="btn-close" type="button"></button>
              </div>
              <div className="modal-body">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    addAdminHandler();
                  }}
                >
                  <div className="row g-3">
                    {/* Profile Photo */}
                    <div className="col-12">
                      <label className="form-label">Profile Photo</label>
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="form-control"
                        accept="image/*"
                      />
                    </div>

                    {/* First Name */}
                    <div className="col-md-6">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        value={data.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Last Name */}
                    <div className="col-md-6">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        value={data.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Email */}
                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        value={data.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        value={data.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div className="col-md-6">
                      <label className="form-label">Gender</label>
                      <select
                        value={data.gender}
                        onChange={(e) => handleInputChange("gender", e.target.value)}
                        className="form-select"
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    {/* DOB */}
                    <div className="col-md-6">
                      <label className="form-label">Date of Birth</label>
                      <input
                        type="date"
                        value={data.dob}
                        onChange={(e) => handleInputChange("dob", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Blood Group */}
                    <div className="col-md-6">
                      <label className="form-label">Blood Group</label>
                      <select
                        value={data.bloodGroup}
                        onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
                        className="form-select"
                        required
                      >
                        <option value="">Select Blood Group</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    {/* Designation */}
                    <div className="col-md-6">
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        value={data.designation}
                        onChange={(e) => handleInputChange("designation", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Joining Date */}
                    <div className="col-md-6">
                      <label className="form-label">Joining Date</label>
                      <input
                        type="date"
                        value={data.joiningDate}
                        onChange={(e) => handleInputChange("joiningDate", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Salary */}
                    <div className="col-md-6">
                      <label className="form-label">Salary</label>
                      <input
                        type="number"
                        value={data.salary}
                        onChange={(e) => handleInputChange("salary", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Address */}
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        value={data.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* City */}
                    <div className="col-md-6">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        value={data.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* State */}
                    <div className="col-md-6">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        value={data.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Pincode */}
                    <div className="col-md-6">
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        value={data.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Country */}
                    <div className="col-md-6">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        value={data.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    {/* Emergency Contact */}
                    <div className="col-12">
                      <h3 className="h5 mb-3">Emergency Contact</h3>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            value={data.emergencyContact.name}
                            onChange={(e) =>
                              handleEmergencyContactChange("name", e.target.value)
                            }
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Relationship</label>
                          <input
                            type="text"
                            value={data.emergencyContact.relationship}
                            onChange={(e) =>
                              handleEmergencyContactChange("relationship", e.target.value)
                            }
                            className="form-control"
                            required
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Phone</label>
                          <input
                            type="tel"
                            value={data.emergencyContact.phone}
                            onChange={(e) =>
                              handleEmergencyContactChange("phone", e.target.value)
                            }
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="small mb-0">
                        Default password will be{" "}
                        <span className="fw-bold">admin123</span>
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <CustomButton
                        type="button"
                        variant="secondary"
                        onClick={resetForm}
                      >
                        Cancel
                      </CustomButton>
                      <CustomButton type="submit" variant="primary">
                        {isEditing ? "Update Admin" : "Add Admin"}
                      </CustomButton>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {dataLoading && <Loading />}

      {/* Admin List */}
      {!dataLoading && !showAddForm && (
        <div className="mt-4 table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Employee ID</th>
                <th>Designation</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins && admins.length > 0 ? (
                admins.map((item, index) => (
                  <tr key={index}>
                    <td>{`${item.firstName} ${item.lastName}`}</td>
                    <td>{item.email}</td>
                    <td>{item.phone}</td>
                    <td>{item.employeeId}</td>
                    <td>{item.designation}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <CustomButton
                          variant="secondary"
                          onClick={() => editAdminHandler(item)}
                        >
                          <MdEdit />
                        </CustomButton>
                        <CustomButton
                          variant="danger"
                          onClick={() => deleteAdminHandler(item._id)}
                        >
                          <MdOutlineDelete />
                        </CustomButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-4">
                    No Admins found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation */}
      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this admin?"
      />
    </div>
  );
};

export default Admin;