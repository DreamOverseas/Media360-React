import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import Cookies from "js-cookie";

const savedLanguage = Cookies.get("i18next") || "zh"; // 从 Cookie 中获取语言，默认为 'zh'

const resources = {
  en: {
    translation: {
      kol: "KOL",
      event: "Event",
      news: "News",
      networks: "Our Networks",
      contact: "Contact Us",
      follow_us: "Follow Us",
      quick_links: "Quick Links",
      joinus: "Join Us",
      about_us: "360 Media is a multidimensional digital ecosystem platform that empowers brands, communities, and creators. It goes beyond media — integrating SaaS (Software as a Service) and PaaS (Platform as a Service) to connect third-party platforms, products, companies, payment gateway and key people including founders, KOLs, and influencers into one seamless system of communication, influence, and commerce.\nWith a built-in e-commerce engine and super API, 360 Media supports a flexible and forward-compatible payment infrastructure — combining traditional fiat, reward points, discount systems, and digital value exchanges (in compliance-aware formats). It is fully interoperable across both Web2 and Web3 environments, enabling every player in the ecosystem to explore greater value creation.\n360 Media is here to redefine the future of consumption and being consumed.",
      About_us: "About Us",
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
      loginAlert: " login in first",
      addToCart: "Add To Cart",
      enquireNow: "Enquire Now",
      comingSoon: "Coming Soon",
      noKols: "No Kols Available",
      noProducts: "No Products Available",
      noEvents: "No Events Available",
      noDescription: "No Description Available",
      loading_more: "Loading...",
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
      information_invalid: "Email or Password incorrect.",
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

      past_review: "Past Review",
      in_progress: "In progress",
      up_coming: "Upcoming",
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
      media_center: "Media Center",
      societies: "Societies",
      influencer: "Influencer",
      readMore: "Read More",
      relatedProducts: "Related Products",
      relatedNews: "Related News",
      noPersonsAvailable: "No persons available",
      noNewsAvailable: "No news available",
      noProductsAvailable: "No products available",
      noDescriptionAvailable: "No description available",
      noDate: "No date available",
      introduction: "Introduction",
      officalWebsite: "Offical Website",
      officialWebsite: "Official Website",
      relatedInformation: "Related Information",
      closetonature: "Close to Nature",
      wildlife: "Wildlife",
      resourceIntegration: "Resource Integration",
      innovationSupport: "Innovation Support",
      publicWelfare: "Public Welfare",
      expand: "Expand",
      collapse: "Collapse",
      gallery: "Gallery",
      relatedEvents: "Related Events",
      no_description: "No Description",
      view_details: "View Details",
      price: "Price",
      related_brands: "Related Brands",
      elite_package: "1. 直播采访\n提供两次直播采访服务，并上传至多个西方及中国社交平台，帮助客户推广品牌与故事。\n\n2. 信息上传\n在360Media平台上传信息，增加品牌曝光，为交易打下基础。\n\n3. 产品代言\n安排有影响力的人士代言客户产品，提供产品代言服务。\n\n4. MCN 网络资源\n连接MCN（多频道网络），帮助客户在社交媒体平台推广。\n\n5. 群发邮件\n提供群发邮件服务，用于活动宣传或新产品发布。\n\n6. 实习招聘\n提供实习招聘服务，支持客户的人力资源需求。\n\n7. 墨尔本CBD现场讲座/研讨会\n安排活动、演讲、讲座或研讨会，提供线下推广与互动的机会。",
      feature_1: "",
      feature_2: "",
      feature_3: "",
      feature_4: "",
      feature_5: "",
      feature_6: "",
      publishedAt: "Published At",
      "whds_form_inf": {
        "title": "Influencer Registration",
        "subtitle": "Please fill out the form below to complete your registration and join the influencer competition",
        "basic_info": {
          "title": "Basic Information",
          "name": "Name *",
          "name_ph": "Enter your full name",
          "gender": "Gender *",
          "gender_select": "Select",
          "gender_male": "Male",
          "gender_female": "Female",
          "gender_other": "Other",
          "age": "Age *",
          "age_ph": "Enter age",
          "phone": "Phone *",
          "phone_ph": "Enter phone number",
          "email": "Email *",
          "email_ph": "Enter email address",
          "location": "City/Country *",
          "location_ph": "e.g., Beijing, China"
        },
        "social_media": {
          "title": "Social Media Information",
          "account": "Social Media Account *",
          "platform_ph": "Platform (e.g., TikTok, Instagram)",
          "nickname_ph": "Platform nickname/ID",
          "fans_ph": "Number of followers",
          "add_account": "Add another account"
        },
        "experience": {
          "title": "Content & Experience",
          "past": "Previous collaborations/brands (optional)",
          "past_ph": "Briefly describe your brand collaborations or successful cases"
        },
        "training": {
          "title": "Influencer Training",
          "need_label": "Do you require professional paid influencer training? *",
          "need": "Yes",
          "no_need": "No"
        },
        "categories": {
          "title": "Product/Service Categories You Wish to Promote * (multiple choice)",
          "food_beverage": "Food & Beverages",
          "cosmetics": "Cosmetics",
          "travel": "Travel",
          "fashion": "Fashion",
          "electronics": "Electronics",
          "home": "Home Products",
          "health": "Health & Wellness",
          "education": "Education & Training",
          "finance": "Financial Services",
          "entertainment": "Entertainment & Gaming",
          "automotive": "Automotive",
          "mother_baby": "Mother & Baby Products",
          "other": "Other"
        },
        "endorsement": {
          "title": "Endorsement Terms",
          "placeholder": "If you accept endorsements from organizers/brands, please provide details such as profit sharing or additional conditions"
        },
        "commitment": {
          "title": "Competition Commitment",
          "rules": "I agree to comply with the competition rules and requirements *",
          "usage": "I allow the organizers to use my content for promotion *"
        },
        "submit": "Submit Application"
      },
      "whds_form_mch": {
        "title": "Merchant/Sponsor Registration",
        "subtitle": "Please fill out the following information to complete registration and join the influencer competition",
        "basic_info": {
          "title": "Basic Information",
          "company_name": "Company Name *",
          "company_name_ph": "Enter merchant/company name",
          "industry": "Industry Category *",
          "industry_select": "Select industry",
          "industry_beauty": "Beauty & Skincare",
          "industry_fashion": "Fashion",
          "industry_food": "Food & Beverages",
          "industry_electronics": "Electronics",
          "industry_home": "Home Products",
          "industry_health": "Health & Wellness",
          "industry_education": "Education & Training",
          "industry_travel": "Travel",
          "industry_finance": "Finance",
          "industry_entertainment": "Entertainment & Gaming",
          "industry_other": "Other",
          "website": "Company Website",
          "description": "Company Description *",
          "description_ph": "Briefly describe your business, brand philosophy, and history"
        },
        "contact": {
          "title": "Contact Person",
          "lastname": "Last Name *",
          "lastname_ph": "Enter last name",
          "firstname": "First Name *",
          "firstname_ph": "Enter first name",
          "email": "Email *",
          "email_ph": "Enter email address",
          "phone": "Phone *",
          "phone_ph": "Enter phone number"
        },
        "terms": {
          "title": "Sponsorship Terms",
          "sponsorship": "Sponsorship Format *",
          "sponsorship_ph": "Enter your sponsorship intention: goods/services, fiat, crypto, and estimated value",
          "exclusive": "Exclusive Sponsorship",
          "exclusive_ph": "If you wish to apply for exclusive sponsorship in a field, specify the estimated value (optional)",
          "reference": "Recommended Influencers",
          "reference_ph": "If you wish to recommend influencers, please provide their information and contact (optional)",
          "additional": "Additional Sponsorship Conditions",
          "additional_ph": "If you have special conditions, specify details such as profit sharing, format, etc. (optional)"
        },
        "submit": "Submit Application"
      },
      "whds_errors": {
        "file_license_too_large": "Some license files exceed 10MB and were not added!",
        "file_product_too_large": "Some product images exceed 5MB and were not added!",
        "company_name_required": "Company name cannot be empty",
        "company_description_required": "Please provide a company description",
        "industry_required": "Please select an industry category",
        "contact_firstname_required": "Contact person's first name is required",
        "contact_lastname_required": "Contact person's last name is required",
        "email_required": "Email cannot be empty",
        "email_invalid": "Invalid email format",
        "phone_required": "Phone number cannot be empty",
        "phone_invalid": "Invalid phone number format",
        "sponsorship_required": "Please specify sponsorship format",
        "file_portfolio_too_large": "Some portfolio files exceed 10MB and were not added!",
        "file_personal_too_large": "Some personal images exceed 10MB and were not added!",
        "name_required": "Name cannot be empty",
        "gender_required": "Gender is required",
        "age_required": "Age is required",
        "location_required": "City/Country is required",
        "social_media_required": "Please provide at least one main social media platform",
        "social_media_incomplete": "Social media account #{{index}} is incomplete (platform, nickname, and fans must all be provided)",
        "training_required": "Please select whether training is required",
        "rules_agreement_required": "You must agree to follow the competition rules",
        "usage_agreement_required": "You must agree to allow the organizer to use your submitted work for promotion"
      },
      "whds_page": {
        "submit_success": "Submission Successful",
        "submit_success_msg": "Your information has been uploaded successfully!",
        "submit_error": "Submission Failed",
        "submit_error_msg": "Submission failed. Please check your network or try again later.",
        "retry": "Retry",
        "close": "Close",
        "event_info": "Event Information",
        "time": "Time",
        "location": "Location",
        "host": "Host",
        "overview": "Event Overview",
        "no_description": "No description available",
        "event_description": "Event Description",
        "registration_method": "Registration Method",
        "uploading": "Uploading, please wait...",
        "tab_merchant": "Merchant/Sponsor Registration",
        "tab_influencer": "Influencer Registration"
      },
      "whds_ranking": {
        "hero": {
          "title": "Influencer Competition",
          "description": "Real-time dynamic ranking of top influencers. Watch the scores change live and see who's leading the competition!",
          "liveUpdates": "Live Updates"
        },
        "podium": {
          "title": "Top Performers"
        },
        "leaderboard": {
          "title": "Leaderboard"
        },
        "stats": {
          "total": "Total Participants",
          "highest": "Highest Score",
          "liveValue": "Live",
          "liveLabel": "Real-time Updates"
        },
        "footer": {
          "text": "Rankings update every 10 seconds • Live Competition"
        },
        "modal": {
          "defaultTitle": "Influencer Info",
          "name": "Name:",
          "gender": "Gender:",
          "age": "Age:",
          "location": "Location:",
          "category": "Category:",
          "languages": "Languages:",
          "followers": "Followers:",
          "email": "Email:",
          "totalScore": "Total Score:",
          "merchantScore": "Merchant Scan Score:",
          "adminScore": "Committee Bonus:",
          "relatedMerchants": "Related Merchants",
          "loading": "Loading...",
          "noMerchants": "No related merchants",
          "close": "Close"
        }
      },
      "profile": {
        "page": {
          "sidebar": {
            "account": "Account Info",
            "password": "Password Settings",
            "influencer": "Influencer Info",
            "sellerCampaigns": "Seller Campaigns",
            "seller": "Shop Info",
            "relatedInfluencer": "Endorsing Influencers"
          },
          "user": {
            "defaultName": "User",
            "defaultRole": "User"
          },
          "accountInfo": {
            "title": "Account Info",
            "edit": "Edit Profile",
            "username": "Username",
            "email": "Email",
            "phone": "Phone",
            "location": "Location",
            "joinDate": "Join Date"
          },
          "common": {
            "notSet": "Not set",
            "unknown": "Unknown"
          },
          "password": {
            "title": "Password Settings"
          },
          "influencer": {
            "title": "Influencer Info",
            "couponInfo": "Coupon Information",
            "profileInfo": "Influencer Profile"
          },
          "sellerCampaigns": {
            "title": "Seller Campaigns",
            "availableCoupons": "Available Coupons"
          },
          "seller": {
            "title": "Shop Info",
            "qrInfo": "QR Code Information"
          },
          "relatedInfluencer": {
            "title": "Endorsing Influencers"
          },
          "sellerDetail": {
            "title": "Seller Details",
            "basicInfo": "Business Information",
            "companyName": "Company Name",
            "industry": "Industry",
            "address": "Address",
            "abn": "ABN",
            "email": "Email",
            "phone": "Phone",
            "website": "Website",
            "campaignPrefs": "Campaign Preferences",
            "noCampaigns": "No campaigns available",
            "untitledCampaign": "Untitled Campaign",
            "requirement": "Requirement",
            "validUntil": "Valid Until",
            "contactUsBtn": "Contact Us",
            "contactUsNote": "To modify your shop and campaign info, please contact us via email: info@do360.com"
          },
          "sellerCampaignsSection": {
            "loading": "Loading seller campaigns...",
            "noSellers": "No sellers available",
            "unnamedSeller": "Unnamed Seller",
            "address": "Address:",
            "website": "Website:",
            "promotions": "Promotions",
            "untitledPromotion": "Untitled Promotion",
            "requirement": "Seller Requirement:",
            "none": "None",
            "validUntil": "Valid Until:",
            "noPromotions": "No promotions available",
            "media": "Media Materials",
            "file": "File",
            "download": "Download",
            "downloadFailedAlert": "Download failed, please try again later.",
            "fileType": {
              "image": "Image",
              "video": "Video",
              "audio": "Audio",
              "generic": "File"
            }
          },
          "relatedInfluencer": {
            "noInfluencers": "No related influencers available",
            "title": "Influencer Info",
            "name": "Name:",
            "gender": "Gender:",
            "age": "Age:",
            "location": "Location:",
            "category": "Category:",
            "languages": "Languages:",
            "followers": "Followers:",
            "email": "Email:",
            "close": "Close"
          },
          "profileEditModal": {
            "title": "Edit Profile",
            "username": "Username",
            "usernamePlaceholder": "Enter your username",
            "bio": "Bio",
            "bioPlaceholder": "Enter a short bio",
            "avatar": "Avatar",
            "avatarTip": "For best results, choose a square image.",
            "cancel": "Cancel",
            "save": "Save",
            "discardTitle": "Discard changes?",
            "discardMessage": "You have unsaved changes. Are you sure you want to discard them?",
            "continueEditing": "Continue editing",
            "discardChanges": "Discard changes"
          },
          "passwordSection": {
            "title": "Change Password",
            "oldPassword": "Current Password",
            "newPassword": "New Password",
            "confirmPassword": "Confirm New Password",
            "save": "Save",
            "keywordSuccess": "success",
            "msg": {
              "fillAll": "Please fill in all fields.",
              "mismatch": "New passwords do not match.",
              "sameAsOld": "New password cannot be the same as the current password.",
              "success": "Password changed successfully.",
              "failure": "Password change failed. Please check your current password."
            }
          }
        },
        "error": {
          "loadFail": "Loading Failed：",
          "downloadFail": "Download failed:",
          "noMerInfo": "Marchant detail not provided yet.",
          "noInfInfo": "No related influencer found."
        }
      }
    },
  },
  zh: {
    translation: {
      kol: "意见领袖",
      event: "活动",
      contact: "联系我们",
      networks: "资源",
      follow_us: "关注我们",
      quick_links: "快捷链接",
      joinus: "加入我们",
      about_us: "360传媒（360 Media）是一个多维数字, AI 生态平台，致力于融合内容、社群与商业，支付为企业与创作者赋能。我们不仅是一个媒体平台，更是一个集成SaaS（软件即服务）与PaaS（平台即服务）的智能化系统，通过连接第三方社交平台、品牌、产品与关键人物（如创始人、KOL、影响者），打造出一个具有传播力、转化力与交易闭环的综合性平台。\n360传媒内建电商引擎与超级API接口，支持多元化支付机制，包括传统法币支付、积分奖励体系、优惠券机制与数字资产通道（以合规与灵活性为导向）。我们同时兼容Web2与Web3生态，让每一个生态角色都具备更多想象空间与增值潜力。\n我们正在重新定义“消费与被消费”的未来。",
      About_us: "关于我们",
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
      loading_more: "加载中...",
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
      information_invalid: "邮箱或密码不正确。",
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
      news: "新闻",
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
      past_review: "往期回顾",
      in_progress: "正在进行中",
      up_coming: "即将推出",

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
      media_center: "媒体中心",
      societies: "社团",
      influencer: "网红",
      home: "首页",
      relatedProducts: "相关产品",
      relatedNews: "相关新闻",
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
      elite_package: "1. 直播采访\n提供两次直播采访服务，并上传至多个西方及中国社交平台，帮助客户推广品牌与故事。\n\n2. 信息上传\n在360Media平台上传信息，增加品牌曝光，为交易打下基础。\n\n3. 产品代言\n安排有影响力的人士代言客户产品，提供产品代言服务。\n\n4. MCN 网络资源\n连接MCN（多频道网络），帮助客户在社交媒体平台推广。\n\n5. 群发邮件\n提供群发邮件服务，用于活动宣传或新产品发布。\n\n6. 实习招聘\n提供实习招聘服务，支持客户的人力资源需求。\n\n7. 墨尔本CBD现场讲座/研讨会\n安排活动、演讲、讲座或研讨会，提供线下推广与互动的机会。",
      elite_package_homepage:
        `
        <ul style="list-style-type: disc; padding-left: 20px; margin: 0;">
          <li style="display: list-item; margin-bottom: 8px;">直播采访</li>
          <li style="display: list-item; margin-bottom: 8px;">信息上传</li>
          <li style="display: list-item; margin-bottom: 8px;">产品代言</li>
          <li style="display: list-item; margin-bottom: 8px;">MCN 网络资源</li>
          <li style="display: list-item; margin-bottom: 8px;">群发邮件</li>
          <li style="display: list-item; margin-bottom: 8px;">实习招聘</li>
          <li style="display: list-item; margin-bottom: 8px;">墨尔本CBD现场讲座/研讨会</li>
        </ul>
      `,
      premium_package: "\n1. 直播采访\n提供两次直播采访服务，并上传至多个西方及中国社交平台，帮助客户推广品牌与故事。\n\n2. 信息上传\n在360Media平台上传信息，增加品牌曝光，为交易打下基础。\n\n3. 产品代言\n安排有影响力的人士代言客户产品，提供产品代言服务。\n\n4. MCN 网络资源\n连接MCN（多频道网络），帮助客户在社交媒体平台推广。\n\n5. 群发邮件\n提供群发邮件服务，用于活动宣传或新产品发布。\n\n6. 实习招聘\n提供实习招聘服务，支持客户的人力资源需求。\n\n7. 墨尔本CBD现场讲座/研讨会\n安排活动、演讲、讲座或研讨会，提供线下推广与互动的机会。\n\n帮助客户制作高质量的宣传材料。",
      premium_package_extra: "1. 人脉拓展\n提供行业内的人脉拓展服务，帮助客户建立更广泛的行业联系。\n\n2. 场地租赁\n提供活动场地、拍摄场地或其他商业用途的租赁服务。\n\n3. 摄影/摄像服务\n提供专业摄影和摄像服务，帮助客户制作高质量的宣传材料。",
      premium_package_extra_homepage:
        `
        <ul style="list-style-type: disc; padding-left: 20px; margin: 0;">
          <li style="display: list-item; margin-bottom: 8px;">人脉拓展</li>
          <li style="display: list-item; margin-bottom: 8px;">场地租赁</li>
          <li style="display: list-item; margin-bottom: 8px;">摄影/摄像服务</li>
        </ul>
      `,
      enterprise_package: "\n1. 直播采访\n提供两次直播采访服务，并上传至多个西方及中国社交平台，帮助客户推广品牌与故事。\n\n2. 信息上传\n在360Media平台上传信息，增加品牌曝光，为交易打下基础。\n\n3. 产品代言\n安排有影响力的人士代言客户产品，提供产品代言服务。\n\n4. MCN 网络资源\n连接MCN（多频道网络），帮助客户在社交媒体平台推广。\n\n5. 群发邮件\n提供群发邮件服务，用于活动宣传或新产品发布。\n\n6. 实习招聘\n提供实习招聘服务，支持客户的人力资源需求。\n\n7. 墨尔本CBD现场讲座/研讨会\n安排活动、演讲、讲座或研讨会，提供线下推广与互动的机会。\n\n8. 人脉拓展\n提供行业内的人脉拓展服务，帮助客户建立更广泛的行业联系。\n\n9. 场地租赁\n提供活动场地、拍摄场地或其他商业用途的租赁服务。\n\n10. 摄影/摄像服务\n提供专业摄影和摄像服务，帮助客户制作高质量的宣传材料。",
      enterprise_package_extra: "1. 平面设计\n提供平面设计服务，帮助客户制作品牌形象、广告素材等。\n\n2. 企业合作\n提供企业合作机会，帮助客户拓展业务资源。\n\n3. 网站设计与实施\n提供网站设计与实施服务，帮助客户建立和维护品牌官网。\n\n4. 账号管理与运营\n提供账号管理与运营支持，确保品牌在各个平台持续曝光。\n\n5. 法律支持\n提供法律援助，协助客户处理法律事务，确保品牌合规。\n\n6. 战略设计\n提供战略设计服务，帮助客户制定长期品牌与市场营销策略。\n\n7. 公共关系\n提供公共关系服务，帮助客户与媒体及公众建立并维护良好关系。",
      enterprise_package_extra_homepage:
        `
        <ul style="list-style-type: disc; padding-left: 20px; margin: 0;">
          <li style="display: list-item; margin-bottom: 8px;">平面设计</li>
          <li style="display: list-item; margin-bottom: 8px;">企业合作</li>
          <li style="display: list-item; margin-bottom: 8px;">网站设计与实施</li>
          <li style="display: list-item; margin-bottom: 8px;">账号管理与运营</li>
          <li style="display: list-item; margin-bottom: 8px;">法律支持</li>
          <li style="display: list-item; margin-bottom: 8px;">战略设计</li>
          <li style="display: list-item; margin-bottom: 8px;">公共关系</li>
        </ul>
      `,
      portrait_info: "提供至少 2 张宽高比 2:3 的半身照。提供至少 1 张正方形照片。\n提供人物中英文姓名以及人物头衔：中文少于10 字，英文少于6 个单词\n需提供中英文人物简介",
      video_specification: "产品视频\n宽高比 16:9，分辨率不低于 1920 x 1080(全高清)。建议格式为 MP4，时长控制在 5 分钟以内，保证播放流畅。需展示产品功能与亮点。\n人物视频\n宽高比 16:9，分辨率不低于 1920 x 1080(全高清) 格式建议为 MP4，时长控制在 5 分钟以内， 突出人物核心价值，提升品牌形象。\n视频请单独发送至info@do360.com",
      product_specification: "需提供产品长方形尺寸照片\n 宽高比 3: 2 且分辨率不低于 900 x 600 至少 5张\n文字需提供中英文简介，精准表达产品亮点",
      merchant_text: "360传媒 提供三个核心服务套餐：精英套餐、优质套餐，以及企业与战略套餐，旨在满足从初创企业到大型品牌的各种业务需求。 加入我们，打造品牌影响力！ 在这里，您可以上传品牌创始人、产品意见领袖、产品代言人，分享品牌故事，塑造行业影响力。 同时，推荐优质产品、意见领袖以及代言人，拓展合作渠道，助力品牌曝光，让更多目标用户关注并信赖您的品牌。",
      feature_1: "<h5>全方位品牌推广</h5><p>利用直播采访、社交平台发布、群发邮件等多渠道传播手段，为品牌故事和产品最大化曝光。</p>",
      feature_2: "<h5>高效内容与视觉制作</h5><p>提供专业的摄影摄像、平面设计和网站建设服务，确保品牌形象专业统一、视觉吸引力强。</p>",
      feature_3: "<h5>影响力营销与MCN资源对接</h5><p>借助KOL代言和MCN网络资源，将产品精准传达至目标受众，提升转化率。</p>",
      feature_4: "<h5>线下互动与活动支持</h5><p>提供墨尔本CBD讲座/研讨会策划执行与活动场地租赁，增强品牌与客户之间的互动与信任。</p>",
      feature_5: "<h5>综合运营与管理支持</h5><p>提供账号管理、人力招聘与企业合作资源，助力客户轻松进行业务运营与扩展。</p>",
      feature_6: "<h5>战略规划与法律保障</h5><p>从战略设计到法律支持，为品牌提供持续增长路径与合规保障，构建长远发展基础。</p>",
      publishedAt: "发布时间",
      "whds_form_inf": {
        "title": "网红达人注册",
        "subtitle": "请填写以下信息完成注册，参与网红推广大赛",
        "basic_info": {
          "title": "基本信息",
          "name": "姓名 *",
          "name_ph": "请输入您的姓名",
          "gender": "性别 *",
          "gender_select": "请选择",
          "gender_male": "男",
          "gender_female": "女",
          "gender_other": "其他",
          "age": "年龄 *",
          "age_ph": "年龄",
          "phone": "联系电话 *",
          "phone_ph": "输入联系电话",
          "email": "邮箱 *",
          "email_ph": "输入邮箱地址",
          "location": "所在城市/国家 *",
          "location_ph": "例：北京，中国"
        },
        "social_media": {
          "title": "社交媒体信息",
          "account": "媒体账号 *",
          "platform_ph": "平台(Platform)",
          "nickname_ph": "平台昵称/id",
          "fans_ph": "粉丝数(Fan Number)",
          "add_account": "添加媒体账号"
        },
        "experience": {
          "title": "内容及经验",
          "past": "过往合作品牌/案例（可选）",
          "past_ph": "请简要描述您过往的品牌合作经验和成功案例"
        },
        "training": {
          "title": "网红培训",
          "need_label": "您是否需要付费专业网红培训 *",
          "need": "需要",
          "no_need": "不需要"
        },
        "categories": {
          "title": "愿意宣传的商品/服务类别 * (可多选)",
          "food_beverage": "食品饮料",
          "cosmetics": "化妆品",
          "travel": "旅游产品",
          "fashion": "时尚服饰",
          "electronics": "数码电子",
          "home": "家居用品",
          "health": "健康保健",
          "education": "教育培训",
          "finance": "金融服务",
          "entertainment": "娱乐游戏",
          "automotive": "汽车用品",
          "mother_baby": "母婴用品",
          "other": "其他"
        },
        "endorsement": {
          "title": "代言条款",
          "placeholder": "如您接受来自主办方和商家的代言，请具体填写详细信息例如分红、额外条件"
        },
        "commitment": {
          "title": "参赛承诺",
          "rules": "我同意遵守比赛规则和要求 *",
          "usage": "我允许主办方使用我的参赛作品进行宣传推广 *"
        },
        "submit": "提交注册申请"
      },
      "whds_form_mch": {
        "title": "商家/赞助商注册",
        "subtitle": "请填写以下信息完成注册，参与网红推广大赛",
        "basic_info": {
          "title": "基本信息",
          "company_name": "商家名称 *",
          "company_name_ph": "请输入商家/公司名称",
          "industry": "行业类别 *",
          "industry_select": "请选择行业类别",
          "industry_beauty": "美妆护肤",
          "industry_fashion": "时尚服饰",
          "industry_food": "食品饮料",
          "industry_electronics": "数码电子",
          "industry_home": "家居用品",
          "industry_health": "健康保健",
          "industry_education": "教育培训",
          "industry_travel": "旅游出行",
          "industry_finance": "金融服务",
          "industry_entertainment": "娱乐游戏",
          "industry_other": "其他",
          "website": "公司网站",
          "description": "公司描述 *",
          "description_ph": "简要描述您的公司业务、品牌理念和发展历程"
        },
        "contact": {
          "title": "负责人信息",
          "lastname": "负责人姓 *",
          "lastname_ph": "输入姓",
          "firstname": "负责人名 *",
          "firstname_ph": "输入名",
          "email": "电子邮箱 *",
          "email_ph": "输入电子邮箱",
          "phone": "联系电话 *",
          "phone_ph": "输入联系电话"
        },
        "terms": {
          "title": "入驻条款",
          "sponsorship": "赞助形式 *",
          "sponsorship_ph": "填写您意向的赞助方式: 商品/服务，法币，数字货币并填写实际估值的价格",
          "exclusive": "独家赞助",
          "exclusive_ph": "如您希望就某个领域独家赞助，请填写实际估值的价格 （选填）",
          "reference": "推荐网红",
          "reference_ph": "如您希望自己推荐网红，请填写网红的信息以及联系方式（选填）",
          "additional": "赞助额外条件",
          "additional_ph": "如您有特殊的赞助方式请填写详细信息例如分红、形式（选填）"
        },
        "submit": "提交注册申请"
      },
      "whds_errors": {
        "file_license_too_large": "部分文件大小超过 10MB，未添加！",
        "file_product_too_large": "部分文件大小超过 5MB，未添加！",
        "company_name_required": "商家名称不能为空",
        "company_description_required": "请填写相关公司简介",
        "industry_required": "请选择行业类别",
        "contact_firstname_required": "负责人名字不能为空",
        "contact_lastname_required": "负责人姓不能为空",
        "email_required": "电子邮箱不能为空",
        "email_invalid": "电子邮箱格式不正确",
        "phone_required": "电话不能为空",
        "phone_invalid": "电话格式不正确",
        "sponsorship_required": "请填写赞助形式",
        "file_portfolio_too_large": "部分作品文件大小超过 10MB，未添加！",
        "file_personal_too_large": "部分个人图片大小超过 10MB，未添加！",
        "name_required": "姓名不能为空",
        "gender_required": "请填写性别",
        "age_required": "请填写年龄",
        "location_required": "所在城市/国家不能为空",
        "social_media_required": "请至少填写一个主力社交平台",
        "social_media_incomplete": "第 {{index}} 个社交媒体账号未完整填写（平台/昵称/粉丝数必须同时填写）",
        "training_required": "请选择是否需要培训服务",
        "rules_agreement_required": "请同意遵守比赛规则",
        "usage_agreement_required": "请同意主办方使用参赛作品做宣传"
      },
      "whds_page": {
        "submit_success": "提交成功",
        "submit_success_msg": "您的资料已成功上传！",
        "submit_error": "提交失败",
        "submit_error_msg": "资料提交失败，请检查网络或稍后重试！",
        "retry": "重试",
        "close": "关闭",
        "event_info": "活动信息",
        "time": "时间",
        "location": "地点",
        "host": "主办方",
        "overview": "活动总览",
        "no_description": "暂无描述",
        "event_description": "活动详情",
        "registration_method": "报名方式",
        "uploading": "正在上传，请稍候...",
        "tab_merchant": "商家/赞助商注册",
        "tab_influencer": "网红达人注册"
      },
      "whds_ranking": {
        "hero": {
          "title": "网红比赛",
          "description": "实时动态排名，见证网红积分变化，看看谁领先比赛！",
          "liveUpdates": "实时更新"
        },
        "podium": {
          "title": "前三名"
        },
        "leaderboard": {
          "title": "排行榜"
        },
        "stats": {
          "total": "总参赛人数",
          "highest": "最高分",
          "liveValue": "直播",
          "liveLabel": "实时更新"
        },
        "footer": {
          "text": "排名每10秒更新一次 • 实时竞赛"
        },
        "modal": {
          "defaultTitle": "人物信息",
          "name": "姓名：",
          "gender": "性别：",
          "age": "年龄：",
          "location": "所在地：",
          "category": "类别：",
          "languages": "语言：",
          "followers": "粉丝：",
          "email": "邮箱：",
          "totalScore": "总分：",
          "merchantScore": "商家扫码分：",
          "adminScore": "组委会加分：",
          "relatedMerchants": "关联商家",
          "loading": "加载中…",
          "noMerchants": "暂无关联商家",
          "close": "关闭"
        }
      },
      "profile": {
        "page": {
          "sidebar": {
            "account": "账号信息",
            "password": "密码设置",
            "influencer": "网红信息",
            "sellerCampaigns": "商家优惠",
            "seller": "店铺信息",
            "relatedInfluencer": "代言网红"
          },
          "user": {
            "defaultName": "用户",
            "defaultRole": "用户"
          },
          "accountInfo": {
            "title": "账号信息",
            "edit": "编辑资料",
            "username": "用户名",
            "email": "邮箱地址",
            "phone": "手机号码",
            "location": "所在地区",
            "joinDate": "加入时间"
          },
          "common": {
            "notSet": "未设置",
            "unknown": "未知"
          },
          "password": {
            "title": "密码设置"
          },
          "influencer": {
            "title": "网红信息",
            "couponInfo": "优惠券信息",
            "profileInfo": "网红资料"
          },
          "sellerCampaigns": {
            "title": "商家优惠",
            "availableCoupons": "可用优惠"
          },
          "seller": {
            "title": "店铺信息",
            "qrInfo": "二维码信息"
          },
          "relatedInfluencer": {
            "title": "代言网红"
          },
          "sellerDetail": {
            "title": "商家详情",
            "basicInfo": "商家信息",
            "companyName": "公司名称",
            "industry": "行业",
            "address": "地址",
            "abn": "ABN 编号",
            "email": "邮箱",
            "phone": "电话",
            "website": "网站",
            "campaignPrefs": "活动偏好",
            "noCampaigns": "暂无活动",
            "untitledCampaign": "未命名活动",
            "requirement": "要求",
            "validUntil": "有效期至",
            "contactUsBtn": "联系我们",
            "contactUsNote": "如需修改店铺或活动信息，请发送邮件至：info@do360.com"
          },
          "sellerCampaignsSection": {
            "loading": "正在加载商家优惠...",
            "noSellers": "暂无商家",
            "unnamedSeller": "未命名商家",
            "address": "地址：",
            "website": "官网：",
            "promotions": "活动优惠",
            "untitledPromotion": "未命名优惠",
            "requirement": "商家要求：",
            "none": "无",
            "validUntil": "有效期至：",
            "noPromotions": "暂无优惠活动",
            "media": "宣传材料",
            "file": "文件",
            "download": "下载",
            "downloadFailedAlert": "下载失败，请稍后重试。",
            "fileType": {
              "image": "图片",
              "video": "视频",
              "audio": "音频",
              "generic": "文件"
            }
          },
          "relatedInfluencer": {
            "noInfluencers": "暂无代言网红",
            "title": "人物信息",
            "name": "姓名：",
            "gender": "性别：",
            "age": "年龄：",
            "location": "所在地：",
            "category": "类别：",
            "languages": "语言：",
            "followers": "粉丝：",
            "email": "邮箱：",
            "close": "关闭"
          },
          "profileEditModal": {
            "title": "编辑个人信息",
            "username": "用户名",
            "usernamePlaceholder": "请输入用户名",
            "bio": "简介",
            "bioPlaceholder": "请输入简介",
            "avatar": "头像",
            "avatarTip": "建议选择方形图片以获得最佳显示效果",
            "cancel": "取消",
            "save": "保存",
            "discardTitle": "放弃更改？",
            "discardMessage": "你有未保存的更改，确定要放弃吗？",
            "continueEditing": "继续编辑",
            "discardChanges": "放弃更改"
          },
          "passwordSection": {
            "title": "修改密码",
            "oldPassword": "原密码",
            "newPassword": "新密码",
            "confirmPassword": "确认新密码",
            "save": "保存",
            "keywordSuccess": "成功",
            "msg": {
              "fillAll": "请填写所有字段",
              "mismatch": "两次新密码输入不一致",
              "sameAsOld": "新密码不能与原密码相同",
              "success": "密码修改成功",
              "failure": "密码修改失败，请检查原密码是否正确"
            }
          }
        },
        "error": {
          "loadFail": "加载失败：",
          "downloadFail": "下载失败:",
          "noMerInfo": "暂无商家资料",
          "noInfInfo": "暂无代言网红"
        }
      }
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
