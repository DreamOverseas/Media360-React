import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import "../css/PersonRelated.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const PersonRelatedBrands = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const brands = location.state?.brands || [];
  const currentLang = i18n.language;

  return (
    <div className='related-page'>
      <Container>
        <h2 className='related-title'>{t("related_brands")}</h2>
        {brands.length > 0 ? (
          <Row className='related-container'>
            {brands.map(brand => {
              const brandUrl = `/brands/${brand.internal_url || brand.id}`;
              const brandImage = brand.logo?.url
                ? `${BACKEND_HOST}${brand.logo.url}`
                : "https://placehold.co/120x120";

              return (
                <Col key={brand.id} xs={12}>
                  <Link to={brandUrl} className='related-card-link'>
                    <Card className='related-card'>
                      <Card.Img
                        src={brandImage}
                        alt={
                          currentLang === "zh"
                            ? brand.name_zh
                            : brand.name_en || "Brand"
                        }
                        className='related-card-img'
                      />
                      <Card.Body className='related-card-body'>
                        <Card.Title className='related-card-title'>
                          {currentLang === "zh"
                            ? brand.name_zh
                            : brand.name_en || t("unknown_brand")}
                        </Card.Title>
                        <Card.Text className='related-card-text'>
                          {currentLang === "zh"
                            ? brand.description_zh
                            : brand.description_en || t("no_description")}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        ) : (
          <p className='no-brands-text'>{t("no_related_brands")}</p>
        )}
      </Container>
    </div>
  );
};

export default PersonRelatedBrands;
