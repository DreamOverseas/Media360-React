import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../css/KolPage.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const KolPage = () => {
  const [kols, setKols] = useState([]);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    console.log(`${BACKEND_HOST}/api/people?populate=Image`);
    axios
      .get(`${BACKEND_HOST}/api/people?populate=Image`)
      .then((response) => {
        if (response.data && response.data.data) {
          setKols(response.data.data);
        } else {
          setError("No data found");
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <section className="kol-page-background-image-container">
        <h1 className="kol-page-banner-h1">
          <b>{t("kol")}</b>
        </h1>
      </section>
      <br />
      <section>
        <Container className="kol-container">
          <Row className="justify-content-start">
            {kols.map((kol) => {
              // ✅ 语言切换逻辑
              const language = i18n.language;
              const Name = language === "zh" ? kol.Name_zh || "未知" : kol.Name_en || "Unknown";
              const Title = language === "zh" ? kol.Title_zh || "无头衔" : kol.Title_en || "No Title";
              const ImageUrl = kol.Image?.[0]?.url ? `${BACKEND_HOST}${kol.Image[0].url}` : "https://placehold.co/250x350";
              const profileUrl = `/person/${kol.internal_url || kol.id}`; // ✅ 优先使用 `internal_url`

              return (
                <Col
                  key={kol.id}
                  xs={6} // 移动端每行 2 个
                  sm={6} // 小屏幕每行 2 个
                  md={3} // 中等屏幕每行 4 个
                  className="mb-4 d-flex"
                >
                  <Link to={profileUrl} className="card-link-KolPage">
                    <Card className="kol-card d-flex flex-column">
                      <Card.Img src={ImageUrl} alt={Name} className="kol-card-img" />
                      <Card.Body className="text-center d-flex flex-column justify-content-between">
                        <Card.Title className="kol-card-title">{Name}</Card.Title>
                        <Card.Text className="kol-card-text">{Title}</Card.Text>
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