import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Image } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import axios from "axios";
import { Link } from "react-router-dom";
import qs from 'qs';
import { useTranslation } from "react-i18next";
import "../css/InfluenceHub.css"


const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;


const InfluenceHub = () => {
  const { t, i18n } = useTranslation();
  const [kols, setKols] = useState([]);
  const [founders, setFounders] = useState([]);
  const [ambassadors, setAmbassadors] = useState([]);
  const [error, setError] = useState(null);
  const language = i18n.language;
  const onDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  const roles = ['Founder', 'Kol', 'Ambassador'];

  const FounderCarousel = ({ founders, language, t, BACKEND_HOST, cardsPerRow = 4 }) => {
    const [startIndex, setStartIndex] = useState(0);
    const totalFounders = founders.length;

    // const nextSlide = () => {
    //   setStartIndex((prevIndex) =>
    //     prevIndex + cardsPerRow < totalFounders ? prevIndex + cardsPerRow : prevIndex
    //   );
    // };

    // const prevSlide = () => {
    //   setStartIndex((prevIndex) => (prevIndex - cardsPerRow >= 0 ? prevIndex - cardsPerRow : 0));
    // };

    return (
      <Container>
        {/* 轮播容器 */}
        <div>
          {/* 左侧按钮 */}
          {/* <Button onClick={prevSlide} disabled={startIndex === 0} className="home-product-carousel-btn left">
            &#10094;
          </Button> */}

          {/* 产品区域 */}
          <div>
            <Row
              // style={{ transform: `translateX(-${(startIndex / cardsPerRow) * 100}%)` }}
            >
              {founders.map((founder) => {
                const Name = language === "zh" ? founder.Name_zh || "未知" : founder.Name_en || "Unknown";
                const Title = language === "zh" ? founder.Title_zh || "无头衔" : founder.Title_en || "No Title";
                const ImageUrl = founder.Image?.[0]?.url ? `${BACKEND_HOST}${founder.Image[0].url}` : "https://placehold.co/250x350";
                const profileUrl = `/person/${founder.internal_url || founder.id}`;

                return (
                  <Col
                    key={founder.id}
                    xs={6}
                    sm={6}
                    md={3}
                  >
                    <Link to={profileUrl} style={{textDecoration:'none'}}>
                      <Card className="person-page-person-card">
                        <Card.Img src={ImageUrl} alt={Name}/>
                        <Card.Body className="text-center d-flex flex-column justify-content-between">
                          <Card.Title>{Name}</Card.Title>
                          <Card.Text>{Title}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </div>

          {/* 右侧按钮 */}
          {/* <Button onClick={nextSlide} disabled={startIndex + cardsPerRow >= totalFounders} className="home-product-carousel-btn right">
            &#10095;
          </Button> */}
        </div>

        {/* <Link to="/productpage/">
          <button><b>{t("btn_more")}</b></button>
        </Link> */}

      </Container>
      );
  };

  const FounderCarouselMobile = ({ founders, t, BACKEND_HOST}) => {

    return (
      <Container>
          <div>
            <Row
            >
              {founders.map(founder => {
                const displayBio =
                i18n.language === "zh"
                    ? founder.Bio_zh || "暂无简介"
                    : founder.Bio_en || "No biography available";

                const displayTitle =
                i18n.language === "zh"
                    ? founder.Title_zh || "无头衔"
                    : founder.Title_en || "No Title";

                const displayName =
                i18n.language === "zh" ? founder.Name_zh || "未知" : founder.Name_en || "Unknown";

                return (
                <Col key={founder.id} xs={12} sm={6} md={6}>
                    <div className="person-page-related-person-container">
                        <Row>
                            {/* 左侧图片框 */}
                            <Col>
                                <div>
                                    <Image
                                        src={
                                            founder.Image?.[0]?.url
                                                ? `${BACKEND_HOST}${founder.Image[0].url}`
                                                : "https://placehold.co/200x300"
                                        }
                                        alt={displayName}
                                        fluid
                                    />
                                </div>
                            </Col>

                            {/* 右侧文本和按钮 */}
                            <Col>
                                <div className="person-page-related-content">
                                    <h4 className="person-page-related-person-name">{displayName}</h4>
                                    <p className="person-page-related-person-title">{displayTitle}</p>
                                    <p
                                        className="person-page-related-bio-text"
                                        dangerouslySetInnerHTML={{ __html: displayBio }}
                                    ></p>
                                </div>
                                <Link
                                    to={`/person/${founder.internal_url || founder.id}`}
                                    className="person-page-related-more-link"
                                >
                                    {t("btn_more")}
                                </Link>
                            </Col>
                        </Row>
                    </div>
                </Col>
                );
            })}
            </Row>
          </div>


        {/* <Link to="/productpage/">
          <button><b>{t("btn_more")}</b></button>
        </Link> */}

      </Container>
      );
  };

  const KolCarousel = ({ kols, language, t, BACKEND_HOST, cardsPerRow = 4 }) => {
    const [startIndex, setStartIndex] = useState(0);
    const totalKols = kols.length;

    // const nextSlide = () => {
    //   setStartIndex((prevIndex) =>
    //     prevIndex + cardsPerRow < totalKols ? prevIndex + cardsPerRow : prevIndex
    //   );
    // };

    // const prevSlide = () => {
    //   setStartIndex((prevIndex) => (prevIndex - cardsPerRow >= 0 ? prevIndex - cardsPerRow : 0));
    // };

    return (
      <Container>
        
        {/* 轮播容器 */}
        <div>
          
          {/* <Button onClick={prevSlide} disabled={startIndex === 0} className="home-product-carousel-btn left">
            &#10094;
          </Button> */}

          {/* 产品区域 */}
          <div>
            <Row
              // style={{ transform: `translateX(-${(startIndex / cardsPerRow) * 100}%)` }}
            >
              {kols.map((kol) => {
                const Name = language === "zh" ? kol.Name_zh || "未知" : kol.Name_en || "Unknown";
                const Title = language === "zh" ? kols.Title_zh || "无头衔" : kol.Title_en || "No Title";
                const ImageUrl = kol.Image?.[0]?.url ? `${BACKEND_HOST}${kol.Image[0].url}` : "https://placehold.co/250x350";
                const profileUrl = `/person/${kol.internal_url || kol.id}`;

                return (
                  <Col
                    key={kol.id}
                    xs={6}
                    sm={6}
                    md={3}
                  >
                    <Link to={profileUrl} style={{textDecoration:'none'}}>
                      <Card className="person-page-person-card">
                        <Card.Img src={ImageUrl} alt={Name}/>
                        <Card.Body className="text-center d-flex flex-column justify-content-between">
                          <Card.Title>{Name}</Card.Title>
                          <Card.Text>{Title}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </div>

          {/* 右侧按钮 */}
          {/* <Button onClick={nextSlide} disabled={startIndex + cardsPerRow >= totalKols} className="home-product-carousel-btn right">
            &#10095;
          </Button> */}
        </div>

        {/* <Link to="/productpage/">
          <button><b>{t("btn_more")}</b></button>
        </Link> */}

      </Container>
      );
  };

  const KolCarouselMobile = ({ kols, t, BACKEND_HOST}) => {
    return (
      <Container>
        <div>
          <Row>
            {kols.map(kol => {
              const displayBio =
              i18n.language === "zh"
                  ? kol.Bio_zh || "暂无简介"
                  : kol.Bio_en || "No biography available";

              const displayTitle =
              i18n.language === "zh"
                  ? kol.Title_zh || "无头衔"
                  : kol.Title_en || "No Title";

              const displayName =
              i18n.language === "zh" ? kol.Name_zh || "未知" : kol.Name_en || "Unknown";

              return (
              <Col key={kol.id} xs={12} sm={6} md={6}>
                <div className="person-page-related-person-container">
                  <Row>
                      {/* 左侧图片框 */}
                      <Col>
                          <div>
                              <Image
                                  src={
                                      kol.Image?.[0]?.url
                                          ? `${BACKEND_HOST}${kol.Image[0].url}`
                                          : "https://placehold.co/200x300"
                                  }
                                  alt={displayName}
                                  fluid
                              />
                          </div>
                      </Col>

                      {/* 右侧文本和按钮 */}
                      <Col>
                          <div className="person-page-related-content">
                              <h4 className="person-page-related-person-name">{displayName}</h4>
                              <p className="person-page-related-person-title">{displayTitle}</p>
                              <p
                                  className="person-page-related-bio-text"
                                  dangerouslySetInnerHTML={{ __html: displayBio }}
                              ></p>
                          </div>
                          <Link
                              to={`/person/${kol.internal_url || kol.id}`}
                              className="person-page-related-more-link"
                          >
                              {t("btn_more")}
                          </Link>
                      </Col>
                  </Row>
                </div>
              </Col>
              );
            })}
          </Row>
        </div>

        {/* <Link to="/productpage/">
          <button><b>{t("btn_more")}</b></button>
        </Link> */}

      </Container>
    );
  };



  const AmbassadorsCarousel = ({ ambassadors, language, t, BACKEND_HOST, cardsPerRow = 4 }) => {
    const [startIndex, setStartIndex] = useState(0);
    const totalAmbassadors = ambassadors.length;

    // const nextSlide = () => {
    //   setStartIndex((prevIndex) =>
    //     prevIndex + cardsPerRow < totalAmbassadors ? prevIndex + cardsPerRow : prevIndex
    //   );
    // };

    // const prevSlide = () => {
    //   setStartIndex((prevIndex) => (prevIndex - cardsPerRow >= 0 ? prevIndex - cardsPerRow : 0));
    // };

    return (
      <Container>
        <div>
          {/* 左侧按钮 */}
          {/* <Button onClick={prevSlide} disabled={startIndex === 0} className="home-product-carousel-btn left">
            &#10094;
          </Button> */}

          {/* 产品区域 */}
          <div>
            <Row
              // style={{ transform: `translateX(-${(startIndex / cardsPerRow) * 100}%)` }}
            >
              {ambassadors.map((ambassador) => {
                const Name = language === "zh" ? ambassador.Name_zh || "未知" : ambassador.Name_en || "Unknown";
                const Title = language === "zh" ? ambassador.Title_zh || "无头衔" : ambassador.Title_en || "No Title";
                const ImageUrl = ambassador.Image?.[0]?.url ? `${BACKEND_HOST}${ambassador.Image[0].url}` : "https://placehold.co/250x350";
                const profileUrl = `/person/${ambassador.internal_url || ambassador.id}`;

                return (
                  <Col
                    key={ambassador.id}
                    xs={6}
                    sm={6}
                    md={3}
                  >
                    <Link to={profileUrl} style={{textDecoration:'none'}}>
                      <Card className="person-page-person-card">
                        <Card.Img src={ImageUrl} alt={Name} />
                        <Card.Body className="text-center d-flex flex-column justify-content-between">
                          <Card.Title>{Name}</Card.Title>
                          <Card.Text>{Title}</Card.Text>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </div>

          {/* 右侧按钮 */}
          {/* <Button onClick={nextSlide} disabled={startIndex + cardsPerRow >= totalAmbassadors} className="home-product-carousel-btn right">
            &#10095;
          </Button> */}
        </div>

        {/* <Link to="/productpage/">
          <button><b>{t("btn_more")}</b></button>
        </Link> */}

      </Container>
      );
  };

  const AmbassadorsCarouselMobile = ({ kols, t, BACKEND_HOST}) => {
    return (
      <Container>
        <div>
          <Row>
            {ambassadors.map(ambassador => {
              const displayBio =
              i18n.language === "zh"
                  ? ambassador.Bio_zh || "暂无简介"
                  : ambassador.Bio_en || "No biography available";

              const displayTitle =
              i18n.language === "zh"
                  ? ambassador.Title_zh || "无头衔"
                  : ambassador.Title_en || "No Title";

              const displayName =
              i18n.language === "zh" ? ambassador.Name_zh || "未知" : ambassador.Name_en || "Unknown";

              return (
              <Col key={ambassador.id} xs={12} sm={6} md={6}>
                  <div className="person-page-related-person-container">
                      <Row>
                          {/* 左侧图片框 */}
                          <Col>
                              <div>
                                  <Image
                                      src={
                                          ambassador.Image?.[0]?.url
                                              ? `${BACKEND_HOST}${ambassador.Image[0].url}`
                                              : "https://placehold.co/200x300"
                                      }
                                      alt={displayName}
                                      fluid
                                  />
                              </div>
                          </Col>

                          {/* 右侧文本和按钮 */}
                          <Col>
                              <div className="person-page-related-content">
                                  <h4 className="person-page-related-person-name">{displayName}</h4>
                                  <p className="person-page-related-person-title">{displayTitle}</p>
                                  <p
                                      className="person-page-related-bio-text"
                                      dangerouslySetInnerHTML={{ __html: displayBio }}
                                  ></p>
                              </div>
                              <Link
                                  to={`/person/${ambassador.internal_url || ambassador.id}`}
                                  className="person-page-related-more-link"
                              >
                                  {t("btn_more")}
                              </Link>
                          </Col>
                      </Row>
                  </div>
              </Col>
              );
            })}
          </Row>
        </div>

        {/* <Link to="/productpage/">
          <button><b>{t("btn_more")}</b></button>
        </Link> */}

      </Container>
    );
  };

  const fetchData = async (setKols, setFounders, setAmbassadors, setError, t) => {

      try {

        const [FounderResponse, KolResponse, AmbassadorResponse] = await Promise.all(
          roles.map(role =>
            axios.get(`${BACKEND_HOST}/api/people`, {
              params: {
                'filters[Role][$contains]': JSON.stringify({ roles: [role] }),
                'filters[PersonPage]': true,
                populate: 'Image',
                sort: "Order:desc"
              },
              paramsSerializer: params => qs.stringify(params, { encode: false }),
            })
          )
        );

      const FounderData = FounderResponse.data?.data || null;
      const KolData = KolResponse.data?.data || null;;
      const AmbassadorData = AmbassadorResponse.data?.data || null;
      setKols(KolData);
      setFounders(FounderData);
      setAmbassadors(AmbassadorData)
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(t("errorFetchingProductData"));
    }
  };

  useEffect(() => {
    try {
      fetchData(setKols, setFounders, setAmbassadors, setError, t)
    } catch {
      setError(t("errorFetchingProductData"))
      console.log(error);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

    return (
      <>
        {onDesktop ? (

          <Container>

            <br/>

            <div>
              <h6>品牌、企业灵魂人物</h6>
              <h2>品牌创始人</h2>
            </div>

            <br/>

            <section>
              <FounderCarousel 
                founders={founders}
                language={language}
                t={t}
                BACKEND_HOST={BACKEND_HOST}
                cardsPerRow={4}
              />
            </section>

            <br/>

            <div>
              <h6>领域专家</h6>
              <h2>意见领袖</h2>
            </div>

            <br/>

            <section>
              <KolCarousel 
                kols={kols}
                language={language}
                t={t}
                BACKEND_HOST={BACKEND_HOST}
                cardsPerRow={4}
              />
            </section>

            <br/>

            <div>
              <h6>潮流网红</h6>
              <h2>品牌代言人</h2>
            </div>

            <br/>
  
            <section>
              <AmbassadorsCarousel 
                ambassadors={ambassadors}
                language={language}
                t={t}
                BACKEND_HOST={BACKEND_HOST}
                cardsPerRow={4}
              />
            </section>
            <br/>

          </Container>
        ) : (
          <Container>
            <br/>

            <div>
              <h6>品牌、企业灵魂人物</h6>
              <h2>品牌创始人</h2>
            </div>

            <br/>

            <section>
              <FounderCarouselMobile 
                founders={founders}
                t={t}
                BACKEND_HOST={BACKEND_HOST}
              />
            </section>

            <br/>

            <div>
              <h6>领域专家</h6>
              <h2>意见领袖</h2>
            </div>

            <br/>
  
            <section>
              <KolCarouselMobile
                kols={kols}
                t={t}
                BACKEND_HOST={BACKEND_HOST}
              />
            </section>

            <br/>

            <div>
              <h6>潮流网红</h6>
              <h2>品牌代言人</h2>
            </div>

            <br/>
  
            <section>
              <AmbassadorsCarouselMobile
                ambassadors={ambassadors}
                t={t}
                BACKEND_HOST={BACKEND_HOST}
              />
            </section>

            <br/>

          </Container>
        )}
      </>
    );
};
  
export default InfluenceHub;