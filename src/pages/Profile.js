import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { Container, Row, Col, Modal, Button, Form, Alert } from 'react-bootstrap';
import { AuthContext } from "../context/AuthContext";
import "../css/Profile.css";

const Profile = () => {
    const { user, setUser } = useContext(AuthContext);
    const [show, setShow] = useState(false);
    const [username, setUsername] = useState(null);
    const [bio, setBio] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [warning, setWarning] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [avatarUrl, setAvatarUrl] = useState(null);

    // Load Backend Host for API calls
    const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;
    // Maximum length for fields
    const maxNameLen = 16;
    const maxBioLen = 500;

    // Recompute the avatar URL whenever the user or user.avatar changes
    useEffect(() => {
        if (user && user.avatar) {
            // Update avatarUrl whenever user's avatar changes
            setAvatarUrl(`${BACKEND_HOST}${user.avatar.url}`);
        } else {
            setAvatarUrl("default-avatar.jpg");
        }
    }, [BACKEND_HOST, user]);

    const handleFileChange = (e) => {
        setAvatar(e.target.files[0]);
    };

    const openEdit = () => {
        setUsername(user.username);
        setBio(user.bio);
        setShow(true);
    };

    const closeEdit = () => {
        setShow(false);
    };

    const handleUsernameChange = (value) => {
        if (value.length <= maxNameLen) {
            setUsername(value);
        }
    };

    const handleBioChange = (value) => {
        if (value.length <= maxBioLen) {
            setBio(value);
        }
    };

    const handleSave = async () => {
        if (username === user.username && bio === user.bio && avatar == null) {
            // Close modal for no change to save API call consumptions
            closeEdit();
        }
        try {
            const token = Cookies.get("token");

            // First, upload the avatar if a new file is selected
            let avatarId = user.avatar?.id;
            if (avatar && avatar !== null) {
                const formData = new FormData();
                formData.append('files', avatar);

                const uploadRes = await axios.post(`${BACKEND_HOST}/api/upload`, formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });

                avatarId = uploadRes.data[0].id; // Get the uploaded image ID
            }

            // Then, update the user profile
            const res = await axios.put(`${BACKEND_HOST}/api/users/${user.id}`, {
                username,
                bio,
                avatar: avatarId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Update the user in the context
            setUser(res.data);

            // Close modal on success
            closeEdit();
        } catch (error) {
            console.error('Error saving user profile:', error.response?.data || error.message);
            setErrorMessage('Error saving profile. Please try again.');
        }
        window.location.reload(); // force reload to get newest changes
    };

    const handleCancel = () => {
        if (username !== user.username || bio !== user.bio || avatar !== null) {
            setWarning(true); // Show warning if changes have been made
        } else {
            closeEdit(); // Just close if no changes were made
        }
    };

    const handleDiscardChanges = () => {
        // Close the modal and discard all changes
        setWarning(false);
        closeEdit();
    };

    return (
        <Container className="mt-5 profile-container">

            <Row md={8} className="profile-intro-row">
                {/* Profile Image */}
                <Col xs={3}>
                    <img
                        src={avatarUrl}
                        alt="Profile"
                        className="img-fluid rounded-circle profile-avatar"
                    />
                </Col>
                {/* User Details */}
                {user ? (
                    <Col xs={9}>
                        <div className="d-flex justify-content-between align-items-center">
                            <h3 className="mb-0">{user.username}</h3>
                            <Button variant="link" className="text-primary" onClick={openEdit}>Edit</Button>
                        </div>
                        <p className="text-muted mt-2">
                            {user.bio}
                        </p>
                    </Col>
                ) : (
                    <Col xs={9}>
                        <h2>Loading...</h2>
                    </Col>
                )}
            </Row>

            <Modal show={show} onHide={handleCancel}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                    <Form>
                        <Form.Group controlId="formUsername">
                            <Form.Label>Username</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => handleUsernameChange(e.target.value)}
                                placeholder="Wish to have a new name for your account?"
                                maxLength={maxNameLen}
                            />
                        </Form.Group>
                        <Form.Group controlId="formBio" className="mt-3">
                            <Form.Label>Bio</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={bio}
                                onChange={(e) => handleBioChange(e.target.value)}
                                placeholder="Rewrite a short bio"
                                maxLength={maxBioLen}
                            />
                        </Form.Group>
                        <Form.Group controlId="formAvatar" className="mt-3">
                            <Form.Label>Profile Picture</Form.Label>
                            <Form.Control
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                            />
                            <Form.Text id="AvatarHint" muted>
                                Please select a square-shaped image for best looking~
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCancel}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Warning modal for discarding changes */}
            <Modal show={warning} onHide={() => setWarning(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Discard Changes?</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    You have unsaved changes. Are you sure you want to discard them?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setWarning(false)}>
                        Continue Editing
                    </Button>
                    <Button variant="danger" onClick={handleDiscardChanges}>
                        Discard Changes
                    </Button>
                </Modal.Footer>
            </Modal>

        </Container>
    );
}

export default Profile;
