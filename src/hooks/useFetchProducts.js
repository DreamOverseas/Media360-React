import axios from "axios";
import { useEffect, useState } from "react";

const useFetchProducts = url => {
  const [products, setProducts] = useState(null); // Initial state set to null
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(url)
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
  }, [url]);

  return { products, error };
};

export default useFetchProducts;
