import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const BrandPage = () => {
    const [sponsors, setSponsors] = useState([]);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

    useEffect(() => {
        axios.get(`${BACKEND_HOST}/api/sponsors?populate[Icon][fields][0]=url`)
            .then(response => {
                setSponsors(response.data.data);
            })
            .catch(error => {
                console.error('Error fetching sponsors:', error);
            });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleSponsorClick = (url) => {
        navigate(url);
    };

    return (
        <div>
      <section className='product-page-background-image-container'>
        <h1 className='product-page-banner-h1'>
          <b>{t("sponsor")}</b>
        </h1>
      </section>
        <Container>
            <Row className="justify-content-center align-items-center">
                {sponsors.map((sponsor) => (
                    <Col key={sponsor.id} xs={12} sm={6} md={4} lg={3} className="d-flex justify-content-center my-3">
                        <Card 
                            onClick={() => handleSponsorClick(sponsor.attributes.Internal_URL)} 
                            style={{ cursor: 'pointer', width: '18rem' }}
                        >
                            <Card.Img 
                                variant="top" 
                                src={`${BACKEND_HOST}${sponsor.attributes.Icon.data.attributes.url}`} 
                                alt={sponsor.attributes.Name_zh} 
                                style={{ height: '150px', objectFit: 'contain' }}
                            />
                            <Card.Body>
                                <Card.Title className="text-center">{sponsor.attributes.Name_zh}</Card.Title>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
        </div>
    );
};

export default BrandPage;
