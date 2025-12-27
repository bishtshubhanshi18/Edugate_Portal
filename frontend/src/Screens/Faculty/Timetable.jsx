import React, { useEffect, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { MdOutlineDelete, MdEdit, MdViewComfy, MdLink } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import Heading from "../../components/Heading";
import { AiOutlineClose } from "react-icons/ai";
import toast from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";

const AddTimetableModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  branches,
}) => {
  const [formData, setFormData] = useState({
    branch: initialData?.branch || "",
    semester: initialData?.semester || "",
    file: null,
    previewUrl: initialData?.file || "",
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({
      ...formData,
      file,
      previewUrl: URL.createObjectURL(file),
    });
  };

  const handleSubmit = () => {
    onSubmit(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title fs-5">
              {initialData ? "Edit Timetable" : "Add New Timetable"}
            </h2>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Branch</label>
              <select
                value={formData.branch}
                onChange={(e) =>
                  setFormData({ ...formData, branch: e.target.value })
                }
                className="form-select"
              >
                <option value="">Select Branch</option>
                {branches?.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Semester</label>
              <select
                value={formData.semester}
                onChange={(e) =>
                  setFormData({ ...formData, semester: e.target.value })
                }
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

            <div className="mb-3">
              <label className="form-label">Timetable File</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-control"
              />
            </div>

            {formData.previewUrl && (
              <div className="mt-3">
                <img
                  src={formData.previewUrl}
                  alt="Preview"
                  className="img-fluid"
                />
              </div>
            )}
          </div>
          <div className="modal-footer">
            <CustomButton variant="secondary" onClick={onClose}>
              Cancel
            </CustomButton>
            <CustomButton variant="primary" onClick={handleSubmit}>
              {initialData ? "Update" : "Add"}
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

const Timetable = () => {
  const [branch, setBranch] = useState();
  const [timetables, setTimetables] = useState([]);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedTimetableId, setSelectedTimetableId] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState(null);
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    getBranchHandler();
    getTimetablesHandler();
  }, []);

  const getBranchHandler = async () => {
    try {
      const response = await axiosWrapper.get("/branch", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setBranch(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching branches");
    }
  };

  const getTimetablesHandler = async () => {
    try {
      const response = await axiosWrapper.get("/timetable", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setTimetables(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching timetables");
    }
  };

  const handleSubmitTimetable = async (formData) => {
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${userToken}`,
    };

    const submitData = new FormData();
    submitData.append("branch", formData.branch);
    submitData.append("semester", formData.semester);
    if (formData.file) {
      submitData.append("file", formData.file);
    }

    try {
      toast.loading(
        editingTimetable ? "Updating Timetable" : "Adding Timetable"
      );

      let response;
      if (editingTimetable) {
        response = await axiosWrapper.put(
          `/timetable/${editingTimetable._id}`,
          submitData,
          { headers }
        );
      } else {
        response = await axiosWrapper.post("/timetable", submitData, {
          headers,
        });
      }

      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        getTimetablesHandler();
        setShowAddModal(false);
        setEditingTimetable(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error with timetable");
    }
  };

  const deleteTimetableHandler = async (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedTimetableId(id);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Timetable");
      const response = await axiosWrapper.delete(
        `/timetable/${selectedTimetableId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      toast.dismiss();
      if (response.data.success) {
        toast.success("Timetable deleted successfully");
        setIsDeleteConfirmOpen(false);
        getTimetablesHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error deleting timetable");
    }
  };

  const editTimetableHandler = (timetable) => {
    setEditingTimetable(timetable);
    setShowAddModal(true);
  };

  return (
    <div className="container-fluid mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Heading title="Timetable Management" />
        <CustomButton onClick={() => setShowAddModal(true)}>
          <IoMdAdd className="fs-4" />
        </CustomButton>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-primary">
            <tr>
              <th>View</th>
              <th>Branch</th>
              <th>Semester</th>
              <th>Created At</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {timetables.map((item, index) => (
              <tr key={index}>
                <td>
                  <a
                    className="fs-5 text-decoration-none"
                    href={`${process.env.REACT_APP_MEDIA_LINK}/${item.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <MdLink />
                  </a>
                </td>
                <td>{item.branch.name}</td>
                <td>{item.semester}</td>
                <td>
                  {new Date(item.createdAt).toLocaleDateString()}
                </td>
                <td className="text-center">
                  <div className="d-flex justify-content-center gap-2">
                    <CustomButton
                      variant="secondary"
                      onClick={() => editTimetableHandler(item)}
                    >
                      <MdEdit />
                    </CustomButton>
                    <CustomButton
                      variant="danger"
                      onClick={() => deleteTimetableHandler(item._id)}
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

      <AddTimetableModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingTimetable(null);
        }}
        onSubmit={handleSubmitTimetable}
        initialData={editingTimetable}
        branches={branch}
      />

      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this timetable?"
      />
    </div>
  );
};

export default Timetable;