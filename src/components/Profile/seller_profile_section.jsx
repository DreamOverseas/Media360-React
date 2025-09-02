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
    <div className='space-y-6'>
      {/* 公司信息 */}
      <div className='bg-yellow-50 rounded-xl p-6 border border-yellow-100'>
        <h3 className='text-lg font-semibold text-yellow-700 mb-4'>公司信息</h3>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 text-sm'>
          <div>
            <span className='font-semibold text-gray-600'>公司名称：</span>
            {companyName}
          </div>
          <div>
            <span className='font-semibold text-gray-600'>行业：</span>
            {industry}
          </div>
          <div className='md:col-span-2'>
            <span className='font-semibold text-gray-600'>地址：</span>
            {address}
          </div>
          <div>
            <span className='font-semibold text-gray-600'>邮箱：</span>
            {contactEmail !== "—" ? (
              <a
                href={`mailto:${contactEmail}`}
                className='text-blue-600 underline'
              >
                {contactEmail}
              </a>
            ) : (
              "—"
            )}
          </div>
          <div>
            <span className='font-semibold text-gray-600'>电话：</span>
            {contactPhone}
          </div>
          <div className='md:col-span-2'>
            <span className='font-semibold text-gray-600'>网站：</span>
            {website ? (
              <a
                href={website}
                target='_blank'
                rel='noopener noreferrer'
                className='text-blue-600 underline'
              >
                {details.website || details.site}
              </a>
            ) : (
              "—"
            )}
          </div>
          <div>
            <span className='font-semibold text-gray-600'>ABN：</span>
            {abn}
          </div>
        </div>
      </div>

      {/* 活动偏好 */}
      <div className='bg-orange-50 rounded-xl p-6 border border-orange-100'>
        <h3 className='text-lg font-semibold text-orange-700 mb-4'>活动偏好</h3>
        {campaigns.length === 0 ? (
          <div className='text-gray-500'>暂无活动</div>
        ) : (
          <div className='space-y-4'>
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
                  className='bg-white rounded-lg shadow p-4 border border-orange-200'
                >
                  <div className='flex items-center justify-between mb-2'>
                    <span className='font-bold text-orange-600'>{title}</span>
                    <span className='px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs'>
                      {type}
                    </span>
                  </div>
                  <div className='text-gray-700 mb-1'>{description}</div>
                  <div className='text-gray-500 text-xs mb-1'>
                    要求：{requirement}
                  </div>
                  <div className='text-gray-400 text-xs'>
                    有效期至：{validUntil}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerProfileSection;
