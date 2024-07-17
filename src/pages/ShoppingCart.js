import axios from "axios";
<<<<<<< Updated upstream
import Cookies from "js-cookie";
import React, { useCallback, useContext, useEffect, useState } from "react";
=======
import React, { useContext, useEffect, useState } from "react";
>>>>>>> Stashed changes
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  InputGroup,
  Row,
} from "react-bootstrap";
import Slider from "react-slick";
import { AuthContext } from "../context/AuthContext";
import "../css/ShoppingCart.css";

const ShoppingCart = () => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

<<<<<<< Updated upstream
  const checkAllSelected = useCallback(
    () => cartItems.every(item => item.selected),
    [cartItems]
  );
=======
  useEffect(() => {
    const fetchUserCart = async () => {
      try {
        // First, get the user data to find the cart ID
        const userResponse = await axios.get(
          `http://api.meetu.life/api/users/${user.id}?populate=cart`
        );
        const cartId = userResponse.data.cart.id;

        // Then, get the cart data with cart items and product details
        const cartResponse = await axios.get(
          `http://api.meetu.life/api/carts/${cartId}?populate=cartItems.product`
        );

        setCartItems(
          cartResponse.data.data.cartItems.map(item => ({
            id: item.id,
            selected: true,
            product: item.product,
            qty: item.Number,
          }))
        );
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setError(
          error.response
            ? error.response.data.error.message
            : "Error fetching data"
        );
      }
    };

    if (user) {
      fetchUserCart();
    }
  }, [user]);

  useEffect(() => {
    axios
      .get("http://api.meetu.life/api/products?populate=*")
      .then(response => {
        setRecommendations(
          response.data.data.map(product => ({
            id: product.id,
            image: product.attributes.Image
              ? product.attributes.Image.url
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

  const checkAllSelected = () => cartItems.every(item => item.selected);
>>>>>>> Stashed changes

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
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleQuantityChange = (id, newQty) => {
    setCartItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, qty: newQty } : item))
    );
  };

<<<<<<< Updated upstream
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
=======
  const calculateTotalPrice = () =>
    cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + item.product.Price * item.qty, 0);

  const calculateSelectedItemsCount = () =>
    cartItems
      .filter(item => item.selected)
      .reduce((total, item) => total + parseInt(item.qty), 0);
>>>>>>> Stashed changes

  const [isAllSelected, setIsAllSelected] = useState(checkAllSelected());
  const [totalPrice, setTotalPrice] = useState(calculateTotalPrice());
  const [selectedItemsCount, setSelectedItemsCount] = useState(
    calculateSelectedItemsCount()
  );

  useEffect(() => {
<<<<<<< Updated upstream
    const fetchUserCart = async () => {
      try {
        // First, get the user data to find the cart ID
        console.log(`Fetching user data for user ID: ${user.id}`);
        const userResponse = await axios.get(
          `http://api.meetu.life/api/users/${user.id}?populate=cart`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("User response:", userResponse.data);

        const cartId = userResponse.data.cart.id;
        console.log(`Fetching cart data for cart ID: ${cartId}`);

        // Then, get the cart data with cart items and product details
        const cartResponse = await axios.get(
          `http://api.meetu.life/api/carts/${cartId}?populate[0]=*&populate[cart_items][populate][product][populate]=ProductImage`,
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log("Cart response:", cartResponse.data);

        const cartData = cartResponse.data;
        if (
          cartData &&
          cartData.data &&
          cartData.data.attributes &&
          cartData.data.attributes.cart_items
        ) {
          console.log("Cart items:", cartData.data.attributes.cart_items.data);
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
                  Description:
                    product.Description || "No description available",
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
    };

    if (user) {
      fetchUserCart();
    }
  }, [user]);

  useEffect(() => {
    axios
      .get("http://api.meetu.life/api/products?populate=*")
      .then(response => {
        setRecommendations(
          response.data.data.map(product => ({
            id: product.id,
            image: product.attributes.ProductImage
              ? `http://api.meetu.life${product.attributes.ProductImage.data.attributes.url}`
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
=======
    setIsAllSelected(checkAllSelected());
    setTotalPrice(calculateTotalPrice());
    setSelectedItemsCount(calculateSelectedItemsCount());
  }, [cartItems]);
>>>>>>> Stashed changes

  const settings = {
    className: "center",
    centerMode: true,
    infinite: true,
    centerPadding: "60px",
    slidesToShow: 3,
    speed: 500,
  };

  return (
    <Container>
<<<<<<< Updated upstream
      {error && <p className='error'>{error}</p>}
=======
      {error && <p className='error'>{JSON.stringify(error)}</p>}
>>>>>>> Stashed changes
      <Form.Check
        className='cart-checkbox'
        label={<b>Select all</b>}
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
                <Card className='mb-3 cart-item'>
                  <Row noGutters>
                    <Col md={4} className='item-image-container'>
                      <Card.Img
                        src={
                          item.product.Image
<<<<<<< Updated upstream
                            ? `http://api.meetu.life${item.product.Image}`
=======
                            ? item.product.Image.url
>>>>>>> Stashed changes
                            : "https://placehold.co/300x300"
                        }
                      />
                    </Col>
                    <Col md={8}>
                      <Card.Body>
                        <Card.Title>{item.product.Name}</Card.Title>
<<<<<<< Updated upstream

=======
                        <Card.Text>
                          {item.product.Description ||
                            "No description available"}
                        </Card.Text>
>>>>>>> Stashed changes
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
                              Delete
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
          <h5>Order Summary</h5>
          <p>Item Quantity: {selectedItemsCount}</p>
          <p>Total Price: ${totalPrice}</p>
          <Button variant='dark' block>
            Proceed to Check Out
          </Button>
        </Col>
      </Row>
      <hr />
      <h5>You might also like</h5>
      <Slider {...settings}>
        {recommendations.map(rec => (
          <div key={rec.id}>
            <Card>
              <Card.Img src={rec.image} />
            </Card>
          </div>
        ))}
      </Slider>
    </Container>
  );
};

export default ShoppingCart;
