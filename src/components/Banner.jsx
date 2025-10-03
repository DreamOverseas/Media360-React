import React, { useState, useEffect } from 'react';
import axios from "axios";
import { useTranslation } from "react-i18next";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
const DEBUG = import.meta.env.DEBUG;

const Banner = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banner, setBannerList] = useState([]);
  const [error, setError] = useState(null);

  const { i18n } = useTranslation();

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
          if (DEBUG) console.log(bannerData);
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
    <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[500px] xl:h-[600px] overflow-hidden bg-gray-900">
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
              {/* 遮罩层 - 移动端增强对比度 */}
              <div className="absolute inset-0 bg-black/30 sm:bg-black/20 md:bg-white/10"></div>
            </div>
            
            {/* 内容 */}
            <div className="relative z-10 h-full flex items-center justify-center px-3 sm:px-4 md:px-6 lg:px-8 pb-8 sm:pb-12">
              <div className="text-center sm:text-left text-white max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-3xl w-full">
                {/* 标题 - 移动端优化字体大小和行高 */}
                {entry.Title && (
                  <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-2 sm:mb-3 md:mb-4 leading-tight drop-shadow-lg">
                    {i18n.language=='zh' ? entry.Title : entry.Title_en}
                  </h1>
                )}

                {/* 副标题 - 移动端优化 */}
                {entry.SubTitle && (
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-4 sm:mb-5 md:mb-6 text-gray-100 md:text-gray-200 max-w-xs sm:max-w-sm md:max-w-xl drop-shadow-md">
                    {i18n.language=='zh' ? entry.SubTitle : entry.SubTitle_en}
                  </p>
                )}

                {/* 按钮 - 移动端优化尺寸 */}
                {/* {entry.ButtonText && entry.ButtonLink && (
                  <div>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 sm:py-2.5 sm:px-6 md:py-3 md:px-8 rounded-lg text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 cursor-pointer outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => window.open(`events/${entry.ButtonLink}`, "_blank")}
                      type="button"
                    >
                      {entry.ButtonText}
                    </button>
                  </div>
                  
                )}

                {entry.SecondButton && entry.SecondButtonText && entry.SecondButtonLink && (
                  <div>
                    <button
                      className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2 px-4 sm:py-2.5 sm:px-6 md:py-3 md:px-8 rounded-lg text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 cursor-pointer outline-none focus:ring-2 focus:ring-blue-300"
                      onClick={() => window.open(`events/${entry.SecondButtonLink}`, "_blank")}
                      type="button"
                    >
                    {entry.SecondButtonText}
                    </button>
                  </div>
                )} */}
                {(entry.ButtonText && entry.ButtonLink) || (entry.SecondButton && entry.SecondButtonText && entry.SecondButtonLink) ? (
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center sm:items-start justify-center sm:justify-start">
                    {entry.ButtonText && entry.ButtonLink && (
                      <button
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 sm:py-2.5 sm:px-6 md:py-3 md:px-8 rounded-lg text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 cursor-pointer outline-none focus:ring-2 focus:ring-blue-300 sm:w-full w-1/2 min-w-0 sm:min-w-32"
                        onClick={() => window.open(`events/${entry.ButtonLink}`, "_blank")}
                        type="button"
                      >
                        {i18n.language=='zh' ? entry.ButtonText : entry.ButtonText_en}
                      </button>
                    )}

                    {entry.SecondButton && entry.SecondButtonText && entry.SecondButtonLink && (
                      <button
                        className="bg-purple-500 hover:bg-purple-400 backdrop-blur-sm border border-white/30 text-white font-semibold py-2 px-4 sm:py-2.5 sm:px-6 md:py-3 md:px-8 rounded-lg text-sm sm:text-base md:text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95 cursor-pointer outline-none focus:ring-2 focus:ring-white/50 sm:w-full w-1/2 min-w-0 sm:min-w-32"
                        onClick={() => window.open(`events/${entry.SecondButtonLink}`, "_blank")}
                        type="button"
                      >
                        {i18n.language=='zh' ? entry.SecondButtonText : entry.SecondButtonText_en}
                      </button>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 左右箭头 - 移动端优化 */}
      <button
        onClick={prevSlide}
        className="absolute left-1 sm:left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 active:bg-black/95 text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-300 z-20 group cursor-pointer border-0 outline-none focus:ring-2 focus:ring-white/50"
        aria-label="上一张"
        type="button"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-1 sm:right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 active:bg-black/95 text-white p-1.5 sm:p-2 md:p-3 rounded-full transition-all duration-300 z-20 group cursor-pointer border-0 outline-none focus:ring-2 focus:ring-white/50"
        aria-label="下一张"
        type="button"
      >
        <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 group-hover:scale-110 transition-transform stroke-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 指示器 - 移动端优化 */}
      <div className="absolute bottom-3 sm:bottom-4 md:bottom-6 left-1/2 transform -translate-x-1/2 flex gap-1 sm:gap-1.5 md:gap-2 z-20">
        {banner.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 !rounded-full transition-all duration-300 cursor-pointer outline-none focus:ring-2 focus:ring-white/50 ${
              currentSlide === index
                ? 'bg-white scale-125'
                : 'bg-white/60 hover:bg-white/80 active:bg-white'
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