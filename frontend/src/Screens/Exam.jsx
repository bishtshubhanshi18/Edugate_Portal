import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import axiosWrapper from "../utils/AxiosWrapper";
import Heading from "../components/Heading";
import DeleteConfirm from "../components/DeleteConfirm";
import CustomButton from "../components/CustomButton";
import { FiUpload } from "react-icons/fi";
import { useSelector } from "react-redux";
import Loading from "../components/Loading";

const Exam = () => {
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [data, setData] = useState({
    name: "",
    date: "",
    semester: "",
    examType: "mid",
    totalMarks: ""
  });
  
  const { loginType } = useSelector((state) => state.auth);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    setDataLoading(true);
    try {
      const response = await axiosWrapper.get("/exam", {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      setExams(response.data);
    } catch (error) {
      toast.error("Failed to fetch exams");
    } finally {
      setDataLoading(false);
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedExamId(null);
    setFile(null);
    setData({
      name: "",
      date: "",
      semester: "",
      examType: "mid",
      totalMarks: ""
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const editExamHandler = (exam) => {
    setIsEditing(true);
    setSelectedExamId(exam._id);
    setData({
      name: exam.name,
      date: new Date(exam.date).toISOString().split('T')[0],
      semester: exam.semester,
      examType: exam.examType,
      totalMarks: exam.totalMarks
    });
    setShowModal(true);
  };

  const deleteExamHandler = (id) => {
    setSelectedExamId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axiosWrapper.delete(`/exam/${selectedExamId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      toast.success("Exam deleted successfully");
      fetchExams();
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      toast.error("Failed to delete exam");
    }
  };

  const addExamHandler = async () => {
    if (!data.name || !data.date || !data.semester || !data.examType || !data.totalMarks) {
      toast.error("Please fill all required fields");
      return;
    }

    setProcessLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("date", data.date);
      formData.append("semester", data.semester);
      formData.append("examType", data.examType);
      formData.append("totalMarks", data.totalMarks);
      
      if (file) {
        formData.append("file", file);
      }

      if (isEditing) {
        await axiosWrapper.put(`/exam/${selectedExamId}`, formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data"
          }
        });
        toast.success("Exam updated successfully");
      } else {
        await axiosWrapper.post("/exam", formData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data"
          }
        });
        toast.success("Exam added successfully");
      }
      
      resetForm();
      fetchExams();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process exam");
    } finally {
      setProcessLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Heading title="Exam Details" />
        {!dataLoading && loginType !== "Student" && (
          <CustomButton onClick={() => setShowModal(true)}>
            <IoMdAdd className="fs-4" />
          </CustomButton>
        )}
      </div>

      {!dataLoading ? (
        <div className="mt-4 table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th scope="col">Exam Name</th>
                <th scope="col">Date</th>
                <th scope="col">Semester</th>
                <th scope="col">Exam Type</th>
                <th scope="col">Total Marks</th>
                {loginType !== "Student" && (
                  <th scope="col" className="text-center">Actions</th>
                )}
              </tr>
            </thead>
            <tbody>
              {exams && exams.length > 0 ? (
                exams.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>{item.semester}</td>
                    <td>{item.examType === "mid" ? "Mid Term" : "End Term"}</td>
                    <td>{item.totalMarks}</td>
                    {loginType !== "Student" && (
                      <td className="text-center">
                        <div className="d-flex justify-content-center gap-2">
                          <CustomButton
                            variant="secondary"
                            className="p-2"
                            onClick={() => editExamHandler(item)}
                          >
                            <MdEdit />
                          </CustomButton>
                          <CustomButton
                            variant="danger"
                            className="p-2"
                            onClick={() => deleteExamHandler(item._id)}
                          >
                            <MdOutlineDelete />
                          </CustomButton>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={loginType !== "Student" ? 6 : 5} className="text-center py-4">
                    No Exams found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <Loading />
      )}

      {/* Add/Edit Exam Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">
                  {isEditing ? "Edit Exam" : "Add New Exam"}
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetForm}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Exam Name</label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                    className="form-control"
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      value={data.date}
                      onChange={(e) => setData({ ...data, date: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Semester</label>
                    <select
                      name="semester"
                      value={data.semester}
                      onChange={(e) => setData({ ...data, semester: e.target.value })}
                      className="form-select"
                      required
                    >
                      <option value="">Select Semester</option>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                        <option key={sem} value={sem}>Semester {sem}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Exam Type</label>
                    <select
                      value={data.examType}
                      onChange={(e) => setData({ ...data, examType: e.target.value })}
                      className="form-select"
                      required
                    >
                      <option value="mid">Mid Term</option>
                      <option value="end">End Term</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Total Marks</label>
                    <input
                      type="number"
                      value={data.totalMarks}
                      onChange={(e) => setData({ ...data, totalMarks: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Timetable File</label>
                  <div className="d-flex align-items-center gap-3">
                    <label className="flex-grow-1">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FiUpload className="me-2" />
                          {file ? file.name : "Choose File"}
                        </span>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="form-control d-none"
                          required={!isEditing}
                        />
                      </div>
                    </label>
                    {file && (
                      <CustomButton
                        onClick={() => setFile(null)}
                        variant="danger"
                        className="p-2"
                      >
                        <AiOutlineClose size={20} />
                      </CustomButton>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <CustomButton onClick={resetForm} variant="secondary">
                  Cancel
                </CustomButton>
                <CustomButton
                  onClick={addExamHandler}
                  disabled={processLoading}
                >
                  {isEditing ? "Update Exam" : "Add Exam"}
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this exam?"
      />
    </div>
  );
};

export default Exam;