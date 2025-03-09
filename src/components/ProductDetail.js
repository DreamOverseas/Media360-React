import axios from "axios";
import moment from "moment-timezone";
import React, { useContext, useEffect, useState} from "react";
import {Button, Col, Container, Image, Row, Spinner, Modal} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { Link, useLocation} from "react-router-dom";
import rehypeRaw from "rehype-raw";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { AuthContext } from "../context/AuthContext";
import "../css/ProductDetail.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const ProductDetail = () => {
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
  const [showModal, setShowModal] = useState(false);
  
  // const [showLoginModal, setShowLoginModal] = useState(false);
  const [founder, setFounder] = useState([]);
  const [kol, setKol] = useState([]);
  const [spokesperson, setSpokesperson] = useState([]);
  const [brand, setBrand] = useState(null);
  const [variants, setVariants] = useState([]);

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


  const ConsultationModal = ({ show, handleClose }) => {
    return (
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>咨询与购买</Modal.Title>
        </Modal.Header>
        <Modal.Body className="custom-modal-body" dangerouslySetInnerHTML={{ __html: Note }}>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
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
      const [productResponse, peopleResponse, newsResponse, brandResponse] = await Promise.all(
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
          axios.get(
            `${BACKEND_HOST}/api/products/?filters[url]=${path}&populate[brand][populate]=logo`
          )
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
        setProductTag(relatedData);
      }

      const videoEmbed = productResponse.data?.data?.[0]?.videos?.data || [];
      setVideo(videoEmbed);
      const newsList = newsResponse.data?.data?.[0]?.news || [];
      const brandinfo = brandResponse.data?.data?.[0]?.brand || null;
      setBrand(brandinfo)
      
      console.log("news",newsList);
      setNews(newsList);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(t("errorFetchingProductData"));
    }
  };

  useEffect(() => {
    const path = location.pathname.replace("/products/", "");
    fetchData(path, setProduct, setPeople, setError, t);
  }, [location.pathname]);

  useEffect(() => {
    if (!brand || !brand.internal_url) return;

    axios.get("https://api.do360.com/api/brands/", {
      params: {
        "filters[internal_url][$eq]": `${brand.internal_url}`,
        "populate[products][fields]": "url,Name_zh,Name_en"
      }
    })
    .then(response => {
      const variants = response.data.data[0]?.products
      console.log("variants",variants);
      setVariants(variants)
    })
    .catch(error => console.error("Error fetching product URLs and names:", error));
  }, [brand?.internal_url]);


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

  const Note = language === "zh" ? product.Note_zh : product.Note_en;

  // console.log(productTag)

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
                  {/* <Row className="d-md-none">
                    {productTag && productTag.length > 0 ? (
                      productTag.map((tag, index) => {
                        const Name = language === "zh" ? tag.Tag_zh : tag.Tag_en;
                        return (
                          <Col xs={4} sm={3} md={3} key={index} className="tag-col">
                            <button className="tag-label">{Name}</button>
                          </Col>
                        );
                      })
                    ) : null}
                  </Row> */}

                  {variants ? (
                    variants.map((variant, index) => {
                      const currentPath = location.pathname; // 获取当前路径
                      const isActive = currentPath === `/products/${variant.url}`; // 正确匹配当前路径

                      return (
                        <Col xs={4} key={index}>
                          <Link to={`/products/${variant.url}`}>
                            <Button
                              className={`product-details-variant-btn ${isActive ? "active-btn" : ""}`}
                            >
                              {language === "zh" ? variant.Name_zh : variant.Name_en}
                            </Button>
                          </Link>
                        </Col>
                      );
                    })
                  ) : (
                    <></>
                  )}
                  <h2>{display_price}</h2>
                </Row>
                

                <Row className='product-price-quantity d-flex align-items-center amount-price-cart-bar'>
                  {/* <Col md={4} className="amount-price-bar">
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
                  </Col> */}

                  <Col md={8} className='d-flex justify-content-center'>
                    <Button className='add-to-cart-btn' onClick={() => setShowModal(true)}>即刻咨询并购买</Button>
                  </Col>

                  {/* 弹窗组件 */}
                  <ConsultationModal show={showModal} handleClose={() => setShowModal(false)} />
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
                  <h4>查看相关人物</h4>
                  <Row>
                    {founder.length > 0 && (
                      <Col xs={4}>
                        <Link to={`/products/${product.url}/related-founder`} state={{ founder }}>
                          <Button className="product-detail-funtion-btn">品牌创始人</Button>
                        </Link>
                      </Col>
                    )}
                    {kol.length > 0 && (
                      <Col xs={4}>
                        <Link to={`/products/${product.url}/related-kol`} state={{ kol }}>
                          <Button className="product-detail-funtion-btn">产品意见领袖</Button>
                        </Link>
                      </Col>
                    )}
                    {spokesperson.length > 0 && (
                      <Col xs={4}>
                        <Link to={`/products/${product.url}/related-ambassador`} state={{ spokesperson }}>
                          <Button className="product-detail-funtion-btn">产品代言人</Button>
                        </Link>
                      </Col>
                    )}
                  </Row>
                </Row>

                <Row>
                  <h4>查看相关产品、新闻、品牌</h4>
                  <Row>
                    {product && (
                      <Col xs={4}>
                        <Link to={`/products/${product.url}/related-product`} state={{ product }}>
                          <Button className="product-detail-funtion-btn">相关产品</Button>
                        </Link>
                      </Col>
                    )}
                    {news && (
                      <Col xs={4}>
                        <Link to={`/products/${product.url}/related-news`} state={{ news }}>
                          <Button className="product-detail-funtion-btn">相关新闻</Button>
                        </Link>
                      </Col>
                    )}
                    {brand && (
                      <Col xs={4}>
                        <Link to={`/products/${product.url}/related-brand`} state={{ brand }}>
                          <Button className="product-detail-funtion-btn">相关品牌</Button>
                        </Link>
                      </Col>
                    )}
                  </Row>
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

                <Row className="d-flex justify-content-center">
                  <h2 style={{ textAlign: "center" }}>成为代言人、加入我们？</h2>
                  <Button className="update-function-btn" onClick={() => window.open("https://do360.com/pages/360media-files-upload-standard", "_blank")}>加入我们</Button>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default ProductDetail;
