import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import NoData from "../../components/NoData";
import { CgDanger } from "react-icons/cg";
import 'bootstrap/dist/css/bootstrap.min.css';

const Student = () => {
  const [searchParams, setSearchParams] = useState({
    enrollmentNo: "",
    name: "",
    semester: "",
    branch: "",
  });
  const [students, setStudents] = useState([]);
  const [branches, setBranches] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [file, setFile] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const userToken = localStorage.getItem("userToken");

  const [formData, setFormData] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    semester: "",
    branchId: "",
    gender: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    profile: "",
    status: "active",
    bloodGroup: "",
    emergencyContact: {
      name: "",
      relationship: "",
      phone: "",
    },
  });

  useEffect(() => {
    getBranchHandler();
  }, []);

  const getBranchHandler = async () => {
    try {
      toast.loading("Loading branches...");
      const response = await axiosWrapper.get(`/branch`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setBranches(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setBranches([]);
      } else {
        console.error(error);
        toast.error(error.response?.data?.message || "Error fetching branches");
      }
    } finally {
      toast.dismiss();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const searchStudents = async (e) => {
    e.preventDefault();

    if (
      !searchParams.enrollmentNo &&
      !searchParams.name &&
      !searchParams.semester &&
      !searchParams.branch
    ) {
      toast.error("Please select at least one filter");
      return;
    }

    setDataLoading(true);
    setHasSearched(true);
    toast.loading("Searching students...");
    try {
      const response = await axiosWrapper.post(
        `/student/search`,
        searchParams,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      toast.dismiss();
      if (response.data.success) {
        if (response.data.data.length === 0) {
          setStudents([]);
        } else {
          toast.success("Students found!");
          setStudents(response.data.data);
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      setStudents([]);
      toast.error(error.response?.data?.message || "Error searching students");
    } finally {
      setDataLoading(false);
    }
  };

  const handleFormInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEmergencyContactChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const addStudentHandler = async () => {
    try {
      toast.loading(isEditing ? "Updating Student" : "Adding Student");
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${userToken}`,
      };

      const formDataToSend = new FormData();
      for (const key in formData) {
        if (key === "emergencyContact") {
          for (const subKey in formData.emergencyContact) {
            formDataToSend.append(
              `emergencyContact[${subKey}]`,
              formData.emergencyContact[subKey]
            );
          }
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }

      if (file) {
        formDataToSend.append("file", file);
      }

      let response;
      if (isEditing) {
        response = await axiosWrapper.patch(
          `/student/${selectedStudentId}`,
          formDataToSend,
          {
            headers,
          }
        );
      } else {
        response = await axiosWrapper.post(
          `/student/register`,
          formDataToSend,
          {
            headers,
          }
        );
      }

      toast.dismiss();
      if (response.data.success) {
        if (!isEditing) {
          toast.success(
            `Student created successfully! Default password: student123`
          );
        } else {
          toast.success(response.data.message);
        }
        resetForm();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const deleteStudentHandler = (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedStudentId(id);
  };

  const editStudentHandler = (student) => {
    setFormData({
      firstName: student.firstName || "",
      middleName: student.middleName || "",
      lastName: student.lastName || "",
      phone: student.phone || "",
      semester: student.semester || "",
      branchId: student.branchId?._id || "",
      gender: student.gender || "",
      dob: student.dob?.split("T")[0] || "",
      address: student.address || "",
      city: student.city || "",
      state: student.state || "",
      pincode: student.pincode || "",
      country: student.country || "",
      profile: student.profile || "",
      status: student.status || "active",
      bloodGroup: student.bloodGroup || "",
      emergencyContact: {
        name: student.emergencyContact?.name || "",
        relationship: student.emergencyContact?.relationship || "",
        phone: student.emergencyContact?.phone || "",
      },
    });
    setSelectedStudentId(student._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Student");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      };
      const response = await axiosWrapper.delete(
        `/student/${selectedStudentId}`,
        {
          headers,
        }
      );
      toast.dismiss();
      if (response.data.success) {
        toast.success("Student has been deleted successfully");
        setIsDeleteConfirmOpen(false);
        searchStudents({ preventDefault: () => {} });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error");
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      middleName: "",
      lastName: "",
      phone: "",
      semester: "",
      branchId: "",
      gender: "",
      dob: "",
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
      profile: "",
      status: "active",
      bloodGroup: "",
      emergencyContact: {
        name: "",
        relationship: "",
        phone: "",
      },
    });
    setShowAddForm(false);
    setIsEditing(false);
    setSelectedStudentId(null);
    setFile(null);
  };

  return (
    <div className="container-fluid mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Heading title="Student Management" />
        {branches.length > 0 && (
          <CustomButton onClick={() => setShowAddForm(true)}>
            <IoMdAdd className="fs-5" />
          </CustomButton>
        )}
      </div>

      {branches.length > 0 && (
        <div className="my-4">
          <form onSubmit={searchStudents} className="mb-4">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Enrollment Number</label>
                <input
                  type="text"
                  name="enrollmentNo"
                  value={searchParams.enrollmentNo}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter enrollment number"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={searchParams.name}
                  onChange={handleInputChange}
                  className="form-control"
                  placeholder="Enter student name"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Semester</label>
                <select
                  name="semester"
                  value={searchParams.semester}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <option key={sem} value={sem}>
                      Semester {sem}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Branch</label>
                <select
                  name="branch"
                  value={searchParams.branch}
                  onChange={handleInputChange}
                  className="form-select"
                >
                  <option value="">Select Branch</option>
                  {branches?.map((branch) => (
                    <option key={branch._id} value={branch._id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-3 text-center">
              <CustomButton
                type="submit"
                disabled={dataLoading}
                variant="primary"
              >
                {dataLoading ? "Searching..." : "Search"}
              </CustomButton>
            </div>
          </form>

          {!hasSearched && (
            <div className="text-center mt-5 p-5 bg-white rounded-3 mx-auto w-50">
              <img
                src="/assets/filter.svg"
                alt="Select filters"
                className="img-fluid mb-3"
                style={{ maxHeight: "200px" }}
              />
              <p className="text-muted">Please select at least one filter to search students</p>
            </div>
          )}

          {hasSearched && students.length === 0 && (
            <NoData title="No students found" />
          )}

          {students && students.length > 0 && (
            <div className="mt-4">
              <h2 className="h4 fw-semibold mb-3">Search Results</h2>
              <div className="table-responsive">
                <table className="table table-bordered table-hover">
                  <thead className="table-light">
                    <tr>
                      <th>Profile</th>
                      <th>Name</th>
                      <th>E. No</th>
                      <th>Semester</th>
                      <th>Branch</th>
                      <th>Email</th>
                      <th className="text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student._id}>
                        <td>
                          <img
                            src={`${process.env.REACT_APP_MEDIA_LINK}/${student.profile}`}
                            alt={`${student.firstName}'s profile`}
                            className="rounded-circle"
                            style={{ width: "48px", height: "48px", objectFit: "cover" }}
                            onError={(e) => {
                              e.target.src =
                                "https://images.unsplash.com/photo-1744315900478-fa44dc6a4e89?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                            }}
                          />
                        </td>
                        <td>
                          {student.firstName} {student.middleName}{" "}
                          {student.lastName}
                        </td>
                        <td>{student.enrollmentNo}</td>
                        <td>{student.semester}</td>
                        <td>{student.branchId?.name}</td>
                        <td>{student.email}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <CustomButton
                              variant="secondary"
                              className="p-2"
                              onClick={() => editStudentHandler(student)}
                            >
                              <MdEdit />
                            </CustomButton>
                            <CustomButton
                              variant="danger"
                              className="p-2"
                              onClick={() => deleteStudentHandler(student._id)}
                            >
                              <MdOutlineDelete />
                            </CustomButton>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {branches.length === 0 && (
        <div className="d-flex flex-column justify-content-center align-items-center mt-5">
          <CgDanger className="text-warning" style={{ fontSize: "4rem" }} />
          <p className="text-center fs-5 mt-3">
            Please add branches before adding a student.
          </p>
        </div>
      )}

      {showAddForm && (
        <div className="modal show d-block bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered modal-xl">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-semibold">
                  {isEditing ? "Edit Student" : "Add New Student"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetForm}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => {
                  e.preventDefault();
                  addStudentHandler();
                }}>
                  <div className="row g-3">
                    <div className="col-md-4">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) =>
                          handleFormInputChange("firstName", e.target.value)
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Middle Name</label>
                      <input
                        type="text"
                        value={formData.middleName}
                        onChange={(e) =>
                          handleFormInputChange("middleName", e.target.value)
                        }
                        className="form-control"
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) =>
                          handleFormInputChange("lastName", e.target.value)
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Phone</label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleFormInputChange("phone", e.target.value)
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Semester</label>
                      <select
                        value={formData.semester}
                        onChange={(e) =>
                          handleFormInputChange("semester", e.target.value)
                        }
                        className="form-select"
                        required
                      >
                        <option value="">Select Semester</option>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                          <option key={sem} value={sem}>
                            Semester {sem}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Branch</label>
                      <select
                        value={formData.branchId}
                        onChange={(e) =>
                          handleFormInputChange("branchId", e.target.value)
                        }
                        className="form-select"
                        required
                      >
                        <option value="">Select Branch</option>
                        {branches?.map((branch) => (
                          <option key={branch._id} value={branch._id}>
                            {branch.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Gender</label>
                      <select
                        value={formData.gender}
                        onChange={(e) =>
                          handleFormInputChange("gender", e.target.value)
                        }
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
                        value={formData.dob}
                        onChange={(e) =>
                          handleFormInputChange("dob", e.target.value)
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Blood Group</label>
                      <select
                        value={formData.bloodGroup}
                        onChange={(e) =>
                          handleFormInputChange("bloodGroup", e.target.value)
                        }
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
                      <label className="form-label">Profile Photo</label>
                      <input
                        type="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        className="form-control"
                        accept="image/*"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        value={formData.address}
                        onChange={(e) =>
                          handleFormInputChange("address", e.target.value)
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">City</label>
                      <input
                        type="text"
                        value={formData.city}
                        onChange={(e) =>
                          handleFormInputChange("city", e.target.value)
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">State</label>
                      <input
                        type="text"
                        value={formData.state}
                        onChange={(e) =>
                          handleFormInputChange("state", e.target.value)
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Pincode</label>
                      <input
                        type="text"
                        value={formData.pincode}
                        onChange={(e) =>
                          handleFormInputChange("pincode", e.target.value)
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Country</label>
                      <input
                        type="text"
                        value={formData.country}
                        onChange={(e) =>
                          handleFormInputChange("country", e.target.value)
                        }
                        className="form-control"
                        required
                      />
                    </div>

                    <div className="col-12">
                      <h5 className="fw-semibold mb-3">Emergency Contact</h5>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            value={formData.emergencyContact.name}
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
                            value={formData.emergencyContact.relationship}
                            onChange={(e) =>
                              handleEmergencyContactChange(
                                "relationship",
                                e.target.value
                              )
                            }
                            className="form-control"
                            required
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label">Phone</label>
                          <input
                            type="tel"
                            value={formData.emergencyContact.phone}
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
                      <p className="text-muted small">
                        Default login will be{" "}
                        <span className="fw-bold">
                          {formData.enrollmentNo || "enrollment_no"}@gmail.com
                        </span>{" "}
                        and password will be{" "}
                        <span className="fw-bold">student123</span>
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
                        {isEditing ? "Update Student" : "Add Student"}
                      </CustomButton>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this student?"
      />
    </div>
  );
};

export default Student;