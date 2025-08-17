import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import Cookies from "js-cookie";
import { Container, Row, Col, Modal, Button, Form, Alert, Nav } from 'react-bootstrap';
import { AuthContext } from "../context/AuthContext.jsx";
import "../css/Profile.css";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [warning, setWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(null);

  // 修改密码相关
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
  const maxNameLen = 16;
  const maxBioLen = 500;

  useEffect(() => {
    if (user && user.avatar) {
      setAvatarUrl(`${BACKEND_HOST}${user.avatar.url}`);
    } else {
      setAvatarUrl("default-avatar.jpg");
    }
  }, [BACKEND_HOST, user]);

  const handleFileChange = (e) => setAvatar(e.target.files[0]);

  const openEdit = () => {
    setUsername(user.username);
    setBio(user.bio);
    setShow(true);
  };

  const closeEdit = () => setShow(false);

  const handleUsernameChange = (value) => value.length <= maxNameLen && setUsername(value);
  const handleBioChange = (value) => value.length <= maxBioLen && setBio(value);

  const handleSave = async () => {
    if (username === user.username && bio === user.bio && avatar == null) {
      closeEdit();
    }
    try {
      const token = Cookies.get("token");
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
        avatarId = uploadRes.data[0].id;
      }

      const res = await axios.put(`${BACKEND_HOST}/api/users/${user.id}`, {
        username,
        bio,
        avatar: avatarId,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      closeEdit();
    } catch (error) {
      setErrorMessage('Error saving profile. Please try again.');
    }
    window.location.reload();
  };

  const handleCancel = () => {
    if (username !== user.username || bio !== user.bio || avatar !== null) {
      setWarning(true);
    } else {
      closeEdit();
    }
  };

  const handleDiscardChanges = () => {
    setWarning(false);
    closeEdit();
  };

  // 修改密码
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg('');

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg('请填写所有字段');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg('两次新密码输入不一致');
      return;
    }

    try {
      const token = Cookies.get("token");
      await axios.post(`${BACKEND_HOST}/api/auth/change-password`, {
        currentPassword: oldPassword,
        password: newPassword,
        passwordConfirmation: confirmPassword,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPasswordMsg('密码修改成功');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordMsg('密码修改失败，请检查原密码是否正确');
    }
  };

  return (
    <Container className="profile-dashboard-container py-4" style={{ minHeight: "80vh" }}>
      {/* 关键：同一行并置、顶部对齐 */}
      <Row className="gx-4 align-items-start">
        {/* 左侧菜单 */}
        <Col md={3} className="dashboard-sidebar">
          <div className="sidebar-menu">
            <div className="sidebar-avatar text-center mb-4">
              <img
                src={avatarUrl}
                alt="Profile"
                className="img-fluid rounded-circle profile-avatar"
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
              <div className="mt-2">{user?.username}</div>
            </div>

            <Nav
              variant="pills"
              className="flex-column"
              activeKey={activeTab}
              onSelect={setActiveTab}
            >
              <Nav.Item>
                <Nav.Link eventKey="profile">个人信息</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="password">修改密码</Nav.Link>
              </Nav.Item>
            </Nav>
          </div>
        </Col>

        {/* 右侧内容：去掉顶部外边距，紧邻左侧 */}
        <Col md={9} className="dashboard-content mt-0">
          {activeTab === "profile" && (
            <div className="profile-info-section" style={{ marginTop: 0 }}>
              <div className="d-flex justify-content-between align-items-center">
                <h3>个人信息</h3>
                <Button variant="primary" onClick={openEdit}>编辑</Button>
              </div>
              <hr />
              <Row>
                <Col md={3}><strong>用户名：</strong></Col>
                <Col md={9}>{user?.username}</Col>
              </Row>
              <Row className="mt-2">
                <Col md={3}><strong>简介：</strong></Col>
                <Col md={9}>{user?.bio}</Col>
              </Row>
            </div>
          )}

          {activeTab === "password" && (
            <div className="password-section">
              <h3>修改密码</h3>
              <hr />
              <Form onSubmit={handlePasswordChange}>
                <Form.Group className="mb-3" controlId="oldPassword">
                  <Form.Label>原密码</Form.Label>
                  <Form.Control
                    type="password"
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="newPassword">
                  <Form.Label>新密码</Form.Label>
                  <Form.Control
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                  <Form.Label>确认新密码</Form.Label>
                  <Form.Control
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>

                {passwordMsg && (
                  <Alert variant={passwordMsg.includes('成功') ? "success" : "danger"}>
                    {passwordMsg}
                  </Alert>
                )}

                <Button variant="primary" type="submit">保存</Button>
              </Form>
            </div>
          )}
        </Col>
      </Row>

      {/* 编辑个人信息弹窗 */}
      <Modal show={show} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>编辑个人信息</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>用户名</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder="请输入用户名"
                maxLength={maxNameLen}
              />
            </Form.Group>

            <Form.Group controlId="formBio" className="mt-3">
              <Form.Label>简介</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bio}
                onChange={(e) => handleBioChange(e.target.value)}
                placeholder="请输入简介"
                maxLength={maxBioLen}
              />
            </Form.Group>

            <Form.Group controlId="formAvatar" className="mt-3">
              <Form.Label>头像</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Form.Text muted>建议选择方形图片以获得最佳显示效果</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>取消</Button>
          <Button variant="primary" onClick={handleSave}>保存</Button>
        </Modal.Footer>
      </Modal>

      {/* 放弃更改警告弹窗 */}
      <Modal show={warning} onHide={() => setWarning(false)}>
        <Modal.Header closeButton>
          <Modal.Title>放弃更改？</Modal.Title>
        </Modal.Header>
        <Modal.Body>你有未保存的更改，确定要放弃吗？</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setWarning(false)}>继续编辑</Button>
          <Button variant="danger" onClick={handleDiscardChanges}>放弃更改</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;