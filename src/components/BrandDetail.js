import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
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
  const [persons, setPersons] = useState([]); // 相关人物
  const [news, setNews] = useState([]); // 相关新闻
  const [products, setProducts] = useState([]); // 相关产品

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
            `${BACKEND_HOST}/api/brands?filters[id][$eq]==${id}&populate=*`
          );
        }

        if (response.data?.data.length > 0) {
          const brandData = response.data.data[0];
          setBrand(brandData);

          // 获取相关人物
          if (brandData.people?.length > 0) {
            let personIds = brandData.people.map(person => person.id);
            fetchPersons(personIds);
          }

          // 获取相关新闻
          if (brandData.news?.length > 0) {
            let newsIds = brandData.news.map(newsItem => newsItem.id);
            fetchNews(newsIds);
          }

          // 获取相关产品
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

  // 获取相关人物数据
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

  // 获取相关新闻数据
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

  // 获取相关产品数据
  const fetchProducts = async productIds => {
    try {
      if (!productIds || productIds.length === 0) {
        console.warn("⚠️ No product IDs provided, skipping fetch.");
        return;
      }

      console.log("🔍 Fetching Products for IDs:", productIds);

      // ✅ 直接使用 `populate=*`
      const queryParams = productIds
        .map(id => `filters[id][$eq]=${id}`)
        .join("&");

      const response = await axios.get(
        `${BACKEND_HOST}/api/products?${queryParams}&populate=*`
      );

      console.log("✅ Fetched Products:", response.data);
      setProducts(response.data.data || []);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
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
    "暂无"
  );

  const Logo = brand.logo?.url
    ? `${BACKEND_HOST}${brand.logo.url}`
    : "https://placehold.co/600x400";

  return (
    <div className='brand-detail-page'>
      {/* 头部布局优化：图片左侧，按钮右侧 */}
      <section className='brand-detail-header'>
        <Container>
          <Row className='align-items-center'>
            {/* 左侧品牌 Logo */}
            <Col xs={12} md={4} className='text-center text-md-left'>
              <Image src={Logo} alt={Name} className='brand-logo' />
            </Col>

            {/* 右侧品牌信息 */}
            <Col xs={12} md={8}>
              <div className='brand-info'>
                <h1 className='brand-title'>{Name}</h1>

                {/* ✅ 动态生成 Tags 按钮 */}
                {tagsArray.length > 0 && (
                  <div className='brand-tags'>
                    {tagsArray.map((tag, index) => (
                      <span key={index} className='btn-tag'>
                        {t(tag)}
                      </span>
                    ))}
                  </div>
                )}

                {/* 官网 & 邮箱按钮 */}
                <div className='brand-contact-row'>
                  {Website}
                  <Button className='btn-outline-black'>{t("email")}</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ✅ 简介部分放在最下方 */}
      <Container>
        <div className='brand-intro'>
          <span className='brand-intro-title'>{t("introduction")}</span>
          <p className='brand-intro-content'>{Description}</p>
        </div>
      </Container>

      {/* ✅ 相关信息按钮放在简介下方 */}
      <Container>
        <div className='brand-related-section'>
          <h3>{t("relatedInformation")}</h3>
          <div className='brand-related-buttons'>
            <Link
              to={`/brands/${brand.internal_url}/related-persons`}
              className='btn-outline-black'
              state={{ persons }}
            >
              {t("relatedPersons")}
            </Link>
            <Link
              to={`/brands/${brand.internal_url}/related-news`}
              className='btn-outline-black'
              state={{ news }}
            >
              {t("relatedNews")}
            </Link>
            <Link
              to={`/brands/${brand.internal_url}/related-products`}
              className='btn-outline-black'
              state={{ products }}
            >
              {t("relatedProducts")}
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default BrandDetail;
