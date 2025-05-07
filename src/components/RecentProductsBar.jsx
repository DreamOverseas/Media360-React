import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/RecentProductsBar.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const RecentProductsBar = () => {
  const [recentProducts, setRecentProducts] = useState([]);

  const updateRecentProducts = () => {
    const storedProducts =
      JSON.parse(localStorage.getItem("recentProducts")) || [];
    setRecentProducts(storedProducts);
  };

  useEffect(() => {
    // 清空 localStorage 中的最近浏览商品
    localStorage.removeItem("recentProducts");

    // 初始化时加载最近浏览的商品
    updateRecentProducts();

    // 监听自定义事件
    const handleRecentProductsUpdate = () => {
      updateRecentProducts();
    };

    window.addEventListener(
      "recentProductsUpdated",
      handleRecentProductsUpdate
    );

    // 清理事件监听器
    return () => {
      window.removeEventListener(
        "recentProductsUpdated",
        handleRecentProductsUpdate
      );
    };
  }, []);

  if (recentProducts.length === 0) return null
  const mostRecentProduct = recentProducts[0]; // 获取最近的一个商品

  return (
      <div className='recent-products-bar'>
        <div className='recent-products-title'>最近浏览的商品</div>
          <div className='recent-product-item'>
            <Link
              to={`/products/${mostRecentProduct.url}`}
              className='recent-product-link'
            >
              <img
                src={
                  mostRecentProduct.image
                    ? `${BACKEND_HOST}${mostRecentProduct.image}`
                    : "https://placehold.co/50x50"
                }
                alt={mostRecentProduct.name}
                className='recent-product-image'
              />
              <div className='recent-product-name'>{mostRecentProduct.name}</div>
            </Link>
          </div>
      </div>
  );
};

export default RecentProductsBar;
