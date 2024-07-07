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
      .get("http://192.168.20.91:1337/api/kols?populate=*")
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
            md={4}
            className='mb-4'
          >
            <Link to={`/kol/${kol.id}`}>
              <Card className='kol-card'>
                <Card.Img variant='top' src='https://placehold.co/300x300' fluid />
                  <Card.Body>
                    <Card.Title 
                        style={{
                            whiteSpace: 'nowrap',
                            height: '30px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '18px'
                            }}
                        title={kol.attributes.Name}>
                        {kol.attributes.Name}
                    </Card.Title>
                    <Card.Text style={{
                            whiteSpace: 'nowrap',
                            height: '20px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '14px'
                            }}
                        title={kol.attributes.Title}>
                        {kol.attributes.Title}
                    </Card.Text>
                    <Card.Text style={{
                            whiteSpace: 'nowrap',
                            height: '20px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: '14px'
                            }}
                        title={kol.attributes.Description}>
                        {kol.attributes.Title}
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

export default KolPage;
