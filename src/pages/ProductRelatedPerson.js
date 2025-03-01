import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../css/PersonRelated.css";


const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const ProductRelatedPerson = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const founders = location.state?.founder || [];
  const kols = location.state?.kol || [];
  const ambassadors = location.state?.spokesperson || [];

  return (
    <Container className='related-page'>
      <h2 >{t("relatedPerson")}</h2>
      <Row>
        {founders.length > 0 ? (
          founders.map(founder => (
            <Col key={founder.id} xs={12} sm={6} md={4} lg={3}>
                <Link
                    to={`/person/${founder.internal_url || founder.id}`}
                    className='person-card-link'
                >
                    <Card className='person-card'>
                        <Card.Img
                            src={
                                founder.Image?.[0]?.url
                                ? `${BACKEND_HOST}${founder.Image[0].url}`
                                : "https://placehold.co/200x200"
                            }
                            alt={founder.Name_zh || "Person"}
                            className='person-card-img'
                        />
                        <Card.Body>
                            <Card.Title className='person-card-title'>
                                {founder.Name_zh || founder.Name_en}
                            </Card.Title>
                            <Card.Text className='person-card-role'>
                                {founder.Title_zh || founder.Title_en || "No Title"}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Link>
            </Col>
          ))
        ) : (
          <></>
        )}

        {kols.length > 0 ? (
            kols.map(kol => (
                <Col key={kol.id} xs={12} sm={6} md={4} lg={3}>
                    <Link
                        to={`/person/${kol.internal_url || kol.id}`}
                        className='person-card-link'
                    >
                        <Card className='person-card'>
                            <Card.Img
                                src={
                                    kol.Image?.[0]?.url
                                    ? `${BACKEND_HOST}${kol.Image[0].url}`
                                    : "https://placehold.co/200x200"
                                }
                                alt={kol.Name_zh || "Person"}
                                className='person-card-img'
                            />
                            <Card.Body>
                                <Card.Title className='person-card-title'>
                                    {kol.Name_zh || kol.Name_en}
                                </Card.Title>
                                <Card.Text className='person-card-role'>
                                    {kol.Title_zh || kol.Title_en || "No Title"}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            ))
        ) : (
            <></>
        )}

        {ambassadors.length > 0 ? (
            ambassadors.map(ambassador => (
                <Col key={ambassador.id} xs={12} sm={6} md={4} lg={3}>
                    <Link
                        to={`/person/${ambassador.internal_url || ambassador.id}`}
                        className='person-card-link'
                    >
                        <Card className='person-card'>
                            <Card.Img
                                src={
                                    ambassador.Image?.[0]?.url
                                    ? `${BACKEND_HOST}${ambassador.Image[0].url}`
                                    : "https://placehold.co/200x200"
                                }
                                alt={ambassador.Name_zh || "Person"}
                                className='person-card-img'
                            />
                            <Card.Body>
                                <Card.Title className='person-card-title'>
                                    {ambassador.Name_zh || ambassador.Name_en}
                                </Card.Title>
                                <Card.Text className='person-card-role'>
                                    {ambassador.Title_zh || ambassador.Title_en || "No Title"}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Link>
                </Col>
            ))
        ) : (
            <></>
        )}
      </Row>
    </Container>
  );
};

export default ProductRelatedPerson;