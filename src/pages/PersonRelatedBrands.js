import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../css/PersonRelated.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const PersonRelatedBrands = () => {
  const location = useLocation();
  const brands = location.state?.brands || [];

  console.log("Brand Data:", brands); // ✅ 检查数据结构

  return (
    <div className='related-page'>
      <Container>
        <h2 className='related-title'>相关品牌</h2>
        {brands.length > 0 ? (
          <Row className='related-container'>
            {brands.map(brand => {
              const brandUrl = `/brand/${brand.internal_url || brand.id}`;
              const brandImage = brand.logo?.url
                ? `${BACKEND_HOST}${brand.logo.url}`
                : "https://placehold.co/120x120";

              return (
                <Col key={brand.id} xs={12}> {/* ✅ 让卡片显示 3 列布局 */}
                  <Link to={brandUrl} className='related-card-link'>
                    <Card className='related-card'>
                      {/* ✅ 左侧图片，限制大小，防止塌陷 */}
                      <Card.Img
                        src={brandImage}
                        alt={brand.name_en || "Brand"}
                        className='related-card-img'
                      />
                      {/* ✅ 右侧文本 */}
                      <Card.Body className='related-card-body'>
                        <Card.Title className='related-card-title'>
                          {brand.name_zh || brand.name_en || "未知品牌"}
                        </Card.Title>
                        <Card.Text className='related-card-text'>
                          {brand.description_zh || brand.description_en || "暂无简介"}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        ) : (
          <p className='no-brands-text'>暂无相关品牌</p>
        )}
      </Container>
    </div>
  );
};

export default PersonRelatedBrands;