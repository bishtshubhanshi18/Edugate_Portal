import React, { useEffect, useState } from "react";
import { FiUpload, FiEdit2, FiTrash2 } from "react-icons/fi";
import Heading from "../../components/Heading";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import { MdLink } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

const Material = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    branch: "",
    semester: "",
    type: "notes"
  });
  const [subjects, setSubjects] = useState([]);
  const [branches, setBranches] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedMaterialId, setSelectedMaterialId] = useState(null);
  const [file, setFile] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const [filters, setFilters] = useState({
    subject: "",
    branch: "",
    semester: "",
    type: ""
  });
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    fetchSubjects();
    fetchBranches();
    fetchMaterials();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axiosWrapper.get("/subject", {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      setSubjects(response.data);
    } catch (error) {
      toast.error("Failed to fetch subjects");
    }
  };

  const fetchBranches = async () => {
    try {
      const response = await axiosWrapper.get("/branch", {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      setBranches(response.data);
    } catch (error) {
      toast.error("Failed to fetch branches");
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axiosWrapper.get("/material", {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      setMaterials(response.data);
    } catch (error) {
      toast.error("Failed to fetch materials");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      branch: "",
      semester: "",
      type: "notes"
    });
    setFile(null);
    setEditingMaterial(null);
  };

  const handleEdit = (material) => {
    setEditingMaterial(material);
    setFormData({
      title: material.title,
      description: material.description || "",
      subject: material.subject._id,
      branch: material.branch._id,
      semester: material.semester,
      type: material.type
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setDataLoading(true);

    try {
      const materialData = new FormData();
      materialData.append("title", formData.title);
      materialData.append("description", formData.description);
      materialData.append("subject", formData.subject);
      materialData.append("branch", formData.branch);
      materialData.append("semester", formData.semester);
      materialData.append("type", formData.type);

      if (file) {
        materialData.append("file", file);
      }

      if (editingMaterial) {
        // Update existing material
        await axiosWrapper.put(`/material/${editingMaterial._id}`, materialData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data"
          }
        });
        toast.success("Material updated successfully");
      } else {
        // Add new material
        await axiosWrapper.post("/material", materialData, {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "multipart/form-data"
          }
        });
        toast.success("Material added successfully");
      }

      setShowModal(false);
      resetForm();
      fetchMaterials();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to process material");
    } finally {
      setDataLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axiosWrapper.delete(`/material/${selectedMaterialId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`
        }
      });
      toast.success("Material deleted successfully");
      fetchMaterials();
      setIsDeleteConfirmOpen(false);
    } catch (error) {
      toast.error("Failed to delete material");
    }
  };

  return (
    <div className="container-fluid mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Heading title="Material Management" />
        <CustomButton onClick={() => setShowModal(true)}>
          <IoMdAdd className="fs-4" />
        </CustomButton>
      </div>

      {/* Filters */}
      <div className="mb-4">
        <div className="row g-3">
          <div className="col-md-6 col-lg-3">
            <label className="form-label">Filter by Subject</label>
            <select
              name="subject"
              value={filters.subject}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Subjects</option>
              {subjects.map((subject) => (
                <option key={subject._id} value={subject._id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 col-lg-3">
            <label className="form-label">Filter by Branch</label>
            <select
              name="branch"
              value={filters.branch}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Branches</option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 col-lg-3">
            <label className="form-label">Filter by Semester</label>
            <select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6 col-lg-3">
            <label className="form-label">Filter by Type</label>
            <select
              name="type"
              value={filters.type}
              onChange={handleFilterChange}
              className="form-select"
            >
              <option value="">All Types</option>
              <option value="notes">Notes</option>
              <option value="assignment">Assignment</option>
              <option value="syllabus">Syllabus</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="table-responsive">
        {materials.length === 0 ? (
          <div className="text-center py-5 text-muted">
            No materials found
          </div>
        ) : (
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th>File</th>
                <th>Title</th>
                <th>Subject</th>
                <th>Semester</th>
                <th>Branch</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((material) => (
                <tr key={material._id}>
                  <td>
                    <CustomButton
                      variant="primary"
                      onClick={() => {
                        window.open(
                          `${process.env.REACT_APP_MEDIA_LINK}/${material.file}`
                        );
                      }}
                    >
                      <MdLink className="fs-5" />
                    </CustomButton>
                  </td>
                  <td>{material.title}</td>
                  <td>{material.subject.name}</td>
                  <td>{material.semester}</td>
                  <td>{material.branch.name}</td>
                  <td className="text-capitalize">{material.type}</td>
                  <td>
                    <div className="d-flex gap-2">
                      <CustomButton
                        variant="secondary"
                        onClick={() => handleEdit(material)}
                      >
                        <FiEdit2 />
                      </CustomButton>
                      <CustomButton
                        variant="danger"
                        onClick={() => {
                          setSelectedMaterialId(material._id);
                          setIsDeleteConfirmOpen(true);
                        }}
                      >
                        <FiTrash2 />
                      </CustomButton>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Material Modal */}
      {showModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h2 className="modal-title fs-5">
                  {editingMaterial ? "Edit Material" : "Add New Material"}
                </h2>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmit} className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="form-control"
                    required
                  />
                </div>

                <div className="row g-3 mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Subject</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select Subject</option>
                      {subjects.map((subject) => (
                        <option key={subject._id} value={subject._id}>
                          {subject.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Branch</label>
                    <select
                      name="branch"
                      value={formData.branch}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select Branch</option>
                      {branches.map((branch) => (
                        <option key={branch._id} value={branch._id}>
                          {branch.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Semester</label>
                    <select
                      name="semester"
                      value={formData.semester}
                      onChange={handleInputChange}
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
                    <label className="form-label">Type</label>
                    <select
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="form-select"
                      required
                    >
                      <option value="notes">Notes</option>
                      <option value="assignment">Assignment</option>
                      <option value="syllabus">Syllabus</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Material File</label>
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
                          required={!editingMaterial}
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

                <div className="modal-footer">
                  <CustomButton
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    variant="secondary"
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton type="submit" disabled={dataLoading}>
                    {dataLoading
                      ? "Processing..."
                      : editingMaterial
                      ? "Update Material"
                      : "Add Material"}
                  </CustomButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this material? This action cannot be undone."
      />
    </div>
  );
};

export default Material;