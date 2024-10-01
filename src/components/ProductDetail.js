import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  Modal,
  Row,
  Spinner,
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { Link, useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";
import rehypeRaw from 'rehype-raw';
import { AuthContext } from "../context/AuthContext";

import "../css/ProductDetail.css";

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const ProductDetail = () => {
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartModal, setCartModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginModalOpen = () => {
    setShowLoginModal(true);
    setCartModal(false);
  };

  const handleLoginModalClose = () => setShowLoginModal(false);

  const handleCloseCartModal = () => setCartModal(false);

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

  const handleAddToCart = async () => {
    if (user && Cookies.get("token")) {
      try {
        const user_detail = await axios.get(`${BACKEND_HOST}/api/users/${user.id}?populate[cart]=*`);
        const cartid = user_detail.data.cart.id;
        const cart_items = await axios.get(`${BACKEND_HOST}/api/carts/${cartid}?populate[cart_items][populate][product]=*`);
        const cart_items_data = cart_items.data.data.attributes.cart_items.data;

        const existingItem = cart_items_data.find(item => item.attributes.product.data.id === product.id);

        if (existingItem) {
          await axios.put(
            `${BACKEND_HOST}/api/cart-items/${existingItem.id}`,
            { data: { Number: existingItem.attributes.Number + quantity } },
            { headers: { Authorization: `Bearer ${Cookies.get("token")}`, "Content-Type": "application/json" } }
          );
        } else {
          await axios.post(
            `${BACKEND_HOST}/api/cart-items`,
            { data: { Number: quantity, product: product.id } },
            { headers: { Authorization: `Bearer ${Cookies.get("token")}`, "Content-Type": "application/json" } }
          );
        }

        console.log("Item added to cart successfully.");
      } catch (error) {
        console.error("Failed to add to cart:", error);
      }
    } else {
      setCartModal(true);
    }
  };

  const handlePurchase = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const getLocalizedAttribute = (attr_en, attr_zh) => {
    return i18n.language === "zh" ? attr_zh : attr_en;
  };

  useEffect(() => {
    const path = location.pathname.replace('/product/', '');
    axios
      .get(`${BACKEND_HOST}/api/products`, {
        params: {
          'filters[url]': path,
          'populate': 'ProductImage',
        },
      })
      .then(response => {
        if (response.data && response.data.data && response.data.data.length > 0) {
          setProduct(response.data.data[0]);
        } else {
          setError(t("noProductFound"));
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError(t("errorFetchingProductData"));
      });
  }, [location.pathname, t]);

  if (error) {
    return (
      <Container className="error-container">
        <h4>{t("errorLoadingProduct")}</h4>
        <p>{error}</p>
      </Container>
    );
  }

  if (!product || !product.attributes) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status">
          <span className="sr-only">{t("loading")}</span>
        </Spinner>
      </div>
    );
  }

  const { Price, ProductImage } = product[0].attributes;
  const language = i18n.language;

  const display_price = Price === 0 ? 
                              (t("price_tbd")) : 
                              (`AU$${Price}`)
  
  const Name =
    language === "zh"
      ? product[0].attributes.Name_zh
      : product[0].attributes.Name_en;

  const Description =
    language === "zh"
      ? product[0].attributes.Description_zh
      : product[0].attributes.Description_en;

  const ShortDescription =
    language === "zh"
      ? product[0].attributes.Short_zh
      : product[0].attributes.Short_en;

  const available = product[0].attributes.Available
  const sponsor = product[0].attributes.Sponsor

  return (
    <div>
      <section>
        <Container>
          <Row className='product-detail-section'>
            <Col className='product-image-col'>
              {ProductImage && ProductImage.data ? (
                <Image
                  src={`${BACKEND_HOST}${ProductImage.data.attributes.url}`}
                  alt={Name}
                  className="product-img"
                />
              ) : (
                <Image src='https://placehold.co/650x650' alt='Placeholder' />
              )}
            </Col>
            <Col className='product-detail-col'>
              <Container className='product-detail'>
                <Row>
                  <h1>{Name}</h1>
                </Row>
                <Row className='product-short-description'>
                  <div>{ShortDescription ? <p>{ShortDescription}</p> : t("noDescription")}</div>
                </Row>
                <Row className='product-price-quantity'>
                  <Col>
                    <h4>{display_price}</h4>
                  </Col>
                  {Available && (
                    <Col>
                      <Form.Group className='price-control'>
                        <InputGroup className='d-flex justify-content-center align-items-center'>
                          <Button variant='outline-secondary' onClick={handleDecrement}>-</Button>
                          <InputGroup.Text readOnly>{quantity}</InputGroup.Text>
                          <Button variant='outline-secondary' onClick={handleIncrement}>+</Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  )}
                </Row>
                <Row>
                  {(Price !== 0 || 1) && Available ? (
                    <>
                      <Col>
                        <Button className='add-to-cart' onClick={handlePurchase}>{t("enquireNow")}</Button>
                      </Col>
                      <Col>
                        <Button className='add-to-cart' onClick={handleAddToCart}>{t("addToCart")}</Button>
                      </Col>
                    </>
                  ) : (
                    <Button className='add-to-cart' onClick={handlePurchase}>{t("enquireNow")}</Button>
                  )}
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
            {Sponsor ? (
              <div>
                <Row>
                  <h5>{t("productWebsite")}</h5>
                  <Link to={`/sponsor/${product.attributes.url}`}>www.do360.com/sponsor/{product.attributes.url}</Link>
                </Row>
              </div>
            ) : (
              <div>
                <Row><p>{t("contactKol")}</p></Row>
                <Row className='purchase-modal-background'>
                  <Image src='/QR_JohnDu.png' alt='Logo' fluid />
                </Row>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseModal}>{t("close")}</Button>
          </Modal.Footer>
        </Modal>

        <Modal show={cartModal} onHide={handleCloseCartModal}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Row><p>{t("loginAlert")}</p></Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleLoginModalOpen}>{t("logIn")}</Button>
            <Button variant='secondary' onClick={handleCloseCartModal}>{t("cancel")}</Button>
          </Modal.Footer>
        </Modal>

        <LoginModal show={showLoginModal} handleClose={handleLoginModalClose} />
      </section>
      <br />
      <br />
      <section>
        <Container>
          <Row>
            <h1><b>{t("productDescription")}</b></h1>
          </Row>
          <Row>
            <div className="markdown-content">
              {Description ? (
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{Description}</ReactMarkdown>
              ) : (
                t("noDescription")
              )}
            </div>
          </Row>
        </Container>
        <br />
      </section>
    </div>
  );
};

export default ProductDetail;