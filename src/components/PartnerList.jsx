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
        const url =
          `${import.meta.env.VITE_STRAPI_HOST}/api/partner-application-submission1s` +
          `?filters[productName][$eq]=${encodeURIComponent(currentProductName)}` +
          `&populate[Partner][populate][companyLogo]=true` +
          `&populate[Partner][populate][asicCertificate]=true` +
          `&populate[Partner][populate][licenseFile]=true`;

        const res = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD}`,
          },
        });

        const partnerEntry = res.data.data?.[0];
        let partnerList = Array.isArray(partnerEntry?.Partner)
          ? partnerEntry.Partner
          : [];

        if (partnerEntry?.documentId) {
          setDocumentId(partnerEntry.documentId);
        }

        partnerList.sort((a, b) => {
          const orderA = typeof a.Order === "number" ? a.Order : 9999;
          const orderB = typeof b.Order === "number" ? b.Order : 9999;
          return orderA - orderB;
        });

        setPartners(partnerList);
      } catch (err) {
        console.error("❌ 拉取合作伙伴失败", err);
        setPartners([]);
        setDocumentId("");
      }
    };

    if (currentProductName) fetchPartners();
  }, [currentProductName]);

  const visiblePartners = showAll ? partners : partners.slice(0, 2);
  const title = productTitleMap[currentProductName] || "合作伙伴";

  return (
    <Row>
      <Col>
        <h5 className="partner-section-title">{title}</h5>
        {partners.length === 0 ? (
          <p>期待您的加入</p>
        ) : (
          <>
            <div className="partner-list-container">
              {visiblePartners.map((item, idx) => {
                const logoUrl = getMediaUrl(item.companyLogo);
                const asicUrl = getMediaUrl(item.asicCertificate);
                const licenseUrl = getMediaUrl(item.licenseFile);

                return (
                  <div key={item.id || idx} className="partner-card">
                    {/* Logo 区域 */}
                    <div className="partner-logo-wrapper">
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt="公司Logo"
                          className="partner-logo"
                        />
                      )}
                    </div>

                    {/* 主信息区域 */}
                    <div className="partner-main-info">
                      {/* 基本信息 */}
                      <div className="info-section">
                        <div className="info-section-title">🧾 基本信息</div>
                        <div className="partner-field">
                          <span className="field-label">公司名称：</span>
                          {item.companyName || "未填写"}
                        </div>
                        <div className="partner-field">
                          <span className="field-label">公司官网：</span>
                          <a
                            href={item.companyUrlLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.companyUrlLink || "未填写"}
                          </a>
                        </div>
                        <div className="partner-field">
                          <span className="field-label">公司地址：</span>
                          {item.cityLocation || "未填写"}
                        </div>
                        <div className="partner-field">
                          <span className="field-label">ABN：</span>
                          {item.abnNumber || "未填写"}
                        </div>
                      </div>

                      {/* 专业资质 */}
                      <div className="info-section">
                        <div className="info-section-title">💼 专业资质</div>
                        <div className="partner-field">
                          <span className="field-label">从业经验：</span>
                          {item.experienceYears || "未填写"}
                        </div>
                        {asicUrl && (
                          <div className="partner-field">
                            <span className="field-label">ASIC 证书：</span>
                            <a
                              href={asicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              📄 查看证书
                            </a>
                          </div>
                        )}
                        {licenseUrl && (
                          <div className="partner-field">
                            <span className="field-label">牌照文件：</span>
                            <a
                              href={licenseUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              📎 下载牌照
                            </a>
                          </div>
                        )}
                      </div>

                      {/* 备注 */}
                      <div className="info-section">
                        <div className="info-section-title">📝 备注</div>
                        <div className="partner-field">
                          {item.Notes || "无备注"}
                        </div>
                      </div>
                    </div>

                    {/* 立即加入按钮 */}
                    <div className="partner-join-button">
                      <Link
                        to={`/products/${encodeURIComponent(
                          currentProductName
                        )}/CustomerApplicationForm?partnerID=${encodeURIComponent(
                          item.partnerID
                        )}&documentId=${encodeURIComponent(documentId)}`}
                      >
                        <button className="custom-join-button">
                          <FaUserPlus style={{ marginRight: "6px" }} />
                          立即加入
                        </button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 展开收起按钮 */}
            {partners.length > 2 && (
              <div className="toggle-button-wrapper">
                <button
                  className="custom-join-button"
                  onClick={() => setShowAll(!showAll)}
                >
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
