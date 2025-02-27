import React from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";


const RelatedProductPage = ({ related_product, language }) => {
    const { t, i18n } = useTranslation();
    const language = i18n.language;

    return (
      <Container>
        <Row>
          {related_product.map(product => {
            const Name = language === "zh" ? product.Name_zh : product.Name_en;

            const ShortDescription =
              language === "zh" ? product.Short_zh : product.Short_en;
            return (
              <Col key={product.id} xs={12} sm={6} md={4}>
                <Link
                  to={`/product/${product.url}`}
                  onClick={e => {
                    e.preventDefault();
                    navigate(`/product/${product.url}`);
                    window.location.reload();
                  }}
                  className='card-link-ProductPage'
                >
                  <Card className='productpage-product-card'>
                    {product.ProductImage ? (
                      <Card.Img
                        variant='top'
                        src={`${BACKEND_HOST}${product.ProductImage.url}`}
                        alt={Name}
                      />
                    ) : (
                      <Card.Img
                        variant='top'
                        src='https://placehold.co/250x350'
                        fluid
                        alt='Placeholder'
                      />
                    )}
                    <Card.Body>
                      <Card.Title title={Name}>{Name}</Card.Title>
                      <p className='product-short-description'>
                        {ShortDescription}
                      </p>
                      <p className='productpage-product-price'>
                        {" "}
                        {/* class 改为 className */}
                        {product.Price === 0
                          ? t("price_tbd")
                          : `AU${product.Price}`}
                      </p>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
      </Container>
    );
  };

  export default RelatedProductPage;
