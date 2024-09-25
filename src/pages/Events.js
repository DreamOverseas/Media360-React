import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../css/EventPage.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const Events = () => {
  const [error, setError] = useState(null);
  const [events, setEvents] = useState([]);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    axios
      .get(`${BACKEND_HOST}/api/events?populate=*`)
      .then(response => {
        if (response.data && response.data.data) {
          setEvents(response.data.data);
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      });
  }, []);

  const language = i18n.language;

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <section className='event-page-background-image-container'>
        <h1 className='event-page-banner-h1'>
          <b>{t("event")}</b>
        </h1>
      </section>
      <br />
      <section>
        <Container>
          {events.map((event, index) => (
            <Row key={index} className='event-item mb-5'>
              <Col lg={6} className='d-flex justify-content-end'>
                {event ? (
                  <Image
                    src={`${BACKEND_HOST}${event.attributes.Image.data.attributes.url}`}
                    fluid
                    className='event-image'
                  />
                ) : (
                  <Image
                    src='https://placehold.co/350x350'
                    alt='Placeholder'
                    fluid
                    className='event-image'
                  />
                )}
              </Col>
              <Col lg={6} className='event-page-section'>
                <Row>
                  <h4 className='event-title'>
                    {language === "zh"
                      ? event.attributes.Name_zh
                      : event.attributes.Name_en}
                  </h4>
                </Row>
                <Row className='event-page-description'>
                  <p>
                    {language === "zh"
                      ? event.attributes.Short_zh
                      : event.attributes.Short_en}
                  </p>
                </Row>
                <Row className='event-page-more-detail mt-auto'>
                  <Link to={`/event/${event.id}`} className='link-EventPage'>
                    <Button className='event-button'>{t("moreDetails")}</Button>
                  </Link>
                </Row>
              </Col>
            </Row>
          ))}
        </Container>
      </section>
      <br />
    </div>
  );
};

export default Events;
