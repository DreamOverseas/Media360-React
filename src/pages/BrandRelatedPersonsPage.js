import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import "../css/BrandRelated.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const RelatedPersonsPage = () => {
  const { state } = useLocation();
  const { t } = useTranslation();

  // 获取人物数据
  const persons = state?.persons ?? [];

  return (
    <div className='related-page'>
      <Container>
        <h2 className='section-title'>{t("relatedPersons")}</h2>
        {persons.length > 0 ? (
          <Row className='related-container'>
            {persons.map(person => (
              <Col key={person.id} xs={12}>
                <Link
                  to={`/person/${person.internal_url || person.id}`}
                  className='related-card-link'
                >
                  <Card className='related-card'>
                    <Card.Img
                      src={
                        person.Image?.[0]?.url
                          ? `${BACKEND_HOST}${person.Image[0].url}`
                          : "https://placehold.co/150x150"
                      }
                      alt={person.Name_zh || "Person"}
                      className='related-card-img'
                    />
                    <Card.Body className='related-card-body'>
                      <Card.Title className='related-card-title'>
                        {person.Name_zh || person.Name_en}
                      </Card.Title>
                      <Card.Text className='related-card-role'>
                        {person.Title_zh || person.Title_en || t("noTitle")}
                      </Card.Text>
                      <Card.Text className='related-card-text'>
                        {person.Bio_zh || person.Bio_en || t("noBioAvailable")}
                      </Card.Text>
                      <Link
                        to={`/person/${person.internal_url || person.id}`}
                        className='read-more-btn'
                      >
                        {t("readMore")}
                      </Link>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        ) : (
          <p className='no-persons-text'>{t("noPersonsAvailable")}</p>
        )}
      </Container>
    </div>
  );
};

export default RelatedPersonsPage;
