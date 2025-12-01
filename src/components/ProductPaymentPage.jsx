// src/components/ProductPaymentPage.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import BackButton from "./BackButton.jsx";

const ProductPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 从 ProductDetail 传过来的 state 中拿信息
  const { productId, productName, price } = location.state || {};

  return (
    <Container className="mt-4 mb-5">
      <Row className="mb-3">
        <Col>
            <BackButton label="返回" />
        </Col>
        </Row>

      <Row>
        <Col md={8}>
          <h2 className="mb-3">选择支付方式</h2>

          {productName && (
            <p>
              当前产品：<strong>{productName}</strong>
              {price != null && price !== 0 ? (
                <span style={{ marginLeft: 8 }}>金额：AU$ {price}</span>
              ) : null}
            </p>
          )}

          {/* 支付方式 1：ChinaPayments（把原来的按钮搬过来） */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>ChinaPayments 支付</Card.Title>
              <Card.Text>
                通过 ChinaPayments 完成支付，适合使用人民币或中国银行卡/支付方式的用户。
              </Card.Text>
              <a
                href="https://www.chinapayments.com/merchant/360MED/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <Button variant="primary">使用 ChinaPayments 支付</Button>
              </a>
            </Card.Body>
          </Card>

          {/* 预留：以后你可以在这里加更多支付方式 */}
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>其他支付方式</Card.Title>
              <Card.Text>
                未来可以在这里接入 PayPal、信用卡、Apple Pay 等方式。
              </Card.Text>
              <Button variant="secondary" disabled>
                敬请期待
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductPaymentPage;
