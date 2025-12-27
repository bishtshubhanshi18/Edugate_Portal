import React from "react";
import CustomButton from "./CustomButton";
import 'bootstrap/dist/css/bootstrap.min.css';

const DeleteConfirm = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block bg-dark bg-opacity-50"
      style={{ backdropFilter: 'blur(2px)' }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Confirm Delete</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body">
            <p className="text-muted">
              {message ||
                "Are you sure you want to delete this item? This action cannot be undone."}
            </p>
          </div>
          <div className="modal-footer">
            <CustomButton 
              onClick={onClose} 
              variant="secondary"
              className="btn btn-secondary"
            >
              Cancel
            </CustomButton>
            <CustomButton 
              onClick={onConfirm} 
              variant="danger"
              className="btn btn-danger"
            >
              Delete
            </CustomButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirm;