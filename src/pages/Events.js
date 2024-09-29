import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import moment from 'moment';
import 'moment-timezone';
import "../css/EventPage.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const Events = () => {
  const [events, setEvents] = useState([]); // List of events
  const [error, setError] = useState(null); // Error state
  const [loading, setLoading] = useState(false); // Loading state
  const [page, setPage] = useState(1); // Current page number for pagination
  const [hasMore, setHasMore] = useState(true); // Whether more events can be loaded
  const observer = useRef(); // Ref for observing the last event element
  const { t, i18n } = useTranslation();
  const language = i18n.language;

  // Function to fetch events
  const fetchEvents = (pageNum) => {
    setLoading(true);
    axios
      .get(`${BACKEND_HOST}/api/events`, {
        params: {
          "filters[Active][$eq]": true,
          "pagination[page]": pageNum,
          "pagination[pageSize]": 8, // Load 8 events per page
          "sort": "Order:desc",
          "populate": "*",
        },
      })
      .then((response) => {
        if (response.data && response.data.data) {
          setEvents((prevEvents) => [...prevEvents, ...response.data.data]);
          setHasMore(response.data.meta.pagination.page < response.data.meta.pagination.pageCount); // Check if more events are available
        } else {
          setHasMore(false); // If no more events, set to false
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      })
      .finally(() => setLoading(false));
  };

  // Fetch data when the page number changes
  useEffect(() => {
    fetchEvents(page); // Load the first page of events
  }, [page]);


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

  // Ref to track the last event in the list
  const lastEventElementRef = useRef();

  // Use IntersectionObserver to detect when the user scrolls to the last event
  useEffect(() => {
    if (loading) return; // Skip if currently loading
    if (!hasMore) return; // Stop if no more events to load

    const observerCallback = (entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1); // Increment page when the last event comes into view
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0, // Trigger when the last event is fully visible
    };

    observer.current = new IntersectionObserver(observerCallback, observerOptions);

    if (lastEventElementRef.current) {
      observer.current.observe(lastEventElementRef.current); // Observe the last event
    }

    return () => {
      if (observer.current && lastEventElementRef.current) {
        observer.current.unobserve(lastEventElementRef.current); // Cleanup the observer
      }
    };
  }, [loading, hasMore]);

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
      <Container>
        <Row>
          {events.map((event, index) => {
            const isLastElement = index === events.length - 1; // Check if it's the last event
            const eventName = language === "zh" ? event.attributes.Name_zh : event.attributes.Name_en;
            
            return (
              <Col
                key={event.id}
                xs={6} // 2 items per row on extra small devices (optional)
                sm={4} // 3 items per row on small devices
                md={4} // 3 items per row on medium devices and above
                className="mb-4"
                ref={isLastElement ? lastEventElementRef : null} // Attach ref to the last event
              >
                <Link to={`/event/${event.attributes.url}`} className="card-link-EventPage">
                  <Card className="eventpage-event-card">
                    {event.attributes.Image?.data ? (
                      <Card.Img
                        variant="top"
                        src={`${BACKEND_HOST}${event.attributes.Image.data.attributes.url}`}
                        alt={eventName}
                      />
                    ) : (
                      <Card.Img
                        variant="top"
                        src="https://placehold.co/250x350"
                        fluid
                        alt="Placeholder"
                      />
                    )}
                    <Card.Body>
                      <Card.Title title={eventName}>{eventName}</Card.Title>
                      {calculateTime(event.attributes.Start_Date, event.attributes.End_date) ? (
                        <Card.Text className="eventpage-event-date">{calculateTime(event.attributes.Start_Date, event.attributes.End_Date)}</Card.Text>
                      ) :(<></>)
                      }
                      <Card.Text className="eventpage-event-location">{event.attributes.Location}</Card.Text>
                      <Card.Text className="eventpage-event-host">{event.attributes.Host}</Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
        {loading && <div>Loading more events...</div>} {/* Show loading text when fetching more events */}
      </Container>
    </div>
  );
};

export default Events;

