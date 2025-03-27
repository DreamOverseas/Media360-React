/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from "moment-timezone";
import "../css/NewsPage.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const NewsPage = () => {
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchNews(page);
  }, [page]);

  const fetchNews = async pageNum => {
    try {
      setLoading(true);
      console.log(`Fetching News - Page ${pageNum}`);

      const response = await axios.get(`${BACKEND_HOST}/api/news`, {
        params: {
          "pagination[page]": pageNum,
          "pagination[pageSize]": 8,
          sort: "Published_time:desc",
          "filters[Published_time][$notNull]": true, // ✅ 防止 400 Bad Request
          "populate[Image]": true, // ✅ 仅填充 Image 字段
        },
      });

      console.log("API Response:", response.data); // ✅ Debugging API 数据

      if (response.data?.data) {
        const formattedNews = response.data.data.map(newsItem => ({
          ...newsItem,
          imageUrl: newsItem.Image?.[0]?.url
            ? `${BACKEND_HOST}${newsItem.Image[0].url}`
            : "https://placehold.co/300x200", // ✅ 防止图片为空时报错
        }));

        setNews(prevNews => [...prevNews, ...formattedNews]);
        setHasMore(
          response.data.meta.pagination.page <
            response.data.meta.pagination.pageCount
        );
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching news:", error.response || error);
      setError(
        `Error fetching data: ${
          error.response?.data?.error?.message || error.message
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = datetime => {
    if (!datetime) return "未知时间";
    return moment(datetime)
      .tz("Australia/Sydney")
      .format("ddd, DD MMM, h:mm a z");
  };

  if (error) return <div>{error}</div>;

  return (
    <div>
      {/* ✅ 新闻页面 Banner */}
      <section className='news-page-background-image-container'>
        <h1 className='news-page-banner-h1'>
          <b>{t("news")}</b>
        </h1>
      </section>

      {/* ✅ 新闻列表 */}
      <section>
        <Container className='news-container'>
          <Row>
            <h6>最新消息</h6>
            <h2>新闻</h2>
          </Row>
          <Row className='justify-content-start'>
            {news.map(newsItem => {
              const language = i18n.language;
              const newsTitle =
                language === "zh"
                  ? newsItem.Title_zh || "未知新闻"
                  : newsItem.Title_en || "Unknown News";
              const newsContent = newsItem.Description_zh || "暂无内容";
              const newsUrl = `/news/${newsItem.url}`;

              return (
                <Col
                  key={newsItem.id}
                  xs={12}
                  sm={6}
                  md={4} // 修改为 4 以在一行显示 3 个卡片
                >
                  <Link to={newsUrl} className='card-link-NewsPage'>
                    <Card className='newspage-news-card d-flex flex-column'>
                      <Card.Img
                        src={newsItem.imageUrl}
                        alt={newsTitle}
                        className='newspage-news-card-img'
                      />
                      <Card.Body className='text-center d-flex flex-column justify-content-between'>
                        <Card.Title className='newspage-news-card-title'>
                          {newsTitle}
                        </Card.Title>
                        <Card.Text className='newspage-news-card-date'>
                          {formatDateTime(newsItem.Published_time)}
                        </Card.Text>
                        <Card.Text className='newspage-news-card-content'>
                          {newsContent}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
          {loading && <div>Loading more news...</div>}
        </Container>
      </section>
    </div>
  );
};

export default NewsPage;
