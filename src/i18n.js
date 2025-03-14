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
      footer_join_intro:
        "Sign up for our newsletter to enjoy free marketing tips, inspirations, and more.",
      footer_sub: "Subscribe",
      footer_scan: "Scan me for more info",
      recruitment: "Recruitment Info",
      apply: "Application",
      recruit_info: "Recruitment Details",
      no_job:
        "Currently there's no position is opening, please keep your eyes on our website, we do looking forward to see you someday in the near future!",
      recruit_type: "Type: ",
      recruit_participation: "Participation: ",
      recruit_location: "Location: ",
      recruit_intro: "Job Introduction: ",
      recruit_company: "Company： ",
      price_tbd: "Price upon request",
      brands: "Brands",
      recommended_product: "Trending Products",
      btn_more: "View More",
      highlights: "Highlights",
      news_title: " Latest News",
      associatedBrands: "Associated Brands",
      latestNews: "Latest News",
      relatedPersons: "Related People",
      founder_slogan:
        "Building brand value with vision and creativity, co-creating infinite possibilities with the industry",
      founder_title: "The driving soul behind brand development",
      founder_content:
        "Brand founders are pioneers of their time, bridging brand values and consumer emotions. With unique perspectives, deep industry insights, and innovative spirits, they set benchmarks in their fields.\nWe recognize their vital role as shapers of core values and leaders in delivering brand vision to the market. Partnering with brand founders is central to our strategy.\nTheir vision and leadership amplify brand impact, inspire innovation, and inject new energy into industries like technology, fashion, and education. Together, we aim to share compelling brand stories, drive growth, and create a prosperous, collaborative future.",
      brands: "Brands",
      /* Miss Registration form components */
      miss_reg_contest_title:
        "The 73rd Miss Universe China Competition Australia Division - Melbourne 2024",
      miss_reg_name_zh: "Chinese Name*",
      miss_reg_name_en: "English Name*",
      miss_reg_age: "Age*",
      miss_reg_height: "Height (cm)*",
      miss_reg_weight: "Weight (kg)*",
      miss_reg_phone: "Phone Number*",
      miss_reg_email: "Email*",
      miss_reg_id_nationality: "ID Nationality*",
      miss_reg_id_type: "ID Type*",
      miss_reg_id_number: "ID Number*",
      miss_reg_location: "City of Born*",
      miss_reg_occupation_now: "Current Occupation",
      miss_reg_occupation_hoped: "Desired Occupation",
      miss_reg_company_school: "Workplace/School",
      miss_reg_education: "Education",
      miss_reg_major: "Major",
      miss_reg_talent: "Talent*",
      miss_reg_wechat: "WeChat ID*",
      miss_reg_social_media: "Social Media Accounts",
      miss_reg_photo_upload: "Upload Photos* (Up to 5, 5MB limit)",
      miss_reg_add_media: "Add an social media",
      miss_reg_submit: "Submit",
      miss_reg_submitting: "Uploading...",
      miss_reg_joint_organizers: "Joint Organizers:",
      miss_reg_title_sponsor: "Title Sponsor:",
      miss_reg_authorization: "Authorized by:",
      miss_reg_success: "Submit successful. Now you're in!",
      miss_reg_fail:
        "Oops, something not right... Please check all the fields and try again.",
      miss_reg_please_fill: "Please fill this",
      miss_reg_please_upload: "We'll need at least one photo of you.",
      home: "Home",
      brand: "Brand",
      readMore: "Read More",
      relatedProducts: "Related Products",
      relatedNews: "Related News",
      relatedPersons: "Related Persons",
      noPersonsAvailable: "No persons available",
      noNewsAvailable: "No news available",
      noProductsAvailable: "No products available",
      noDescriptionAvailable: "No description available",
      noDate: "No date available",
      introduction: "Introduction",
      officalWebsite: "Offical Website",
      email: "Email",
      officialWebsite: "Official Website",
      relatedInformation: "Related Information",
      closetonature: "Close to Nature",
      wildlife: "Wildlife",
      resourceIntegration: "Resource Integration",
      innovationSupport: "Innovation Support",
      publicWelfare: "Public Welfare",
      relatedInformation: "Related Information",
      expand: "Expand",
      collapse: "Collapse",
      gallery: "Gallery",
      relatedProducts: "Related Products",
      relatedEvents: "Related Events",
      no_description: "No Description",
      view_details: "View Details",
      price: "Price",
      related_brands: "Related Brands",
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
      footer_join_intro:
        "即可第一时间获得商品折扣和礼品等消息，现在订阅，快人一步尽在指尖！",
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
      btn_more: "查看更多",
      highlights: "高光时刻",
      news_title: " 最新消息",
      associatedBrands: "相关品牌",
      latestNews: "相关新闻",
      relatedPersons: "相关人物",
      founder_slogan: "以远见与创意构筑品牌价值，与行业共创无限可能",
      founder_title: "驱动品牌发展的灵魂力量",
      founder_content:
        "品牌创始人是时代的开拓者，是品牌理念与消费者情感的连接桥梁。他们以独特的视角、深刻的行业理解和开创性的精神，在各自领域中树立了标杆。我们深刻认识到品牌创始人的重要性，他们不仅是品牌核心价值的塑造者，更是将品牌理念精准传递给市场的引领者。与品牌创始人合作，是我们战略发展的重要组成部分。无论是在科技、时尚还是教育领域，他们的愿景和领导力能够让品牌的价值更加深入人心，并为行业注入新的活力。我们坚信，与品牌创始人携手，不仅能够传递品牌的核心故事，还能在持续创新中开拓更多机遇与可能。通过与这些充满激情与智慧的创始人合作，我们希望共同推动品牌与行业的发展，为未来创造一个更加繁荣、共赢的局面。",
      spokesperson_slogan: "携手品牌代言人，创造双赢新格局",
      spokesperson_title: "潮流引领，共赢未来",
      spokesperson_content:
        "流量网红、博主是当今自媒体时代的标志性力量，他们以独特的定位和鲜明的风格在社交媒体上引领潮流、影响受众。作为拥有忠实粉丝群体的网红，他们的每一份内容创作，都蕴含着不可忽视的商业价值。我们合作，不仅能够进一步扩大个人品牌的影响力，还能借助我们的平台和资源，将个人定位与优质产品完美结合。通过成为品牌代言人，他们不仅能为品牌赋能，同时也为自己创造额外收入，拓展职业发展的新可能。们始终相信，品牌代言人不仅是个体的表达者，更是品牌传播的强大助力。通过建立共赢的合作关系，我们希望为自媒体网红、博主们提供更多展示自我的机会，同时也与他们一起，共同塑造行业的新风潮。",
      kol_slogan: "与意见领袖携手，引领行业新趋势",
      kol_title: "赋能未来，共创辉煌",
      kol_content:
        "意见领袖是时代的先行者，是连接品牌与消费者之间的桥梁。他们以专业的洞察力、深厚的行业知识和广泛的影响力，在各自领域中树立了权威。我们深知意见领袖的重要性，他们不仅能够帮助品牌精准传递价值观，更能激发公众的关注与信任。与意见领袖合作是我们战略发展的核心部分。无论是科技、时尚还是教育领域，他们的声音能够让品牌的愿景更具说服力，为行业趋势注入新动力。我们相信，携手意见领袖，不仅能拓宽视野，还能创造更多创新与成功的可能性。通过与各行业专家的深度合作，我们希望在不断变化的市场中，共同推动品牌与行业的进步，开创共赢的未来。",
      brand: "品牌",
      readMore: "查看更多",

      /* Miss Registration form components */
      miss_reg_contest_title: "第73届环球小姐中国区大赛澳洲赛区-墨尔本2024",
      miss_reg_name_zh: "中文姓名*",
      miss_reg_name_en: "英文姓名*",
      miss_reg_age: "年龄*",
      miss_reg_height: "身高（cm）*",
      miss_reg_weight: "体重（kg）*",
      miss_reg_phone: "手机号*",
      miss_reg_email: "邮箱*",
      miss_reg_id_nationality: "ID证件国籍*",
      miss_reg_id_type: "ID证件类型*",
      miss_reg_id_number: "ID证件号码*",
      miss_reg_location: "出生地(城市)*",
      miss_reg_occupation_now: "目前职业",
      miss_reg_occupation_hoped: "希望职业",
      miss_reg_company_school: "工作单位/学校",
      miss_reg_education: "学历",
      miss_reg_major: "专业",
      miss_reg_talent: "才艺*",
      miss_reg_wechat: "微信号*",
      miss_reg_social_media: "自媒体账号",
      miss_reg_photo_upload: "上传照片*（最多 5 张，5MB 限制）",
      miss_reg_add_media: "添加自媒体账号",
      miss_reg_submit: "提交",
      miss_reg_submitting: "提交中...",
      miss_reg_joint_organizers: "联合主办:",
      miss_reg_title_sponsor: "冠名赞助:",
      miss_reg_authorization: "授权方:",
      miss_reg_success: "表单提交成功，感谢您的耐心！",
      miss_reg_fail: "哎呀，咋提交失败了呢...请稍后重试",
      miss_reg_please_fill: "请填写此项",
      miss_reg_please_upload: "请您上传至少一张图片",
      home: "首页",
      relatedProducts: "相关产品",
      relatedNews: "相关新闻",
      relatedPersons: "相关人物",
      relatedEvents: "相关活动",
      noPersonsAvailable: "当前无人物",
      noNewsAvailable: "当前无新闻",
      noProductsAvailable: "当前无产品",
      noDescriptionAvailable: "当前无详情",
      noDate: "当前无日期",
      introduction: "简介",

      officialWebsite: "官网",
      closetonature: "贴近自然",
      wildlife: "野生动物",
      resourceIntegration: "资源整合",
      innovationSupport: "创新支持",
      publicWelfare: "公益",
      relatedInformation: "相关信息",
      expand: "展开",
      collapse: "收起",
      gallery: "画廊",
      related_products: "相关产品",
      no_description: "无详情",
      view_details: "查看详情",
      price: "价格",
      related_brands: "相关品牌",
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
