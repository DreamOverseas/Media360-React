import React from "react";
import { BsHouse, BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import CuteChatbot from "@dreamoverseas/cute-chatbot";
import { Row, Col } from "react-bootstrap";
import "../css/FloatingHomeButton.css";

const GOOGLE_API = import.meta.env.VITE_GOOGLE_API
const CHAT_API = import.meta.env.VITE_CHAT_URL
const ASST_ID = import.meta.env.VITE_OPENAI_ASST_ID
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY
const API_URL = import.meta.env.VITE_OPENAI_API_URL

const CHATBOT_NAME = "DO Bot"

const FloatingHomeButton = () => {
  const navigate = useNavigate();

  return (
    <Row>
      <Col>
        <div className='floating-button-container'>
          {/* 返回按钮 */}
          <div className='floating-button' onClick={() => navigate(-1)}>
            <BsArrowLeft size={20} />
          </div>

          {/* 主页按钮 */}
          <div className='floating-button' onClick={() => window.location.href = '/'}>
            <BsHouse size={20} />
          </div>

          <div className='floating-button' onClick={() => navigate(+1)}>
            <BsArrowRight size={20} />
          </div>
        </div>
      </Col>
      <Col>
        <div className="chatbot">
          {CHAT_API ?
            <CuteChatbot
              style={{ zIndex: 101, bottom: '75px !important' }}
              nickname={CHATBOT_NAME}
              backend_url={CHAT_API}
              google_api_key={`${GOOGLE_API}`}
            />
            :
            <CuteChatbot
              style={{ zIndex: 101, bottom: '75px !important' }}
              nickname={CHATBOT_NAME}
              openai_api_url={`${API_URL}`}
              openai_asst_id={`${ASST_ID}`}
              openai_api_key={`${API_KEY}`}
              google_api_key={`${GOOGLE_API}`}
            />
          }
        </div>
      </Col>
    </Row>
  );
};

export default FloatingHomeButton;