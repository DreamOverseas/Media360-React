import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import "../Css/ProductRelated.css";

const BACKEND_HOST = import.meta.env.VITE_CMS_ENDPOINT;

const formatDateTime = (datetime) => {
  if (!datetime) return null;
  return new Date(datetime).toLocaleString("zh-AU", {
    timeZone: "Australia/Sydney",
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const calculateTime = (start, end) => {
  if (start && end) return `${formatDateTime(start)} - ${formatDateTime(end)}`;
  if (start) return formatDateTime(start);
  return null;
};

const ProductRelatedEvent = () => {
  const { state } = useLocation();
  const { t } = useTranslation();
  const eventItems = state?.event ?? [];

  return (
    <div>
      <Container>
        <h2 className="prouct-related-event-page-title">{t("relatedEvents")}</h2>
        {eventItems.length > 0 ? (
          <Row>
            {eventItems.map((event) => {
              const eventName = event.Name_zh || event.Name_en;
              return (
                <Col xs={12} sm={6} md={6} key={event.id}>
                  <Card className="product-related-event-card">
                    {event.Image ? (
                      <Card.Img
                        variant="top"
                        src={`${BACKEND_HOST}${event.Image.url}`}
                        alt={eventName}
                      />
                    ) : (
                      <Card.Img
                        variant="top"
                        src="https://placehold.co/250x350"
                        alt="Placeholder"
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{eventName}</Card.Title>
                      {calculateTime(event.Start_Date, event.End_Date) && (
                        <Card.Text className="product-related-event-date">
                          {calculateTime(event.Start_Date, event.End_Date)}
                        </Card.Text>
                      )}
                      {event.Location && (
                        <Card.Text className="product-related-event-location">
                          {event.Location}
                        </Card.Text>
                      )}
                      {event.Host && (
                        <Card.Text className="product-related-event-host">
                          {event.Host}
                        </Card.Text>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        ) : (
          <p>暂时无活动</p>
        )}
      </Container>
    </div>
  );
};

export default ProductRelatedEvent;
