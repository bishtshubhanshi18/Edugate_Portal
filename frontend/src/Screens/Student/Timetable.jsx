import axios from "axios";
import React, { useEffect, useState } from "react";
import { FiDownload } from "react-icons/fi";
import Heading from "../../components/Heading";
import { useSelector } from "react-redux";
import axiosWrapper from "../../utils/AxiosWrapper";
import { toast } from "react-hot-toast";
import Loading from "../../components/Loading";
import 'bootstrap/dist/css/bootstrap.min.css';

const Timetable = () => {
  const [timetable, setTimetable] = useState("");
  const userData = useSelector((state) => state.userData);
  const [dataLoading, setDataLoading] = useState(false);

  useEffect(() => {
    const getTimetable = async () => {
      try {
        setDataLoading(true);
        const response = await axiosWrapper.get(
          `/timetable?semester=${userData.semester}&branch=${userData.branchId?._id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            },
          }
        );
        if (response.data.success && response.data.data.length > 0) {
          setTimetable(response.data.data[0].link);
        } else {
          setTimetable("");
        }
      } catch (error) {
        if (error && error.response && error.response.status === 404) {
          setTimetable("");
          return;
        }
        toast.error(
          error.response?.data?.message || "Error fetching timetable"
        );
        console.error(error);
      } finally {
        setDataLoading(false);
      }
    };
    userData && getTimetable();
  }, [userData, userData.branchId, userData.semester]);

  return (
    <div className="container-fluid mt-4 d-flex flex-column align-items-start mb-4">
      <div className="d-flex justify-content-between align-items-center w-100">
        <Heading title={`Timetable of Semester ${userData.semester}`} />
        {!dataLoading && timetable && (
          <p
            className="d-flex align-items-center fs-5 fw-medium cursor-pointer text-decoration-none download-link"
            onClick={() =>
              window.open(process.env.REACT_APP_MEDIA_LINK + "/" + timetable)
            }
          >
            Download
            <span className="ms-2">
              <FiDownload />
            </span>
          </p>
        )}
      </div>
      {dataLoading && <Loading />}
      {!dataLoading && timetable && (
        <img
          className="mt-4 rounded-3 shadow w-70 mx-auto img-fluid"
          src={process.env.REACT_APP_MEDIA_LINK + "/" + timetable}
          alt="timetable"
        />
      )}
      {!dataLoading && !timetable && (
        <p className="mt-4 fs-5">No Timetable Available At The Moment!</p>
      )}
      
      {/* Add this CSS in your stylesheet */}
      <style jsx>{`
        .w-70 {
          width: 70%;
        }
        .download-link {
          color: inherit;
          transition: all 0.2s ease;
        }
        .download-link:hover {
          color: #dc3545 !important;
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default Timetable;