import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Cookies from "js-cookie";

const savedLanguage = Cookies.get("i18next") || "zh"; // 从 Cookie 中获取语言，默认为 'zh'

const resources = {
  en: {
    translation: {
      kol: "KOL",
      event: "Event",
      contact: "Contact Us",
      joinus: "Join Us",
      product: "Product",
      sponsor: "Sponsor",
      language: "Language",
      english: "English",
      chinese: "中文",
      myProfile: "My Profile",
      logout: "Logout",
      logIn: "Login",
      cancel: "Cancel",
      close: "Close",
      contactNow: "Contact Now",
      productDescription: "Product Description",
      eventDescription: "Event Description",
      highlightedProduct: "Highlighted Product",
      moreDetails: "More Details",
      loginAlert: "Please login in first",
      addToCart: "Add To Cart",
      enquireNow: "Enquire Now",
      comingSoon: "Coming Soon",
      noKols: "No Kols Available",
      noProducts: "No Products Available",
      noEvents: "No Events Available",
      noDescription: "No Description Available",
      loading: "Loading...",
      enterEmail: "Enter Email",
      noAccount: "Do not have an account?",
      hasAccount: "Already have an account?",
      sign_in_panel_title: "Sign in to your account!",
      sign_up_panel_title: "Sign up to your account!",
      signinText: "Sign in to your account!",
      time: "Time",
      location: "Location",
      host: "Host",
      "contact.title": "Contact us",
      "contact.firstname": "First name",
      "contact.lastname": "Last name",
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
      sign_in: "Sign In",
      sign_up: "Sign Up",
      email: "Email",
      enter_email: "Enter email",
      email_invalid: "Please provide a valid email.",
      password: "Password",
      enter_password: "Enter password",
      password_required: "Password is required.",
      username: "Username",
      enter_username: "Enter username",
      username_invalid: "Please provide a valid username.",
      confirm_password: "Confirm Password",
      password_mismatch: "Passwords do not match.",
      error_occurred: "An error occurred",
      sign_in_image: "sign-in.jpeg",
      sign_up_image: "sign-up.jpeg",
      footer_people: "OUR PEOPLE",
      footer_mission: "OUR MISSION",
      footer_event: "OUR EVENT",
      footer_join_title: "Join Us",
      footer_join_intro: "Sign up for our newsletter to enjoy free marketing tips, inspirations, and more.",
      footer_sub: "Subscribe",
      footer_scan: "Scan me for more info",
      recruitment: "Recruitment Info",
      apply: "Application",
      recruit_info: "Recruitment Details",
      no_job: "Currently there's no position is opening, please keep your eyes on our website, we do looking forward to see you someday in the near future!",
      recruit_type: "Type: ",
      recruit_participation: "Participation: ",
      recruit_location: "Location: ",
      recruit_intro: "Job Introduction: ",
      recruit_company: "Company： ",
      price_tbd: "Price upon request",
      brands: "Brands",
      recommended_product: "Trending Products",
      btn_more: "More >",
      highlights: "Highlights",
      news_title: " Latest News",

      /* Miss Registration form components */
      "miss_reg_contest_title": "The 73rd Miss Universe China Competition Australia Division - Melbourne 2024",
      "miss_reg_name_zh": "Chinese Name*",
      "miss_reg_name_en": "English Name*",
      "miss_reg_age": "Age*",
      "miss_reg_height": "Height (cm)*",
      "miss_reg_weight": "Weight (kg)*",
      "miss_reg_phone": "Phone Number*",
      "miss_reg_email": "Email*",
      "miss_reg_id_nationality": "ID Nationality*",
      "miss_reg_id_type": "ID Type*",
      "miss_reg_id_number": "ID Number*",
      "miss_reg_location": "City of Born*",
      "miss_reg_occupation_now": "Current Occupation",
      "miss_reg_occupation_hoped": "Desired Occupation",
      "miss_reg_company_school": "Workplace/School",
      "miss_reg_education": "Education",
      "miss_reg_major": "Major",
      "miss_reg_talent": "Talent*",
      "miss_reg_wechat": "WeChat ID*",
      "miss_reg_social_media": "Social Media Accounts",
      "miss_reg_photo_upload": "Upload Photos* (Up to 5, 5MB limit)",
      "miss_reg_add_media": "Add an social media",
      "miss_reg_submit": "Submit",
      "miss_reg_submitting": "Uploading...",
      "miss_reg_joint_organizers": "Joint Organizers:",
      "miss_reg_title_sponsor": "Title Sponsor:",
      "miss_reg_authorization": "Authorized by:",
      "miss_reg_success": "Submit successful. Now you're in!",
      "miss_reg_fail": "Oops, something not right... Please check all the fields and try again.",
      "miss_reg_please_fill": "Please fill this",
      "miss_reg_please_upload": "We'll need at least one photo of you.",
    },
  },
  zh: {
    translation: {
      kol: "意见领袖",
      event: "活动",
      contact: "联系我们",
      joinus: "加入我们",
      product: "产品",
      sponsor: "赞助商",
      language: "语言",
      english: "英文",
      chinese: "中文",
      myProfile: "我的资料",
      logout: "登出",
      logIn: "登录",
      cancel: "取消",
      close: "关闭",
      contactNow: "详情咨询",
      productDescription: "产品详情",
      eventDescription: "活动详情",
      highlightedProduct: "相关产品",
      moreDetails: "更多详情",
      loginAlert: "请先登录",
      addToCart: "加入购物车",
      enquireNow: "立刻咨询",
      comingSoon: "即将推出",
      noKols: "当前无意见领袖",
      noProducts: "当前无产品",
      noEvents: "当前无活动",
      noDescription: "当前无详情",
      loading: "加载中。。。",
      enterEmail: "输入邮箱",
      noAccount: "未拥有账号？",
      hasAccount: "已拥有账号？",
      sign_in_panel_title: "即刻登录账号！",
      sign_up_panel_title: "欢迎注册账号!",
      time: "时间",
      location: "地点",
      host: "主办方",
      "contact.title": "联系我们",
      "contact.firstname": "名",
      "contact.lastname": "姓",
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
      sign_in: "登录",
      sign_up: "注册",
      email: "邮箱",
      enter_email: "请输入邮箱",
      email_invalid: "请输入有效的邮箱地址。",
      password: "密码",
      enter_password: "请输入密码",
      password_required: "密码为必填项。",
      username: "用户名",
      enter_username: "请输入用户名",
      username_invalid: "请输入有效的用户名。",
      confirm_password: "确认密码",
      password_mismatch: "两次密码输入不一致。",
      error_occurred: "发生错误",
      sign_in_image: "sign-in.jpeg",
      sign_up_image: "sign-up.jpeg",
      footer_people: "关于我们",
      footer_mission: "目标所向",
      footer_event: "活动参与",
      footer_join_title: "免费订阅邮件",
      footer_join_intro: "即可第一时间获得商品折扣和礼品等消息，现在订阅，快人一步尽在指尖！",
      footer_sub: "提交",
      footer_scan: "获取更多信息",
      recruitment: "招聘详情",
      apply: "如何申请",
      recruit_info: "岗位详情",
      no_job: "当前暂无招聘信息，请持续关注我们的网站和新动态！",
      recruit_type: "类型：",
      recruit_participation: "参与方式：",
      recruit_location: "工作地点：",
      recruit_intro: "职位介绍：",
      recruit_company: "公司主体：",
      price_tbd: "价格面议",
      brands: "品牌",
      recommended_product: "推荐产品",
      btn_more: "更多 >",
      highlights: "高光时刻",
      news_title: " 最新消息",

      /* Miss Registration form components */
      "miss_reg_contest_title": "第73届环球小姐中国区大赛澳洲赛区-墨尔本2024",
      "miss_reg_name_zh": "中文姓名*",
      "miss_reg_name_en": "英文姓名*",
      "miss_reg_age": "年龄*",
      "miss_reg_height": "身高（cm）*",
      "miss_reg_weight": "体重（kg）*",
      "miss_reg_phone": "手机号*",
      "miss_reg_email": "邮箱*",
      "miss_reg_id_nationality": "ID证件国籍*",
      "miss_reg_id_type": "ID证件类型*",
      "miss_reg_id_number": "ID证件号码*",
      "miss_reg_location": "出生地(城市)*",
      "miss_reg_occupation_now": "目前职业",
      "miss_reg_occupation_hoped": "希望职业",
      "miss_reg_company_school": "工作单位/学校",
      "miss_reg_education": "学历",
      "miss_reg_major": "专业",
      "miss_reg_talent": "才艺*",
      "miss_reg_wechat": "微信号*",
      "miss_reg_social_media": "自媒体账号",
      "miss_reg_photo_upload": "上传照片*（最多 5 张，5MB 限制）",
      "miss_reg_add_media": "添加自媒体账号",
      "miss_reg_submit": "提交",
      "miss_reg_submitting": "提交中...",
      "miss_reg_joint_organizers": "联合主办:",
      "miss_reg_title_sponsor": "冠名赞助:",
      "miss_reg_authorization": "授权方:",
      "miss_reg_success": "表单提交成功，感谢您的耐心！",
      "miss_reg_fail": "哎呀，咋提交失败了呢...请稍后重试",
      "miss_reg_please_fill": "请填写此项",
      "miss_reg_please_upload": "请您上传至少一张图片",
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
