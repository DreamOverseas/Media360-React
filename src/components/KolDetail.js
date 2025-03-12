import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "../css/KolDetail.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const KolDetail = () => {
  const { id: paramId } = useParams();
  const { t, i18n } = useTranslation();
  const [person, setPerson] = useState(null);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!paramId) {
      setError("No person ID provided");
      setLoading(false);
      return;
    }
  
    const fetchPersonData = async () => {
      try {
        console.log(`🔍 Fetching Person Data for: ${paramId}`);
  
        let response = await axios.get(
          `${BACKEND_HOST}/api/people?filters[internal_url][$eq]=${paramId}&populate=*`
        );
  
        if (!response.data?.data.length) {
          console.log(`❌ Internal URL failed, trying ID: ${paramId}`);
          response = await axios.get(
            `${BACKEND_HOST}/api/people?filters[id][$eq]=${paramId}&populate=*`
          );
        }
  
        if (response.data?.data.length > 0) {
          const personData = response.data.data[0];
          setPerson(personData);
          console.log("✅ Fetched Person Data:", personData);
  
          const brandIds = personData.brands?.map(brand => brand.id) || [];
          const productIds = personData.products?.map(product => product.id) || [];
          const newsIds = personData.news?.map(news => news.id) || [];
  
          // 并行请求品牌、产品和新闻数据
          const [brands, products, news] = await Promise.all([
            fetchItems("brands", brandIds),
            fetchItems("products", productIds),
            fetchItems("news", newsIds),
          ]);
  
          if (brands) setBrands(brands);
          if (products) setProducts(products);
          if (news) setNews(news);
        } else {
          setError("Person not found");
        }
      } catch (err) {
        console.error("❌ Error fetching person details:", err);
        setError("Error fetching person details");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPersonData();
  }, [paramId]);

  
  const fetchItems = async (type, ids) => {
    if (!ids.length) return [];
    try {
      console.log(`🔍 Fetching ${type} for IDs:`, ids);
  
      const responses = await Promise.all(
        ids.map(id =>
          axios.get(`${BACKEND_HOST}/api/${type}?filters[id][$eq]=${id}&populate=*`)
        )
      );
  
      const data = responses.flatMap(res => res.data.data);
      console.log(`✅ Fetched ${type}:`, data);
      return data;
    } catch (error) {
      console.error(`❌ Error fetching ${type}:`, error);
      return [];
    }
  };

  const PersonGallery = ({ person }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [videoThumbnails, setVideoThumbnails] = useState([]);
    const [allMedia, setAllMedia] = useState([]);
  
    const mainImage = person?.Image
      ? `${BACKEND_HOST}${person.Image[0].url}`
      : "https://placehold.co/650x650";
  
    const subImages = person?.SubImage?.length
      ? person.SubImage.map(img => `${BACKEND_HOST}${img.url}`)
      : [];
  
    const videoIframes = Array.isArray(person?.videos?.data) ? person.videos.data : [];
  
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
      <Container className="person-gallery">
        <div className="person-main-image-container">
          <button className="person-prev-button" onClick={prevMedia}>❮</button>
  
          {currentIndex >= subImages.length + 1 && videoIframes.length > 0 ? (
            <div
              className="person-video"
              dangerouslySetInnerHTML={{
                __html: videoIframes[currentIndex - (subImages.length + 1)]?.videoEmbed || ""
              }}
            />
          ) : (
            <Image
              src={allMedia[currentIndex]}
              alt={`Person Media ${currentIndex}`}
              className="person-img"
              onClick={() => setLightboxOpen(true)}
            />
          )}
  
          <button className="person-next-button" onClick={nextMedia}>❯</button>
        </div>
  
        <div className="person-thumbnail-container">
          {allMedia.map((media, index) => (
            <div
              key={index}
              className={`person-thumb-container ${index === currentIndex ? "active-thumb" : ""}`}
              onClick={() => setCurrentIndex(index)}
            >
              <Image
                src={media}
                alt={`Thumbnail ${index}`}
                className="person-thumb-img"
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

  if (loading) return <div className='loading'>{t("loading")}</div>;
  if (error) return <div className='error-message'>{error}</div>;
  if (!person) return <div className='error-message'>No Data Available</div>;
  const role = person.Role.roles[0];

  const language = i18n.language;
  const displayName =
    language === "zh" ? person.Name_zh || "未知" : person.Name_en || "Unknown";
  const displayTitle =
    language === "zh"
      ? person.Title_zh || "无头衔"
      : person.Title_en || "No Title";
  const displayBio =
    language === "zh"
      ? person.Bio_zh || "暂无简介"
      : person.Bio_en || "No biography available";
  const personImage = person.Image?.[0]?.url
    ? `${BACKEND_HOST}${person.Image[0].url}`
    : "https://placehold.co/280x280";

  return (
    <div className='kol-detail-page'>
      <Container>
        <Row className='kol-detail-section align-items-center'>
          <Col xs={12} md={5} className='text-center'>
            <PersonGallery person={person} />
          </Col>

          <Col xs={12} md={7} className='kol-info'>
            <h1>{displayName}</h1>
            <h5>{displayTitle}</h5>

            {role === "Founder"?(
              <div className='founder-contact'>
              <Button className='btn-outline-black'>{t("电话")}</Button>
              <Button className='btn-outline-black'>{t("邮箱")}</Button>
            </div>
            ):(<></>)
            }

            {role === "Kol"?(
              <div className='kol-contact'>
                <Button className='btn-outline-black'>{t("联系意见领袖")}</Button>
              </div>
              
              ):(<></>)
            }


            {role === "Ambassador"?(
              <div className='ambassador-contact'>
              {person.SocialMedia_zh && (
                <div>
                  <h4>社交媒体</h4>
                  <span dangerouslySetInnerHTML={{ __html: person.SocialMedia_zh }}></span>
                </div>
              )}
            </div>
              ):(<></>)
            }
            
          </Col>
        </Row>

        <div className='kol-intro'>
          <h3 className='kol-intro-title'>{t("人物简介")}</h3>
          <p dangerouslySetInnerHTML={{ __html: displayBio }}></p>
        </div>

        {person.showRelatedInfo && (
          <div className='kol-related-section'>
            <h3>{t("查看相关产品及新闻")}</h3>
            <div className='person-related-buttons'>
              {brands.length > 0 && (
                <Link
                  to={`/person/${paramId}/related-brand`}
                  className='btn-outline-black'
                  state={{ brands }}
                >
                  {t("相关品牌")}
                </Link>
              )}
              {products.length > 0 && (
                <Link
                  to={`/person/${paramId}/related-product`}
                  className='btn-outline-black'
                  state={{ products }}
                >
                  {t("相关产品")}
                </Link>
              )}
              {news.length > 0 && (
                <Link
                  to={`/person/${paramId}/related-news`}
                  className='btn-outline-black'
                  state={{ news }}
                >
                  {t("相关新闻")}
                </Link>
              )}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default KolDetail;
