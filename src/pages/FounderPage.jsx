import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../css/FounderPage.css"; // ✅ 确保 CSS 文件正确引入

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
const DEBUG = import.meta.env.DEBUG;

const FounderPage = () => {
  const { t, i18n } = useTranslation();
  const [founders, setFounders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_HOST}/api/people`, {
        params: {
          populate: "Image",
          "filters[Role][$contains]": "Founder", // ✅ 过滤出创始人数据
        },
      })
      .then(response => {
        if (response.data && response.data.data) {
          if (DEBUG) console.log("Fetched Founders:", response.data.data);
          setFounders(response.data.data);
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching founders:", error);
        setError("Error fetching data");
      });
  }, []);

  if (error) {
    return <div className='error-message'>{error}</div>;
  }

  return (
    <div>
      {/* ✅ 品牌创始人页面头部 */}
      <section className='founder-page-header'>
        <Container>
          <Row className='align-items-center'>
            <Col md={6}>
              <p>{t("founder_slogan")}</p>
              <h1>{t("founder_title")}</h1>
              <p>{t("founder_content")}</p>
            </Col>
            <Col md={6} className='text-center'>
              <Image src={"/sponsors/founder.png"} alt='founderImage' fluid />
            </Col>
          </Row>
        </Container>
      </section>

      {/* ✅ 品牌创始人展示 */}
      <section>
        <Container className='founder-page-container'>
          <Row>
            <h6>品牌、企业灵魂人物</h6>
            <h2>品牌创始人</h2>
          </Row>
          <Row className='founder-page-row'>
            {founders.map(founder => {
              const language = i18n.language;
              const Name =
                language === "zh"
                  ? founder.Name_zh || "未知"
                  : founder.Name_en || "Unknown";
              const Title =
                language === "zh"
                  ? founder.Title_zh || "无头衔"
                  : founder.Title_en || "No Title";
              const ImageUrl = founder.Image?.[0]?.url
                ? `${BACKEND_HOST}${founder.Image[0].url}`
                : "https://placehold.co/300x350";
              const profileUrl = `/person/${
                founder.internal_url || founder.id
              }`;

              return (
                <Col
                  key={founder.id}
                  xs={12}
                  sm={6}
                  md={4}
                  className='founder-page-col'
                >
                  <Link to={profileUrl} className='founder-page-card-link'>
                    <Card className='founder-page-card'>
                      <Card.Img
                        src={ImageUrl}
                        alt={Name}
                        className='founder-page-card-img'
                      />
                      <Card.Body className='founder-page-card-body'>
                        <Card.Title className='founder-page-card-title'>
                          {Name}
                        </Card.Title>
                        <Card.Text className='founder-page-card-text'>
                          {Title}
                        </Card.Text>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              );
            })}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default FounderPage;
