import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import "../css/KolDetail.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const KolDetail = () => {
  const { id: paramId } = useParams();
  const { t, i18n } = useTranslation();
  const [person, setPerson] = useState(null);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!paramId) {
      setError("No person ID provided");
      setLoading(false);
      return;
    }

    const fetchPersonData = async () => {
      try {
        let response = await axios.get(
          `${BACKEND_HOST}/api/people?filters[internal_url][$eq]=${paramId}&populate=*`
        );

        if (!response.data?.data.length) {
          response = await axios.get(
            `${BACKEND_HOST}/api/people?filters[id][$eq]=${paramId}&populate=*`
          );
        }

        if (response.data?.data.length > 0) {
          let personData = response.data.data[0];
          setPerson(personData);

          // 关联品牌
          if (personData.brands?.length > 0) {
            fetchBrandLogos(personData.brands.map(brand => brand.id));
          }

          // 关联产品
          if (personData.products?.length > 0) {
            fetchProducts(personData.products.map(product => product.id));
          }
        } else {
          setError("Person not found");
        }
      } catch (err) {
        setError("Error fetching person details");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [paramId]);

  // 获取品牌数据
  const fetchBrandLogos = async brandIds => {
    try {
      const brandResponse = await axios.get(
        `${BACKEND_HOST}/api/brands?filters[id][$in]=${brandIds.join(
          ","
        )}&populate=logo`
      );
      setBrands(brandResponse.data.data);
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // 获取产品数据
  const fetchProducts = async productIds => {
    try {
      const queryParams = productIds.map(id => `filters[id]=${id}`).join("&");
      const productResponse = await axios.get(
        `${BACKEND_HOST}/api/products?${queryParams}&populate=ProductImage`
      );
      setProducts(productResponse.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  if (loading) return <div className="loading">{t("loading")}</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!person) return <div className="error-message">No Data Available</div>;

  const language = i18n.language;
  const displayName = language === "zh" ? person.Name_zh || "未知" : person.Name_en || "Unknown";
  const displayTitle = language === "zh" ? person.Title_zh || "无头衔" : person.Title_en || "No Title";
  const displayBio = language === "zh" ? person.Bio_zh || "暂无简介" : person.Bio_en || "No biography available";
  const personImage = person.Image?.[0]?.url ? `${BACKEND_HOST}${person.Image[0].url}` : "https://placehold.co/280x280";

  return (
    <div className="person-detail-page">
      <Row className="person-detail-section">
        <Col md={7} className="person-info">
          <h1>{displayName}</h1>
          <h5>{displayTitle}</h5>
          <p dangerouslySetInnerHTML={{ __html: displayBio }}></p>
        </Col>

        <Col md={5} className="text-center person-image-container">
          <Image src={personImage} alt={displayName} className="person-image" />
        </Col>
      </Row>

      {/* 视频部分 */}
      {person.video && (
        <section className="video-section">
          <div className="video-container" dangerouslySetInnerHTML={{ __html: person.video }}></div>
        </section>
      )}

      {/* 关联品牌 */}
      {brands.length > 0 && (
        <section className="person-brand-section">
          <Container>
            <h3 className="section-title">{t("associatedBrands")}</h3>
            <Row className="justify-content-start">
              {brands.map(brand => (
                <Col key={brand.id} md={3} className="d-flex">
                  <Link to={`/brand/${brand.internal_url || brand.id}`} className="person-card-link">
                    <Card className="person-brand-card">
                      <Card.Img
                        src={brand.logo?.url ? `${BACKEND_HOST}${brand.logo.url}` : "https://placehold.co/250x150"}
                        alt={brand.name_en}
                      />
                      <Card.Body>
                        <Card.Title className="person-card-title">{brand.name_zh || brand.name_en}</Card.Title>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}

      {/* 关联产品 */}
      {products.length > 0 && (
        <section className="person-product-section">
          <Container>
            <h3 className="section-title">{t("highlightedProduct")}</h3>
            <Row className="justify-content-start">
              {products.map(product => (
                <Col key={product.id} md={3} className="d-flex">
                  <Link to={`/product/${product.url || product.id}`} className="person-card-link">
                    <Card className="person-product-card">
                      <Card.Img
                        src={product.ProductImage?.url ? `${BACKEND_HOST}${product.ProductImage.url}` : "https://placehold.co/300x200"}
                        alt={product.Name_en || "Product"}
                      />
                      <Card.Body>
                        <Card.Title className="person-card-title">{product.Name_zh || product.Name_en}</Card.Title>
                        <Card.Text className="person-card-price">${product.Price || "N/A"}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              ))}
            </Row>
          </Container>
        </section>
      )}
    </div>
  );
};

export default KolDetail;