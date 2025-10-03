/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import Slider from "react-slick"; // ✅ 引入 react-slick
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import "../css/BrandDetail.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
const DEBUG = import.meta.env.DEBUG;

const BrandDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [brand, setBrand] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [persons, setPersons] = useState([]);
  const [news, setNews] = useState([]);
  const [products, setProducts] = useState([]);
  const [expanded, setExpanded] = useState(false); // 仅在移动端控制简介展开/折叠
  const [selectedImage, setSelectedImage] = useState(null);
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
        if (DEBUG) console.log("🧐 Brand API Response:", response.data); // ✅ 查看完整 API 响应数据
        if (!response.data?.data.length) {
          response = await axios.get(
            `${BACKEND_HOST}/api/brands?filters[id][$eq]=${id}&populate=*`
          );
        }

        if (response.data?.data.length > 0) {
          const brandData = response.data.data[0];
          setBrand(brandData);

          if (brandData.people?.length > 0) {
            let personIds = brandData.people.map(person => person.id);
            fetchPersons(personIds);
          }

          if (brandData.news?.length > 0) {
            let newsIds = brandData.news.map(newsItem => newsItem.id);
            fetchNews(newsIds);
          }
          if (brandData.Gallery?.length > 0) {
            setSelectedImage(`${BACKEND_HOST}${brandData.Gallery[0].url}`);
          }

          if (brandData.products?.length > 0) {
            let productIds = brandData.products.map(product => product.id);
            fetchProducts(productIds);
          }
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

  const fetchPersons = async personIds => {
    try {
      const queryParams = personIds
        .map(id => `filters[id][$eq]=${id}`)
        .join("&");
      const response = await axios.get(
        `${BACKEND_HOST}/api/people?${queryParams}&populate=Image`
      );
      setPersons(response.data.data || []);
    } catch (error) {
      console.error("Error fetching persons:", error);
    }
  };

  const fetchNews = async newsIds => {
    try {
      const queryParams = newsIds.map(id => `filters[id][$eq]=${id}`).join("&");
      const response = await axios.get(
        `${BACKEND_HOST}/api/news?${queryParams}&populate=Image`
      );
      setNews(response.data.data || []);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  const fetchProducts = async productIds => {
    try {
      if (!productIds || productIds.length === 0) {
        return;
      }
      const queryParams = productIds
        .map(id => `filters[id][$eq]=${id}`)
        .join("&");
      const response = await axios.get(
        `${BACKEND_HOST}/api/products?${queryParams}&populate=*`
      );
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  if (loading) return <div className='loading'>{t("loading")}</div>;
  if (error) return <div className='error-message'>{error}</div>;
  if (!brand) return <div className='error-message'>No Data Available</div>;

  const language = i18n.language;
  const Name =
    language === "zh"
      ? brand.name_zh || "未知品牌"
      : brand.name_en || "Unknown Brand";
  const Description =
    language === "zh"
      ? brand.description_zh || "暂无介绍"
      : brand.description_en || "No description available";
  const tagsArray = brand?.tags?.tags ?? [];
  const brandEmail = brand?.Email || null;
  if (DEBUG) console.log("🔍 Brand Object:", brand); // ✅ 确保 `brand` 正常
  if (DEBUG) console.log("📧 Email Field:", brand?.Email); // ✅ 确保 `email` 存在
  const galleryImages = brand?.Gallery || [];
  if (DEBUG) console.log("🖼 Parsed Gallery Images:", galleryImages);
  const Website = brand.official_website_url ? (
    <a
      href={brand.official_website_url}
      target='_blank'
      rel='noopener noreferrer'
      className='btn-outline-black'
    >
      {t("officialWebsite")}
    </a>
  ) : (
    <Button className='btn-outline-black' disabled>
      {t("noWebsite")}
    </Button>
  );

  const EmailButton = brandEmail ? (
    <a href={`mailto:${brandEmail}`} className='btn-outline-black'>
      {t("email")}
    </a>
  ) : (
    <Button className='btn-outline-black' disabled>
      {t("noEmail")}
    </Button>
  );
  // ✅ 自定义箭头按钮（需要在 BrandDetail.js 文件中定义）
  const SampleNextArrow = props => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", right: "10px", zIndex: 10 }}
        onClick={onClick}
      >
        ➡
      </div>
    );
  };

  const SamplePrevArrow = props => {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, display: "block", left: "10px", zIndex: 10 }}
        onClick={onClick}
      >
        ⬅
      </div>
    );
  };

  // 📌 画廊轮播
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1, // ✅ 只显示一张图
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className='brand-detail-page'>
      <section className='brand-detail-header'>
        <Container>
          <Row className='align-items-center'>
            <Col xs={12} md={4} className='text-center text-md-left'>
              <Image
                src={
                  brand.logo?.url
                    ? `${BACKEND_HOST}${brand.logo.url}`
                    : "https://placehold.co/600x400"
                }
                alt={Name}
                className='brand-logo'
              />
            </Col>

            <Col xs={12} md={8}>
              <div className='brand-info'>
                <h1 className='brand-title'>{Name}</h1>

                {tagsArray.length > 0 && (
                  <div className='brand-tags'>
                    {tagsArray.map((tag, index) => (
                      <span key={index} className='brand-tag'>
                        {t(tag)}
                      </span>
                    ))}
                  </div>
                )}
                {/* ✅ 根据角色显示不同的联系按钮 
                <div className='brand-contact-row'>
                  {Website}
                  {EmailButton}
                </div>*/}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container>
        <div className='brand-intro'>
          <h3 className='brand-intro-title'>{t("introduction")}</h3>
          <p className={`brand-intro-content ${expanded ? "expanded" : ""}`}>
            {Description}
          </p>
          <button className='toggle-btn' onClick={() => setExpanded(!expanded)}>
            {expanded ? t("collapse") : t("expand")}
          </button>
        </div>
      </Container>

      {galleryImages.length > 0 && (
        <Container>
          <div className='brand-gallery'>
            <Slider {...settings} className='gallery-slider'>
              {galleryImages.map(image => (
                <div key={image.id} className='gallery-item'>
                  <Image
                    src={`${BACKEND_HOST}${image.url}`}
                    alt={image.name}
                    className='gallery-image'
                  />
                </div>
              ))}
            </Slider>
          </div>
        </Container>
      )}
      <Container>
        <div className='brand-related-section'>
          <h3>{t("relatedInformation")}</h3>
          <div className='brand-related-buttons'>
            {persons.length > 0 && (
              <Link
                to={`/brands/${brand.internal_url}/related-person`}
                className='btn-outline-black'
                state={{ persons }}
              >
                {t("relatedPersons")}
              </Link>
            )}
            {products.length > 0 && (
              <Link
                to={`/brands/${brand.internal_url}/related-product`}
                className='btn-outline-black'
                state={{ products }}
              >
                {t("relatedProducts")}
              </Link>
            )}
            {news.length > 0 && (
              <Link
                to={`/brands/${brand.internal_url}/related-news`}
                className='btn-outline-black'
                state={{ news }}
              >
                {t("relatedNews")}
              </Link>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BrandDetail;
