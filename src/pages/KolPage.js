import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../css/KolPage.css"; // 确保引入了正确的 CSS 文件

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;
const KolPage = () => {
  const { t, i18n } = useTranslation();
  const [kols, setKols] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_HOST}/api/people`, {
        params: {
          populate: "Image",
          "filters[Role][$contains]": "Kol", // ✅ 查询 KOL 人物
        },
      })
      .then(response => {
        if (response.data && response.data.data) {
          setKols(response.data.data);
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching kols:", error);
        setError("Error fetching data");
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* ✅ 头部 */}
      <section className='kol-page-header'>
        <Container>
          <Row className='align-items-center'>
            <Col md={6}>
              <p>{t("kol_slogan")}</p>
              <h1>{t("kol_title")}</h1>
              <p>{t("kol_content")}</p>
            </Col>
            <Col md={6} className='text-center'>
              <Image src={"/sponsors/kol.jpg"} alt='kolImage' fluid />
            </Col>
          </Row>
        </Container>
      </section>

      {/* ✅ KOL 列表 */}
      <section>
        <Container className='kol-page-container'>
          <Row>
            <h6>领域专家</h6>
            <h2>意见领袖</h2>
          </Row>
          <Row className='justify-content-start'>
            {kols.map(kol => {
              const language = i18n.language;
              const Name =
                language === "zh"
                  ? kol.Name_zh || "未知"
                  : kol.Name_en || "Unknown";
              const Title =
                language === "zh"
                  ? kol.Title_zh || "无头衔"
                  : kol.Title_en || "No Title";
              const ImageUrl = kol.Image?.[0]?.url
                ? `${BACKEND_HOST}${kol.Image[0].url}`
                : "https://placehold.co/250x350";
              const profileUrl = `/person/${kol.internal_url || kol.id}`;

              return (
                <Col key={kol.id} xs={12} sm={6} md={4} className='mb-4 d-flex'>
                  <Link to={profileUrl} className='kol-page-card-link'>
                    <Card className='kol-page-card d-flex flex-column'>
                      <Card.Img
                        src={ImageUrl}
                        alt={Name}
                        className='kol-page-card-img'
                      />
                      <Card.Body className='kol-page-card-body text-center d-flex flex-column justify-content-between'>
                        <Card.Title className='kol-page-card-title'>
                          {Name}
                        </Card.Title>
                        <Card.Text className='kol-page-card-text'>
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

export default KolPage;
