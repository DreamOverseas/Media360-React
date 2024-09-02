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
} from "react-bootstrap";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { Link, useParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../css/ProductDetail.css";

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const ProductDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const { i18n } = useTranslation();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [cartModal, setCartModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleCloseCartModal = () => {
    setCartModal(false);
  };

  const handleAddToCart = async () => {
    if (user && Cookies.get("token")) {
      try {
        const user_detail = await axios.get(
          `${BACKEND_HOST}/api/users/${user.id}?populate[cart]=*`
        );
        const cartid = user_detail.data.cart.id;
        const cart_items = await axios.get(
          `${BACKEND_HOST}/api/carts/${cartid}?populate[cart_items][populate][product]=*`
        );
        const cart_items_data = cart_items.data.data.attributes.cart_items.data;
        console.log(cart_items_data);
        const added_cart_item_data = await axios.post(
          `${BACKEND_HOST}/api/cart-items`,
          {
            data: {
              Number: quantity,
              product: product.id,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        const added_item_id = added_cart_item_data.data.data.id;
        const added_item = await axios.get(
          `${BACKEND_HOST}/api/cart-items/${added_item_id}?populate=*`
        );
        const added_data = added_item.data.data;
        console.log("add item successfully:", added_data);

        const updated_cart_items_list = [...cart_items_data, added_data];
        console.log(updated_cart_items_list);
        const updated_cart = await axios.put(
          `${BACKEND_HOST}/api/carts/${cartid}`,
          {
            data: {
              cart_items: updated_cart_items_list,
            },
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("update item successfully:", updated_cart.data);
      } catch (error) {
        console.error("fail to add to cart:", error);
      }
    } else {
      setCartModal(true);
    }
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
      .get(`${BACKEND_HOST}/api/products/${id}?populate=*`)
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

  const ShortDescription =
    language === "zh"
      ? product.attributes.Short_zh
      : product.attributes.Short_en;

  return (
    <div>
      <section>
        <Container>
          <Row className='product-detail-section'>
            <Col className='kol-image-col'>
              {ProductImage && ProductImage.data ? (
                <Image
                  src={`${BACKEND_HOST}${ProductImage.data.attributes.url}`}
                  alt={Name}
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
                  <div>
                    {ShortDescription ? (
                      <p>{ShortDescription}</p>
                    ) : (
                      "No description available"
                    )}
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
                    <Button className='add-to-cart' onClick={handleAddToCart}>
                      Add to cart
                    </Button>
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
              <Image src='/QR_JohnDu.png' alt='Logo' fluid />
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={cartModal} onHide={handleCloseCartModal}>
          <Modal.Header closeButton></Modal.Header>
          <Modal.Body>
            <Row>
              <p>Please login in first</p>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Link to={"/login"}>
              <Button variant='secondary'>Login</Button>
            </Link>
            <Button variant='secondary' onClick={handleCloseCartModal}>
              cancel
            </Button>
          </Modal.Footer>
        </Modal>
      </section>
      <br />
      <br />
      <section>
  <Container>
    <Row>
      <h5>Product Description</h5>
    </Row>
    <Row>
      <div className="markdown-content">
        {Description ? (
          <ReactMarkdown>{Description}</ReactMarkdown>
        ) : (
          "No description available"
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
