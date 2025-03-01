import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../css/PersonRelated.css";

const PersonRelatedBrands = () => {
  const location = useLocation();
  const brands = location.state?.brands || [];

  return (
    <Container className='related-page'>
      <h2 className='related-title'>相关品牌</h2>
      <Row>
        {brands.length > 0 ? (
          brands.map(brand => (
            <Col key={brand.id} md={4}>
              <Link
                to={`/brand/${brand.internal_url || brand.id}`}
                className='card-link'
              >
                <Card className='related-card'>
                  <Card.Img
                    src={
                      brand.logo?.url
                        ? `${process.env.REACT_APP_STRAPI_HOST}${brand.logo.url}`
                        : "https://placehold.co/250x150"
                    }
                    alt={brand.name_en}
                  />
                  <Card.Body>
                    <Card.Title>{brand.name_zh || brand.name_en}</Card.Title>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <p>暂无相关品牌</p>
        )}
      </Row>
    </Container>
  );
};

export default PersonRelatedBrands;
