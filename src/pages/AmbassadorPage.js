import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../css/AmbassadorPage.css"; // ✅ 确保引入了正确的 CSS 文件

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;
const AmbassadorPage = () => {
  const { t, i18n } = useTranslation();
  const [ambassadors, setAmbassadors] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_HOST}/api/people`, {
        params: {
          populate: "Image",
          "filters[Role][$contains]": "Spokesperson",
        },
      })
      .then(response => {
        if (response.data && response.data.data) {
          console.log(response.data.data);
          setAmbassadors(response.data.data);
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching ambassadors:", error);
        setError("Error fetching data");
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <section className='ambassador-page-container'>
        <Container>
          <Row className='align-items-center'>
            <Col md={6}>
              <p>{t("spokesperson_slogan")}</p>
              <h1>{t("spokesperson_title")}</h1>
              <p>{t("spokesperson_content")}</p>
            </Col>
            <Col md={6} className='text-center'>
              <Image
                src={"/sponsors/ambassador.webp"}
                alt='ambassadorImage'
                fluid
              />
            </Col>
          </Row>
        </Container>
      </section>

      <section>
        <Container className='ambassador-page-container'>
          <Row>
            <h6>我们的代言人</h6>
            <h2>品牌代言人</h2>
          </Row>
          <Row className='justify-content-start'>
            {ambassadors.map(ambassador => {
              const language = i18n.language;
              const Name =
                language === "zh"
                  ? ambassador.Name_zh || "未知"
                  : ambassador.Name_en || "Unknown";
              const Title =
                language === "zh"
                  ? ambassador.Title_zh || "无头衔"
                  : ambassador.Title_en || "No Title";
              const ImageUrl = ambassador.Image?.[0]?.url
                ? `${BACKEND_HOST}${ambassador.Image[0].url}`
                : "https://placehold.co/250x350";
              const profileUrl = `/person/${
                ambassador.internal_url || ambassador.id
              }`;

              return (
                <Col
                  key={ambassador.id}
                  xs={12}
                  sm={6}
                  md={4}
                  className='mb-4 d-flex'
                >
                  <Link to={profileUrl} className='ambassador-page-card-link'>
                    <Card className='ambassador-page-card'>
                      <Card.Img
                        src={ImageUrl}
                        alt={Name}
                        className='ambassador-page-card-img'
                      />
                      <Card.Body className='ambassador-page-card-body'>
                        <Card.Title className='ambassador-page-card-title'>
                          {Name}
                        </Card.Title>
                        <Card.Text className='ambassador-page-card-text'>
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

export default AmbassadorPage;
