import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Row,
  Image
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import "../css/KolDetail.css";

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const EventDetail = () => {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${BACKEND_HOST}/api/events/${id}?populate=*`
      )
      .then(response => {
        if (response.data && response.data.data) {
          setEvent(response.data.data);
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      });
  }, [id]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!event) {
    return <div>Loading...</div>;
  }

  const {Image} = event.attributes;

  const renderRichText = richText => {
    return richText.map((block, index) => {
      switch (block.type) {
        case "paragraph":
        const paragraphText = block.children.map(child => child.text).join('\n');
        return (
          <p key={index} style={{fontSize: '13px'}}>
            {paragraphText.split('\n').map((text, i) => (
              <React.Fragment key={i}>
                {text}
                <br />
              </React.Fragment>
            ))}
          </p>
        );
        case "heading":
          return (
            <h2 key={index}>
              {block.children.map((child, childIndex) => (
                <span key={childIndex}>{child.text}</span>
              ))}
            </h2>
          );
        default:
          return null;
      }
    });
  };

  const language = i18n.language;
  const Description =
    language === "zh"
      ? event.attributes.Description_zh
      : event.attributes.Description_en;                                    

  return (
    <div>
      <section className='event-detail-background-image-container'>
        <h1 className='event-detail-banner-h1'>
          <b>Our People</b>
        </h1>
      </section>
      <br />
      <section>
        <Container>
          <Row className='eventt-detail-section'>
            <Col>
              <Container className='event-detail'>
                <Row>
                  <h1>{language ==="zh" ? event.attributes.Name_zh : event.attributes.Name_en}</h1>
                </Row>
                <Row className='event-description'>
                  <div>
                    {Description
                      ? renderRichText(Description)
                      : "No description available"}
                  </div>
                </Row>
                <Row className='event-contact'>
                  <Col>
                    <Button>Coming soon</Button>
                  </Col>
                  {/* <Col className='d-flex align-items-center'>
                    <i className='bi bi-wechat contact-icon'></i>
                  </Col> */}
                </Row>
              </Container>
            </Col>
            <Col className='event-image-col'>
              {Image && Image.data ? (
                <Image
                  src={`${BACKEND_HOST}${Image.data.attributes.url}`}
                  alt={language ==="zh" ? event.attributes.Name_zh : event.attributes.Name_en}
                />
              ) : (
                <Image src='https://placehold.co/650x650' alt='No Image Available' />
              )}
            </Col>
          </Row>
        </Container>
      </section>
      <br />
      <br />
      {/* <section>
        <Container fluid>
          <Row>
            <Col md={5}>
              <hr />
            </Col>
            <Col
              md={2}
              className='d-flex justify-content-center align-items-center'
            >
              <h5>Highlight Products</h5>
            </Col>
            <Col md={5}>
              <hr />
            </Col>
          </Row>
        </Container>
        <br />
      </section> */}
      {/* <Container className='kol-detail-container'>
        <Row>
          {Products.data.length > 0 ? (
            Products.data.map(product => (
              <Col key={product.id} sm={12} md={6} lg={4}>
                <Link
                  to={`/product/${product.id}`}
                  className='card-link-highlight'
                >
                  <Card className='kol-product-card'>
                    {product.attributes && product.attributes.ProductImage ? (
                      <Card.Img
                        variant='top'
                        src={`${BACKEND_HOST}${product.attributes.ProductImage.data.attributes.url}`}
                      />
                    ) : (
                      <Card.Img
                        variant='top'
                        src='https://placehold.co/300x300'
                      />
                    )}
                    <Card.Body>
                      <Card.Title
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontSize: "18px",
                        }}
                        title={product.attributes.Name}
                      >
                        {product.attributes.Name}
                      </Card.Title>
                      <Card.Text 
                        title={product.attributes.Price}>
                        ${product.attributes.Price}

                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <p>No products available</p>
          )}
        </Row>
      </Container> */}
    </div>
  );
};

export default EventDetail;
