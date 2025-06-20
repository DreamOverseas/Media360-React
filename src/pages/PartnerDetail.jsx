import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import PartnerList from "../components/PartnerList";
import JoinUsButton from "../components/JoinUsButton";
import "../css/PartnerDetail.css"; // 可选：新增页面专属样式

const PartnerDetail = () => {
  const { productName } = useParams();
  const decodedProductName = decodeURIComponent(productName);
  const navigate = useNavigate();

  return (
    <Container style={{ paddingTop: "80px", paddingBottom: "40px" }}>

      {/* 合作伙伴列表 */}
      <PartnerList currentProductName={decodedProductName} />

      {/* 加入 & 返回 按钮组 */}
      <Row className="mt-4 justify-content-between align-items-center">
        <Col xs="auto">
          <Link to={`/products/${encodeURIComponent(decodedProductName)}/PartnerDetail/PartnerApplicationForm`}>
            <JoinUsButton />
          </Link>
        </Col>

        <Col xs="auto">
          <Button variant="secondary" onClick={() => navigate(-1)}>
            返回产品页面
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default PartnerDetail;
