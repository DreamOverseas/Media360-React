import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../css/ProductCard.css";

const ProductCard = ({ product, tag, BACKEND_HOST, i18n, t }) => {
  const navigate = useNavigate();

  const Name = i18n.language === "zh" ? product.Name_zh : product.Name_en;
  const ShortDescription = i18n.language === "zh" ? product.Short_zh : product.Short_en;
  const imageUrl = product.ProductImage ? `${BACKEND_HOST}${product.ProductImage.url}` : "https://placehold.co/250x350";
  const tags = tag.slice(0,3)

  const handleClick = (e) => {
    e.preventDefault();
    navigate(`/product/${product.url}`);
    window.location.reload();
  };

  return (
    <Link to={`/product/${product.url}`} onClick={handleClick} className="general-product-card-link-decoration">
      <Card className="general-product-card">
        <Card.Img variant="top" src={imageUrl} alt={Name} />
        <Card.Body>
          <Card.Title title={Name}>{Name}</Card.Title>
            <Card.Text>{ShortDescription}</Card.Text>
            <p>{product.Price === 0 ? t("price_tbd") : `AU${product.Price}`}</p>
            <Row>
                {tags && tags.length > 0 ? (
                    tags.map((tag, index) => {
                    const label = i18n.language === "zh" ? tag.Tag_zh : tag.Tag_en;
                    return (
                        <Col key={index} className="general-product-card-tag-col">
                            <button className="general-product-card-tag-label">{label}</button>
                        </Col>
                    );
                    })
                ) : null}
            </Row>
        </Card.Body>
      </Card>
    </Link>
  );
};

export default ProductCard;