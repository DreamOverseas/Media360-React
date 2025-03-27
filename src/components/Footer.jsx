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
          // 桌面端布局
          <Row className='d-flex desktop-layout'>
            <Col md={3} className='footer-column logo-contact'>
              <div className='d-flex align-items-center'>
                <img
                  src='/footer_logo.png'
                  alt='Logo'
                  className='footer-logo me-3'
                />
                <Link to={`/merchant/360-media-promotion-service`}>
                  <Button className='update-function-btn'>加入我们</Button>
                </Link>
              </div>
              <div className='contact-info mt-3'>
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
                <p className='ms-2'>
                  <a href='tel:+61413168533' className='phone-link'>
                    +61 (0)413 168 533
                  </a>
                </p>
              </Col>

              {/* 第二排：邮箱 & 加入我们 */}
              <Col xs={6} className='d-flex align-items-center mt-2'>
                <i className='bi bi-mailbox2'></i>
                <p className='ms-2'>info@do360.com</p>
              </Col>
              <Col xs={6} className='d-flex align-items-center mt-2'>
                <Link to={`/merchant/360-media-promotion-service`}>
                  <Button className='update-function-btn'>加入我们</Button>
                </Link>
              </Col>
            </Row>
          </div>
        )}
      </Container>
    </footer>
  );
};

export default Footer;
