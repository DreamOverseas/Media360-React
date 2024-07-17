import React, { useState } from 'react';
import {Container,Row, Col, Button, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import "../css/EventPage.css";


const eventsImg = [
    {
        image:"events/showcase1.png",
        title: "lsadasdsad",
        brief: "dsfsdfdsf dsasadsad da sda",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    },
    {
        image:"events/showcase1.png",
        title: "lsadasdsad",
        brief: "dsfsdfdsf dsasadsad da sda",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    },
    {
        image:"events/showcase1.png",
        title: "lsadasdsad",
        brief: "dsfsdfdsf dsasadsad da sda",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."
    }





];

const initialImages = [
    "events/case1.png",
    "events/case2.png",
    "events/case3.png",
    "events/case4.png",
];

const Events = () => {
    const [images, setImages] = useState(initialImages);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        if (currentIndex + 4 < initialImages.length) {
            setCurrentIndex(currentIndex + 1);
        } else {
            // Load next image dynamically
            const nextImageIndex = currentIndex + 4;
            if (nextImageIndex < initialImages.length) {
                setImages([...images, initialImages[nextImageIndex]]);
                setCurrentIndex(currentIndex + 1);
            }
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    return (
        <div>
            <section className="event-page-background-image-container">
                <h1 className = "event-page-banner-h1"><b>Our Events</b></h1>
            </section>
            <br />
            <section>
                <Container>
                    {eventsImg.map(event => (
                        <Row className="event-item">
                            <Col className="d-flex justify-content-end">
                                <Image src={event.image} fluid/>
                            </Col>
                            <Col className="event-page-section">
                                <Row>
                                    <Col>
                                        <Row>
                                            <h4>{event.title}</h4>
                                        </Row>
                                        <Row>
                                            <p>
                                                {event.brief}
                                            </p>
                                        </Row> 
                                    </Col>
                                </Row>
                                <Row className="event-page-description">
                                    <p>
                                        {event.description}
                                    </p>
                                </Row>
                                <Row className="event-page-reserve">
                                    <Button>
                                        Reserve Now
                                    </Button>
                                </Row>
                            </Col>
                        </Row>))}
                </Container>
            </section>
            <br/>
            <b/>
            <section>
                <Container fluid>
                    <Row>
                        <Col md={5}>
                            <hr></hr>
                        </Col>
                        <Col md={2} className="d-flex justify-content-center align-items-center">
                            <h5>You Might Be Interested</h5>
                        </Col>
                        <Col md={5}>
                            <hr></hr>
                        </Col>
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
                                        <img src={image} alt={`Image ${index}`} className="img-fluid" />
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
            </section>
            <br />
        </div>
    );
}

export default Events;