import React from "react";
import { Container, Button } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import PartnerList from "../components/PartnerList";
import JoinUsButton from "../components/JoinUsButton";

const PartnerDetail = () => {
  const { productName } = useParams();
  const decodedProductName = decodeURIComponent(productName);
  const navigate = useNavigate();

  return (
    <Container style={{ paddingTop: "80px", paddingBottom: "40px" }}>


      {/* 中介列表 */}
      <PartnerList currentProductName={decodedProductName} />

      {/* 成为合作伙伴按钮 */}
      <div className="mt-4">
        <Link to={`/products/${encodeURIComponent(decodedProductName)}/PartnerDetail/PartnerApplicationForm`}>
          <JoinUsButton />
        </Link>
      </div>

      {/* 返回按钮右对齐 */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "20px" }}>
        <Button variant="secondary" onClick={() => navigate(-1)}>
          返回产品页面
        </Button>
      </div>
    </Container>
  );
};

export default PartnerDetail;
