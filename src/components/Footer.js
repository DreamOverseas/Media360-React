import axios from "axios";
import React, { useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import "../css/Footer.css";

// Load Backend Host for API calls
const EMAIL_SUBSCRIPTION =
  process.env.REACT_APP_EMAIL_SUBSCRIPTION + "quick-subscription";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Check if is on desktop
  const onDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  /**
   * Function that handles submission on email to the subscription list of mailchimp
   */
  const subscribMe = async e => {
    e.preventDefault();
    try {
      await axios.post(EMAIL_SUBSCRIPTION, {
        email: email,
        source: "360 Media",
      });
      setMessage("Successfully subscribed!");
      setEmail("");
      setError("");
    } catch (error) {
      setError(
        "Oops... There's some problem with it. Please try it later or contact us for help."
      );
      setMessage("");
    }
  };

  const { t } = useTranslation();

  return (
    <footer className='footer'>
      <Container className='mobile-footer-container'>
        {onDesktop ? (
          // 桌面端布局
          <Row className='d-flex desktop-layout'>
            <Col md={3} className='footer-column logo-contact'>
              <img src='/footer_logo.png' alt='Logo' className='footer-logo' />
              <div className='contact-info'>
                <Row>
                  <Col
                    xs={1}
                    className='d-flex justify-content-center align-items-center'
                  >
                    <i className='bi bi-pin-map-fill'></i>
                  </Col>
                  <Col>
                    <p>
                      L2 171 La Trobe Street <br /> Melbourne VIC 3000
                    </p>
                  </Col>
                </Row>
                <Row>
                  <Col
                    xs={1}
                    className='d-flex justify-content-center align-items-center'
                  >
                    <i className='bi bi-telephone-inbound-fill'></i>
                  </Col>
                  <Col>
                    <p>0413 168 533</p>
                  </Col>
                </Row>
                <Row>
                  <Col
                    xs={1}
                    className='d-flex justify-content-center align-items-center'
                  >
                    <i className='bi bi-mailbox2'></i>
                  </Col>
                  <Col>
                    <p>info@do360.com</p>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={6}>
              <Row className='d-flex justify-content-center'>
                <h2 style={{ textAlign: "left" }}>成为代言人、加入我们？</h2>
                <Button
                  className='update-function-btn'
                  onClick={() =>
                    window.open(
                      "https://do360.com/pages/360media-files-upload-standard",
                      "_blank"
                    )
                  }
                >
                  加入我们
                </Button>
              </Row>
            </Col>

            {/*<Col md={6} className='subscribe-column newsletter'>
              <h2>{t("footer_join_title")}</h2>
              <p>{t("footer_join_intro")}</p>
              <Form onSubmit={subscribMe}>
                <Form.Group controlId='formEmail'>
                  <Form.Control
                    type='email'
                    placeholder={t("enterEmail")}
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <div className='d-flex justify-content-end'>
                  <Button
                    variant='primary'
                    type='submit'
                    className='subscribe-button'
                  >
                    {t("footer_sub")}
                  </Button>
                </div>
              </Form>
              {message && <Alert variant='success'>{message}</Alert>}
              {error && <Alert variant='danger'>{error}</Alert>}
            </Col>*/}

            <Col md={3} className='footer-column qr-social text-end'>
              <img src='/QR_JohnDu.png' alt='QR Code' className='qr-code' />
              <p>{t("footer_scan")}</p>
            </Col>
          </Row>
        ) : (
          // mobile view
          <div>
            <Image
              src='/footer_logo.png'
              alt='Logo'
              className='mobile-footer-logo'
              fluid
            />
            <Row className='footer-contact-info'>
              <Row>
                <Col>
                  <Row>
                    <Col xs={2}>
                      <i className='bi bi-pin-map-fill'></i>
                    </Col>
                    <Col xs={10}>
                      <p>
                        L2 171 La Trobe Street <br /> Melbourne VIC 3000
                      </p>
                    </Col>
                  </Row>
                </Col>

                <Col>
                  <Row>
                    <Col xs={2}>
                      <i className='bi bi-telephone-inbound-fill'></i>
                    </Col>
                    <Col xs={10}>
                      <p>0413 168 533</p>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Row>
                    <Col xs={2}>
                      <i className='bi bi-mailbox2'></i>
                    </Col>
                    <Col xs={10}>
                      <p>info@do360.com</p>
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <></>
                </Col>
              </Row>
            </Row>
            <Row className='footer-subscription'>
              <h4 style={{ textAlign: "left" }}>成为代言人、加入我们？</h4>
              <Button
                variant='primary'
                type='submit'
                className='update-function-btn'
                onClick={() =>
                  window.open(
                    "https://do360.com/pages/360media-files-upload-standard",
                    "_blank"
                  )
                }
              >
                加入我们
              </Button>
            </Row>
            {/* <Row className='footer-subscription'>
              <Col className='subscribe-column newsletter'>
                <h6>{t("footer_join_title")}</h6>
                <p>{t("footer_join_intro")}</p>
                 <Form onSubmit={subscribMe}>
                <Form.Group controlId="formEmail">
                  <Form.Control
                    type="email"
                    placeholder={t("enterEmail")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>
                <div className='d-flex justify-content-end'>
                  <Button variant="primary" type="submit" className='subscribe-button'>
                    {t("footer_sub")}
                  </Button>
                </div>
              </Form>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="danger">{error}</Alert>} 
              </Col>
            </Row>*/}
          </div>
        )}
      </Container>
    </footer>
  );
};

export default Footer;
