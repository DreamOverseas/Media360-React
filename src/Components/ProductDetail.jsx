/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  Button,
  Col,
  Container,
  Modal,
  Row,
  Spinner,
  Tabs,
  Tab,
  Accordion,
  Card,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "../Css/ProductDetail.css";
import { getPartnerTypeLabel } from "./PartnerConfig";
import ProductGallery from "./ProductGallery.jsx";

const BACKEND_HOST = import.meta.env.VITE_CMS_ENDPOINT;

const ProductDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProduct] = useState([]);
  const [people, setPeople] = useState(null);
  const [videos, setVideo] = useState([]);
  const [news, setNews] = useState([]);
  const [event, setEvent] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [baseurl, setBaseUrl] = useState(null);
  const onDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  const [founder, setFounder] = useState([]);
  const [kol, setKol] = useState([]);
  const [spokesperson, setSpokesperson] = useState([]);
  const [brand, setBrand] = useState({});
  const [variants, setVariants] = useState([]);
  const [subItemCategory, setSubItemCategory] = useState(null);

  const SHOW_PARTNER_BUTTON_PRODUCTS = ["Studyfin", "IncubationPark"];

  const ConsultationModal = ({ show, handleClose }) => {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>咨询与购买</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className="custom-modal-body"
          dangerouslySetInnerHTML={{ __html: Note }}
        />
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            关闭
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const fetchData = async (path) => {
    try {
      const [
        productResponse,
        peopleResponse,
        newsResponse,
        brandResponse,
        eventResponse,
        imagesResponse,
      ] = await Promise.all([
        axios.get(
          `${BACKEND_HOST}/api/products/?filters[url]=${path}&populate[related_products][populate][products][populate]=ProductImage`
        ),
        axios.get(
          `${BACKEND_HOST}/api/products/?filters[url]=${path}&populate[people][populate]=Image`
        ),
        axios.get(
          `${BACKEND_HOST}/api/products/?filters[url]=${path}&populate[news][populate]=Image`
        ),
        axios.get(
          `${BACKEND_HOST}/api/products/?filters[url]=${path}&populate[brand][populate]=logo`
        ),
        axios.get(
          `${BACKEND_HOST}/api/products/?filters[url]=${path}&populate[events][populate]=Image`
        ),
        axios.get(`${BACKEND_HOST}/api/products/`, {
          params: {
            "filters[url]": path,
            "populate": "*",
          },
        }),
      ]);

      const productData = productResponse.data?.data?.[0] || null;
      if (!productData) {
        setError(t("noProductsAvailable"));
        return;
      }

      const imagesData = imagesResponse.data?.data?.[0] || {};
      productData.ProductImage = imagesData.ProductImage || productData.ProductImage;
      productData.SubImages = imagesData.SubImages || productData.SubImages;

      setProduct(productData);
      setRelatedProduct(productData.related_products?.products || []);

      const peopleData = peopleResponse.data?.data?.[0]?.people;
      setPeople(peopleData);

      const videoEmbed = productResponse.data?.data?.[0]?.videos?.data || [];
      setVideo(videoEmbed);

      const newsList = newsResponse.data?.data?.[0]?.news || [];
      setNews(newsList);

      const brandinfo = brandResponse.data?.data?.[0]?.brand || null;
      setBrand(brandinfo);

      const subCategory = brandResponse.data?.data?.[0]?.brand?.item_category || null;
      setSubItemCategory(subCategory);

      const eventList = eventResponse.data?.data?.[0]?.events || [];
      setEvent(eventList);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(t("no_description"));
    }
  };

  useEffect(() => {
    const path = location.pathname.replace("/products/", "");
    setBaseUrl(path);

    const segments = path.split("/").filter((seg) => seg);
    const slug =
      segments.length > 1 && !segments[1].startsWith("related-")
        ? segments[1]
        : segments[0];

    fetchData(slug);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  useEffect(() => {
    if (!brand || !brand.internal_url) return;

    axios
      .get(`${BACKEND_HOST}/api/brands/`, {
        params: {
          "filters[internal_url][$eq]": `${brand.internal_url}`,
          "populate[products][fields]": "url,Name_zh,Name_en,Sub_Item_Category",
        },
      })
      .then((response) => {
        const v = response.data.data[0]?.products;
        setVariants(v);
      })
      .catch((error) =>
        console.error("Error fetching product variants:", error)
      );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand?.internal_url]);

  useEffect(() => {
    if (Array.isArray(people) && people.length > 0) {
      setFounder(
        people.filter(
          (p) => Array.isArray(p.Role?.roles) && p.Role.roles.includes("Founder")
        )
      );
      setKol(
        people.filter(
          (p) => Array.isArray(p.Role?.roles) && p.Role.roles.includes("Kol")
        )
      );
      setSpokesperson(
        people.filter(
          (p) =>
            Array.isArray(p.Role?.roles) && p.Role.roles.includes("Ambassador")
        )
      );
    }
  }, [people]);

  const handleShare = () => {
    const shareData = {
      title: document.title,
      text: document.title,
      url: window.location.href,
    };
    if (navigator.share) {
      navigator.share(shareData).catch((e) => console.error("Share failed:", e));
    } else {
      alert("当前浏览器不支持分享功能，请手动复制链接分享。");
    }
  };

  const getPartnerLabels = () => {
    const productUrl = (baseurl || "").split("/")[0];
    const config = {
      Studyfin: [
        { type: "default", label: getPartnerTypeLabel("study-abroad-agency") },
        { type: "migration", label: getPartnerTypeLabel("immigration-advisor") },
      ],
      IncubationPark: [
        { type: "default", label: getPartnerTypeLabel("recruitment-agency") },
      ],
    };
    return config[productUrl] || [{ type: "default", label: getPartnerTypeLabel("partner") }];
  };

  const getPartnerTypeForButton = (type) => {
    const productUrl = (baseurl || "").split("/")[0];
    const map = {
      Studyfin: {
        default: "study-abroad-agency",
        migration: "immigration-advisor",
      },
      IncubationPark: {
        default: "recruitment-agency",
      },
    };
    return map[productUrl]?.[type] || "partner";
  };

  const AccordionItem = ({ idx, header, detail, defaultOpen = false }) => (
    <Accordion id={idx} defaultActiveKey={defaultOpen ? "0" : undefined}>
      <Accordion.Item eventKey="0">
        <Accordion.Header>{header}</Accordion.Header>
        <Accordion.Body>
          {detail ? (
            <div className="detail-container">
              <ReactMarkdown rehypePlugins={[rehypeRaw]}>{detail}</ReactMarkdown>
            </div>
          ) : (
            <div className="detail-container">暂无产品信息</div>
          )}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );

  if (error) return <div className="pd-fluid-container"><p>{error}</p></div>;

  if (!product) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status" />
        <p>{t("loading_more")}</p>
      </div>
    );
  }

  const { Price_Display } = product;
  const language = i18n.language;

  const Name = language === "zh" ? product.Name_zh : product.Name_en;
  const ShortDetail =
    language === "zh" ? product.Short_zh || "N/A" : product.Short_en || "N/A";
  const Detail = language === "zh" ? product.Detail_zh : product.Detail_en;
  const Note = language === "zh" ? product.Note_zh : product.Note_en;
  const slides =
    language === "zh" ? product.slides_zh || "N/A" : product.slides_en || "N/A";
  const spots =
    language === "zh" ? product.spots_zh || "N/A" : product.spots_en || "N/A";

  const DetailHeading =
    brand?.MainProduct_url === (baseurl || "").split("/")[0]
      ? "品牌简介"
      : "简介";
  const SpotsHeading = language === "zh" ? "附近的景点" : "Nearby Spots";
  const isChateauLeMarais = product?.url === "Chateau-Le-Marais";

  const signatureOrchardContent = `Signature Orchard｜生态果园与自然生活体系

Signature Orchard（生态签名果园）是 Chateau Le Marais 最具代表性的生态资产之一。

该果园位于 Wallis Island 原生态自然环境之中，融合热带、亚热带与温带植物系统，形成一个集生态、健康、农业、文旅与自然生活于一体的综合生态环境。

整个 Orchard 拥有40多种果树、特色植物、香料及 wellness 导向植物系统，包括：

- 夏威夷果（Macadamia）
- 嘉宝果（Jaboticaba）
- 澳洲指橙（Finger Lime）
- 热带柑橘类
- 多种珍稀水果
- 原生可食植物
- 香草与调味植物
- 芳香与 wellness 植物系统

Signature Orchard 不仅仅是传统农业，更是：

- 生态文旅体验
- 有机生活方式
- Wellness retreat
- 自然疗愈
- Farm-to-table 餐饮概念
- 可持续生态教育
- 高端生态生活方式

整个 Orchard 系统也是 DO360 Eco Living 体系的重要组成部分，结合：

- 自然
- 健康
- 可持续发展
- 生态文旅
- 智能生态生活
- 土地与生态资产运营

未来将进一步发展为：

“生态生活 + 高端文旅 + Wellness + 自然疗愈”

相结合的 Signature Botanical Collection。`;

  /* Related info buttons — shared between desktop and mobile */
  const RelatedButtons = () => (
    <Row>
      {SHOW_PARTNER_BUTTON_PRODUCTS.includes((baseurl || "").split("/")[0]) &&
        getPartnerLabels().map(({ type, label }, idx) => (
          <Col xs={4} key={idx}>
            <Link
              to={`/products/${(baseurl || "").split("/")[0]}/${getPartnerTypeForButton(type)}/PartnerDetail`}
            >
              <Button className="product-detail-funtion-btn">{label}</Button>
            </Link>
          </Col>
        ))}
      {founder.length > 0 && (
        <Col xs={4}>
          <Link
            to={`/products/${baseurl}/related-founder`}
            state={{ founder }}
          >
            <Button className="product-detail-funtion-btn">品牌创始人</Button>
          </Link>
        </Col>
      )}
      {kol.length > 0 && (
        <Col xs={4}>
          <Link to={`/products/${baseurl}/related-kol`} state={{ kol }}>
            <Button className="product-detail-funtion-btn">意见领袖</Button>
          </Link>
        </Col>
      )}
      {spokesperson.length > 0 && (
        <Col xs={4}>
          <Link
            to={`/products/${baseurl}/related-ambassador`}
            state={{ spokesperson }}
          >
            <Button className="product-detail-funtion-btn">代言人</Button>
          </Link>
        </Col>
      )}
      {news.length > 0 && (
        <Col xs={4}>
          <Link
            to={`/products/${baseurl}/related-news`}
            state={{ news }}
          >
            <Button className="product-detail-funtion-btn">相关新闻</Button>
          </Link>
        </Col>
      )}
      {event.length > 0 && (
        <Col xs={4}>
          <Link
            to={`/products/${baseurl}/related-event`}
            state={{ event }}
          >
            <Button className="product-detail-funtion-btn">相关活动</Button>
          </Link>
        </Col>
      )}
    </Row>
  );

  return (
    <div>
      <section>
        <Container fluid className="pd-fluid-container">
          <Row className="product-detail-section">
            {/* Left column: gallery + related info (desktop) */}
            <Col>
              <Row>
                <ProductGallery product={product} />
              </Row>
              <br />
              {onDesktop && (
                <div className="related-info-block">
                  <Row>
                    <h4>查看相关信息</h4>
                    <RelatedButtons />
                  </Row>
                </div>
              )}
            </Col>

            {/* Right column: details */}
            <Col className="product-detail-col">
              <Container className="product-detail">
                <Row>
                  <h1>{Name}</h1>
                  <div>
                    <p>{ShortDetail}</p>
                  </div>
                </Row>

                <Row className="price-row">
                  {Price_Display !== 0 && Price_Display !== null && (
                    <h2>AU$ {Price_Display}</h2>
                  )}
                </Row>

                {/* Variants */}
                {variants &&
                  (subItemCategory?.[language]?.length > 0 ? (
                    <div className="variants-div">
                      <Tabs
                        defaultActiveKey={subItemCategory[language][0]}
                        id="product-variants-tabs"
                        className="product-category-tabs"
                      >
                        {subItemCategory[language].map((item, index) => (
                          <Tab eventKey={item} title={item} key={index}>
                            <div className="mt-3">
                              <Row>
                                {variants
                                  .filter(
                                    (v) =>
                                      v.Sub_Item_Category?.[language] === item
                                  )
                                  .map((variant, vIndex) => {
                                    const isActive =
                                      location.pathname ===
                                      `/products/${variant.url}`;
                                    return (
                                      <Col xs={4} key={vIndex}>
                                        <Link
                                          to={`/products/${brand.MainProduct_url}/${variant.url}`}
                                        >
                                          <Button
                                            className={`product-details-variant-btn ${isActive ? "active-btn" : ""}`}
                                          >
                                            {language === "zh"
                                              ? variant.Name_zh
                                              : variant.Name_en}
                                          </Button>
                                        </Link>
                                      </Col>
                                    );
                                  })}
                              </Row>
                            </div>
                          </Tab>
                        ))}
                      </Tabs>
                    </div>
                  ) : (
                    <Row>
                      {variants.map((variant, index) => {
                        const isActive =
                          location.pathname === `/products/${variant.url}`;
                        return (
                          <Col xs={4} key={index}>
                            <Link
                              to={`/products/${brand.MainProduct_url}/${variant.url}`}
                            >
                              <Button
                                className={`product-details-variant-btn ${isActive ? "active-btn" : ""}`}
                              >
                                {language === "zh"
                                  ? variant.Name_zh
                                  : variant.Name_en}
                              </Button>
                            </Link>
                          </Col>
                        );
                      })}
                    </Row>
                  ))}

                {/* Purchase / Enquiry buttons */}
                {!product.MainCollectionProduct && (
                  <Row className="product-price-quantity d-flex align-items-center amount-price-cart-bar">
                    <Col md={8} className="paypal-button-container">
                      {Note ? (
                        <>
                          <Button
                            className="add-to-cart-btn"
                            onClick={() => setShowModal(true)}
                          >
                            {t("enquireNow")}
                          </Button>
                          <ConsultationModal
                            show={showModal}
                            handleClose={() => setShowModal(false)}
                          />
                        </>
                      ) : (
                        <Button
                          className="add-to-cart-btn"
                          style={{ width: "100%" }}
                          onClick={() =>
                            navigate(`/products/${baseurl}/payment`, {
                              state: {
                                productId: product.id,
                                productName: Name,
                                price: Price_Display,
                                stripePaymentLink: product.stripe_payment_link || null,
                              },
                            })
                          }
                        >
                          立即支付
                        </Button>
                      )}
                    </Col>
                  </Row>
                )}

                <Row>
                  {!product.SingleProduct &&
                    Price_Display !== 0 &&
                    Price_Display !== null && (
                      <Link to={`/products/${brand?.MainProduct_url}`}>
                        <Button className="main-product-detail-funtion-btn">
                          返回品牌主页
                        </Button>
                      </Link>
                    )}
                </Row>

                <AccordionItem
                  idx="detail-accordion"
                  header={DetailHeading}
                  detail={Detail}
                  defaultOpen={false}
                />

                {isChateauLeMarais && (
                  <div className="variants-div">
                    <Tabs
                      defaultActiveKey="eco-feast"
                      id="chateau-le-marais-submenu-tabs"
                      className="product-category-tabs"
                    >
                      <Tab eventKey="private-meeting" title="私享会晤">
                        <div className="mt-3 detail-container">内容即将上线</div>
                      </Tab>
                      <Tab eventKey="island-wedding" title="岛屿婚礼">
                        <div className="mt-3 detail-container">内容即将上线</div>
                      </Tab>
                      <Tab eventKey="global-launch" title="全球发布会">
                        <div className="mt-3 detail-container">内容即将上线</div>
                      </Tab>
                      <Tab eventKey="black-club" title="黑卡俱乐部">
                        <div className="mt-3 detail-container">内容即将上线</div>
                      </Tab>
                      <Tab eventKey="eco-feast" title="顶级生态盛宴">
                        <div className="mt-3 detail-container">
                          <ReactMarkdown>{signatureOrchardContent}</ReactMarkdown>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                )}

                {spots !== "N/A" && (
                  <AccordionItem
                    idx="spots-accordion"
                    header={SpotsHeading}
                    detail={spots}
                    defaultOpen={false}
                  />
                )}

                {/* Related info buttons (mobile) */}
                {!onDesktop && (
                  <Row>
                    <h4>查看相关信息</h4>
                    <RelatedButtons />
                  </Row>
                )}
              </Container>
            </Col>
          </Row>
          <br />

          {/* Videos */}
          {videos.length > 0 && (
            <div className="slide-section">
              <h4>相关视频</h4>
              <br />
              {videos.map((video, index) => (
                <div key={index}>
                  <div
                    className="product-video"
                    style={{
                      position: "relative",
                      width: "100%",
                      paddingTop: "56.25%",
                    }}
                    dangerouslySetInnerHTML={{
                      __html: video.videoEmbed.replace(
                        "<iframe ",
                        '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allow="autoplay;encrypted-media;fullscreen;picture-in-picture" '
                      ),
                    }}
                  />
                  <br />
                </div>
              ))}
            </div>
          )}

          {/* Related products */}
          {relatedProducts.length > 0 && (
            <div className="home-product-carousel-container">
              <h4>相关产品</h4>
              <br />
              <Row>
                {relatedProducts.map((rp) => {
                  const rpName = language === "zh" ? rp.Name_zh : rp.Name_en;
                  return (
                    <Col md={6} xs={12} key={rp.id}>
                      <Link
                        to={`/products/${rp.url}`}
                        className="home-product-card-link"
                      >
                        <Card className="product-card">
                          <Card.Img
                            src={`${BACKEND_HOST}${rp.ProductImage?.url}`}
                            alt={rpName}
                          />
                          <hr />
                          <Card.Body className="card-body">
                            <Card.Title title={rpName}>{rpName}</Card.Title>
                            <Card.Text>{rp.Description_zh}</Card.Text>
                          </Card.Body>
                        </Card>
                      </Link>
                    </Col>
                  );
                })}
              </Row>
            </div>
          )}

          {/* Slides / image details */}
          {slides !== "N/A" && (
            <div className="slide-section">
              <h4>图文详情</h4>
              <br />
              <Container>
                <ReactMarkdown>{slides}</ReactMarkdown>
              </Container>
            </div>
          )}
        </Container>
      </section>
    </div>
  );
};

export default ProductDetail;
