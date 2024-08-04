import React from "react";
import { Container, Row, Card, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import "../css/Home.css";

const MobileHome = () => {
    return (
        <div className="homepage-container-mobile">
            <Container className="home-card-container">
                <Col>
                    <Row>
                        <Link className="card-link" to={`/productStudy`}>
                            <Card className="home-card-mobile card-study">
                                <Card.Body className="card-body-mobile">
                                    <Row className="card-flex-mobile">
                                        <i class="bi bi-book-half card-icon-mobile"></i>
                                    </Row>
                                    <Row className="card-flex-mobile">
                                        <b className="card-title-mobile">Study</b>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Row>
                    <Row>

                        <Link className="card-link" to={`/productFinance`}>
                            <Card className="home-card-mobile card-finance">
                                <Card.Body className="card-body-mobile">
                                    <Row className="card-flex-mobile">
                                        <i class="bi bi-cash-coin card-icon-mobile"></i>
                                    </Row>
                                    <Row className="card-flex-mobile">
                                        <b className="card-title-mobile">Finance</b>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Row>
                    <Row>
                        <Link className="card-link" to={`/productTravel`}>
                            <Card className="home-card-mobile card-travel">
                                <Card.Body className="card-body-mobile">
                                    <Row className="card-flex-mobile">
                                        <i class="bi bi-suitcase card-icon-mobile"></i>
                                    </Row>
                                    <Row className="card-flex-mobile">
                                        <b className="card-title-mobile">Travel</b>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Row>
                    <Row>
                        <Link className="card-link" to={`/productLife`}>
                            <Card className="home-card-mobile card-life">
                                <Card.Body className="card-body-mobile">
                                    <Row className="card-flex-mobile">
                                        <i class="bi bi-cup-hot card-icon-mobile"></i>
                                    </Row>
                                    <Row className="card-flex-mobile">
                                        <b className="card-title-mobile">Life</b>
                                    </Row>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Row>
                </Col>
            </Container>
        </div>
    );
}

export default MobileHome;
