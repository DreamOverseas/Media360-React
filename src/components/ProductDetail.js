import axios from "axios";
import moment from "moment-timezone";
import React, { useContext, useEffect, useState, useMemo } from "react";
import {
  Accordion,
  Button,
  Card,
  Col,
  Container,
  Image,
  Row,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { Link, useLocation, useNavigate } from "react-router-dom";
import rehypeRaw from "rehype-raw";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { AuthContext } from "../context/AuthContext";
import "../css/ProductDetail.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const ProductDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const [people, setPeople] = useState(null);
  const [videos, setVideo] = useState([]);
  const [news, setNews] = useState([]);
  const [productTag, setProductTag] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartModal, setCartModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [founder, setFounder] = useState([]);
  const [kol, setKol] = useState([]);
  const [spokesperson, setSpokesperson] = useState([]);

  const ProductGallery = ({ product }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [videoThumbnails, setVideoThumbnails] = useState([]);
    const [allMedia, setAllMedia] = useState([]);
  
    const mainImage = product?.ProductImage
      ? `${BACKEND_HOST}${product.ProductImage.url}`
      : "https://placehold.co/650x650";
  
    const subImages = product?.SubImages?.length
      ? product.SubImages.map(img => `${BACKEND_HOST}${img.url}`)
      : [];
  
    const videoIframes = Array.isArray(product?.videos?.data) ? product.videos.data : [];
  
    useEffect(() => {
      if (videoIframes.length > 0) {
        const thumbnails = videoIframes.map(video => video?.pic ?? "https://placehold.co/650x400");

        if (JSON.stringify(thumbnails) !== JSON.stringify(videoThumbnails)) {
          setVideoThumbnails(thumbnails);
        }
      } else {
        setVideoThumbnails([]);
      }
    }, [videoIframes]);
  
    useEffect(() => {
      setAllMedia([mainImage, ...subImages, ...videoThumbnails])
    }, [videoThumbnails]);
  
    const nextMedia = () => {
      setCurrentIndex(prevIndex => (prevIndex + 1) % allMedia.length);
    };
  
    const prevMedia = () => {
      setCurrentIndex(prevIndex =>
        prevIndex === 0 ? allMedia.length - 1 : prevIndex - 1
      );
    };
  
    return (
      <Container className="product-gallery">
        <div className="main-image-container">
          <button className="prev-button" onClick={prevMedia}>❮</button>
  
          {currentIndex >= subImages.length + 1 && videoIframes.length > 0 ? (
            <div
              className="product-video"
              dangerouslySetInnerHTML={{
                __html: videoIframes[currentIndex - (subImages.length + 1)]?.videoEmbed || ""
              }}
            />
          ) : (
            <Image
              src={allMedia[currentIndex]}
              alt={`Product Media ${currentIndex}`}
              className="product-img"
              onClick={() => setLightboxOpen(true)}
            />
          )}
  
          <button className="next-button" onClick={nextMedia}>❯</button>
        </div>
  
        <div className="thumbnail-container">
          {allMedia.map((media, index) => (
            <div
              key={index}
              className={`thumb-container ${index === currentIndex ? "active-thumb" : ""}`}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={media}
                alt={`Thumbnail ${index}`}
                className="thumb-img"
              />
            </div>
          ))}
        </div>
  
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={allMedia.map((media, index) => ({
            src: media,
            html: index >= subImages.length + 1 && videoIframes.length > 0
              ? videoIframes[index - (subImages.length + 1)]?.videoEmbed
              : undefined
          }))}
          index={currentIndex}
        />
      </Container>
    );
  };

  // const DynamicTabs = ({ tabId, data }) => {
  //   const [activeTab, setActiveTab] = useState(
  //     data.length > 0 ? data[0].id : null
  //   );

  //   useEffect(() => {
  //     if (data.length > 0) {
  //       setActiveTab(data[0].id);
  //     }
  //   }, [data]);

  //   return (
  //     <Container>
  //       <Tabs
  //         id={`tabs-${tabId}`}
  //         activeKey={activeTab}
  //         onSelect={k => setActiveTab(k)}
  //         className='mb-3'
  //       >
  //         {data.map(item => (
  //           <Tab eventKey={item.id} title={item.Name_zh} key={item.id}>
  //             <Row className='person-detail'>
  //               <Col md={4}>
  //                 <Image
  //                   src={`${BACKEND_HOST}${item.Image[0].url}`}
  //                   alt={item.Name}
  //                   fluid
  //                 />
  //               </Col>
  //               <Col md={8}>
  //                 <p>{item.Name_zh}</p>
  //                 {item.Bio_zh ? (
  //                   <ReactMarkdown rehypePlugins={[rehypeRaw]}>
  //                     {item.Bio_zh}
  //                   </ReactMarkdown>
  //                 ) : (
  //                   <div
  //                     className='ck-content'
  //                     dangerouslySetInnerHTML={{ __html: item.Bio_zh }}
  //                   />
  //                 )}
  //                 <Link
  //                   to={`/person/${item.internal_url}`}
  //                   className='person-related-btn'
  //                 >
  //                   查看更多
  //                 </Link>
  //                 <Link to={`/`} className='person-related-btn'>
  //                   更新信息
  //                 </Link>
  //               </Col>
  //             </Row>
  //           </Tab>
  //         ))}
  //       </Tabs>
  //     </Container>
  //   );
  // };

  // const DescriptionAccordion = ({ id, accordion_name, content }) => {
  //   const [activeAccordion, setActiveAccordion] = useState(null);
  //   const toggleAccordion = () => {
  //     setActiveAccordion(activeAccordion === id ? null : id);
  //   };

  //   return (
  //     <Accordion
  //       activeKey={activeAccordion === id ? "0" : null}
  //       className='shopify-accordion'
  //     >
  //       <Accordion.Item eventKey='0'>
  //         <div className='shopify-accordion-header' onClick={toggleAccordion}>
  //           {accordion_name}
  //           {/* <span className={`accordion-icon ${activeAccordion === id ? "open" : ""}`}>&#9662;</span> */}
  //         </div>
  //         <Accordion.Body className='shopify-accordion-body'>
  //           {content ? (
  //             <div className='markdown-content'>
  //               <ReactMarkdown rehypePlugins={[rehypeRaw]}>
  //                 {content}
  //               </ReactMarkdown>
  //             </div>
  //           ) : (
  //             <div
  //               className='ck-content'
  //               dangerouslySetInnerHTML={{ __html: Detail }}
  //             />
  //           )}
  //         </Accordion.Body>
  //       </Accordion.Item>
  //     </Accordion>
  //   );
  // };

  // const FounderAccordion = ({ id, accordion_name, content }) => {
  //   const [activeAccordion, setActiveAccordion] = useState(null);
  //   const toggleAccordion = () => {
  //     setActiveAccordion(activeAccordion === id ? null : id);
  //   };

  //   return (
  //     <Accordion
  //       activeKey={activeAccordion === id ? "0" : null}
  //       className='shopify-accordion'
  //     >
  //       <Accordion.Item eventKey='0'>
  //         <div className='shopify-accordion-header' onClick={toggleAccordion}>
  //           {accordion_name}
  //           {/* <span className={`accordion-icon ${activeAccordion === id ? "open" : ""}`}>&#9662;</span> */}
  //         </div>
  //         <Accordion.Body className='shopify-accordion-body'>
  //           <DynamicTabs tabId='group1' data={content} />
  //         </Accordion.Body>
  //       </Accordion.Item>
  //     </Accordion>
  //   );
  // };

  // const KolAccordion = ({ id, accordion_name, content }) => {
  //   const [activeAccordion, setActiveAccordion] = useState(null);
  //   const toggleAccordion = () => {
  //     setActiveAccordion(activeAccordion === id ? null : id);
  //   };

  //   return (
  //     <Accordion
  //       activeKey={activeAccordion === id ? "0" : null}
  //       className='shopify-accordion'
  //     >
  //       <Accordion.Item eventKey='0'>
  //         <div className='shopify-accordion-header' onClick={toggleAccordion}>
  //           {accordion_name}
  //           {/* <span className={`accordion-icon ${activeAccordion === id ? "open" : ""}`}>&#9662;</span> */}
  //         </div>
  //         <Accordion.Body className='shopify-accordion-body'>
  //           <DynamicTabs tabId='group2' data={content} />
  //         </Accordion.Body>
  //       </Accordion.Item>
  //     </Accordion>
  //   );
  // };

  // const SpokesAccordion = ({ id, accordion_name, content }) => {
  //   const [activeAccordion, setActiveAccordion] = useState(null);
  //   const toggleAccordion = () => {
  //     setActiveAccordion(activeAccordion === id ? null : id);
  //   };

  //   return (
  //     <Accordion
  //       activeKey={activeAccordion === id ? "0" : null}
  //       className='shopify-accordion'
  //     >
  //       <Accordion.Item eventKey='0'>
  //         <div className='shopify-accordion-header' onClick={toggleAccordion}>
  //           {accordion_name}
  //           {/* <span className={`accordion-icon ${activeAccordion === id ? "open" : ""}`}>&#9662;</span> */}
  //         </div>
  //         <Accordion.Body className='shopify-accordion-body'>
  //           <DynamicTabs tabId='group3' data={content} />
  //         </Accordion.Body>
  //       </Accordion.Item>
  //     </Accordion>
  //   );
  // };

  // const VideoCarousel = ({ videos }) => {
  //   const [currentIndex, setCurrentIndex] = useState(0);

  //   // 切换到上一个视频
  //   const prevVideo = () => {
  //     setCurrentIndex(prevIndex =>
  //       prevIndex === 0 ? videos.length - 1 : prevIndex - 1
  //     );
  //   };

  //   // 切换到下一个视频
  //   const nextVideo = () => {
  //     setCurrentIndex(prevIndex =>
  //       prevIndex === videos.length - 1 ? 0 : prevIndex + 1
  //     );
  //   };

  //   return (
  //     <Container className='video-wrapper'>
  //       <Button
  //         variant='dark'
  //         className='video-prev-button'
  //         onClick={prevVideo}
  //       >
  //         &#10094;
  //       </Button>

  //       <div className='product-video-container'>
  //         <div
  //           dangerouslySetInnerHTML={{
  //             __html: videos[currentIndex].videoEmbed,
  //           }}
  //         />
  //       </div>

  //       <Button
  //         variant='dark'
  //         className='video-next-button'
  //         onClick={nextVideo}
  //       >
  //         &#10095;
  //       </Button>
  //     </Container>
  //   );
  // };

  // const handleLoginModalOpen = () => {
  //   setShowLoginModal(true);
  //   setCartModal(false);
  // };

  // const handleLoginModalClose = () => setShowLoginModal(false);

  // const handleCloseCartModal = () => setCartModal(false);

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

  // const handleAddToCart = async () => {
  //   if (user && Cookies.get("token")) {
  //     try {
  //       const user_detail = await axios.get(`${BACKEND_HOST}/api/users/${user.id}?populate[cart]=*`);
  //       const cartid = user_detail.data.cart.id;
  //       const cart_items = await axios.get(`${BACKEND_HOST}/api/carts/${cartid}?populate[cart_items][populate][product]=*`);
  //       const cart_items_data = cart_items.data.cart_items;

  //       const existingItem = cart_items_data.find(item => item.product.id === product.id);

  //       if (existingItem) {
  //         await axios.put(
  //           `${BACKEND_HOST}/api/cart-items/${existingItem.id}`,
  //           { data: { Number: existingItem.attributes.Number + quantity } },
  //           { headers: { Authorization: `Bearer ${Cookies.get("token")}`, "Content-Type": "application/json" } }
  //         );
  //       } else {
  //         await axios.post(
  //           `${BACKEND_HOST}/api/cart-items`,
  //           { data: { Number: quantity, product: product.id } },
  //           { headers: { Authorization: `Bearer ${Cookies.get("token")}`, "Content-Type": "application/json" } }
  //         );
  //       }

  //       console.log("Item added to cart successfully.");
  //     } catch (error) {
  //       console.error("Failed to add to cart:", error);
  //     }
  //   } else {
  //     setCartModal(true);
  //   }
  // };

  // const handlePurchase = () => {
  //   setShowModal(true);
  // };

  // const handleCloseModal = () => {
  //   setShowModal(false);
  // };

  const fetchData = async (path, setProduct, setPeople, setError, t) => {
    try {
      const [productResponse, peopleResponse, newsResponse] = await Promise.all(
        [
          axios.get(
            `${BACKEND_HOST}/api/products/?filters[url]=${path}&populate=*`
          ),
          axios.get(
            `${BACKEND_HOST}/api/products/?filters[url]=${path}&populate[people][populate]=Image`
          ),
          axios.get(
            `${BACKEND_HOST}/api/products/?filters[url]=${path}&populate[news][populate]=Image`
          ),
        ]
      );

      const productData = productResponse.data?.data?.[0] || null;
      if (!productData) {
        setError(t("noProductFound"));
        return;
      }
      setProduct(productData);
      // console.log(productData)

      const peopleData = peopleResponse.data?.data?.[0]?.people;
      setPeople(peopleData);
      // console.log(peopleData)

      const relatedData = productResponse.data?.data?.[0]?.product_tags;

      if (relatedData) {
        setProductTag(relatedData.map(tag => tag.Tag_en));
      }

      const videoEmbed = productResponse.data?.data?.[0]?.videos?.data || [];
      setVideo(videoEmbed);
      const newsList = newsResponse.data?.data?.[0]?.news || [];
      console.log(newsResponse);
      setNews(newsList);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(t("errorFetchingProductData"));
    }
  };

  useEffect(() => {
    const path = location.pathname.replace("/product/", "");
    fetchData(path, setProduct, setPeople, setError, t);
  }, [location.pathname]);

  useEffect(() => {
    console.log("🚀 people 数据更新:", people);

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
          person.Role.roles.includes("Spokesperson")
      );

      // console.log("🔍 筛选出的 Founder:", founders);
      // console.log("🔍 筛选出的 Kol:", kols);
      // console.log("🔍 筛选出的 Spokesperson:", spokespersons);

      setFounder(founders);
      setKol(kols);
      setSpokesperson(spokespersons);
    } else {
      setFounder([]);
      setKol([]);
      setSpokesperson([]);
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
      title: "页面分享",
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

  if (!product) {
    return (
      <div className='loading-container'>
        <Spinner animation='border' role='status'>
          <span className='sr-only'>{t("loading")}</span>
        </Spinner>
      </div>
    );
  }

  const { Price, ProductImage, Available, Sponsor } = product;
  const language = i18n.language;

  const display_price = Price === 0 ? t("price_tbd") : `AU$${Price}`;
  const Name = language === "zh" ? product.Name_zh : product.Name_en;

  const Detail = language === "zh" ? product.Detail_zh : product.Detail_en;

  return (
    <div>
      <section>
        <Container>
          <Row className='product-detail-section'>
            <Col className='product-image-col'>
              <ProductGallery product={product} />
            </Col>

            <Col className='product-detail-col'>
              <Container className='product-detail'>
                <Row>
                  <h1>{Name}</h1>
                  <h4>{display_price}</h4>
                </Row>

                <Row className='product-price-quantity d-flex align-items-center'>
                  <Col md={4}>
                    <div className='quantity-control'>
                      <Button
                        className='quantity-btn'
                        onClick={handleDecrement}
                      >
                        -
                      </Button>
                      <div className='quantity-text'>{quantity}</div>
                      <Button
                        className='quantity-btn'
                        onClick={handleIncrement}
                      >
                        +
                      </Button>
                    </div>
                  </Col>

                  <Col md={8} className='d-flex justify-content-center'>
                    <Button className='add-to-cart-btn'>即刻咨询并购买</Button>
                  </Col>
                </Row>

                <Row>
                  <a
                    href='#'
                    onClick={handleShare}
                    className='social-sharing__link'
                    title='分享'
                  >
                    <i class='icon-share'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        viewBox='0 0 576 576'
                        width='20'
                        height='20'
                      >
                        <path d='M400 255.4l0-15.4 0-32c0-8.8-7.2-16-16-16l-32 0-16 0-46.5 0c-50.9 0-93.9 33.5-108.3 79.6c-3.3-9.4-5.2-19.8-5.2-31.6c0-61.9 50.1-112 112-112l48 0 16 0 32 0c8.8 0 16-7.2 16-16l0-32 0-15.4L506 160 400 255.4zM336 240l16 0 0 48c0 17.7 14.3 32 32 32l3.7 0c7.9 0 15.5-2.9 21.4-8.2l139-125.1c7.6-6.8 11.9-16.5 11.9-26.7s-4.3-19.9-11.9-26.7L409.9 8.9C403.5 3.2 395.3 0 386.7 0C367.5 0 352 15.5 352 34.7L352 80l-16 0-32 0-16 0c-88.4 0-160 71.6-160 160c0 60.4 34.6 99.1 63.9 120.9c5.9 4.4 11.5 8.1 16.7 11.2c4.4 2.7 8.5 4.9 11.9 6.6c3.4 1.7 6.2 3 8.2 3.9c2.2 1 4.6 1.4 7.1 1.4l2.5 0c9.8 0 17.8-8 17.8-17.8c0-7.8-5.3-14.7-11.6-19.5c0 0 0 0 0 0c-.4-.3-.7-.5-1.1-.8c-1.7-1.1-3.4-2.5-5-4.1c-.8-.8-1.7-1.6-2.5-2.6s-1.6-1.9-2.4-2.9c-1.8-2.5-3.5-5.3-5-8.5c-2.6-6-4.3-13.3-4.3-22.4c0-36.1 29.3-65.5 65.5-65.5l14.5 0 32 0zM72 32C32.2 32 0 64.2 0 104L0 440c0 39.8 32.2 72 72 72l336 0c39.8 0 72-32.2 72-72l0-64c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 64c0 13.3-10.7 24-24 24L72 464c-13.3 0-24-10.7-24-24l0-336c0-13.3 10.7-24 24-24l64 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L72 32z' />
                      </svg>
                    </i>
                    <span className='share-title'>分享此产品</span>
                  </a>
                </Row>

                <Row>
                  <h4>查看相关产品以及相关人物</h4>
                  <Row>
                    <Col xs={4}>
                      <Link to={`/product/${product.url}/related-product`} state={{ product }}>
                        <Button variant="primary" className="related-btn">相关产品</Button>
                      </Link>
                    </Col>
                    <Col xs={4}>
                      <Button variant="primary" className="related-btn">按钮2</Button>
                    </Col>
                    <Col xs={4}>
                      <Button variant="primary" className="related-btn">按钮3</Button>
                    </Col>
                  </Row>
                </Row>

                <Row>
                  <h4>查看相关产品及新闻</h4>
                  <Row>
                    <Col xs={4}>
                      <Button variant="primary" className="related-btn">按钮1</Button>
                    </Col>
                    <Col xs={4}>
                      <Button variant="primary" className="related-btn">按钮2</Button>
                    </Col>
                  </Row>
                  
                </Row>

                

                <Row>
                  <h4>产品描述</h4>
                  {Detail ? (
                    <div className="detail-container">
                      <ReactMarkdown rehypePlugins={[rehypeRaw]}>
                        {Detail}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="detail-container">暂无产品信息</div>
                  )}

                </Row>

                <Row>
                  <h4>产品信息有误？</h4>
                  <Button variant="primary" className="related-btn">按钮2</Button>
                </Row>
                {/* <Row>
                  {(Price !== 0 || 1) && Available ? (
                    <>
                      <Col>
                        <Button className='add-to-cart' onClick={handlePurchase}>{t("enquireNow")}</Button>
                      </Col>
                      <Col>
                        <Button className='add-to-cart' onClick={handleAddToCart}>{t("addToCart")}</Button>
                      </Col>
                    </>
                  ) : (
                    <Button className='add-to-cart' onClick={handlePurchase}>{t("enquireNow")}</Button>
                  )}
                </Row> */}
                
              </Container>
            </Col>
          </Row>
        </Container>

        {/* {videos.length !== 0 && (
          <Container>
            <h1>相关视频</h1>
            <VideoCarousel videos={videos} />
          </Container>
        )} */}

        {/* <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{Name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {Sponsor ? (
              <div>
                <Row>
                  <h5>{t("productWebsite")}</h5>
                  <Link to={`/sponsor/${product.url}`}>www.do360.com/sponsor/{product.url}</Link>
                </Row>
              </div>
            ) : (
              <div>
                <Row><p>{t("contactKol")}</p></Row>
                <Row className='purchase-modal-background'>
                  <Image src='/QR_JohnDu.png' alt='Logo' fluid />
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseModal}>{t("close")}</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={cartModal} onHide={handleCloseCartModal}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Row><p>{t("loginAlert")}</p></Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleLoginModalOpen}>{t("logIn")}</Button>
            <Button variant='secondary' onClick={handleCloseCartModal}>{t("cancel")}</Button>
          </Modal.Footer>
        </Modal>

        <LoginModal show={showLoginModal} handleClose={handleLoginModalClose} /> */}
      </section>
      <br />
      <br />
      {/* <section>
        <Container>
          <h1>相关产品及服务</h1>
          {relatedProduct ? (
            <RelatedProduct
              related_product={relatedProduct}
              language={language}
            />
          ) : (
            <p>暂无推荐</p>
          )}
        </Container>
      </section>

      <section>
        {news.length > 0 && (
          <Container className='news-container'>
            <Row>
              <h1>相关新闻</h1>
            </Row>
            <Row className='justify-content-start'>
              {news.map(newsItem => {
                const language = i18n.language;
                const newsTitle =
                  language === "zh"
                    ? newsItem.Title_zh || "未知新闻"
                    : newsItem.Title_en || "Unknown News";
                const newsContent = newsItem.Description_zh || "暂无内容";
                const newsUrl = `/news/${newsItem.url}`;

                return (
                  <Col key={newsItem.id} xs={12} sm={6} md={4}>
                    <Link to={newsUrl} className='card-link-NewsPage'>
                      <Card className='newspage-news-card d-flex flex-column'>
                        {newsItem.Image && newsItem.Image.length > 0 ? (
                          <Card.Img
                            src={`${BACKEND_HOST}${newsItem.Image[0].url}`}
                            alt={newsTitle}
                            className='newspage-news-card-img'
                          />
                        ) : (
                          <Card.Img
                            src='https://placehold.co/300x200'
                            alt='Placeholder'
                            className='newspage-news-card-img'
                          />
                        )}
                        <Card.Body className='text-center d-flex flex-column justify-content-between'>
                          <Card.Title className='newspage-news-card-title'>
                            {newsTitle}
                          </Card.Title>
                          <Card.Text className='newspage-news-card-date'>
                            {formatDateTime(newsItem.Published_time)}
                          </Card.Text>
                          <Card.Text className='newspage-news-card-content'>
                            {newsContent}
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </Link>
                  </Col>
                );
              })}
            </Row>
          </Container>
        )}
      </section> */}
    </div>
  );
};

export default ProductDetail;
