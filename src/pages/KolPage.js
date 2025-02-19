import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";


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
          "filters[Role][$eq]": "Kol",
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
                <p>{t("kol_slogan")}</p>
                <h1>{t("kol_title")}</h1>
                <p>{t("kol_content")}</p>
              </Col>
              <Col md={6} className='text-center'>
                <Image src={"/sponsors/kol.jpg"} alt="founderImage" fluid />
              </Col>
            </Row>
          </Container>
        </section>

        <section>
          <Container className="kol-container">
            <Row>
              <h6>领域专家</h6>
              <h2>意见领袖</h2>
            </Row>
            <Row className="justify-content-start">
              {kols.map((kol) => {
                const language = i18n.language;
                const Name = language === "zh" ? kol.Name_zh || "未知" : kol.Name_en || "Unknown";
                const Title = language === "zh" ? kol.Title_zh || "无头衔" : kol.Title_en || "No Title";
                const ImageUrl = kol.Image?.[0]?.url ? `${BACKEND_HOST}${kol.Image[0].url}` : "https://placehold.co/250x350";
                const profileUrl = `/person/${kol.internal_url || kol.id}`;

                return (
                  <Col
                    key={kol.id}
                    xs={6}
                    sm={6}
                    md={3}
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