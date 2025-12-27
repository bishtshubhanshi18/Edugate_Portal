import React from "react";
import { FiLogOut } from "react-icons/fi";
import { useLocation, useNavigate } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import CustomButton from "./CustomButton";
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
  const router = useLocation();
  const navigate = useNavigate();

  const logouthandler = () => {
    localStorage.removeItem("userToken");
    localStorage.removeItem("userType");
    navigate("/");
  };

  return (
    <nav className="navbar shadow-sm p-3 mb-4 bg-white">
      <div className="container-fluid">
        <div className="d-flex align-items-center">
          <span 
            className="navbar-brand mb-0 h1 d-flex align-items-center" 
            style={{ cursor: 'pointer' }}
            onClick={() => navigate("/")}
          >
            <RxDashboard className="me-2" />
            {router.state && router.state.type} Dashboard
          </span>
        </div>
        <CustomButton 
          variant="danger" 
          onClick={logouthandler}
          className="btn btn-danger"
        >
          Logout
          <FiLogOut className="ms-2" />
        </CustomButton>
      </div>
    </nav>
  );
};

export default Navbar;