import React from "react";
import { Col, Container, Row, Image } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../Css/ProductRelated.css";

const BACKEND_HOST = import.meta.env.VITE_CMS_ENDPOINT;

const PersonCard = ({ person, language }) => {
  const { t } = useTranslation();
  const displayBio =
    language === "zh" ? person.Bio_zh || "暂无简介" : person.Bio_en || "No biography available";
  const displayTitle =
    language === "zh" ? person.Title_zh || "无头衔" : person.Title_en || "No Title";
  const displayName =
    language === "zh" ? person.Name_zh || "未知" : person.Name_en || "Unknown";

  return (
    <Col xs={12} sm={6} md={6}>
      <div className="product-related-person-container">
        <Row>
          <Col>
            <Image
              src={
                person.Image?.[0]?.url
                  ? `${BACKEND_HOST}${person.Image[0].url}`
                  : "https://placehold.co/200x300"
              }
              alt={displayName}
              fluid
            />
          </Col>
          <Col>
            <div className="product-related-content">
              <h4 className="product-related-person-name">{displayName}</h4>
              <p className="product-related-person-title">{displayTitle}</p>
              <p
                className="product-related-bio-text"
                dangerouslySetInnerHTML={{ __html: displayBio }}
              />
            </div>
            <Link
              to={`/person/${person.internal_url || person.id}`}
              className="product-related-more-link"
            >
              {t("btn_more")}
            </Link>
          </Col>
        </Row>
      </div>
    </Col>
  );
};

const ProductRelatedPerson = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const founders = location.state?.founder || [];
  const kols = location.state?.kol || [];
  const ambassadors = location.state?.spokesperson || [];
  const language = i18n.language;

  const isEmpty = founders.length === 0 && kols.length === 0 && ambassadors.length === 0;

  return (
    <Container className="related-page related-person-page">
      <button className="product-related-back-btn" onClick={() => navigate(-1)}>← 返回</button>
      <h2>相关人物</h2>
      <Row>
        {founders.map((p) => (
          <PersonCard key={p.id} person={p} language={language} />
        ))}
        {kols.map((p) => (
          <PersonCard key={p.id} person={p} language={language} />
        ))}
        {ambassadors.map((p) => (
          <PersonCard key={p.id} person={p} language={language} />
        ))}
        {isEmpty && <p>暂无相关人物</p>}
      </Row>
    </Container>
  );
};

export default ProductRelatedPerson;
