import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import Student from "./Student";
import Faculty from "./Faculty";
import Subjects from "./Subject";
import Admin from "./Admin";
import Branch from "./Branch";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Profile from "./Profile";
import Exam from "../Exam";
import { useNavigate, useLocation } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';

const MENU_ITEMS = [
  { id: "home", label: "Home", component: Profile },
  { id: "student", label: "Student", component: Student },
  { id: "faculty", label: "Faculty", component: Faculty },
  { id: "branch", label: "Branch", component: Branch },
  { id: "notice", label: "Notice", component: Notice },
  { id: "exam", label: "Exam", component: Exam },
  { id: "subjects", label: "Subjects", component: Subjects },
  { id: "admin", label: "Admin", component: Admin },
];

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [profileData, setProfileData] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");

  const fetchUserDetails = async () => {
    setIsLoading(true);
    try {
      toast.loading("Loading user details...");
      const response = await axiosWrapper.get(`/admin/my-details`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.data.success) {
        setProfileData(response.data.data);
        dispatch(setUserData(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Error fetching user details"
      );
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [dispatch, userToken]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const pathMenuId = urlParams.get("page") || "home";
    const validMenu = MENU_ITEMS.find((item) => item.id === pathMenuId);
    setSelectedMenu(validMenu ? validMenu.id : "home");
  }, [location.pathname]);

  const getMenuItemClass = (menuId) => {
    const isSelected = selectedMenu === menuId;
    return `
      text-center px-4 py-2 cursor-pointer
      fw-medium fs-6 w-100
      rounded-3
      transition-all duration-300 ease-in-out
      ${
        isSelected
          ? "bg-primary text-white shadow-lg translate-y-n1"
          : "bg-light text-primary hover:bg-blue-100"
      }
    `;
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="d-flex justify-content-center align-items-center h-100 min-vh-50">Loading...</div>
      );
    }

    const MenuItem = MENU_ITEMS.find(
      (item) => item.id === selectedMenu
    )?.component;

    if (selectedMenu === "home" && profileData) {
      return <Profile profileData={profileData} />;
    }

    return MenuItem && <MenuItem />;
  };

  const handleMenuClick = (menuId) => {
    setSelectedMenu(menuId);
    navigate(`/admin?page=${menuId}`);
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <ul className="nav nav-pills justify-content-evenly gap-3 my-4 px-3">
          {MENU_ITEMS.map((item) => (
            <li key={item.id} className="nav-item flex-grow-1">
              <button
                className={`nav-link w-100 ${selectedMenu === item.id ? 'active' : ''}`}
                onClick={() => handleMenuClick(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="container">
          {renderContent()}
        </div>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};

export default Home;