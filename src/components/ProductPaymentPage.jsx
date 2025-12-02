// src/components/ProductPaymentPage.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import BackButton from "./BackButton.jsx";

// 引入你刚才创建的样式文件
import "../css/PointPaymentPage.css";

// 从 1club-member-shop 里引入会员登录弹窗和 hook
import { MemberLoginModal, useMemberAuth } from "oneclub-member-shop";

const ProductPaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // 从 ProductDetail 传过来的 state 中拿信息
  const { productId, productName, price } = location.state || {};

  // 会员登录状态
  const { member, isLoggedIn } = useMemberAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 点击「现金或360币支付」时的处理逻辑
  const handlePointPaymentClick = () => {
    // 如果还没登录会员中心，先弹出登录框
    if (!isLoggedIn) {
      setShowLoginModal(true);
      return;
    }

    // 已登录 → 跳转到“现金或360币支付”页面，并把产品信息一起带过去
    navigate("/products/points-payment", {
      state: { productId, productName, price },
    });
  };

  // 登录成功之后的回调：关闭弹窗并直接跳转到点数支付页面
  const handleLoginSuccess = () => {
    setShowLoginModal(false);
    navigate("/products/points-payment", {
      state: { productId, productName, price },
    });
  };

  return (
    <>
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

            {/* 支付方式 1：ChinaPayments */}
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
                  {/* 使用统一的自定义小按钮样式 */}
                  <Button
                    variant="primary"
                    size="lg"
                    className="payment-btn-half"
                  >
                    使用 ChinaPayments 支付
                  </Button>
                </a>
              </Card.Body>
            </Card>

            {/* 支付方式 2：现金或360币支付（走 1club-member-shop 的规则） */}
            <Card className="mb-3">
              <Card.Body>
                <Card.Title>现金或360币支付</Card.Title>
                <Card.Text>
                  使用会员中心账户中的现金点数和 360 币完成支付。
                </Card.Text>

                {/* 同样使用统一的小按钮样式 */}
                <Button
                  variant="primary"
                  size="lg"
                  className="payment-btn-half"
                  onClick={handlePointPaymentClick}
                >
                  使用现金或360币支付
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* 会员登录弹窗：未登录时点击“现金或360币支付”会弹出 */}
      <MemberLoginModal
        show={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </>
  );
};

export default ProductPaymentPage;
