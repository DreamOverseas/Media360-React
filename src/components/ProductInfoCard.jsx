import React from "react";
import { Card, Button } from "react-bootstrap";

const ProductInfoCard = ({ agent }) => {
  return (
    <Card style={{ width: "100%", marginBottom: "20px" }}>
      <Card.Img variant="top" src={agent.logoUrl} style={{ height: "120px", objectFit: "cover" }} />
      <Card.Body>
        <Card.Title>{agent.name}</Card.Title>
        <Card.Text>
          📞 {agent.phone}
          <br />
          📧 {agent.email}
        </Card.Text>
        <Button variant="primary" href={agent.link} target="_blank">
          了解更多
        </Button>
      </Card.Body>
    </Card>
  );
};

export default ProductInfoCard;