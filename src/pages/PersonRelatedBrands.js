import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../css/PersonRelated.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const PersonRelatedBrands = () => {
  const location = useLocation();
  const brands = location.state?.brands || [];

  return (
    <Container className='related-page'>
      <h2 className='related-title'>相关品牌</h2>
      <Row>
        {brands.length > 0 ? (
          brands.map(brand => {
            const brandUrl = `/brand/${brand.internal_url || brand.id}`;
            const brandImage = brand.logo?.url
              ? `${BACKEND_HOST}${brand.logo.url}`
              : "https://placehold.co/150x150";

            return (
              <Col key={brand.id} xs={12} md={6} lg={4} className='mb-3'>
                <Link to={brandUrl} className='related-card-link'>
                  <Card className='related-card'>
                    {/* 左侧图片 */}
                    <Card.Img
                      src={brandImage}
                      alt={brand.name_en}
                      className='related-card-img'
                    />
                    {/* 右侧文本 */}
                    <Card.Body className='related-card-body'>
                      <Card.Title className='related-card-title'>
                        {brand.name_zh || brand.name_en}
                      </Card.Title>
                      <Card.Text className='related-card-text'>
                        {brand.description_zh ||
                          brand.description_en ||
                          "暂无简介"}
                      </Card.Text>
                      <Link to={brandUrl} className='read-more-btn'>
                        查看更多
                      </Link>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            );
          })
        ) : (
          <p>暂无相关品牌</p>
        )}
      </Row>
    </Container>
  );
};

export default PersonRelatedBrands;
