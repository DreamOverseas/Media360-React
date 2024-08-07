import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Col, Container, Image, Row, Modal } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import 'bootstrap-icons/font/bootstrap-icons.css';
import "../css/KolDetail.css";

const KolDetail = () => {
  const { id } = useParams();
  const [kol, setKol] = useState(null);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    axios
      .get(`http://api.meetu.life/api/kols/${id}?populate[KolImage]=*&populate[Products][populate]=*`)
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

  const { Name, Title, Description, KolImage, Products} = kol.attributes;

  if (!Products || !Products.data) {
    return <div>No products available</div>;
  }

  const handleContact = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const renderDescription = (description) => {
    if (description != null) {
      return description
    }
  };

  return (
    <div>
      <section className="kol-detail-background-image-container">
        <h1 className="kol-detail-banner-h1"><b>Our People</b></h1>
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
                    <Button onClick={handleContact}>Contact Now</Button>
                  </Col>
                  <Col className="d-flex align-items-center">
                    <i className="bi bi-wechat contact-icon"></i>
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col className="kol-image-col">
              {KolImage && KolImage.data ? (
                <Image src={`http://api.meetu.life${KolImage.data.attributes.url}`} alt={Name} />
              ) : (
                <Image src='https://placehold.co/650x650' alt='Placeholder' />
              )}
            </Col>
          </Row>

          <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
              <Modal.Title>{Name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <p>Please scan the QR code and directly contact with the Kol</p>
              </Row>
              <Row className="purchase-modal-background">
                <Image src="/QR_placeholder.png" alt="Logo" fluid />
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button variant='secondary' onClick={handleCloseModal}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </Container>
      </section>
      <br />
      <br />
      <section>
        <Container fluid>
          <Row>
            <Col md={5}>
              <hr />
            </Col>
            <Col md={2} className="d-flex justify-content-center align-items-center">
              <h5>Highlight Products</h5>
            </Col>
            <Col md={5}>
              <hr />
            </Col>
          </Row>
        </Container>
        <br />
      </section>
      <Container className='kol-detail-container'>
        <Row>
          {Products.data.length > 0 ? (
            Products.data.map(product => (
              <Col key={product.id} sm={12} md={6} lg={4}>
                <Link to={`/product/${product.id}`} className="card-link-highlight">
                  <Card className='kol-product-card'>
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
                </Link>
              </Col>
            ))
          ) : (
            <p>No products available</p>
          )}
        </Row>
      </Container>
      <br />
    </div>
  );
};

export default KolDetail;
