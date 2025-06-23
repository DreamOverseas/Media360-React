import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiX } from "react-icons/fi";
import PartnerList from "../components/PartnerList";
import JoinUsButton from "../components/JoinUsButton";
import "../css/PartnerDetail.css"; // 可选：新增页面专属样式

const PartnerDetail = () => {
  const { productName } = useParams();
  const decodedProductName = decodeURIComponent(productName);
  const navigate = useNavigate();

  return (
    <Container style={{ paddingTop: "80px", paddingBottom: "40px", position: "relative" }}>

      {/* 右上角 X 关闭按钮 */}
      <div
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          cursor: "pointer",
          fontSize: "24px",
          color: "#555",
        }}
        title="关闭"
      >
        <FiX />
      </div>

      {/* 合作伙伴列表 */}
      <PartnerList currentProductName={decodedProductName} />

      {/* 加入按钮 */}
      <Row className="mt-4 justify-content-start">
        <Col xs="auto">
          <Link to={`/products/${encodeURIComponent(decodedProductName)}/PartnerDetail/PartnerApplicationForm`}>
            <JoinUsButton />
          </Link>
        </Col>
      </Row>
    </Container>
  );
};

export default PartnerDetail;
