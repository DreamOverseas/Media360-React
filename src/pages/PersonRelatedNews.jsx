import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../css/PersonRelated.css";

const PersonRelatedNews = () => {
  const location = useLocation();
  const news = location.state?.news || [];

  return (
    <Container className='related-page'>
      <h2 className='related-title'>相关新闻</h2>
      <Row>
        {news.length > 0 ? (
          news.map(newsItem => (
            <Col key={newsItem.id} md={4}>
              <Link
                to={`/news/${newsItem.url || newsItem.id}`}
                className='card-link'
              >
                <Card className='related-card'>
                  <Card.Img
                    src={
                      newsItem.Image?.[0]?.url
                        ? `${import.meta.env.VITE_STRAPI_HOST}${newsItem.Image[0].url}`
                        : "https://placehold.co/300x200"
                    }
                    alt={newsItem.Title_en || "News"}
                  />
                  <Card.Body>
                    <Card.Title>
                      {newsItem.Title_zh || newsItem.Title_en}
                    </Card.Title>
                    <Card.Text>发布时间: {newsItem.Published_time}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))
        ) : (
          <p>暂无相关新闻</p>
        )}
      </Row>
    </Container>
  );
};

export default PersonRelatedNews;
