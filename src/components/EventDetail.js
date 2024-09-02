import axios from "axios";
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
import ReactMarkdown from "react-markdown";
import "../css/EventDetail.css";

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const EventDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
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
    return <div>{t("loading")}</div>;
  }
  const EventImage = event.attributes.Image;
  const language = i18n.language;
  const Description =
    language === "zh"
      ? event.attributes.Description_zh
      : event.attributes.Description_en;
      
  const ShortDescription =
  language === "zh"
    ? event.attributes.Short_zh
    : event.attributes.Short_en;

  return (
    <div>
      <section className="event-detail-background-image-container">
        <h1 className="event-detail-banner-h1"><b>{t("event")}</b></h1>
      </section>
      <br />
      <section>
        <Container>
          <Row className='event-detail-section'>
          <Col className='event-image-col'>
              {EventImage && EventImage.data ? (
                <Image
                  src={`${BACKEND_HOST}${EventImage.data.attributes.url}`}
                  alt={language ==="zh" ? event.attributes.Name_zh : event.attributes.Name_en}
                />
              ) : (
                <Image src='https://placehold.co/650x650' alt='No Image Available' />
              )}
            </Col>
            <Col className="event-detail-col">
              <Container className='event-detail'>
                <Row>
                  <h2>{language ==="zh" ? event.attributes.Name_zh : event.attributes.Name_en}</h2>
                </Row>
                <Row className='event-short-description'>
                  <div>
                    {Description
                      ? <ReactMarkdown>{ShortDescription}</ReactMarkdown>
                      : t("noDescription")}
                  </div>
                </Row>
                <Row className='event-contact'>
                  <Col>
                    <Button>{t("comingSoon")}</Button>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
      </section>
      <br />
      <br />
      <section>
        <Container>
          <Row>
            <h1><b>{t("eventDescription")}</b></h1>
          </Row>
          <Row>
            <div className="markdown-content">
              {Description ? (
                <ReactMarkdown>{Description}</ReactMarkdown>
              ) : (
                t("noDescription")
              )}
            </div>
          </Row>
        </Container>
      </section>
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
