import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Image } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../css/BrandPage.css";

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

  useEffect(() => {
    axios
      .get(`${BACKEND_HOST}/api/brands?populate=logo`)
      .then(response => {
        if (response.data && response.data.data) {
          setBrands(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  // ✅ 处理点击事件，优先使用 `internal_url`，否则回退到 `id`
  const handleBrandClick = brand => {
    if (brand.internal_url) {
      navigate(`/brands/${brand.internal_url}`);
    } else {
      navigate(`/brands/${brand.id}`);
    }
  };

  return (
    <div>
      <Container>
        {/* ✅ `justify-content-start` 让不足 4 个卡片左对齐 */}
        <Row>
          {brands.map(brand => {
            const language = i18n.language;
            const brandName =
              language === "zh"
                ? brand.name_zh || "未知品牌"
                : brand.name_en || "Unknown Brand";
            const logoUrl = brand.logo?.url
              ? `${BACKEND_HOST}${brand.logo.url}`
              : "https://placehold.co/150x150";

            return (
              <Col
                key={brand.id}
                xs={12}
                sm={6}
                md={6}
              >
                <Card
                  onClick={() => handleBrandClick(brand)}
                  className="brand-card"
                >
                  {/* ✅ 使用 `Image` 组件，并设置固定大小 */}
                  <Image
                    src={logoUrl}
                    alt={brandName}
                    className='brand-card-img'
                    fluid
                  />
                  <Card.Body>
                    <Card.Title className='brand-card-title'>{brandName}</Card.Title>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </div>
  );
};

export default BrandPage;
