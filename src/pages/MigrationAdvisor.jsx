import React from "react";
import { Container } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const MigrationAdvisor = () => {
  const navigate = useNavigate();
  const { productName } = useParams();

  return (
    <Container style={{ paddingTop: "20px", position: "relative" }}>
      
      {/* 返回按钮 */}
        <div
            onClick={() => navigate(`/products/${productName}/PartnerDetail`)}
            style={{
                position: "absolute",
                top: "20px",
                left: "20px",
                cursor: "pointer",
                fontSize: "20px",
                color: "#555",
            }}
            title="返回"
            >
            <FiArrowLeft />
        </div>

      <h2 className="my-4">移民顾问信息</h2>
      <p>这里可以展示移民顾问的介绍、联系方式、图片等内容。</p>

    </Container>
  );
};

export default MigrationAdvisor;
