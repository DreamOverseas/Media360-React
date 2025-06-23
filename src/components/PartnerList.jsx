import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import "../css/PartnerList.css";

const productTitleMap = {
  Studyfin: "留学中介",
  "罗塞尼斯半岛度假村": "旅游中介",
  "AI美甲": "加盟商",
};

function getMediaUrl(media) {
  if (!media) return null;
  if (Array.isArray(media)) return getMediaUrl(media[0]);
  if (media.url) return import.meta.env.VITE_STRAPI_HOST + media.url;
  if (media.data?.attributes?.url) return import.meta.env.VITE_STRAPI_HOST + media.data.attributes.url;
  return null;
}

const PartnerList = ({ currentProductName }) => {
  const [partners, setPartners] = useState([]);
  const [documentId, setDocumentId] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const params = new URLSearchParams();
        params.append("filters[productName][$eq]", currentProductName);
        params.append("populate", "*");

        const url = `${import.meta.env.VITE_STRAPI_HOST}/api/partner-application-submissions?${params.toString()}`;
        console.log("✅ 最终请求地址：", url);

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD}`,
          },
        });

        const entries = res.data?.data || [];
        console.log("✅ 后端返回的entries数据：", entries);

        if (entries.length === 0) {
          setPartners([]);
          setDocumentId("");
          return;
        }

        setPartners(entries);
        setDocumentId(entries[0]?.documentId || "");

      } catch (err) {
        console.error("❌ 拉取合作伙伴失败", err);
        setPartners([]);
        setDocumentId("");
      }
    };

    if (currentProductName) fetchPartners();
  }, [currentProductName]);

  // 先筛选 approved = true 的数据
  const approvedPartners = partners.filter(p => (p.attributes || p).approved);
  const visiblePartners = showAll ? approvedPartners : approvedPartners.slice(0, 2);
  const title = productTitleMap[currentProductName] || "合作伙伴";

  return (
    <Row>
      <Col>
        <h5 className="partner-section-title">{title}</h5>
        {approvedPartners.length === 0 ? (
          <p>敬请期待</p>
        ) : (
          <>
            <div className="partner-list-container">
              {visiblePartners.map((item, idx) => {
                const attr = item.attributes || item || {};
                const logoUrl = getMediaUrl(attr.companyLogo);
                const asicUrl = getMediaUrl(attr.asicCertificate);
                const licenseUrl = getMediaUrl(attr.licenseFile);

                return (
                  <div key={item.id || idx} className="partner-card">
                    <div className="partner-logo-wrapper">
                      {logoUrl && (
                        <img src={logoUrl} alt="公司Logo" className="partner-logo" />
                      )}
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
                      <Link to={`/products/${encodeURIComponent(currentProductName)}/CustomerApplicationForm?partnerID=${encodeURIComponent(attr.partnerID)}&documentId=${encodeURIComponent(documentId)}`}>
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
      </Col>
    </Row>
  );
};

export default PartnerList;
