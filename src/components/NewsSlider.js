import React from "react";
import { Carousel, Image } from "react-bootstrap";
import "../css/Advertisement.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const NewsSlider = ({ ads }) => {

  // Only displays ads with AdImage
  const filteredAds = ads.filter(adItem => 
    adItem.attributes && adItem.attributes.Adimage && adItem.attributes.Adimage.data !== null
  );

  return (
    <Carousel className='ads-carousel' interval={3000}>
      {filteredAds.map((advertisement, index) => (
        <Carousel.Item key={index}>
          <a
            href={advertisement.attributes.link || "#"}
            target={advertisement.attributes.link ? "_blank" : "_self"}
            rel='noopener noreferrer'
          >
            <Image
              src={
                advertisement.attributes.Adimage?.data?.[0]?.attributes?.url
                  ? `${BACKEND_HOST}${advertisement.attributes.Adimage.data[0].attributes.url}`
                  : "https://placehold.co/900x400"
              }
              className='d-block w-100 ad-image'
              alt={advertisement.attributes.Name || "Advertisement"}
            />
          </a>

          <Carousel.Caption className='text-left'>
            <h3>{advertisement.attributes.Name}</h3>
            {advertisement.attributes.Text && (
              <p className='ad-text'>{advertisement.attributes.Text}</p>
            )}
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default NewsSlider;
