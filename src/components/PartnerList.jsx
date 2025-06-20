import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaUserPlus } from "react-icons/fa";
import "../css/PartnerList.css";

// 动态标题映射
const productTitleMap = {
  Studyfin: "留学中介",
  "roseneath-holidaypark": "旅游中介",
  "nail-train": "加盟商",
};

// 更健壮的媒体处理函数
function getMediaUrl(media) {
  if (!media) return null;
  if (Array.isArray(media)) {
    if (media[0]) return getMediaUrl(media[0]);
    return null;
  }
  if (media.url) return import.meta.env.VITE_STRAPI_HOST + media.url;
  if (media.data?.attributes?.url)
    return import.meta.env.VITE_STRAPI_HOST + media.data.attributes.url;
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
          `&populate[Partner][populate][asicCertificate]=true`;

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

        partnerList = [...partnerList].sort((a, b) => {
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
  const PartnerApplicationFormLink = `/products/${encodeURIComponent(currentProductName)}/PartnerApplicationForm`;

  return (
    <Row>
      <Col>
        <h5>{title}</h5>
        {partners.length === 0 ? (
          <p>期待您的加入</p>
        ) : (
          <>
            <div className="partner-list-container">
              {visiblePartners.map((item, idx) => {
                const logoUrl = getMediaUrl(item.companyLogo);
                const asicUrl = getMediaUrl(item.asicCertificate);

                return (
                  <div key={item.id || idx} className="partner-card">
                    {/* logo */}
                    <div className="partner-logo-wrapper">
                      {logoUrl && (
                        <img
                          src={logoUrl}
                          alt="公司Logo"
                          className="partner-logo"
                        />
                      )}
                    </div>

                    <div className="partner-info-split">
                      <div className="partner-info-left">
                        <p>
                          <strong>公司名称:</strong> {item.companyName || "N/A"}
                        </p>
                        <p>
                          <strong>公司官网:</strong>{" "}
                          <a
                            href={item.companyUrlLink}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {item.companyUrlLink}
                          </a>
                        </p>
                        <p>
                          <strong>ABN:</strong> {item.abnNumber || "N/A"}
                        </p>
                        <p>
                          <strong>公司地点:</strong>{" "}
                          {item.cityLocation || "未填写"}
                        </p>
                        <p>
                          <strong>从业经验:</strong>{" "}
                          {item.experienceYears || "未填写"}
                        </p>
                        {asicUrl && (
                          <p>
                            <strong>ASIC 证书:</strong>{" "}
                            <a
                              href={asicUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              查看证书
                            </a>
                          </p>
                        )}
                      </div>

                      <div className="partner-info-right">
                        <p>
                          <strong>备注:</strong> {item.Notes || "N/A"}
                        </p>
                      </div>
                    </div>

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
