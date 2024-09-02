import React, { useState } from 'react';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from "react-i18next";
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import '../css/Footer.css';

// Load Backend Host for API calls
const EMAIL_SUBSCRIPTION = process.env.REACT_APP_EMAIL_SUBSCRIPTION + "360media-quick/";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Check if is on desktop
  const onDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  /**
   * Function that handles submission on email to the subscription list of mailchimp
   */
  const subscribMe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(EMAIL_SUBSCRIPTION, {
        email
      });
      setMessage(response.data.message);
      setEmail('');
      setError('');
    } catch (error) {
      setError(error.response.data.error);
      setMessage('');
    }
  };

  const { t } = useTranslation();

  return (
    <footer className='footer'>
      <Container>
        <Row>
          <Col md={3} className='footer-column logo-contact'>
            <img src='/footer_logo.png' alt='Logo' className='footer-logo' />
            <div className='contact-info'>
              <p>171 La trobe Street, Melbourne VIC 3000</p>
              <p>0413 168 533</p>
              <p>john.du@do360.com</p>
            </div>
          </Col>
          {onDesktop &&
            <Col className='footer-link'>
              <Row>
                <h5>{t("footer_people")}</h5>
              </Row>
              <Row>
                <h5>{t("footer_mission")}</h5>
              </Row>
              <Row>
                <h5>{t("footer_event")}</h5>
              </Row>
            </Col>
          }
          <Col md={3} className='footer-column newsletter'>
            <h2>{t("footer_join_title")}</h2>
            <p>
              {t("footer_join_intro")}
            </p>
            <Form onSubmit={subscribMe}>
              <Form.Group controlId="formEmail">
                <Form.Label>{t("footer_email")}</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                {t("footer_sub")}
              </Button>
            </Form>
            {message && <Alert variant="success">{message}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}
          </Col>
          {onDesktop &&
            <Col md={3} className='footer-column qr-social'>
              <img src='/QR_JohnDu.png' alt='QR Code' className='qr-code' />
              <p>Scan Me</p>
              <Row>
                <Col>
                  <i className="bi bi-facebook"></i>
                </Col>
                <Col>
                  <i className="bi bi-instagram"></i>
                </Col>
                <Col>
                  <i className="bi bi-share"></i>
                </Col>
              </Row>
            </Col>
          }
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
