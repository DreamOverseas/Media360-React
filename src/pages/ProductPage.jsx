import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import "../css/ProductPage.css";

// Load Backend Host for API calls
const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const ProductPage = () => {
  const [products, setProducts] = useState([]); // List of products
  const [error, setError] = useState(null); // Error state
  const [page, setPage] = useState(1); // Current page number
  const [loading, setLoading] = useState(false); // Loading state
  const [hasMore, setHasMore] = useState(true); // Whether there are more products to load
  const observer = useRef(); // Ref for observing the last product element
  const { i18n } = useTranslation();

  // Function to fetch products
  const fetchProducts = pageNum => {
    setLoading(true);
    axios
      .get(`${BACKEND_HOST}/api/products`, {
        params: {
          "pagination[page]": pageNum,
          "pagination[pageSize]": 8, // Load 8 products per page
          sort: "Order:desc",
          "filters[$or][0][MainCollectionProduct][$eq]": true,
          "filters[$or][1][SingleProduct][$eq]": true,
          populate: "*",
        },
      })
      .then(response => {
        if (response.data && response.data.data) {
          setProducts(prevProducts => [...prevProducts, ...response.data.data]);
          setHasMore(
            response.data.meta.pagination.page <
              response.data.meta.pagination.pageCount
          ); // Check if more products are available
        } else {
          setHasMore(false); // If no more products, set to false
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      })
      .finally(() => {
        setLoading(false); // Stop loading after data is fetched
      });
  };

  // Fetch data when the page loads or when the page number changes
  useEffect(() => {
    fetchProducts(page); // Load first page on initial load
  }, [page]);

  // Ref to track the last product in the list
  const lastProductElementRef = useRef();

  // Use IntersectionObserver to detect when the user scrolls to the last product
  useEffect(() => {
    if (loading) return; // Skip if currently loading
    if (!hasMore) return; // Stop if there are no more products to load

    const observerCallback = entries => {
      if (entries[0].isIntersecting) {
        setPage(prevPage => prevPage + 1); // Increment page when the last product comes into view
      }
    };

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0, // Trigger when the last product is fully visible
    };

    observer.current = new IntersectionObserver(
      observerCallback,
      observerOptions
    );

    if (lastProductElementRef.current) {
      observer.current.observe(lastProductElementRef.current); // Observe the last product
    }

    return () => {
      if (observer.current && lastProductElementRef.current) {
        // eslint-disable-next-line react-hooks/exhaustive-deps
        observer.current.unobserve(lastProductElementRef.current); // Cleanup the observer
      }
    };
  }, [loading, hasMore]);

  const language = i18n.language;

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      {/* <Container className='product-page-background-image-container'>
        <h1 className='product-page-banner-h1'>
          <b>{t("product")}</b>
        </h1>
      </Container> */}
      <Container>
        <Row>
          {products.map((product, index) => {
            const isLastElement = index === products.length - 1; // Check if it's the last product
            const Name = language === "zh" ? product.Name_zh : product.Name_en;
            const CollectionName = language === "zh" ? product.Collection_Name_zh : product.Collection_Name_en;
            return (
              <Col
                key={product.id}
                xs={6} // 2 items per row on extra small devices (optional)
                sm={4} // 3 items per row on small devices
                md={3} // 4 items per row on medium devices and above
                className='mb-4'
                ref={isLastElement ? lastProductElementRef : null} // Attach ref to the last product
              >
                <Link
                  to={`/products/${product.url}`}
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
                      <Card.Title title={product.MainCollectionProduct ? CollectionName : Name}>
                        {product.MainCollectionProduct ? CollectionName : Name}
                      </Card.Title>

                      {product.MainCollectionProduct && (
                        <Card.Text>
                          {product.Short_zh}
                        </Card.Text>
                      )}

                      <p className="productpage-product-price">
                        {product.MainCollectionProduct || product.Price_Display === 0 || product.Price_Display === null
                          ? null
                          : `AU$${product.Price_Display}`}
                      </p>
                      
                    </Card.Body>
                  </Card>
                </Link>
              </Col>
            );
          })}
        </Row>
        {loading && <div>Loading more products...</div>}{" "}
        {/* Show loading text when fetching more products */}
      </Container>
    </div>
  );
};

export default ProductPage;
