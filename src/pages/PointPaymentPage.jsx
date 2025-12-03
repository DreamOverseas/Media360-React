// src/pages/PointPaymentPage.jsx
import { useLocation, useNavigate } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { SingleProductRedeemPanel } from "1club-member-shop";
import BackButton from "../components/BackButton";

const cmsEndpoint   = import.meta.env.VITE_CMS_API_ENDPOINT;
const cmsApiKey     = import.meta.env.VITE_CMS_API_KEY;
const couponEndpoint = import.meta.env.VITE_COUPON_SYS_ENDPOINT;
const emailEndpoint  = import.meta.env.VITE_EMAIL_API_ENDPOINT;

export default function PointPaymentPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { productName, price } = location.state || {};

  // 用产品信息构造一个“兑换商品”
  const redeemProduct = {
    Name: productName,
    Price: Number(price),
    MaxDeduction: Number(price),
    Description: "通过现金或360币购买该产品。",
    ProviderName: "360Media", // ★ 必须和 CouponSysAccount.Name 完全一致
  };

  return (
    <Container className="mt-4 mb-5">
      <Row className="mb-3">
        <Col>
          <BackButton label="返回支付方式" />
        </Col>
      </Row>

      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <h2 className="mb-3">现金或360币支付</h2>

          <SingleProductRedeemPanel
            cmsEndpoint={cmsEndpoint}
            cmsApiKey={cmsApiKey}
            couponEndpoint={couponEndpoint}
            emailEndpoint={emailEndpoint}
            product={redeemProduct}
            onSuccess={() => {
              // ✅ 兑换成功后回到首页
              navigate("/");
            }}
          />
        </Col>
      </Row>
    </Container>
  );
}
