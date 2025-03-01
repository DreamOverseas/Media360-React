import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../css/PersonRelated.css";

const PersonRelatedProducts = () => {
  const location = useLocation();
  const products = location.state?.products || [];

  return (
    <Container className='related-page'>
      <h2 className='related-title'>相关产品</h2>
      <Row>
        {products.length > 0 ? (
          products.map(product => (
            <Col key={product.id} md={4}>
              <Link
                to={`/product/${product.url || product.id}`}
                className='card-link'
              >
                <Card className='related-card'>
                  <Card.Img
                    src={
                      product.ProductImage?.url
                        ? `${process.env.REACT_APP_STRAPI_HOST}${product.ProductImage.url}`
                        : "https://placehold.co/300x200"
                    }
                    alt={product.Name_en || "Product"}
                  />
                  <Card.Body>
                    <Card.Title>
                      {product.Name_zh || product.Name_en}
                    </Card.Title>
                    <Card.Text>价格: ${product.Price || "N/A"}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <p>暂无相关产品</p>
        )}
      </Row>
    </Container>
  );
};

export default PersonRelatedProducts;
