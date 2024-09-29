import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";
import moment from 'moment';
import 'moment-timezone';
import "../css/EventDetail.css";

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const EventDetail = () => {
  const location = useLocation()
  const { t, i18n } = useTranslation();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const path = location.pathname.replace('/event/', '')
    axios
      .get(`${BACKEND_HOST}/api/events`,{
          params: {
            'filters[url]': path,
            'populate': 'Image'
          }
      })
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
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (!event) {
    return <div>{t("loading")}</div>;
  }

  const formatDateTime = (datetime) => {
    if (!datetime) return null;
    
    // Convert to your desired timezone (e.g., 'Australia/Sydney')
    const timezone = 'Australia/Sydney'; // Adjust this to your desired timezone
    
    // Format as 'Thu, 10 Oct, 12:00 am AEDT'
    return moment(datetime).tz(timezone).format('ddd, DD MMM, h:mm a z');
  }

  const calculateTime = (start, end) => {
    if (start && end) {
      const head = formatDateTime(start);
      const tail = formatDateTime(end);
      return `${head} - ${tail}`;
    }

    if (start != null && end == null) {
      return formatDateTime(start);
    }

    return null;
  }

  const EventImage = event[0].attributes.Image;
  const language = i18n.language;
  const Description =
    language === "zh"
      ? event[0].attributes.Description_zh
      : event[0].attributes.Description_en;

  const ShortDescription =
    language === "zh" ? event[0].attributes.Short_zh : event.attributes.Short_en;

  const EventTime = calculateTime(event[0].attributes.Start_Date, event[0].attributes.End_Date);
  const EventLocation = event[0].attributes.Location;
  const EventHost = event[0].attributes.Host;

  return (
    <div>
      {/* Event Banner Section */}
      <section className='event-detail-background-image-container'>

        <div className='event-banner-wrapper'>
          <Image
            src={`${BACKEND_HOST}${
              EventImage?.data?.attributes?.url ||
              "https://placehold.co/1200x600"
            }`}
            alt='Event Banner'
            className='event-banner-image'
          />
          <div className='banner-text'>
            <h1 className='event-title'>
              {language === "zh"
                ? event[0].attributes.Name_zh
                : event[0].attributes.Name_en}
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
                      ? event[0].attributes.Name_zh
                      : event[0].attributes.Name_en
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
                      ? event[0].attributes.Name_zh
                      : event[0].attributes.Name_en}
                  </h2>
                </Row>

                <Row className='event-short-description'>
                  <p>
                    {t("time")}: {EventTime ? EventTime : t("noTime")}
                  </p>
                  <p>
                    {t("location")}:{EventLocation ? EventLocation : t("noLocation")}
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
