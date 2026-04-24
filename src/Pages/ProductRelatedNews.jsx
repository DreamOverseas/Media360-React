import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import "../Css/ProductRelated.css";

const BACKEND_HOST = import.meta.env.VITE_CMS_ENDPOINT;

const ProductRelatedNews = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const newsItems = state?.news ?? [];

  return (
    <div className="product-related-news-page">
      <Container>
        <button className="product-related-back-btn" onClick={() => navigate(-1)}>← 返回</button>
        <h2 className="prouct-page-title">{t("relatedNews")}</h2>
        {newsItems.length > 0 ? (
          <Row className="product-related-container">
            {newsItems.map((news) => (
              <Col key={news.id} xs={12}>
                <Card className="product-related-card">
                  <Card.Img
                    src={
                      news.Image?.[0]?.url
                        ? `${BACKEND_HOST}${news.Image[0].url}`
                        : "https://placehold.co/300x200"
                    }
                    alt={news.Title_zh || "News"}
                    className="product-related-card-img"
                  />
                  <Card.Body className="product-related-card-body">
                    <Card.Title className="product-related-card-title">
                      {news.Title_zh || news.Title_en}
                    </Card.Title>
                    <Card.Text className="product-related-card-text">
                      {news.Description_zh || news.Description_en || t("no_description")}
                    </Card.Text>
                    <Card.Text className="product-related-card-date">
                      {news.Published_time
                        ? new Date(news.Published_time).toLocaleDateString()
                        : t("noDate")}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <p className="product-related-no-news-text">{t("noNewsAvailable")}</p>
        )}
      </Container>
    </div>
  );
};

export default ProductRelatedNews;
