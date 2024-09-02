import React from "react";
import { Carousel, Image } from "react-bootstrap";
import "../css/Advertisement.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const Advertisement = ({ ads }) => {
  return (
    <Carousel className='ads-carousel' interval={3000}>
      {ads.map((advertisement, index) => (
        <Carousel.Item key={index}>
          <Image
            src={
              advertisement.attributes.Adimage?.data?.[0]?.attributes?.url
                ? `${BACKEND_HOST}${advertisement.attributes.Adimage.data[0].attributes.url}`
                : "https://placehold.co/1200x400"
            }
            className='d-block w-100 ad-image'
            alt={advertisement.attributes.Name || "Advertisement"}
          />
          <Carousel.Caption>
            <h3>{advertisement.attributes.Name}</h3>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Advertisement;
