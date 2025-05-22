import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/RecentProductsBar.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const RecentProductsBar = () => {
  const [recentProducts, setRecentProducts] = useState([]);

  const updateRecentProducts = () => {
    const stored =
      JSON.parse(localStorage.getItem("recentProducts")) || [];
    setRecentProducts(stored);
  };

  useEffect(() => {
    // 初始化时加载最近浏览的商品
    updateRecentProducts();

    // 监听自定义事件
    const onUpdate = () => updateRecentProducts();
    window.addEventListener("recentProductsUpdated", onUpdate);
    return () => {
      window.removeEventListener("recentProductsUpdated", onUpdate);
    };
  }, []);

  if (recentProducts.length === 0) return null;
  const mostRecent = recentProducts[0];

  return (
    <div className="recent-products-bar">
      <div className="recent-products-title">最近浏览的商品</div>
      <div className="recent-product-item">
        <Link
          to={`/products/${mostRecent.url}`}
          className="recent-product-link"
        >
          <img
            src={
              mostRecent.image
                ? `${BACKEND_HOST}${mostRecent.image}`
                : "https://placehold.co/50x50"
            }
            alt={mostRecent.name}
            className="recent-product-image"
          />
          <div className="recent-product-name">
            {mostRecent.name}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default RecentProductsBar;
