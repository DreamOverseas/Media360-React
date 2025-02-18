import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FounderPage = () => {

    const { t, i18n } = useTranslation();

    return (
      <div>
        <section className='brand-detail-header'>
          <Container>
            <Row className='align-items-center'>
              <Col md={6}>
                <p>{t("founder_slogan")}</p>
                <h1>{t("founder_title")}</h1>
                <p>{t("founder_content")}</p>
              </Col>
              <Col md={6} className='text-center'>
                <Image src={"/sponsors/founder.png"} alt="founderImage" fluid />
              </Col>
            </Row>
          </Container>
        </section>
      </div>
    );
  };
  
  export default FounderPage;