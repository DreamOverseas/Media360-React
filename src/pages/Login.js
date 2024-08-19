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
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation(); // Import the translation function

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
          error.response?.data?.error?.message || t("error_occurred");
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
          error.response?.data?.error?.message || t("error_occurred");
        setError(errorMessage);
      }
    } else {
      setError(t("password_mismatch"));
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
                  {t("sign_in")}
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
                  {t("sign_up")}
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
                              <Form.Label>{t("email")}</Form.Label>
                              <Form.Control
                                type='email'
                                placeholder={t("enter_email")}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                isInvalid={submitted && !email}
                              />
                              <Form.Control.Feedback type='invalid'>
                                {t("email_invalid")}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId='userPassword'>
                              <Form.Label>{t("password")}</Form.Label>
                              <Form.Control
                                type='password'
                                placeholder={t("enter_password")}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                isInvalid={submitted && !password}
                              />
                              <Form.Control.Feedback type='invalid'>
                                {t("password_required")}
                              </Form.Control.Feedback>
                            </Form.Group>
                            {error && <p className='error'>{error}</p>}
                            <div className='form-button-container'>
                              <Button variant='primary' type='submit'>
                                {t("sign_in")}
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
                              <Form.Label>{t("username")}</Form.Label>
                              <Form.Control
                                type='text'
                                placeholder={t("enter_username")}
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                isInvalid={submitted && !username}
                              />
                              <Form.Control.Feedback type='invalid'>
                                {t("username_invalid")}
                              </Form.Control.Feedback>
                            </Form.Group>

                            <Form.Group controlId='userEmail'>
                              <Form.Label>{t("email")}</Form.Label>
                              <Form.Control
                                type='email'
                                placeholder={t("enter_email")}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                isInvalid={submitted && !email}
                              />
                              <Form.Control.Feedback type='invalid'>
                                {t("email_invalid")}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId='userPassword'>
                              <Form.Label>{t("password")}</Form.Label>
                              <Form.Control
                                type='password'
                                placeholder={t("enter_password")}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                isInvalid={submitted && !password}
                              />
                              <Form.Control.Feedback type='invalid'>
                                {t("password_required")}
                              </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group controlId='confirmedPassword'>
                              <Form.Label>{t("confirm_password")}</Form.Label>
                              <Form.Control
                                type='password'
                                placeholder={t("confirm_password")}
                                value={confirmed}
                                onChange={e => setConfirmed(e.target.value)}
                                isInvalid={submitted && password !== confirmed}
                              />
                              <Form.Control.Feedback type='invalid'>
                                {t("password_mismatch")}
                              </Form.Control.Feedback>
                            </Form.Group>
                            {error && <p className='error'>{error}</p>}
                            <div className='form-button-container'>
                              <Button variant='primary' type='submit'>
                                {t("sign_up")}
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
            src={k ? t("sign_in_image") : t("sign_up_image")}
            fluid
          />
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
