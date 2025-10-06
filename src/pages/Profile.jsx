import { useContext, useState } from "react";
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
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");

  const { inflLoading, inflError, influencerProfile } = useInfluencerProfile(user, BACKEND_HOST);
  const { couponList, couponLoading, couponError, refreshCoupons } = useCoupons(user, BACKEND_HOST);
  const { sellerData, sellerLoading, sellerError } = useSellerData(user, BACKEND_HOST);
  const profileEditProps = useProfileEdit(user, BACKEND_HOST, setUser);

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
                  <RelatedInfluencerSection relatedProfileLoading={false} relatedProfileError={""} relatedInfluencerList={[]} />
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
