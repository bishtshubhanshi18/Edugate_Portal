import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { toast, Toaster } from "react-hot-toast";
import Notice from "../Notice";
import { useDispatch } from "react-redux";
import { setUserData } from "../../redux/actions";
import axiosWrapper from "../../utils/AxiosWrapper";
import Timetable from "./Timetable";
import Material from "./Material";
import StudentFinder from "./StudentFinder";
import Profile from "./Profile";
import Marks from "./AddMarks";
import Exam from "../Exam";

const MENU_ITEMS = [
  { id: "home", label: "Home", component: null },
  { id: "timetable", label: "Timetable", component: Timetable },
  { id: "material", label: "Material", component: Material },
  { id: "notice", label: "Notice", component: Notice },
  { id: "student info", label: "Student Info", component: StudentFinder },
  { id: "marks", label: "Marks", component: Marks },
  { id: "exam", label: "Exam", component: Exam },
];

const Home = () => {
  const [selectedMenu, setSelectedMenu] = useState("Home");
  const [profileData, setProfileData] = useState(null);
  const dispatch = useDispatch();
  const userToken = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosWrapper.get("/faculty/my-details", {
          headers: { Authorization: `Bearer ${userToken}` },
        });

        if (response.data.success) {
          setProfileData(response.data.data);
          dispatch(setUserData(response.data.data));
        }
      } catch (error) {
        toast.error("Failed to load profile");
      }
    };

    fetchUserDetails();
  }, [dispatch, userToken]);

  const getMenuItemClass = (menuId) => {
    const isSelected = selectedMenu.toLowerCase() === menuId.toLowerCase();
    return `text-center px-4 py-2 cursor-pointer w-100 rounded ${
      isSelected ? "btn-primary" : "btn-outline-primary"
    }`;
  };

  const renderContent = () => {
    if (selectedMenu === "Home" && profileData) {
      return <Profile profileData={profileData} />;
    }

    const menuItem = MENU_ITEMS.find(
      (item) => item.label.toLowerCase() === selectedMenu.toLowerCase()
    );

    if (menuItem && menuItem.component) {
      const Component = menuItem.component;
      return <Component />;
    }

    return null;
  };

  return (
    <>
      <Navbar />
      <div className="container-fluid">
        <div className="row justify-content-center my-4">
          <div className="col-12">
            <div className="d-flex flex-wrap justify-content-center gap-3">
              {MENU_ITEMS.map((item) => (
                <button
                  key={item.id}
                  className={getMenuItemClass(item.id)}
                  onClick={() => setSelectedMenu(item.label)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            {renderContent()}
          </div>
        </div>
      </div>
      <Toaster position="bottom-center" />
    </>
  );
};

export default Home;