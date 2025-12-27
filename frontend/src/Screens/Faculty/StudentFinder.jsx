import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Heading from "../../components/Heading";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import NoData from "../../components/NoData";
import 'bootstrap/dist/css/bootstrap.min.css';

const StudentFinder = () => {
  const [searchParams, setSearchParams] = useState({
    enrollmentNo: "",
    name: "",
    branch: "",
    semester: "",
  });
  const [branches, setBranches] = useState([]);
  const [students, setStudents] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    getBranches();
  }, []);

  const getBranches = async () => {
    try {
      const response = await axiosWrapper.get("/branch", {
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
      toast.error(error.response?.data?.message || "Error fetching branches");
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
    try {
      const response = await axiosWrapper.get("/student/search", {
        params: searchParams,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setStudents(response.data.data);
        setHasSearched(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error searching students");
    }
  };

  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  return (
    <div className="container-fluid mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Heading title="Student Finder" />
      </div>

      <div className="my-4">
        <form onSubmit={searchStudents}>
          <div className="row g-3 mb-4">
            <div className="col-md-6 col-lg-3">
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

            <div className="col-md-6 col-lg-3">
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

            <div className="col-md-6 col-lg-3">
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

            <div className="col-md-6 col-lg-3">
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

          <div className="d-flex justify-content-center">
            <CustomButton
              type="submit"
              disabled={dataLoading}
              variant="primary"
              className="btn btn-primary"
            >
              {dataLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Searching...
                </>
              ) : (
                "Search"
              )}
            </CustomButton>
          </div>
        </form>

        {!hasSearched && (
          <div className="text-center mt-5 p-5 bg-light rounded">
            <img
              src="/assets/filter.svg"
              alt="Select filters"
              className="img-fluid mb-3"
              style={{ maxHeight: '200px' }}
            />
            <p className="text-muted">Please select at least one filter to search students</p>
          </div>
        )}

        {hasSearched && students.length === 0 && (
          <NoData title="No students found" />
        )}

        {students.length > 0 && (
          <div className="mt-4">
            <h2 className="h4 mb-3">Search Results</h2>
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-light">
                  <tr>
                    <th>Profile</th>
                    <th>Name</th>
                    <th>Enrollment No</th>
                    <th>Semester</th>
                    <th>Branch</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student._id}
                      className="cursor-pointer"
                      onClick={() => handleRowClick(student)}
                    >
                      <td>
                        <img
                          src={`${process.env.REACT_APP_MEDIA_LINK}/${student.profile}`}
                          alt={`${student.firstName}'s profile`}
                          className="rounded-circle"
                          style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src =
                              "https://images.unsplash.com/photo-1744315900478-fa44dc6a4e89?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                          }}
                        />
                      </td>
                      <td>
                        {student.firstName} {student.middleName} {student.lastName}
                      </td>
                      <td>{student.enrollmentNo}</td>
                      <td>{student.semester}</td>
                      <td>{student.branchId?.name}</td>
                      <td>{student.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showModal && selectedStudent && (
          <div className="modal fade show d-block bg-dark bg-opacity-50">
            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Student Details</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row mb-4">
                    <div className="col-md-4">
                      <img
                        src={`${process.env.REACT_APP_MEDIA_LINK}/${selectedStudent.profile}`}
                        alt={`${selectedStudent.firstName}'s profile`}
                        className="img-fluid rounded"
                        onError={(e) => {
                          e.target.src =
                            "https://images.unsplash.com/photo-1744315900478-fa44dc6a4e89?q=80&w=3087&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
                        }}
                      />
                    </div>
                    <div className="col-md-8">
                      <h3 className="h5">Personal Information</h3>
                      <div className="row">
                        <div className="col-md-6">
                          <p><strong>Full Name:</strong> {selectedStudent.firstName} {selectedStudent.middleName} {selectedStudent.lastName}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Gender:</strong> {selectedStudent.gender}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Date of Birth:</strong> {new Date(selectedStudent.dob).toLocaleDateString()}</p>
                        </div>
                        <div className="col-md-6">
                          <p><strong>Blood Group:</strong> {selectedStudent.bloodGroup}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">Academic Information</h5>
                          <p><strong>Enrollment No:</strong> {selectedStudent.enrollmentNo}</p>
                          <p><strong>Branch:</strong> {selectedStudent.branchId?.name}</p>
                          <p><strong>Semester:</strong> {selectedStudent.semester}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">Contact Information</h5>
                          <p><strong>Email:</strong> {selectedStudent.email}</p>
                          <p><strong>Phone:</strong> {selectedStudent.phone}</p>
                          <p><strong>Address:</strong> {selectedStudent.address}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">Location Details</h5>
                          <p><strong>City:</strong> {selectedStudent.city}</p>
                          <p><strong>State:</strong> {selectedStudent.state}</p>
                          <p><strong>Pincode:</strong> {selectedStudent.pincode}</p>
                          <p><strong>Country:</strong> {selectedStudent.country}</p>
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="card h-100">
                        <div className="card-body">
                          <h5 className="card-title">Emergency Contact</h5>
                          <p><strong>Name:</strong> {selectedStudent.emergencyContact?.name}</p>
                          <p><strong>Relationship:</strong> {selectedStudent.emergencyContact?.relationship}</p>
                          <p><strong>Phone:</strong> {selectedStudent.emergencyContact?.phone}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <CustomButton
                    onClick={() => setShowModal(false)}
                    variant="secondary"
                    className="btn btn-secondary"
                  >
                    Close
                  </CustomButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentFinder;