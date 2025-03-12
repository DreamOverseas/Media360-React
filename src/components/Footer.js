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

                {/* 加入我们按钮被移动到这里 */}
                <Row className='mt-3'>
                  <Col className='d-flex justify-content-start'>
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
                  </Col>
                </Row>
              </div>
            </Col>

            <Col md={6}></Col>

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
                <Col></Col>
              </Row>

              {/* 移动端 "加入我们" 按钮也放到这里 */}
              <Row className='mt-3'>
                <Col className='d-flex justify-content-start'>
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
