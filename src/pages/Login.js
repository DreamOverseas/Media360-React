import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Container, Card, Row, Col, Form, Button, Image, Nav} from 'react-bootstrap';
import "../css/Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmed, setConfirmed] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [k, setK] = useState(true);
    const [activeKey, setActiveKey] = useState('sign-in');

    const loginPicture = () => {
        setK((prev) => (prev === true ? false : true));
    };

    const handleSignin = (event) => {
        event.preventDefault();
        setSubmitted(true);
        if (email && password) {
            // TODO: Implement login logic here when our server is ready
            console.log("Logging in with:", email, password);
        }
    };

    return (
        <Container>
            <Row>
            <Col md={6}>
                <Tab.Container defaultActiveKey="sign-in" onSelect={() => loginPicture()}>
                    <Row>
                        <Col>
                            <Nav.Link eventKey="sign-in" 
                            className={`nav-link-Login ${activeKey === 'sign-in' ? 'active' : ''}`}
                            onClick={() => setActiveKey('sign-in')}>
                                Sign in
                            </Nav.Link>
                        </Col>
                        <Col>
                            <Nav.Link eventKey="sign-up" 
                            className={`nav-link-Login ${activeKey === 'sign-up' ? 'active' : ''}`}
                            onClick={() => setActiveKey('sign-up')}>
                                Sign up
                            </Nav.Link>
                        </Col>
                    </Row>
                    <Row>
                        <Tab.Content>
                            <Tab.Pane eventKey="sign-in">
                                <Container>
                                    <Row className="sign-in-table">
                                        <Card>
                                            <Card.Body>
                                                <Form onSubmit={handleSignin}>
                                                    <Form.Group controlId="userEmail">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            placeholder="Enter email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            isInvalid={submitted && !email}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            Please provide a valid email.
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group controlId="userPassword">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            placeholder="Password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            isInvalid={submitted && !password}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            Password is required.
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                    <div className="form-button-container">
                                                        <Button variant="primary" type="submit">
                                                            Sign in
                                                        </Button>
                                                    </div>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    </Row>
                                </Container>
                            </Tab.Pane>
                            <Tab.Pane eventKey="sign-up">
                                <Container>
                                    <Row className="sign-in-table">
                                        <Card>
                                            <Card.Body>
                                                <Form onSubmit={handleSignin}>
                                                    <Form.Group controlId="userEmail">
                                                        <Form.Label>Email</Form.Label>
                                                        <Form.Control
                                                            type="email"
                                                            placeholder="Enter email"
                                                            value={email}
                                                            onChange={(e) => setEmail(e.target.value)}
                                                            isInvalid={submitted && !email}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            Please provide a valid email.
                                                        </Form.Control.Feedback>
                                                    </Form.Group>

                                                    <Form.Group controlId="userPassword">
                                                        <Form.Label>Password</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            placeholder="Password"
                                                            value={password}
                                                            onChange={(e) => setPassword(e.target.value)}
                                                            isInvalid={submitted && !password}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            Password is required.
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                    <Form.Group controlId="confirmedPassword">
                                                        <Form.Label>Confirmed Password</Form.Label>
                                                        <Form.Control
                                                            type="password"
                                                            placeholder="Password"
                                                            value={confirmed}
                                                            onChange={(e) => setConfirmed(e.target.value)}
                                                            isInvalid={password === confirmed}
                                                        />
                                                        <Form.Control.Feedback type="invalid">
                                                            Two passwords are not the same, please check again.
                                                        </Form.Control.Feedback>
                                                    </Form.Group>
                                                    <div className="form-button-container">
                                                        <Button variant="primary" type="submit">
                                                            Sign up
                                                        </Button>
                                                    </div>
                                                </Form>
                                            </Card.Body>
                                        </Card>
                                    </Row>
                                </Container>
                            </Tab.Pane>
                        </Tab.Content>
                    </Row>
                </Tab.Container>
            </Col>
            <Col md={6}>
                <Image src={ k ? "https://placehold.co/650x650" : "https://placehold.co/750x750"} fluid/>
            </Col>
            </Row>
        </Container>
    );
}

export default Login;
