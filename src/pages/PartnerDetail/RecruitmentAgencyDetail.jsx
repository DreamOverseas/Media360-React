import React, { useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate, Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { FaUserPlus } from "react-icons/fa";
// 确保这个路径指向您的 CSS 文件
import "../../css/DefaultPartnerDetail.css"; 
import { getPartnerTypeLabel } from "../../components/PartnerConfig";

// 保持原有的媒体 URL 获取逻辑不变
function getMediaUrl(media) {
  if (!media) return null;
  if (Array.isArray(media)) return getMediaUrl(media[0]);
  if (media.url) return import.meta.env.VITE_STRAPI_HOST + media.url;
  if (media.data?.attributes?.url) return import.meta.env.VITE_STRAPI_HOST + media.data.attributes.url;
  return null;
}

const RecruitmentAgencyDetail  = ({ partners, documentId, productName, partnerType }) => {
  const navigate = useNavigate();
  const [showAll, setShowAll] = useState(false);

  const approvedPartners = partners.filter(p => (p.attributes || p).approved);
  const visiblePartners = showAll ? approvedPartners : approvedPartners.slice(0, 2);
  const title = getPartnerTypeLabel(partnerType);

  return (
    <Container className="default-partner-container">
      
      {/* 统一的返回按钮样式 */}
      <div onClick={() => navigate(`/products/${encodeURIComponent(productName)}`)} className="back-button">
        <FiArrowLeft size={20} />
        <span className="small-text">返回</span>
      </div>

      {/* 统一的标题样式 */}
      <h5 className="partner-section-title">{title}</h5>

      {approvedPartners.length === 0 ? (
        <p>敬请期待</p>
      ) : (
        <>
          {/* 使用 Row/Col 替代原始的 partner-list-container，确保响应式布局，同时保留垂直间距类名 */}
          <div className="partner-list-container">
            {visiblePartners.map((item, idx) => {
              const attr = item.attributes || item;
              const avatarUrl = getMediaUrl(attr.advisorAvatar);
              const asicUrl = getMediaUrl(attr.asicCertificate);
              const licenseUrl = getMediaUrl(attr.licenseFile);

              const fullName = `${attr.advisorLastName || ""}${attr.advisorFirstName || ""}`;

                return (
                  // 使用统一的 partner-card 样式
                  <div key={item.id || idx} className="partner-card">
                    
                    {/* Logo/Avatar - 左侧/顶部 */}
                    <div className="partner-logo-wrapper">
                      {avatarUrl && <img src={avatarUrl} alt="顾问头像" className="partner-logo" />}
                    </div>

                    {/* 主要信息 - 中间区域 */}
                    <div className="partner-main-info">
                      <div className="info-section">
                        
                        {/* 顾问姓名 */}
                        <div className="partner-field name-field">
                          <span className="field-label">顾问姓名：</span>
                          {fullName || "未填写"}
                        </div>

                        {/* 专业资质区域 */}
                        <div className="info-section-title">💼 专业资质</div>
                        
                        {/* 从业经验 */}
                        <div className="partner-field">
                          <span className="field-label">从业经验：</span>
                          {attr.experienceYears || "未填写"}
                        </div>

                        {/* ASIC 证书 */}
                        {asicUrl && (
                          <div className="partner-field">
                            <span className="field-label">ASIC 证书：</span>
                            <a href={asicUrl} target="_blank" rel="noopener noreferrer">📄 查看证书</a>
                          </div>
                        )}

                        {/* 牌照文件 */}
                        {licenseUrl && (
                          <div className="partner-field">
                            <span className="field-label">牌照文件：</span>
                            <a href={licenseUrl} target="_blank" rel="noopener noreferrer">📎 查看牌照</a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 立即咨询按钮 - 右侧/底部 */}
                    <div className="partner-join-button">
                      {/* 保持 RecruitmentAgencyForm 链接逻辑 */}
                      <Link to={`/products/${encodeURIComponent(productName)}/${partnerType}/RecruitmentAgencyForm?partnerID=${encodeURIComponent(attr.partnerID)}&documentId=${encodeURIComponent(documentId)}`}>
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

          {/* 统一的显示全部按钮布局 */}
          {approvedPartners.length > 2 && (
            <div className="toggle-button-wrapper">
              <button className="custom-join-button" onClick={() => setShowAll(!showAll)}>
                {showAll ? "收起" : "显示全部"}
              </button>
            </div>
          )}
        </>
      )}

      {/* 统一的“成为合作伙伴”按钮布局 */}
      <Row className="mt-5 justify-content-center">
        <Col xs={12} md={6} lg={4}>
          <Link to={`/products/${encodeURIComponent(productName)}/${partnerType}/PartnerDetail/PartnerApplicationForm`}>
            <button className="modern-joinus-btn w-100">
              成为{title}
            </button>
          </Link>
        </Col>
      </Row>

    </Container>
  );
};

export default RecruitmentAgencyDetail ;