import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const BrandPage = () => {
  const [brands, setBrands] = useState([]);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

  useEffect(() => {
    axios
      .get(`${BACKEND_HOST}/api/brands?populate=logo`)
      .then((response) => {
        if (response.data && response.data.data) {
          setBrands(response.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, []);

  // ✅ 处理点击事件，优先使用 `internal_url`，否则回退到 `id`
  const handleBrandClick = (brand) => {
    if (brand.internal_url) {
      navigate(`/brand/${brand.internal_url}`);
    } else {
      navigate(`/brand/${brand.id}`);
    }
  };

  return (
    <div>
      {/* ✅ 保留之前的 `banner` */}
      <section className="product-page-background-image-container">
        <h1 className="product-page-banner-h1">
          <b>{t("brand")}</b>
        </h1>
      </section>

      <Container>
        {/* ✅ `justify-content-start` 让不足 4 个卡片左对齐 */}
        <Row className="justify-content-start">
          {brands.map((brand) => {
            const language = i18n.language;
            const brandName =
              language === "zh" ? brand.name_zh || "未知品牌" : brand.name_en || "Unknown Brand";
            const logoUrl =
              brand.logo?.url ? `${BACKEND_HOST}${brand.logo.url}` : "https://placehold.co/150x150";

            return (
              <Col key={brand.id} xs={12} sm={6} md={4} lg={3} className="d-flex">
                <Card onClick={() => handleBrandClick(brand)} className="brand-card">
                  <Card.Img variant="top" src={logoUrl} alt={brandName} className="brand-card-img" />
                  <Card.Body className="d-flex flex-column justify-content-between">
                    <Card.Title className="brand-card-title text-center">{brandName}</Card.Title>
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