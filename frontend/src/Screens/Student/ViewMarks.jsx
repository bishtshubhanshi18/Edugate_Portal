import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import 'bootstrap/dist/css/bootstrap.min.css';

const ViewMarks = () => {
  const userData = useSelector((state) => state.userData);
  const [dataLoading, setDataLoading] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState(
    userData?.semester || 1
  );
  const [marks, setMarks] = useState([]);
  const userToken = localStorage.getItem("userToken");

  const fetchMarks = async (semester) => {
    setDataLoading(true);
    toast.loading("Loading marks...");
    try {
      const response = await axiosWrapper.get(
        `/marks/student?semester=${semester}`,
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );

      if (response.data.success) {
        setMarks(response.data.data);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error fetching marks");
    } finally {
      setDataLoading(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    fetchMarks(userData?.semester || 1);
  }, []);

  const handleSemesterChange = (e) => {
    const semester = e.target.value;
    setSelectedSemester(semester);
    fetchMarks(semester);
  };

  const midTermMarks = marks.filter((mark) => mark.examId.examType === "mid");
  const endTermMarks = marks.filter((mark) => mark.examId.examType === "end");

  return (
    <div className="container-fluid mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Heading title="View Marks" />
        <div className="d-flex align-items-center gap-3">
          <label className="form-label mb-0">Semester:</label>
          <select
            value={selectedSemester || ""}
            onChange={handleSemesterChange}
            className="form-select"
            style={{ width: "150px" }}
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
              <option key={sem} value={sem}>
                Semester {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="card-title h5 mb-4">Mid Term Marks</h3>
              {dataLoading ? (
                <p className="text-muted">Loading...</p>
              ) : midTermMarks.length > 0 ? (
                <div className="d-grid gap-3">
                  {midTermMarks.map((mark) => (
                    <div
                      key={mark._id}
                      className="card border-0 shadow-sm hover-shadow transition-all"
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="card-subtitle mb-1 fw-bold">
                              {mark.subjectId.name}
                            </h6>
                            <p className="card-text text-muted small mb-0">
                              {mark.examId.name}
                            </p>
                          </div>
                          <div className="text-end">
                            <h5 className="card-title text-primary mb-1">
                              {mark.marksObtained}
                            </h5>
                            <p className="card-text text-muted small mb-0">
                              out of {mark.examId.totalMarks}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No mid term marks available</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <h3 className="card-title h5 mb-4">End Term Marks</h3>
              {dataLoading ? (
                <p className="text-muted">Loading...</p>
              ) : endTermMarks.length > 0 ? (
                <div className="d-grid gap-3">
                  {endTermMarks.map((mark) => (
                    <div
                      key={mark._id}
                      className="card border-0 shadow-sm hover-shadow transition-all"
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <h6 className="card-subtitle mb-1 fw-bold">
                              {mark.subjectId.name}
                            </h6>
                            <p className="card-text text-muted small mb-0">
                              {mark.examId.name}
                            </p>
                          </div>
                          <div className="text-end">
                            <h5 className="card-title text-primary mb-1">
                              {mark.marksObtained}
                            </h5>
                            <p className="card-text text-muted small mb-0">
                              out of {mark.examId.totalMarks}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted">No end term marks available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewMarks;