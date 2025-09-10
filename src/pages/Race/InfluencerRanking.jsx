import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "./InfluencerRanking.css";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

// Coupon fetching helper
const COUPON_PAGE_SIZE = 1000;

const getCouponsForUser = async (userDocumentId) => {
  try {
    // Fetch coupons using documentId for user relation
    const url = `${BACKEND_HOST}/api/coupons?filters[users_permissions_user][documentId][$eq]=${userDocumentId}&populate=*&pagination[pageSize]=${COUPON_PAGE_SIZE}`;
    const res = await axios.get(url);
    const coupons = res.data?.data || [];
    
    if (coupons.length) return coupons;

    // Fallback: fetch all and filter client-side
    const resAll = await axios.get(`${BACKEND_HOST}/api/coupons?populate=*&pagination[pageSize]=${COUPON_PAGE_SIZE}`);
    const allCoupons = resAll.data?.data || [];
    
    return allCoupons.filter(coupon => 
      coupon.users_permissions_user?.documentId === userDocumentId
    );
  } catch (e) {
    console.error("Failed to fetch coupons for user", userDocumentId, e);
    return [];
  }
};

// Calculate score from Scanned field
const calcScoreFromCoupons = (coupons) => {
  if (!Array.isArray(coupons)) return 0;
  
  return coupons.reduce((total, coupon) => {
    const scanned = coupon.Scanned || 0;
    return total + (Number.isFinite(scanned) ? scanned : 0);
  }, 0);
};

// Extract shop name from coupon
const getShopNameFromCoupon = (coupon) => {
  // From AssignedFrom relation
  const assignedFromName = coupon.AssignedFrom?.Name;
  if (assignedFromName) return assignedFromName;
  
  // From coupon title as fallback
  const title = coupon.Title || "";
  if (title) return title;
  
  return "未知商家";
};

const dedupe = (arr) => Array.from(new Set(arr.filter(Boolean)));

// Fetch all influencers
const fetchAllInfluencers = async () => {
  try {
    const res = await axios.get(
      `${BACKEND_HOST}/api/users?filters[roletype][$eq]=Influencer&populate[influencer_profile][populate]=*&pagination[pageSize]=100`
    );
    const users = res.data || [];

    const enriched = await Promise.all(
      users.map(async (user) => {
        const profile = user.influencer_profile;
        const details = profile?.personal_details;
        
        let avatar = profile?.avatar?.url;
        if (avatar && !avatar.startsWith("http")) {
          avatar = BACKEND_HOST + avatar;
        }
        if (!avatar) {
          avatar = details?.avatar || "https://placehold.co/100x100";
        }

        const coupons = await getCouponsForUser(user.documentId);
        const score = calcScoreFromCoupons(coupons);

        return {
          documentId: user.documentId,
          name: details?.name || user.username || "未知",
          avatar,
          score,
          category: Array.isArray(details?.categories)
            ? details.categories.join(", ")
            : "未知",
          followers: typeof details?.followers === "object"
            ? Object.entries(details.followers)
                .map(([platform, count]) => `${platform}: ${count}`)
                .join(" / ")
            : "0",
          location: details?.location || "",
          contact_email: details?.contact_email || "",
          gender: details?.gender || "",
          age: details?.age || "",
          languages: Array.isArray(details?.languages)
            ? details.languages.join(", ")
            : "",
        };
      })
    );

    return enriched;
  } catch (e) {
    console.error("Failed to fetch influencers from API", e);
    return [];
  }
};

