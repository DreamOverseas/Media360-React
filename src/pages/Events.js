import axios from "axios";
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button, Image } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import "../css/EventPage.css";

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

// const initialImages = [
//     "events/case1.png",
//     "events/case2.png",
//     "events/case3.png",
//     "events/case4.png",
//     "events/case1.png",
//     "events/case2.png"

// ];

const Events = () => {
    // const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(null);
    const [events, setEvents] = useState([]);
    // const [images, setImages] = useState([]);
    const { t, i18n } = useTranslation();

    // const handleNext = () => {
    //     if (currentIndex + 4 < events.length) {
    //         setCurrentIndex(currentIndex + 1);
    //     } else {
    //         const nextImageIndex = currentIndex + 4;
    //         if (nextImageIndex < events.length) {
    //             setImages([...images, image_list[nextImageIndex]]);
    //             setCurrentIndex(currentIndex + 1);
    //         }
    //     }
    // };

    // const handlePrev = () => {
    //     if (currentIndex > 0) {
    //         setCurrentIndex(currentIndex - 1);
    //     }
    // };
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
    // const image_list = [];
    // for (let i = 0; i < events.length; i++) {
    //     image_list.push(events[i].attributes.Image.data.attributes.url)
        
    // }

    // setImages(image_list);

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div>
            <section className="event-page-background-image-container">
                <h1 className="event-page-banner-h1"><b>{t("event")}</b></h1>
            </section>
            <br />
            <section>
                <Container>
                    {events.map((event, index) => (
                        <Row key={index} className="event-item mb-5">
                            <Col lg={6} className="d-flex justify-content-end">
                                
                                {event ? (
                                    <Image src={`${BACKEND_HOST}${event.attributes.Image.data.attributes.url}`} fluid/>
                                ) : (
                                    <Image src='https://placehold.co/350x350' alt='Placeholder' fluid />
                                )}
                            </Col>
                            <Col lg={6} className="event-page-section">
                                <Row>
                                    <h4>{language ==="zh" ? event.attributes.Name_zh : event.attributes.Name_en}</h4>
                                </Row>
                                <Row className="event-page-description">
                                    <p>{language ==="zh" ? event.attributes.Short_zh : event.attributes.Short_en}</p>
                                </Row>
                                <Row className="event-page-reserve mt-auto">
                                    <Link to={`/event/${event.id}`} className="link-EventPage">
                                        <Button>{t("moreDetails")}</Button>
                                    </Link>
                                </Row>
                            </Col>
                        </Row>
                    ))}
                </Container>
            </section>
            <br />
            {/* <section>
                <Container fluid>
                    <Row>
                        <Col md={5}><hr /></Col>
                        <Col md={2} className="d-flex justify-content-center align-items-center">
                            <h5>You Might Be Interested</h5>
                        </Col>
                        <Col md={5}><hr /></Col>
                    </Row>
                </Container>
            </section>
            <br />
            <section>
                <Container fluid>
                    <Row>
                        <Col xs={1} className="d-flex align-items-center justify-content-start">
                            <Button variant="light" onClick={handlePrev} disabled={currentIndex === 0}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </Button>
                        </Col>
                        <Col xs={10}>
                            <Row>
                                {images.slice(currentIndex, currentIndex + 4).map((image, index) => (
                                    <Col key={index} xs={6} md={3}>
                                        <Image src={image} alt={`Image ${index}`} fluid />
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                        <Col xs={1} className="d-flex align-items-center justify-content-end">
                            <Button variant="light" onClick={handleNext}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </section> */}
            <br />
        </div>
    );
}

export default Events;

