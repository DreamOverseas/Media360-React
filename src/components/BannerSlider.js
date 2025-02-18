import React from "react";
import { Carousel, Image } from "react-bootstrap";
import "../css/Advertisement.css";
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const BannerSlider = ({ ads }) => {
  // Only displays ads with AdImage
  const filteredAds = ads.filter(adItem => 
    adItem && adItem.Adimage !== null
  );

  console.log(filteredAds);

  return (
    <Carousel className='ads-carousel' interval={3000}>
      {filteredAds.map((advertisement, index) => (
        <Carousel.Item key={index}>
          <a
            href={advertisement.link || "#"}
            target={advertisement.link ? "_blank" : "_self"}
            rel='noopener noreferrer'
          >
            <Image
              src={
                advertisement.Adimage?.[0]?.url
                  ? `${BACKEND_HOST}${advertisement.Adimage[0].url}`
                  : "https://placehold.co/900x400"
              }
              alt={advertisement.Name || "Advertisement"}
            />
          </a>

          <Carousel.Caption className='text-left'>
            <h3>{advertisement.Name}</h3>
            {advertisement.Text && (
              <p className='ad-text'>{advertisement.Text}</p>
            )}
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default BannerSlider;
