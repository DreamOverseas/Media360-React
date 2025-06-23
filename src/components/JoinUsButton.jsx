import React from 'react';
import { useParams } from 'react-router-dom';
import '../css/JoinUsButton.css';


const productTitleMap = {
  Studyfin: "留学中介",
  "罗塞尼斯半岛度假村": "旅游中介",
  "AI美甲": "加盟商",
};

const JoinUsButton = (props) => {
  const { productName } = useParams();
  const role = productTitleMap[productName] || "合作伙伴";

  return (
    <button className="modern-joinus-btn" {...props}>
      成为{role}
    </button>
  );
};

export default JoinUsButton;
