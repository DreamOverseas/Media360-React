import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "../css/NewsDetail.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const NewsDetail = () => {
  const { id } = useParams(); // ✅ `id` 可能是 `URL` 或 `ID`
  const { t, i18n } = useTranslation();
  const [news, setNews] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setError("Invalid news identifier");
      setLoading(false);
      return;
    }

    const fetchNewsDetail = async () => {
      try {
        console.log(`Fetching News for ID/URL: ${id}`);

        // ✅ 先尝试使用 URL 查询新闻
        let response = await axios.get(
          `${BACKEND_HOST}/api/news?filters[url][$eq]=${id}&populate=*`
        );

        // ✅ 如果 `url` 查询失败，尝试使用 `id` 查询
        if (!response.data?.data.length) {
          console.log(`URL not found, trying ID: ${id}`);
          response = await axios.get(
            `${BACKEND_HOST}/api/news?filters[id][$eq]=${id}&populate=*`
          );
        }

        if (response.data?.data.length > 0) {
          setNews(response.data.data[0]); // ✅ 取第一条数据
          console.log("Fetched News Data:", response.data.data[0]);
        } else {
          setError("News not found");
        }
      } catch (error) {
        console.error("Error fetching news:", error);
        setError("Error fetching news data");
      } finally {
        setLoading(false);
      }
    };

    fetchNewsDetail();
  }, [id]);

  if (loading) return <div>{t("loading")}</div>;
  if (error) return <div>{error}</div>;
  if (!news) return <div>{t("noDataAvailable")}</div>;

  // ✅ 解析新闻数据
  const Title =
    i18n.language === "zh"
      ? news.Title_zh || "暂无内容"
      : news.Title_en || "No content available";
  const PublishedTime = news.Published_time
    ? new Date(news.Published_time).toLocaleString()
    : "暂无发布时间";
  const Content =
    i18n.language === "zh"
      ? news.Content || "暂无内容"
      : news.Content || "No content available";

  // ✅ 解析图片，确保有默认图片
  const NewsImage = news.Image?.[0]?.url
    ? `${BACKEND_HOST}${news.Image[0].url}`
    : "https://placehold.co/600x400";

  return (
    <Container className='news-detail-container'>
      <Row>
        <Col md={{ span: 8, offset: 2 }}>
          <Card className='news-detail-card'>
            <Card.Body>
              <h1 className='news-detail-title'>{Title}</h1>
              <p className='news-detail-date'>
                <strong>{t("publishedAt")}:</strong> {PublishedTime}
              </p>
              <hr />
              <div className='news-detail-content'>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                >
                  {Content}
                </ReactMarkdown>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default NewsDetail;
