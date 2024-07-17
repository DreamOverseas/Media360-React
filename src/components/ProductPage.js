// import React from "react";
// import { Link } from "react-router-dom";
// import "../css/Products.css";
// import useFetchProducts from "../hooks/useFetchProducts";

// const Products = () => {
//   const { products, error } = useFetchProducts(
//     "http://localhost:1337/api/products"
//   );

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (products === null) {
//     return <div>Loading...</div>; // Check for null before rendering
//   }

//   return (
//     <div className='products-container'>
//       {products.length > 0 ? (
//         products.map(product => (
//           <div key={product.id} className='product-card'>
//             <Link to={`/product/${product.id}`}>
//               <h2>{product.attributes.Name}</h2>
//             </Link>
//             <p>Price: {product.attributes.Price}</p>
//             <div className='description'>
//               <h3>Description:</h3>
//               {product.attributes.Description?.map((desc, index) => (
//                 <p key={index}>
//                   {desc.children.map(child => child.text).join(" ")}
//                 </p>
//               ))}
//             </div>
//           </div>
//         ))
//       ) : (
//         <div>No products found</div>
//       )}
//     </div>
//   );
// };

// export default Products;
import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "../css/ProductPage.css";

const ProductPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (location.pathname ==='/productStudy') {
      axios
      .get('http://api.meetu.life/api/products/', {
        params: {
          'filters[$or][0][MainCategory]': 'Study',
          'filters[$or][1][SubCategory]': 'Study',
          'populate': 'ProductImage'
        }
      })
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
    }

    if (location.pathname ==='/productFinance') {
      axios
      .get('http://api.meetu.life/api/products', {
        params: {
          'filters[$or][0][MainCategory]': 'Finance',
          'filters[$or][1][SubCategory]': 'Finance',
          'populate': 'ProductImage'
        }
      })
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
    }

    if (location.pathname ==='/productTravel') {
      axios
      .get('http://api.meetu.life/api/products', {
        params: {
          'filters[$or][0][MainCategory]': 'Travel',
          'filters[$or][1][SubCategory]': 'Travel',
          'populate': 'ProductImage'
        }
      })
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
    }

    if (location.pathname ==='/productLife') {
      axios
      .get('http://api.meetu.life/api/products', {
        params: {
          'filters[$or][0][MainCategory]': 'Life',
          'filters[$or][1][SubCategory]': 'Life',
          'populate': 'ProductImage'
        }
      })
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
    }
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
            <Link to={`/product/${product.id}`} className="card-link-ProductPage">
              <Card className='product-card'>
                {product.attributes.ProductImage && product.attributes.ProductImage.data ? (<Card.Img src={`http://api.meetu.life${product.attributes.ProductImage.data.attributes.url}`} alt={product.attributes.Name} />) : 
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
