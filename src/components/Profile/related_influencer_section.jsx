
import { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';

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
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelectedInfluencer] = useState(null);

  const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
const DEBUG = import.meta.env.DEBUG;

  // 字段名容错（大小写/不同命名）
  const influencerList = relatedInfluencerList;

  if (DEBUG) console.log("22222",influencerList)

  // 打开 Modal
    const handleShowModal = async (influencer) => {
        setSelectedInfluencer(influencer);
        setShowModal(true);
    };

    // 关闭 Modal
    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedInfluencer(null);
    };
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
                    onClick={() => handleShowModal(inf)}
                >
                    {/* 头像 */}
                    <div className="relative mb-3 sm:mb-4">
                    <img
                        src={`${BACKEND_HOST}${inf?.avatar?.url}`}
                        alt={inf?.personal_details?.name}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-100"
                    />
                    </div>

                    {/* 姓名 */}
                    <h4 className="text-sm sm:text-md font-semibold text-gray-800 mb-3 sm:mb-4 line-clamp-2">
                    {inf?.personal_details?.name}
                    </h4>

                    {/* 平台列表 */}
                    <div className="w-full">
                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3 text-xs sm:text-sm">
                        {Object.entries(inf?.social_platforms).map(([name, entry], i) => (
                        <div
                            key={i}
                            className="flex flex-col items-center bg-gray-50 transition-colors duration-200 px-2 sm:px-3 py-2 sm:py-2.5 rounded-md"

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

        <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className='!border-b-0 !pb-0' style={{ border: "none" }}>
          <Modal.Title>
            <span className='text-xl font-bold text-gray-800'>
              {selected?.personal_details.name || "人物信息"}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <div className='flex flex-col items-center gap-2'>
              <img
                src={`${BACKEND_HOST}${selected.avatar.url}`}
                alt={selected.personal_details.name}
                className='w-24 h-24 rounded-full shadow-lg border-4 border-blue-200 mb-2'
              />
              <div className='grid grid-cols-2 gap-x-4 gap-y-2 w-full max-w-xs text-sm'>
                <span className='font-semibold text-gray-600'>姓名：</span>
                <span className='text-gray-800'>{selected.personal_details.name}</span>
                <span className='font-semibold text-gray-600'>性别：</span>
                <span className='text-gray-800'>{selected.personal_details.gender}</span>
                <span className='font-semibold text-gray-600'>年龄：</span>
                <span className='text-gray-800'>{selected.personal_details.age}</span>
                <span className='font-semibold text-gray-600'>所在地：</span>
                <span className='text-gray-800'>{selected.personal_details.location}</span>
                <span className='font-semibold text-gray-600'>类别：</span>
                <span>{selected.personal_details.categories.join(' / ')}</span>
                <span className='font-semibold text-gray-600'>语言：</span>
                <span className="text-gray-800">
                    {selected.personal_details.languages.join(', ')}
                </span>

                <span className='font-semibold text-gray-600'>粉丝：</span>
                <span className="text-gray-800">
                {Object.entries(selected.personal_details.followers)
                    .map(([platform, count]) => `${platform}: ${count}`)
                    .join(', ')}
                </span>
                <span className='font-semibold text-gray-600'>邮箱：</span>
                <span className='text-gray-800'>{selected.personal_details.contact_email}</span>
                {/* <span className='font-semibold text-gray-600'>总分：</span>
                <span className='text-blue-600 font-bold'>{selected.score + selected.admin_score}</span>
                <span className='font-semibold text-gray-600'>商家扫码分：</span>
                <span className='text-blue-600 font-bold'>{selected.score}</span>
                <span className='font-semibold text-gray-600'>组委会加分：</span>
                <span className='text-blue-600 font-bold'>{selected.admin_score}</span> */}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className='!border-t-0 !pt-0 flex justify-center'>
          <Button
            variant='secondary'
            onClick={handleCloseModal}
            className='bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded shadow'
          >
            关闭
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default RelatedInfluencerSection;
