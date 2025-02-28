import React from "react";
import { Link, useLocation } from "react-router-dom";

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  return (
    <nav className="breadcrumbs-container">
      <div className="breadcrumbs">
        <span>
          <Link to="/" className="breadcrumb-link">Home</Link>
          {pathnames.length > 0 && <span className="breadcrumb-separator"> / </span>}
        </span>
        {pathnames.map((name, index) => {
          const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
          return (
            <span key={name}>
              <Link to={routeTo} className="breadcrumb-link">{name}</Link>
              {index < pathnames.length - 1 && <span className="breadcrumb-separator"> / </span>}
            </span>
          );
        })}
      </div>
    </nav>
  );
};

export default Breadcrumbs;


// import React, { useEffect, useState } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { useTranslation } from "react-i18next";

// const Breadcrumbs = () => {
//   const { i18n } = useTranslation();
//   const location = useLocation();
//   const pathnames = location.pathname.split("/").filter((x) => x);
//   const [titles, setTitles] = useState({});

//   // ✅ 预定义路径翻译（避免不必要的 API 请求）
//   const predefinedPaths = {
//     home: { zh: "首页", en: "Home" },
//     news: { zh: "新闻", en: "News" },
//     products: { zh: "产品", en: "Products" },
//     brands: { zh: "品牌", en: "Brands" },
//     people: { zh: "人物", en: "People" },
//   };

//   // ✅ 定义 API 查询字段
//   const getApiInfo = (contentType) => {
//     const apiMap = {
//       news: { endpoint: "news", urlField: "news_url", zh: "headline_zh", en: "headline_en" },
//       products: { endpoint: "products", urlField: "product_url", zh: "title_zh", en: "title_en" },
//       brands: { endpoint: "brands", urlField: "brand_url", zh: "name_zh", en: "name_en" },
//       people: { endpoint: "people", urlField: "person_url", zh: "fullname_zh", en: "fullname_en" },
//     };
//     return apiMap[contentType] || null;
//   };

//   // ✅ 仅对 URL 字段查询 API
//   useEffect(() => {
//     const fetchTitles = async () => {
//       const newTitles = { ...titles };

//       for (let i = 0; i < pathnames.length; i++) {
//         const path = pathnames[i];
//         const prevPath = i > 0 ? pathnames[i - 1] : null; // `/products/iphone` → `prevPath = products`

//         if (predefinedPaths[path]) {
//           // ✅ 预定义路径（如 `products → 产品`）
//           newTitles[path] = predefinedPaths[path];
//         } else if (prevPath && !newTitles[path]) {
//           // ✅ 仅对内容 URL 进行 API 查询
//           const apiInfo = getApiInfo(prevPath);
//           if (apiInfo) {
//             try {
//               const response = await fetch(
//                 `/api/${apiInfo.endpoint}?filters[${apiInfo.urlField}][$eq]=${path}&fields[0]=${apiInfo.zh}&fields[1]=${apiInfo.en}`
//               );
//               const data = await response.json();

//               if (data?.data?.length > 0) {
//                 newTitles[path] = {
//                   zh: data.data[0].attributes[apiInfo.zh] || path,
//                   en: data.data[0].attributes[apiInfo.en] || path,
//                 };
//               } else {
//                 newTitles[path] = { zh: path, en: path };
//               }
//             } catch (error) {
//               newTitles[path] = { zh: path, en: path };
//             }
//           }
//         }
//       }
//       setTitles(newTitles);
//     };

//     fetchTitles();
//   }, [location.pathname, i18n.language]);

//   return (
//     <nav className="breadcrumbs-container">
//       <div className="breadcrumbs">
//         <span>
//           <Link to="/" className="breadcrumb-link">
//             {i18n.language === "zh" ? predefinedPaths.home.zh : predefinedPaths.home.en}
//           </Link>
//           {pathnames.length > 0 && <span className="breadcrumb-separator"> / </span>}
//         </span>
//         {pathnames.map((path, index) => {
//           const routeTo = `/${pathnames.slice(0, index + 1).join("/")}`;
//           const displayName = titles[path]
//             ? i18n.language === "zh"
//               ? titles[path].zh
//               : titles[path].en
//             : path;

//           return (
//             <span key={path}>
//               <Link to={routeTo} className="breadcrumb-link">{displayName}</Link>
//               {index < pathnames.length - 1 && <span className="breadcrumb-separator"> / </span>}
//             </span>
//           );
//         })}
//       </div>
//     </nav>
//   );
// };

// export default Breadcrumbs;