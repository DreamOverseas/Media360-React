import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Container, Image, Row, Col } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import "../css/BrandDetail.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const BrandDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [brand, setBrand] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("No brand ID provided");
      setLoading(false);
      return;
    }

    const fetchBrandData = async () => {
      try {
        let response = await axios.get(
          `${BACKEND_HOST}/api/brands?filters[internal_url][$eq]=${id}&populate=*`
        );

        if (!response.data?.data.length) {
          response = await axios.get(
            `${BACKEND_HOST}/api/brands?filters[id][$eq]=${id}&populate=*`
          );
        }

        if (response.data?.data.length > 0) {
          setBrand(response.data.data[0]);
        } else {
          setError("Brand not found");
        }
      } catch (err) {
        setError("Error fetching brand details");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [id]);

  if (loading) return <div className="loading">{t("loading")}</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!brand) return <div className="error-message">No Data Available</div>;

  const language = i18n.language;
  const Name = language === "zh" ? brand.name_zh || "未知品牌" : brand.name_en || "Unknown Brand";
  const Description = language === "zh" ? brand.description_zh || "暂无介绍" : brand.description_en || "No description available";
  const Website = brand.official_website_url ? (
    <a href={brand.official_website_url} target="_blank" rel="noopener noreferrer" className="btn-outline-black">
      {t("officialWebsite")}
    </a>
  ) : "暂无";

  const Logo = brand.logo?.url ? `${BACKEND_HOST}${brand.logo.url}` : "https://placehold.co/600x400";

  return (
    <div className="brand-detail-page">
      <section className="brand-detail-header">
        <Container>
          <Row className="align-items-center text-center">
            <Col xs={12}>
              <Image src={Logo} alt={Name} className="brand-logo" />
            </Col>
            <Col xs={12}>
              <h1 className="brand-title">{Name}</h1>
              <p className="brand-description">{Description}</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ✅ 资源整合/支持/推广按钮 */}
      <Container>
        <div className="brand-actions">
          <Button className="btn-outline-black">{t("resourceIntegration")}</Button>
          <Button className="btn-outline-black">{t("innovationSupport")}</Button>
          <Button className="btn-outline-black">{t("publicWelfare")}</Button>
        </div>
      </Container>

      {/* ✅ 官网 & 邮箱 按钮 */}
      <Container>
        <div className="brand-contact">
          {Website}
          <Button className="btn-outline-black">{t("email")}</Button>
        </div>
      </Container>

      {/* ✅ 相关信息跳转按钮 */}
      <Container>
        <div className="brand-related-section">
          <Link to="/related-persons" className="btn-link-black">
            {t("relatedPersons")}
          </Link>
          <Link to="/related-news" className="btn-link-black">
            {t("relatedNews")}
          </Link>
          <Link to="/related-products" className="btn-link-black">
            {t("relatedProducts")}
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default BrandDetail;