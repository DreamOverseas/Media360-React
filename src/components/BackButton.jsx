// src/components/BackButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";

const BackButton = ({
  label = "返回上一页",
  className = "",
}) => {
  const navigate = useNavigate();

  return (
    <div className={`mb-3 ${className}`}>
      <Button
        variant="outline-secondary"        
        size="sm"                          
        onClick={() => navigate(-1)}
        className="d-inline-flex align-items-center gap-1 px-3 py-1 rounded-pill"
      >
        <i className="bi bi-arrow-left" />
        <span>{label}</span>
      </Button>
    </div>
  );
};

export default BackButton;
