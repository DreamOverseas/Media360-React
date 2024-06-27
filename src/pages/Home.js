import React from "react";
import { Container, Row, Col, Card } from 'react-bootstrap';
import "../css/Home.css";

const Home = () => {
    return (
        <div className="homepage-container">
            <Container>
                <Row md={9} className="card-container">
                    <Col>
                        <Card className="home-card"><Card.Img src="/homepage/sort_1.png" alt="Card image" /></Card>
                    </Col>
                    <Col>
                        <Card className="home-card"><Card.Img src="/homepage/sort_2.png" alt="Card image" /></Card>
                    </Col>
                    <Col>
                        <Card className="home-card"><Card.Img src="/homepage/sort_3.png" alt="Card image" /></Card>
                    </Col>
                    <Col>
                        <Card className="home-card"><Card.Img src="/homepage/sort_4.png" alt="Card image" /></Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );

}

export default Home;