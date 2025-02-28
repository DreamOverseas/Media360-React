import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import "../css/BrandRelated.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const RelatedNewsPage = () => {
  const { state } = useLocation();
  const { t } = useTranslation();

  // 获取新闻数据
  const newsItems = state?.news ?? [];

  return (
    <div className='related-news-page'>
      <Container>
        <h2 className='page-title'>{t("relatedNews")}</h2>
        {newsItems.length > 0 ? (
          <Row>
            {newsItems.map(news => (
              <Col key={news.id} xs={12} sm={6} md={4} lg={3}>
                <Link
                  to={`/news/${news.url || news.id}`}
                  className='news-card-link'
                >
                  <Card className='news-card'>
                    <Card.Img
                      src={
                        news.Image?.[0]?.url
                          ? `${BACKEND_HOST}${news.Image[0].url}`
                          : "https://placehold.co/300x200"
                      }
                      alt={news.Title_zh || "News"}
                      className='news-card-img'
                    />
                    <Card.Body>
                      <Card.Title className='news-card-title'>
                        {news.Title_zh || news.Title_en}
                      </Card.Title>
                      <Card.Text className='news-card-date'>
                        {news.Published_time
                          ? new Date(news.Published_time).toLocaleDateString()
                          : "No Date"}
                      </Card.Text>
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
