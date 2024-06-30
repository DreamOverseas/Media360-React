import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/KolPage.css";

const KolPage = () => {
  const [kols, setKols] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:1337/api/kols?populate=*")
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

  return (
    <Container className='kol-container'>
      <Row>
        {kols.map(kol => (
          <Col
            key={kol.id}
            sm={12}
            md={6}
            lg={4}
            className='kol-card-container'
          >
            <Link to={`/kol/${kol.id}`}>
              <Card className='kol-card'>
                <Card.Img variant='top' src='https://placehold.co/300x300' />
                <Card.Body>
                  <Card.Title>{kol.attributes.Name}</Card.Title>
                  <Card.Text>{kol.attributes.Title}</Card.Text>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default KolPage;
