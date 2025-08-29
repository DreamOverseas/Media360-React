import React, { useState, useEffect } from 'react';
import axios from "axios";


const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banner, setBannerList] = useState([]);
  const [error, setError] = useState(null);

  // Banner数据
  const bannerData = [
    {
      id: 1,
      title: "欢迎来到我们的平台",
      subtitle: "体验最佳的服务和产品",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=600",
      buttonText: "立即开始",
      buttonLink: "whds"
    }
  ];

  // 上一张
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + bannerData.length) % bannerData.length);
  };

  // 下一张
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerData.length);
  };

  // 跳转到指定幻灯片
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  // 自动播放
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(timer);
  }, [currentSlide]);

  useEffect(() => {
      axios.get(`${BACKEND_HOST}/api/advertisements`, 
        { params: 
          {
            "sort": "Order:desc",
              "populate": "*" 
          } 
        }
      )
      .then((response) => {
        const bannerData = response.data?.data || null;
        if (bannerData.length > 0) {
          setBannerList(bannerData);
          console.log(bannerData);
        } else {
          setError("No data found");
        }
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setError("Error fetching data");
      });
  }, []);

  return (
    <div className="relative w-full h-96 md:h-[500px] lg:h-[600px] overflow-hidden bg-gray-900">
      {/* 幻灯片容器 */}
      <div 
        className="flex transition-transform duration-500 ease-in-out h-full"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {banner.map((entry, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            {/* 背景图片 */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{ backgroundImage: `url(${BACKEND_HOST}${entry.Image[0].url})`}}
            >
              {/* 遮罩层 */}
              <div className="absolute inset-0 bg-white/10"></div>
            </div>
            
            {/* 内容 */}
            <div className="relative z-10 h-full flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-12">
              <div className="text-left text-white max-w-3xl">
                {/* 标题 */}
                {entry.Title && (
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                    {entry.Title}
                  </h1>
                )}

                {/* 副标题 */}
                {entry.SubTitle && (
                  <p className="text-lg sm:text-xl md:text-2xl mb-6 text-gray-200 max-w-xl">
                    {entry.SubTitle}
                  </p>
                )}

                {/* 按钮 */}
                {entry.ButtonText && entry.ButtonLink && (
                  <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer outline-none focus:ring-4 focus:ring-blue-300"
                    onClick={() => window.open(`events/${entry.ButtonLink}`, "_blank")}
                    type="button"
                  >
                    {entry.ButtonText}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 左右箭头 */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300 z-20 group cursor-pointer border-0 outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        aria-label="上一张"
        type="button"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-300 z-20 group cursor-pointer border-0 outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
        aria-label="下一张"
        type="button"
      >
        <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 指示器 */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
        {banner.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 !rounded-full transition-all duration-300 cursor-pointer outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 ${
              currentSlide === index
                ? 'bg-white scale-125'
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
            aria-label={`跳转到第${index + 1}张幻灯片`}
            type="button"
          />
        ))}
      </div>
    </div>
  );
};

export default Banner;