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
        console.log(`Fetching Brand Data for ID: ${id}`);
        let response = await axios.get(`${BACKEND_HOST}/api/brands?filters[internal_url][$eq]=${id}&populate=*`);

        if (!response.data?.data.length) {
          console.log(`Internal URL failed, trying ID: ${id}`);
          response = await axios.get(`${BACKEND_HOST}/api/brands?filters[id][$eq]=${id}&populate=*`);
        }

        if (response.data?.data.length > 0) {
          setBrand(response.data.data[0]);
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

  if (loading) return <div className="loading">{t("loading")}</div>;
  if (error) return <div className="error-message">{error}</div>;

  const language = i18n.language;
  const Name = language === "zh" ? brand.name_zh || "未知品牌" : brand.name_en || "Unknown Brand";
  const Description = language === "zh" ? brand.description_zh || "暂无介绍" : brand.description_en || "No description available";
  const Website = brand.official_website_url ? (
    <a href={brand.official_website_url} target="_blank" rel="noopener noreferrer">{brand.official_website_url}</a>
  ) : "暂无";
  const Logo = brand.logo?.url ? `${BACKEND_HOST}${brand.logo.url}` : "https://placehold.co/600x400";

  return (
    <div>
      {/* ✅ 品牌详情头部 */}
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
        <h3>{t("latestNews")}</h3>
        {brand.news && brand.news.length > 0 ? (
          <Row>
            {brand.news.map(newsItem => {
              const newsTitle = newsItem.Title || "暂无标题";
              const newsDate = newsItem.Published_time ? new Date(newsItem.Published_time).toLocaleString() : "暂无发布时间";
              const newsImage = newsItem.Image?.url ? `${BACKEND_HOST}${newsItem.Image.url}` : "https://placehold.co/300x200";

              return (
                <Col key={newsItem.id} md={4}>
                  <Card className='news-card'>
                    <Card.Img src={newsImage} alt={newsTitle} />
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
          <p className="text-center text-muted">暂无相关新闻</p>
        )}
      </Container>

      {/* ✅ 相关人物 (Persons) */}
      <Container className='person-section'>
        <h3>{t("relatedPersons")}</h3>
        {brand.people?.length > 0 ? (
          <Container className='people-section'>
            
            <Row>
              {brand.people.map(person => {
                const personName = i18n.language === "zh" ? person.Name_zh || "未知人物" : person.Name_en || "Unknown Person";
                const personTitle = i18n.language === "zh" ? person.Title_zh || "无头衔" : person.Title_en || "No Title";
                const personImage = person.Image?.[0]?.url ? `${BACKEND_HOST}${person.Image[0].url}` : "https://placehold.co/200x200";

                return (
                  <Col key={person.id} xs={12} sm={6} md={4} lg={3} className="d-flex">
                    <Link to={`/person/${person.internal_url || person.id}`} className="person-card-link">
                      <Card className="person-card">
                        <Card.Img variant="top" src={personImage} alt={personName} className="person-card-img" />
                        <Card.Body className="d-flex flex-column align-items-center">
                          <Card.Title className="person-card-title">{personName}</Card.Title>
                          <Card.Text className="person-card-role">{personTitle}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </Container>
        ) : (
          <p className='text-center'>暂无相关人物</p>
        )}
      </Container>
    </div>
  );
};

export default BrandDetail;