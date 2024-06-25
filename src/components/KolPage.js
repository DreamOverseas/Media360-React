import axios from "axios";
import React, { useEffect, useState } from "react";
import "../css/KolPage.css";

const KolPage = () => {
  const [kols, setKols] = useState(null); // Initial state set to null
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/kols")
      .then(response => {
        if (response.data && response.data.data) {
          setKols(response.data.data);
        } else {
          setError("No data found");
        }
      })
      .catch(error => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      });
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  if (kols === null) {
    return <div>Loading...</div>; // Check for null before rendering
  }

  console.log(kols); // Add this line to debug data structure

  return (
    <div className='kol-page'>
      <div className='kol-container'>
        {kols.length > 0 ? (
          kols.map(kol => (
            <div key={kol.id} className='kol-card'>
              <img
                src='https://via.placeholder.com/150'
                alt={kol.attributes.Name}
              />
              <h2>{kol.attributes.Name}</h2>
              <p>{kol.attributes.Title}</p>
            </div>
          ))
        ) : (
          <div>No KOLs found</div>
        )}
      </div>
    </div>
  );
};

export default KolPage;
