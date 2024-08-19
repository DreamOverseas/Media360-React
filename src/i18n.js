import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Cookies from "js-cookie";

const savedLanguage = Cookies.get("i18next") || "zh"; // 从 Cookie 中获取语言，默认为 'zh'

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
      "contact.title": "Contact us",
      "contact.full_name": "Full name",
      "contact.email_address": "E-mail address",
      "contact.message": "Message",
      "contact.send": "Send",
      "cart.title": "Shopping Cart",
      "cart.order_summary": "Order Summary",
      "cart.item_quantity": "Item Quantity",
      "cart.total_price": "Total Price",
      "cart.proceed_checkout": "Proceed to Check Out",
      "cart.delete": "Delete",
      "cart.select_all": "Select all",
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
      "contact.title": "联系我们",
      "contact.full_name": "全名",
      "contact.email_address": "电子邮件地址",
      "contact.message": "留言",
      "contact.send": "发送",
      "cart.title": "购物车",
      "cart.order_summary": "订单摘要",
      "cart.item_quantity": "商品数量",
      "cart.total_price": "总价",
      "cart.proceed_checkout": "去结算",
      "cart.delete": "删除",
      "cart.select_all": "全选",
    },
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: savedLanguage, // 将默认语言设置为 Cookie 中的语言
    fallbackLng: "zh", // 如果没有找到语言资源，则使用 'zh'
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
