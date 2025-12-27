import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import axiosWrapper from "../utils/AxiosWrapper";
import CustomButton from "../components/CustomButton";
import 'bootstrap/dist/css/bootstrap.min.css';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { resetId, type } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!resetId) {
      toast.error("Invalid or expired reset link.");
      navigate("/");
    }
  }, [resetId, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!type) {
      toast.error("Invalid Reset Password Link.");
      return;
    }
    setIsLoading(true);
    toast.loading("Resetting your password...");

    try {
      const response = await axiosWrapper.post(
        `/${type}/update-password/${resetId}`,
        { password: newPassword, resetId }
      );

      toast.dismiss();
      if (response.data.success) {
        toast.success("Password reset successfully.");
        navigate("/");
      } else {
        toast.error(response.data.message || "Error resetting password.");
      }
    } catch (error) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Error resetting password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light d-flex align-items-center justify-content-center p-4">
      <div className="w-100" style={{ maxWidth: "500px" }}>
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-dark mb-4">
            Update Password
          </h1>
        </div>
        
        <form
          className="bg-white p-5 rounded-3 shadow-sm border"
          onSubmit={onSubmit}
        >
          <div className="mb-4">
            <label
              className="form-label fw-medium text-dark"
              htmlFor="newPassword"
            >
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              required
              className="form-control form-control-lg"
            />
          </div>

          <div className="mb-4">
            <label
              className="form-label fw-medium text-dark"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
              required
              className="form-control form-control-lg"
            />
          </div>

          <CustomButton
            type="submit"
            disabled={isLoading}
            className="w-100 btn btn-primary btn-lg"
          >
            {isLoading ? "Resetting..." : "Reset Password"}
          </CustomButton>
        </form>
      </div>
      <Toaster position="bottom-center" />
    </div>
  );
};

export default UpdatePassword;