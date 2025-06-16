import React, { useEffect, useState } from "react";
import axios from "axios";
import { Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/PartnerList.css";

// 动态标题映射
const productTitleMap = {
  "Studyfin": "留学中介",
  "roseneath-holidaypark": "旅游中介",
  "nail-train": "加盟商"
};

// 更健壮的媒体处理函数
function getMediaUrl(media) {
  if (!media) return null;
  if (Array.isArray(media)) {
    if (media[0]) return getMediaUrl(media[0]);
    return null;
  }
  if (media.url) return import.meta.env.VITE_STRAPI_HOST + media.url;
  if (media.data && media.data.url) return import.meta.env.VITE_STRAPI_HOST + media.data.url;
  if (media.data && media.data.attributes && media.data.attributes.url)
    return import.meta.env.VITE_STRAPI_HOST + media.data.attributes.url;
  return null;
}

const PartnerList = ({ currentProductName }) => {
  const [partners, setPartners] = useState([]);
  const [documentId, setDocumentId] = useState(""); // 新增
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

        const partnerEntry = res.data.data && res.data.data[0];
        let partnerList =
          partnerEntry && Array.isArray(partnerEntry.Partner)
            ? partnerEntry.Partner
            : [];

        // 取 documentId
        if (partnerEntry && partnerEntry.documentId) {
          setDocumentId(partnerEntry.documentId);
        } else {
          setDocumentId("");
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
        setDocumentId(""); // 遇到错误也重置
      }
    };

    if (currentProductName) {
      fetchPartners();
    }
  }, [currentProductName]);

  const visiblePartners = showAll ? partners : partners.slice(0, 2);

  // 动态标题
  const title = productTitleMap[currentProductName] || "合作伙伴";

  return (
    <Row>
      <Col>
        <h5>{title}</h5>
        {partners.length === 0 ? (
          <p>暂无</p>
        ) : (
          <>
            <div className="partner-list-container">
              {visiblePartners.map((item, idx) => {
                const logoUrl = getMediaUrl(item.companyLogo);
                const asicUrl = getMediaUrl(item.asicCertificate);

                return (
                  <div key={item.id || idx} className="partner-card">
                    {/* 左上角 Logo */}
                    <div className="partner-logo-wrapper">
                      {logoUrl ? (
                        <img
                          src={logoUrl}
                          alt="公司Logo"
                          className="partner-logo"
                        />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            border: "2px dashed #fcc",
                            borderRadius: "8px",
                            background: "#fdeeee",
                            color: "#e66666",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                          }}
                        >
                          无LOGO
                        </div>
                      )}
                    </div>

                    <div className="partner-info-split">
                      <div className="partner-info-left">
                        <p>
                          <strong>公司名称:</strong> {item.companyName || "N/A"}
                        </p>
                        <p>
                          <strong>电话:</strong> {item.Phone || "N/A"}
                        </p>
                        <p>
                          <strong>邮箱:</strong> {item.Email || "N/A"}
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
                        to={`/products/${encodeURIComponent(currentProductName)}/partner-apply?partnerID=${encodeURIComponent(item.partnerID)}&documentId=${encodeURIComponent(documentId)}`}
                      >
                        <Button variant="outline-primary" size="sm">
                          立即加入
                        </Button>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {partners.length > 2 && (
              <div
                style={{
                  textAlign: "center",
                  marginTop: "12px",
                  marginBottom: "40px",
                }}
              >
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

        {/* 下面是你要加的图片+按钮区（保持你的其他逻辑） */}
        <div style={{ textAlign: "center", margin: "40px 0 12px 0" }}>
          <img src="/partner-banner.jpg" alt="成为合作伙伴" style={{ display: "block", margin: "24px auto", maxWidth: "320px", width: "100%" }} />
          {/* 你原本的“成为合作伙伴”按钮可以放在这里，比如 */}
          {/* <Button variant="outline-dark">成为合作伙伴</Button> */}
        </div>
      </Col>
    </Row>
  );
};

export default PartnerList;
