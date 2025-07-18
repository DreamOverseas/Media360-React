import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const ProductGallery = ({ product }) => {
  const [mainImageUrl, setMainImageUrl] = useState(null);
  const [subImageUrls, setSubImageUrls] = useState([]);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Step 1: 设置主图 URL
  useEffect(() => {
    if (!product || !product.ProductImage) return;

    const rawUrl = product.ProductImage.url;
    const thumbUrl = product.ProductImage.formats?.thumbnail?.url;

    const resolvedUrl = rawUrl
      ? `${BACKEND_HOST}${rawUrl}`
      : thumbUrl
      ? `${BACKEND_HOST}${thumbUrl}`
      : null;

    setMainImageUrl(resolvedUrl);

    // 图片加载检测 + fallback
    if (resolvedUrl) {
      const img = new Image();
      img.src = resolvedUrl;

      const timeout = setTimeout(() => {
        setImageLoaded(true); // fallback 放行
      }, 2000); // 超时放行

      img.onload = () => {
        clearTimeout(timeout);
        setImageLoaded(true);
      };

      img.onerror = () => {
        clearTimeout(timeout);
        console.warn("主图加载失败，使用占位图");
        setMainImageUrl("https://placehold.co/650x650");
        setImageLoaded(true);
      };
    }
  }, [product]);

  // Step 2: 设置子图 URL
  useEffect(() => {
    if (Array.isArray(product?.SubImages)) {
      const urls = product.SubImages.map((img) => `${BACKEND_HOST}${img.url}`);
      setSubImageUrls(urls);
    }
  }, [product]);

  // Step 3: 所有图片合集
  const allMedia = mainImageUrl ? [mainImageUrl, ...subImageUrls] : [];
  const isSingleImage = allMedia.length <= 1;

  const handleThumbnailClick = (index) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const prevMedia = () => {
    setCurrentIndex((i) => (i === 0 ? allMedia.length - 1 : i - 1));
  };

  const nextMedia = () => {
    setCurrentIndex((i) => (i + 1) % allMedia.length);
  };

  if (!imageLoaded) {
    return (
      <Container className="product-gallery">
        <div className="loading">图片加载中...</div>
      </Container>
    );
  }

  return (
    <Container className="product-gallery">
      <div className="main-image-container">
        {!isSingleImage && (
          <button className="prev-button" onClick={prevMedia}>❮</button>
        )}

        <img
          src={allMedia[currentIndex]}
          alt={`图片 ${currentIndex}`}
          className="product-img"
          onClick={() => setLightboxOpen(true)}
          onError={(e) => {
            e.target.src = "https://placehold.co/650x650";
          }}
        />

        {!isSingleImage && (
          <button className="next-button" onClick={nextMedia}>❯</button>
        )}
      </div>

      {!isSingleImage && (
        <>
          <div className="thumbnail-container">
            {allMedia.slice(1, 8).map((src, idx) => (
              <div
                key={idx}
                className={`thumb-container ${idx + 1 === currentIndex ? 'active-thumb' : ''}`}
                onClick={() => handleThumbnailClick(idx + 1)}
              >
                <img src={src} alt={`缩略图 ${idx}`} className="thumb-img" />
              </div>
            ))}
            {allMedia.length > 8 && (
              <div
                className="thumb-container placeholder-thumb"
                onClick={() => handleThumbnailClick(8)}
              >
                <div className="thumb-overlay">+ {allMedia.length - 8}</div>
              </div>
            )}
          </div>

          <Lightbox
            open={lightboxOpen}
            close={() => setLightboxOpen(false)}
            slides={allMedia.map((src) => ({ src }))}
            index={currentIndex}
          />
        </>
      )}
    </Container>
  );
};

export default ProductGallery;