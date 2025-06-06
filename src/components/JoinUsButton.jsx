import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const JoinUsButton = () => {
  const navigate = useNavigate();
  return (
    <Button
      className="product-detail-funtion-btn"
      onClick={() => navigate('/join-us-form')}
    >
      加入我们
    </Button>
  );
};

export default JoinUsButton;
