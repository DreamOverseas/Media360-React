import axios from "axios";
import Cookies from "js-cookie";
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import { useTranslation } from "react-i18next"; // 引入useTranslation
import { AuthContext } from "../context/AuthContext.jsx";
import "../css/ShoppingCart.css";

// Load Backend Host for API calls
const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const ShoppingCart = () => {
  const { t } = useTranslation();
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const fetchUserCart = useCallback(async () => {
    try {
      // get user id and cart id
      const userResponse = await axios.get(
        `${BACKEND_HOST}/api/users/${user.id}?populate=cart`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const cartId = userResponse.data.cart.id;

      // find cart item id and data
      const cartResponse = await axios.get(
        `${BACKEND_HOST}/api/carts/${cartId}?populate[0]=*&populate[cart_items][populate][product][populate]=ProductImage`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      const cartData = cartResponse.data;

      if (
        cartData &&
        cartData.data &&
        cartData.data.attributes &&
        cartData.data.attributes.cart_items
      ) {
        setCartItems(
          cartData.data.attributes.cart_items.data.map(item => {
            const product = item.attributes.product?.data?.attributes || {};
            return {
              id: item.id,
              selected: true,
              product: {
                Name: product.Name || "Unknown Product",
                Price: product.Price || 0,
                Image: product.ProductImage?.data?.attributes?.url || null,
                Description: product.Description || "No description available",
              },
              qty: item.attributes.Number,
            };
          })
        );
      } else {
        setError("No cart items found");
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
      setError(
        error.response
          ? error.response.data.error.message
          : "Error fetching data"
      );
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchUserCart();
    }
  }, [user, fetchUserCart]);

  useEffect(() => {
    axios
      .get(`${BACKEND_HOST}/api/products?populate=*`)
      .then(response => {
        setRecommendations(
          response.data.data.map(product => ({
            id: product.id,
            image: product.attributes.ProductImage
              ? `${BACKEND_HOST}${product.attributes.ProductImage.data.attributes.url}`
              : "https://placehold.co/300x300",
            title: product.attributes.Name,
          }))
        );
      })
      .catch(error => {
        console.error("Error fetching recommendations:", error);
        setError("Error fetching recommendations");
      });
  }, []);

  const checkAllSelected = useCallback(
    () => cartItems.every(item => item.selected),
    [cartItems]
  );

  const handleSelectionChange = id => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const handleAllSelectionChange = () => {
    setCartItems(prevItems =>
      prevItems.map(item => ({ ...item, selected: !isAllSelected }))
    );
  };

  const deleteItem = id => {
    deleteItemFromDatabase(id);
  };

  const handleQuantityChange = (id, newQty) => {
    updateItemQuantityInDatabase(id, newQty);
  };

  const updateItemQuantityInDatabase = async (id, newQty) => {
    try {
      await axios.put(
        `${BACKEND_HOST}/api/cart-items/${id}`,
        {
          data: {
            Number: newQty,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.id === id ? { ...item, qty: newQty } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
      setError(
        error.response
          ? error.response.data.error.message
          : "Error updating cart item quantity"
      );
    }
  };

  const deleteItemFromDatabase = async id => {
    try {
      await axios.delete(`${BACKEND_HOST}/api/cart-items/${id}`, {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
          "Content-Type": "application/json",
        },
      });
      setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error deleting cart item:", error);
      setError(
        error.response
          ? error.response.data.error.message
          : "Error deleting cart item"
      );
    }
  };

  const calculateTotalPrice = useCallback(
    () =>
      cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + item.product.Price * item.qty, 0),
    [cartItems]
  );

  const calculateSelectedItemsCount = useCallback(
    () =>
      cartItems
        .filter(item => item.selected)
        .reduce((total, item) => total + parseInt(item.qty), 0),
    [cartItems]
  );

  const [isAllSelected, setIsAllSelected] = useState(checkAllSelected());
  const [totalPrice, setTotalPrice] = useState(calculateTotalPrice());
  const [selectedItemsCount, setSelectedItemsCount] = useState(
    calculateSelectedItemsCount()
  );

  useEffect(() => {
    setIsAllSelected(checkAllSelected());
    setTotalPrice(calculateTotalPrice());
    setSelectedItemsCount(calculateSelectedItemsCount());
  }, [
    cartItems,
    checkAllSelected,
    calculateTotalPrice,
    calculateSelectedItemsCount,
  ]);

  // const settings = {
  //   className: "center",
  //   centerMode: true,
  //   infinite: true,
  //   centerPadding: "60px",
  //   slidesToShow: 3,
  //   speed: 500,
  // };

  return (
    <Container>
      <h2>{t("cart.title")}</h2>
      {error && <p className='error'>{error}</p>}
      <Form.Check
        className='cart-checkbox'
        label={<b>{t("cart.select_all")}</b>}
        type='checkbox'
        checked={isAllSelected}
        onChange={() => handleAllSelectionChange()}
      />
      <Row>
        <Col md={8}>
          {cartItems.map(item => (
            <Row key={item.id}>
              <Col noGutters className='cart-checker'>
                <Form.Check
                  className='cart-checkbox'
                  inline
                  type='checkbox'
                  checked={item.selected}
                  onChange={() => handleSelectionChange(item.id)}
                />
              </Col>
              <Col md={11}>
                <Card className='mb-3 cart-item  card-small'>
                  <Row noGutters>
                    <Col md={4} className='item-image-container'>
                      <Card.Img
                        src={
                          item.product.Image
                            ? `${BACKEND_HOST}${item.product.Image}`
                            : "https://placehold.co/300x300"
                        }
                      />
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{item.product.Name}</Card.Title>
                        <Row>
                          <Col md={4}>
                            <Row>
                              <Form.Group controlId={`qty-${item.id}`}>
                                <InputGroup>
                                  <InputGroup.Text>QTY</InputGroup.Text>
                                  <Form.Control
                                    as='select'
                                    value={item.qty}
                                    onChange={e =>
                                      handleQuantityChange(
                                        item.id,
                                        parseInt(e.target.value)
                                      )
                                    }
                                  >
                                    {[...Array(10).keys()].map(x => (
                                      <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                      </option>
                                    ))}
                                  </Form.Control>
                                </InputGroup>
                              </Form.Group>
                            </Row>
                          </Col>
                          <Col md={2}>
                            <Button
                              variant='light'
                              className='delete_cart_button'
                              onClick={() => deleteItem(item.id)}
                            >
                              {t("cart.delete")}
                            </Button>
                          </Col>
                          <Col>
                            <p className='cart-price'>${item.product.Price}</p>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          ))}
        </Col>
        <Col md={4}>
          <h5>{t("cart.order_summary")}</h5>
          <p>
            {t("cart.item_quantity")}: {selectedItemsCount}
          </p>
          <p>
            {t("cart.total_price")}: ${totalPrice}
          </p>
          <Button variant='dark' block>
            {t("cart.proceed_checkout")}
          </Button>
        </Col>
      </Row>
      <hr />
      {/*<h5>You might also like</h5>
      <Slider {...settings}>
        {recommendations.map(rec => (
          <div key={rec.id}>
            <Card>
              <Card.Img src={rec.image} />
            </Card>
          </div>
        ))}
      </Slider>*/}
    </Container>
  );
};

export default ShoppingCart;
