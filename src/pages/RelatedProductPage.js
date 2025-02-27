import axios from "axios";
import React, { useState, useEffect } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link, useNavigate, useLocation } from "react-router-dom";

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const RelatedProductPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [relatedProduct, setRelatedProduct] = useState([]); 
  const { t, i18n } = useTranslation();
  const [Product, setProduct] = useState(location.state?.product || []); 

  const productTag = Product.product_tags ? Product.product_tags.map(tag => tag.Tag_en) : [];

  useEffect(() => {
    if (!Product || !Product.product_tags || productTag.length === 0) return;

    axios
      .get(`${BACKEND_HOST}/api/products/?populate=*`)
      .then(res => {
        console.log("API Response:", res.data);
        const allProducts = res.data.data;
        computeRecommendations(allProducts, Product, productTag);
      })
      .catch(error => {
        console.error("Error fetching products:", error);
      });
  }, [Product]);


  const computeRecommendations = (allProducts, product, currentTags) => {
    if (!allProducts || !product || !currentTags) return;

    const tagSet = new Set(currentTags);

    const rankedProducts = allProducts
      .map(prod => {
        const productTags = prod.product_tags?.map(tag => tag.Tag_en) ?? [];
        const matchCount = productTags.filter(tag => tagSet.has(tag)).length;
        return { ...prod, matchCount };
      })
      .filter(prod => prod.matchCount > 0 && prod.Name_en !== product.Name_en)
      .sort((a, b) => b.matchCount - a.matchCount);

    setRelatedProduct(rankedProducts);
  };

  console.log("related", relatedProduct);

  return (
    <Container>
      <Row>
        {relatedProduct.length > 0 ? (
          relatedProduct.map(product => {
            const Name = i18n.language === "zh" ? product.Name_zh : product.Name_en;
            const ShortDescription = i18n.language === "zh" ? product.Short_zh : product.Short_en;

            return (
              <Col key={product.id} xs={12} sm={6} md={4}>
                <Link
                  to={`/product/${product.url}`}
                  onClick={e => {
                    e.preventDefault();
                    navigate(`/product/${product.url}`);
                    window.location.reload();
                  }}
                  className="card-link-ProductPage"
                >
                  <Card className="productpage-product-card">
                    {product.ProductImage ? (
                      <Card.Img variant="top" src={`${BACKEND_HOST}${product.ProductImage.url}`} alt={Name} />
                    ) : (
                      <Card.Img variant="top" src="https://placehold.co/250x350" fluid alt="Placeholder" />
                    )}
                    <Card.Body>
                      <Card.Title title={Name}>{Name}</Card.Title>
                      <p className="product-short-description">{ShortDescription}</p>
                      <p className="productpage-product-price">
                        {product.Price === 0 ? t("price_tbd") : `AU${product.Price}`}
                      </p>
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            );
          })
        ) : (
          <p>{t("No related products found")}</p>
        )}
      </Row>
    </Container>
  );
};

export default RelatedProductPage;
