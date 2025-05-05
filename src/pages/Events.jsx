import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from 'moment';
import 'moment-timezone';
import "../css/EventPage.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;


export const formatDateTime = (datetime) => {
  if (!datetime) return null;
  
  // Convert to your desired timezone (e.g., 'Australia/Sydney')
  const timezone = 'Australia/Sydney'; // Adjust this to your desired timezone
  
  // Format as 'Thu, 10 Oct, 12:00 am AEDT'
  return moment(datetime).tz(timezone).format('ddd, DD MMM, h:mm a z');
}

export const calculateTime = (start, end) => {
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

const Events = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [inProgressEvents, setInProgressEvents] = useState([]);
  const [pastEvents, setPastEvents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const lastEventElementRef = useRef();
  const { t } = useTranslation();
  // const language = i18n.language;

  // Fetch Upcoming & In Progress events
  useEffect(() => {
    setLoading(true);
    axios
      .all([
        axios.get(`${BACKEND_HOST}/api/events`, 
          { params: 
            { "filters[TimeLine][$eq]": "Upcoming",
              "sort": "Order:desc",
               "populate": "*" 
            } 
          }
        ),
        axios.get(`${BACKEND_HOST}/api/events`, 
          { params: 
            { "filters[TimeLine][$eq]": "In Progress", 
              "sort": "Order:desc",
              "populate": "*" 
            } 
          }
        )
      ])
      .then(
        axios.spread((upcomingRes, inProgressRes) => {
          setUpcomingEvents(upcomingRes.data.data || []);
          setInProgressEvents(inProgressRes.data.data || []);
        })
      )
      .catch((error) => {
        console.error("Error fetching Upcoming/In Progress events:", error);
        setError("Error fetching events");
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch Past Review events with pagination (scroll loading)
  const fetchPastEvents = (pageNum) => {
    setLoading(true);
    axios
      .get(`${BACKEND_HOST}/api/events`, {
        params: {
          "filters[TimeLine][$eq]": "Past Review",
          "pagination[page]": pageNum,
          "pagination[pageSize]": 8,
          "sort": "Order:desc",
          "populate": "*",
        },
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setPastEvents((prevEvents) => [...prevEvents, ...response.data.data]);
          setHasMore(response.data.meta.pagination.page < response.data.meta.pagination.pageCount);
        } else {
          setHasMore(false);
        }
      })
      .catch((error) => {
        console.error("Error fetching Past Review events:", error);
        setError("Error fetching past events");
      })
      .finally(() => setLoading(false));
  };

  const renderEventCard = (event,calculateTime) => {
    const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
    const eventName = event.Name_en;
    return (
      <Col xs={6} sm={4} md={4} className="mb-4">
        <Link to={`/events/${event.url}`} className="card-link-EventPage">
          <Card className="eventpage-event-card">
            {event.Image ? (
              <Card.Img variant="top" src={`${BACKEND_HOST}${event.Image.url}`} alt={eventName} />
            ) : (
              <Card.Img variant="top" src="https://placehold.co/250x350" alt="Placeholder" />
            )}
            <Card.Body>
              <Card.Title>{eventName}</Card.Title>
              {calculateTime(event.Start_Date, event.End_date) ? (
                <Card.Text className="eventpage-event-date">{calculateTime(event.Start_Date, event.End_Date)}</Card.Text>
              ) :(<></>)
              }
              <Card.Text className="eventpage-event-location">{event.Location}</Card.Text>
              <Card.Text className="eventpage-event-host">{event.Host}</Card.Text>
            </Card.Body>
          </Card>
        </Link>
      </Col>
    );
  };

  useEffect(() => {
    fetchPastEvents(page);
  }, [page]);

  useEffect(() => {
    if (loading || !hasMore) return;

    const observerCallback = (entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    };

    observer.current = new IntersectionObserver(observerCallback, { root: null, rootMargin: "100px", threshold: 0.5 });

    if (lastEventElementRef.current) {
      observer.current.observe(lastEventElementRef.current);
    }

    return () => {
      if (observer.current && lastEventElementRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.current.unobserve(lastEventElementRef.current);
      }
    };
  }, [loading, hasMore]);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <section className='event-page-background-image-container'>
        <h1 className='event-page-banner-h1'><b>{t("event")}</b></h1>
      </section>
      <br />
      <Container>

        <Row>
          <h2>Upcoming Events</h2>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map(event => renderEventCard(event, calculateTime))
          ) : (
            <p>暂时无活动</p>
          )}
        </Row>
        
        <Row>
          <h2>In Progress Events</h2>
          {inProgressEvents.length > 0 ? (
            inProgressEvents.map(event => renderEventCard(event, calculateTime))
          ) : (
            <p>暂时无活动</p>
          )}
        </Row>

        <Row>
          <h2>Past Review</h2>
          {pastEvents.map((event, index) => (
            <Col 

            key={event.id} 
            ref={index === pastEvents.length - 1 ? lastEventElementRef : null}
            >
              {renderEventCard(event,calculateTime)}
            </Col>
          ))}
        </Row>
        {loading && <div>Loading more past events...</div>}
      </Container>
    </div>
  );
};



export default Events;

