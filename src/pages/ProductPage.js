import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import {Link} from "react-router-dom";
import "../css/ProductPage.css";

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const ProductPage = () => {
  // const location = useLocation();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // filter funtion for future extension
    // if (location.pathname ==='/productStudy') {
    //   axios
    //   .get(`${BACKEND_HOST}/api/products/`, {
    //     params: {
    //       'filters[$or][0][MainCategory]': 'Study',
    //       'filters[$or][1][SubCategory]': 'Study',
    //       'populate': 'ProductImage'
    //     }
    //   })
    //   .then(response => {
    //     if (response.data && response.data.data) {
    //       setProducts(response.data.data);
    //     } else {
    //       setError("No data found");
    //     }
    //   })
    //   .catch(error => {
    //     console.error("Error fetching data: ", error);
    //     setError("Error fetching data");
    //   });
    // }

    // if (location.pathname ==='/productFinance') {
    //   axios
    //   .get(`${BACKEND_HOST}/api/products`, {
    //     params: {
    //       'filters[$or][0][MainCategory]': 'Finance',
    //       'filters[$or][1][SubCategory]': 'Finance',
    //       'populate': 'ProductImage'
    //     }
    //   })
    //   .then(response => {
    //     if (response.data && response.data.data) {
    //       setProducts(response.data.data);
    //     } else {
    //       setError("No data found");
    //     }
    //   })
    //   .catch(error => {
    //     console.error("Error fetching data: ", error);
    //     setError("Error fetching data");
    //   });
    // }

    // if (location.pathname ==='/productTravel') {
    //   axios
    //   .get(`${BACKEND_HOST}/api/products`, {
    //     params: {
    //       'filters[$or][0][MainCategory]': 'Travel',
    //       'filters[$or][1][SubCategory]': 'Travel',
    //       'populate': 'ProductImage'
    //     }
    //   })
    //   .then(response => {
    //     if (response.data && response.data.data) {
    //       setProducts(response.data.data);
    //     } else {
    //       setError("No data found");
    //     }
    //   })
    //   .catch(error => {
    //     console.error("Error fetching data: ", error);
    //     setError("Error fetching data");
    //   });
    // }

    // if (location.pathname ==='/productLife') {
    //   axios
    //   .get(`${BACKEND_HOST}/api/products`, {
    //     params: {
    //       'filters[$or][0][MainCategory]': 'Life',
    //       'filters[$or][1][SubCategory]': 'Life',
    //       'populate': 'ProductImage'
    //     }
    //   })
    //   .then(response => {
    //     if (response.data && response.data.data) {
    //       setProducts(response.data.data);
    //     } else {
    //       setError("No data found");
    //     }
    //   })
    //   .catch(error => {
    //     console.error("Error fetching data: ", error);
    //     setError("Error fetching data");
    //   });
      axios
        .get(`${BACKEND_HOST}/api/products/?populate=*`)
        .then(response => {
          if (response.data && response.data.data) {
            setProducts(response.data.data);
          } else {
            setError("No data found");
          }
        })
        .catch(error => {
          console.error("Error fetching data: ", error);
          setError("Error fetching data");
        });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <Container className='kol-container'>
      <Row>
        {products.map(product => (
          <Col
            key={product.id}
            md={4}
            className='mb-4'
          >
            <Link to={`/product/${product.attributes.url}`} className="card-link-ProductPage">
              <Card className='product-card'>
                {product.attributes.ProductImage && product.attributes.ProductImage.data ? (<Card.Img src={`${BACKEND_HOST}${product.attributes.ProductImage.data.attributes.url}`} alt={product.attributes.Name} />) : 
                  (<Card.Img variant='top' src='https://placehold.co/250x350' fluid alt='Placeholder'/>)}
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
        ))}
      </Row>
    </Container>
  );
};

export default ProductPage;
