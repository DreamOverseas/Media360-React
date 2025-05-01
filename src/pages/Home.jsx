import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Button, Image} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {formatDateTime, calculateTime} from "./Events.jsx"
// import NewsTicker from "../components/NewsTicker";
import "../css/Home.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;


const HomePage = ()=> {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);

  const ProductCarousel = ({ products, language, t, BACKEND_HOST, cardsPerRow = 3 }) => {
    const [startIndex, setStartIndex] = useState(0);
    const totalProducts = products.length;

    const nextSlide = () => {
      setStartIndex((prevIndex) =>
        prevIndex + cardsPerRow < totalProducts ? prevIndex + cardsPerRow : prevIndex
      );
    };

    const prevSlide = () => {
      setStartIndex((prevIndex) => (prevIndex - cardsPerRow >= 0 ? prevIndex - cardsPerRow : 0));
    };

    return (
      <Container className="products-section">
        <Row className="d-flex text-center">
          <h4>Our Products</h4>
          <h4>我们的产品</h4>
        </Row>
        {/* 轮播容器 */}
        <div className="home-product-carousel-wrapper">
          {/* 左侧按钮
          <Button onClick={prevSlide} disabled={startIndex === 0} className="home-product-carousel-btn left">
            &#10094;
          </Button> */}

          {/* 产品区域 */}
          <div className="home-product-carousel-container">
            <Row
              className="home-product-row"
              style={{ transform: `translateX(-${(startIndex / cardsPerRow) * 100}%)` }}
            >
              {products.map((product) => {
                const Name = language === "zh" ? product.Name_zh : product.Name_en;
                return (
                  <Col xs={6} sm={6} md={12 / cardsPerRow} key={product.id}>
                    <Link to={`/products/${product.url}`} className="home-product-card-link">
                      <Card className="product-card">
                        <Card.Img src={`${BACKEND_HOST}${product.ProductImage?.url}`} alt={Name} />
                        <hr />
                        <Card.Body className="card-body">
                          <Card.Title title={Name}>{Name}</Card.Title>
                          <Card.Text>{product.Description_zh}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </div>

          {/* 右侧按钮
          <Button onClick={nextSlide} disabled={startIndex + cardsPerRow >= totalProducts} className="home-product-carousel-btn right">
            &#10095;
          </Button> */}
        </div>

        <Link to="/products/">
          <Button><b>{t("btn_more")}</b></Button>
        </Link>

      </Container>
    );
  };


  const NewCarousel = ({ news, language, t, BACKEND_HOST, cardsPerRow = 4 }) => {
    const [startIndex, setStartIndex] = useState(0);
    const totalNews = news.length;

    const nextSlide = () => {
      setStartIndex((prevIndex) =>
        prevIndex + cardsPerRow < totalNews ? prevIndex + cardsPerRow : prevIndex
      );
    };

    const prevSlide = () => {
      setStartIndex((prevIndex) => (prevIndex - cardsPerRow >= 0 ? prevIndex - cardsPerRow : 0));
    };

    return (
      <Container className='events-section'>
        <Row className="d-flex text-center">
          <h6>即时资讯</h6>
          <h2>新闻</h2>
        </Row>
        <div className="home-product-carousel-wrapper">
          {/* <Button onClick={prevSlide} disabled={startIndex === 0} className="home-event-carousel-btn left">
              &#10094;
          </Button> */}
          <div className="home-event-carousel-container">
            <Row
              className="home-event-row"
              style={{ transform: `translateX(-${(startIndex / cardsPerRow) * 100}%)` }}
            >
              {news.length > 0 ? (
                news.map((newsItem) => {
                  const newsTitle =
                    language === "zh"
                      ? newsItem.Title_zh || "未知新闻"
                      : newsItem.Title_en || "Unknown News";
                  const newsContent = newsItem.Description_zh || "暂无内容";
                  const newsUrl = `/news/${newsItem.url}`;

                  return (
                    <Col xs={6} sm={6} md={12 / cardsPerRow} key={newsItem.id}>
                      <Link to={newsUrl} className="card-link-NewsPage">
                        <Card className="newspage-news-card d-flex flex-column">
                          <Card.Img
                            src={`${BACKEND_HOST}${newsItem.Image[0].url}`}
                            alt={newsTitle}
                            className="newspage-news-card-img"
                          />
                          <Card.Body className="text-center d-flex flex-column justify-content-between">
                            <Card.Title className="newspage-news-card-title">
                              {newsTitle}
                            </Card.Title>
                            <Card.Text className="newspage-news-card-date">
                              {formatDateTime(newsItem.Published_time)}
                            </Card.Text>
                            <Card.Text className="newspage-news-card-content">
                              {newsContent}
                            </Card.Text>
                          </Card.Body>
                        </Card>
                      </Link>
                    </Col>
                  );
                })
              ) : (
                <p>{t("noNews")}</p>
              )}
            </Row>
          </div>
          {/* <Button onClick={nextSlide} disabled={startIndex + cardsPerRow >= totalNews} className="home-event-carousel-btn right">
            &#10095;
          </Button> */}
        </div>

        <Link to="/news/">
          <Button><b>{t("btn_more")}</b></Button>
        </Link>

      </Container>
    );
  };


  const EventCarousel = ({ events, language, t, BACKEND_HOST, cardsPerRow = 4 }) => {
    const [startIndex, setStartIndex] = useState(0);
    const totalEvents = events.length;

    const nextSlide = () => {
      setStartIndex((prevIndex) =>
        prevIndex + cardsPerRow < totalEvents ? prevIndex + cardsPerRow : prevIndex
      );
    };

    const prevSlide = () => {
      setStartIndex((prevIndex) => (prevIndex - cardsPerRow >= 0 ? prevIndex - cardsPerRow : 0));
    };

    return (
      <Container className='events-section'>
        <Row className="d-flex text-center">
          <h6>探索“我们”的力量</h6>
          <h2>活动</h2>
        </Row>
        <div className="home-product-carousel-wrapper">
          {/* <Button onClick={prevSlide} disabled={startIndex === 0} className="home-event-carousel-btn left">
              &#10094;
          </Button> */}
          <div className="home-event-carousel-container">
          <Row
            className="home-event-row"
            style={{ transform: `translateX(-${(startIndex / cardsPerRow) * 100}%)` }}
          >
            {events.length > 0 ? (
              events.map((event) => {
                const eventName =
                  language === "zh"
                    ? event.Name_zh || "未知活动"
                    : event.Name_en || "Unknown Events";

                return (
                  <Col xs={6} sm={6} md={12 / cardsPerRow} key={event.id}>
                    <Link to={`/events/${event.url}`} className="card-link-EventPage">
                      <Card className="eventpage-event-card">
                        {event.Image ? (
                          <Card.Img
                            variant="top"
                            src={`${BACKEND_HOST}${event.Image.url}`}
                            alt={event.Name_en}
                          />
                        ) : (
                          <Card.Img
                            variant="top"
                            src="https://placehold.co/250x350"
                            alt="Placeholder"
                          />
                        )}
                        <Card.Body>
                          <Card.Title>{eventName}</Card.Title>
                          {calculateTime(event.Start_Date, event.End_Date) && (
                            <Card.Text className="eventpage-event-date">
                              {calculateTime(event.Start_Date, event.End_Date)}
                            </Card.Text>
                          )}
                          <Card.Text className="eventpage-event-location">
                            {event.Location}
                          </Card.Text>
                          <Card.Text className="eventpage-event-host">
                            {event.Host}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })
            ) : (
              <p>{t("noEvents")}</p>
            )}
          </Row>

          </div>
          {/* <Button onClick={nextSlide} disabled={startIndex + cardsPerRow >= totalEvents} className="home-event-carousel-btn right">
            &#10095;
          </Button>  */}
        </div>

        <Link to="/events/">
          <Button><b>{t("btn_more")}</b></Button>
        </Link>

      </Container>
    );
  };

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

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${BACKEND_HOST}/api/products`, {
            params: {
              "sort": "Order:desc",
              "populate": "*",
            },
          }
        );
        setProducts(response.data.data.slice(0, 3)); // Limit to 8 products
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

    const fetchNews = async () => {
      try {
        const response = await
          axios.get(`${BACKEND_HOST}/api/news`, {
            params: {
              "sort": "Order:desc",
              "populate": "*",
            },
          });
        setNews(response.data.data.slice(0, 8));
        console.log(response.data.data)
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchProducts();
    fetchNews();
    fetchEvents();
  }, []);

  const language = i18n.language;

  return (
    <div className="homepage-background">
      
      <Image className='home-banner' src='/homepage/Home_Banner.png' alt='360 Media' />
      {/* Products Section */}
      <div className="homepage-bg-1">
        <ProductCarousel
          products={products}
          language={language}
          t = {t}
          BACKEND_HOST={BACKEND_HOST} 
          cardsPerRow = {3}
        />
      </div>
      

      {/* News Section */}
      <NewCarousel
      news={news}
      language={language}
      t = {t}
      BACKEND_HOST={BACKEND_HOST} 
      cardsPerRow = {4}
      />
    
      {/* Events Section */}
      <EventCarousel
      events={events}
      language={language}
      t = {t}
      BACKEND_HOST={BACKEND_HOST} 
      cardsPerRow = {4}
      />
    </div>
  );
};

export default HomePage;
