import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { useParams } from "react-router-dom";
import "../css/EventDetail.css";

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const EventDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_HOST}/api/events/${id}?populate=*`)
      .then(response => {
        if (response.data && response.data.data) {
          setEvent(response.data.data);
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      });
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!event) {
    return <div>{t("loading")}</div>;
  }

  const EventImage = event.attributes.Image;
  const language = i18n.language;
  const Description =
    language === "zh"
      ? event.attributes.Description_zh
      : event.attributes.Description_en;

  const ShortDescription =
    language === "zh" ? event.attributes.Short_zh : event.attributes.Short_en;

  const EventTime = event.attributes.Time;
  const EventLocation =
    language === "zh"
      ? event.attributes.Location_zh
      : event.attributes.Location_en;
  const EventHost =
    language === "zh" ? event.attributes.Host_zh : event.attributes.Host_en;

  return (
    <div>
      {/* Event Banner Section */}
      <section className='event-detail-background-image-container'>
        {/* 包裹横幅图片和文字的容器 */}
        <div className='event-banner-wrapper'>
          <Image
            src={`${BACKEND_HOST}${
              EventImage?.data?.attributes?.url ||
              "https://placehold.co/1200x600"
            }`} // 替换为实际图片路径或占位符
            alt='Event Banner'
            className='event-banner-image'
          />
          <div className='banner-text'>
            <h1 className='event-title'>
              {language === "zh"
                ? event.attributes.Name_zh
                : event.attributes.Name_en}
            </h1>
            <h2 className='event-subtitle'>{t("The Lifetimes Tour")}</h2>
          </div>
        </div>
      </section>

      <br />

      {/* Main Content Section */}
      <section>
        <Container>
          <Row className='event-detail-section'>
            {/* Left Column: Event Image */}
            <Col md={6} className='event-image-col'>
              {EventImage && EventImage.data ? (
                <Image
                  src={`${BACKEND_HOST}${EventImage.data.attributes.url}`}
                  alt={
                    language === "zh"
                      ? event.attributes.Name_zh
                      : event.attributes.Name_en
                  }
                  fluid
                />
              ) : (
                <Image
                  src='https://placehold.co/650x650'
                  alt='No Image Available'
                  fluid
                />
              )}
            </Col>

            {/* Right Column: Event Details */}
            <Col md={6} className='event-detail-col'>
              <Container className='event-detail'>
                <Row>
                  <h2>
                    {language === "zh"
                      ? event.attributes.Name_zh
                      : event.attributes.Name_en}
                  </h2>
                </Row>

                <Row className='event-short-description'>
                  <p>
                    {t("time")}: {EventTime ? EventTime : t("noTime")}
                  </p>
                  <p>
                    {t("location")}:{" "}
                    {EventLocation ? EventLocation : t("noLocation")}
                  </p>
                  <p>
                    {t("host")}: {EventHost ? EventHost : t("noHost")}
                  </p>
                  <div>
                    {ShortDescription ? (
                      <ReactMarkdown>{ShortDescription}</ReactMarkdown>
                    ) : (
                      t("noDescription")
                    )}
                  </div>
                </Row>

                <Row className='event-contact'>
                  <Col>
                    <Button className='event-register-btn'>
                      {t("comingSoon")}
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </section>

      <br />
      <br />

      {/* Event Description Section */}
      <section>
        <Container>
          <Row>
            <h1>
              <b>{t("eventDescription")}</b>
            </h1>
          </Row>
          <Row>
            <div className='markdown-content'>
              {Description ? (
                <ReactMarkdown>{Description}</ReactMarkdown>
              ) : (
                t("noDescription")
              )}
            </div>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default EventDetail;
