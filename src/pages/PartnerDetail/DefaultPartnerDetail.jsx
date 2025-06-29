import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
import "../../css/DefaultPartnerDetail.css";
import { getPartnerTypeLabel } from "../../components/PartnerConfig";

function getMediaUrl(media) {
  if (!media) return null;
  if (Array.isArray(media)) return getMediaUrl(media[0]);
  if (media.url) return import.meta.env.VITE_STRAPI_HOST + media.url;
  if (media.data?.attributes?.url) return import.meta.env.VITE_STRAPI_HOST + media.data.attributes.url;
  return null;
}

const DefaultPartnerDetail = ({ partners, documentId, productName, partnerType }) => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const approvedPartners = partners.filter(p => (p.attributes || p).approved);
  const visiblePartners = showAll ? approvedPartners : approvedPartners.slice(0, 2);
  const title = getPartnerTypeLabel(partnerType);

  return (
    <Container className="default-partner-container">
      
      <div onClick={() => navigate(`/products/${encodeURIComponent(productName)}`)} className="back-button">
        <FiArrowLeft />
        <span className="small-text">返回</span>
      </div>

      <h5 className="partner-section-title">{title}</h5>

      {approvedPartners.length === 0 ? (
        <p>敬请期待</p>
      ) : (
        <>
          <div className="partner-list-container">
            {visiblePartners.map((item, idx) => {
              const attr = item.attributes || item;
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

export default DefaultPartnerDetail;
