import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import { Col, Container, Image, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import "../Css/PersonDetail.css";

const BACKEND_HOST = import.meta.env.VITE_CMS_ENDPOINT;

/* 图片/视频画廊组件 */
const PersonGallery = ({ person }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [videoThumbnails, setVideoThumbnails] = useState([]);
  const [allMedia, setAllMedia] = useState([]);

  const mainImage = person?.Image?.[0]?.url
    ? `${BACKEND_HOST}${person.Image[0].url}`
    : "https://placehold.co/650x650";

  const subImages = person?.SubImage?.length
    ? person.SubImage.map(img => `${BACKEND_HOST}${img.url}`)
    : [];

  const videoIframes = Array.isArray(person?.videos?.data)
    ? person.videos.data
    : [];

  useEffect(() => {
    if (videoIframes.length > 0) {
      const thumbnails = videoIframes.map(
        video => video?.pic ?? "https://placehold.co/650x400"
      );
      if (JSON.stringify(thumbnails) !== JSON.stringify(videoThumbnails)) {
        setVideoThumbnails(thumbnails);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoIframes]);

  useEffect(() => {
    setAllMedia([mainImage, ...subImages, ...videoThumbnails]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [videoThumbnails]);

  const nextMedia = () =>
    setCurrentIndex(prev => (prev + 1) % allMedia.length);
  const prevMedia = () =>
    setCurrentIndex(prev => (prev === 0 ? allMedia.length - 1 : prev - 1));

  return (
    <Container className="person-gallery">
      <div className="person-main-image-container">
        <button className="person-prev-button" onClick={prevMedia}>❮</button>

        {currentIndex >= subImages.length + 1 && videoIframes.length > 0 ? (
          <div
            className="person-video"
            style={{ width: "100%", height: "400px" }}
            dangerouslySetInnerHTML={{
              __html: videoIframes[currentIndex - (subImages.length + 1)]
                ?.videoEmbed?.replace(
                  "<iframe ",
                  "<iframe style='width:100%;height:100%;' "
                ) || "",
            }}
          />
        ) : (
          <Image
            src={allMedia[currentIndex] || mainImage}
            alt={`人物图片 ${currentIndex}`}
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
              alt={`缩略图 ${index}`}
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
          html:
            index >= subImages.length + 1 && videoIframes.length > 0
              ? videoIframes[index - (subImages.length + 1)]?.videoEmbed
              : undefined,
        }))}
        index={currentIndex}
      />
    </Container>
  );
};

/* 人物详情主页面 */
const PersonDetail = () => {
  const { id: paramId } = useParams();
  const { t, i18n } = useTranslation();
  const [person, setPerson] = useState(null);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchItems = async (type, ids) => {
    if (!ids.length) return [];
    try {
      const responses = await Promise.all(
        ids.map(id =>
          axios.get(`${BACKEND_HOST}/api/${type}?filters[id][$eq]=${id}&populate=*`)
        )
      );
      return responses.flatMap(res => res.data.data);
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (!paramId) {
      setError("未提供人物 ID");
      setLoading(false);
      return;
    }

    const fetchPerson = async () => {
      try {
        let res = await axios.get(
          `${BACKEND_HOST}/api/people?filters[internal_url][$eq]=${paramId}&populate=*`
        );
        if (!res.data?.data.length) {
          res = await axios.get(
            `${BACKEND_HOST}/api/people?filters[id][$eq]=${paramId}&populate=*`
          );
        }

        if (res.data?.data.length > 0) {
          const personData = res.data.data[0];
          setPerson(personData);

          const brandIds = personData.brands?.map(b => b.id) || [];
          const productIds = personData.products?.map(p => p.id) || [];
          const newsIds = personData.news?.map(n => n.id) || [];

          const [b, p, n] = await Promise.all([
            fetchItems("brands", brandIds),
            fetchItems("products", productIds),
            fetchItems("news", newsIds),
          ]);

          setBrands(b);
          setProducts(p);
          setNews(n);
        } else {
          setError("未找到该人物");
        }
      } catch {
        setError("获取人物信息失败");
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramId]);

  if (loading) return <div className="person-detail-loading">加载中...</div>;
  if (error) return <div className="person-detail-error">{error}</div>;
  if (!person) return <div className="person-detail-error">暂无数据</div>;

  const language = i18n.language;
  const displayName =
    language === "zh" ? person.Name_zh || "未知" : person.Name_en || "Unknown";
  const displayTitle =
    language === "zh" ? person.Title_zh || "无头衔" : person.Title_en || "No Title";
  const displayBio =
    language === "zh" ? person.Bio_zh || "暂无简介" : person.Bio_en || "No biography available";
  const socialMedia =
    language === "zh" ? person.SocialMedia_zh || "" : person.SocialMedia_en || "";

  const roles = person.Role?.roles || [];

  return (
    <div className="person-detail-page">
      <Container>
        <Row className="person-detail-section align-items-start">
          {/* 左侧：画廊 + 相关信息按钮 */}
          <Col xs={12} md={6} className="text-center">
            <PersonGallery person={person} />
            {person.showRelatedInfo && (
              <div className="person-related-section">
                <h3>查看相关内容</h3>
                <div className="person-related-buttons">
                  {brands.length > 0 && (
                    <Link
                      to={`/person/${paramId}/related-brand`}
                      className="btn-outline-black"
                      state={{ brands }}
                    >
                      相关品牌
                    </Link>
                  )}
                  {products.length > 0 && (
                    <Link
                      to={`/person/${paramId}/related-product`}
                      className="btn-outline-black"
                      state={{ products }}
                    >
                      相关产品
                    </Link>
                  )}
                  {news.length > 0 && (
                    <Link
                      to={`/person/${paramId}/related-news`}
                      className="btn-outline-black"
                      state={{ news }}
                    >
                      相关新闻
                    </Link>
                  )}
                </div>
              </div>
            )}
          </Col>

          {/* 右侧：人物信息 */}
          <Col xs={12} md={6} className="person-info">
            <h1>{displayName}</h1>
            <h5>{displayTitle}</h5>
            <div className="person-bio">
              <h3 className="person-bio-title">个人简介</h3>
              <p dangerouslySetInnerHTML={{ __html: displayBio }} />
            </div>
            {socialMedia && (
              <div className="person-social">
                <h4>社交媒体</h4>
                <span dangerouslySetInnerHTML={{ __html: socialMedia }} />
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PersonDetail;
