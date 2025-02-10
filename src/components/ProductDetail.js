import axios from "axios";
import Cookies from "js-cookie";
import React, { useContext, useEffect, useState } from "react";
import { Button, Col, Accordion, Container, Form, Image, InputGroup, Modal, Row, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { Link, useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";
import rehypeRaw from 'rehype-raw';
import { AuthContext } from "../context/AuthContext";
import "../css/ProductDetail.css";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;




const ProductDetail = () => {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const location = useLocation();
  const { user } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const [people, setPeople] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartModal, setCartModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);




  const DescriptionAccordion = ({ id, accordion_name, content, activeAccordion, setActiveAccordion }) => {
    const toggleAccordion = () => {
      setActiveAccordion(activeAccordion === id ? null : id);
    };

    return (
      <Accordion activeKey={activeAccordion === id ? "0" : null} className="shopify-accordion">
        <Accordion.Item eventKey="0">
          <div className="shopify-accordion-header" onClick={toggleAccordion}>
            {accordion_name}
            {/* <span className={`accordion-icon ${activeAccordion === id ? "open" : ""}`}>&#9662;</span> */}
          </div>
          <Accordion.Body className="shopify-accordion-body">
          {content ? (
              <div className="markdown-content">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
              </div>
            ) : (
              <div className="ck-content" dangerouslySetInnerHTML={{ __html: Detail}} />
            )}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };
  
  const FounderAccordion = ({ id, accordion_name, content, activeAccordion, setActiveAccordion }) => {
    const toggleAccordion = () => {
      setActiveAccordion(activeAccordion === id ? null : id);
    };

    return (
      <Accordion activeKey={activeAccordion === id ? "0" : null} className="shopify-accordion">
        <Accordion.Item eventKey="0">
          <div className="shopify-accordion-header" onClick={toggleAccordion}>
            {accordion_name}
            {/* <span className={`accordion-icon ${activeAccordion === id ? "open" : ""}`}>&#9662;</span> */}
          </div>
          <Accordion.Body className="shopify-accordion-body">
            {content}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const KolAccordion = ({ id, accordion_name, content, activeAccordion, setActiveAccordion }) => {
    const toggleAccordion = () => {
      setActiveAccordion(activeAccordion === id ? null : id);
    };

    return (
      <Accordion activeKey={activeAccordion === id ? "0" : null} className="shopify-accordion">
        <Accordion.Item eventKey="0">
          <div className="shopify-accordion-header" onClick={toggleAccordion}>
            {accordion_name}
            {/* <span className={`accordion-icon ${activeAccordion === id ? "open" : ""}`}>&#9662;</span> */}
          </div>
          <Accordion.Body className="shopify-accordion-body">
            {content}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };

  const SpokesAccordion = ({ id, accordion_name, content, activeAccordion, setActiveAccordion }) => {
    const toggleAccordion = () => {
      setActiveAccordion(activeAccordion === id ? null : id);
    };

    return (
      <Accordion activeKey={activeAccordion === id ? "0" : null} className="shopify-accordion">
        <Accordion.Item eventKey="0">
          <div className="shopify-accordion-header" onClick={toggleAccordion}>
            {accordion_name}
            {/* <span className={`accordion-icon ${activeAccordion === id ? "open" : ""}`}>&#9662;</span> */}
          </div>
          <Accordion.Body className="shopify-accordion-body">
            {content}
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    );
  };






















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
        const cart_items_data = cart_items.data.cart_items;

        const existingItem = cart_items_data.find(item => item.product.id === product.id);

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

  const handleCloseModal = () => {
    setShowModal(false);
  };




  const fetchData = async (path, setProduct, setPeople, setError, t) => {
    try {

      const [productResponse, peopleResponse] = await Promise.all([
        axios.get(`${BACKEND_HOST}/api/products/?filters[url]=${path}&populate=*`),
        axios.get(`${BACKEND_HOST}/api/products/?filters[url]=${path}&populate[people][populate]=Image`)
      ]);
  

      const productData = productResponse.data?.data?.[0] || null;
      if (!productData) {
        setError(t("noProductFound"));
        return;
      }
      setProduct(productData);
  

      const peopleData = peopleResponse.data?.data?.[0]?.people || [];
      setPeople(peopleData);
      console.log("People:", peopleData);
  
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(t("errorFetchingProductData"));
    }
  };
  
  useEffect(() => {
    const path = location.pathname.replace("/product/", "");
    fetchData(path, setProduct, setPeople, setError, t);
  }, [location.pathname]);

  if (!product) {
    return (
      <div className="loading-container">
        <Spinner animation="border" role="status">
          <span className="sr-only">{t("loading")}</span>
        </Spinner>
      </div>
    );
  }

  const { Price, ProductImage, Available, Sponsor } = product;
  const language = i18n.language;

  const display_price = Price === 0 ? 
                              (t("price_tbd")) : 
                              (`AU$${Price}`);
  const Name =
    language === "zh"
      ? product.Name_zh
      : product.Name_en;

  const Description =
    language === "zh"
      ? product.Description_zh
      : product.Description_en;

  const Detail =
  language === "zh"
    ? product.Detail_zh
    : product.Detail_en;

  console.log("Detail:", Detail);

  // const ShortDescription =
  //   language === "zh"
  //     ? product.Short_zh
  //     : product.Short_en;





















  return (
    <div>
      <section>
        <Container>
          <Row className='product-detail-section'>




            <Col className='product-image-col'>
              {ProductImage ? (
                <Image
                  src={`${BACKEND_HOST}${ProductImage.url}`}
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

                <Row >
                  <h4>{display_price}</h4>
                </Row>
                <Row className='product-price-quantity'>
                  <Col>
                    <Form.Group className='price-control'>
                      <InputGroup className='d-flex justify-content-center align-items-left'>
                        <Button variant='outline-secondary' onClick={handleDecrement}>-</Button>
                        <InputGroup.Text readOnly>{quantity}</InputGroup.Text>
                        <Button variant='outline-secondary' onClick={handleIncrement}>+</Button>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <DescriptionAccordion
                    id="1"
                    accordion_name="产品描述"
                    content={Description}
                    activeAccordion={activeAccordion}
                    setActiveAccordion={setActiveAccordion}
                  />
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
                  <Link to={`/sponsor/${product.url}`}>www.do360.com/sponsor/{product.url}</Link>
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
      {/* <section>
        <Container>
          <Row>
            <h1><b>{t("productDescription")}</b></h1>
          </Row>
          <Row>
            {Description ? (
              <div className="markdown-content">
                <ReactMarkdown rehypePlugins={[rehypeRaw]}>{Description}</ReactMarkdown>
              </div>
            ) : (
              <div className="ck-content" dangerouslySetInnerHTML={{ __html: Detail}} />
            )}
          </Row>
        </Container>
        <br />
      </section> */}
    </div>
  );
};

export default ProductDetail;