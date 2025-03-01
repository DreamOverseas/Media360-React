import axios from "axios";
import React, { useState, useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../css/ProductRelatedProduct.css"

const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const ProductRelatedProduct = () => {
  const location = useLocation();
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

  return (
    <Container className="related-product-container">
      <h2 >{t("relatedProducts")}</h2>
      <Row>
        {relatedProduct.length > 0 ? (
          relatedProduct.map(product => {
            const tag = product.product_tags
            return (
              <Col key={product.id} xs={12} sm={6} md={4}>
                <ProductCard 
                  product = {product}
                  tag = {tag}
                  BACKEND_HOST = {BACKEND_HOST} 
                  i18n = {i18n}
                  t = {t}
                />
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

export default ProductRelatedProduct;
