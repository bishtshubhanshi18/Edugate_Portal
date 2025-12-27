import React, { useEffect, useState } from "react";
import { IoMdLink, IoMdAdd, IoMdClose } from "react-icons/io";
import { HiOutlineCalendar } from "react-icons/hi";
import { useLocation, useNavigate } from "react-router-dom";
import { MdDeleteOutline, MdEditNote } from "react-icons/md";
import toast from "react-hot-toast";
import Heading from "../components/Heading";
import axiosWrapper from "../utils/AxiosWrapper";
import CustomButton from "../components/CustomButton";
import DeleteConfirm from "../components/DeleteConfirm";
import Loading from "../components/Loading";

const Notice = () => {
  const router = useLocation();
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedNoticeId, setSelectedNoticeId] = useState(null);
  const [dataLoading, setDataLoading] = useState(false);
  const token = localStorage.getItem("userToken");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "student",
    link: "",
  });

  useEffect(() => {
    if (!token) {
      toast.error("Please login to continue");
      navigate("/login");
    }
  }, [token, navigate]);

  const getNotices = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get("/notice", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.data.success) {
        setNotices(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setNotices([]);
      } else {
        toast.error(error.response?.data?.message || "Failed to load notices");
      }
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    getNotices();
  }, [router.pathname]);

  const openAddModal = () => {
    setEditingNotice(null);
    setFormData({
      title: "",
      description: "",
      type: "student",
      link: "",
    });
    setShowAddModal(true);
  };

  const handleEdit = (notice) => {
    setEditingNotice(notice);
    setFormData({
      title: notice.title || "",
      description: notice.description || "",
      type: notice.type || "student",
      link: notice.link || "",
    });
    setShowAddModal(true);
  };

  const handleSubmitNotice = async (e) => {
    e.preventDefault();
    const { title, description, type } = formData;

    if (!title || !description || !type) {
      toast.dismiss();
      toast.error("Please fill all the fields");
      return;
    }

    try {
      toast.loading(editingNotice ? "Updating Notice" : "Adding Notice");

      const response = await axiosWrapper[editingNotice ? "put" : "post"](
        `/notice${editingNotice ? `/${editingNotice._id}` : ""}`,
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        getNotices();
        setShowAddModal(false);
        setEditingNotice(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleDelete = async () => {
    try {
      toast.loading("Deleting Notice");
      const response = await axiosWrapper.delete(
        `/notice/${selectedNoticeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.dismiss();
      if (response.data.success) {
        toast.success("Notice deleted successfully");
        setIsDeleteConfirmOpen(false);
        getNotices();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to delete notice");
    }
  };

  return (
    <div className="container-fluid my-4">
      <div className="d-flex justify-content-between align-items-center mb-4 position-relative">
        <Heading title="Notices" />
        {!dataLoading &&
          (router.pathname === "/faculty" || router.pathname === "/admin") && (
            <CustomButton onClick={openAddModal}>
              <IoMdAdd className="fs-4" />
            </CustomButton>
          )}
      </div>

      {dataLoading && <Loading />}

      {!dataLoading && (
        <div className="mt-4">
          {notices.length === 0 ? (
            <div className="text-center py-5 text-muted">
              No notices found
            </div>
          ) : (
            <div className="row g-4">
              {notices?.map((notice) => (
                <div key={notice._id} className="col-md-6 col-lg-4">
                  <div className="card h-100 border-0 shadow-sm hover-shadow">
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 
                          className={`card-title mb-0 ${notice.link ? "cursor-pointer hover-text-primary" : ""}`}
                          onClick={() => notice.link && window.open(notice.link)}
                        >
                          {notice.title}
                          {notice.link && (
                            <IoMdLink className="ms-2 fs-5 opacity-75 hover-opacity-100 hover-text-primary" />
                          )}
                        </h5>
                        {(router.pathname === "/faculty" ||
                          router.pathname === "/admin") && (
                          <div className="d-flex gap-2 ms-2">
                            <CustomButton
                              onClick={() => {
                                setSelectedNoticeId(notice._id);
                                setIsDeleteConfirmOpen(true);
                              }}
                              variant="danger"
                              className="p-2 rounded-circle"
                              title="Delete Notice"
                            >
                              <MdDeleteOutline size={18} />
                            </CustomButton>
                            <CustomButton
                              onClick={() => handleEdit(notice)}
                              variant="secondary"
                              className="p-2 rounded-circle"
                              title="Edit Notice"
                            >
                              <MdEditNote size={18} />
                            </CustomButton>
                          </div>
                        )}
                      </div>

                      <p className="card-text text-muted small mb-4 line-clamp-3">
                        {notice.description}
                      </p>

                      <div className="d-flex justify-content-between align-items-center small text-muted">
                        <div className="d-flex align-items-center">
                          <HiOutlineCalendar className="me-1" />
                          {new Date(notice.createdAt).toLocaleString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                        </div>
                        {notice.type !== "both" && (
                          <span className="badge bg-primary bg-opacity-10 text-primary">
                            {notice.type === "student" ? "Student" : "Faculty"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal UI */}
      {showAddModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editingNotice ? "Edit Notice" : "Add New Notice"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingNotice(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleSubmitNotice} className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Notice Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Notice Description</label>
                  <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Notice Link (Optional)</label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) =>
                      setFormData({ ...formData, link: e.target.value })
                    }
                    className="form-control"
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Type Of Notice</label>
                  <select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                    className="form-select"
                  >
                    <option value="">Select Type</option>
                    <option value="student">Student</option>
                    <option value="faculty">Faculty</option>
                    <option value="both">Both</option>
                  </select>
                </div>

                <div className="modal-footer border-top-0">
                  <CustomButton
                    variant="secondary"
                    onClick={() => {
                      setShowAddModal(false);
                      setEditingNotice(null);
                    }}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton type="submit" variant="primary">
                    {editingNotice ? "Update" : "Add"}
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
        message="Are you sure you want to delete this notice?"
      />
    </div>
  );
};

export default Notice;