import { useEffect, useState } from "react";
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

  // Predefined static labels
  const predefinedPaths = {
    home: { zh: "首页", en: "Home" },
    news: { zh: "新闻", en: "News" },
    events: { zh: "活动", en: "Event" },
    products: { zh: "产品", en: "Products" },
    brands: { zh: "品牌", en: "Brands" },
    founders: { zh: "品牌创始人", en: "Founders" },
    kols: { zh: "产品意见领袖", en: "Kols" },
    ambassadors: { zh: "产品代言人", en: "Ambassadors" },
    "about-us":{zh:"关于我们",en:"About Us"},
    "networks":{zh:"资源",en:"Networks"},
    "influencer":{zh:"网红",en:"Influencer"},
    "group":{zh:"社团",en:"Influencer"},
    "related-news": { zh: "相关新闻", en: "Related News" },
    "related-event": { zh: "相关活动", en: "Related Event" },
    "related-brand": { zh: "相关品牌", en: "Related Brand" },
    "related-product": { zh: "相关产品", en: "Related Product" },
    "related-person": { zh: "相关人物", en: "Related Person" },
    "related-founder": { zh: "品牌创始人", en: "Related Founder" },
    "related-kol": { zh: "产品意见领袖", en: "Related Kol" },
    "related-ambassador": { zh: "产品代言人", en: "Related Ambassador" },
    "360-media-promotion-service": { zh: "360平台推广服务", en: "360 Media Promotion Service" }
  };

  // API mapping based on top-level segment
  const getApiInfo = (contentType) => {
    const apiMap = {
      news:    { endpoint: "news",     urlField: "url", internalZh: "Title_zh", internalEn: "Title_en" },
      events:  { endpoint: "events",   urlField: "url", internalZh: "Name_zh",  internalEn: "Name_en" },
      products:{ endpoint: "products", urlField: "url", internalZh: "Name_zh",  internalEn: "Name_en" },
      brands:  { endpoint: "brands",   urlField: "internal_url", internalZh: "name_zh", internalEn: "name_en" },
      founders:    { endpoint: "people", urlField: "internal_url", internalZh: "Name_zh", internalEn: "Name_en" },
      kols:        { endpoint: "people", urlField: "internal_url", internalZh: "Name_zh", internalEn: "Name_en" },
      ambassadors:{ endpoint: "people", urlField: "internal_url", internalZh: "Name_zh", internalEn: "Name_en" }
    };
    return apiMap[contentType] || null;
  };

  useEffect(() => {
    const fetchTitles = async () => {
      const newTitles = {};

      // Fill in predefined labels
      pathnames.forEach((seg) => {
        if (predefinedPaths[seg]) {
          newTitles[seg] = predefinedPaths[seg];
        }
      });

      // Determine top-level to pick API mapping
      const topLevel = pathnames[0];
      const apiInfo = getApiInfo(topLevel);

      // Fetch labels for dynamic slugs under this mapping
      if (apiInfo) {
        for (let i = 1; i < pathnames.length; i++) {
          const slug = pathnames[i];
          if (newTitles[slug]) continue; // skip if predefined

          try {
            const res = await fetch(
              `${BACKEND_HOST}/api/${apiInfo.endpoint}` +
              `?filters[${apiInfo.urlField}][$eq]=${slug}` +
              `&fields[0]=${apiInfo.internalZh}&fields[1]=${apiInfo.internalEn}`
            );
            const json = await res.json();
            if (json.data?.length > 0) {
              newTitles[slug] = {
                zh: json.data[0][apiInfo.internalZh] || slug,
                en: json.data[0][apiInfo.internalEn] || slug
              };
            } else {
              newTitles[slug] = { zh: slug, en: slug };
            }
          } catch {
            newTitles[slug] = { zh: slug, en: slug };
          }
        }
      }

      setTitles(newTitles);
    };

    // Only fetch on path change, not on language change
    fetchTitles();
  }, [location.pathname]);

  // Hide on home
  if (location.pathname === "/") return null;

  return (
    <Container>
      <nav className="breadcrumbs-container">
        <div className="breadcrumbs">
          <span>
            <span className="breadcrumb-text">
              {i18n.language === "zh"
                ? predefinedPaths.home.zh
                : predefinedPaths.home.en}
            </span>
            {pathnames.length > 0 && <span className="breadcrumb-separator"> / </span>}
          </span>

          {pathnames.map((path, idx) => {
            const label = titles[path]
              ? i18n.language === "zh"
                ? titles[path].zh
                : titles[path].en
              : path;

            return (
              <span key={idx}>
                <span className={path === "person" ? "breadcrumb-disabled" : "breadcrumb-current"}>
                  {label}
                </span>
                {idx < pathnames.length - 1 && <span className="breadcrumb-separator"> / </span>}
              </span>
            );
          })}
        </div>
      </nav>
    </Container>
  );
};

export default Breadcrumbs;

