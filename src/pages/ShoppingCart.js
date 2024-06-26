import React from "react";
import "../css/ShoppingCart.css";
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import Slider from "react-slick";

// This is the shoppingcart page for that displays items in cart
const ShoppingCart = () => {

    const cartItems = [
        {
            id: 1,
            image: 'products/product0.png',
            title: 'Media 360 Promotional Package - Basic',
            description: 'Lorem ipsum dolor sit amet consectetur. Praesent ultrices auctor fames id.',
            price: 500,
            qty: 1,
        },
        {
            id: 2,
            image: 'products/product1.png',
            title: 'Lorem ipsum dolor sit amet consectetur.',
            description: 'Lorem ipsum dolor sit amet consectetur. Praesent ultrices auctor fames id.',
            price: 800,
            qty: 1,
        },
        {
            id: 3,
            image: 'products/product2.png',
            title: 'Lorem ipsum dolor sit amet consectetur.',
            description: 'Lorem ipsum dolor sit amet consectetur. Praesent ultrices auctor fames id.',
            price: 1200,
            qty: 1,
        }
    ];

    const recommendations = [
        { id: 1, image: 'products/product3.png', title: 'Recommended Product 1' },
        { id: 2, image: 'products/product4.png', title: 'Recommended Product 2' },
        { id: 3, image: 'products/product5.png', title: 'Recommended Product 3' },
        { id: 4, image: 'products/product6.png', title: 'Recommended Product 4' },
        { id: 5, image: 'products/product7.png', title: 'Recommended Product 5' },
    ];

    // Slick Slider settings
    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 3,
        speed: 500
    };

    // const CartAndCheckout = () => {
    //     const settings = {
    //         dots: true,
    //         infinite: true,
    //         speed: 500,
    //         slidesToShow: 3,
    //         slidesToScroll: 1
    //     };

    return (
        <Container>
            <h4>Select All</h4>
            <Row>
                <Col md={8}>
                    {cartItems.map(item => (
                        <Card key={item.id} className="mb-3 cart-item">
                            <Row noGutters>
                                <Col md={4}>
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
                                                        <Form.Control as="select" defaultValue={item.qty}>
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
                                                <p className="cart-price">${item.price.toLocaleString()}</p>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                </Col>
                            </Row>
                        </Card>
                    ))}
                </Col>
                <Col md={4}>
                    <h5>Order Summary</h5>
                    <p>Item Quantity: {cartItems.length}</p>
                    <p>Total Price: ${cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toLocaleString()}</p>
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
