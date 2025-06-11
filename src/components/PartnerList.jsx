import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import "../css/PartnerList.css";

const PartnerList = ({ currentProductName }) => {
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
        setApplications(res.data.data || []);
      } catch (err) {
        console.error("❌ 拉取申请信息失败", err);
        setApplications([]);
      }
    };

    fetchApplications();
  }, [currentProductName]);

  return (
    <Row className="mt-4">
      <Col>
        <h5>最新申请信息</h5>
        {applications.length === 0 ? (
          <p>暂无申请记录。</p>
        ) : (
          applications.map((item, idx) => {
            const logoUrl = item?.companyLogo?.url
              ? import.meta.env.VITE_STRAPI_HOST + item.companyLogo.url
              : null;

            const asicUrl = item?.asicCertificate?.url
              ? import.meta.env.VITE_STRAPI_HOST + item.asicCertificate.url
              : null;

            return (
              <div key={item.id || idx} className="partner-card">
                {/* 左侧：公司 Logo */}
                {logoUrl && (
                  <div className="partner-logo-wrapper">
                    <img
                      src={logoUrl}
                      alt="公司Logo"
                      className="partner-logo"
                    />
                  </div>
                )}

                {/* 中右结构：字段区域分为两列 */}
                <div className="partner-info-split">
                  {/* 中间：公司字段 */}
                  <div className="partner-info-left">
                    <p><strong>公司名称:</strong> {item.companyName || "N/A"}</p>
                    <p><strong>电话:</strong> {item.Phone || "N/A"}</p>
                    <p><strong>邮箱:</strong> {item.Email || "N/A"}</p>
                    <p><strong>公司官网:</strong>{" "}
                      <a href={item.companyUrlLink} target="_blank" rel="noopener noreferrer">
                        {item.companyUrlLink}
                      </a>
                    </p>
                    <p><strong>ABN:</strong> {item.abnNumber || "N/A"}</p>
                    {asicUrl && (
                      <p><strong>ASIC 证书:</strong>{" "}
                        <a href={asicUrl} target="_blank" rel="noopener noreferrer">查看证书</a>
                      </p>
                    )}
                  </div>

                  {/* 右侧：备注字段 */}
                  <div className="partner-info-right">
                    <p><strong>备注:</strong> {item.Notes || "N/A"}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </Col>
    </Row>
  );
};

export default PartnerList;
