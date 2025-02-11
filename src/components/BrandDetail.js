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
  const [brand, setBrand] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`Fetching Brand ID: ${id}`);
    axios
      .get(`${BACKEND_HOST}/api/brands?filters[id][$eq]=${id}&populate=*`)
      .then(response => {
        console.log("Brand API Response:", response.data);
        if (response.data && response.data.data.length > 0) {
          setBrand(response.data.data[0]);
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    console.log("Updated brand state:", brand);
  }, [brand]);

  if (loading) return <div>{t("loading")}</div>;
  if (error) return <div>{error}</div>;

  const language = i18n.language;
  const Name = brand.name_zh || brand.name_en || "未知品牌";
  const Description =
    language === "zh"
      ? brand.description_zh || "暂无介绍"
      : brand.description_en || "No description available";
  const Website = brand.official_website_url || "暂无";
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

      {/* 相关新闻 */}
      {brand.news?.length > 0 ? (
        <Container className='news-section'>
          <h3>{t("latestNews")}</h3>
          <Row>
            {brand.news.map(newsItem => (
              <Col key={newsItem.id} md={4}>
                <Card className='news-card'>
                  {newsItem.attributes?.Image?.url && (
                    <Card.Img
                      src={`${BACKEND_HOST}${newsItem.attributes.Image.url}`}
                      alt={newsItem.attributes.Title}
                    />
                  )}
                  <Card.Body>
                    <Card.Title>
                      {newsItem.attributes?.Title || "暂无标题"}
                    </Card.Title>
                    <Card.Text>
                      {newsItem.attributes?.Published_time
                        ? new Date(
                            newsItem.attributes.Published_time
                          ).toLocaleString()
                        : "暂无发布时间"}
                    </Card.Text>
                    <Link to={`/news/${newsItem.id}`}>
                      <Button variant='dark'>{t("readMore")}</Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      ) : (
        <p className='text-center'>暂无相关新闻</p>
      )}
    </div>
  );
};

export default BrandDetail;
