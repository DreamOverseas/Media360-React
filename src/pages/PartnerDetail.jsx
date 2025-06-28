import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import axios from "axios";
import "../css/PartnerDetail.css";

// 拼音 → 中文映射
const partnerTypeLabelMap = {
  lvyouzhongjie: "旅游中介",
  jiamengshang: "加盟商",
  liuxuezhongjie: "留学中介",
  yiminguwen: "移民顾问",
};

function getMediaUrl(media) {
  if (!media) return null;
  if (Array.isArray(media)) return getMediaUrl(media[0]);
  if (media.url) return import.meta.env.VITE_STRAPI_HOST + media.url;
  if (media.data?.attributes?.url) return import.meta.env.VITE_STRAPI_HOST + media.data.attributes.url;
  return null;
}

const PartnerDetail = () => {
  const { productName, partnerType } = useParams();
  const decodedProductName = decodeURIComponent(productName);
  const navigate = useNavigate();

  const [partners, setPartners] = useState([]);
  const [documentId, setDocumentId] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const params = new URLSearchParams();
        const partnerTypeLabel = partnerTypeLabelMap[partnerType] || "合作伙伴";

        params.append("filters[productName][$eq]", decodedProductName);
        params.append("filters[partnerType][$eq]", partnerTypeLabel);
        params.append("populate", "*");

        const url = `${import.meta.env.VITE_STRAPI_HOST}/api/partner-application-submissions?${params.toString()}`;
        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD}` },
        });

        const entries = res.data?.data || [];
        setPartners(entries);
        setDocumentId(entries[0]?.documentId || "");

      } catch (err) {
        console.error("拉取合作伙伴失败", err);
        setPartners([]);
        setDocumentId("");
      }
    };

    fetchPartners();
  }, [decodedProductName, partnerType]);

  const approvedPartners = partners.filter(p => (p.attributes || p).approved);
  const visiblePartners = showAll ? approvedPartners : approvedPartners.slice(0, 2);
  const title = partnerTypeLabelMap[partnerType] || "合作伙伴";

  return (
    <Container style={{ paddingTop: "80px", paddingBottom: "40px", position: "relative" }}>
      
      {/* 右上角返回 */}
      <div
        onClick={() => navigate(`/products/${encodeURIComponent(productName)}`)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          cursor: "pointer",
          fontSize: "24px",
          color: "#555",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
        title="返回"
      >
        <FiArrowLeft />
        <span style={{ fontSize: "16px" }}>返回</span>
      </div>

      {/* 页面标题 */}
      <h5 className="partner-section-title">{title}</h5>

      {/* 内容区域 */}
      {approvedPartners.length === 0 ? (
        <p>敬请期待</p>
      ) : (
        <>
          <div className="partner-list-container">
            {visiblePartners.map((item, idx) => {
              const attr = item.attributes || item || {};
              const avatarUrl = getMediaUrl(attr.advisorAvatar);
              const asicUrl = getMediaUrl(attr.asicCertificate);
              const licenseUrl = getMediaUrl(attr.licenseFile);

              return (
                <div key={item.id || idx} className="partner-card">
                  <div className="partner-logo-wrapper">
                    {avatarUrl && <img src={avatarUrl} alt="顾问头像" className="partner-logo" />}
                  </div>

                  <div className="partner-main-info">
                    <div className="info-section">
                      <div className="info-section-title">💼 专业资质</div>
                      <div className="partner-field">
                        <span className="field-label">从业经验：</span>
                        {attr.experienceYears || "未填写"}
                      </div>
                      {asicUrl && (
                        <div className="partner-field">
                          <span className="field-label">ASIC 证书：</span>
                          <a href={asicUrl} target="_blank" rel="noopener noreferrer">📄 查看证书</a>
                        </div>
                      )}
                      {licenseUrl && (
                        <div className="partner-field">
                          <span className="field-label">牌照文件：</span>
                          <a href={licenseUrl} target="_blank" rel="noopener noreferrer">📎 查看牌照</a>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="partner-join-button">
                    <Link to={`/products/${encodeURIComponent(productName)}/${partnerType}/CustomerApplicationForm?partnerID=${encodeURIComponent(attr.partnerID)}&documentId=${encodeURIComponent(documentId)}`}>
                      <button className="custom-join-button">
                        <FaUserPlus style={{ marginRight: "6px" }} />
                        立即咨询
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {approvedPartners.length > 2 && (
            <div className="toggle-button-wrapper">
              <button className="custom-join-button" onClick={() => setShowAll(!showAll)}>
                {showAll ? "收起" : "显示全部"}
              </button>
            </div>
          )}
        </>
      )}

      {/* 加入我们按钮 */}
      <Row className="mt-4 justify-content-start">
        <Col xs="auto">
          <Link to={`/products/${encodeURIComponent(productName)}/${partnerType}/PartnerDetail/PartnerApplicationForm`}>
            <button className="modern-joinus-btn">
              成为{title}
            </button>
          </Link>
        </Col>
      </Row>

    </Container>
  );
};

export default PartnerDetail;
