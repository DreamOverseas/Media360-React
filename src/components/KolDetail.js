import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row } from "react-bootstrap"; // Ensure Image is imported
import { useParams } from "react-router-dom";
import "../css/KolDetail.css";

const KolDetail = () => {
  const { id } = useParams();
  const [kol, setKol] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:1337/api/kols/${id}?populate=products`)
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
    return <div>Loading...</div>;
  }

  const { Name, Title, Description, Image: KolImage } = kol.attributes;
  const products = kol.attributes.products.data;

  return (
    <Container className='kol-detail-container'>
      <Row>
        <Col md={12} className='kol-header'>
          {KolImage && KolImage.data ? (
            <Image src={KolImage.data.attributes.url} alt={Name} fluid />
          ) : (
            <Image src='https://placehold.co/300x300' alt='Placeholder' fluid />
          )}
          <h1>{Name}</h1>
          <h2>{Title}</h2>
          <p>{Description ? Description : "No description available"}</p>
          <Button variant='primary'>Contact Now</Button>
          <div className='social-icons'>
            <i className='fab fa-twitter'></i>
            <i className='fab fa-instagram'></i>
            <i className='fab fa-facebook'></i>
          </div>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <h3>Product Recommendation</h3>
        </Col>
        {products.length > 0 ? (
          products.map(product => (
            <Col key={product.id} sm={12} md={6} lg={4}>
              <Card className='product-card'>
                {product.attributes.Image && product.attributes.Image.data ? (
                  <Card.Img
                    variant='top'
                    src={product.attributes.Image.data.attributes.url}
                  />
                ) : (
                  <Card.Img variant='top' src='https://placehold.co/300x300' />
                )}
                <Card.Body>
                  <Card.Title>{product.attributes.Name}</Card.Title>
                  <Card.Text>Price: ${product.attributes.Price}</Card.Text>
                  <Card.Text>
                    {product.attributes.Description
                      ? product.attributes.Description[0].children
                          .map(child => child.text)
                          .join(" ")
                      : "No description available"}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <p>No products available</p>
        )}
      </Row>
    </Container>
  );
};

export default KolDetail;
