/* eslint-disable no-unused-vars */
import axios from "axios";
import React, { useContext, useEffect, useState, useMemo } from "react";
import { useMediaQuery } from "react-responsive";
import {
  Button,
  Col,
  Container,
  Image,
  Modal,
  Row,
  Spinner,
  Tabs,
  Tab,
  Accordion
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import rehypeRaw from 'rehype-raw';
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { AuthContext } from "../context/AuthContext";
import "../css/ProductDetail.css";
import PayPalButton from "./PayPalButton.jsx";
import WechatShare from './WechatShare.jsx';
import JoinUsButton from './JoinUsButton';
import PartnerList from './PartnerList';


const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const ProductDetail = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const [name, setRecentSlug] = useState(null);
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState(null);
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

  const ProductGallery = ({ product }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [videoThumbnails, setVideoThumbnails] = useState([]);
  
    // 主图 URL
    const mainImage = useMemo(
      () =>
        product?.ProductImage
          ? `${BACKEND_HOST}${product.ProductImage.url}`
          : 'https://placehold.co/650x650',
      [product]
    );
  
    // 子图 URL 列表
    const subImages = useMemo(
      () =>
        Array.isArray(product?.SubImages)
          ? product.SubImages.map(img => `${BACKEND_HOST}${img.url}`)
          : [],
      [product]
    );
  
    // 视频数据：embed HTML + 缩略图
    const videos = useMemo(
      () =>
        Array.isArray(product?.videos?.data)
          ? product.videos.data.map(v => ({
              embedHtml: v.videoEmbed,
              thumbnail: v.pic,
            }))
          : [],
      [product]
    );
  
    // 视频缩略图列表
    useEffect(() => {
      setVideoThumbnails(videos.map(v => v.thumbnail || 'https://placehold.co/650x400'));
    }, [videos]);
  
    // 合并所有媒体（图片 + 视频缩略图）
    const allMedia = useMemo(
      () => [mainImage, ...subImages, ...videoThumbnails],
      [mainImage, subImages, videoThumbnails]
    );
  
    // 视频起始索引和判断
    const videoStart = 1 + subImages.length;
    const isVideoIndex = idx => idx >= videoStart;
  
    // 构建 Lightbox slides
    const slides = useMemo(
      () =>
        allMedia.map((_, idx) =>
          isVideoIndex(idx)
            ? { html: videos[idx - videoStart].embedHtml }
            : { src: allMedia[idx] }
        ),
      [allMedia, videos]
    );
  
    // 缩略图点击：打开对应媒体
    const handleThumbnailClick = idx => {
      setCurrentIndex(idx);
      setLightboxOpen(true);
    };
  
    // 切换媒体
    const prevMedia = () =>
      setCurrentIndex(i => (i === 0 ? allMedia.length - 1 : i - 1));
    const nextMedia = () =>
      setCurrentIndex(i => (i + 1) % allMedia.length);
  
    return (
      <Container className="product-gallery">
        {/* 主展示区 & 切换按钮 */}
        <div className="main-image-container">
          <button className="prev-button" onClick={prevMedia}>❮</button>
  
          {isVideoIndex(currentIndex) ? (
            <div
              className="product-video"
              style={{ position: 'relative', width: '100%', paddingTop: '56.25%' }}
              dangerouslySetInnerHTML={{
                __html: videos[currentIndex - videoStart].embedHtml.replace(
                  '<iframe ',
                  '<iframe style="position:absolute;top:0;left:0;width:100%;height:100%;border:none;" allow="autoplay;encrypted-media;fullscreen;picture-in-picture" '
                ),
              }}
            />
          ) : (
            <Image
              src={allMedia[currentIndex]}
              alt={`Media ${currentIndex}`}
              className="product-img"
              onClick={() => setLightboxOpen(true)}
            />
          )}
  
          <button className="next-button" onClick={nextMedia}>❯</button>
        </div>
  
        {/* 缩略图列表（最多11项 + 占位符） */}
        <div className="thumbnail-container">
          {allMedia.slice(1, 8).map((src, idx) => (
            <div
              key={idx}
              className={`thumb-container ${idx === currentIndex ? 'active-thumb' : ''}`}
              onClick={() => handleThumbnailClick(idx+1)}
            >
              <Image src={src} alt={`Thumbnail ${idx}`} className="thumb-img" />
              {isVideoIndex(idx)}
            </div>
          ))}
          {allMedia.length > 8 && (
            <div
              className="thumb-container placeholder-thumb"
              onClick={() => handleThumbnailClick(8)}
            >
              <div className="thumb-overlay">+{allMedia.length - 8}</div>
            </div>
          )}
        </div>
  
        {/* 全屏 Lightbox */}
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          slides={slides}
          index={currentIndex}
          render={{
            slide: ({ slide }) =>
              slide.html ? (
                <div
                  dangerouslySetInnerHTML={{ __html: slide.html }}
                />
              ) : undefined,
          }}
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

const getPartnerLabel = () => {
  const productUrl = baseurl.split('/')[0] || "";

  return {
    "roseneath-holidaypark": "旅游中介",
    "nail-train": "加盟商",
    "Studyfin": "留学中介",
  }[productUrl] || "合作伙伴";
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
  console.log("short",ShortDetail)

  const Detail = language === "zh" ? product.Detail_zh : product.Detail_en;

  const Description = language === "zh" ? product.Description_zh : product.Description_en;

  const Note = language === "zh" ? product.Note_zh : product.Note_en;

  const slides = language === "zh" ? product.slides_zh || "N/A": product.slides_en || "N/A";
  const spots = language === "zh" ? product.spots_zh || "N/A": product.spots_en || "N/A";
  const shareLink = window.location.href;
  console.log("This is product.ProductImage's parent");
  console.log(product);
  const shareImg = product.ProductImage
    ? (product.ProductImage.formats
      ? `${BACKEND_HOST}${product.ProductImage.formats.thumbnail.url}` 
      : `${BACKEND_HOST}${product.ProductImage.url}`)
    : `${BACKEND_HOST}/default-share.jpg`;
  console.log(shareImg)
  const DetailHeading = (product?.brand?.MainProduct_url===name)?"品牌简介":"产品简介"
  const SpotsHeading = language === "zh" ? "附近的景点" : "Nearby Spots";
  // console.log(shareLink)
  // console.log(Name)
  // console.log(Description)

  // console.log("info", subItemCategory);
  // console.log("product", product);
  // console.log("slide", slides);

  // console.log(productTag)

  console.log("当前产品名称为：", Name);

  return (
    <div>
      <section>
        <WechatShare
          title={Name}
          desc={Description}
          link={shareLink}
          imgUrl={shareImg}
        />
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
                        <Col xs={4}>
                          <Link to={`/products/${baseurl.split('/')[0]}/PartnerDetail`}>
                            <Button className='product-detail-funtion-btn'>
                              {getPartnerLabel()}
                            </Button>
                          </Link>
                        </Col>
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
                      {/* 合作伙伴按钮（根据当前产品名动态命名） */}
                      {/* <Col xs={4}>
                        <Link to={`/products/${baseurl}/PartnerDetail`}>
                          <Button className='product-detail-funtion-btn'>                           
                            {
                              {
                                Studyfin: "留学中介",
                                "罗塞尼斯半岛度假村": "旅游中介",
                                "AI美甲": "加盟商",
                              }[Name] || "合作伙伴"
                            }
                          </Button>
                        </Link>
                      </Col> */}
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

                  {/* <Row>
                    <button
                      onClick={handleShare}
                      className='social-sharing__link'
                      title='分享'
                    >
                      <i className='icon-share'>
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
                    </button>
                  </Row> */}

                </>
              ) : (
                <></>
              )}

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
                        // 如果 Note 存在，显示原来的按钮和弹窗
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
                        // 如果 Note 为空，显示 PayPal 按钮
                        <PayPalButton
                          amount={parseFloat(Price_Display.toString().replace(/,/g, ""))}
                          currency="AUD"
                          description={Name} // 动态传递商品名称
                        />
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
                        <Col xs={4}>
                          <Link to={`/products/${baseurl.split('/')[0]}/PartnerDetail`}>
                            <Button className='product-detail-funtion-btn'>
                              {getPartnerLabel()}
                            </Button>
                          </Link>
                        </Col>
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

                    {/* <Row>
                      <button
                        onClick={handleShare}
                        className='social-sharing__link'
                        title='分享'
                      >
                        <i className='icon-share'>
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
                      </button>
                    </Row> */}
                  </>
                  
                )}


              </Container>
            </Col>
          </Row>

          {/* <Row>
            <Col>
              <PartnerList currentProductName={Name}/>
            </Col>
          </Row> */}

          {/* <Link to={`/products/${encodeURIComponent(Name)}/PartnerApplicationForm`}>
            <JoinUsButton />
          </Link> */}

          {slides !== "N/A" ? (
            <div className="slide-section">
              <Container>
                <h4>图文详情</h4>
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
