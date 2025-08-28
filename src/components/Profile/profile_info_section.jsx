import { Button, Col, Row } from "react-bootstrap";

const ProfileInfoSection = ({ user, openEdit }) => {
  return (
    <div className='profile-info-section' style={{ marginTop: 0 }}>
      <div className='d-flex justify-content-between align-items-center'>
        <h3>个人信息</h3>
        <Button variant='primary' onClick={openEdit}>
          编辑
        </Button>
      </div>
      <hr />
      <Row>
        <Col md={3}>
          <strong>用户名：</strong>
        </Col>
        <Col md={9}>{user?.username}</Col>
      </Row>
      <Row className='mt-2'>
        <Col md={3}>
          <strong>简介：</strong>
        </Col>
        <Col md={9}>{user?.bio}</Col>
      </Row>
    </div>
  );
};

export default ProfileInfoSection;