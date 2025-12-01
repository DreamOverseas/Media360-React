/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useContext, useEffect, useState} from "react";
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
  Card
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../css/ProductDetail.css";
import { getPartnerTypeLabel } from "../components/PartnerConfig";
import ProductGallery from "./ProductGallery.jsx";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
const DEBUG = import.meta.env.DEBUG;

const ProductDetail = () => {
  const navigate = useNavigate();  
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [name, setRecentSlug] = useState(null);
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProduct] = useState([])
  const [people, setPeople] = useState(null);
  const [videos, setVideo] = useState([]);
  const [news, setNews] = useState([]);
  const [event, setEvent] = useState([]);
  const [productTag, setProductTag] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [baseurl, setBaseUrl] = useState(null);
  const onDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  // const [showLoginModal, setShowLoginModal] = useState(false);
  const [founder, setFounder] = useState([]);
  const [kol, setKol] = useState([]);
  const [spokesperson, setSpokesperson] = useState([]);
  const [brand, setBrand] = useState({});
  const [variants, setVariants] = useState([]);
  const [subItemCategory, setSubItemCategory] = useState(null);

  // const SHOW_PARTNER_BUTTON_PRODUCTS = ["roseneath-holidaypark", "nail-train", "Studyfin"];
  const SHOW_PARTNER_BUTTON_PRODUCTS = ["Studyfin", "IncubationPark"];


  const ConsultationModal = ({ show, handleClose }) => {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>咨询与购买</Modal.Title>
        </Modal.Header>
        <Modal.Body
          className='custom-modal-body'
          dangerouslySetInnerHTML={{ __html: Note }}
        ></Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleClose}>
            关闭
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const fetchData = async (path, setProduct, setPeople, setError, t) => {
    try {
      const [
        productResponse,
        peopleResponse,
        newsResponse,
        brandResponse,
        eventResponse,
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
      ]);

      const productData = productResponse.data?.data?.[0] || null;
      if (!productData) {
        setError(t("noProductFound"));
        return;
      }

      setProduct(productData);
      // console.log("testing",productData.related_products?.products);
      setRelatedProduct(productData.related_products?.products || [])

      const peopleData = peopleResponse.data?.data?.[0]?.people;
      setPeople(peopleData);
      // console.log(peopleData)

      const relatedData = productResponse.data?.data?.[0]?.product_tags;

      if (relatedData) {
        setProductTag(relatedData);
      }

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

      // console.log("event", eventList);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(t("errorFetchingProductData"));
    }
  };


