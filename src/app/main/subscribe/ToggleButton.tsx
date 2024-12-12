import React, { useState } from "react";
import "./ToggleButton.css"; // For custom styling

const ToggleButton = ({ selected , setSelected=()=>{}}) => {

  const handleToggle = (value) => {
    setSelected(value);
  };

  return (
    <div className="items-center flex justify-center ">
      <div className="toggle-container">
        <button
          className={`toggle-button ${selected === "month" ? "active" : ""}`}
          onClick={() => handleToggle("month")}
        >
          Monthly
        </button>
        <button
          className={`toggle-button ${selected === "year" ? "active" : ""}`}
          onClick={() => handleToggle("year")}
        >
          Annual
        </button>
      </div>
    </div>
  );
};

export default ToggleButton;
