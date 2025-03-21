import React, { useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import "../css/Footer.css";
import Payment from "./Payment";
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

                {/* 加入我们按钮 */}
                <Row className='mt-3'>
                  <Col className='d-flex justify-content-start'>
                    <Button
                      className='update-function-btn'
                      onClick={() =>
                        window.open(
                          "/merchant/360media-promotion",
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
          // 移动端：将 4 个元素分成 2 排
          <div>
            <Image
              src='/footer_logo.png'
              alt='Logo'
              className='mobile-footer-logo'
              fluid
            />
            <Row className='footer-contact-info'>
              {/* 第一排：地址 & 电话 */}
              <Col xs={6} className='d-flex align-items-center'>
                <i className='bi bi-pin-map-fill'></i>
                <p className='ms-2'>
                  L2 171 La Trobe Street <br /> Melbourne VIC 3000
                </p>
              </Col>
              <Col xs={6} className='d-flex align-items-center'>
                <i className='bi bi-telephone-inbound-fill'></i>
                <p className='ms-2'>0413 168 533</p>
              </Col>

              {/* 第二排：邮箱 & 加入我们 */}
              <Col xs={6} className='d-flex align-items-center mt-2'>
                <i className='bi bi-mailbox2'></i>
                <p className='ms-2'>info@do360.com</p>
              </Col>
              <Col xs={6} className='d-flex align-items-center mt-2'>
                <Button
                  className='update-function-btn'
                  onClick={() =>
                    window.open(
                      "/merchant/360media-promotion",
                      "_blank"
                    )
                  }
                >
                  加入我们
                </Button>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </footer>
  );
};

export default Footer;
