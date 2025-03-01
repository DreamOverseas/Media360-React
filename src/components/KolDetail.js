import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
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
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paramId) {
      setError("No person ID provided");
      setLoading(false);
      return;
    }

    const fetchPersonData = async () => {
      try {
        console.log(`🔍 Fetching Person Data for: ${paramId}`);

        let response = await axios.get(
          `${BACKEND_HOST}/api/people?filters[internal_url][$eq]=${paramId}&populate=*`
        );

        if (!response.data?.data.length) {
          console.log(`❌ Internal URL failed, trying ID: ${paramId}`);
          response = await axios.get(
            `${BACKEND_HOST}/api/people?filters[id][$eq]=${paramId}&populate=*`
          );
        }

        if (response.data?.data.length > 0) {
          const personData = response.data.data[0];
          setPerson(personData);
          console.log("✅ Fetched Person Data:", personData);

          // 处理相关品牌、产品、新闻
          if (personData.brands?.length > 0) {
            fetchBrandLogos(personData.brands.map(brand => brand.id));
          }

          if (personData.products?.length > 0) {
            fetchProducts(personData.products.map(product => product.id));
          }

          if (personData.news?.length > 0) {
            fetchNews(personData.news.map(news => news.id));
          }
        } else {
          setError("Person not found");
        }
      } catch (err) {
        console.error("❌ Error fetching person details:", err);
        setError("Error fetching person details");
      } finally {
        setLoading(false);
      }
    };

    fetchPersonData();
  }, [paramId]);

  // ✅ 获取品牌数据
  const fetchBrandLogos = async brandIds => {
    if (!brandIds.length) return;
    try {
      console.log("🔍 Fetching Brands for IDs:", brandIds);

      // 🚀 改用逐个请求，避免 API 不支持 $in
      const brandResponses = await Promise.all(
        brandIds.map(id =>
          axios.get(
            `${BACKEND_HOST}/api/brands?filters[id][$eq]=${id}&populate=*`
          )
        )
      );

      const brandData = brandResponses.flatMap(res => res.data.data);
      console.log("✅ Fetched Brands:", brandData);
      setBrands(brandData);
    } catch (error) {
      console.error("❌ Error fetching brands:", error);
    }
  };

  // ✅ 获取产品数据
  const fetchProducts = async productIds => {
    if (!productIds.length) return;
    try {
      console.log("🔍 Fetching Products for IDs:", productIds);

      // 🚀 改用逐个请求，避免 API 不支持 $in
      const productResponses = await Promise.all(
        productIds.map(id =>
          axios.get(
            `${BACKEND_HOST}/api/products?filters[id][$eq]=${id}&populate=*`
          )
        )
      );

      const productData = productResponses.flatMap(res => res.data.data);
      console.log("✅ Fetched Products:", productData);
      setProducts(productData);
    } catch (error) {
      console.error("❌ Error fetching products:", error);
    }
  };

  // ✅ 获取新闻数据
  const fetchNews = async newsIds => {
    if (!newsIds.length) return;
    try {
      console.log("🔍 Fetching News for IDs:", newsIds);

      // 🚀 改用逐个请求，避免 API 不支持 $in
      const newsResponses = await Promise.all(
        newsIds.map(id =>
          axios.get(
            `${BACKEND_HOST}/api/news?filters[id][$eq]=${id}&populate=*`
          )
        )
      );

      const newsData = newsResponses.flatMap(res => res.data.data);
      console.log("✅ Fetched News:", newsData);
      setNews(newsData);
    } catch (error) {
      console.error("❌ Error fetching news:", error);
    }
  };

  if (loading) return <div className='loading'>{t("loading")}</div>;
  if (error) return <div className='error-message'>{error}</div>;
  if (!person) return <div className='error-message'>No Data Available</div>;

  const language = i18n.language;
  const displayName =
    language === "zh" ? person.Name_zh || "未知" : person.Name_en || "Unknown";
  const displayTitle =
    language === "zh"
      ? person.Title_zh || "无头衔"
      : person.Title_en || "No Title";
  const displayBio =
    language === "zh"
      ? person.Bio_zh || "暂无简介"
      : person.Bio_en || "No biography available";
  const personImage = person.Image?.[0]?.url
    ? `${BACKEND_HOST}${person.Image[0].url}`
    : "https://placehold.co/280x280";

  return (
    <div className='person-detail-page'>
      <Container>
        {/* 人物信息 */}
        <Row className='person-detail-section align-items-center'>
          <Col xs={12} md={5} className='text-center'>
            <Image
              src={personImage}
              alt={displayName}
              className='person-image'
            />
          </Col>

          <Col xs={12} md={7} className='person-info'>
            <h1>{displayName}</h1>
            <h5>{displayTitle}</h5>

            {/* 相关标签 */}
            <div className='person-tags'>
              <Button className='btn-small-outline'>{t("品牌的创始人")}</Button>
              <Button className='btn-small-outline'>{t("产品意见领袖")}</Button>
              <Button className='btn-small-outline'>{t("产品代言人")}</Button>
            </div>

            {/* 联系方式 */}
            <div className='person-contact'>
              <Button className='btn-outline-black'>{t("电话")}</Button>
              <Button className='btn-outline-black'>{t("邮箱")}</Button>
            </div>
          </Col>
        </Row>

        {/* 人物简介 */}
        <div className='person-intro'>
          <h3 className='person-intro-title'>{t("人物简介")}</h3>
          <p dangerouslySetInnerHTML={{ __html: displayBio }}></p>
        </div>

        {/* 相关信息错误报告 */}
        <div className='person-report'>
          <p>{t("人物信息有误？")}</p>
          <Button className='btn-outline-black'>
            {t("更新并完善人物信息")}
          </Button>
        </div>

        {/* 相关页面跳转 */}
        <div className='person-related-section'>
          <h3>{t("查看相关产品及新闻")}</h3>
          <div className='person-related-buttons'>
            {brands.length > 0 && (
              <Link
                to={`/person/${paramId}/related-brands`}
                className='btn-outline-black'
                state={{ brands }}
              >
                {t("相关品牌")}
              </Link>
            )}
            {products.length > 0 && (
              <Link
                to={`/person/${paramId}/related-products`}
                className='btn-outline-black'
                state={{ products }}
              >
                {t("相关产品")}
              </Link>
            )}
            {news.length > 0 && (
              <Link
                to={`/person/${paramId}/related-news`}
                className='btn-outline-black'
                state={{ news }}
              >
                {t("相关新闻")}
              </Link>
            )}
          </div>
        </div>

        {/* 回到顶部按钮 */}
        <div className='person-back-top'>
          <Button variant='link'>{t("回到顶部")}</Button>
        </div>
      </Container>
    </div>
  );
};

export default KolDetail;
