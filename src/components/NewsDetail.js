import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import "../css/NewsDetail.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const NewsDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(`Fetching News ID: ${id}`);
    axios
      .get(`${BACKEND_HOST}/api/news?filters[id][$eq]=${id}`)
      .then(response => {
        console.log("News API Response:", response.data);
        if (response.data && response.data.data.length > 0) {
          setNews(response.data.data[0]); // ✅ 取第一篇新闻
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

  if (loading) return <div>{t("loading")}</div>;
  if (error) return <div>{error}</div>;

  if (!news) {
    return <div>{t("noDataAvailable")}</div>; // ✅ 确保 `news` 存在
  }

  // ✅ 确保所有字段有默认值，防止 undefined
  const Title = news.Title || "未知标题";
  const Content =
    i18n.language === "zh"
      ? news.Content || "暂无内容"
      : news.Content || "No content available";
  const PublishedTime = news.Published_time
    ? new Date(news.Published_time).toLocaleString()
    : "暂无发布时间";

  return (
    <Container className='news-detail-container'>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Card className='news-detail-card'>
            <Card.Body>
              <h1>{Title}</h1>
              <p className='news-detail-date'>
                <strong>{t("publishedAt")}:</strong> {PublishedTime}
              </p>
              <hr />
              <p className='news-detail-content'>{Content}</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NewsDetail;
