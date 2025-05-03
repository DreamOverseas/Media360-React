import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Button, Image} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useMediaQuery } from "react-responsive";
import {formatDateTime, calculateTime} from "./Events.jsx";
import "../css/Home.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;


const HomePage = ()=> {
  const { t, i18n } = useTranslation();
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [events, setEvents] = useState([]);
  const onDesktop = useMediaQuery({ query: "(min-width: 768px)" });

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
      <Container>
        <Row className="d-flex text-center" style={{ color: 'white' }}>
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
                  <Col xs={4} sm={4} md={12 / cardsPerRow} key={product.id}>
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

        {/* <Link to="/products/">
          <Button><b>{t("btn_more")}</b></Button>
        </Link> */}

      </Container>
    );
  };

    const tabs = [
      { key: "enterprise_package", label: t("企业定制套餐") },
      { key: "premium_package", label: t("卓越尊享套餐") },
      { key: "elite_package", label: t("精英基础套餐") },
    ];

    const PackageTabComponent = () => {
      const defaultTab = "enterprise_package"; 
      const [activeTab, setActiveTab] = useState(defaultTab);
      
        const tabs = [
          { key: "enterprise_package", label: t("企业定制套餐") },
          { key: "premium_package", label: t("卓越尊享套餐") },
          { key: "elite_package", label: t("精英基础套餐") },
        ];
      
        const tabContent = {
          enterprise_package: (
            <div>
              <div>
                <Row style={{backgroundColor:"#b1e84f"}} className="d-flex text-center">
                  <h5>{t("360传媒 企业定制策略套餐")}</h5>
                  <h5>AU $5,500</h5>
                </Row>
                <h6>{t("我们提供12个月套餐包含以下服务")}</h6>
                <h6 className="basic-info-text">{t("基础服务")}</h6>
                <p>{t("（精英基础套餐和卓越尊享套餐服务均已包含）")}</p>
                <h6>{t("额外服务")}</h6>
                <div dangerouslySetInnerHTML={{ __html: t('enterprise_package_extra_homepage') }}/>
              </div>
            </div>
          ),
          premium_package: (
            <div>
              <div>
                <Row style={{backgroundColor:"#b1e84f"}} className="d-flex text-center">
                  <h5>{t("360传媒 卓越尊享套餐")}</h5>
                  <h5>AU $3,300</h5>
                </Row>
                <h6>{t("我们提供6个月套餐包含以下服务")}</h6>
                <h6 className="basic-info-text">{t("基础服务")}</h6>
                <p>{t("（精英基础套餐服务均已包含）")}</p>
                <h6>{t("额外服务")}</h6>
                <div dangerouslySetInnerHTML={{ __html: t('premium_package_extra_homepage') }}/>
              </div>
            </div>
          ),
          elite_package: (
            <div>
              <div>
                <Row style={{backgroundColor:"#b1e84f"}} className="d-flex text-center">
                  <h5>{t("360传媒 精英基础套餐")}</h5>
                  <h5>AU $990</h5>
                </Row>
                <h6>{t("我们提供6个月套餐包含以下服务")}</h6>
                <div dangerouslySetInnerHTML={{ __html: t('elite_package_homepage') }}/>
              </div>
              
              {/* <Link to={`/products/360-media-service-standard-package`} className="merchant-product-link" ><Button className="merchant-funtion-btn">{t("即刻订购")}</Button></Link> */}
            </div>
          ),
        };
        return (
          <div className="package-tab-container">
              <Row className="package-tab-row">
                {tabs.map((tab) => (
                  <Col xs={4} key={tab.key} className="package-text-center">
                    <button
                      className={`package-tab-button ${activeTab === tab.key ? "active" : ""}`}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                    </button>
                  </Col>
                ))}
              </Row>
            <div className="tab-content-container">{tabContent[activeTab]}</div>
          </div>
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
      <Container>
        <Row>
          <h4>News</h4>
          <h4>新闻</h4>
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

        {/* <Link to="/news/">
          <Button><b>{t("btn_more")}</b></Button>
        </Link> */}

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
        <Row>
          <h4>Events</h4>
          <h4>活动</h4>
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

        {/* <Link to="/events/">
          <Button><b>{t("btn_more")}</b></Button>
        </Link> */}

      </Container>
    );
  };

  useEffect(() => {

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
        setProducts(response.data.data.slice(0, 3));
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

      <section>
        <Image className='home-banner' src='/homepage/Home_Banner.png' alt='360 Media' />
        <div className="homepage-bg-1">
          <ProductCarousel
            products={products}
            language={language}
            t = {t}
            BACKEND_HOST={BACKEND_HOST} 
            cardsPerRow = {3}
          />
        </div>
      </section>
      <div className="gradient-to-lightblue"></div>
      <section>
      <section style={{ backgroundColor: 'rgb(234 245 255)'}}>
      <Container>
        <section>
          <Row className="d-flex text-center">
            <h4>About Us</h4>
            <h4>关于我们</h4>
          </Row>
          <br/>
          <Row className="d-flex text-center">
          {t("about_us").split("\n").map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
          </Row>
        </section>
        <br/>
        <section>
          <h5>Our Services</h5>
          <h6>我们的服务</h6>
          <Row>
              <Col>
                <Row>
                  <Col md={4}>
                    <Image src="/homepage/brand-image.png"/>
                  </Col>
                  <Col md={8}>
                    <div dangerouslySetInnerHTML={{ __html: t('feature_1') }}/>
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row>
                  <Col md={4}>
                    <Image src="/homepage/web-design.png"/>
                  </Col>
                  <Col md={8}>
                    <div dangerouslySetInnerHTML={{ __html: t('feature_2') }}/>
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row>
                  <Col md={4}>
                    <Image src="/homepage/social-media.png"/>
                  </Col>
                  <Col md={8}>
                    <div dangerouslySetInnerHTML={{ __html: t('feature_3') }}/>
                  </Col>
                </Row>
              </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <Row>
                <Col md={4}>
                  <Image src="/homepage/lecture.png"/>
                </Col>
                <Col md={8}>
                  <div dangerouslySetInnerHTML={{ __html: t('feature_4') }}/>
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col md={4}>
                  <Image src="/homepage/content.png"/>
                </Col>
                <Col md={8}>
                  <div dangerouslySetInnerHTML={{ __html: t('feature_5') }}/>
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col md={4}>
                  <Image src="/homepage/team.png"/>
                </Col>
                <Col md={8}>
                  <div dangerouslySetInnerHTML={{ __html: t('feature_6') }}/>
                </Col>
              </Row>
            </Col>
          </Row>
        </section>
        <br/>
        <section>
          <h5>Join Us</h5>
          <h6>加入我们</h6>
          {onDesktop?(
            <Row>
              <Col>
                <div className="home-service-package">
                  <div>
                    <Row style={{backgroundColor:"#f8e6a0"}} className="d-flex text-center">
                      <h5>{t("360传媒 企业定制策略套餐")}</h5>
                      <h5>AU $5,500</h5>
                    </Row>
                    <h6>{t("我们提供12个月套餐包含以下服务")}</h6>
                    <p>{t("（精英基础套餐和卓越尊享套餐服务均已包含）")}</p>
                    <h6>{t("额外服务")}</h6>
                    <div dangerouslySetInnerHTML={{ __html: t('enterprise_package_extra_homepage') }}/>
                  </div>
                </div>
              </Col>

              <Col>
                <div className="home-service-package">
                  <div>
                    <Row style={{backgroundColor:"#f8e6a0"}} className="d-flex text-center">
                      <h5>{t("360传媒 卓越尊享套餐")}</h5>
                      <h5>AU $3,300</h5>
                    </Row>
                    <h6>{t("我们提供6个月套餐包含以下服务")}</h6>
                    <p>{t("（精英基础套餐服务均已包含）")}</p>
                    <h6>{t("额外服务")}</h6>
                    <div dangerouslySetInnerHTML={{ __html: t('premium_package_extra_homepage') }}/>
                  </div>
                </div>
              </Col>

              <Col>
                <div className="home-service-package">
                  <div>
                    <Row style={{backgroundColor:"#b1e84f"}} className="d-flex text-center">
                      <h5>{t("360传媒 精英基础套餐")}</h5>
                      <h5>AU $990</h5>
                    </Row>
                    <h6>{t("我们提供6个月套餐包含以下服务")}</h6>
                    <div dangerouslySetInnerHTML={{ __html: t('elite_package_homepage') }}/>
                  </div>
                </div>
              </Col>
            </Row>
            ):(
            <PackageTabComponent/>)
          }
          <Row className="d-flex text-center">
            <Link to={`/merchant/360-media-promotion-service`}>
              <Button className='update-function-btn'>{t("moreDetails")}</Button>
            </Link>
          </Row>
          
        </section>
        </Container>
    </section>
    <br/>
    <div>
    <section>
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
      </section>
    </div>
    </section>
    </div>
  );
};

export default HomePage;
