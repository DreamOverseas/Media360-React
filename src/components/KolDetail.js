import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row, Modal } from "react-bootstrap";
import { useParams } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../css/KolDetail.css";

const KolDetail = () => {
  const { id } = useParams();
  const [kol, setKol] = useState(null);
  const [error, setError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get(`http://http://api.meetu.life:1337/api/kols/${id}?populate=products`)
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

  const { Name, Title, Description, Image: KolImage, products } = kol.attributes;

  if (!products || !products.data) {
    return <div>No products available</div>;
  }

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const renderDescription = (description) => {
    if (!Array.isArray(description)) {
      return <span>{description}</span>;
    }
    return description.map((desc, index) => (
      <React.Fragment key={index}>
        {desc.children.map((child, idx) => (
          <span key={idx}>{child.text}</span>
        ))}
      </React.Fragment>
    ));
  };

  return (
    <div>
      <section className="kol-detail-background-image-container">
        <h1 className = "kol-detail-banner-h1"><b>Our People</b></h1>
      </section>
      <br />
      <section>
        <Container>
          <Row className="kol-detail-section">
              <Col>
                <Container className="kol-detail">
                  <Row>
                    <h1>{Name}</h1>
                    <h2>{Title}</h2>
                  </Row>
                  <Row>
                      <p>
                        {Description ? renderDescription(Description) : "No description available"}
                      </p>
                  </Row> 
                  <Row className="kol-detail-contact">
                    <Col md={6}>
                      <Button>Contact Now</Button>
                    </Col>
                    <Col md={6} className="d-flex align-items-center">
                      <i class="bi bi-wechat"></i>
                    </Col>
                  </Row>
                </Container>
              </Col>
              <Col md={5}>
                {KolImage && KolImage.data ? (<Image src={KolImage.data.attributes.url} alt={Name} fluid />) : 
                (<Image src='https://placehold.co/500x600' alt='Placeholder' fluid />)}
              </Col>
          </Row>
        </Container>
      </section>
      <br></br>
      <br></br>
      <div className="kol-product">
        <hr></hr>
        <div className="kol-product-text-block">
            <h4>Product Recommendation</h4>
        </div>
      </div>
      <Container className='kol-detail-container'>
        <Row>
          {products.data.length > 0 ? (
            products.data.map(product => (
              <Col key={product.id} sm={12} md={6} lg={4}>
                <Card className='product-card' onClick={() => handleProductClick(product)}>
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
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No products available</p>
          )}
        </Row>

        {/* Product Detail Modal */}
        {selectedProduct && (
          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{selectedProduct.attributes.Name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedProduct.attributes.Image && selectedProduct.attributes.Image.data ? (
                <Image src={selectedProduct.attributes.Image.data.attributes.url} alt={selectedProduct.attributes.Name} fluid />
              ) : (
                <Image src='https://placehold.co/300x300' alt='Placeholder' fluid />
              )}
              <p>Price: ${selectedProduct.attributes.Price}</p>
              <p>
                {selectedProduct.attributes.Description
                  ? renderDescription(selectedProduct.attributes.Description)
                  : "No description available"}
              </p>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </Container>
    </div>
    
  );
};

export default KolDetail;
