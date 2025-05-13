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
          <div>
            <Row style={{marginBottom:"10px"}}>
              <Col 
              xs={3} 
              md={1}
              >
                <Image
                  src='/footer_logo.png'
                  alt='Logo'
                />
              </Col>
              <Col 
              xs={2} 
              md={1}
              >
                <Link to={`/merchant/360-media-promotion-service`}>
                  <Button style={{backgroundColor:"#73b2ea",color:"white", width:"70px"}}className='update-function-btn'>加入我们</Button>
                </Link>
              </Col>
            </Row>
            <div className="d-flex gap-3">
              <Link to={`/about-us`}>
                <Button style={{width:"70px"}} className='update-function-btn'>关于我们</Button>
              </Link>
              <Link to={`/events`}>
                <Button style={{width:"70px"}} className='update-function-btn'>活动</Button>
              </Link>
              <Link to={`/news`}>
                <Button style={{width:"70px"}} className='update-function-btn'>新闻</Button>
              </Link>
            </div>
            <Row className="footer-info">
                <Col>
                  <Row>
                    <Col
                        xs={1}
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
                    >
                      <i className='bi bi-mailbox2'></i>
                    </Col>
                    <Col>
                      <p>info@do360.com</p>
                    </Col>
                  </Row>
                </Col>

                <Col>
                  <Row style={{height:"70px"}} className="d-flex justify-content-center align-items-center text-center">
                    <Image style={{ maxHeight: "100%", width: "auto", objectFit: "contain" }} src="/QR_JohnDu.png"/>
                    <p>{t("footer_scan")}</p>
                  </Row>
                </Col> 
            </Row>
            <Row>
            <div className="d-flex gap-5 align-items-center w-100 social-media-section">

              <a href="https://mp.weixin.qq.com/" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-white text-decoration-none">
                <img src="/icons/wechat.png" alt="微信" style={{ height: '20px', marginRight: '8px' }} />
                公众号36OMedia
              </a>

              <a href="https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09" target="_blank" rel="noopener noreferrer"  className="d-flex align-items-center text-white text-decoration-none">
                <img src="/icons/red_note.png" alt="小红书" style={{ height: '20px', marginRight: '8px' }} />
                小红书
              </a>

              <a href="https://space.bilibili.com/3546717257468817" target="_blank" rel="noopener noreferrer"  className="d-flex align-items-center text-white text-decoration-none">
                <img src="/icons/bilibili.png" alt="B站" style={{ height: '20px', marginRight: '8px' }} />
                B站
              </a>
            </div>
            <div className="d-flex gap-5 align-items-center w-100">

              <a href="https://www.instagram.com/360media360media/" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center text-white text-decoration-none">
                <img src="/icons/instagram.png" alt="Instagram" style={{ height: '20px', marginRight: '8px' }} />
                Instagram
              </a>

            </div>
          </Row>
                
          </div>
        ) : (
          <div>
            <Row style={{marginBottom:"10px"}}>
              <Col 
              xs={2} 
              md={4}
              >
                <Image
                  src='/footer_logo.png'
                  alt='Logo'
                  className='mobile-footer-logo'
                  fluid
                />
              </Col>
              <Col 
              xs={2} 
              md={4}
              >
                <Link to={`/merchant/360-media-promotion-service`}>
                  <Button style={{backgroundColor:"#73b2ea",color:"white", width:"70px"}}className='update-function-btn'>加入我们</Button>
                </Link>
              </Col>
            </Row>
            <div className="d-flex gap-3">
              <Link to={`/about-us`}>
                <Button style={{width:"70px"}} className='update-function-btn'>关于我们</Button>
              </Link>
              <Link to={`/events`}>
                <Button style={{width:"70px"}} className='update-function-btn'>活动</Button>
              </Link>
              <Link to={`/news`}>
                <Button style={{width:"70px"}} className='update-function-btn'>新闻</Button>
              </Link>
            </div>
            <Row className="footer-info">
                <Col>
                  <Row>
                    <Col
                        xs={1}
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
                    >
                      <i className='bi bi-mailbox2'></i>
                    </Col>
                    <Col>
                      <p>info@do360.com</p>
                    </Col>
                  </Row>
                </Col>

                <Col>
                  <Row style={{height:"70px"}} className="d-flex justify-content-center align-items-center text-center">
                    <Image style={{ maxHeight: "100%", width: "auto", objectFit: "contain" }} src="/QR_JohnDu.png"/>
                    <p>{t("footer_scan")}</p>
                  </Row>
                </Col> 
            </Row>
            <Row>
            <div className="d-flex justify-content-between align-items-center w-100 social-media-section">

              <a href="https://mp.weixin.qq.com/" target="_blank" rel="noopener noreferrer" style={{fontSize:"12px"}} className="d-flex align-items-center text-white text-decoration-none">
                <img src="/icons/wechat.png" alt="微信" style={{ height: '20px', marginRight: '8px' }} />
                公众号36OMedia
              </a>

              <a href="https://www.xiaohongshu.com/user/profile/5fc6e9140000000001008c09" target="_blank" rel="noopener noreferrer" style={{fontSize:"12px"}} className="d-flex align-items-center text-white text-decoration-none">
                <img src="/icons/red_note.png" alt="小红书" style={{ height: '20px', marginRight: '8px' }} />
                小红书
              </a>

              <a href="https://space.bilibili.com/3546717257468817" target="_blank" rel="noopener noreferrer" style={{fontSize:"12px"}} className="d-flex align-items-center text-white text-decoration-none">
                <img src="/icons/bilibili.png" alt="B站" style={{ height: '20px', marginRight: '8px' }} />
                B站
              </a>

            </div>
            <div className="d-flex gap-5 align-items-center w-100">

              <a href="https://www.instagram.com/360media360media/" target="_blank" rel="noopener noreferrer" style={{fontSize:"12px"}} className="d-flex align-items-center text-white text-decoration-none">
                <img src="/icons/instagram.png" alt="Instagram" style={{ height: '20px', marginRight: '8px' }} />
                Instagram
              </a>

            </div>
          </Row>
                
          </div>
        )}
      </Container>
    </footer>
  );
};

export default Footer;
