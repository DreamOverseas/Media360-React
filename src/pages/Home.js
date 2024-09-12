import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, CardFooter, Col, Container, Image, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Advertisement from "../components/Advertisement";
import "../css/Home.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const HomePage = () => {
  const { t } = useTranslation();
  const [ads, setAds] = useState([]);
  const [kols, setKols] = useState([]);
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Fetch Ads
    axios
      .get(`${BACKEND_HOST}/api/advertisements?populate=*`)
      .then(response => {
        if (response.data && response.data.data) {
          setAds(response.data.data);
        }
      })
      .catch(error => {
        console.error("Error fetching ads:", error);
      });

    // Fetch KOL data
    const fetchKOLs = async () => {
      try {
        const response = await axios.get(`${BACKEND_HOST}/api/kols?populate=*`);
        setKols(response.data.data);
      } catch (error) {
        console.error("Error fetching KOL data:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_HOST}/api/products?populate=*`
        );
        setProducts(response.data.data.slice(0, 8)); // Limit to 8 products
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_HOST}/api/events?populate=*`
        );
        setEvents(response.data.data.slice(0, 8));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchKOLs();
    fetchProducts();
    fetchEvents();
  }, []);

  return (
    <div className="homepage-background">
      <br /><br /><br />
      {/* Carousel Section */}
      <Container className="ads-section">
        <Advertisement ads={ads} />
      </Container>

      {/* KOL Section */}
      <Container className='kol-section'>
        <h2 className='section-title'>{t("kol")}</h2>
        <Row className='kol-row'>
          {kols.length > 0 ? (
            kols.map(kol => (
              <Col xs={6} sm={6} md={3} className='kol-col' key={kol.id}>
                <Link to={`/kol/${kol.id}`}>
                  <Image
                    src={`${BACKEND_HOST}${kol.attributes.KolImage?.data?.attributes?.url}`}
                    roundedCircle
                    className='kol-image'
                    alt={kol.attributes.Name}
                  />
                </Link>
              </Col>
            ))
          ) : (
            <p>{t("noKols")}</p>
          )}
        </Row>
      </Container>

      {/* Products Section */}
      <Container className='products-section'>
        <h2 className='section-title'>{t("product")}</h2>
        <Row className='products-row'>
          {products.length > 0 ? (
            products.map(product => (
              <Col xs={6} sm={6} md={3} key={product.id}>
                <Link to={`/product/${product.id}`} className="home-card-link-ProductPage">
                  <Card className='product-card'>
                    <Card.Img
                      variant='top'
                      src={`${BACKEND_HOST}${product.attributes.ProductImage?.data?.attributes?.url}`}
                      alt={product.attributes.Name}
                    />
                    <Card.Body className="card-body">
                      <Card.Title>{product.attributes.Name}</Card.Title>
                      <p class="product-price">¥{product.attributes.Price}</p>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <p>{t("noProducts")}</p>
          )}
        </Row>
      </Container>

      {/* Events Section */}
      <Container className='events-section'>
        <h2 className='section-title'>{t("event")}</h2>
        <Row className='events-row'>
          {events.length > 0 ? (
            events.map(event => (
              <Col xs={6} sm={6} md={3} key={event.id}>
                <Link to={`/event/${event.id}`} className="event-card-link">
                  <Card className='event-card'>
                    <Card.Img
                      variant='top'
                      src={`${BACKEND_HOST}${event.attributes.Image.data.attributes.url}`}
                      alt={event.attributes.Title}
                    />
                    <Card.Body>
                      <Card.Title>{event.attributes.Name_zh}</Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <p>{t("noEvents")}</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
