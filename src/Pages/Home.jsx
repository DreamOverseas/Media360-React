import axios from "axios";
import React, { useState, useEffect } from "react";
import "../Css/Home.css";
import { Container, Row, Col, Image, Button, Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { Link } from 'react-router-dom';

const Home = () => {
  // Read Env from file
  const CMS_endpoint = import.meta.env.VITE_CMS_ENDPOINT;
  const CMS_token = import.meta.env.VITE_CMS_TOKEN;
  const DBLink_LH = 'https://book-directonline.com/properties/roseneathholidaypark-1'

  const { t, i18n } = useTranslation();

  const [rooms, setRooms] = useState([]);
  const [gallery, setGallery] = useState([]);

  const homeSections = [
    {
      title: "关于我们",
      subtitle: "About Us",
      description: "了解我们如何以自然、社群与可持续理念打造 360 生活方式。",
      route: "/about-us",
      image: "/home/background_image.webp",
    },
    {
      title: "资产与投资",
      subtitle: "Assets & Investment",
      description: "探索生态资产、运营模式与长期价值增长路径。",
      route: "/eco-living-assets",
      image: "/home/home_landscape.webp",
    },
    {
      title: "360 智能卡",
      subtitle: "360 Smart Card",
      description: "查看会员权益、积分体系与生态场景下的应用方式。",
      route: "/book-membership",
      image: "/360_smart_card.jpg",
    },
    {
      title: "生态实验园",
      subtitle: "Eco-Living Lab",
      description: "进入创新实验场，了解未来生态居住与运营实践。",
      route: "/innovation-lab",
      image: "/home/home_life.jpg",
    },
  ];

  const features = [
    {
      src: "/Icons/free-parking.png",
      alt: "Explore Stay",
      textKey: "home_feature_explore_stay",
      route: "/individual-visitors",
    },
    {
      src: "/Icons/dog.png",
      alt: "Explore Investment",
      textKey: "home_feature_explore_investment",
      route: "/investment",
    },
    {
      src: "/Icons/horse.png",
      alt: "Become a Partner",
      textKey: "home_feature_become_partner",
      route: "/cooperation",
    },
  ];

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${CMS_endpoint}/api/room-types?populate=Cover`, {
          headers: {
            Authorization: `Bearer ${CMS_token}`,
          },
        });
        const roomData = response.data.data.sort((a, b) => {
          return a.order - b.order; // Let available room types going to the front
        });
        setRooms(roomData);
      } catch (error) {
        console.error("Error loading:", error);
      }
    };

    fetchRooms();
  }, [CMS_endpoint, CMS_token]);


  useEffect(() => {
    const fetchGalleryPreview = async () => {
      try {
        const response = await axios.get(`${CMS_endpoint}/api/media-images?filters[PageLocation][$eq]=gallery&populate=Image`, {
          headers: {
            Authorization: `Bearer ${CMS_token}`,
          },
        });

        // Check the data structure and safely retrieve the images
        const images = response.data.data[0].Image;
        if (images) {
          setGallery(images.slice(15, 24));
        } else {
          console.warn("No images found in response data.");
        }
      } catch (error) {
        console.error("Error loading:", error);
      }
    };

    fetchGalleryPreview();
  }, [CMS_endpoint, CMS_token]);

  const room_sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  const gallery_sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        }
      }
    ]
  };

  return (
    <main className="home-page">
      <div>
        <section className="home-banner-title">
          <h1>{t("home_hero_title")}</h1>
          <strong><h1>{t("home_hero_subtitle")}</h1></strong>
        </section>

        <section className="home-banner-subtitle">
          <Container>
            <h1>{t("home_cheerup")}</h1>
            <Row >
              {features.map((feature, index) => {
                return (
                  <Col
                    key={index}
                    xs={12}
                    md={4}
                  >
                    <Link to={feature.route} style={{ textDecoration: 'none', color: 'inherit' }}>
                      <Card className="text-center home-clickable-card">
                        <Card.Body>
                          <Image
                            className="our-service-button"
                            src={feature.src}
                            alt={feature.alt}
                          />
                          <Card.Title>{t(feature.textKey)}</Card.Title>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </Container>
        </section>

        <section className="room-presentation activities-section">
          <Container>
            <h1>{t("Room")}</h1>
            <Slider {...room_sliderSettings}>
              {rooms.map((room) => (
                <div key={room.id} className="room_slider-card">
                  <Card className="home-room-card">
                    {room.Cover?.url ? (
                      <Card.Img
                        variant="top"
                        src={`${CMS_endpoint}${room.Cover.url}`}
                        alt={room.Name_en}
                        className="slider-card-img"
                      />
                    ) : (
                      <Card.Img
                        variant="top"
                        src="https://placehold.co/250x350"
                        alt="Placeholder"
                        className="slider-card-img"
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{i18n.language === "zh"
                        ? room.Name_zh
                        : room.Name_en}
                      </Card.Title>
                      <p className="home-room-card-subtitle">{i18n.language === "zh"
                        ? room.Title_zh
                        : room.Title_en}
                      </p>
                      <Card.Text>{i18n.language === "zh"
                        ? room.Description_zh
                        : room.Description_en}
                      </Card.Text>
                      {room.Availability? 
                      <a href={`${DBLink_LH}?room_type=${room.RoomTypeID}`} target="_blank" rel="noopener noreferrer">
                        <Button>{t("book_Now")}</Button>
                      </a>
                      :
                      <Button variant="secondary">{t("book_unavailable")}</Button>
                      }
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </Slider>
            <div className="more-btn-container">
              <a href="/roomlist" className="gallery-link">
                {t("btn_more")}
              </a>
            </div>
          </Container>
        </section>

        <section className="home-feature-links">
          <Container>
            <Link to={homeSections[0].route} className="home-feature-link-card">
              <div
                className="home-feature-link-bg"
                style={{ backgroundImage: `url(${homeSections[0].image})` }}
              />
              <div className="home-feature-link-content">
                <p>{homeSections[0].subtitle}</p>
                <h2>{homeSections[0].title}</h2>
                <span>{homeSections[0].description}</span>
              </div>
            </Link>
          </Container>
        </section>

        <section className="home-gallery">
          <Container>
            <h1>{t("Gallery")}</h1>
            <Slider {...gallery_sliderSettings}>
              {gallery.map(picture => (
                <div key={picture.id} className="gallery-slider">
                  {picture.url ? (
                    <Image
                      variant="top"
                      src={`${CMS_endpoint}${picture.url}`}
                      alt={picture.Name}
                      className="gallery-slider-img"
                      thumbnail
                    />
                  ) : (
                    <Image
                      variant="top"
                      src="https://placehold.co/250x350"
                      alt="Placeholder"
                      className="gallery-slider-img"
                      thumbnail
                    />
                  )}
                </div>
              ))}
            </Slider>
            <div className="more-btn-container">
              <a href="/gallery" className="gallery-link">
                {t("btn_more")}
              </a>
            </div>
          </Container>
        </section>

        <section className="home-feature-links">
          <Container>
            {homeSections.slice(1).map((section) => (
              <Link key={section.route} to={section.route} className="home-feature-link-card">
                <div
                  className="home-feature-link-bg"
                  style={{ backgroundImage: `url(${section.image})` }}
                />
                <div className="home-feature-link-content">
                  <p>{section.subtitle}</p>
                  <h2>{section.title}</h2>
                  <span>{section.description}</span>
                </div>
              </Link>
            ))}
          </Container>
        </section>
      </div>
    </main>
  );
};

export default Home;
