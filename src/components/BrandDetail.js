import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import "../css/BrandDetail.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const BrandDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [brand, setBrand] = useState(null);
  const [people, setPeople] = useState([]);
  const [news, setNews] = useState([]);
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
          let brandData = response.data.data[0];
          setBrand(brandData);

          if (brandData.people?.length > 0) {
            let peopleIds = brandData.people.map(person => person.id);
            fetchPeopleImages(peopleIds);
          }

          if (brandData.news?.length > 0) {
            let newsIds = brandData.news.map(news => news.id);
            fetchNewsImages(newsIds);
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

  const fetchPeopleImages = async peopleIds => {
    try {
      const queryParams = peopleIds.map(id => `filters[id]=${id}`).join("&");
      const peopleResponse = await axios.get(
        `${BACKEND_HOST}/api/people?${queryParams}&populate=Image`
      );
      setPeople(peopleResponse.data.data);
    } catch (error) {
      console.error("Error fetching people:", error);
    }
  };

  const fetchNewsImages = async newsIds => {
    try {
      const queryParams = newsIds.map(id => `filters[id][$eq]=${id}`).join("&");
      const newsResponse = await axios.get(
        `${BACKEND_HOST}/api/news?${queryParams}&populate=Image`
      );

      if (newsResponse.data?.data.length > 0) {
        const formattedNews = newsResponse.data.data.map(news => ({
          ...news,
          imageUrl:
            news.Image?.length > 0
              ? `${BACKEND_HOST}${news.Image[0].url}`
              : "https://placehold.co/300x200",
        }));
        setNews(formattedNews);
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
    <div className='brand-detail-page'>
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
      {/* 视频部分 */}
      {brand.video && (
        <section className='video-section'>
          <div
            className='video-container'
            dangerouslySetInnerHTML={{ __html: brand.video }}
          ></div>
        </section>
      )}
      <Container className='news-section'>
        <h2 className='section-title'>{t("latestNews")}</h2>
        <Row>
          {news.map(newsItem => (
            <Col key={newsItem.id} md={4}>
              <Card className='news-card'>
                <Card.Img
                  src={newsItem.imageUrl}
                  alt={newsItem.Title_zh || "暂无标题"}
                />
                <Card.Body>
                  <Card.Title>{newsItem.Title_zh || "暂无标题"}</Card.Title>
                  <Card.Text>
                    {newsItem.Published_time
                      ? new Date(newsItem.Published_time).toLocaleString()
                      : "暂无发布时间"}
                  </Card.Text>
                  <Link to={`/news/${newsItem.id}`} className='card-link'>
                    <Button variant='dark'>{t("readMore")}</Button>
                  </Link>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      <Container className='person-section'>
        <h2 className='section-title'>{t("relatedPersons")}</h2>
        <Row className='g-4'>
          {people.map(person => (
            <Col key={person.id} xs={12} sm={6} md={4} lg={3}>
              <Link
                to={`/person/${person.internal_url || person.id}`}
                className='card-link'
              >
                <Card className='person-card'>
                  <Card.Img
                    src={
                      person.Image?.[0]?.url
                        ? `${BACKEND_HOST}${person.Image[0].url}`
                        : "https://placehold.co/200x200"
                    }
                    alt={person.Name_zh || "未知人物"}
                    className='person-card-img'
                  />
                  <Card.Body className='text-center'>
                    <Card.Title>{person.Name_zh || "未知人物"}</Card.Title>
                    <Card.Text>{person.Title_zh || "无头衔"}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
};

export default BrandDetail;
