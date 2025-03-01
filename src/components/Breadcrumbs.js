import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../css/Breadcrumbs.css";

const Breadcrumbs = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);
  const [titles, setTitles] = useState({});

  const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

  // ✅ 预定义路径翻译（避免不必要的 API 请求）
  const predefinedPaths = {
    "home": { zh: "首页", en: "Home" },
    "news": { zh: "新闻", en: "News" },
    "events": { zh: "活动", en: "Event"},
    "products": { zh: "产品", en: "Products" },
    "brands": { zh: "品牌", en: "Brands" },
    "person": { zh: "人物", en: "Person" },
    "founders": { zh: "品牌创始人", en: "Founders" },
    "kols": { zh: "产品意见领袖", en: "Kols" },
    "ambassadors": { zh: "产品代言人", en: "Ambassadors" },
    "related-news":{zh: "相关新闻", en: "Related News"},
    "related-product":{zh: "相关产品", en: "Related Product"},
    "related-founder":{zh: "品牌创始人", en: "Related Founder"},
    "related-kol":{zh: "产品意见领袖", en: "Related Kol"},
    "related-ambassador":{zh: "产品代言人", en: "Related Ambassador"}
  };

  // ✅ 定义 API 查询字段
  const getApiInfo = (contentType) => {
    const apiMap = {
      news: { endpoint: "news", urlField: "url", zh: "Title_zh", en: "Title_en" },
      events: { endpoint: "events", urlField: "url", zh: "Name_zh", en: "Name_en" },
      products: { endpoint: "products", urlField: "url", zh: "Name_zh", en: "Name_en" },
      brands: { endpoint: "brands", urlField: "internal_url", zh: "name_zh", en: "name_en" },
      person: { endpoint: "people", urlField: "internal_url", zh: "Name_zh", en: "Name_en" },
      founders: { endpoint: "people", urlField: "internal_url", zh: "Name_zh", en: "Name_en" },
      kols: { endpoint: "people", urlField: "internal_url", zh: "Name_zh", en: "Name_en" },
      ambassadors: { endpoint: "people", urlField: "internal_url", zh: "Name_zh", en: "Name_en" },
    };
    return apiMap[contentType] || null;
  };

  // ✅ 仅对 URL 字段查询 API
  useEffect(() => {
    const fetchTitles = async () => {
      const newTitles = { ...titles };

      for (let i = 0; i < pathnames.length; i++) {
        const path = pathnames[i];
        const prevPath = i > 0 ? pathnames[i - 1] : null; // `/products/iphone` → `prevPath = products`

        if (predefinedPaths[path]) {
          // ✅ 预定义路径（如 `products → 产品`）
          newTitles[path] = predefinedPaths[path];
        } else if (prevPath && !newTitles[path]) {
          // ✅ 仅对内容 URL 进行 API 查询
          const apiInfo = getApiInfo(prevPath);
          if (apiInfo) {
            try {
              const response = await fetch(
                `${BACKEND_HOST}/api/${apiInfo.endpoint}?filters[${apiInfo.urlField}][$eq]=${path}&fields[0]=${apiInfo.zh}&fields[1]=${apiInfo.en}`
              );
              const data = await response.json();
              console.log(data)

              if (data?.data?.length > 0) {
                newTitles[path] = {
                  zh: data.data[0][apiInfo.zh] || path,
                  en: data.data[0][apiInfo.en]|| path,
                };
              } else {
                newTitles[path] = { zh: path, en: path };
              }
            } catch (error) {
              newTitles[path] = { zh: path, en: path };
            }
          }
        }
      }
      setTitles(newTitles);
    };

    fetchTitles();
  }, [location.pathname, i18n.language]);

  return (
    <nav className="breadcrumbs-container">
      <div className="breadcrumbs">
        <span>
          <Link to="/" className="breadcrumb-link">
            {i18n.language === "zh" ? predefinedPaths.home.zh : predefinedPaths.home.en}
          </Link>
          {pathnames.length > 0 && <span className="breadcrumb-separator"> / </span>}
        </span>
        {pathnames.map((path, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          const displayName = titles[path]
            ? i18n.language === "zh"
              ? titles[path].zh
              : titles[path].en
            : path;

          return (
            <span key={path}>
              {index === pathnames.length - 1 ? (
                <span className="breadcrumb-current">{displayName}</span>
              ) : (
                <Link to={routeTo} className="breadcrumb-link">{displayName}</Link>
              )}
              {index < pathnames.length - 1 && <span className="breadcrumb-separator"> / </span>}
            </span>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumbs;