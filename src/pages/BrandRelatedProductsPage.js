import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import "../css/BrandRelated.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const BrandRelatedProductPage = () => {
  const { state } = useLocation();
  const { t } = useTranslation();

  // 获取产品数据
  const products = state?.products ?? [];

  return (
    <div className='brand-related-products-page'>
      <Container>
        <h2 className='page-title'>{t("relatedProducts")}</h2>
        {products.length > 0 ? (
          <Row>
            {products.map(product => (
              <Col key={product.id} xs={12} sm={6} md={4} lg={3}>
                <Link
                  to={`/product/${product.id}`}
                  className='product-card-link'
                >
                  <Card className='product-card'>
                    <Card.Img
                      src={
                        product.ProductImage?.url
                          ? `${BACKEND_HOST}${product.ProductImage.url}`
                          : "https://placehold.co/300x200"
                      }
                      alt={product.Name_zh || "Product"}
                      className='product-card-img'
                    />
                    <Card.Body>
                      <Card.Title className='product-card-title'>
                        {product.Name_zh || product.Name_en}
                      </Card.Title>
                      <Card.Text className='product-card-price'>
                        ${product.Price_Display || product.Price || "N/A"}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        ) : (
          <p className='no-products-text'>{t("noProductsAvailable")}</p>
        )}
      </Container>
    </div>
  );
};

export default BrandRelatedProductPage;
