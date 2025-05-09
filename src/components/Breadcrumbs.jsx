import React, { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import "../css/Breadcrumbs.css";

const Breadcrumbs = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter(x => x);
  const [titles, setTitles] = useState({});

  const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

  // ✅ 预定义路径翻译（避免不必要的 API 请求）
  const predefinedPaths = {
    home: { zh: "首页", en: "Home" },
    news: { zh: "新闻", en: "News" },
    events: { zh: "活动", en: "Event" },
    products: { zh: "产品", en: "Products" },
    brands: { zh: "品牌", en: "Brands" },
    person: { zh: "人物", en: "Person" },
    founders: { zh: "品牌创始人", en: "Founders" },
    kols: { zh: "产品意见领袖", en: "Kols" },
    merchant: { zh: "商家", en: "Merchant" },
    ambassadors: { zh: "产品代言人", en: "Ambassadors" },
    "related-news": { zh: "相关新闻", en: "Related News" },
    "related-event": { zh: "相关活动", en: "Related Event" },
    "related-brand": { zh: "相关品牌", en: "Related Brand" },
    "related-product": { zh: "相关产品", en: "Related Product" },
    "related-person": { zh: "相关人物", en: "Related Person" },
    "related-founder": { zh: "品牌创始人", en: "Related Founder" },
    "related-kol": { zh: "产品意见领袖", en: "Related Kol" },
    "related-ambassador": { zh: "产品代言人", en: "Related Ambassador" },
    "360-media-promotion-service":{ zh: "360平台推广服务", en: "360 Meadia promotion service" }
  };

  // ✅ 定义 API 查询字段
  const getApiInfo = contentType => {
    const apiMap = {
      news: {
        endpoint: "news",
        urlField: "url",
        zh: "Title_zh",
        en: "Title_en",
      },
      events: {
        endpoint: "events",
        urlField: "url",
        zh: "Name_zh",
        en: "Name_en",
      },
      products: {
        endpoint: "products",
        urlField: "url",
        zh: "Name_zh",
        en: "Name_en",
      },
      brands: {
        endpoint: "brands",
        urlField: "internal_url",
        zh: "name_zh",
        en: "name_en",
      },
      person: {
        endpoint: "people",
        urlField: "internal_url",
        zh: "Name_zh",
        en: "Name_en",
      },
      founders: {
        endpoint: "people",
        urlField: "internal_url",
        zh: "Name_zh",
        en: "Name_en",
      },
      kols: {
        endpoint: "people",
        urlField: "internal_url",
        zh: "Name_zh",
        en: "Name_en",
      },
      ambassadors: {
        endpoint: "people",
        urlField: "internal_url",
        zh: "Name_zh",
        en: "Name_en",
      },
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
              console.log(data);

              if (data?.data?.length > 0) {
                newTitles[path] = {
                  zh: data.data[0][apiInfo.zh] || path,
                  en: data.data[0][apiInfo.en] || path,
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, i18n.language]);

  // Hide breadcrumbs on the homepage
  if (location.pathname === "/") {
    return null;
  }

  return (
    <Container>
      <nav className='breadcrumbs-container'>
        <div className='breadcrumbs'>
          <span>
            <span className='breadcrumb-text'>
              {i18n.language === "zh"
                ? predefinedPaths.home.zh
                : predefinedPaths.home.en}
            </span>
            {pathnames.length > 0 && (
              <span className='breadcrumb-separator'> / </span>
            )}
          </span>
          {pathnames.map((path, index) => {
            const displayName = titles[path]
              ? i18n.language === "zh"
                ? titles[path].zh
                : titles[path].en
              : path;

            return (
              <span key={path}>
                <span
                  className={
                    path === "person"
                      ? "breadcrumb-disabled"
                      : "breadcrumb-current"
                  }
                >
                  {displayName}
                </span>
                {index < pathnames.length - 1 && (
                  <span className='breadcrumb-separator'> / </span>
                )}
              </span>
            );
          })}
        </div>
      </nav>
    </Container>
  );
};

export default Breadcrumbs;
