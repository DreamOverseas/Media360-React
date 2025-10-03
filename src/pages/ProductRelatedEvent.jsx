import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";
import moment from 'moment';
import 'moment-timezone';
import "../css/ProductRelated.css";

const DEBUG = import.meta.env.DEBUG;

const ProductRelatedEvent = () => {
  const { state } = useLocation();
  const { t } = useTranslation();

  const eventItems = state?.event ?? [];
  if (DEBUG) console.log(eventItems)

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


  const renderEventCard = (event,calculateTime) => {
    const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
    const eventName = event.Name_zh;
    return (
      <Col xs={12} sm={6} md={6}>
        <Link to={`/events/${event.url}`} className="card-link-product-related-event">
          <Card className="product-related-event-card">
            {event.Image ? (
              <Card.Img variant="top" src={`${BACKEND_HOST}${event.Image.url}`} alt={eventName} />
            ) : (
              <Card.Img variant="top" src="https://placehold.co/250x350" alt="Placeholder" />
            )}
            <Card.Body>
              <Card.Title>{eventName}</Card.Title>
              {calculateTime(event.Start_Date, event.End_date) ? (
                <Card.Text className="product-related-event-date">{calculateTime(event.Start_Date, event.End_Date)}</Card.Text>
              ) :(<></>)
              }
              <Card.Text className="product-related-event-location">{event.Location}</Card.Text>
              <Card.Text className="product-related-event-host">{event.Host}</Card.Text>
            </Card.Body>
          </Card>
        </Link>
      </Col>
    );
  };

  return (
    <div>
      <Container>
        <h2 className='prouct-related-event-page-title'>{t("relatedEvents")}</h2>
        {eventItems.length > 0 ? (
                  <Row>
                    {eventItems.map(event => renderEventCard(event, calculateTime))}
                  </Row>
                ) : (
                  <p>暂时无活动</p>
                )}
      </Container>
    </div>
  );
};

export default ProductRelatedEvent;