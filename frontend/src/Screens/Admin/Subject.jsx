import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";
import { AiOutlineClose } from "react-icons/ai";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import axiosWrapper from "../../utils/AxiosWrapper";
import CustomButton from "../../components/CustomButton";
import { CgDanger } from "react-icons/cg";
import Loading from "../../components/Loading";

const Subject = () => {
  const [subject, setSubject] = useState([]);
  const [branch, setBranch] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [data, setData] = useState({
    name: "",
    code: "",
    branch: "",
    semester: "",
    credits: ""
  });
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    fetchBranches();
    fetchSubjects();
  }, []);

  const fetchBranches = async () => {
    try {
      const response = await axiosWrapper.get("/branch", {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setBranch(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to fetch branches");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchSubjects = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get("/subject", {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setSubject(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to fetch subjects");
    } finally {
      setDataLoading(false);
    }
  };

  const resetForm = () => {
    setShowModal(false);
    setIsEditing(false);
    setSelectedSubjectId(null);
    setData({
      name: "",
      code: "",
      branch: "",
      semester: "",
      credits: ""
    });
  };

  const editSubjectHandler = (item) => {
    setIsEditing(true);
    setSelectedSubjectId(item._id);
    setData({
      name: item.name,
      code: item.code,
      branch: item.branch?._id || "",
      semester: item.semester,
      credits: item.credits
    });
    setShowModal(true);
  };

  const deleteSubjectHandler = (id) => {
    setSelectedSubjectId(id);
    setIsDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      setDataLoading(true);
      await axiosWrapper.delete(`/subject/${selectedSubjectId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      toast.success("Subject deleted successfully");
      fetchSubjects();
    } catch (error) {
      console.error("Error deleting subject:", error);
      toast.error("Failed to delete subject");
    } finally {
      setIsDeleteConfirmOpen(false);
      setDataLoading(false);
    }
  };

  const addSubjectHandler = async () => {
    // Validate form
    if (!data.name || !data.code || !data.branch || !data.semester || !data.credits) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      setDataLoading(true);
      if (isEditing) {
        await axiosWrapper.put(`/subject/${selectedSubjectId}`, data, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        toast.success("Subject updated successfully");
      } else {
        await axiosWrapper.post("/subject", data, {
          headers: { Authorization: `Bearer ${userToken}` }
        });
        toast.success("Subject added successfully");
      }
      resetForm();
      fetchSubjects();
    } catch (error) {
      console.error("Error saving subject:", error);
      toast.error("Failed to save subject");
    } finally {
      setDataLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Heading title="Subject Details" />
        {branch.length > 0 && (
          <CustomButton onClick={() => setShowModal(true)}>
            <IoMdAdd className="fs-4" />
          </CustomButton>
        )}
      </div>
      {dataLoading && <Loading />}

      {!dataLoading && branch.length === 0 && (
        <div className="d-flex justify-content-center align-items-center flex-column w-100 mt-5">
          <CgDanger className="text-warning mb-3" style={{ fontSize: "4rem" }} />
          <p className="text-center fs-5">
            Please add branches before adding a subject.
          </p>
        </div>
      )}

      {!dataLoading && branch.length > 0 && (
        <div className="mt-4 w-100">
          {subject.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No subjects found
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped table-hover">
                <thead className="table-primary">
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Code</th>
                    <th scope="col">Branch</th>
                    <th scope="col">Semester</th>
                    <th scope="col">Credits</th>
                    <th scope="col" className="text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subject &&
                    subject.map((item, index) => (
                      <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.code}</td>
                        <td>{item.branch?.name}</td>
                        <td>{item.semester}</td>
                        <td>{item.credits}</td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-2">
                            <CustomButton
                              variant="secondary"
                              className="p-2"
                              onClick={() => editSubjectHandler(item)}
                            >
                              <MdEdit />
                            </CustomButton>
                            <CustomButton
                              variant="danger"
                              className="p-2"
                              onClick={() => deleteSubjectHandler(item._id)}
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
          )}
        </div>
      )}

      {/* Add/Edit Subject Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">
                  {isEditing ? "Edit Subject" : "Add New Subject"}
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  onClick={resetForm}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label">Subject Name</label>
                    <input
                      type="text"
                      value={data.name}
                      onChange={(e) => setData({ ...data, name: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Subject Code</label>
                    <input
                      type="text"
                      value={data.code}
                      onChange={(e) => setData({ ...data, code: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Branch</label>
                    <select
                      value={data.branch}
                      onChange={(e) => setData({ ...data, branch: e.target.value })}
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
                    <label className="form-label">Semester</label>
                    <select
                      value={data.semester}
                      onChange={(e) => setData({ ...data, semester: e.target.value })}
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

                  <div className="col-12">
                    <label className="form-label">Credits</label>
                    <input
                      type="number"
                      value={data.credits}
                      onChange={(e) => setData({ ...data, credits: e.target.value })}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <CustomButton onClick={resetForm} variant="secondary">
                  Cancel
                </CustomButton>
                <CustomButton
                  onClick={addSubjectHandler}
                  disabled={dataLoading}
                >
                  {isEditing ? "Update Subject" : "Add Subject"}
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
        message="Are you sure you want to delete this subject?"
      />
    </div>
  );
};
export default Subject;