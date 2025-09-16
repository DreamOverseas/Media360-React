import { Building2, Mail, Phone, Globe, Hash, MapPin, Tag } from 'lucide-react';
const SellerProfileSection = ({
  sellerProfileLoading,
  sellerProfileError,
  sellerProfile,
}) => {
  if (sellerProfileLoading)
    return <div className='text-gray-500'>加载中...</div>;
  if (sellerProfileError)
    return <div className='text-red-500'>加载失败：{sellerProfileError}</div>;
  if (!sellerProfile) return <div className='text-gray-500'>暂无商家资料</div>;

  // ---- 兼容：后端把 JSON 存成数组的情况 ----
  const normalizeDetails = val => {
    if (!val) return {};
    if (Array.isArray(val)) return val[0] || {};
    return val;
  };

  const normalizeCampaigns = val => {
    if (!val) return [];
    return Array.isArray(val) ? val : [val];
  };

  const details = normalizeDetails(sellerProfile.company_details);
  const campaigns = normalizeCampaigns(sellerProfile.campaign_preferences);
  const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

  // 字段名容错（大小写/不同命名）
  const companyName = details.company_name || details.name || "—";
  const industry = details.industry || "—";
  const address = details.address || "—";
  const contactEmail = details.contact_email || details.email || "—";
  const contactPhone = details.contact_phone || details.phone || "—";
  const abn = details.abn || "—";

  const website = (() => {
    const v = details.website || details.site || "";
    if (!v) return "";
    // 简单补协议，避免无 http 导致无法点击
    if (/^https?:\/\//i.test(v)) return v;
    return `https://${v}`;
  })();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-3 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        
        {/* 页面标题 */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2">商家详情</h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
        </div>

        {/* 商家信息 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Building2 className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
              <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-white">商家信息</h3>
            </div>
          </div>
          
          <div className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              
              {/* 左列 */}
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Building2 className="text-blue-600 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">公司名称</span>
                    <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 break-words">{companyName}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Tag className="text-green-600 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">行业</span>
                    <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">{industry}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-purple-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <MapPin className="text-purple-600 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">地址</span>
                    <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800 break-words">{address}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-red-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Hash className="text-red-600 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">ABN</span>
                    <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">{abn}</span>
                  </div>
                </div>
              </div>

              {/* 右列 */}
              <div className="space-y-4 sm:space-y-5 lg:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-blue-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Mail className="text-blue-600 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">邮箱</span>
                    {contactEmail !== "—" ? (
                      <a
                        href={`mailto:${contactEmail}`}
                        className="text-sm sm:text-base lg:text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 underline decoration-dotted underline-offset-4 break-all block"
                      >
                        {contactEmail}
                      </a>
                    ) : (
                      <span className="text-sm sm:text-base lg:text-lg text-gray-400">—</span>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-green-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Phone className="text-green-600 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">电话</span>
                    <span className="text-sm sm:text-base lg:text-lg font-semibold text-gray-800">{contactPhone}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <div className="bg-indigo-100 p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                    <Globe className="text-indigo-600 w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block text-xs sm:text-sm font-medium text-gray-500 mb-1">网站</span>
                    {website ? (
                      <a
                        href={website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm sm:text-base lg:text-lg font-semibold text-indigo-600 hover:text-indigo-700 transition-colors duration-200 underline decoration-dotted underline-offset-4 break-all block"
                      >
                        {details.website || details.site}
                      </a>
                    ) : (
                      <span className="text-sm sm:text-base lg:text-lg text-gray-400">—</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 活动偏好 */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 px-4 sm:px-6 lg:px-8 py-4 sm:py-5 lg:py-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <Tag className="text-white w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7" />
              <h3 className="text-base sm:text-xl lg:text-2xl font-bold text-white">活动偏好</h3>
            </div>
          </div>

          <div className="p-4">
            {campaigns.length === 0 ? (
              <div className="text-center py-8 sm:py-10 lg:py-12">
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tag className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 text-sm sm:text-base lg:text-lg">暂无活动</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {campaigns.map((c, idx) => {
                  const title = c.title || c.name || "未命名活动";
                  const type = c.type || c.category || "—";
                  const description = c.description || c.desc || "—";
                  const requirement = c.requirement || c.requirements || "—";
                  const validUntil =
                    c.valid_until || c.validUntil || c.expires_at || "—";

                  return (
                    <div
                      key={idx}
                      className="group relative bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-3 sm:p-4 lg:p-6 border-2 border-orange-100 hover:border-orange-200 transition-all duration-300 hover:shadow-lg sm:transform sm:hover:-translate-y-1"
                    >
                      {/* 装饰性元素 */}
                      <div className="absolute top-2 right-2 sm:top-3 sm:right-3 lg:top-4 lg:right-4 w-1 h-1 sm:w-1.5 sm:h-1.5 lg:w-2 lg:h-2 bg-orange-400 rounded-full opacity-60"></div>
                      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 lg:top-6 lg:right-6 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-red-400 rounded-full opacity-40"></div>

                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2 sm:mb-3 lg:mb-4 space-y-1 sm:space-y-0">
                        <h4 className="font-bold text-sm sm:text-base lg:text-xl text-gray-800 group-hover:text-orange-700 transition-colors duration-200 pr-6 sm:pr-0">
                          {title}
                        </h4>
                        <span className="px-2 py-0.5 sm:px-2 sm:py-1 lg:px-3 lg:py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full text-xs sm:text-xs lg:text-sm font-medium shadow-sm self-start">
                          {type}
                        </span>
                      </div>

                      <div className="space-y-2 sm:space-y-2 lg:space-y-3">
                        <div className="bg-white/70 rounded-lg p-2 sm:p-3 border border-orange-100">
                          <span className="text-xs sm:text-sm lg:text-base text-gray-700 leading-relaxed">{description}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">要求</span>
                          <span className="text-xs sm:text-xs lg:text-sm text-gray-600 break-words">{requirement}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-2">
                          <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded w-fit">有效期至</span>
                          <span className="text-xs sm:text-xs lg:text-sm text-gray-600">{validUntil}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <button
        onClick={() => window.location.href = 'mailto:info@do360.com'}
        className="mt-4 rounded flex items-center justify-center gap-2 
                    bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 
                    text-white px-4 py-2 sm:px-5 sm:py-2 
                    rounded-lg font-medium transition-colors duration-200 
                    w-full sm:w-auto max-w-[300px] 
                    text-sm max-[400px]:text-xs"                  
        >
          联系我们
      </button>
      <p>联系我们修改店铺及活动信息到邮箱：info@do360.com</p>
    </div>
  );
};

export default SellerProfileSection;
