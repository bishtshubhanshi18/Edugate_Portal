import React, { useEffect, useState } from "react";
import { MdLink } from "react-icons/md";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import axiosWrapper from "../../utils/AxiosWrapper";
import toast from "react-hot-toast";
import CustomButton from "../../components/CustomButton";
import Loading from "../../components/Loading";
import 'bootstrap/dist/css/bootstrap.min.css';

const Material = () => {
  const [materials, setMaterials] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [dataLoading, setDataLoading] = useState(false);
  const userData = useSelector((state) => state.userData);
  const [filters, setFilters] = useState({
    subject: "",
    type: "",
  });

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [filters]);

  const fetchSubjects = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(
        `/subject?semester=${userData.semester}&branch=${userData.branchId._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      if (response.data.success) {
        setSubjects(response.data.data);
      }
    } catch (error) {
      if (error && error.response && error.response.status === 404) {
        setSubjects([]);
        return;
      }
      toast.error(error?.response?.data?.message || "Failed to load subjects");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchMaterials = async () => {
    try {
      setDataLoading(true);
      const queryParams = new URLSearchParams({
        semester: userData.semester,
        branch: userData.branchId._id,
      });

      if (filters.subject) queryParams.append("subject", filters.subject);
      if (filters.type) queryParams.append("type", filters.type);

      const response = await axiosWrapper.get(`/material?${queryParams}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      });
      if (response.data.success) {
        setMaterials(response.data.data);
      }
    } catch (error) {
      if (error && error.response && error.response.status === 404) {
        setMaterials([]);
        return;
      }
      toast.error(error?.response?.data?.message || "Failed to load materials");
    } finally {
      setDataLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container-fluid mt-4 mb-5">
      <Heading title="Study Materials" />

      {!dataLoading && (
        <div className="mt-3">
          <div className="row g-3">
            <div className="col-md-6">
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

            <div className="col-md-6">
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
      )}

      {dataLoading && <Loading />}

      {!dataLoading && (
        <div className="mt-4 table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-primary">
              <tr>
                <th>File</th>
                <th>Title</th>
                <th>Subject</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {materials && materials.length > 0 ? (
                materials.map((material) => (
                  <tr key={material._id}>
                    <td>
                      <CustomButton
                        variant="primary"
                        onClick={() => {
                          window.open(
                            `${process.env.REACT_APP_MEDIA_LINK}/${material.file}`
                          );
                        }}
                        className="p-2"
                      >
                        <MdLink className="fs-5" />
                      </CustomButton>
                    </td>
                    <td>{material.title}</td>
                    <td>{material.subject.name}</td>
                    <td className="text-capitalize">{material.type}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No materials found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Material;