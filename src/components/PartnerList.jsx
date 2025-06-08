import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";

const PartnerList = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_STRAPI_HOST}/api/product-screen-join-applications?sort=createdAt:desc`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_KEY_PRODUCT_JOIN_APPLICATIONS}`,
            },
          }
        );

        console.log("✅ Strapi 返回的完整数据：", res.data);
        setApplications(res.data.data || []);
      } catch (err) {
        console.error("❌ 拉取申请信息失败", err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <Row className="mt-4">
      <Col>
        <h5>最新申请信息</h5>
        {applications.length === 0 && <p>暂无申请记录。</p>}
        {applications.map((item, idx) => {
          return (
            <div
              key={item.id || idx}
              style={{
                border: "1px solid #ccc",
                borderRadius: "10px",
                padding: "15px",
                marginBottom: "10px",
                backgroundColor: "#f9f9f9"
              }}
            >
              <p><strong>申请人:</strong> {item.applicantName}</p>
              <p><strong>产品名称:</strong> {item.productName}</p>
              <p><strong>电话:</strong> {item.applicantPhone}</p>
              <p><strong>邮箱:</strong> {item.applicantEmail}</p>
              <p><strong>来源产品:</strong> {item.sourceProductName}</p>
              <p><strong>来源链接:</strong>{" "}
                <a href={item.sourceProductUrl} target="_blank" rel="noopener noreferrer">
                  {item.sourceProductUrl}
                </a>
              </p>
            </div>
          );
        })}
      </Col>
    </Row>
  );
};

export default PartnerList;
