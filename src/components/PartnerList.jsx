import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import "../css/PartnerList.css";

const PartnerList = ({ currentProductName }) => {
  console.log("✅ PartnerList 渲染了，当前产品：", currentProductName);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_STRAPI_HOST}/api/product-screen-join-applications?sort=createdAt:desc&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_KEY_PRODUCT_JOIN_APPLICATIONS}`,
            },
          }
        );

        const all = res.data.data || [];
        console.log("📦 所有申请原始数据:", all);

        const filtered = all.filter((item, index) => {
          const fromStrapi = item?.sourceProductName?.trim().toLowerCase();
          const current = currentProductName?.trim().toLowerCase();
          const approved = item?.approved === true;
          const match = fromStrapi === current;

          console.log(`🧪 对比 [${index}]:`, {
            currentProduct: current,
            fromStrapi,
            match,
            approved,
          });

          return match && approved;
        });

        console.log("🎯 匹配当前产品的记录:", filtered);
        setApplications(filtered);
      } catch (err) {
        console.error("❌ 拉取申请信息失败", err);
      }
    };

    fetchApplications();
  }, [currentProductName]);

  return (
    <Row className="mt-4">
      <Col>
        <h5>最新申请信息</h5>
        {applications.length === 0 && <p>暂无申请记录。</p>}
        {applications.map((item, idx) => {
          const logoUrl = item?.companyLogo?.url
            ? import.meta.env.VITE_STRAPI_HOST + item.companyLogo.url
            : null;

          const asicUrl = item?.asicCertificate?.url
            ? import.meta.env.VITE_STRAPI_HOST + item.asicCertificate.url
            : null;

          return (
            <div key={item.id || idx} className="partner-card">
              {/* 左侧 logo */}
              {logoUrl && (
                <div className="partner-logo-wrapper">
                  <img
                    src={logoUrl}
                    alt="公司Logo"
                    className="partner-logo"
                  />
                </div>
              )}

              {/* 右侧信息 */}
              <div className="partner-info">
                <p><strong>公司名称:</strong> {item.companyName || "N/A"}</p>
                <p><strong>电话:</strong> {item.Phone || "N/A"}</p>
                <p><strong>邮箱:</strong> {item.Email || "N/A"}</p>
                <p><strong>备注:</strong> {item.Notes || "N/A"}</p>
                <p><strong>公司官网:</strong>{" "}
                  <a href={item.companyUrlLink} target="_blank" rel="noopener noreferrer">
                    {item.companyUrlLink}
                  </a>
                </p>
                <p><strong>ABN:</strong> {item.abnNumber || "N/A"}</p>
                <p><strong>来源产品:</strong> {item.sourceProductName || "N/A"}</p>
                <p><strong>来源链接:</strong>{" "}
                  <a href={item.sourceProductUrl} target="_blank" rel="noopener noreferrer">
                    {item.sourceProductUrl}
                  </a>
                </p>

                {asicUrl && (
                  <p><strong>ASIC 证书:</strong><br />
                    <a href={asicUrl} target="_blank" rel="noopener noreferrer">查看证书</a>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </Col>
    </Row>
  );
};

export default PartnerList;
