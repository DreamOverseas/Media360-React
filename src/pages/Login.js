import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Tab, Container, Card, Row, Col, Form, Button, Image, Nav} from 'react-bootstrap';
import "../css/Login.css";

const Login = () => {
    const [SignInEmail, setSignInEmail] = useState("");
    const [SignInPassword, setSignInPassword] = useState("");
    const [SignUpConfirmed, setSignUpConfirmed] = useState("");
    const [SignUpEmail, setSignUpEmail] =useState("")
    const [SignUpPassword, setSignUpPassword] =useState("")
    const [submitted, setSubmitted] = useState(false);
    const [k, setK] = useState(true);
    const [activeKey, setActiveKey] = useState('sign-in');

    const loginPicture = () => {
        setK((prev) => (prev === true ? false : true));
    };

    const handleSignIn = (event) => {
        event.preventDefault();
        setSubmitted(true);
        if (SignInEmail && SignInPassword) {
            // TODO: Implement login logic here when our server is ready
            console.log("Logging in with:", SignInEmail, SignInPassword);
        }
    };

    const handleSignUp = (event) => {
        event.preventDefault();
        setSubmitted(true);
        if (SignUpEmail && SignUpPassword && SignUpConfirmed) {
            // TODO: Implement login logic here when our server is ready
            console.log("Logging in with:", SignInEmail, SignInPassword);
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
                        <Row className="login-table">
                            <Tab.Content>
                                <Tab.Pane eventKey="sign-in">
                                    <Container>
                                        <Row className="sign-in-table">
                                            <Card>
                                                <Card.Body>
                                                    <Form onSubmit={handleSignIn}>
                                                        <Form.Group controlId="userEmail">
                                                            <Form.Label>Email</Form.Label>
                                                            <Form.Control
                                                                type="email"
                                                                placeholder="Enter email"
                                                                value={SignInEmail}
                                                                onChange={(e) => setSignInEmail(e.target.value)}
                                                                isInvalid={submitted && !SignInEmail}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a valid email.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <br></br>
                                                        <Form.Group controlId="userPassword">
                                                            <Form.Label>Password</Form.Label>
                                                            <Form.Control
                                                                type="password"
                                                                placeholder="Password"
                                                                value={SignInPassword}
                                                                onChange={(e) => setSignInPassword(e.target.value)}
                                                                isInvalid={submitted && !SignInPassword}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Password is required.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <br></br>
                                                        <Button variant="primary" type="submit">
                                                            Sign in
                                                        </Button>

                                                    </Form>
                                                </Card.Body>
                                            </Card>
                                        </Row>
                                    </Container>
                                </Tab.Pane>

                                <Tab.Pane eventKey="sign-up">
                                    <Container>
                                        <Row className="sign-up-table">
                                            <Card>
                                                <Card.Body>
                                                    <Form onSubmit={handleSignUp}>

                                                        <Form.Group controlId="userEmail">
                                                            <Form.Label>Email</Form.Label>
                                                            <Form.Control
                                                                type="email"
                                                                placeholder="Enter email"
                                                                value={SignUpEmail}
                                                                onChange={(e) => setSignUpEmail(e.target.value)}
                                                                isInvalid={submitted && !SignUpEmail}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Please provide a valid email.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <br></br>
                                                        <Form.Group controlId="userPassword">
                                                            <Form.Label>Password</Form.Label>
                                                            <Form.Control
                                                                type="password"
                                                                placeholder="Password"
                                                                value={SignUpPassword}
                                                                onChange={(e) => setSignUpPassword(e.target.value)}
                                                                isInvalid={submitted && !SignUpPassword}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Password is required.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <br></br>
                                                        <Form.Group controlId="confirmedPassword">
                                                            <Form.Label>Confirmed Password</Form.Label>
                                                            <Form.Control
                                                                type="password"
                                                                placeholder="Password"
                                                                value={SignUpConfirmed}
                                                                onChange={(e) => setSignUpConfirmed(e.target.value)}
                                                                isInvalid={submitted && !SignUpPassword && !SignUpConfirmed && SignUpPassword == SignUpConfirmed}
                                                            />
                                                            <Form.Control.Feedback type="invalid">
                                                                Two passwords are not the same, please check again.
                                                            </Form.Control.Feedback>
                                                        </Form.Group>
                                                        <br></br>
                                                        <Button variant="primary" type="submit">
                                                            Sign up
                                                        </Button>
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
