import React from "react";
import { Link } from "react-router-dom";
import "../css/Products.css";
import useFetchProducts from "../hooks/useFetchProducts";

const Products = () => {
  const { products, error } = useFetchProducts(
    "http://localhost:1337/api/products"
  );

  if (error) {
    return <div>{error}</div>;
  }

  if (products === null) {
    return <div>Loading...</div>; // Check for null before rendering
  }

  return (
    <div className='products-container'>
      {products.length > 0 ? (
        products.map(product => (
          <div key={product.id} className='product-card'>
            <Link to={`/product/${product.id}`}>
              <h2>{product.attributes.Name}</h2>
            </Link>
            <p>Price: {product.attributes.Price}</p>
            <div className='description'>
              <h3>Description:</h3>
              {product.attributes.Description?.map((desc, index) => (
                <p key={index}>
                  {desc.children.map(child => child.text).join(" ")}
                </p>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div>No products found</div>
      )}
    </div>
  );
};

export default Products;
