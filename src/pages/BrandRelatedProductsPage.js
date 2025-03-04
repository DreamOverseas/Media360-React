import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import "../css/BrandRelated.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const BrandRelatedProductPage = () => {
  const { state } = useLocation();
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language;

  // 获取产品数据
  const products = state?.products ?? [];

  return (
    <div className='related-page'>
      <Container>
        <h2 className='section-title'>{t("relatedProducts")}</h2>
        {products.length > 0 ? (
          <Row className='related-container'>
            {products.map(product => {
              const productPath = `/products/${product.url || product.id}`;

              return (
                <Col key={product.id} xs={12}>
                  <Link to={productPath} className='related-card-link'>
                    <Card className='related-card'>
                      <Card.Img
                        src={
                          product.ProductImage?.url
                            ? `${BACKEND_HOST}${product.ProductImage.url}`
                            : "https://placehold.co/150x150"
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
                            ? product.Description_zh
                            : product.Description_en ||
                              t("noDescriptionAvailable")}
                        </Card.Text>
                        <Card.Text className='related-card-price'>
                          ${product.Price_Display || product.Price || "N/A"}
                        </Card.Text>
                        <Link to={productPath} className='read-more-btn'>
                          {t("readMore")}
                        </Link>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        ) : (
          <p className='no-products-text'>{t("noProductsAvailable")}</p>
        )}
      </Container>
    </div>
  );
};

export default BrandRelatedProductPage;
