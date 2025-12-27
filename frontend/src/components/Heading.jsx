import React from "react";

const Heading = (props) => {
  return (
    <div className="d-flex justify-content-between align-items-center w-100">
      <p className="fw-semibold fs-3 border-start border-5 border-danger ps-3">
        {props.title}
      </p>
    </div>
  );
};

export default Heading;