useEffect(() => {
  const path = location.pathname.replace("/products/", "");
  setBaseUrl(path);
  // console.log("ppppp", path);

  const segments = path.split('/').filter(seg => seg);
  const slug =
    segments.length > 1 && !segments[1].startsWith('related-')
      ? segments[1]
      : segments[0];
  setRecentSlug(slug);

  fetchData(slug, setProduct, setPeople, setError, t);
}, [location.pathname]);

  useEffect(() => {
    if (!brand || !brand.internal_url) return;

    axios
      .get("https://api.do360.com/api/brands/", {
        params: {
          "filters[internal_url][$eq]": `${brand.internal_url}`,
          "populate[products][fields]": "url,Name_zh,Name_en,Sub_Item_Category",
        },
      })
      .then(response => {
        const variants = response.data.data[0]?.products;
        console.log("variants", variants);
        setVariants(variants);
      })
      .catch(error =>
        console.error("Error fetching product URLs and names:", error)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand?.internal_url]);

  useEffect(() => {
    // console.log("🚀 people 数据更新:", people);

    if (Array.isArray(people) && people.length > 0) {
      const founders = people.filter(
        person =>
          Array.isArray(person.Role?.roles) &&
          person.Role.roles.includes("Founder")
      );

      const kols = people.filter(
        person =>
          Array.isArray(person.Role?.roles) && person.Role.roles.includes("Kol")
      );

      const spokespersons = people.filter(
        person =>
          Array.isArray(person.Role?.roles) &&
          person.Role.roles.includes("Ambassador")
      );

      // console.log("🔍 筛选出的 Founder:", founders);
      // console.log("🔍 筛选出的 Kol:", kols);
      // console.log("🔍 筛选出的 Spokesperson:", spokespersons);

      setFounder(founders);
      setKol(kols);
      setSpokesperson(spokespersons);
    }
  }, [people]);

  // const formatDateTime = datetime => {
  //   if (!datetime) return "未知时间";
  //   return moment(datetime)
  //     .tz("Australia/Sydney")
  //     .format("ddd, DD MMM, h:mm a z");
  // };

  const handleShare = () => {
    const shareData = {
      title: Name || "页面分享",
      text: document.title,
      url: window.location.href,
    };
    
    if (navigator.share) {
      navigator
        .share(shareData)
        .then(() => console.log("分享成功！"))
        .catch(error => console.error("分享失败:", error));
    } else {
      alert("当前浏览器不支持分享功能，请手动复制链接分享。");
    }
  };

  const getPartnerLabels = () => {
    const productUrl = baseurl.split('/')[0] || "";

    const config = {
      "roseneath-holidaypark": [
        { type: "default", label: getPartnerTypeLabel("travel-agency") },
      ],
      "nail-train": [
        { type: "default", label: getPartnerTypeLabel("franchise-partner") },
      ],
      "Studyfin": [
        { type: "default", label: getPartnerTypeLabel("study-abroad-agency") },
        { type: "migration", label: getPartnerTypeLabel("immigration-advisor") },
      ],
      "IncubationPark": [
        { type: "default", label: getPartnerTypeLabel("recruitment-agency") },
      ],
    };

    return config[productUrl] || [{ type: "default", label: getPartnerTypeLabel("partner") }];
  };

  const getPartnerTypeForButton = (type) => {
    const productUrl = baseurl.split('/')[0] || "";

    const map = {
      "roseneath-holidaypark": {
        default: "travel-agency",
      },
      "nail-train": {
        default: "franchise-partner",
      },
      "Studyfin": {
        default: "study-abroad-agency",
        migration: "immigration-advisor",
      },
      "IncubationPark": {
        default: "recruitment-agency",
      },
    };

    return map[productUrl]?.[type] || "partner";
  };

  // Fetch product data and save to sessionStorage
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `${BACKEND_HOST}/api/products?filters[url][$eq]=${name}&populate=*`
        );
        const data = await response.json();
        // console.log("local",data)

        if (data.data.length > 0) {
          const productData = data.data[0];
          setProduct(productData);

          // Save to sessionStorage
          const recentProducts =
            JSON.parse(sessionStorage.getItem("recentProducts")) || [];
          const isExisting = recentProducts.some(p => p.id === productData.id);

          if (!isExisting) {
            recentProducts.unshift({
              id: productData.id,
              name: productData.Name_zh || productData.Name_en,
              url: productData.url,
              image: productData.ProductImage?.url,
            });

            if (recentProducts.length > 1) recentProducts.pop();

            sessionStorage.setItem(
              "recentProducts",
              JSON.stringify(recentProducts)
            );

            const event = new Event("recentProductsUpdated");
            window.dispatchEvent(event);
          }
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [name]);


  const AccordionItem = ({ idx, header, detail, defaultOpen = false }) => {
    return (
      <Accordion
        id={idx}
        defaultActiveKey={defaultOpen ? '0' : undefined}
      >
        <Accordion.Item eventKey="0">
          <Accordion.Header>{header}</Accordion.Header>
          <Accordion.Body>
            {detail ? (
              <div className="detail-container">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                  {detail}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="detail-container">暂无产品信息</div>
            )} 
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    )
  };

  if (!product) {
    return (
      <div className='loading-container'>
        <Spinner animation='border' role='status'></Spinner>
        <p className='sr-only'>{t("loading")}</p>
      </div>
    );
  }

  const { Price_Display, ProductImage} = product;
  const language = i18n.language;

  // const display_price = Price === (0 || null) ? t("price_tbd") : `AU$${Price}`;
  const Name = language === "zh" ? product.Name_zh : product.Name_en;
  const ShortDetail = language === "zh" ? product.Short_zh || "N/A" : product.Short_en || "N/A";
  // console.log("short",ShortDetail)

  const Detail = language === "zh" ? product.Detail_zh : product.Detail_en;

  const Description = language === "zh" ? product.Description_zh : product.Description_en;

  const Note = language === "zh" ? product.Note_zh : product.Note_en;

  const slides = language === "zh" ? product.slides_zh || "N/A": product.slides_en || "N/A";
  const spots = language === "zh" ? product.spots_zh || "N/A": product.spots_en || "N/A";
  const shareLink = window.location.href;
  // console.log("This is product.ProductImage's parent");
  console.log("final product",product);
  const shareImg = product.ProductImage
    ? (product.ProductImage.formats
      ? `${BACKEND_HOST}${product.ProductImage.formats.thumbnail.url}` 
      : `${BACKEND_HOST}${product.ProductImage.url}`)
    : `${BACKEND_HOST}/default-share.jpg`;
  // console.log(shareImg)
  const DetailHeading = (product?.brand?.MainProduct_url===name)?"品牌简介":"产品简介"
  const SpotsHeading = language === "zh" ? "附近的景点" : "Nearby Spots";
  // console.log(shareLink)
  // console.log(Name)
  // console.log(Description)

  // console.log("info", subItemCategory);
  // console.log("product", product);
  // console.log("slide", slides);

  // console.log(productTag)
  // console.log("vvvv",videos);

  if (DEBUG) console.log("当前产品名称为:", Name);

  return (
    <div>
      <section>
        <Container>
          <Row className='product-detail-section'>
            <Col >
                <Row>
                  <ProductGallery product={product} />
                </Row>
              <br/>

              {onDesktop ? (
                <>
                  <Row>
                    <h4>查看相关信息</h4>
                    <Row>
                        {/* 合作伙伴按钮 */}
                        {SHOW_PARTNER_BUTTON_PRODUCTS.includes(product.url) &&
                          getPartnerLabels().map(({ type, label }, idx) => (
                            <Col xs={4} key={idx}>
                              <Link to={`/products/${baseurl.split('/')[0]}/${getPartnerTypeForButton(type)}/PartnerDetail`}>
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
                            <Button className='product-detail-funtion-btn'>
                              品牌创始人
                            </Button>
                          </Link>
                        </Col>
                      )}
                      {kol.length > 0 && (
                        <Col xs={4}>
                          <Link
                            to={`/products/${baseurl}/related-kol`}
                            state={{ kol }}
                          >
                            <Button className='product-detail-funtion-btn'>
                              意见领袖
                            </Button>
                          </Link>
                        </Col>
                      )}
                      {spokesperson.length > 0 && (
                        <Col xs={4}>
                          <Link
                            to={`/products/${baseurl}/related-ambassador`}
                            state={{ spokesperson }}
                          >
                            <Button className='product-detail-funtion-btn'>
                              代言人
                            </Button>
                          </Link>
                        </Col>
                      )}
                      {news.length > 0 && (
                        <Col xs={4}>
                          <Link
                            to={`/products/${baseurl}/related-news`}
                            state={{ news }}
                          >
                            <Button className='product-detail-funtion-btn'>
                              相关新闻
                            </Button>
                          </Link>
                        </Col>
                      )}
                      {event.length > 0 && (
                        <Col xs={4}>
                          <Link
                            to={`/products/${baseurl}/related-event`}
                            state={{ event }}
                          >
                            <Button className='product-detail-funtion-btn'>
                              相关活动
                            </Button>
                          </Link>
                        </Col>
                      )}
                    </Row>
                  </Row>
                </>
              ) : (
                <></>
              )}

            </Col>

            <Col className='product-detail-col'>
              <Container className='product-detail'>
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

                {variants ? (
                  subItemCategory?.[language]?.length > 0 ? (
                    <div className="variants-div">
                      <Tabs defaultActiveKey={subItemCategory[language][0]} id="product-variants-tabs" className="product-category-tabs">
                        {subItemCategory[language].map((item, index) => (
                          <Tab eventKey={item} title={item} key={index}>
                            <div className="mt-3">
                              <Row>
                                {variants
                                  .filter(variant => variant.Sub_Item_Category?.[language] === item)
                                  .map((variant, vIndex) => {
                                    const currentPath = location.pathname;
                                    const isActive = currentPath === `/products/${variant.url}`;
                                    return (
                                      <Col xs={4} key={vIndex}>
                                        <Link to={`/products/${brand.MainProduct_url}/${variant.url}`}>
                                          <Button
                                            className={`product-details-variant-btn ${isActive ? "active-btn" : ""}`}
                                          >
                                            {language === "zh" ? variant.Name_zh : variant.Name_en}
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
                    // Fallback: when no subcategories, show all variants as buttons
                    <Row>
                      {variants.map((variant, index) => {
                        const currentPath = location.pathname;
                        const isActive = currentPath === `/products/${variant.url}`;
                        return (
                          <Col xs={4} key={index}>
                            <Link to={`/products/${brand.MainProduct_url}/${variant.url}`}>
                              <Button
                                className={`product-details-variant-btn ${isActive ? "active-btn" : ""}`}
                              >
                                {language === "zh" ? variant.Name_zh : variant.Name_en}
                              </Button>
                            </Link>
                          </Col>
                        );
                      })}
                    </Row>

                    
                  )
                ) : (
                  <></>
                )}

                {!product.MainCollectionProduct && (
                  <Row className='product-price-quantity d-flex align-items-center amount-price-cart-bar'>
                    <Col md={8} className='paypal-button-container'>
                      {Note ? (
                        // 如果 Note 存在,显示原来的按钮和弹窗
                        <>
                          <Button
                            className="add-to-cart-btn"
                            onClick={() => setShowModal(true)}
                          >
                            即刻订购
                          </Button>
                          {/* 弹窗组件 */}
                          <ConsultationModal
                            show={showModal}
                            handleClose={() => setShowModal(false)}
                          />
                        </>
                      ) : (
                        // 如果 Note 为空,显示“立即支付”按钮，跳转到支付方式页面
                        <Button
                          className="add-to-cart-btn"
                          style={{ width: "100%" }}
                          onClick={() =>
                            navigate(`/products/${baseurl}/payment`, {
                              state: {
                                productId: product.id,
                                productName: Name,
                                price: Price_Display,
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
                  {!product.SingleProduct && Price_Display !== 0 && Price_Display !== null &&  (
                    <Link to={`/products/${brand.MainProduct_url}`}>
                      <Button className='main-product-detail-funtion-btn'>
                        返回品牌主页
                      </Button>
                    </Link>
                  )}
                </Row>

                <>
                  <AccordionItem
                      idx="detail-accordion"
                      header={DetailHeading}
                      detail={Detail}
                      defaultOpen={false}
                    />

                    {spots !== "N/A" ?
                    (
                      <AccordionItem
                        idx="spots-accordion"
                        header={SpotsHeading}
                        detail={spots}
                        defaultOpen={false}
                      />
                    ):(
                      <></>
                    )}
                </>
                
                {onDesktop ? (
                  <></>
                ) : (
                  <>
                    <Row>
                      <h4>查看相关信息</h4>
                      <Row>
                      {/* 合作伙伴按钮 */}
                        {SHOW_PARTNER_BUTTON_PRODUCTS.includes(product.url) &&
                          getPartnerLabels().map(({ type, label }, idx) => (
                            <Col xs={4} key={idx}>
                              <Link to={`/products/${baseurl.split('/')[0]}/${getPartnerTypeForButton(type)}/PartnerDetail`}>
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
                              <Button className='product-detail-funtion-btn'>
                                品牌创始人
                              </Button>
                            </Link>
                          </Col>
                        )}
                        {kol.length > 0 && (
                          <Col xs={4}>
                            <Link
                              to={`/products/${baseurl}/related-kol`}
                              state={{ kol }}
                            >
                              <Button className='product-detail-funtion-btn'>
                                意见领袖
                              </Button>
                            </Link>
                          </Col>
                        )}
                        {spokesperson.length > 0 && (
                          <Col xs={4}>
                            <Link
                              to={`/products/${baseurl}/related-ambassador`}
                              state={{ spokesperson }}
                            >
                              <Button className='product-detail-funtion-btn'>
                                代言人
                              </Button>
                            </Link>
                          </Col>
                        )}
                        {news.length > 0 && (
                          <Col xs={4}>
                            <Link
                              to={`/products/${baseurl}/related-news`}
                              state={{ news }}
                            >
                              <Button className='product-detail-funtion-btn'>
                                相关新闻
                              </Button>
                            </Link>
                          </Col>
                        )}
                        {event.length > 0 && (
                          <Col xs={4}>
                            <Link
                              to={`/products/${baseurl}/related-event`}
                              state={{ event }}
                            >
                              <Button className='product-detail-funtion-btn'>
                                相关活动
                              </Button>
                            </Link>
                          </Col>
                        )}
                      </Row>
                    </Row>
                  </>
                  
                )}


              </Container>
            </Col>
          </Row>
          <br/>


          {videos.length > 0 ? (
            <div className="slide-section">
              <h4>相关视频</h4>
              <br/>
              <div>
                {videos.map((video, index) => (
                  <div key={index}>
                    <div
                      className="product-video"
                      style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}
                      dangerouslySetInnerHTML={{
                        __html: video.videoEmbed.replace(
                          '<iframe ',
                          '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allow="autoplay;encrypted-media;fullscreen;picture-in-picture" '
                        ),
                      }}
                    />
                    <br />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <></>
          )}


          {relatedProducts.length > 0 ? (
            <div className="home-product-carousel-container">
              <h4>相关产品</h4>
              <br/>
            <Row>
              {relatedProducts.map((product) => {
                const Name = language === "zh" ? product.Name_zh : product.Name_en;
                return (
                  <Col md={6} xs={12} key={product.id}>
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
          ) : (
            <></>
          )}

          {slides !== "N/A" ? (
            <div className="slide-section">
              <h4>图文详情</h4>
              <br/>
              <Container>
                <ReactMarkdown>{slides}</ReactMarkdown>
              </Container>
            </div>
          ) : (
            <></>
          )}
          
        </Container>
      </section>
    </div>
  );
};

export default ProductDetail;