import React from "react";
import { BsHouse } from "react-icons/bs"; // ✅ 使用 react-icons 里的 BsHouse
import { useNavigate } from "react-router-dom";
import "../css/FloatingHomeButton.css";

const FloatingHomeButton = () => {
  const navigate = useNavigate();

  return (
    <div className='floating-home-button' onClick={() => navigate("/")}>
      <BsHouse size={24} />
    </div>
  );
};

export default FloatingHomeButton;
