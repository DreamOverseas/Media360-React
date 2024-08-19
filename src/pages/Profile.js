import React, { useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
    const { user } = useContext(AuthContext);

    return (
        <Container className="mt-5 profile-container">
            <br /><br /><br />
            <Row md={8} className="profile-intro-row">
                {/* Profile Image */}
                <Col xs={3}>
                    <img
                        src="https://via.placeholder.com/150"
                        alt="Profile"
                        className="img-fluid rounded-circle"
                    />
                </Col>
                {/* User Details */}
                {user ? (
                    <Col xs={9}>
                        <div className="d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">{user.username}</h4>
                            <Button variant="link" className="text-primary">Edit</Button>
                        </div>
                        <p className="text-muted mt-2">
                            Lorem ipsum dolor sit amet consectetur. Enim sit non nunc hac quam tristique.
                            Id mauris ut purus sed elementum et mauris. Sit volutpat rhoncus urna mi purus enim.
                            Elit mattis eu semper sollicitudin.
                        </p>
                    </Col>
                ) : (
                    <Col xs={9}>
                        <h2>Please Log in</h2>
                    </Col>
                )}
            </Row>
            <br /><br /><br />
        </Container>
    );
}

export default Profile;
