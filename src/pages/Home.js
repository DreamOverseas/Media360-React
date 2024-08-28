import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import Advertisement from "../components/Advertisement";
import "../css/Home.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const HomePage = () => {
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
        setEvents(response.data.data);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchKOLs();
    fetchProducts();
    fetchEvents();
  }, []);

  return (
    <div>
      {/* Carousel Section */}
      <section className='home-ads-section'>
        <Advertisement ads={ads} />
      </section>

      {/* KOL Section */}
      <Container className='kol-section'>
        <h2 className='section-title'>KOL</h2>
        <Row className='kol-row justify-content-center'>
          {kols.length > 0 ? (
            kols.map(kol => (
              <Col xs={3} sm={2} md={1} className='kol-col' key={kol.id}>
                <Image
                  src={`${BACKEND_HOST}${kol.attributes.KolImage?.data?.attributes?.url}`}
                  roundedCircle
                  className='kol-image'
                  alt={kol.attributes.Name}
                />
              </Col>
            ))
          ) : (
            <p>No KOLs available</p>
          )}
        </Row>
      </Container>

      {/* Products Section */}
      <Container className='products-section'>
        <h2 className='section-title'>Products</h2>
        <Row className='products-row'>
          {products.length > 0 ? (
            products.map(product => (
              <Col xs={12} sm={6} md={3} key={product.id}>
                <Card className='product-card'>
                  <Card.Img
                    variant='top'
                    src={`${BACKEND_HOST}${product.attributes.ProductImage?.data?.attributes?.url}`}
                    alt={product.attributes.Name}
                  />
                  <Card.Body>
                    <Card.Title>{product.attributes.Name}</Card.Title>
                    <Card.Text>¥{product.attributes.Price}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No products available</p>
          )}
        </Row>
      </Container>

      {/* Events Section */}
      <Container className='events-section'>
        <h2 className='section-title'>Events</h2>
        <Row className='events-row'>
          {events.length > 0 ? (
            events.map(event => (
              <Col xs={12} sm={6} md={3} key={event.id}>
                <Card className='event-card'>
                  <Card.Img
                    variant='top'
                    src={`${BACKEND_HOST}${event.attributes.EventImage?.data?.attributes?.url}`}
                    alt={event.attributes.Title}
                  />
                </Card>
              </Col>
            ))
          ) : (
            <p>No events available</p>
          )}
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
