import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import "../css/BrandRelated.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const RelatedNewsPage = () => {
  const { state } = useLocation();
  const { t } = useTranslation();

  // 获取新闻数据
  const newsItems = state?.news ?? [];

  return (
    <div className='related-page'>
      <Container>
        <h2 className='section-title'>{t("relatedNews")}</h2>
        {newsItems.length > 0 ? (
          <Row className='related-container'>
            {newsItems.map(news => (
              <Col key={news.id} xs={12}>
                <Link
                  to={`/news/${news.url || news.id}`}
                  className='related-card-link'
                >
                  <Card className='related-card'>
                    <Card.Img
                      src={
                        news.Image?.[0]?.url
                          ? `${BACKEND_HOST}${news.Image[0].url}`
                          : "https://placehold.co/300x200"
                      }
                      alt={news.Title_zh || "News"}
                      className='related-card-img'
                    />
                    <Card.Body className='related-card-body'>
                      <Card.Title className='related-card-title'>
                        {news.Title_zh || news.Title_en}
                      </Card.Title>
                      <Card.Text className='related-card-text'>
                        {news.Description_zh ||
                          news.Description_en ||
                          t("noDescription")}
                      </Card.Text>
                      <Card.Text className='related-card-date'>
                        {news.Published_time
                          ? new Date(news.Published_time).toLocaleDateString()
                          : t("noDate")}
                      </Card.Text>
                      <Link
                        to={`/news/${news.url || news.id}`}
                        className='read-more-btn'
                      >
                        {t("readMore")}
                      </Link>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        ) : (
          <p className='no-news-text'>{t("noNewsAvailable")}</p>
        )}
      </Container>
    </div>
  );
};

export default RelatedNewsPage;
