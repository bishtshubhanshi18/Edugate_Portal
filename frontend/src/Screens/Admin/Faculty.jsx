import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";
import 'bootstrap/dist/css/bootstrap.min.css';

const Faculty = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    profile: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    gender: "",
    dob: "",
    designation: "",
    joiningDate: "",
    salary: "",
    status: "active",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
    bloodGroup: "",
    branchId: "",
  });

  const [branch, setBranches] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const userToken = localStorage.getItem("userToken");
  const [file, setFile] = useState(null);
  const [dataLoading, setDataLoading] = useState(null);

  useEffect(() => {
    getFacultyHandler();
    getBranchHandler();
  }, []);

  const getFacultyHandler = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get("/faculty", {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setFaculty(response.data);
    } catch (error) {
      console.error("Error fetching faculty:", error);
      toast.error("Failed to fetch faculty");
    } finally {
      setDataLoading(false);
    }
  };

  const getBranchHandler = async () => {
    try {
      const response = await axiosWrapper.get("/branch", {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to fetch branches");
    }
  };

  const handleInputChange = (field, value) => {
    setData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const resetForm = () => {
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedFacultyId(null);
    setFile(null);
    setData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      profile: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      gender: "",
      dob: "",
      designation: "",
      joiningDate: "",
      salary: "",
      status: "active",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
      bloodGroup: "",
      branchId: "",
    });
  };

  const addFacultyHandler = async () => {
    try {
      setDataLoading(true);
      
      const formData = new FormData();
      
      // Add all fields to formData
      Object.keys(data).forEach(key => {
        if (key === "emergencyContact") {
          formData.append(key, JSON.stringify(data[key]));
        } else {
          formData.append(key, data[key]);
        }
      });
      
      if (file) {
        formData.append("profileImage", file);
      }

      if (isEditing) {
        await axiosWrapper.put(`/faculty/${selectedFacultyId}`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data"
          }
        });
        toast.success("Faculty updated successfully");
      } else {
        await axiosWrapper.post("/faculty", formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data"
          }
        });
        toast.success("Faculty added successfully");
      }
      
      resetForm();
      getFacultyHandler();
    } catch (error) {
      console.error("Error saving faculty:", error);
      toast.error(error.response?.data?.message || "Failed to save faculty");
    } finally {
      setDataLoading(false);
    }
  };

  const editFacultyHandler = (faculty) => {
    setIsEditing(true);
    setSelectedFacultyId(faculty._id);
    
    // Format the data for editing
    setData({
      firstName: faculty.firstName || "",
      lastName: faculty.lastName || "",
      email: faculty.email || "",
      phone: faculty.phone || "",
      profile: faculty.profile || "",
      address: faculty.address || "",
      city: faculty.city || "",
      state: faculty.state || "",
      pincode: faculty.pincode || "",
      country: faculty.country || "",
      gender: faculty.gender || "",
      dob: faculty.dob ? faculty.dob.split('T')[0] : "",
      designation: faculty.designation || "",
      joiningDate: faculty.joiningDate ? faculty.joiningDate.split('T')[0] : "",
      salary: faculty.salary || "",
      status: faculty.status || "active",
      emergencyContact: {
        name: faculty.emergencyContact?.name || "",
        relationship: faculty.emergencyContact?.relationship || "",
        phone: faculty.emergencyContact?.phone || "",
      },
      bloodGroup: faculty.bloodGroup || "",
      branchId: faculty.branchId?._id || "",
    });
    
    setShowAddForm(true);
  };

  const deleteFacultyHandler = (id) => {
    setSelectedFacultyId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDataLoading(true);
      await axiosWrapper.delete(`/faculty/${selectedFacultyId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      toast.success("Faculty deleted successfully");
      getFacultyHandler();
    } catch (error) {
      console.error("Error deleting faculty:", error);
      toast.error("Failed to delete faculty");
    } finally {
      setIsDeleteConfirmOpen(false);
      setDataLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Heading title="Faculty Management" />
        <CustomButton
          onClick={() => {
            if (showAddForm) {
              resetForm();
            } else {
              setShowAddForm(true);
            }
          }}
          className="btn btn-primary"
        >
          <IoMdAdd className="fs-4" />
        </CustomButton>
      </div>

      {dataLoading && <Loading />}

      {showAddForm && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditing ? "Edit Faculty" : "Add New Faculty"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetForm}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  addFacultyHandler();
                }}>
                  <div className="row g-3">
                    <div className="col-12">
                      <label className="form-label">Profile Photo</label>
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="form-control"
                        accept="image/*"
                      />
                    </div>

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

                    <div className="col-md-6">
                      <label className="form-label">Branch</label>
                      <select
                        value={data.branchId}
                        onChange={(e) => handleInputChange("branchId", e.target.value)}
                        className="form-select"
                        required
                      >
                        <option value="">Select Branch</option>
                        {branch.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

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

                    <div className="col-md-4">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        value={data.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        value={data.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        value={data.pincode}
                        onChange={(e) => handleInputChange("pincode", e.target.value)}
                        className="form-control"
                        required
                      />
                    </div>

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

                    <div className="col-12">
                      <h5 className="mb-3">Emergency Contact</h5>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            value={data.emergencyContact.name}
                            onChange={(e) => handleEmergencyContactChange("name", e.target.value)}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label">Relationship</label>
                          <input
                            type="text"
                            value={data.emergencyContact.relationship}
                            onChange={(e) => handleEmergencyContactChange("relationship", e.target.value)}
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label">Phone</label>
                          <input
                            type="tel"
                            value={data.emergencyContact.phone}
                            onChange={(e) => handleEmergencyContactChange("phone", e.target.value)}
                            className="form-control"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 d-flex justify-content-between align-items-center">
                    <div>
                      <p className="text-muted mb-0">
                        Default password will be <span className="fw-bold">faculty123</span>
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <CustomButton
                        type="button"
                        variant="secondary"
                        onClick={resetForm}
                        className="btn btn-secondary"
                      >
                        Cancel
                      </CustomButton>
                      <CustomButton type="submit" variant="primary" className="btn btn-primary">
                        {isEditing ? "Update Faculty" : "Add Faculty"}
                      </CustomButton>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {!dataLoading && !showAddForm && (
        <div className="mt-4">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-primary">
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Email</th>
                  <th scope="col">Phone</th>
                  <th scope="col">Employee ID</th>
                  <th scope="col">Designation</th>
                  <th scope="col" className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {faculty && faculty.length > 0 ? (
                  faculty.map((item, index) => (
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
                            onClick={() => editFacultyHandler(item)}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <MdEdit />
                          </CustomButton>
                          <CustomButton
                            variant="danger"
                            onClick={() => deleteFacultyHandler(item._id)}
                            className="btn btn-sm btn-outline-danger"
                          >
                            <MdOutlineDelete />
                          </CustomButton>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No Faculty found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this faculty?"
      />
    </div>
  );
};

export default Faculty;