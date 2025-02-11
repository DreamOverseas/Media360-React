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
  const { t } = useTranslation();

  useEffect(() => {
    console.log(`${BACKEND_HOST}/api/people?populate=Image`);
    axios
      .get(`${BACKEND_HOST}/api/people?populate=Image`)
      .then(response => {
        if (response.data && response.data.data) {
          setKols(response.data.data); // ✅ 变量名保持 `kols`
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <section className='kol-page-background-image-container'>
        <h1 className='kol-page-banner-h1'>
          <b>{t("kol")}</b>
        </h1>
      </section>
      <br />
      <section>
        <Container className='kol-container'>
          <Row>
            {kols.map(kol => (
              <Col
                key={kol.id}
                xs={6} // 移动端每行 2 个
                sm={6} // 小屏幕每行 2 个
                md={3} // 中等屏幕每行 4 个
                className='mb-4'
              >
                <Link to={`/kol/${kol.id}`} className='card-link-KolPage'>
                  <Card className='kol-card'>
                    {kol.Image && kol.Image.length > 0 ? (
                      <Card.Img
                        src={`${BACKEND_HOST}${kol.Image[0].url}`}
                        alt={kol.Name}
                      />
                    ) : (
                      <Card.Img
                        variant='top'
                        src='https://placehold.co/250x350'
                        fluid
                        alt='Placeholder'
                      />
                    )}
                    <Card.Body>
                      <Card.Title
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: "18px",
                        }}
                        title={kol.Name}
                      >
                        {kol.Name}
                      </Card.Title>
                      <Card.Text
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: "14px",
                        }}
                        title={kol.Title_en || kol.Title_zh}
                      >
                        {kol.Title_en || kol.Title_zh || "No Title"}
                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default KolPage;
