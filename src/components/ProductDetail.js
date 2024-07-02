import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../css/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:1338/api/products/${id}`)
      .then(response => {
        if (response.data && response.data.data) {
          setProduct(response.data.data);
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

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className='product-detail'>
      <h2>{product.attributes.Name}</h2>
      <p>Price: {product.attributes.Price}</p>
      <div className='description'>
        <h3>Description:</h3>
        {product.attributes.Description.map((desc, index) => (
          <p key={index}>{desc.children.map(child => child.text).join(" ")}</p>
        ))}
      </div>
    </div>
  );
};

export default ProductDetail;
