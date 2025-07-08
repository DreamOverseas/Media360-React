import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const ProductGallery = ({ product }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  
  const mainImage = product?.ProductImage?.url
    ? `${BACKEND_HOST}${product.ProductImage.url}`
    : 'https://placehold.co/650x650';

  const subImages = Array.isArray(product?.SubImages)
    ? product.SubImages.map((img) => `${BACKEND_HOST}${img.url}`)
    : [];

  const allMedia = subImages.length > 0 ? [mainImage, ...subImages] : [mainImage];
  const isSingleImage = allMedia.length === 1;

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
          onClick={() => !isSingleImage && setLightboxOpen(true)}
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