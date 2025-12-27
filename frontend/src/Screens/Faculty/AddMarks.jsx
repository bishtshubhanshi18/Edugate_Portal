import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axiosWrapper from "../../utils/AxiosWrapper";
import Heading from "../../components/Heading";
import CustomButton from "../../components/CustomButton";
import 'bootstrap/dist/css/bootstrap.min.css';

const AddMarks = () => {
  const [branches, setBranches] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState("");
  const [showSearch, setShowSearch] = useState(true);
  const [masterMarksData, setMasterMarksData] = useState([]);
  const [marksData, setMarksData] = useState({});
  const [consent, setConsent] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const [processLoading, setProcessLoading] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const userToken = localStorage.getItem("token");

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get("/branch", {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setBranches(response.data);
    } catch (error) {
      console.error("Error fetching branches:", error);
      toast.error("Failed to fetch branches");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchSubjects = async (branchId, semester) => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(`/subject/branch/${branchId}/semester/${semester}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setSubjects(response.data);
    } catch (error) {
      console.error("Error fetching subjects:", error);
      toast.error("Failed to fetch subjects");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchExams = async (subjectId) => {
    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(`/exam/subject/${subjectId}`, {
        headers: { Authorization: `Bearer ${userToken}` }
      });
      setExams(response.data);
    } catch (error) {
      console.error("Error fetching exams:", error);
      toast.error("Failed to fetch exams");
    } finally {
      setDataLoading(false);
    }
  };

  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === "semester") {
      setSelectedSemester(value);
      setSelectedSubject(null);
      setSelectedExam(null);
      setSubjects([]);
      setExams([]);
      if (selectedBranch && value) {
        await fetchSubjects(selectedBranch._id, value);
      }
    } else if (name === "branch") {
      const branch = branches.find((b) => b._id === value);
      setSelectedBranch(branch);
      setSelectedSubject(null);
      setSelectedExam(null);
      setSubjects([]);
      setExams([]);
      if (branch && selectedSemester) {
        await fetchSubjects(value, selectedSemester);
      }
    } else if (name === "subject") {
      const subject = subjects.find((s) => s._id === value);
      setSelectedSubject(subject);
      setSelectedExam(null);
      setExams([]);
      if (value) {
        await fetchExams(value);
      }
    } else if (name === "exam") {
      const exam = exams.find((e) => e._id === value);
      setSelectedExam(exam);
    }
  };

  const handleSearch = async () => {
    if (!selectedBranch || !selectedSubject || !selectedExam || !selectedSemester) {
      toast.error("Please select all required fields");
      return;
    }

    try {
      setDataLoading(true);
      const response = await axiosWrapper.get(
        `/student/branch/${selectedBranch._id}/semester/${selectedSemester}`,
        { headers: { Authorization: `Bearer ${userToken}` } }
      );

      if (response.data.length === 0) {
        toast.error("No students found for the selected criteria");
        return;
      }

      setMasterMarksData(response.data);
      setShowSearch(false);
    } catch (error) {
      console.error("Error searching students:", error);
      toast.error("Failed to search students");
    } finally {
      setDataLoading(false);
    }
  };

  const handleBack = () => {
    setShowSearch(true);
    setMasterMarksData([]);
    setMarksData({});
    setConsent(false);
  };

  const handleSubmit = async () => {
    if (!consent) {
      toast.error("Please confirm that all marks are correct");
      return;
    }

    // Validate that all students have marks entered
    const allStudentsHaveMarks = masterMarksData.every(
      (student) => marksData[student._id] && marksData[student._id].trim() !== ""
    );

    if (!allStudentsHaveMarks) {
      toast.error("Please enter marks for all students");
      return;
    }

    try {
      setProcessLoading(true);
      
      // Format the data for submission
      const formattedData = masterMarksData.map((student) => ({
        student: student._id,
        marks: parseFloat(marksData[student._id]),
        exam: selectedExam._id,
        subject: selectedSubject._id
      }));

      await axiosWrapper.post("/marks/bulk", { marks: formattedData }, {
        headers: { Authorization: `Bearer ${userToken}` }
      });

      toast.success("Marks submitted successfully");
      handleBack();
    } catch (error) {
      console.error("Error submitting marks:", error);
      toast.error("Failed to submit marks");
    } finally {
      setProcessLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      setDataLoading(true);
      // Implementation for delete functionality if needed
      toast.success("Record deleted successfully");
    } catch (error) {
      console.error("Error deleting record:", error);
      toast.error("Failed to delete record");
    } finally {
      setIsDeleteConfirmOpen(false);
      setDataLoading(false);
    }
  };

  return (
    <div className="container-fluid mt-4 mb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Heading title="Add Marks" />
      </div>

      {showSearch && (
        <div className="card mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Semester</label>
                <select
                  name="semester"
                  value={selectedSemester || ""}
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
                  value={selectedBranch?._id || ""}
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

              <div className="col-md-3">
                <label className="form-label">Subjects</label>
                <select
                  name="subject"
                  value={selectedSubject?._id || ""}
                  onChange={handleInputChange}
                  disabled={!selectedBranch}
                  className={`form-select ${!selectedBranch ? "bg-light" : ""}`}
                >
                  <option value="">Select Subject</option>
                  {subjects?.map((subject) => (
                    <option key={subject._id} value={subject._id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
                {!selectedBranch && (
                  <small className="text-muted">Please select a branch first</small>
                )}
              </div>

              <div className="col-md-3">
                <label className="form-label">Exam</label>
                <select
                  name="exam"
                  value={selectedExam?._id || ""}
                  onChange={handleInputChange}
                  disabled={!selectedSubject}
                  className={`form-select ${!selectedSubject ? "bg-light" : ""}`}
                >
                  <option value="">Select Exam</option>
                  {exams?.map((exam) => (
                    <option key={exam._id} value={exam._id}>
                      {exam.name}
                    </option>
                  ))}
                </select>
                {!selectedSubject && (
                  <small className="text-muted">Please select a subject first</small>
                )}
              </div>
            </div>

            <div className="d-flex justify-content-center mt-4">
              <CustomButton
                type="submit"
                disabled={
                  dataLoading ||
                  !selectedBranch ||
                  !selectedSubject ||
                  !selectedExam ||
                  !selectedSemester
                }
                variant="primary"
                onClick={handleSearch}
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
          </div>
        </div>
      )}

      {/* Marks Entry Section */}
      {!showSearch && masterMarksData && masterMarksData.length > 0 && (
        <div className="card">
          <div className="card-body">
            <div className="mb-4">
              <div className="row g-3 mb-3">
                <div className="col-md-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="card-subtitle text-muted">Branch and Semester:</h6>
                      <p className="card-text">
                        {selectedBranch?.branchId} - Semester {selectedSemester}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="card-subtitle text-muted">Exam:</h6>
                      <p className="card-text">
                        {selectedExam?.name || "Not Selected"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="card-subtitle text-muted">Exam Type:</h6>
                      <p className="card-text">
                        {selectedExam?.examType === "mid" ? "Mid Term" : "End Term"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="card-subtitle text-muted">Subject:</h6>
                      <p className="card-text">
                        {selectedSubject?.name || "Not Selected"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row g-3">
                <div className="col-md-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="card-subtitle text-muted">Total Marks:</h6>
                      <p className="card-text">
                        {selectedExam?.totalMarks || "Not Selected"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="card-subtitle text-muted">Date:</h6>
                      <p className="card-text">
                        {selectedExam?.date
                          ? new Date(selectedExam.date).toLocaleDateString()
                          : "Not Selected"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="card-subtitle text-muted">Time:</h6>
                      <p className="card-text">
                        {selectedExam?.time || "Not Selected"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h6 className="card-subtitle text-muted">Students:</h6>
                      <p className="card-text">
                        {masterMarksData.length || "Not Selected"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mb-4">
              <CustomButton
                variant="secondary"
                onClick={handleBack}
                className="btn btn-outline-secondary"
              >
                Back to Search
              </CustomButton>
            </div>

            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 mb-4">
              {masterMarksData.map((student) => (
                <div key={student._id} className="col">
                  <div className="input-group">
                    <span className="input-group-text bg-light">
                      {student.enrollmentNo}
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={selectedExam?.totalMarks || 100}
                      className="form-control"
                      value={marksData[student._id] || ""}
                      placeholder="Enter Marks"
                      onChange={(e) =>
                        setMarksData({
                          ...marksData,
                          [student._id]: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="border-top pt-4 mt-4">
              <div className="form-check mb-3">
                <input
                  type="checkbox"
                  id="consent"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="form-check-input"
                />
                <label htmlFor="consent" className="form-check-label">
                  I confirm that all marks entered are correct and verified
                </label>
              </div>

              <CustomButton
                type="submit"
                disabled={dataLoading || !consent}
                variant="primary"
                onClick={handleSubmit}
                className="w-100 btn btn-primary"
              >
                {dataLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Marks"
                )}
              </CustomButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMarks;