import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../css/ProductRelated.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const ProductRelatedBrand = () => {
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const language = i18n.language;
    const brand = location.state?.brand || null;

    const brandUrl = `/brands/${brand.internal_url || brand.id}`;
    const brandImage = brand.logo?.url
    ? `${BACKEND_HOST}${brand.logo.url}`
    : "https://placehold.co/120x120";

    const BrandName = language === "zh" ? brand.name_zh : brand.name_en;

    const BrandDetail = language === "zh" ? brand.description_zh : brand.description_en;

  return (
    <div className='product-related-brand-page'>
      <Container>
        <h2 className='product-related-brand-title'>相关品牌</h2>
        {brand ? (
          <Row className='product-related-brand-container'>
                <Link to={brandUrl} className='product-related-brand-card-link'>
                <Card className='product-related-brand-card'>
                    <Card.Img
                    src={brandImage}
                    alt={BrandName}
                    className='product-related-brand-card-img'
                    />
                    <Card.Body className='product-related-brand-card-body'>
                    <Card.Title className='product-related-brand-card-title'>
                        {BrandName}
                    </Card.Title>
                    <Card.Text className='product-related-brand-card-text'>
                        {BrandDetail}
                    </Card.Text>
                    </Card.Body>
                </Card>
                </Link>
          </Row>
        ) : (
          <p className='product-related-brand-text'>暂无相关品牌</p>
        )}
      </Container>
    </div>
  );
};

export default ProductRelatedBrand;