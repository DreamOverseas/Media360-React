import React from "react";
import {Button, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../Css/Footer.css";

const Footer = () => {

  const navigate = useNavigate();
  const { t } = useTranslation();

  const jumpToContact = () => {
    navigate("/contact-us");
  };

  return (
    <div className='footer-body'>
      <Container>
        <Row className='footer-content'>
          <Col
            xs={12}
            md={3}
            className='footer-logo-section d-flex flex-column align-items-center mb-3 mb-md-0'
          >
            <Row>
              <Image src='logo192.png' className='footer-logo'/>
            </Row>
            <Row>
              <div className="flex justify-center items-center gap-2 mb-3">
                <a
                    href="https://space.bilibili.com/3546823025232653"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-gray-300"
                  >
                    <img src="/Icons/bilibili.png" alt="B站" className="w-6 h-6" />
                  </a>
                  <a
                    href="https://www.youtube.com/channel/UC3GSuPpt3tClvoFp0l_nkCg"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 text-gray-300"
                  >
                    <img src="/Icons/youtube.png" alt="Youtube" className="w-6 h-6" />
                  </a>
                </div>
            </Row>
            <Row>
              <Button className='footer-button' onClick={jumpToContact}>
                {t("get_in_touch")}
              </Button>
            </Row>
          </Col>
          <Col xs={12}
            md={3}
            className='footer-aboutus-info text-center text-md-left mb-3 mb-md-0'>
            <Row className="contact-info-row">
              <div>
                  <p><b>{t("contact_melbourne_title")}</b></p>
                  <p><i className="bi bi-pin-angle"></i> &nbsp; {t("contact_melbourne_address")}</p>
                  <p><i className="bi bi-globe2"></i> &nbsp; <a href="https://do360.com" target="_blank" rel="noopener noreferrer">{t("contact_melbourne_website")}</a></p>
                  <p><i className="bi bi-person"></i> &nbsp; {t("contact_melbourne_contact")}</p>
                  <p><i className="bi bi-telephone-inbound"></i> &nbsp; {t("contact_melbourne_mobile")}</p>
                  <p><i className="bi bi-mailbox"></i> &nbsp; <a href={`mailto:${t("contact_melbourne_email")}`}>{t("contact_melbourne_email")}</a></p>
              </div>
            </Row>
          </Col>
          <Col xs={12}
            md={3}
            className='footer-aboutus-info text-center text-md-left mb-3 mb-md-0'>
            <Row className="contact-info-row">
              <div>
                  <p><b>{t("contact_sydney_title")}</b></p>
                  <p><i className="bi bi-pin-angle"></i> &nbsp; {t("contact_sydney_address")}</p>
                  <p><i className="bi bi-person"></i> &nbsp; {t("contact_sydney_contact")}</p>
                  <p><i className="bi bi-telephone-inbound"></i> &nbsp; {t("contact_sydney_mobile")}</p>
                  <p><i className="bi bi-mailbox"></i> &nbsp; <a href={`mailto:${t("contact_sydney_email")}`}>{t("contact_sydney_email")}</a></p>
              </div>
            </Row>
          </Col>        
          <Col
            xs={12}
            md={3}
            className='footer-aboutus-info text-center text-md-left mb-3 mb-md-0'
          >
            <h5 className='footer-aboutus-title'>Roseneath Holiday Park Management Pty Ltd</h5>
            <p>ACN: 679 085 477 </p>
            <p>ABN: 52 679 085 477 </p>
            <p>Bank name: CBA </p>
            <p>BSB: 063 182 </p>
            <p>Account Number: 1177 8453 </p>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Footer;
