import React from "react";
import { BsHouse, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CuteChatbot from "@dreamoverseas/cute-chatbot";
import "../css/FloatingHomeButton.css";



const API_URL = process.env.REACT_APP_OPENAI_API_URL
const ASST_ID = process.env.REACT_APP_OPENAI_ASST_ID
const API_KEY = process.env.REACT_APP_OPENAI_API_KEY
const GOOGLE_API = process.env.REACT_APP_GOOGLE_API

const FloatingHomeButton = () => {
  const navigate = useNavigate();

  return (
    <div className='floating-button-container'>
      {/* 返回按钮 */}
      <div className='floating-button' onClick={() => navigate(-1)}>
        <BsArrowLeft size={24} />
      </div>

      {/* 主页按钮 */}
      <div className='floating-button' onClick={() => navigate("/")}>
        <BsHouse size={24} />
      </div>

      <div className='floating-button' onClick={() => navigate(+1)}>
        <BsArrowRight size={24} />
      </div>

      <div>
        <CuteChatbot
          openai_api_url={`${API_URL}`}
          openai_asst_id={`${ASST_ID}`}
          openai_api_key={`${API_KEY}`}
          google_api_key={`${GOOGLE_API}`}
        />
      </div>
    </div>
  );
};

export default FloatingHomeButton;