import { Col, Nav } from "react-bootstrap";

const ProfileSidebar = ({ user, avatarUrl, activeTab, setActiveTab }) => {
  return (
    <Col md={3} className='dashboard-sidebar'>
      <div className='sidebar-menu'>
        <div className='d-flex flex-column align-items-center sidebar-avatar text-center mb-4'>
          <img
            src={avatarUrl}
            alt='Profile'
            className='img-fluid rounded-circle profile-avatar'
            style={{ width: 100, height: 100, objectFit: "cover" }}
          />
          <div className='mt-2'>{user?.username}</div>
        </div>
        <Nav
          variant='pills'
          className='flex-column'
          activeKey={activeTab}
          onSelect={setActiveTab}
        >
          <Nav.Item>
            <Nav.Link eventKey='profile'>个人信息</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey='password'>修改密码</Nav.Link>
          </Nav.Item>
          {user?.roletype === "Influencer" && (
            <Nav.Item>
              <Nav.Link eventKey='influencer'>网红信息</Nav.Link>
            </Nav.Item>
          )}
          {user?.roletype === "Influencer" && (
            <Nav.Item>
              <Nav.Link eventKey='sellerCampaigns'>商家优惠</Nav.Link>
            </Nav.Item>
          )}
          {user?.roletype === "Seller" && (
            <Nav.Item>
              <Nav.Link eventKey='seller'>卖家信息</Nav.Link>
            </Nav.Item>
          )}
        </Nav>
      </div>
    </Col>
  );
};

export default ProfileSidebar;