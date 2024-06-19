// src/pages/Login.js
// Login page provides a bridge fror members to login or lead new comers to register page
import "../css/Forms.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const navigate = useNavigate();

    const handleLogin = (event) => {
        event.preventDefault();
        setSubmitted(true);
        if (email && password) {
            // TODO: Implement login logic here when our server is ready
            console.log("Logging in with:", email, password);
        }
    };

    return (
        <Container className="mt-5 align-items-center justify-content-center" style={{ minHeight: "100vh" }}>
            <Row>
                <Col md={6} className="mx-auto">
                    <Card>
                        <Card.Body>
                            <Card.Title className="text-center"><h2>Login to Ur Account</h2></Card.Title>
                            <Form onSubmit={handleLogin}>
                                <Form.Group controlId="userEmail">
                                    <Form.Label>Email address</Form.Label>
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
                                <Button variant="link" type="register" block onClick={() => navigate("/Register")}>
                                    I'm new here!
                                </Button><br />
                                <div className="form-button-container">
                                    <Button variant="primary" type="submit">
                                        Login
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Login;
