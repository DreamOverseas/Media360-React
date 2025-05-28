import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Button, Image} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
// import {formatDateTime, calculateTime} from "./Events.jsx";
import "../css/Home.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;


const HomePage = ()=> {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  // const [news, setNews] = useState([]);
  // const [events, setEvents] = useState([]);
  const onDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  const setWithExpiry = (key, value, ttl) => {
    const item = {
      value,
      expiry: Date.now() + ttl,
    };
    localStorage.setItem(key, JSON.stringify(item));
  };

  const getWithExpiry = (key) => {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) return null;

    const item = JSON.parse(itemStr);
    if (Date.now() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return item.value;
  };

  const ProductCarousel = ({ products, language, t, BACKEND_HOST, cardsPerRow }) => {
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
      <Container>
        <Row className="d-flex text-center" style={{ color: 'white' }}>
          <h4>Experience the difference</h4>
          <h4>产品体验</h4>
        </Row>
        <br/>
        <div className="home-product-carousel-wrapper">
          
          {/* <Button onClick={prevSlide} disabled={startIndex === 0} className="home-product-carousel-btn left">
            &#10094;
          </Button>  */}

          <div className="home-product-carousel-container">
            <Row>
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

          {/* <Button onClick={nextSlide} disabled={startIndex + cardsPerRow >= totalProducts} className="home-product-carousel-btn right">
            &#10095;
          </Button> */}
        </div>

        {/* <Link to="/products/">
          <Button><b>{t("btn_more")}</b></Button>
        </Link> */}

      </Container>
    );
  };


  // const NewCarousel = ({ news, language, t, BACKEND_HOST, cardsPerRow = 4 }) => {
  //   const [startIndex, setStartIndex] = useState(0);
  //   const totalNews = news.length;

  //   const nextSlide = () => {
  //     setStartIndex((prevIndex) =>
  //       prevIndex + cardsPerRow < totalNews ? prevIndex + cardsPerRow : prevIndex
  //     );
  //   };

  //   const prevSlide = () => {
  //     setStartIndex((prevIndex) => (prevIndex - cardsPerRow >= 0 ? prevIndex - cardsPerRow : 0));
  //   };

  //   return (
  //     <Container>
  //       <Row>
  //         <h4>News</h4>
  //         <h4>新闻</h4>
  //       </Row>
  //       <div className="home-product-carousel-wrapper">
  //         <Button onClick={prevSlide} disabled={startIndex === 0} className="home-event-carousel-btn left">
  //             &#10094;
  //         </Button>
  //         <div className="home-event-carousel-container">
  //           <Row
  //             className="home-event-row"
  //             style={{ transform: `translateX(-${(startIndex / cardsPerRow) * 100}%)` }}
  //           >
  //             {news.length > 0 ? (
  //               news.map((newsItem) => {
  //                 const newsTitle =
  //                   language === "zh"
  //                     ? newsItem.Title_zh || "未知新闻"
  //                     : newsItem.Title_en || "Unknown News";
  //                 const newsContent = newsItem.Description_zh || "暂无内容";
  //                 const newsUrl = `/news/${newsItem.url}`;

  //                 return (
  //                   <Col xs={6} sm={6} md={12 / cardsPerRow} key={newsItem.id}>
  //                     <Link to={newsUrl} className="card-link-NewsPage">
  //                       <Card className="newspage-news-card d-flex flex-column">
  //                         <Card.Img
  //                           src={`${BACKEND_HOST}${newsItem.Image[0].url}`}
  //                           alt={newsTitle}
  //                           className="newspage-news-card-img"
  //                         />
  //                         <Card.Body className="text-center d-flex flex-column justify-content-between">
  //                           <Card.Title className="newspage-news-card-title">
  //                             {newsTitle}
  //                           </Card.Title>
  //                           <Card.Text className="newspage-news-card-date">
  //                             {formatDateTime(newsItem.Published_time)}
  //                           </Card.Text>
  //                           <Card.Text className="newspage-news-card-content">
  //                             {newsContent}
  //                           </Card.Text>
  //                         </Card.Body>
  //                       </Card>
  //                     </Link>
  //                   </Col>
  //                 );
  //               })
  //             ) : (
  //               <p>{t("noNews")}</p>
  //             )}
  //           </Row>
  //         </div>
  //         <Button onClick={nextSlide} disabled={startIndex + cardsPerRow >= totalNews} className="home-event-carousel-btn right">
  //           &#10095;
  //         </Button>
  //       </div>

  //       <Link to="/news/">
  //         <Button><b>{t("btn_more")}</b></Button>
  //       </Link>

  //     </Container>
  //   );
  // };




  // const EventCarousel = ({ events, language, t, BACKEND_HOST, cardsPerRow = 4 }) => {
  //   const [startIndex, setStartIndex] = useState(0);
  //   const totalEvents = events.length;

  //   const nextSlide = () => {
  //     setStartIndex((prevIndex) =>
  //       prevIndex + cardsPerRow < totalEvents ? prevIndex + cardsPerRow : prevIndex
  //     );
  //   };

  //   const prevSlide = () => {
  //     setStartIndex((prevIndex) => (prevIndex - cardsPerRow >= 0 ? prevIndex - cardsPerRow : 0));
  //   };

  //   return (
  //     <Container className='events-section'>
  //       <Row>
  //         <h4>Events</h4>
  //         <h4>活动</h4>
  //       </Row>
  //       <div className="home-product-carousel-wrapper">
  //         <Button onClick={prevSlide} disabled={startIndex === 0} className="home-event-carousel-btn left">
  //             &#10094;
  //         </Button>
  //         <div className="home-event-carousel-container">
  //         <Row
  //           className="home-event-row"
  //           style={{ transform: `translateX(-${(startIndex / cardsPerRow) * 100}%)` }}
  //         >
  //           {events.length > 0 ? (
  //             events.map((event) => {
  //               const eventName =
  //                 language === "zh"
  //                   ? event.Name_zh || "未知活动"
  //                   : event.Name_en || "Unknown Events";

  //               return (
  //                 <Col xs={6} sm={6} md={12 / cardsPerRow} key={event.id}>
  //                   <Link to={`/events/${event.url}`} className="card-link-EventPage">
  //                     <Card className="eventpage-event-card">
  //                       {event.Image ? (
  //                         <Card.Img
  //                           variant="top"
  //                           src={`${BACKEND_HOST}${event.Image.url}`}
  //                           alt={event.Name_en}
  //                         />
  //                       ) : (
  //                         <Card.Img
  //                           variant="top"
  //                           src="https://placehold.co/250x350"
  //                           alt="Placeholder"
  //                         />
  //                       )}
  //                       <Card.Body>
  //                         <Card.Title>{eventName}</Card.Title>
  //                         {calculateTime(event.Start_Date, event.End_Date) && (
  //                           <Card.Text className="eventpage-event-date">
  //                             {calculateTime(event.Start_Date, event.End_Date)}
  //                           </Card.Text>
  //                         )}
  //                         <Card.Text className="eventpage-event-location">
  //                           {event.Location}
  //                         </Card.Text>
  //                         <Card.Text className="eventpage-event-host">
  //                           {event.Host}
  //                         </Card.Text>
  //                       </Card.Body>
  //                     </Card>
  //                   </Link>
  //                 </Col>
  //               );
  //             })
  //           ) : (
  //             <p>{t("noEvents")}</p>
  //           )}
  //         </Row>

  //         </div>
  //         <Button onClick={nextSlide} disabled={startIndex + cardsPerRow >= totalEvents} className="home-event-carousel-btn right">
  //           &#10095;
  //         </Button> 
  //       </div>

  //       <Link to="/events/">
  //         <Button><b>{t("btn_more")}</b></Button>
  //       </Link>

  //     </Container>
  //   );
  // };

  useEffect(() => {

    const fetchProducts = async () => {
      try {
      
        let countryCode = getWithExpiry('user_country_code');

        if (!countryCode) {
          const ipRes = await axios.get('https://ipapi.co/json/');
          countryCode = ipRes.data.country_code;
          setWithExpiry('user_country_code', countryCode, 24 * 60 * 60 * 1000);
        }

        const response = await axios.get(
          `${BACKEND_HOST}/api/products`, {
            params: {
              "sort": "Order:desc",
              "populate": "*",
              "filters[$or][0][MainCollectionProduct][$eq]": true,
              "filters[$or][1][SingleProduct][$eq]": true,
            },
          }
        );
        let allProducts = response.data.data;

        if (countryCode === 'CN') {
          allProducts = allProducts.filter(product => !product.BlockInChina);
        }

        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

  //   const fetchEvents = async () => {
  //     try {
  //       const response = await
  //         axios.get(`${BACKEND_HOST}/api/events`, {
  //           params: {
  //             "filters[Active][$eq]": true,
  //             "sort": "Order:desc",
  //             "populate": "*",
  //           },
  //         });
  //       setEvents(response.data.data.slice(0, 8));
  //     } catch (error) {
  //       console.error("Error fetching events:", error);
  //     }
  //   };

  //   const fetchNews = async () => {
  //     try {
  //       const response = await
  //         axios.get(`${BACKEND_HOST}/api/news`, {
  //           params: {
  //             "sort": "Order:desc",
  //             "populate": "*",
  //           },
  //         });
  //       setNews(response.data.data.slice(0, 8));
  //       console.log(response.data.data)
  //     } catch (error) {
  //       console.error("Error fetching events:", error);
  //     }
  //   };
    fetchProducts();
  //   fetchNews();
  //   fetchEvents();
  }, []);

  const language = i18n.language;

  return (
    <div className="homepage-background">
      <section>
        {/* <Image className='home-banner' src='/homepage/Home_Banner.png' alt='360 Media' /> */}
          <ProductCarousel
            products={products}
            language={language}
            t = {t}
            BACKEND_HOST={BACKEND_HOST} 
            cardsPerRow = {4}
          />
      </section>
      {/* <div className="gradient-to-lightblue"></div> */}
      <section>
        <section style={{ backgroundColor: 'rgb(234 245 255)'}}>
      
      </section>
    {/* <div> */}
    {/* <section>
        <NewCarousel
        news={news}
        language={language}
        t = {t}
        BACKEND_HOST={BACKEND_HOST} 
        cardsPerRow = {4}
        />
      </section>
      <br/>
      <section>
        <EventCarousel
        events={events}
        language={language}
        t = {t}
        BACKEND_HOST={BACKEND_HOST} 
        cardsPerRow = {4}
        />
      </section> */}
    {/* </div> */}
    </section>
    </div>
  );
};

export default HomePage;
