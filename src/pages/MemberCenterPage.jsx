// D:\OverseaDreamGroupProjects\Media360-React\src\pages\MemberCenterPage.jsx
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MemberCenterLayout } from "oneclub-member-shop";

// 从 env 里拿后端地址
const cmsEndpoint = import.meta.env.VITE_CMS_API_ENDPOINT;
const cmsApiKey = import.meta.env.VITE_CMS_API_KEY;
const couponEndpoint = import.meta.env.VITE_COUPON_SYS_ENDPOINT;
const emailEndpoint = import.meta.env.VITE_EMAIL_API_ENDPOINT;

export default function MemberCenterPage() {
  const { t, i18n } = useTranslation();

  // 多语言标题、未登录提示、登录按钮文案
  const title = t("member_center_title");
  const notLoggedInText = t("member_center_not_logged_in");
  const loginButtonText = t("member_center_login_button");

  // ★ 调试：看看当前语言 & 翻译结果
  useEffect(() => {
    console.log(
      "[MemberCenterPage] lang =",
      i18n.language,
      "title =",
      title
    );
  }, [i18n.language, title]);

  return (
    <MemberCenterLayout
      cmsEndpoint={cmsEndpoint}
      cmsApiKey={cmsApiKey}
      couponEndpoint={couponEndpoint}
      emailEndpoint={emailEndpoint}
      title={title}
      texts={{
        notLoggedIn: notLoggedInText,
        loginButton: loginButtonText,
      }}
    />
  );
}
