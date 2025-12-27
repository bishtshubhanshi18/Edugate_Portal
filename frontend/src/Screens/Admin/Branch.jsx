import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { MdOutlineDelete, MdEdit } from "react-icons/md";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import DeleteConfirm from "../../components/DeleteConfirm";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";
import 'bootstrap/dist/css/bootstrap.min.css';

const Branch = () => {
  const [data, setData] = useState({
    name: "",
    branchId: "",
  });
  const [branch, setBranch] = useState();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [selectedBranchId, setSelectedBranchId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);

  useEffect(() => {
    getBranchHandler();
  }, []);

  const getBranchHandler = async () => {
    setDataLoading(true);
    try {
      const response = await axiosWrapper.get(`/branch`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      if (response.data.success) {
        setBranch(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setBranch([]);
        return;
      }
      console.error(error);
      toast.error(error.response?.data?.message || "Error fetching branches");
    } finally {
      setDataLoading(false);
    }
  };

  const addBranchHandler = async () => {
    if (!data.name || !data.branchId) {
      toast.dismiss();
      toast.error("Please fill all the fields");
      return;
    }
    try {
      toast.loading(isEditing ? "Updating Branch" : "Adding Branch");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      };
      let response;
      if (isEditing) {
        response = await axiosWrapper.patch(
          `/branch/${selectedBranchId}`,
          data,
          {
            headers: headers,
          }
        );
      } else {
        response = await axiosWrapper.post(`/branch`, data, {
          headers: headers,
        });
      }
      toast.dismiss();
      if (response.data.success) {
        toast.success(response.data.message);
        setData({ name: "", branchId: "" });
        setShowAddForm(false);
        setIsEditing(false);
        setSelectedBranchId(null);
        getBranchHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };

  const deleteBranchHandler = async (id) => {
    setIsDeleteConfirmOpen(true);
    setSelectedBranchId(id);
  };

  const editBranchHandler = (branch) => {
    setData({
      name: branch.name,
      branchId: branch.branchId,
    });
    setSelectedBranchId(branch._id);
    setIsEditing(true);
    setShowAddForm(true);
  };

  const confirmDelete = async () => {
    try {
      toast.loading("Deleting Branch");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      };
      const response = await axiosWrapper.delete(
        `/branch/${selectedBranchId}`,
        {
          headers: headers,
        }
      );
      toast.dismiss();
      if (response.data.success) {
        toast.success("Branch has been deleted successfully");
        setIsDeleteConfirmOpen(false);
        getBranchHandler();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="container-fluid mt-4 mb-5 position-relative">
      <Heading title="Branch Details" />
      <CustomButton
        onClick={() => {
          setShowAddForm(!showAddForm);
          if (!showAddForm) {
            setData({ name: "", branchId: "" });
            setIsEditing(false);
            setSelectedBranchId(null);
          }
        }}
        className="fixed-bottom end-0 mb-4 me-4 rounded-circle p-3"
      >
        {showAddForm ? (
          <IoMdClose className="fs-4" />
        ) : (
          <IoMdAdd className="fs-4" />
        )}
      </CustomButton>

      {dataLoading && <Loading />}

      {showAddForm && (
        <div className="modal show d-block bg-dark bg-opacity-50" style={{ zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-semibold">
                  {isEditing ? "Edit Branch" : "Add New Branch"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddForm(false)}
                  aria-label="Close"
                ></button>
              </div>

              <form onSubmit={addBranchHandler} className="modal-body">
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Branch Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={data.name}
                    onChange={(e) => setData({ ...data, name: e.target.value })}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="branchId" className="form-label">
                    Branch ID
                  </label>
                  <input
                    type="text"
                    id="branchId"
                    className="form-control"
                    value={data.branchId}
                    onChange={(e) =>
                      setData({ ...data, branchId: e.target.value })
                    }
                  />
                </div>

                <div className="modal-footer border-top pt-3">
                  <CustomButton
                    variant="secondary"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </CustomButton>
                  <CustomButton variant="primary" onClick={addBranchHandler}>
                    {isEditing ? "Update" : "Add"}
                  </CustomButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {!dataLoading && (
        <div className="mt-4 table-responsive">
          <table className="table table-striped table-hover">
            <thead className="table-primary">
              <tr>
                <th scope="col">Branch Name</th>
                <th scope="col">Branch ID</th>
                <th scope="col">Created At</th>
                <th scope="col" className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {branch && branch.length > 0 ? (
                branch.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.branchId}</td>
                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <CustomButton
                          variant="secondary"
                          className="p-2"
                          onClick={() => editBranchHandler(item)}
                        >
                          <MdEdit />
                        </CustomButton>
                        <CustomButton
                          variant="danger"
                          className="p-2"
                          onClick={() => deleteBranchHandler(item._id)}
                        >
                          <MdOutlineDelete />
                        </CustomButton>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No branches found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <DeleteConfirm
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={confirmDelete}
        message="Are you sure you want to delete this branch?"
      />
    </div>
  );
};

export default Branch;