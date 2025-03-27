import React from "react";
import { Col, Container, Row, Image } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../css/ProductRelated.css";


const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const ProductRelatedPerson = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const founders = location.state?.founder || [];
  const kols = location.state?.kol || [];
  const ambassadors = location.state?.spokesperson || [];

  return (
    <Container className='related-page'>
      <h2 >{t("relatedPersons")}</h2>
      <Row>
        {founders.length > 0 ? (
            founders.map(founder => {
                const displayBio =
                i18n.language === "zh"
                    ? founder.Bio_zh || "暂无简介"
                    : founder.Bio_en || "No biography available";

                const displayTitle =
                i18n.language === "zh"
                    ? founder.Title_zh || "无头衔"
                    : founder.Title_en || "No Title";

                const displayName =
                i18n.language === "zh" ? founder.Name_zh || "未知" : founder.Name_en || "Unknown";

                return (
                <Col key={founder.id} xs={12} sm={6} md={6}>
                    <div className="product-related-person-container">
                        <Row>
                            {/* 左侧图片框 */}
                            <Col>
                                <div>
                                    <Image
                                        src={
                                            founder.Image?.[0]?.url
                                                ? `${BACKEND_HOST}${founder.Image[0].url}`
                                                : "https://placehold.co/200x300"
                                        }
                                        alt={displayName}
                                        fluid
                                    />
                                </div>
                            </Col>

                            {/* 右侧文本和按钮 */}
                            <Col>
                                <div className="product-related-content">
                                    <h4 className="product-related-person-name">{displayName}</h4>
                                    <p className="product-related-person-title">{displayTitle}</p>
                                    <p
                                        className="product-related-bio-text"
                                        dangerouslySetInnerHTML={{ __html: displayBio }}
                                    ></p>
                                </div>
                                <Link
                                    to={`/person/${founder.internal_url || founder.id}`}
                                    className="product-related-more-link"
                                >
                                    {t("btn_more")}
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </Col>
                );
            })
            ) : (
            <></>
            )}



            {kols.length > 0 ? (
                kols.map(kol => {
                    const displayBio =
                    i18n.language === "zh"
                        ? kol.Bio_zh || "暂无简介"
                        : kol.Bio_en || "No biography available";

                    const displayTitle =
                    i18n.language === "zh"
                        ? kol.Title_zh || "无头衔"
                        : kol.Title_en || "No Title";

                    const displayName =
                    i18n.language === "zh" ? kol.Name_zh || "未知" : kol.Name_en || "Unknown";

                    return (
                    <Col key={kol.id} xs={12} sm={6} md={6}>
                        <div className="product-related-person-container">
                            <Row>
                                {/* 左侧图片框 */}
                                <Col>
                                    <div>
                                        <Image
                                            src={
                                                kol.Image?.[0]?.url
                                                    ? `${BACKEND_HOST}${kol.Image[0].url}`
                                                    : "https://placehold.co/200x300"
                                            }
                                            alt={displayName}
                                            fluid
                                        />
                                    </div>
                                </Col>

                                {/* 右侧文本和按钮 */}
                                <Col>
                                    <div className="product-related-content">
                                        <h4 className="product-related-person-name">{displayName}</h4>
                                        <p className="product-related-person-title">{displayTitle}</p>
                                        <p
                                            className="product-related-bio-text"
                                            dangerouslySetInnerHTML={{ __html: displayBio }}
                                        ></p>
                                    </div>
                                    <Link
                                        to={`/person/${kol.internal_url || kol.id}`}
                                        className="product-related-more-link"
                                    >
                                        {t("btn_more")}
                                    </Link>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    );
                })
            ) : (
            <></>
            )}

            {ambassadors.length > 0 ? (
                ambassadors.map(ambassador => {
                    const displayBio =
                    i18n.language === "zh"
                        ? ambassador.Bio_zh || "暂无简介"
                        : ambassador.Bio_en || "No biography available";

                    const displayTitle =
                    i18n.language === "zh"
                        ? ambassador.Title_zh || "无头衔"
                        : ambassador.Title_en || "No Title";

                    const displayName =
                    i18n.language === "zh" ? ambassador.Name_zh || "未知" : ambassador.Name_en || "Unknown";

                    return (
                    <Col key={ambassador.id} xs={12} sm={6} md={6}>
                        <div className="product-related-person-container">
                            <Row>
                                {/* 左侧图片框 */}
                                <Col>
                                    <div>
                                        <Image
                                            src={
                                                ambassador.Image?.[0]?.url
                                                    ? `${BACKEND_HOST}${ambassador.Image[0].url}`
                                                    : "https://placehold.co/200x300"
                                            }
                                            alt={displayName}
                                            fluid
                                        />
                                    </div>
                                </Col>

                                {/* 右侧文本和按钮 */}
                                <Col>
                                    <div className="product-related-content">
                                        <h4 className="product-related-person-name">{displayName}</h4>
                                        <p className="product-related-person-title">{displayTitle}</p>
                                        <p
                                            className="product-related-bio-text"
                                            dangerouslySetInnerHTML={{ __html: displayBio }}
                                        ></p>
                                    </div>
                                    <Link
                                        to={`/person/${ambassador.internal_url || ambassador.id}`}
                                        className="product-related-more-link"
                                    >
                                        {t("btn_more")}
                                    </Link>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                    );
                })
            ) : (
            <></>
            )}

            {(ambassadors.length === 0) & (founders.length === 0) & (kols.length === 0)  ? (
                <p>暂无相关人物</p>
            ) : (
            <></>
            )}


      </Row>
    </Container>
  );
};

export default ProductRelatedPerson;