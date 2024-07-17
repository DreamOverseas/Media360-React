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
      .get(`http://api.meetu.life/api/kols/${id}?populate[KolImage]=*&populate[Products][populate]=*`)
      .then(response => {
        console.log(response.data.data)
        if (response.data && response.data.data) {
          setKol(response.data.data);
          console.log(kol +"nothing")
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

  const { Name, Title, Description, KolImage, Products} = kol.attributes;


  if (!Products || !Products.data) {
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
    // if (!Array.isArray(description)) {
    //   return <span>{description}</span>;
    // }
    // return description.map((desc, index) => (
    //   <React.Fragment key={index}>
    //     {desc.children.map((child, idx) => (
    //       <span key={idx}>{child.text}</span>
    //     ))}
    //   </React.Fragment>
    // ));
    if (description != null) {
      return description
    }
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
                    <h5>{Title}</h5>
                  </Row>
                  <Row className="kol-description">
                    <p>
                      {Description ? renderDescription(Description) : "No description available"}
                    </p>
                  </Row> 
                  <Row className="kol-contact">
                    <Col>
                      <Button>Contact Now</Button>
                    </Col>
                    <Col className="d-flex align-items-center">
                      <i class="bi bi-wechat contact-icon"></i>
                    </Col>
                  </Row>
                </Container>
              </Col>
              <Col className="kol-image-col">
                {KolImage && KolImage.data ? (<Image src={`http://api.meetu.life${KolImage.data.attributes.url}`} alt={Name} />) : 
                (<Image src='https://placehold.co/650x650' alt='Placeholder'/>)}
              </Col>
          </Row>
        </Container>
      </section>
      <br></br>
      <br></br>
      <section>
        <Container fluid>
          <Row>
            <Col md={5}>
            <hr></hr>
            </Col>
            <Col md={2} className="d-flex justify-content-center align-items-center">
              <h5>Product Recommendation</h5>
            </Col>
            <Col md={5}>
            <hr></hr>
            </Col>
          </Row>
        </Container>
        <br></br>
      </section>
      <Container className='kol-detail-container'>
        <Row>
          {Products.data.length > 0 ? (
            Products.data.map(product => (
              <Col key={product.id} sm={12} md={6} lg={4}>
                <Card className='kol-product-card' onClick={() => handleProductClick(product)}>
                  {product.attributes && product.attributes.ProductImage ? (
                    <Card.Img
                      variant='top'
                      src={`http://api.meetu.life${product.attributes.ProductImage.data.attributes.url}`}
                    />
                  ) : (
                    <Card.Img variant='top' src='https://placehold.co/300x300' />
                  )}
                  <Card.Body>
                  <Card.Title 
                        style={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '18px'
                            }}
                        title={product.attributes.Name}>
                        {product.attributes.Name}
                    </Card.Title>
                    <Card.Text style={{
                            display: '-webkit-box',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '14px',
                            WebkitLineClamp: 4,
                            WebkitBoxOrient: 'vertical'
                            }}
                        title={product.attributes.Description}>
                        {product.attributes.Description}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <p>No products available</p>
          )}
        </Row>
        <br></br>

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
