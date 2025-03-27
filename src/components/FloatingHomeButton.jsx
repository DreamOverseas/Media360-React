import React from "react";
import { BsHouse, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import "../css/FloatingHomeButton.css";





const FloatingHomeButton = () => {
  const navigate = useNavigate();

  return (
    <div className='floating-button-container'>
      {/* 返回按钮 */}
      <div className='floating-button' onClick={() => navigate(-1)}>
        <BsArrowLeft size={20} />
      </div>

      {/* 主页按钮 */}
      <div className='floating-button' onClick={() => navigate("/")}>
        <BsHouse size={20} />
      </div>

      <div className='floating-button' onClick={() => navigate(+1)}>
        <BsArrowRight size={20} />
      </div>
    </div>
  );
};

export default FloatingHomeButton;