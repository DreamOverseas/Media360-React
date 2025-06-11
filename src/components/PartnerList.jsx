import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Button } from "react-bootstrap";
import "../css/PartnerList.css";

const PartnerList = ({ currentProductName }) => {
  const [applications, setApplications] = useState([]);
  const [showAll, setShowAll] = useState(false); // 控制展开/收起

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

        // ✅ 同时满足：approved === true && 当前产品名匹配
        const filtered = (res.data.data || []).filter(item =>
          item.approved === true &&
          item.sourceProductName?.toLowerCase() === currentProductName?.toLowerCase()
        );

        setApplications(filtered);
      } catch (err) {
        console.error("❌ 拉取申请信息失败", err);
        setApplications([]);
      }
    };

    fetchApplications();
  }, [currentProductName]);

  const visibleApplications = showAll ? applications : applications.slice(0, 2);

  return (
    <Row className="mt-4">
      <Col>
        <h5>最新申请信息</h5>
        {applications.length === 0 ? (
          <p>暂无申请记录。</p>
        ) : (
          <>
            <div className="partner-list-container">
              {visibleApplications.map((item, idx) => {
                const logoUrl = item?.companyLogo?.url
                  ? import.meta.env.VITE_STRAPI_HOST + item.companyLogo.url
                  : null;

                const asicUrl = item?.asicCertificate?.url
                  ? import.meta.env.VITE_STRAPI_HOST + item.asicCertificate.url
                  : null;

                return (
                  <div key={item.id || idx} className="partner-card">
                    {/* 公司Logo */}
                    {logoUrl && (
                      <div className="partner-logo-wrapper">
                        <img src={logoUrl} alt="公司Logo" className="partner-logo" />
                      </div>
                    )}

                    {/* 信息字段 */}
                    <div className="partner-info-split">
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
                      <div className="partner-info-right">
                        <p><strong>备注:</strong> {item.Notes || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 展开/收起按钮 */}
            {applications.length > 2 && (
              <div style={{ textAlign: "center", marginTop: "12px" }}>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                >
                  {showAll ? "收起" : "显示全部"}
                </Button>
              </div>
            )}
          </>
        )}
      </Col>
    </Row>
  );
};

export default PartnerList;
