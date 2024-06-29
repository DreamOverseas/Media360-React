import React, { useState } from 'react';
import {Tab, Container, Card, Row, Col, Form, Button, Image, Nav} from 'react-bootstrap';
import "../css/EventPage.css";


const Events = () => {
    // const [email, setEmail] = useState("");
    // const [password, setPassword] = useState("");
    // const [confirmed, setConfirmed] = useState("");
    // const [submitted, setSubmitted] = useState(false);
    // const [k, setK] = useState(true);
    // const [activeKey, setActiveKey] = useState('sign-in');

    // const loginPicture = () => {
    //     setK((prev) => (prev === true ? false : true));
    // };

    // const handleSignin = (event) => {
    //     event.preventDefault();
    //     setSubmitted(true);
    //     if (email && password) {
    //         // TODO: Implement login logic here when our server is ready
    //         console.log("Logging in with:", email, password);
    //     }
    // };

    return (
        <div>
            <section className="banner-section">
                <Image src="../../Banner-Sponsor.jpg" fluid/>
                <h1 className = "sponsor-banner-h1">Our Events</h1>
            </section>
            <br />
            <section>
                <Container fluid>
                    <Row>
                        <Col>
                            <Image src="../../Banner-Sponsor.jpg" fluid/>
                        </Col>
                        <Col>
                            <Row>
                                <Col>
                                    <Row>
                                        <h4>lsadasdsad</h4>
                                    </Row>
                                    <Row>
                                        <p>
                                            dsfsdfdsf dsasadsad da sda  
                                        </p>
                                    </Row> 
                                </Col>
                                <Col>
                                    <Button>
                                        Reserve Now
                                    </Button>
                                </Col>
                            </Row>
                            <Row>
                                <p>
                                    asdasdsadsad afda safsa fasf asf asf asfasf
                                </p>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </section>
            <hr></hr>
            <section>
                <Container>
                    
                </Container>
            </section>
            
        </div>
    );
}

export default Events;