const RelatedInfluencerSection = ({
    relatedProfileLoading,
    relatedProfileError,
    relatedInfluencerList
}) => {
    if (!relatedProfileLoading)
        return <div className='text-gray-500'>加载中...</div>;
    if (relatedProfileError)
        return <div className='text-red-500'>加载失败：{relatedProfileError}</div>;
    if (!relatedInfluencerList) 
        return <div className='text-gray-500'>暂无代言网红</div>;

  const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

  // 字段名容错（大小写/不同命名）
  const influencerList = relatedInfluencerList;
  // console.log("22222",influencerList)

  return (
    <div className='space-y-4 sm:space-y-6'>
        {influencerList.length === 0 ? (
            <div className='text-gray-500 text-center py-8 text-sm sm:text-base'>
            暂无代言网红
            </div>
        ) : (
            <div className="bg-blue-50 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-blue-100">
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {influencerList.map((inf) => (
                <div
                    key={inf.id}
                    className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 p-4 sm:p-5 flex flex-col items-center text-center"
                >
                    {/* 头像 */}
                    <div className="relative mb-3 sm:mb-4">
                    <img
                        src={`${BACKEND_HOST}${inf.avatar.url}`}
                        alt={inf.personal_details.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-100"
                    />
                    </div>

                    {/* 姓名 */}
                    <h4 className="text-sm sm:text-md font-semibold text-gray-800 mb-3 sm:mb-4 line-clamp-2">
                    {inf.personal_details.name}
                    </h4>

                    {/* 平台列表 */}
                    <div className="w-full">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                        {Object.entries(inf.social_platforms).map(([name, entry], i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200 px-2 sm:px-3 py-2 sm:py-2.5 rounded-md"
                        >
                            <div className="flex justify-center items-center mb-1">
                                <img
                                    src={entry.icon}
                                    alt={inf.personal_details.name}
                                    className="w-6 h-6 sm:w-10 sm:h-10 rounded-full object-cover border-1 border-gray-100"

                                />
                            </div>
                            <span className="font-medium capitalize text-gray-700 mb-1 text-xs sm:text-sm">
                            {name}
                            </span>
                            <span className="text-gray-800 font-semibold text-xs sm:text-sm truncate w-full text-center" title={entry.account_name}>
                            {entry.account_name}
                            </span>
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
                ))}
            </div>
            </div>
        )}
    </div>
  );
};

export default RelatedInfluencerSection;
