import { useEffect, useRef, useState } from "react";

const CATEGORY_TITLES = {
  "Strategic Partners": "战略合作伙伴",
  "Chinese Communities": "华人社团",
  "Media Partners": "媒体伙伴",
  "Business Partners": "企业合作伙伴",
  "Other Organizations": "其他组织",
};

const Group = () => {
  const [partnersByCategory, setPartnersByCategory] = useState({});
  const [activePartner, setActivePartner] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const popupRef = useRef();

  // Calculate items per row based on grid configuration
  const getItemsPerRow = () => {
    return 4;
  };

  const itemsPerRow = getItemsPerRow();
  const itemsToShowByDefault = itemsPerRow * 2; // 2 lines

  useEffect(() => {
    fetch("https://api.do360.com/api/wcopartners?populate=*")
      .then(res => res.json())
      .then(json => {
        const categorized = {};

        json.data.forEach(item => {
          if (!item) return;

          const category = item.Category ?? "Other Organizations";
          const logoUrl = item.Logo?.url
            ? `https://api.do360.com${item.Logo.url}`
            : null;

          const members = item.members || [];

          if (!categorized[category]) {
            categorized[category] = [];
          }

          categorized[category].push({
            id: item.id,
            name: item.Name_zh || item.Name_en || "未命名",
            logo: logoUrl,
            members,
            phone: item.Phone,
            website: item.website,
          });
        });

        setPartnersByCategory(categorized);
      })
      .catch(err => {
        console.error("❌ 获取合作伙伴数据出错：", err);
      });
  }, []);

  // 点击空白关闭
  useEffect(() => {
    const handleClickOutside = e => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setActivePartner(null);
      }
    };

    if (activePartner) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [activePartner]);

  // Filter partners based on search term
  const filterPartners = partners => {
    if (!searchTerm.trim()) return partners;

    return partners.filter(partner => {
      const nameMatch = partner.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const membersMatch = partner.members?.some(
        member =>
          member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          member.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const phoneMatch = partner.phone?.includes(searchTerm);
      const websiteMatch = partner.website
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

      return nameMatch || membersMatch || phoneMatch || websiteMatch;
    });
  };

  // Get filtered categories with search results
  const getFilteredCategories = () => {
    if (!searchTerm.trim()) return partnersByCategory;

    const filtered = {};
    Object.entries(partnersByCategory).forEach(([category, partners]) => {
      const filteredPartners = filterPartners(partners);
      if (filteredPartners.length > 0) {
        filtered[category] = filteredPartners;
      }
    });
    return filtered;
  };

  const filteredPartnersByCategory = getFilteredCategories();
  const totalFilteredResults = Object.values(filteredPartnersByCategory).reduce(
    (sum, partners) => sum + partners.length,
    0
  );

  const toggleCategory = categoryKey => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryKey]: !prev[categoryKey],
    }));
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50'>
      <div className='px-6 py-16 max-w-7xl mx-auto relative'>
        {/* Header Section */}
        <div className='text-center mb-20'>
          <div className='inline-block'>
            <h1 className='text-5xl md:text-6xl font-bold bg-gradient-to-r from-gray-800 via-gray-700 to-blue-600 bg-clip-text text-transparent mb-4'>
              合作机构
            </h1>
            <div className='h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto'></div>
          </div>
          <p className='text-gray-600 text-lg mt-6 max-w-2xl mx-auto'>
            携手共进，共创美好未来
          </p>
        </div>

        {/* Search Bar */}
        <div className='max-w-2xl mx-auto mb-16'>
          <div className='relative'>
            <div className='absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none'>
              <svg
                className='h-5 w-5 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
            <input
              type='text'
              placeholder='搜索合作伙伴、成员姓名或联系方式...'
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className='w-full pl-12 pr-12 py-4 text-lg border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm hover:shadow-md transition-all duration-300 bg-white/80 backdrop-blur-sm'
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className='absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-600 transition-colors'
              >
                <svg
                  className='h-5 w-5 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='2'
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Search Results Summary */}
          {searchTerm && (
            <div className='mt-4 text-center'>
              {totalFilteredResults > 0 ? (
                <p className='text-gray-600'>
                  找到{" "}
                  <span className='font-semibold text-blue-600'>
                    {totalFilteredResults}
                  </span>{" "}
                  个相关结果
                </p>
              ) : (
                <p className='text-gray-500'>
                  未找到与 "<span className='font-semibold'>{searchTerm}</span>"
                  相关的结果
                </p>
              )}
            </div>
          )}
        </div>

        {Object.entries(CATEGORY_TITLES).map(([key, label]) => {
          const partners = filteredPartnersByCategory[key];
          if (!partners || partners.length === 0) return null;

          const isExpanded = expandedCategories[key] || searchTerm.trim(); // Auto-expand when searching
          const shouldShowMoreButton =
            !searchTerm && partners.length > itemsToShowByDefault;
          const partnersToShow =
            isExpanded || searchTerm
              ? partners
              : partners.slice(0, itemsToShowByDefault);

          return (
            <div key={key} className='mb-20'>
              {/* Category Header */}
              <div className='flex items-center mb-10'>
                <div className='flex-1'>
                  <h2 className='text-3xl font-bold text-gray-800 mb-2 flex items-center gap-3'>
                    {label}
                    {searchTerm && (
                      <span className='text-sm font-normal text-blue-600 bg-blue-50 px-3 py-1 rounded-full'>
                        {partners.length} 个结果
                      </span>
                    )}
                  </h2>
                  <div className='h-0.5 bg-gradient-to-r from-blue-500 to-transparent w-32'></div>
                </div>
                {!searchTerm && (
                  <div className='text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full'>
                    {partners.length} 个合作伙伴
                  </div>
                )}
              </div>

              {/* Partners Grid */}
              <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-8 mb-8'>
                {partnersToShow.map((partner, index) => {
                  const canShowPopup =
                    (partner.members && partner.members.length > 0) ||
                    partner.phone ||
                    partner.website;

                  return (
                    <div
                      key={partner.id}
                      className={`group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 hover:border-blue-200 ${
                        canShowPopup ? "cursor-pointer" : ""
                      }`}
                      style={{
                        animationDelay: `${index * 50}ms`,
                        animation: "fadeInUp 0.6s ease-out forwards",
                      }}
                      onClick={e => {
                        if (canShowPopup) {
                          e.stopPropagation();
                          setActivePartner(
                            partner.id === activePartner?.id ? null : partner
                          );
                        }
                      }}
                    >
                      <div className='flex flex-col items-center h-full'>
                        {partner.logo ? (
                          <div className='w-full h-20 flex items-center justify-center mb-4 overflow-hidden'>
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className='max-h-full max-w-full object-contain filter group-hover:brightness-110 transition-all duration-300'
                            />
                          </div>
                        ) : (
                          <div className='w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center mb-4'>
                            <svg
                              className='w-8 h-8 text-gray-400'
                              fill='currentColor'
                              viewBox='0 0 20 20'
                            >
                              <path
                                fillRule='evenodd'
                                d='M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z'
                                clipRule='evenodd'
                              />
                            </svg>
                          </div>
                        )}

                        <p className='text-sm font-medium text-gray-800 text-center leading-tight group-hover:text-blue-600 transition-colors duration-300'>
                          {partner.name}
                        </p>

                        {canShowPopup && (
                          <div className='absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
                            <div className='w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center'>
                              <svg
                                className='w-3 h-3 text-white'
                                fill='none'
                                stroke='currentColor'
                                viewBox='0 0 24 24'
                              >
                                <path
                                  strokeLinecap='round'
                                  strokeLinejoin='round'
                                  strokeWidth='2'
                                  d='M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
                                />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Enhanced Popup */}
                      {activePartner?.id === partner.id && (
                        <div
                          ref={popupRef}
                          className='absolute top-full mt-4 w-80 bg-white rounded-2xl shadow-2xl p-6 z-50 border border-gray-100 animate-slideIn'
                          style={{
                            left: "50%",
                            transform: "translateX(-50%)",
                            filter:
                              "drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))",
                          }}
                        >
                          <div className='flex items-start gap-4 mb-4'>
                            {partner.logo && (
                              <img
                                src={partner.logo}
                                alt={partner.name}
                                className='w-12 h-12 object-contain flex-shrink-0'
                              />
                            )}
                            <h3 className='font-bold text-lg text-gray-800 leading-tight'>
                              {partner.name}
                            </h3>
                          </div>

                          {partner.members?.length > 0 && (
                            <div className='mb-4'>
                              <h4 className='text-sm font-semibold text-gray-600 mb-2 flex items-center'>
                                <svg
                                  className='w-4 h-4 mr-1'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z'
                                  />
                                </svg>
                                成员信息
                              </h4>
                              <div className='space-y-1'>
                                {partner.members.map((m, idx) => (
                                  <div
                                    key={idx}
                                    className='text-sm text-gray-700 bg-gray-50 px-3 py-2 rounded-lg'
                                  >
                                    <span className='font-medium'>
                                      {m.title}
                                    </span>
                                    ：{m.name}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className='space-y-3'>
                            {partner.phone && (
                              <div className='flex items-center text-sm text-gray-700'>
                                <svg
                                  className='w-4 h-4 mr-2 text-green-500'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                                  />
                                </svg>
                                <span className='font-medium'>电话：</span>
                                <a
                                  href={`tel:${partner.phone}`}
                                  className='text-blue-600 hover:underline ml-1'
                                >
                                  {partner.phone}
                                </a>
                              </div>
                            )}

                            {partner.website && (
                              <div className='flex items-center text-sm'>
                                <svg
                                  className='w-4 h-4 mr-2 text-blue-500'
                                  fill='none'
                                  stroke='currentColor'
                                  viewBox='0 0 24 24'
                                >
                                  <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='2'
                                    d='M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9c-5 0-9-4-9-9s4-9 9-9'
                                  />
                                </svg>
                                <span className='font-medium text-gray-700'>
                                  网址：
                                </span>
                                <a
                                  href={partner.website}
                                  target='_blank'
                                  rel='noopener noreferrer'
                                  className='text-blue-600 hover:underline ml-1 truncate'
                                >
                                  {partner.website.replace(/^https?:\/\//, "")}
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Enhanced Expand Button - Hidden when searching */}
              {shouldShowMoreButton && (
                <div className='text-center mt-8'>
                  <button
                    onClick={() => toggleCategory(key)}
                    className='group relative px-8 py-3 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-700 rounded-full hover:bg-white hover:shadow-lg hover:border-gray-300 transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-3 mx-auto'
                  >
                    <span className='font-medium'>
                      {isExpanded
                        ? "收起"
                        : `查看更多 (${
                            partners.length - itemsToShowByDefault
                          })`}
                    </span>
                    <div
                      className={`transform transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : "rotate-0"
                      }`}
                    >
                      <svg
                        width='16'
                        height='16'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        className='text-gray-500 group-hover:text-gray-700'
                      >
                        <polyline points='6,9 12,15 18,9'></polyline>
                      </svg>
                    </div>
                  </button>
                </div>
              )}
            </div>
          );
        })}

        {/* No Results Message */}
        {searchTerm && totalFilteredResults === 0 && (
          <div className='text-center py-20'>
            <div className='w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center'>
              <svg
                className='w-10 h-10 text-gray-400'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                />
              </svg>
            </div>
            <h3 className='text-xl font-semibold text-gray-700 mb-2'>
              未找到相关结果
            </h3>
            <p className='text-gray-500 mb-6'>
              尝试使用不同的关键词或
              <button
                onClick={clearSearch}
                className='text-blue-600 hover:underline ml-1'
              >
                清除搜索条件
              </button>
            </p>
          </div>
        )}
      </div>

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-50%) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
          }
        }

        .animate-slideIn {
          animation: slideIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Group;
