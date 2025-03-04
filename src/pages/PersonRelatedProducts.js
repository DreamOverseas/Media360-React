import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import "../css/PersonRelated.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const PersonRelatedProducts = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const products = location.state?.products || [];
  const currentLang = i18n.language;

  return (
    <div className='related-page'>
      <Container>
        <h2 className='section-title'>{t("related_products")}</h2>
        {products.length > 0 ? (
          <Row>
            {products.map(product => (
              <Col key={product.id} xs={12} md={6} lg={6}>
                <Link
                  to={`/products/${product.url || product.id}`}
                  className='related-card-link'
                >
                  <Card className='related-card'>
                    <Card.Img
                      src={
                        product.ProductImage?.url
                          ? `${BACKEND_HOST}${product.ProductImage.url}`
                          : "https://placehold.co/120x120"
                      }
                      alt={
                        currentLang === "zh"
                          ? product.Name_zh
                          : product.Name_en || "Product"
                      }
                      className='related-card-img'
                    />
                    <Card.Body className='related-card-body'>
                      <Card.Title className='related-card-title'>
                        {currentLang === "zh"
                          ? product.Name_zh
                          : product.Name_en}
                      </Card.Title>
                      <Card.Text className='related-card-text'>
                        {currentLang === "zh"
                          ? product.Short_zh
                          : product.Short_en || t("no_description")}
                      </Card.Text>
                      <Card.Text className='related-card-price'>
                        {t("price")}: $
                        {product.Price_Display || product.Price || "N/A"}
                      </Card.Text>
                      <Link
                        to={`/products/${product.url || product.id}`}
                        className='read-more-btn'
                      >
                        {t("view_details")}
                      </Link>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        ) : (
          <p className='no-products-text'>{t("no_related_products")}</p>
        )}
      </Container>
    </div>
  );
};

export default PersonRelatedProducts;
