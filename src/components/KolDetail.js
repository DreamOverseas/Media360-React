import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Image,
  Modal,
  Row,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import "../css/KolDetail.css";

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const KolDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [kol, setKol] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get(
        `${BACKEND_HOST}/api/kols/${id}?populate[KolImage]=*&populate[Products][populate]=*`
      )
      .then(response => {
        if (response.data && response.data.data) {
          setKol(response.data.data);
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

  if (!kol) {
    return <div>{t("loading")}</div>;
  }

  const { Name, KolImage, Products } = kol[0];

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
      ? kol[0].Description_zh
      : kol[0].Description_en;
  
  const Title =
    language === "zh"
    ? kol[0].Title_zh
    : kol[0].Title_en;

  const handleContact = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <section className='kol-detail-background-image-container'>
        <h1 className='kol-detail-banner-h1'>
          <b>{t("kol")}</b>
        </h1>
      </section>
      <br />
      <section>
        <Container>
          <Row className='kol-detail-section'>
            <Col>
              <Container className='kol-detail'>
                <Row>
                  <h1>{Name}</h1>
                  <h5>{Title}</h5>
                </Row>
                <Row className='kol-description'>
                  <div>
                    {Description
                      ? renderRichText(Description)
                      : t("noDescription")}
                  </div>
                </Row>
                <Row className='kol-contact'>
                  <Col>
                    <Button onClick={handleContact}>{t("contactNow")}</Button>
                  </Col>
                  <Col className='d-flex align-items-center'>
                    <i className='bi bi-wechat contact-icon'></i>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col className='kol-image-col'>
              {KolImage ? (
                <Image
                  src={`${BACKEND_HOST}${KolImage.url}`}
                  alt={Name}
                />
              ) : (
                <Image src='https://placehold.co/650x650' alt='Placeholder' />
              )}
            </Col>
          </Row>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{Name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <p>Please scan the QR code and directly contact with the Kol</p>
              </Row>
              <Row className='purchase-modal-background'>
                <Image src='/QR_placeholder.png' alt='Logo' fluid />
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={handleCloseModal}>
                {t("close")}
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </section>
      <br />
      <br />
      <section>
        <Container fluid>
          <Row>
            <Col md={5}>
              <hr />
            </Col>
            <Col
              md={2}
              className='d-flex justify-content-center align-items-center'
            >
              <h5>{t("highlightedProduct")}</h5>
            </Col>
            <Col md={5}>
              <hr />
            </Col>
          </Row>
        </Container>
        <br />
      </section>
      <Container className='kol-detail-container'>
        <Row>
          {Products.data.length > 0 ? (
            Products.data.map(product => (
              <Col key={product.id} sm={12} md={6} lg={4}>
                <Link
                  to={`/product/${product.id}`}
                  className='card-link-highlight'
                >
                  <Card className='kol-product-card'>
                    {product && product.ProductImage ? (
                      <Card.Img
                        variant='top'
                        src={`${BACKEND_HOST}${product.ProductImage.url}`}
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
                        title={product.Name}
                      >
                        {product.Name}
                      </Card.Title>
                      <Card.Text 
                        title={product.Price}>
                        ${product.Price}

                      </Card.Text>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            ))
          ) : (
            <p>{t("noProducts")}</p>
          )}
        </Row>
      </Container>
      <br />
    </div>
  );
};

export default KolDetail;
