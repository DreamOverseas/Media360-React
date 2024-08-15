import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Image,
  Nav,
  Row,
  Tab,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../css/Login.css";

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [k, setK] = useState(true);
  const [activeKey, setActiveKey] = useState("sign-in");
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const loginPicture = () => {
    setK(prev => (prev === true ? false : true));
  };

  const handleSignin = async event => {
    event.preventDefault();
    setSubmitted(true);
    setError(null);

    if (email && password) {
      try {
        await login(email, password);
        navigate("/");
      } catch (error) {
        const errorMessage =
          error.response?.data?.error?.message || "An error occurred";
        setError(errorMessage);
      }
    }
  };

  const handleSignup = async event => {
    event.preventDefault();
    setSubmitted(true);
    setError(null);

    if (email && password && confirmed && password === confirmed) {
      try {
        const response = await axios.post(
          `${BACKEND_HOST}/api/auth/local/register`,
          {
            username,
            email,
            password,
          }
        );
        await login(email, password);
        Cookies.set("token", response.data.jwt, { expires: 7 });
        navigate("/");
      } catch (error) {
        const errorMessage =
          error.response?.data?.error?.message || "An error occurred";
        setError(errorMessage);
      }
    } else {
      setError("Passwords do not match");
    }
  };

  return (
    <Container>
      <Row>
        <Col md={6}>
          <Tab.Container
            defaultActiveKey='sign-in'
            onSelect={() => loginPicture()}
          >
            <Row>
              <Col>
                <Nav.Link
                  eventKey='sign-in'
                  className={`nav-link-Login ${
                    activeKey === "sign-in" ? "active" : ""
                  }`}
                  onClick={() => setActiveKey("sign-in")}
                >
                  Sign in
                </Nav.Link>
              </Col>
              <Col>
                <Nav.Link
                  eventKey='sign-up'
                  className={`nav-link-Login ${
                    activeKey === "sign-up" ? "active" : ""
                  }`}
                  onClick={() => setActiveKey("sign-up")}
                >
                  Sign up
                </Nav.Link>
              </Col>
            </Row>
            <Row>
              <Tab.Content>
                <Tab.Pane eventKey='sign-in'>
                  <Container>
                    <Row className='sign-in-table'>
                      <Card>
                        <Card.Body>
                          <Form onSubmit={handleSignin}>
                            <Form.Group controlId='userEmail'>
                              <Form.Label>Email</Form.Label>
                              <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                isInvalid={submitted && !email}
                              />
                              <Form.Control.Feedback type='invalid'>
                                Please provide a valid email.
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId='userPassword'>
                              <Form.Label>Password</Form.Label>
                              <Form.Control
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                isInvalid={submitted && !password}
                              />
                              <Form.Control.Feedback type='invalid'>
                                Password is required.
                              </Form.Control.Feedback>
                            </Form.Group>
                            {error && <p className='error'>{error}</p>}
                            <div className='form-button-container'>
                              <Button variant='primary' type='submit'>
                                Sign in
                              </Button>
                            </div>
                          </Form>
                        </Card.Body>
                      </Card>
                    </Row>
                  </Container>
                </Tab.Pane>
                <Tab.Pane eventKey='sign-up'>
                  <Container>
                    <Row className='sign-up-table'>
                      <Card>
                        <Card.Body>
                          <Form onSubmit={handleSignup}>
                            <Form.Group controlId='userUsername'>
                              <Form.Label>Username</Form.Label>
                              <Form.Control
                                type='text'
                                placeholder='Enter username'
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                isInvalid={submitted && !username}
                              />
                              <Form.Control.Feedback type='invalid'>
                                Please provide a valid username.
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId='userEmail'>
                              <Form.Label>Email</Form.Label>
                              <Form.Control
                                type='email'
                                placeholder='Enter email'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                isInvalid={submitted && !email}
                              />
                              <Form.Control.Feedback type='invalid'>
                                Please provide a valid email.
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId='userPassword'>
                              <Form.Label>Password</Form.Label>
                              <Form.Control
                                type='password'
                                placeholder='Password'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                isInvalid={submitted && !password}
                              />
                              <Form.Control.Feedback type='invalid'>
                                Password is required.
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId='confirmedPassword'>
                              <Form.Label>Confirm Password</Form.Label>
                              <Form.Control
                                type='password'
                                placeholder='Confirm Password'
                                value={confirmed}
                                onChange={e => setConfirmed(e.target.value)}
                                isInvalid={submitted && password !== confirmed}
                              />
                              <Form.Control.Feedback type='invalid'>
                                Two passwords do not match, please check again.
                              </Form.Control.Feedback>
                            </Form.Group>
                            {error && <p className='error'>{error}</p>}
                            <div className='form-button-container'>
                              <Button variant='primary' type='submit'>
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
          <Image
            className='login-image-display'
            src={k ? "sign-in.jpeg" : "sign-up.jpeg"}
            fluid
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
