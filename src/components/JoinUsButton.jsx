import React from 'react';
import { Button } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const productTitleMap = {
  Studyfin: "留学中介",
  "罗塞尼斯半岛度假村": "旅游中介",
  "AI美甲": "加盟商",
};

const JoinUsButton = (props) => {
  const { productName } = useParams();
  const role = productTitleMap[productName] || "合作伙伴";

  return (
    <Button className="product-detail-funtion-btn" {...props}>
      成为{role}
    </Button>
  );
};

export default JoinUsButton;
