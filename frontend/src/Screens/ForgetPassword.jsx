import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axiosWrapper from "../utils/AxiosWrapper";
import CustomButton from "../components/CustomButton";
import 'bootstrap/dist/css/bootstrap.min.css';

const USER_TYPES = {
  STUDENT: "Student",
  FACULTY: "Faculty",
  ADMIN: "Admin",
};

const UserTypeSelector = ({ selected, onSelect }) => (
  <div className="d-flex justify-content-center gap-3 mb-5">
    {Object.values(USER_TYPES).map((type) => (
      <button
        key={type}
        type="button"
        onClick={() => onSelect(type)}
        className={`btn btn-sm px-4 py-2 rounded-pill ${
          selected === type
            ? "btn-primary"
            : "btn-outline-secondary"
        }`}
      >
        {type}
      </button>
    ))}
  </div>
);

const ForgetPassword = () => {
  const navigate = useNavigate();
  const userToken = localStorage.getItem("userToken");
  const [selected, setSelected] = useState(USER_TYPES.STUDENT);
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (userToken) {
      navigate(`/${localStorage.getItem("userType")}`);
    }
  }, [userToken, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    toast.loading("Sending reset mail...");
    if (email === "") {
      toast.dismiss();
      toast.error("Please enter your email");
      return;
    }
    try {
      const headers = {
        "Content-Type": "application/json",
      };
      const resp = await axiosWrapper.post(
        `/${selected.toLowerCase()}/forget-password`,
        { email },
        {
          headers: headers,
        }
      );

      if (resp.data.success) {
        toast.dismiss();
        toast.success(resp.data.message);
      } else {
        toast.dismiss();
        toast.error(resp.data.message);
      }
    } catch (error) {
      toast.dismiss();
      console.error(error);
      toast.error(error.response?.data?.message || "Error sending reset mail");
    } finally {
      setEmail("");
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-dark mb-4">
            {selected} Forget Password
          </h1>
          <UserTypeSelector selected={selected} onSelect={setSelected} />
        </div>
        
        <form
          className="bg-white p-5 rounded-3 shadow-sm border"
          onSubmit={onSubmit}
        >
          <div className="mb-4">
            <label
              className="form-label fw-medium text-dark"
              htmlFor="email"
            >
              {selected} Email
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
              className="form-control form-control-lg"
            />
          </div>
          <CustomButton
            type="submit"
            className="w-100 btn btn-primary btn-lg"
          >
            Send Reset Link
          </CustomButton>
        </form>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default ForgetPassword;