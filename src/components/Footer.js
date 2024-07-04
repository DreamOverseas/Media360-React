import React from "react";
import "../css/Footer.css";
import { Row, Col } from "react-bootstrap";

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-column logo-contact'>
        <img src='footer_logo.png' alt='Logo' className='footer-logo' />
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
        <input type='email' placeholder='E-mail Address' />
        <button>Subscribe</button>
      </div>
      <div className='footer-column qr-social'>
        <img src='QR_placeholder.png' alt='QR Code' className='qr-code' />
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
