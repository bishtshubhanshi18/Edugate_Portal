import React, { useState, useEffect } from "react";
import { FiLogIn } from "react-icons/fi";
import axios from "axios";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setUserToken } from "../redux/actions";
import { useDispatch } from "react-redux";
import CustomButton from "../components/CustomButton";
import axiosWrapper from "../utils/AxiosWrapper";
import 'bootstrap/dist/css/bootstrap.min.css';

const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
};

const LoginForm = ({ selected, onSubmit, formData, setFormData }) => (
  <form
    className="w-100 p-5 bg-white rounded-3 shadow-lg border"
    onSubmit={onSubmit}
  >
    <div className="mb-4">
      <label
        className="form-label text-dark"
        htmlFor="email"
      >
        {selected} Email
      </label>
      <input
        type="email"
        id="email"
        required
        className="form-control"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
    </div>
    <div className="mb-4">
      <label
        className="form-label text-dark"
        htmlFor="password"
      >
        Password
      </label>
      <input
        type="password"
        id="password"
        required
        className="form-control"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />
    </div>
    <div className="d-flex justify-content-between mb-4">
      <Link
        className="text-primary text-decoration-none"
        to="/forget-password"
      >
        Forgot Password?
      </Link>
    </div>
    <CustomButton
      type="submit"
      className="w-100 btn btn-primary py-2 px-4 d-flex justify-content-center align-items-center gap-2"
    >
      Login
      <FiLogIn className="fs-5" />
    </CustomButton>
  </form>
);

const UserTypeSelector = ({ selected, onSelect }) => (
  <div className="d-flex justify-content-center gap-3 mb-5">
    {Object.values(USER_TYPES).map((type) => (
      <button
        key={type}
        onClick={() => onSelect(type)}
        className={`btn rounded-pill px-4 py-2 ${
          selected === type
            ? "btn-primary"
            : "btn-outline-primary"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get("type");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [selected, setSelected] = useState(USER_TYPES.STUDENT);

  const handleUserTypeSelect = (type) => {
    const userType = type.toLowerCase();
    setSelected(type);
    setSearchParams({ type: userType });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await axiosWrapper.post(
        `/${selected.toLowerCase()}/login`,
        formData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      const { token } = response.data.data;
      localStorage.setItem("userToken", token);
      localStorage.setItem("userType", selected);
      dispatch(setUserToken(token));
      navigate(`/${selected.toLowerCase()}`);
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      navigate(`/${localStorage.getItem("userType").toLowerCase()}`);
    }
  }, [navigate]);

  useEffect(() => {
    if (type) {
      const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
      setSelected(capitalizedType);
    }
  }, [type]);

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="w-100 max-w-md mx-auto p-5">
        <h1 className="display-5 text-center mb-5 text-dark">
          {selected} Login
        </h1>
        <UserTypeSelector selected={selected} onSelect={handleUserTypeSelect} />
        <LoginForm
          selected={selected}
          onSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
        />
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default Login;