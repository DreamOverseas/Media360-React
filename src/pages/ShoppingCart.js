import React, { useState, useEffect } from "react";
import "../css/ShoppingCart.css";
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import Slider from "react-slick";

// This is the shoppingcart page for that displays items in cart
const ShoppingCart = () => {

    /* =========================== Lists of objects ============================= */

    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            selected: true,
            image: 'products/product0.png',
            title: 'Media 360 Promotional Package - Basic',
            description: 'Helps you to promote you findings.',
            price: 500,
            qty: 1,
        },
        {
            id: 2,
            selected: true,
            image: 'products/product1.png',
            title: 'Lorem ipsum',
            description: 'Lorem ipsum dolor sit amet consectetur.',
            price: 800,
            qty: 1,
        },
        {
            id: 3,
            selected: true,
            image: 'products/product2.png',
            title: 'Lorem ipsum',
            description: 'Lorem ipsum dolor sit amet consectetur.',
            price: 1200,
            qty: 1,
        }
    ]);

    const recommendations = [
        { id: 1, image: 'products/product3.png', title: 'Recommended Product 1' },
        { id: 2, image: 'products/product4.png', title: 'Recommended Product 2' },
        { id: 3, image: 'products/product5.png', title: 'Recommended Product 3' },
        { id: 4, image: 'products/product6.png', title: 'Recommended Product 4' },
        { id: 5, image: 'products/product7.png', title: 'Recommended Product 5' },
    ];

    /* =========================== Handler Functions ============================= */

    /**
     * Function that check whether all Items in cart are selected
     * @param {*} cartItems 
     * @returns boolean : If all selected -> true, otherwise false
     */
    const checkAllSelected = () => {
        return cartItems.every(item => item.selected);
    };

    const handleSelectionChange = (id) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, selected: !item.selected } : item
            )
        );
    };

    const handleAllSelectionChange = () => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                ({ ...item, selected: !isAllSelected })
            )
        );
    };

    const handleQuantityChange = (id, newQty) => {
        setCartItems((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, qty: newQty } : item
            )
        );
    };

    const calculateTotalPrice = () => {
        return cartItems
            .filter(item => item.selected)
            .reduce((total, item) => total + (item.price * item.qty), 0);
    };

    const calculateSelectedItemsCount = () => {
        return cartItems
            .filter(item => item.selected)
            .reduce((total, item) => total + parseInt(item.qty), 0);
    };


    /* ====================== UseState/useEffect Declarations ======================== */

    const [isAllSelected, setIsAllSelected] = useState(calculateTotalPrice());
    const [totalPrice, setTotalPrice] = useState(calculateTotalPrice());
    const [selectedItemsCount, setSelectedItemsCount] = useState(calculateSelectedItemsCount());

    useEffect(() => {
        setIsAllSelected(checkAllSelected());
        setTotalPrice(calculateTotalPrice());
        setSelectedItemsCount(calculateSelectedItemsCount());
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [cartItems]);

    // Slick Slider settings
    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 3,
        speed: 500
    };

    return (
        <Container>
            <Form.Check className="cart-checkbox"
                label={<b>Select all</b>}
                type="checkbox"
                checked={isAllSelected}
                onChange={() => handleAllSelectionChange()}
            />
            <Row>
                <Col md={8}>
                    {cartItems.map(item => (
                        <Row>
                            <Col noGutters className="cart-checker">
                                <Form.Check className="cart-checkbox" inline
                                    type="checkbox"
                                    checked={item.selected}
                                    onChange={() => handleSelectionChange(item.id)} />
                            </Col>
                            <Col md={11}>
                                <Card key={item.id} className="mb-3 cart-item">
                                    <Row noGutters>
                                        <Col md={4} className="item-image-container">
                                            <Card.Img src={item.image} />
                                        </Col>
                                        <Col md={8}>
                                            <Card.Body>
                                                <Card.Title>{item.title}</Card.Title>
                                                <Card.Text>{item.description}</Card.Text>
                                                <Row>
                                                    <Col md={4}>
                                                        <Row>
                                                            <Form.Group controlId={`qty-${item.id}`}>
                                                                <InputGroup>
                                                                    <InputGroup.Text>QTY</InputGroup.Text>
                                                                    <Form.Control as="select" defaultValue={item.qty}
                                                                        onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value))}>
                                                                        {[...Array(10).keys()].map(x => (
                                                                            <option key={x + 1} value={x + 1}>{x + 1}</option>
                                                                        ))}
                                                                    </Form.Control>
                                                                </InputGroup>
                                                            </Form.Group>
                                                        </Row>
                                                    </Col>
                                                    <Col md={2}>
                                                        <Button variant='light' className="delete_cart_button">Delete</Button>
                                                    </Col>
                                                    <Col>
                                                        <p className="cart-price">${item.price}</p>
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
                    <Button variant="dark" block>Proceed to Check Out</Button>
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
}


export default ShoppingCart;
