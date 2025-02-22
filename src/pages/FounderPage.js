import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../css/FounderPage.css"; // 确保引入了正确的 CSS 文件

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;
const FounderPage = () => {

    const { t, i18n } = useTranslation();
    const [founders, setFounders] = useState([]);
    const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_HOST}/api/people`, {
        params: {
          populate: "Image",
          "filters[Role][$eq]": "Founder",
        },
      })
      .then(response => {
        if (response.data && response.data.data) {
          console.log(response.data.data)
          setFounders(response.data.data);
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching founders:", error);
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

    return (
      <div>
        <section className='brand-detail-header'>
          <Container>
            <Row className='align-items-center'>
              <Col md={6}>
                <p>{t("founder_slogan")}</p>
                <h1>{t("founder_title")}</h1>
                <p>{t("founder_content")}</p>
              </Col>
              <Col md={6} className='text-center'>
                <Image src={"/sponsors/founder.png"} alt="founderImage" fluid />
              </Col>
            </Row>
          </Container>
        </section>

        <section>
          <Container className="founder-page-container">
            <Row>
              <h6>品牌、企业灵魂人物</h6>
              <h2>品牌创始人</h2>
            </Row>
            <Row className="justify-content-start">
              {founders.map((founder) => {
                const language = i18n.language;
                const Name = language === "zh" ? founder.Name_zh || "未知" : founder.Name_en || "Unknown";
                const Title = language === "zh" ? founder.Title_zh || "无头衔" : founder.Title_en || "No Title";
                const ImageUrl = founder.Image?.[0]?.url ? `${BACKEND_HOST}${founder.Image[0].url}` : "https://placehold.co/250x350";
                const profileUrl = `/person/${founder.internal_url || founder.id}`;

                return (
                  <Col key={founder.id} xs={6} sm={6} md={3}>
                    <Link to={profileUrl} className="founder-page-card-link">
                      <Card className="founder-page-card">
                        <Card.Img src={ImageUrl} alt={Name} className="founder-page-card-img" />
                        <Card.Body className="founder-page-card-body text-center d-flex flex-column justify-content-between">
                          <Card.Title className="founder-page-card-title">{Name}</Card.Title>
                          <Card.Text className="founder-page-card-text">{Title}</Card.Text>
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