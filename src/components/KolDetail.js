import axios from "axios";
import "bootstrap-icons/font/bootstrap-icons.css";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Modal, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import "../css/KolDetail.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const KolDetail = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const [kol, setKol] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // First, fetch the Kol data
    axios
      .get(`${BACKEND_HOST}/api/kols/?filters[id]=${id}&populate=*`)
      .then((response) => {
        if (response.data && response.data.data) {
          setKol(response.data.data[0]);
        } else {
          setError("No data found");
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      });
  }, [id]);
  
  // Second, fetch Product data only if `kol` and `kol.Products` are available
  useEffect(() => {
    if (kol && kol.Products) {
      // Map `Products` into an array of product IDs
      const productIds = kol.Products.map((product) => product.id);
  
      // Prepare requests for each Product with ProductImage
      const productRequests = productIds.map((productId) =>
        axios.get(`${BACKEND_HOST}/api/products/?filters[id]=${productId}&populate=*`)
      );
  
      Promise.all(productRequests)
        .then((responses) => {
          // Map responses to extract product data
          const fetchedProducts = responses.map((response) => response.data.data[0]);
          setProducts(fetchedProducts); // Store all products in the products array
        })
        .catch((error) => {
          console.error("Error fetching product data:", error);
        });
    }
    console.log(products)
  }, [kol]);  

  if (error) {
    return <div>{error}</div>;
  }

  if (!kol) {
    return <div>{t("loading")}</div>;
  }

  const { Name, KolImage} = kol;

  const renderRichText = (richText) => {
    const richTextArray = Array.isArray(richText) ? richText : [richText];
    return richTextArray.map((block, index) => {
      switch (block.type) {
        case "paragraph":
          const paragraphText = block.children.map((child) => child.text).join("\n");
          return (
            <p key={index} style={{ fontSize: "13px" }}>
              {paragraphText.split("\n").map((text, i) => (
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
  const Description = language === "zh" ? kol.Description_zh[0] : kol.Description_en[0];
  const Title = language === "zh" ? kol.Title_zh : kol.Title_en;

  const handleContact = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {/* Render Kol Details */}
      <section className="kol-detail-background-image-container">
        <h1 className="kol-detail-banner-h1">
          <b>{t("kol")}</b>
        </h1>
      </section>
      <br />
      <Container>
        <Row className="kol-detail-section">
          <Col>
            <Container className="kol-detail">
              <Row>
                <h1>{Name}</h1>
                <h5>{Title}</h5>
              </Row>
              <Row className="kol-description">
                <div>{Description ? renderRichText(Description) : t("noDescription")}</div>
              </Row>
              <Row className="kol-contact">
                <Col>
                  <Button onClick={handleContact}>{t("contactNow")}</Button>
                </Col>
                <Col className="d-flex align-items-center">
                  <i className="bi bi-wechat contact-icon"></i>
                </Col>
              </Row>
            </Container>
          </Col>
          <Col className="kol-image-col">
            {KolImage ? (
              <Image src={`${BACKEND_HOST}${KolImage.url}`} alt={Name} />
            ) : (
              <Image src="https://placehold.co/650x650" alt="Placeholder" />
            )}
          </Col>
        </Row>

        {/* Modal */}
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>{Name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Please scan the QR code and directly contact with the Kol</p>
            <Image src="/QR_placeholder.png" alt="Logo" fluid />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              {t("close")}
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
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
      {/* Highlighted Products Section */}
      <Container className="kol-detail-container">
        <Row>
          {products.length > 0 ? (
            products.map((product) => (
              <Col key={product.id} sm={12} md={6} lg={4}>
                <Link to={`/product/${product.id}`} className="card-link-highlight">
                  <Card className="kol-product-card">
                    {product.ProductImage ? (
                      <Card.Img
                        variant="top"
                        src={`${BACKEND_HOST}${product.ProductImage.url}`}
                      />
                    ) : (
                      <Card.Img variant="top" src="https://placehold.co/300x300" />
                    )}
                    <Card.Body>
                      <Card.Title>{product.Name}</Card.Title>
                      <Card.Text>${product.Price}</Card.Text>
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
    </div>
  );
};

export default KolDetail;
