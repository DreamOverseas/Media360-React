import axios from "axios";
import React, { useState, useEffect } from "react";
import "../Css/Home.css";
import { Container, Row, Col, Image, Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCampground, faChartLine, faHandshake } from '@fortawesome/free-solid-svg-icons';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';

const Home = () => {
  // Read Env from file
  const CMS_endpoint = import.meta.env.VITE_CMS_ENDPOINT;
  const CMS_token = import.meta.env.VITE_CMS_TOKEN;
  const baseUrl = import.meta.env.BASE_URL;
  const BACKEND_HOST = import.meta.env.VITE_CMS_ENDPOINT;
  const DBLink_LH = 'https://book-directonline.com/properties/roseneathholidaypark-1';
  const chateauBookingUrl = 'https://book-directonline.com/properties/waterfrontpropertywallisprivateislandforster-';
  const bannerImage = `${baseUrl}home/background_image.webp`;
  const bannerImageChateau = `${baseUrl}chateau.jpeg`;
  const bannerSlides = [
    { image: bannerImage, position: 'left center' },
    { image: bannerImageChateau, position: 'center center' },
  ];
  const chateauDescriptionEn = 'Welcome to a palatial mansion on a secluded island off the beautiful New South Wales north coast.';
  const chateauDescriptionZh = '欢迎来到新南威尔士州北海岸外一座与世隔绝的岛屿上的宏伟府邸。';

  const { t, i18n } = useTranslation();

  const [gallery, setGallery] = useState([]);
  const [products, setProducts] = useState([]);

  // --- Local Storage Helpers ---
  const setWithExpiry = (key, value, ttl) => {
    const item = { value, expiry: Date.now() + ttl };
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

  const homeSections = [
    {
      title: "关于我们",
      subtitle: "About Us",
      description: "了解我们如何以自然、社群与可持续理念打造 360 生活方式。",
      route: "/about-us",
      image: `${baseUrl}home/background_image.webp`,
    },
    {
      title: "资产与投资",
      subtitle: "Assets & Investment",
      description: "探索生态资产、运营模式与长期价值增长路径。",
      route: "/eco-living-assets",
      image: `${baseUrl}home/home_landscape.webp`,
    },
    {
      title: "360 智能卡",
      subtitle: "360 Smart Card",
      description: "查看会员权益、积分体系与生态场景下的应用方式。",
      route: "/book-membership",
      image: "/360_smart_card.jpg",
    },
    {
      title: "生态实验园",
      subtitle: "Eco-Living Lab",
      description: "进入创新实验场，了解未来生态居住与运营实践。",
      route: "/innovation-lab",
      image: `${baseUrl}home/home_life.jpg`,
    },
  ];

  const features = [
    {
      icon: faCampground,
      alt: "Explore Stay",
      textKey: "home_feature_explore_stay",
      route: "/individual-visitors",
      colorTheme: "green",
    },
    {
      icon: faChartLine,
      alt: "Explore Investment",
      textKey: "home_feature_explore_investment",
      route: "/investment",
      colorTheme: "purple",
    },
    {
      icon: faHandshake,
      alt: "Become a Partner",
      textKey: "home_feature_become_partner",
      route: "/cooperation",
      colorTheme: "orange",
    },
  ];

  useEffect(() => {
    const fetchGalleryPreview = async () => {
      try {
        const response = await axios.get(`${CMS_endpoint}/api/media-images?filters[PageLocation][$eq]=media-gallery&populate=Image`, {
          headers: {
            Authorization: `Bearer ${CMS_token}`,
          },
        });

        // Check the data structure and safely retrieve the images
        const images = response.data.data[0].Image;
        if (images) {
          setGallery(images);
        } else {
          console.warn("No images found in response data.");
        }
      } catch (error) {
        console.error("Error loading:", error);
      }
    };

    fetchGalleryPreview();
  }, [CMS_endpoint, CMS_token]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let countryCode = getWithExpiry('user_country_code');
        if (!countryCode) {
          const ipRes = await axios.get('https://ipapi.co/json/');
          countryCode = ipRes.data.country_code;
          setWithExpiry('user_country_code', countryCode, 24 * 60 * 60 * 1000);
        }

        const response = await axios.get(`${BACKEND_HOST}/api/products`, {
          params: {
            "sort": "Order:desc",
            "populate": "*",
            "filters[$or][0][MainCollectionProduct][$eq]": true,
            "filters[$or][1][SingleProduct][$eq]": true,
          },
        });
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
  }, [BACKEND_HOST]);

  const gallery_sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const bannerSliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    arrows: false,
    swipe: true,
    draggable: true,
    pauseOnHover: false,
  };

  return (
    <main className="home-page">
      <div>
        <section className="home-banner-title">
          <div className="home-banner-background-slider">
            <Slider {...bannerSliderSettings}>
              {bannerSlides.map((slide, index) => (
                <div key={index}>
                  <div
                    className="home-banner-bg-slide"
                    style={{
                      backgroundImage: `url(${slide.image})`,
                      backgroundPosition: slide.position,
                    }}
                  />
                </div>
              ))}
            </Slider>
          </div>
          <div className="home-banner-content">
            <h1>{t("home_hero_title")}</h1>
            <strong><h1>{t("home_hero_subtitle")}</h1></strong>
          </div>
        </section>

        <section className="home-banner-subtitle">
          <Container>
            <h1>{t("home_cheerup")}</h1>
            <Row >
              {features.map((feature, index) => {
                return (
                  <Col
                    key={index}
                    xs={12}
                    md={4}
                  >
                    <Link to={feature.route} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Card className={`text-center home-clickable-card home-clickable-card-${feature.colorTheme}`}>
                        <Card.Body>
                          <FontAwesomeIcon
                            icon={feature.icon}
                            className={`our-service-button our-service-button-${feature.colorTheme}`}
                            title={feature.alt}
                          />
                          <Card.Title>{t(feature.textKey)}</Card.Title>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </section>

        <section className="activities-section">
          <Container>
            {/* Section Header */}
            <div className="section-header text-center">
              <span className="section-label-blue">
                {t("home_page.product_experience")}
              </span>
            </div>

            <div className="product-grid-container">
              <Row className="g-4 justify-content-center">
                {products.map((product) => {
                  const Name = i18n.language === "zh" ? product.Name_zh : product.Name_en;
                  const Short = i18n.language === "zh" ? product.Short_zh : product.Short_en;
                  const imageUrl = product.ProductImage?.url
                    ? `${BACKEND_HOST}${product.ProductImage.url}`
                    : "https://placehold.co/400x300?text=No+Image";

                  return (
                    <Col xs={12} sm={6} md={4} lg={3} key={product.id}>
                      <Link to={`/products/${product.url}`} className="card-link-wrapper">
                        <Card className="modern-product-card h-100">
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

        <section className="home-feature-links">
          <Container>
            <Link to={homeSections[0].route} className="home-feature-link-card">
              <div
                className="home-feature-link-bg"
                style={{ backgroundImage: `url(${homeSections[0].image})` }}
              />
              <div className="home-feature-link-content">
                <p>{homeSections[0].subtitle}</p>
                <h2>{homeSections[0].title}</h2>
                <span>{homeSections[0].description}</span>
              </div>
            </Link>
          </Container>
        </section>

        <section className="home-gallery">
          <Container>
            <h1>{t("Gallery")}</h1>
            <Slider {...gallery_sliderSettings}>
              {gallery.map(picture => (
                <div key={picture.id} className="gallery-slider">
                  {picture.url ? (
                    <Image
                      variant="top"
                      src={`${CMS_endpoint}${picture.url}`}
                      alt={picture.Name}
                      className="gallery-slider-img"
                      thumbnail
                    />
                  ) : (
                    <Image
                      variant="top"
                      src="https://placehold.co/250x350"
                      alt="Placeholder"
                      className="gallery-slider-img"
                      thumbnail
                    />
                  )}
                </div>
              ))}
            </Slider>
            <div className="more-btn-container">
              <a href="/gallery" className="gallery-link">
                {t("btn_more")}
              </a>
            </div>
          </Container>
        </section>

        <section className="home-feature-links">
          <Container>
            {homeSections.slice(1).map((section) => (
              <Link key={section.route} to={section.route} className="home-feature-link-card">
                <div
                  className="home-feature-link-bg"
                  style={{ backgroundImage: `url(${section.image})` }}
                />
                <div className="home-feature-link-content">
                  <p>{section.subtitle}</p>
                  <h2>{section.title}</h2>
                  <span>{section.description}</span>
                </div>
              </Link>
            ))}
          </Container>
        </section>
      </div>
    </main>
  );
};

export default Home;
