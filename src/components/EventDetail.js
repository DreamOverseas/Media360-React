import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Image } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { useLocation } from "react-router-dom";
import moment from 'moment';
import 'moment-timezone';
import "../css/EventDetail.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faMapMarkerAlt, faUserTie } from '@fortawesome/free-solid-svg-icons';

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const EventDetail = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const path = location.pathname.replace('/event/', '');
    axios
      .get(`${BACKEND_HOST}/api/events`, {
        params: {
          'filters[url]': path,
          'populate': 'Image'
        }
      })
      .then(response => {
        const eventData = response.data?.data || null; // 确保 data 存在
        if (eventData && eventData.length > 0) {
          setEvent(eventData);
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      });
  }, [location]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!event) {
    return <div>{t("loading")}</div>;
  }

  // 时间防御处理，显示 "N/A" 代替空值
  const formatDateTime = (datetime) => {
    if (!datetime) return "N/A";

    const timezone = 'Australia/Sydney'; // 可根据需求调整
    return moment(datetime).tz(timezone).format('ddd, DD MMM, h:mm a z');
  };

  const calculateTime = (start, end) => {
    if (!start) return "N/A";

    const startTime = formatDateTime(start);
    const endTime = end ? formatDateTime(end) : null;

    return endTime ? `${startTime} - ${endTime}` : startTime;
  };


  const eventAttributes = event[0]?.attributes || {};
  const EventImage = eventAttributes.Image?.data?.attributes?.url || "https://placehold.co/1200x600";

  const language = i18n.language;
  const Description = language === "zh" ? eventAttributes.Description_zh || "N/A" : eventAttributes.Description_en || "N/A";
  const ShortDescription = language === "zh" ? eventAttributes.Short_zh || "N/A" : eventAttributes.Short_en || "N/A";

  const EventTime = calculateTime(eventAttributes.Start_Date, eventAttributes.End_Date);
  const EventLocation = eventAttributes.Location || "N/A";
  const EventHost = eventAttributes.Host || "N/A";


  const isEventEnded = () => {
    const currentTime = moment();
    const eventEndTime = eventAttributes.End_Date
      ? moment(eventAttributes.End_Date)
      : moment(eventAttributes.Start_Date);
    return currentTime.isAfter(eventEndTime);
  };

  return (
    <div>
      {/* Event Banner Section */}
      <section className='event-detail-background-image-container'>
        <Container className='event-banner-wrapper'>
          <Image
            src={`${BACKEND_HOST}${EventImage}`}
            alt='Event Banner'
            className='event-banner-image'
          />
          {/* <div className='banner-text'>
            <h1 className='event-title'>
              {language === "zh"
                ? eventAttributes.Name_zh || "N/A"
                : eventAttributes.Name_en || "N/A"}
            </h1>
            <h2 className='event-subtitle'>{t("The Lifetimes Tour")}</h2>
          </div> */}
        </Container>
      </section>

      <br />

      {/* Main Content Section */}
      <section>
        <Container>
          <Row className='event-detail-section'>
            <Col md={12} className='event-detail-col'>
              <Container className='event-detail'>
                <Row>
                  <h2>
                    {language === "zh"
                      ? eventAttributes.Name_zh || "N/A"
                      : eventAttributes.Name_en || "N/A"}
                  </h2>
                </Row>

                <Row className='event-info'>
                  <Row>
                    <p>
                      <FontAwesomeIcon icon={faClock} />{' '}
                      <strong>{t("time")}:</strong>&nbsp;{EventTime}
                    </p>
                  </Row>
                  <Row>
                    <p>
                      <FontAwesomeIcon icon={faMapMarkerAlt} />{' '}
                      <strong>{t("location")}:</strong>&nbsp;{EventLocation}
                    </p>
                  </Row>
                  <Row>
                    <p>
                      <FontAwesomeIcon icon={faUserTie} />{' '}
                      <strong>{t("host")}:</strong>&nbsp;{EventHost}
                    </p>
                  </Row>
                </Row>

                <Row>
                  <Col>
                    {ShortDescription !== "N/A" ? (
                      <ReactMarkdown>{ShortDescription}</ReactMarkdown>
                    ) : (
                      <p>{t("noDescription")}</p>
                    )}
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
              {Description !== "N/A" ? (
                <ReactMarkdown>{Description}</ReactMarkdown>
              ) : (
                <p>{t("noDescription")}</p>
              )}
            </div>
          </Row>
        </Container>
      </section>

      <div className="floating-register-btn">
        {isEventEnded() ? (
          <Button variant="secondary" disabled>{t("eventEnded")}</Button>
        ) : (
          <Button variant="primary">{t("registerNow")}</Button>
        )}
      </div>
    </div>
  );
};

export default EventDetail;