import { useContext, useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import SellerCoupon from "../components/SellerCoupon.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import "../css/Profile.css";

// 导入拆分的组件
import ProfileSidebar from "../components/Profile/profile_sidebar.jsx";
import ProfileInfoSection from "../components/Profile/profile_info_section.jsx";
import PasswordSection from "../components/Profile/password_section.jsx";
import CouponDisplay from "../components/Profile/coupon_display.jsx";
import InfluencerProfileSection from "../components/Profile/influencer_profile_section.jsx";
import SellerCampaignsSection from "../components/Profile/seller_campaigns_section.jsx";
import ProfileEditModal from "../components/Profile/profile_edit_modal.jsx";

// 导入自定义hooks
import { useInfluencerProfile, useCoupons, useSellerData } from "../hooks/hooks_use_profile_data.jsx";
import { useProfileEdit } from "../hooks/hooks_use_profile_edit.jsx";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");

  // 使用自定义hooks管理状态
  const { inflLoading, inflError, influencerProfile } = useInfluencerProfile(user, BACKEND_HOST);
  const { couponList, couponLoading, couponError } = useCoupons(user, BACKEND_HOST);
  const { sellerData, sellerLoading, sellerError } = useSellerData(user, BACKEND_HOST);
  
  const profileEditProps = useProfileEdit(user, BACKEND_HOST, setUser);

  // 调试：观察 user/coupon 结构变化
  useEffect(() => {
    console.groupCollapsed("%c[Coupon] user change", "color:#6a5acd");
    console.log("[Coupon] user.id =", user?.id, "roletype =", user?.roletype);
    console.log("[Coupon] user.coupon =", user?.coupon);
    console.groupEnd();
  }, [user]);

  return (
    <Container
      className='profile-dashboard-container py-4'
      style={{ minHeight: "80vh" }}
    >
      <Row className='gx-4 align-items-start'>
        {/* 左侧菜单 */}
        <ProfileSidebar 
          user={user}
          avatarUrl={profileEditProps.avatarUrl}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {/* 右侧内容 */}
        <Col md={9} className='dashboard-content mt-0'>
          {activeTab === "profile" && (
            <ProfileInfoSection 
              user={user} 
              openEdit={profileEditProps.openEdit} 
            />
          )}

          {activeTab === "password" && (
            <PasswordSection BACKEND_HOST={BACKEND_HOST} />
          )}

          {activeTab === "influencer" && user?.roletype === "Influencer" && (
            <div className='influencer-section'>
              <h3>网红信息</h3>
              <hr />

              {/* 展示 coupon 信息 */}
              <CouponDisplay 
                couponList={couponList}
                couponLoading={couponLoading}
                couponError={couponError}
              />

              {/* 网红资料展示 */}
              <InfluencerProfileSection 
                inflLoading={inflLoading}
                inflError={inflError}
                influencerProfile={influencerProfile}
              />
            </div>
          )}

          {activeTab === "sellerCampaigns" && user?.roletype === "Influencer" && (
            <div className='seller-campaigns-section'>
              <h3>商家优惠</h3>
              <hr />
              <SellerCampaignsSection 
                sellerData={sellerData}
                sellerLoading={sellerLoading}
                sellerError={sellerError}
              />
            </div>
          )}

          {activeTab === "seller" && user?.roletype === "Seller" && (
            <div className='seller-section'>
              <h3>卖家信息</h3>
              <hr />
              <SellerCoupon user={user} />
            </div>
          )}
        </Col>
      </Row>

      {/* 编辑弹窗 */}
      <ProfileEditModal {...profileEditProps} />
    </Container>
  );
};

export default Profile;