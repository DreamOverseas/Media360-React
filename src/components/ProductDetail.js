import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Modal,
  Row,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import "../css/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const { i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showModal, setShowModal] = useState(false);

  const renderRichText = richText => {
    return richText.map((block, index) => {
      switch (block.type) {
        case "paragraph":
          return (
            <p key={index}>
              {block.children.map((child, childIndex) => (
                <span key={childIndex}>{child.text}</span>
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

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const handlePurchase = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    axios
      .get(`http://api.meetu.life/api/products/${id}?populate=*`)
      .then(response => {
        if (response.data && response.data.data) {
          setProduct(response.data.data);
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

  if (!product) {
    return <div>Loading...</div>;
  }

  const { Name, Price, ProductImage } = product.attributes;
  const language = i18n.language;
  const Description =
    language === "zh"
      ? product.attributes.Description_zh
      : product.attributes.Description_en;

  return (
    <div>
      <section>
        <Container>
          <Row className='product-detail-section'>
            <Col className='kol-image-col'>
              {ProductImage && ProductImage.data ? (
                <Image
                  src={`http://api.meetu.life${ProductImage.data.attributes.url}`}
                  alt={Name}
                />
              ) : (
                <Image src='https://placehold.co/650x650' alt='Placeholder' />
              )}
            </Col>
            <Col>
              <Container className='product-detail'>
                <Row>
                  <h1>{Name}</h1>
                </Row>
                <Row className='product-description'>
                  <div>
                    {Description
                      ? renderRichText(Description)
                      : "No description available"}
                  </div>
                </Row>
                <Row className='product-price-quantity'>
                  <Col>
                    <h4>${Price}</h4>
                  </Col>
                  <Col>
                    <Form.Group className='price-control'>
                      <InputGroup className='d-flex justify-content-center align-items-center'>
                        <Button
                          variant='outline-secondary'
                          onClick={handleDecrement}
                        >
                          -
                        </Button>
                        <InputGroup.Text readOnly>{quantity}</InputGroup.Text>
                        <Button
                          variant='outline-secondary'
                          onClick={handleIncrement}
                        >
                          +
                        </Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Button className='add-to-cart' onClick={handlePurchase}>
                      Purchase and Enquiry Now
                    </Button>
                  </Col>
                  <Col>
                    <Button className='add-to-cart'>Add to cart</Button>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Row>
        </Container>
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
              Close
            </Button>
          </Modal.Footer>
        </Modal>
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
              <h5>Recommended Products</h5>
            </Col>
            <Col md={5}>
              <hr />
            </Col>
          </Row>
        </Container>
        <br />
      </section>
    </div>
  );
};

export default ProductDetail;
