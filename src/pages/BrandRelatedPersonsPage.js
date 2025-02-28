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
    <div className='related-persons-page'>
      <Container>
        <h2 className='page-title'>{t("relatedPersons")}</h2>
        {persons.length > 0 ? (
          <Row>
            {persons.map(person => (
              <Col key={person.id} xs={12} sm={6} md={4} lg={3}>
                <Link
                  to={`/person/${person.internal_url || person.id}`}
                  className='person-card-link'
                >
                  <Card className='person-card'>
                    <Card.Img
                      src={
                        person.Image?.[0]?.url
                          ? `${BACKEND_HOST}${person.Image[0].url}`
                          : "https://placehold.co/200x200"
                      }
                      alt={person.Name_zh || "Person"}
                      className='person-card-img'
                    />
                    <Card.Body>
                      <Card.Title className='person-card-title'>
                        {person.Name_zh || person.Name_en}
                      </Card.Title>
                      <Card.Text className='person-card-role'>
                        {person.Title_zh || person.Title_en || "No Title"}
                      </Card.Text>
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
