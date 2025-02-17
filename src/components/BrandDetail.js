import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import "../css/BrandDetail.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const BrandDetail = () => {
  const { id } = useParams(); // 可能是 `internal_url` 或 `id`
  const { t, i18n } = useTranslation();
  const [brand, setBrand] = useState(null);
  const [people, setPeople] = useState([]); // 存储相关人物数据
  const [news, setNews] = useState([]); // 存储新闻数据
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
        console.log(`Fetching Brand Data for: ${id}`);

        let response = await axios.get(
          `${BACKEND_HOST}/api/brands?filters[internal_url][$eq]=${id}&populate=*`
        );

        if (!response.data?.data.length) {
          console.log(`Internal URL failed, trying ID: ${id}`);
          response = await axios.get(
            `${BACKEND_HOST}/api/brands?filters[id][$eq]=${id}&populate=*`
          );
        }

        if (response.data?.data.length > 0) {
          let brandData = response.data.data[0];
          setBrand(brandData);
          console.log("Fetched Brand Data:", brandData);

          // ✅ 获取相关人物的图片
          if (brandData.people?.length > 0) {
            let peopleIds = brandData.people.map(person => person.id);
            fetchPeopleImages(peopleIds);
          }

          // ✅ 获取相关新闻的图片
          if (brandData.news?.length > 0) {
            let newsIds = brandData.news.map(news => news.id);
            fetchNewsImages(newsIds);
          }
        } else {
          setError("Brand not found");
        }
      } catch (err) {
        console.error("Error fetching brand data:", err);
        setError("Error fetching brand details");
      } finally {
        setLoading(false);
      }
    };

    fetchBrandData();
  }, [id]);

  // ✅ 获取相关人物的头像数据
  const fetchPeopleImages = async peopleIds => {
    try {
      console.log("Fetching People Images for IDs:", peopleIds);

      const queryParams = peopleIds.map(id => `filters[id]=${id}`).join("&");
      const peopleResponse = await axios.get(
        `${BACKEND_HOST}/api/people?${queryParams}&populate=Image`
      );

      console.log("Fetched People Data:", peopleResponse.data.data);
      setPeople(peopleResponse.data.data);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  // ✅ 获取新闻的图片
  const fetchNewsImages = async newsIds => {
    try {
      console.log("Fetching News Images for IDs:", newsIds);

      const queryParams = newsIds.map(id => `filters[id][$eq]=${id}`).join("&");
      const newsResponse = await axios.get(
        `${BACKEND_HOST}/api/news?${queryParams}&populate=Image`
      );

      console.log("Full News API Response:", newsResponse.data);

      if (newsResponse.data?.data.length > 0) {
        const formattedNews = newsResponse.data.data.map(news => ({
          ...news,
          imageUrl:
            news.Image?.length > 0
              ? `${BACKEND_HOST}${news.Image[0].url}` // ✅ 取数组的第一张图片
              : "https://placehold.co/300x200",
        }));

        setNews(formattedNews);
      } else {
        console.log("No news images found.");
      }
    } catch (error) {
      console.error("Error fetching news:", error);
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
  const Website = brand.official_website_url ? (
    <a
      href={brand.official_website_url}
      target='_blank'
      rel='noopener noreferrer'
    >
      {brand.official_website_url}
    </a>
  ) : (
    "暂无"
  );

  const Logo = brand.logo?.url
    ? `${BACKEND_HOST}${brand.logo.url}`
    : "https://placehold.co/600x400";

  return (
    <div>
      <section className='brand-detail-header'>
        <Container>
          <Row className='align-items-center'>
            <Col md={6}>
              <h1>{Name}</h1>
              <p>{Description}</p>
              <p>
                <strong>{t("officialWebsite")}:</strong> {Website}
              </p>
            </Col>
            <Col md={6} className='text-center'>
              <Image src={Logo} alt={Name} fluid className='brand-logo' />
            </Col>
          </Row>
        </Container>
      </section>

      {/* ✅ 相关新闻 */}
      <Container className='news-section'>
        <h2 className='section-title'>{t("latestNews")}</h2>
        {news.length > 0 ? (
          <Row>
            {news.map(newsItem => {
              const newsTitle = newsItem.Title || "暂无标题";
              const newsDate = newsItem.Published_time
                ? new Date(newsItem.Published_time).toLocaleString()
                : "暂无发布时间";

              return (
                <Col key={newsItem.id} md={4}>
                  <Card className='news-card'>
                    <Card.Img src={newsItem.imageUrl} alt={newsTitle} />
                    <Card.Body>
                      <Card.Title>{newsTitle}</Card.Title>
                      <Card.Text>{newsDate}</Card.Text>
                      <Link to={`/news/${newsItem.id}`}>
                        <Button variant='dark'>{t("readMore")}</Button>
                      </Link>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <p className='text-center text-muted'>暂无相关新闻</p>
        )}
      </Container>

      {/* ✅ 相关人物 (Persons) */}
      <Container className='person-section'>
        <h2 className='section-title'>{t("relatedPersons")}</h2>
        {people.length > 0 ? (
          <Row className='g-4'>
            {people.map(person => {
              const personName =
                language === "zh"
                  ? person.Name_zh || "未知人物"
                  : person.Name_en || "Unknown Person";
              const personTitle =
                language === "zh"
                  ? person.Title_zh || "无头衔"
                  : person.Title_en || "No Title";
              const personImage = person.Image?.[0]?.url
                ? `${BACKEND_HOST}${person.Image[0].url}`
                : "https://placehold.co/200x200";

              return (
                <Col key={person.id} xs={12} sm={6} md={4} lg={3}>
                  <Link
                    to={`/person/${person.internal_url || person.id}`}
                    className='person-card-link'
                  >
                    <Card className='person-card h-100'>
                      <Card.Img
                        variant='top'
                        src={personImage}
                        alt={personName}
                        className='person-card-img'
                      />
                      <Card.Body className='d-flex flex-column justify-content-between align-items-center'>
                        <Card.Title className='person-card-title'>
                          {personName}
                        </Card.Title>
                        <Card.Text className='person-card-role'>
                          {personTitle}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        ) : (
          <p className='text-center text-muted'>{t("noRelatedPersons")}</p>
        )}
      </Container>
    </div>
  );
};

export default BrandDetail;
