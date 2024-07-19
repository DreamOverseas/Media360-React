import React, { useState } from 'react';
import axios from 'axios';
import "../css/Footer.css";
import { Row, Col, Form, Button, Alert } from "react-bootstrap";

const Footer = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  /**
   * Function that handles submission on email to the subscription list of mailchimp
   */
  const subscribMe = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://mail-service.sapienplus.co/subscribe', { 
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

  return (
    <footer className='footer'>
      <div className='footer-column logo-contact'>
        <img src='/footer_logo.png' alt='Logo' className='footer-logo' />
        <div className='contact-info'>
          <p>171 La trobe Street, Melbourne VIC 3000</p>
          <p>0413 168 533</p>
          <p>john.du@do360.com</p>
        </div>
      </div>
      <div className='footer-column'>
        <h2>OUR PEOPLE</h2>
      </div>
      <div className='footer-column'>
        <h2>OUR MISSION</h2>
      </div>
      <div className='footer-column'>
        <h2>OUR EVENT</h2>
      </div>
      <div className='footer-column newsletter'>
        <h2>Join Our Newsletter</h2>
        <p>
          Sign up for our newsletter to enjoy free marketing tips, inspirations,
          and more.
        </p>
        <Form onSubmit={subscribMe}>
          <Form.Group controlId="formEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Subscribe
          </Button>
        </Form>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
      </div>
      <div className='footer-column qr-social'>
        <img src='/QR_placeholder.png' alt='QR Code' className='qr-code' />
        <p>Scan Me</p>
        <Row>
          <Col>
            <i class="bi bi-facebook"></i>
          </Col>
          <Col>
            <i class="bi bi-instagram"></i>
          </Col>
          <Col>
            <i class="bi bi-share"></i>
          </Col>
        </Row>
      </div>
    </footer>
  );
};

export default Footer;
