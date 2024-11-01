import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Image} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import NewsSlider from "../components/NewsSlider";
import NewsTicker from "../components/NewsTicker";
import "../css/Home.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const HomePage = () => {
  const { t, i18n } = useTranslation();
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
          setAds(response.data.data.sort((a, b) => a.Order - b.Order));
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
        const response = await
          axios.get(`${BACKEND_HOST}/api/events`, {
            params: {
              "filters[Active][$eq]": true,
              "sort": "Order:desc",
              "populate": "*",
            },
          });
        setEvents(response.data.data.slice(0, 8));
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchKOLs();
    fetchProducts();
    fetchEvents();
  }, []);

  
  // console.log(ads);

  const language = i18n.language;

  return (
    <div className="homepage-background">
      <Container className='ad_row-section'>
      <Row>
        <Col className='d-flex'>
          {/* Carousel Section */}
          <Container className="ads-section">
            <NewsSlider ads={ads} />
          </Container>
        </Col>
        <Col className='home-news-ticker'>
          <NewsTicker ads={ads} />
        </Col>
      </Row>
      </Container>
      <Container className='kol-section'>
        <h2 className='section-title'>{t("kol")}</h2>
        <Row>
          {kols.length > 0 ? (
            kols.map(kol => (
                <Col
                  xs={6}
                  sm={6}
                  md={3}
                  className='kol-col'
                  key={kol.id}
                >
                  <Link to={`/kol/${kol.id}`}>
                    <Image
                      src={`${BACKEND_HOST}${kol.KolImage?.url}`}
                      roundedCircle
                      className='kol-image'
                      alt={kol.Name}
                    />
                  </Link>
                </Col>
              ))
            ) : (
              <p>{t("noKols")}</p>
          )}

          <Link to="/kolpage/">
            <button class="btn-more"><b>{t("btn_more")}</b></button>
          </Link>
          
        </Row>
      </Container>

      {/* Products Section */}
      <Container className='products-section'>
        <h2 className='section-title'>{t("recommended_product")}</h2>
        <Row>
          {products.length > 0 ? (
            products.map(product => {
              const Name =
                language === "zh"
                  ? product.Name_zh
                  : product.Name_en;
              return (
                <Col
                  xs={6}
                  sm={4}
                  md={3}
                  className="mb-4"
                  key={product.id}
                >
                  <Link to={`/product/${product.url}`} className="home-product-card-link">
                    <Card className='product-card'>
                      <Card.Img
                        variant='top'
                        src={`${BACKEND_HOST}${product.ProductImage?.url}`}
                        alt={Name}
                      />
                      <Card.Body className="card-body">
                        <Card.Title
                          title={Name}
                        >
                          {Name}
                        </Card.Title>
                        <p class="product-price">{product.Price === 0 ?
                          (t("price_tbd")) :
                          (`AU$ ${product.Price}`)}</p>
                      </Card.Body>
                    </Card>
                  </Link>
                </Col>
              )
            })
          )
            : (
              <p>{t("noProducts")}</p>
            )
          }
          <Link to="/productpage/">
            <button class="btn-more"><b>{t("btn_more")}</b></button>
          </Link>
        </Row>
      </Container>

      {/* Events Section */}
      <Container className='events-section'>
        <h2 className='section-title'>{t("event")}</h2>
        <Row className='events-row'>
          {events.length > 0 ? (
            events.map(event => (
              <Col xs={6} sm={6} md={3} key={event.id}>
                <Link to={`/event/${event.url}`} className="home-event-card-link">
                  <Card className='event-card'>
                    <Card.Img
                      variant='top'
                      src={`${BACKEND_HOST}${event.Image.url}`}
                      alt={event.Title}
                    />
                    <Card.Body>
                      <Card.Title>{event.Name_zh}</Card.Title>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <p>{t("noEvents")}</p>
          )}
          <Link to="/eventpage/">
            <button class="btn-more"><b>{t("btn_more")}</b></button>
          </Link>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
