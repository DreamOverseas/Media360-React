import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Banner from "../components/Banner";
import "../css/Home.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const HomePage = () => {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);

  // --- Local Storage Helpers ---
  const setWithExpiry = (key, value, ttl) => {
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  // --- Data Fetching ---
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let countryCode = getWithExpiry('user_country_code');

        if (!countryCode) {
          const ipRes = await axios.get('https://ipapi.co/json/');
          countryCode = ipRes.data.country_code;
          setWithExpiry('user_country_code', countryCode, 24 * 60 * 60 * 1000);
        }

        const response = await axios.get(
          `${BACKEND_HOST}/api/products`, {
            params: {
              "sort": "Order:desc",
              "populate": "*",
              "filters[$or][0][MainCollectionProduct][$eq]": true,
              "filters[$or][1][SingleProduct][$eq]": true,
            },
          }
        );
        let allProducts = response.data.data;

        if (countryCode === 'CN') {
          allProducts = allProducts.filter(product => !product.BlockInChina);
        }

        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const language = i18n.language;

  // --- Render Component ---
  return (
    <div className="homepage-wrapper">
      
      {/* Hero Section - Full Width, No Border/Board */}
      <div className="hero-section">
        <Banner />
      </div>

      {/* Products Section */}
      <section className="content-section">
        <Container>
          {/* Section Header with Blue Label */}
          <div className="section-header text-center">
            <span className="section-label-blue">
              {t("home_page.product_experience")}
            </span>
          </div>

          <div className="product-grid-container">
            <Row className="g-4 justify-content-center">
              {products.map((product) => {
                const Name = language === "zh" ? product.Name_zh : product.Name_en;
                const Short = language === "zh" ? product.Short_zh : product.Short_en;
                const imageUrl = product.ProductImage?.url 
                  ? `${BACKEND_HOST}${product.ProductImage.url}` 
                  : "https://placehold.co/400x300?text=No+Image";

                return (
                  <Col xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <Link to={`/products/${product.url}`} className="card-link-wrapper">
                      <Card className="modern-product-card h-100">
                        {/* Image Container with #AAD6FA background */}
                        <div className="card-img-wrapper">
                          <Card.Img 
                            variant="top" 
                            src={imageUrl} 
                            alt={Name} 
                            loading="lazy"
                          />
                        </div>
                        
                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="product-title" title={Name}>
                            {Name}
                          </Card.Title>
                          <Card.Text className="product-desc">
                            {Short}
                          </Card.Text>
                          <div className="mt-auto pt-3">
                             <span className="read-more-link">
                               {t("btn_more") || "View Details"} &rarr;
                             </span>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </div>
        </Container>
      </section>

      <div className="bottom-spacing"></div>
    </div>
  );
};

export default HomePage;