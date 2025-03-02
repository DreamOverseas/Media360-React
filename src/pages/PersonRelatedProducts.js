import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../css/PersonRelated.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const PersonRelatedProducts = () => {
  const location = useLocation();
  const products = location.state?.products || [];

  return (
    <div className='related-page'>
      <Container>
        <h2 className='section-title'>相关产品</h2>
        {products.length > 0 ? (
          <Row className='related-container'>
            {products.map(product => (
              <Col key={product.id} xs={12}>
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
                      alt={product.Name_zh || "Product"}
                      className='related-card-img'
                    />
                    <Card.Body className='related-card-body'>
                      <Card.Title className='related-card-title'>
                        {product.Name_zh || product.Name_en}
                      </Card.Title>
                      <Card.Text className='related-card-text'>
                        {product.Description_zh ||
                          product.Description_en ||
                          "暂无简介"}
                      </Card.Text>
                      <Card.Text className='related-card-price'>
                        价格: ${product.Price_Display || product.Price || "N/A"}
                      </Card.Text>
                      <Link
                        to={`/products/${product.url || product.id}`}
                        className='read-more-btn'
                      >
                        查看详情
                      </Link>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        ) : (
          <p className='no-products-text'>暂无相关产品</p>
        )}
      </Container>
    </div>
  );
};

export default PersonRelatedProducts;
