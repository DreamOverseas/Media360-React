import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      kol: "KOL",
      events: "Events",
      contact: "Contact",
      language: "Language",
      english: "English",
      chinese: "中文",
      myProfile: "My Profile",
      logout: "Logout",
    },
  },
  zh: {
    translation: {
      kol: "意见领袖",
      events: "活动",
      contact: "联系我们",
      language: "语言",
      english: "英文",
      chinese: "中文",
      myProfile: "我的资料",
      logout: "登出",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
