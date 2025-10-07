import { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next"; // add this
import { User, Lock, Star, ShoppingBag, Edit3, Camera, Mail, Phone, MapPin, Calendar, Contact } from "lucide-react";

import SellerCoupon from "../components/SellerCoupon.jsx";
import { AuthContext } from "../context/AuthContext.jsx";

import PasswordSection from "../components/Profile/password_section.jsx";
import CouponDisplay from "../components/Profile/coupon_display.jsx";
import InfluencerProfileSection from "../components/Profile/influencer_profile_section.jsx";
import SellerCampaignsSection from "../components/Profile/seller_campaigns_section.jsx";
import ProfileEditModal from "../components/Profile/profile_edit_modal.jsx";
import SellerProfileSection from "../components/Profile/seller_profile_section.jsx";
import RelatedInfluencerSection from "../components/Profile/related_influencer_section.jsx";

import { useInfluencerProfile, useCoupons, useSellerData } from "../hooks/hooks_use_profile_data.jsx";
import { useProfileEdit } from "../hooks/hooks_use_profile_edit.jsx";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
const DEBUG = import.meta.env.DEBUG;

const ProfileSidebar = ({ user, avatarUrl, activeTab, setActiveTab }) => {
  const { t } = useTranslation();

  const menuItems = [
    { id: "profile", label: t("profile.page.sidebar.account"), icon: User },
    { id: "password", label: t("profile.page.sidebar.password"), icon: Lock },
    ...(user?.roletype === "Influencer"
      ? [
        { id: "influencer", label: t("profile.page.sidebar.influencer"), icon: Star },
        { id: "sellerCampaigns", label: t("profile.page.sidebar.sellerCampaigns"), icon: ShoppingBag },
      ]
      : []),
    ...(user?.roletype === "Seller"
      ? [{ id: "seller", label: t("profile.page.sidebar.seller"), icon: ShoppingBag }]
      : []),
    ...(user?.roletype === "Seller"
      ? [{ id: "relatedInfluencer", label: t("profile.page.sidebar.relatedInfluencer"), icon: Contact }]
      : []),
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
        <h3 className="font-semibold text-gray-900 mb-1">{user?.username || t("profile.page.user.defaultName")}</h3>
        <p className="text-sm text-gray-500 capitalize">{user?.roletype || t("profile.page.user.defaultRole")}</p>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-1">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-all duration-200 ${activeTab === item.id
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

const EnhancedProfileInfoSection = ({ user, openEdit }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t("profile.page.accountInfo.title")}</h2>
        <button
          onClick={openEdit}
          className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Edit3 size={16} className="mr-2" />
          {t("profile.page.accountInfo.edit")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <User size={18} className="text-gray-500 mr-2" />
            <label className="text-sm font-medium text-gray-600">{t("profile.page.accountInfo.username")}</label>
          </div>
          <p className="text-gray-900 font-medium">{user?.username || t("profile.page.common.notSet")}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Mail size={18} className="text-gray-500 mr-2" />
            <label className="text-sm font-medium text-gray-600">{t("profile.page.accountInfo.email")}</label>
          </div>
          <p className="text-gray-900 font-medium">{user?.email || t("profile.page.common.notSet")}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <Phone size={18} className="text-gray-500 mr-2" />
            <label className="text-sm font-medium text-gray-600">{t("profile.page.accountInfo.phone")}</label>
          </div>
          <p className="text-gray-900 font-medium">{user?.phone || t("profile.page.common.notSet")}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-center mb-2">
            <MapPin size={18} className="text-gray-500 mr-2" />
            <label className="text-sm font-medium text-gray-600">{t("profile.page.accountInfo.location")}</label>
          </div>
          <p className="text-gray-900 font-medium">{user?.location || t("profile.page.common.notSet")}</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 md:col-span-2">
          <div className="flex items-center mb-2">
            <Calendar size={18} className="text-gray-500 mr-2" />
            <label className="text-sm font-medium text-gray-600">{t("profile.page.accountInfo.joinDate")}</label>
          </div>
          <p className="text-gray-900 font-medium">
            {user?.joinDate || user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : t("profile.page.common.unknown")}
          </p>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const { t } = useTranslation();

  // 使用自定义hooks管理状态
  const { inflLoading, inflError, influencerProfile } = useInfluencerProfile(user, BACKEND_HOST);
  const { couponList, couponLoading, couponError, refreshCoupons } = useCoupons(user, BACKEND_HOST);
  const { sellerData, sellerLoading, sellerError } = useSellerData(user, BACKEND_HOST);

  const profileEditProps = useProfileEdit(user, BACKEND_HOST, setUser);

  // ===== 仅 Seller 使用：本人卖家资料 =====
  const [sellerProfileSelf, setSellerProfileSelf] = useState(null);
  const [relatedInfluencer, setRelatedInfluencer] = useState([]);
  const [sellerProfileLoading, setSellerProfileLoading] = useState(false);
  const [relatedInfluencerLoading, setRelatedInfluencerLoading] = useState(false);
  const [sellerProfileError, setSellerProfileError] = useState("");
  const [relatedInfluencerError, setRelatedInfluencerError] = useState("");

  // 调试：观察 user/coupon 结构变化
  useEffect(() => {
    console.groupCollapsed("%c[Coupon] user change", "color:#6a5acd");
    if (DEBUG) console.log("[Coupon] user.id =", user?.id, "roletype =", user?.roletype);
    if (DEBUG) console.log("[Coupon] user.coupon =", user?.coupon);
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
            // "populate[user][populate][influencer_profiles][populate]": "avatar",
            populate: '*',
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


    const fetchRelatedInfluencer = async () => {
      if (!user?.id || user?.roletype !== "Seller") return;
      try {
        setRelatedInfluencerLoading(true);
        setRelatedInfluencer("");
        const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
        if (!token) {
          setSellerProfileError("未登录或 token 缺失");
          setRelatedInfluencer(null);
          return;
        }
        const tryFetch = async (filters) => {
          const qs = new URLSearchParams({
            ...filters,
            "populate[AssignedFrom][populate]": "*",
            "populate[users_permissions_user][populate][influencer_profile][populate]": "avatar"
          }).toString();
          const res = await fetch(`${BACKEND_HOST}/api/coupons?${qs}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data?.error?.message || `HTTP ${res.status}`);
          }
          return data;
        };
        let data;
        data = await tryFetch({ "filters[AssignedFrom][users_permissions_user][id][$eq]": String(user.id) });
        const first = data?.data || [];
        const processed_data = first
          .filter(entry => entry.users_permissions_user?.influencer_profile) // 过滤掉为空的
          .map(entry => entry.users_permissions_user.influencer_profile);
        if (DEBUG) console.log("first", first);
        if (DEBUG) console.log("processed_data", processed_data);

        setRelatedInfluencer(processed_data ? (processed_data.attributes ?? processed_data) : []);
      } catch (e) {
        console.error("[SellerProfileSelf] fetch error:", e);
        setRelatedInfluencerError(e.message || "加载相关网红失败");
        setRelatedInfluencer([]);
      } finally {
        setSellerProfileLoading(false);
      }
    };

    fetchSellerProfileSelf();
    fetchRelatedInfluencer();

  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ProfileSidebar user={user} avatarUrl={profileEditProps.avatarUrl} activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
              {activeTab === "profile" && <EnhancedProfileInfoSection user={user} openEdit={profileEditProps.openEdit} />}

              {activeTab === "password" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("profile.page.password.title")}</h2>
                  <div className="max-w-md">
                    <PasswordSection BACKEND_HOST={BACKEND_HOST} />
                  </div>
                </div>
              )}

              {activeTab === "influencer" && user?.roletype === "Influencer" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("profile.page.influencer.title")}</h2>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                    <div className="flex items-center mb-4">
                      <Star className="text-purple-500 mr-2" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">{t("profile.page.influencer.couponInfo")}</h3>
                    </div>
                    <CouponDisplay couponList={couponList} couponLoading={couponLoading} couponError={couponError} onCouponUpdate={refreshCoupons} />
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 border border-blue-100">
                    <div className="flex items-center mb-4">
                      <User className="text-blue-500 mr-2" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">{t("profile.page.influencer.profileInfo")}</h3>
                    </div>
                    <InfluencerProfileSection inflLoading={inflLoading} inflError={inflError} influencerProfile={influencerProfile} />
                  </div>
                </div>
              )}

              {activeTab === "sellerCampaigns" && user?.roletype === "Influencer" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("profile.page.sellerCampaigns.title")}</h2>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
                    <div className="flex items-center mb-4">
                      <ShoppingBag className="text-green-500 mr-2" size={20} />
                      <h3 className="text-lg font-semibold text-gray-900">{t("profile.page.sellerCampaigns.availableCoupons")}</h3>
                    </div>
                    <SellerCampaignsSection sellerData={sellerData} sellerLoading={sellerLoading} sellerError={sellerError} />
                  </div>
                </div>
              )}

              {activeTab === "seller" && user?.roletype === "Seller" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("profile.page.seller.title")}</h2>
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-3 sm:p-6 border border-orange-100">
                    <div className="flex items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">{t("profile.page.seller.qrInfo")}</h3>
                    </div>
                    <SellerCoupon user={user} />
                  </div>
                  <SellerProfileSection sellerProfileLoading={sellerLoading} sellerProfileError={sellerError} sellerProfile={null} />
                </div>
              )}

              {activeTab === "relatedInfluencer" && user?.roletype === "Seller" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{t("profile.page.relatedInfluencer.title")}</h2>
                  <RelatedInfluencerSection
                    relatedProfileLoading={relatedInfluencerLoading}
                    relatedProfileError={relatedInfluencerError}
                    relatedInfluencerList={relatedInfluencer}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <ProfileEditModal {...profileEditProps} />
    </div>
  );
};

export default Profile;