const InfluencerRanking = () => {
  const [influencers, setInfluencers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [selectedShops, setSelectedShops] = useState([]);
  const [selectedCouponsLoading, setSelectedCouponsLoading] = useState(false);

  const handleShowModal = async (influencer) => {
    setSelected(influencer);
    setShowModal(true);
    setSelectedCouponsLoading(true);
    
    try {
      const coupons = await getCouponsForUser(influencer.documentId);
      const shops = dedupe(coupons.map(getShopNameFromCoupon));
      setSelectedShops(shops);
    } catch (e) {
      console.error("Failed to fetch coupons for selected influencer", e);
      setSelectedShops([]);
    } finally {
      setSelectedCouponsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelected(null);
    setSelectedShops([]);
  };

  useEffect(() => {
    let isMounted = true;

    const loadInfluencers = async () => {
      const data = await fetchAllInfluencers();
      data.sort((a, b) => b.score - a.score);
      
      if (isMounted) {
        setInfluencers(data);
        setIsLoading(false);
      }
    };

    // Initial load
    loadInfluencers();

    // Periodic refresh every 10 seconds
    const timer = setInterval(loadInfluencers, 10000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const top3 = influencers.slice(0, 3);
  const others = influencers.slice(3);

  if (isLoading) {
    return (
      <div className='loading-container'>
        <div className='loading-spinner'></div>
      </div>
    );
  }

  return (
    <div className='influencer-ranking-container'>
      {/* Hero Section */}
      <div className='hero-section'>
        <div className='hero-content'>
          <div className='hero-icon'>
            <svg viewBox='0 0 24 24' fill='currentColor'>
              <path d='M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z' />
            </svg>
          </div>
          <h1 className='hero-title'>Influencer Competition</h1>
          <p className='hero-description'>
            Real-time dynamic ranking of top influencers. Watch the scores
            change live and see who's leading the competition!
          </p>
          <div className='live-indicator'>
            <div className='live-dot'></div>
            <span>Live Updates</span>
          </div>
        </div>
      </div>

      {/* Podium Section */}
      <div className='podium-section'>
        <div className='section-header'>
          <h2>Top Performers</h2>
          <div className='section-divider'></div>
        </div>
        <div className='podium-container'>
          {top3.map((influencer, idx) => (
            <div
              key={influencer.documentId}
              className={`podium-item podium-${
                ["first", "second", "third"][idx]
              }`}
              onClick={() => handleShowModal(influencer)}
              style={{ cursor: "pointer" }}
            >
              <div className='podium-rank'>{idx + 1}</div>
              <div className='podium-avatar-container'>
                <img
                  src={influencer.avatar}
                  alt={influencer.name}
                  className='podium-avatar'
                />
                <div className='podium-glow'></div>
              </div>
              <div className='podium-info'>
                <h3 className='podium-name'>{influencer.name}</h3>
                <p className='podium-category'>{influencer.category}</p>
                <p className='podium-followers'>{influencer.followers}</p>
                <p className='podium-location'>{influencer.location}</p>
                <div className='podium-score'>{influencer.score}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard Section */}
      {others.length > 0 && (
        <div className='leaderboard-section'>
          <div className='section-header'>
            <h2>Leaderboard</h2>
            <div className='section-divider'></div>
          </div>
          <div className='leaderboard-container'>
            {others.map((influencer, idx) => (
              <div
                key={influencer.documentId}
                className='leaderboard-item'
                onClick={() => handleShowModal(influencer)}
                style={{ cursor: "pointer" }}
              >
                <div className='leaderboard-rank'>{idx + 4}</div>
                <div className='leaderboard-avatar-container'>
                  <img
                    src={influencer.avatar}
                    alt={influencer.name}
                    className='leaderboard-avatar'
                  />
                </div>
                <div className='leaderboard-info'>
                  <h4 className='leaderboard-name'>{influencer.name}</h4>
                  <p className='leaderboard-category'>{influencer.category}</p>
                  <p className='leaderboard-followers'>{influencer.followers}</p>
                  <p className='leaderboard-location'>{influencer.location}</p>
                </div>
                <div className='leaderboard-score'>{influencer.score}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Section */}
      <div className='stats-section'>
        <div className='stats-container'>
          <div className='stat-item'>
            <div className='stat-number'>{influencers.length}</div>
            <div className='stat-label'>Total Participants</div>
          </div>
          <div className='stat-item'>
            <div className='stat-number'>{influencers[0]?.score || 0}</div>
            <div className='stat-label'>Highest Score</div>
          </div>
          <div className='stat-item'>
            <div className='stat-number'>Live</div>
            <div className='stat-label'>Real-time Updates</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className='footer'>
        <p>Rankings update every 10 seconds • Live Competition</p>
      </div>

      {/* Influencer Details Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton className='!border-b-0 !pb-0' style={{ border: "none" }}>
          <Modal.Title>
            <span className='text-xl font-bold text-gray-800'>
              {selected?.name || "人物信息"}
            </span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selected && (
            <div className='flex flex-col items-center gap-2'>
              <img
                src={selected.avatar}
                alt={selected.name}
                className='w-24 h-24 rounded-full shadow-lg border-4 border-blue-200 mb-2'
              />
              <div className='grid grid-cols-2 gap-x-4 gap-y-2 w-full max-w-xs text-sm'>
                <span className='font-semibold text-gray-600'>姓名：</span>
                <span className='text-gray-800'>{selected.name}</span>
                <span className='font-semibold text-gray-600'>性别：</span>
                <span className='text-gray-800'>{selected.gender}</span>
                <span className='font-semibold text-gray-600'>年龄：</span>
                <span className='text-gray-800'>{selected.age}</span>
                <span className='font-semibold text-gray-600'>所在地：</span>
                <span className='text-gray-800'>{selected.location}</span>
                <span className='font-semibold text-gray-600'>类别：</span>
                <span className='text-gray-800'>{selected.category}</span>
                <span className='font-semibold text-gray-600'>语言：</span>
                <span className='text-gray-800'>{selected.languages}</span>
                <span className='font-semibold text-gray-600'>粉丝：</span>
                <span className='text-gray-800'>{selected.followers}</span>
                <span className='font-semibold text-gray-600'>邮箱：</span>
                <span className='text-gray-800'>{selected.contact_email}</span>
                <span className='font-semibold text-gray-600'>分数：</span>
                <span className='text-blue-600 font-bold'>{selected.score}</span>
              </div>
              <div className='w-full mt-4'>
                <div className='flex items-center justify-between mb-2'>
                  <span className='font-semibold text-gray-700'>关联商家</span>
                  {selectedCouponsLoading && (
                    <span className='text-xs text-gray-400'>加载中…</span>
                  )}
                </div>
                {selectedShops.length === 0 && !selectedCouponsLoading ? (
                  <div className='text-sm text-gray-500'>暂无关联商家</div>
                ) : (
                  <div className='flex flex-wrap gap-2'>
                    {selectedShops.map((shop, i) => (
                      <span
                        key={`${shop}-${i}`}
                        className='px-2 py-1 bg-blue-50 text-blue-700 border border-blue-200 rounded text-xs'
                      >
                        {shop}
                      </span>
                    ))}
                  </div>
                )}
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

export default InfluencerRanking;