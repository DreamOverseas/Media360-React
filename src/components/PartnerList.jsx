import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/PartnerList.css";

const PartnerList = ({ currentProductName }) => {
  const [applications, setApplications] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_STRAPI_HOST}/api/product-screen-join-applications?sort=createdAt:desc&populate=*`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD}`,
            },
          }
        );

        const filtered = (res.data.data || []).filter((item) => {
          const matchProduct =
            item?.sourceProductName?.trim().toLowerCase() ===
            currentProductName?.trim().toLowerCase();
          const approved = item?.approved === true;
          return matchProduct && approved;
        });

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
    <Row>
      <Col>
        <h5>合作伙伴</h5>
        {applications.length === 0 ? (
          <p>暂无</p>
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
                    {logoUrl && (
                      <div className="partner-logo-wrapper">
                        <img
                          src={logoUrl}
                          alt="公司Logo"
                          className="partner-logo"
                        />
                      </div>
                    )}

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

                    <div className="partner-join-button">
                      <Link
                        to="/partner-apply"
                        state={{
                          productName: currentProductName,
                          companyName: item.companyName,
                        }}
                      >
                        <Button variant="outline-primary" size="sm">立即加入</Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {applications.length > 2 && (
              <div style={{ textAlign: "center", marginTop: "12px", marginBottom: "40px" }}>
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
