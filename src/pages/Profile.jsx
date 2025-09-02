import { useContext, useEffect, useState } from "react";
import { User, Settings, Lock, Star, ShoppingBag, Edit3, Camera, Mail, Phone, MapPin, Calendar } from "lucide-react";
import SellerCoupon from "../components/SellerCoupon.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

// 导入拆分的组件
import PasswordSection from "../components/Profile/password_section.jsx";
import CouponDisplay from "../components/Profile/coupon_display.jsx";
import InfluencerProfileSection from "../components/Profile/influencer_profile_section.jsx";
import SellerCampaignsSection from "../components/Profile/seller_campaigns_section.jsx";
import ProfileEditModal from "../components/Profile/profile_edit_modal.jsx";
import SellerProfileSection from "../components/Profile/seller_profile_section.jsx";

// 导入自定义hooks
import { useInfluencerProfile, useCoupons, useSellerData } from "../hooks/hooks_use_profile_data.jsx";
import { useProfileEdit } from "../hooks/hooks_use_profile_edit.jsx";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

// 美化的侧边栏组件
const ProfileSidebar = ({ user, avatarUrl, activeTab, setActiveTab }) => {
  const menuItems = [
    { id: "profile", label: "个人资料", icon: User },
    { id: "password", label: "密码设置", icon: Lock },
    ...(user?.roletype === "Influencer" ? [
      { id: "influencer", label: "网红信息", icon: Star },
      { id: "sellerCampaigns", label: "商家优惠", icon: ShoppingBag }
    ] : []),
    ...(user?.roletype === "Seller" ? [
      { id: "seller", label: "卖家信息", icon: ShoppingBag }
    ] : [])
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Avatar Section */}
      <div className="p-6 text-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-2xl font-semibold shadow-lg">
            {user?.avatar || avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-full h-full rounded-full object-cover" />
            ) : (
              user?.username?.charAt(0) || "U"
            )}
          </div>
          <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-blue-500 transition-colors">
            <Camera size={14} />
          </button>
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{user?.username || "用户"}</h3>
        <p className="text-sm text-gray-500 capitalize">{user?.roletype || "用户"}</p>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-1">
        {menuItems.map(item => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600 border border-blue-100 shadow-sm"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <IconComponent size={18} className="mr-3" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// 美化的个人信息展示组件
const EnhancedProfileInfoSection = ({ user, openEdit }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900">个人资料</h2>
      <button
        onClick={openEdit}
        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
      >
        <Edit3 size={16} className="mr-2" />
        编辑资料
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center mb-2">
          <User size={18} className="text-gray-500 mr-2" />
          <label className="text-sm font-medium text-gray-600">用户名</label>
        </div>
        <p className="text-gray-900 font-medium">{user?.username || "未设置"}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center mb-2">
          <Mail size={18} className="text-gray-500 mr-2" />
          <label className="text-sm font-medium text-gray-600">邮箱地址</label>
        </div>
        <p className="text-gray-900 font-medium">{user?.email || "未设置"}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center mb-2">
          <Phone size={18} className="text-gray-500 mr-2" />
          <label className="text-sm font-medium text-gray-600">手机号码</label>
        </div>
        <p className="text-gray-900 font-medium">{user?.phone || "未设置"}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center mb-2">
          <MapPin size={18} className="text-gray-500 mr-2" />
          <label className="text-sm font-medium text-gray-600">所在地区</label>
        </div>
        <p className="text-gray-900 font-medium">{user?.location || "未设置"}</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
        <div className="flex items-center mb-2">
          <Calendar size={18} className="text-gray-500 mr-2" />
          <label className="text-sm font-medium text-gray-600">加入时间</label>
        </div>
        <p className="text-gray-900 font-medium">{user?.joinDate || user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "未知"}</p>
      </div>
    </div>
  </div>
);

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");

  // 使用自定义hooks管理状态
  const { inflLoading, inflError, influencerProfile } = useInfluencerProfile(user, BACKEND_HOST);
  const { couponList, couponLoading, couponError, refreshCoupons } = useCoupons(user, BACKEND_HOST);
  const { sellerData, sellerLoading, sellerError } = useSellerData(user, BACKEND_HOST);
  
  const profileEditProps = useProfileEdit(user, BACKEND_HOST, setUser);

  // ===== 仅 Seller 使用：本人卖家资料 =====
  const [sellerProfileSelf, setSellerProfileSelf] = useState(null);
  const [sellerProfileLoading, setSellerProfileLoading] = useState(false);
  const [sellerProfileError, setSellerProfileError] = useState("");

  // 调试：观察 user/coupon 结构变化
  useEffect(() => {
    console.groupCollapsed("%c[Coupon] user change", "color:#6a5acd");
    console.log("[Coupon] user.id =", user?.id, "roletype =", user?.roletype);
    console.log("[Coupon] user.coupon =", user?.coupon);
    console.groupEnd();
  }, [user]);

  // 拉取当前 Seller 的资料（company_details + campaign_preferences）
  useEffect(() => {
    const fetchSellerProfileSelf = async () => {
      if (!user?.id || user?.roletype !== "Seller") return;
      try {
        setSellerProfileLoading(true);
        setSellerProfileError("");
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if (!token) {
          setSellerProfileError("未登录或 token 缺失");
          setSellerProfileSelf(null);
          return;
        }
        const tryFetch = async (filters) => {
          const qs = new URLSearchParams({
            ...filters,
            populate: "*",
            "pagination[pageSize]": "1",
          }).toString();
          const res = await fetch(`${BACKEND_HOST}/api/seller-profiles?${qs}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data?.error?.message || `HTTP ${res.status}`);
          }
          return data;
        };
        let data;
        try {
          // 常见：关系字段为 user
          data = await tryFetch({ "filters[user][id][$eq]": String(user.id) });
        } catch (e) {
          // 兼容：关系字段为 users_permissions_user
          data = await tryFetch({ "filters[users_permissions_user][id][$eq]": String(user.id) });
        }
        const first = data?.data?.[0] || null;
        setSellerProfileSelf(first ? (first.attributes ?? first) : null);
      } catch (e) {
        console.error("[SellerProfileSelf] fetch error:", e);
        setSellerProfileError(e.message || "加载卖家资料失败");
        setSellerProfileSelf(null);
      } finally {
        setSellerProfileLoading(false);
      }
    };
    fetchSellerProfileSelf();
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* 左侧菜单 */}
          <div className="lg:col-span-1">
            <ProfileSidebar 
              user={user}
              avatarUrl={profileEditProps.avatarUrl}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* 右侧内容 */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
              {activeTab === "profile" && (
                <EnhancedProfileInfoSection 
                  user={user} 
                  openEdit={profileEditProps.openEdit} 
                />
              )}

              {activeTab === "password" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">密码设置</h2>
                  <div className="max-w-md">
                    <PasswordSection BACKEND_HOST={BACKEND_HOST} />
                  </div>
                </div>
              )}

              {activeTab === "influencer" && user?.roletype === "Influencer" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">网红信息</h2>

                  {/* 展示 coupon 信息 */}
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-center mb-4">
                      <Star className="text-purple-500 mr-2" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">优惠券信息</h3>
                    </div>
                    <CouponDisplay 
                      couponList={couponList}
                      couponLoading={couponLoading}
                      couponError={couponError}
                      onCouponUpdate={refreshCoupons}
                    />
                  </div>

                  {/* 网红资料展示 */}
                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <User className="text-blue-500 mr-2" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">网红资料</h3>
                    </div>
                    <InfluencerProfileSection 
                      inflLoading={inflLoading}
                      inflError={inflError}
                      influencerProfile={influencerProfile}
                    />
                  </div>
                </div>
              )}

              {activeTab === "sellerCampaigns" && user?.roletype === "Influencer" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">商家优惠</h2>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <div className="flex items-center mb-4">
                      <ShoppingBag className="text-green-500 mr-2" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">可用优惠</h3>
                    </div>
                    <SellerCampaignsSection 
                      sellerData={sellerData}
                      sellerLoading={sellerLoading}
                      sellerError={sellerError}
                    />
                  </div>
                </div>
              )}

              {activeTab === "seller" && user?.roletype === "Seller" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">卖家信息</h2>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-6 border border-orange-100">
                    <div className="flex items-center mb-4">
                      <ShoppingBag className="text-orange-500 mr-2" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">商店管理</h3>
                    </div>
                    <SellerCoupon user={user} />
                  </div>

                  {/* 卖家资料（company_details + campaign_preferences） */}
                  <SellerProfileSection
                    sellerProfileLoading={sellerProfileLoading || sellerLoading}
                    sellerProfileError={sellerProfileError || sellerError}
                    sellerProfile={sellerProfileSelf}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 编辑弹窗 */}
      <ProfileEditModal {...profileEditProps} />
    </div>
  );
};

export default Profile;