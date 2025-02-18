import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Button} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import BannerSlider from "../components/BannerSlider";
// import NewsTicker from "../components/NewsTicker";
import "../css/Home.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;


const HomePage = ()=> {
  const { t, i18n } = useTranslation();
  const [ads, setAds] = useState([]);
  const [kols, setKols] = useState([]);
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);

  const ProductCarousel = ({ products, language, t, BACKEND_HOST, cardsPerRow = 4 }) => {
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
        <h2 className="section-title">{t("recommended_product")}</h2>

        {/* 轮播容器 */}
        <div className="home-product-carousel-wrapper">
          {/* 左侧按钮 */}
          <Button onClick={prevSlide} disabled={startIndex === 0} className="home-product-carousel-btn left">
            &#10094;
          </Button>

          {/* 产品区域 */}
          <div className="home-product-carousel-container">
            <Row
              className="home-product-row"
              style={{ transform: `translateX(-${(startIndex / cardsPerRow) * 100}%)` }}
            >
              {products.map((product) => {
                const Name = language === "zh" ? product.Name_zh : product.Name_en;
                return (
                  <Col xs={6} sm={4} md={12 / cardsPerRow} className="mb-4 home-product-col" key={product.id}>
                    <Link to={`/product/${product.url}`} className="home-product-card-link">
                      <Card className="product-card">
                        <Card.Img variant="top" src={`${BACKEND_HOST}${product.ProductImage?.url}`} alt={Name} />
                        <Card.Body className="card-body">
                          <Card.Title title={Name}>{Name}</Card.Title>
                          <p className="product-price">{product.Price === 0 ? t("price_tbd") : `AU$ ${product.Price}`}</p>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </div>

          {/* 右侧按钮 */}
          <Button onClick={nextSlide} disabled={startIndex + cardsPerRow >= totalProducts} className="home-product-carousel-btn right">
            &#10095;
          </Button>
        </div>

        <Link to="/productpage/">
          <button className="btn-more">
            <b>{t("btn_more")}</b>
          </button>
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
      <BannerSlider ads={ads} />
      <Container className='influence-hub-section'>
        <Row className="d-flex text-center">
          <h6>我们有各领域专家及优质自媒体网红</h6>
          <h2>星潮汇</h2>
        </Row>
        {/* Influence Hub Section */}
        <Row>
          {/* 第一个背景块 */}
          <Col md={4}>
            <Link to={`/product/123`} className="home-product-card-link">
              <div className="product-container product-bg-1">
                <div className="product-content">
                  <h6 className="product-title">开创品牌愿景，引领卓越未来</h6>
                  <h3 className="product-subtitle">品牌创始人</h3>
                  <Link to="/founders/">
                    <button><b>查看更多</b></button>
                  </Link>
                </div>
              </div>
            </Link>
          </Col>

          {/* 第二个背景块 */}
          <Col md={4}>
            <Link to={`/product/456`} className="home-product-card-link">
              <div className="product-container product-bg-2">
                <div className="product-content">
                  <h6 className="product-title">赋予群众力量，启发潮流趋势</h6>
                  <h3 className="product-subtitle">意见领袖</h3>
                  <Link to="/kols/">
                    <button><b>查看更多</b></button>
                  </Link>
                </div>
              </div>
            </Link>
          </Col>

          {/* 第三个背景块 */}
          <Col md={4}>
            <Link to={`/product/789`} className="home-product-card-link">
              <div className="product-container product-bg-3">
                <div className="product-content">
                  <h6 className="product-title">引领潮流风向，定义时代风格</h6>
                  <h3 className="product-subtitle">品牌代言人</h3>
                  <Link to="/ambassadors/">
                    <button><b>查看更多</b></button>
                  </Link>
                </div>
              </div>
            </Link>
          </Col>
        </Row>


        {/* <Row>
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
          
        </Row> */}
      </Container>

      {/* Products Section */}

      <ProductCarousel
      products={products}
      language={language}
      t = {t}
      BACKEND_HOST={BACKEND_HOST} 
      cardsPerRow = {3}
      />
      {/* <Container className='products-section'>
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
      </Container> */}

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
