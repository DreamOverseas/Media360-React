import React from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";
import "../css/Footer.css";

const Footer = () => {
  const onDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  const { t } = useTranslation();

  return (
    <footer className='footer'>
      <Container className='mobile-footer-container'>
        {onDesktop ? (
          <Row className='d-flex desktop-layout'>
            <Row className='footer-column logo-contact'>
              <div className='d-flex align-items-center'>
                <img
                  src='/footer_logo.png'
                  alt='Logo'
                  className='footer-logo me-3'
                />
              </div>
            </Row>
              <div>
                <Link to={`/merchant/360-media-promotion-service`}>
                  <Button className='update-function-btn'>加入我们</Button>
                </Link>
                <Link to={`/about-us`}>
                  <Button className='update-function-btn'>关于我们</Button>
                </Link>
                <Link to={`/events`}>
                  <Button className='update-function-btn'>活动</Button>
                </Link>
                <Link to={`/news`}>
                  <Button className='update-function-btn'>新闻</Button>
                </Link>
              </div>
            <Row>
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
                    <p>
                      <a href='tel:+61413168533' className='phone-link'>
                        +61 (0)413 168 533
                      </a>
                    </p>
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
            </Row>
          </Row>
        ) : (
          <div>
            <Image
              src='/footer_logo.png'
              alt='Logo'
              className='mobile-footer-logo'
              fluid
            />
            <div>
              <Link to={`/merchant/360-media-promotion-service`}>
                <Button className='update-function-btn'>加入我们</Button>
              </Link>
              <Link to={`/about-us`}>
                <Button className='update-function-btn'>关于我们</Button>
              </Link>
              <Link to={`/events`}>
                <Button className='update-function-btn'>活动</Button>
              </Link>
              <Link to={`/news`}>
                <Button className='update-function-btn'>新闻</Button>
              </Link>
            </div>
            <Row>
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
                    <p>
                      <a href='tel:+61413168533' className='phone-link'>
                        +61 (0)413 168 533
                      </a>
                    </p>
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
            </Row>
          </div>
        )}
      </Container>
    </footer>
  );
};

export default Footer;
