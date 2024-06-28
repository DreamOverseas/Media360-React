import React from "react";
import { Container, Row, Card } from 'react-bootstrap';
import "../css/Home.css";

const Home = () => {
    return (
        <div className="homepage-container">
            <Container>
                <Row md={12} className="card-container">

                    <Card className="home-card"><Card.Img src="/homepage/sort_1.png" alt="Card image" />
                    <Card.ImgOverlay>
                        <Card.Title className='home-card-text'>Study</Card.Title>
                        <Card.Text className='home-card-text'>
                            Perfect for you as you planning to study overseas and seeking for helping hands at the new place!
                        </Card.Text>
                    </Card.ImgOverlay></Card>

                    <Card className="home-card"><Card.Img src="/homepage/sort_2.png" alt="Card image" />
                    <Card.ImgOverlay>
                        <Card.Title className='home-card-text'>Finance</Card.Title>
                        <Card.Text className='home-card-text'>
                            We help you to manage your wealth and multiply your success!
                        </Card.Text>
                    </Card.ImgOverlay></Card>

                    <Card className="home-card"><Card.Img src="/homepage/sort_3.png" alt="Card image" />
                    <Card.ImgOverlay>
                        <Card.Title className='home-card-text'>Travel</Card.Title>
                        <Card.Text className='home-card-text'>
                            Let's go travel with your sudden idea and meet our KOL on the go!
                        </Card.Text>
                    </Card.ImgOverlay></Card>

                    <Card className="home-card"><Card.Img src="/homepage/sort_4.png" alt="Card image" />
                    <Card.ImgOverlay>
                        <Card.Title className='home-card-text'>Life</Card.Title>
                        <Card.Text className='home-card-text'>
                            We care about your life here and feel free to reach out to us!
                        </Card.Text>
                    </Card.ImgOverlay></Card>

                </Row>
            </Container>
        </div>
    );

}

export default Home;