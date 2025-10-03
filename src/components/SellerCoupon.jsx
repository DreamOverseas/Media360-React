// import React, { useContext, useEffect, useState } from 'react';
// import axios from 'axios';
// import { RefreshCw, Eye, User, Hash, EyeOff, ChevronDown, ChevronRight } from 'lucide-react';
// import { AuthContext } from "../context/AuthContext";
// import QRCode from "qrcode";
// import QRDisplay from '../utils/QRDisplay';

// // Helper for QR downloading
// async function downloadQR(hash, filename) {
//     const canvas = document.createElement("canvas");
//     await QRCode.toCanvas(canvas, hash, { width: 512, margin: 1 });

//     const link = document.createElement("a");
//     link.download = `${filename}.png`;
//     link.href = canvas.toDataURL("image/png");
//     link.click();
// }

// const SellerCoupon = () => {
//     const { user } = useContext(AuthContext);
//     const [coupons, setCoupons] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//     const [hiddenCoupons, setHiddenCoupons] = useState(new Set());
//     const [showHiddenSection, setShowHiddenSection] = useState(false);

//     // Load Backend Host for API calls
//     const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

//     // Load hidden coupons from localStorage on component mount
//     useEffect(() => {
//         const savedHiddenCoupons = localStorage.getItem(`hiddenCoupons_${user?.documentId}`);
//         if (savedHiddenCoupons) {
//             setHiddenCoupons(new Set(JSON.parse(savedHiddenCoupons)));
//         }
//     }, [user]);

//     // Save hidden coupons to localStorage whenever it changes
//     useEffect(() => {
//         if (user?.documentId) {
//             localStorage.setItem(`hiddenCoupons_${user.documentId}`, JSON.stringify([...hiddenCoupons]));
//         }
//     }, [hiddenCoupons, user]);

//     useEffect(() => {
//         if (user && user.documentId) {
//             fetchUserCoupons();
//         }
//     }, [user]);

//     // Toggle coupon visibility
//     const toggleCouponVisibility = (couponId) => {
//         const newHiddenCoupons = new Set(hiddenCoupons);
//         if (newHiddenCoupons.has(couponId)) {
//             newHiddenCoupons.delete(couponId);
//         } else {
//             newHiddenCoupons.add(couponId);
//         }
//         setHiddenCoupons(newHiddenCoupons);
//     };

//     // Filter coupons into visible and hidden
//     const visibleCoupons = coupons.filter(coupon => !hiddenCoupons.has(coupon.documentId));
//     const hiddenCouponsList = coupons.filter(coupon => hiddenCoupons.has(coupon.documentId));

//     const fetchUserCoupons = async () => {
//         setLoading(true);
//         setError(null);
        
//         try {
//             // First, get the CouponSysAccount related to this user
//             const couponSysAccountResponse = await axios.get(
//                 `${BACKEND_HOST}/api/coupon-sys-accounts?filters[users_permissions_user][documentId][$eq]=${user.documentId}&populate=*`,
//                 {
//                     headers: {
//                         Authorization: `Bearer ${getCookie('token')}`,
//                         "Content-Type": "application/json",
//                     },
//                 }
//             );

//             console.log("CouponSysAccount response:", couponSysAccountResponse.data);

//             if (couponSysAccountResponse.data.data && couponSysAccountResponse.data.data.length > 0) {
//                 const couponSysAccountDocumentId = couponSysAccountResponse.data.data[0].documentId;
                
//                 // Then, get all Coupons assigned from this CouponSysAccount
//                 const couponsResponse = await axios.get(
//                     `${BACKEND_HOST}/api/coupons?filters[AssignedFrom][documentId][$eq]=${couponSysAccountDocumentId}&populate[users_permissions_user][populate][influencer_profile][populate]":"avatar`,
//                     {
//                         headers: {
//                             Authorization: `Bearer ${getCookie('token')}`,
//                             "Content-Type": "application/json",
//                         },
//                     }
//                 );

//                 console.log("Coupons response:", couponsResponse.data);

//                 if (couponsResponse.data.data) {
//                     setCoupons(couponsResponse.data.data);
//                 }
//             } else {
//                 console.log("No CouponSysAccount found for this user");
//                 setCoupons([]);
//             }
//         } catch (error) {
//             console.error("Error fetching coupons:", error.response?.data || error.message);
//             setError("Failed to fetch coupons. Please try again.");
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Helper function to get cookie (mimic the Cookies.get functionality)
//     const getCookie = (name) => {
//         const value = `; ${document.cookie}`;
//         const parts = value.split(`; ${name}=`);
//         if (parts.length === 2) return parts.pop().split(';').shift();
//         return null;
//     };

//     // Render coupon card
//     const renderCouponCard = (coupon, index, isHidden = false) => (
//         <div
//             key={coupon.documentId || index}
//             className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-3 relative ${isHidden ? 'opacity-75' : ''}`}
//         >
//             {/* Hide/Show Toggle Button */}
//             <button
//                 onClick={() => toggleCouponVisibility(coupon.documentId)}
//                 className={`absolute top-2 right-2 p-2 rounded-lg transition-colors duration-200 ${
//                     isHidden 
//                         ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
//                         : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
//                 }`}
//                 title={isHidden ? "Show coupon" : "Hide coupon"}
//             >
//                 {isHidden ? (
//                     <Eye className="w-4 h-4" />
//                 ) : (
//                     <EyeOff className="w-4 h-4" />
//                 )}
//             </button>

//             <div className="grid md:grid-cols-2 gap-6 pr-12">
//                 {/* Left Column */}
//                 <div className="space-y-3">
//                     <div className="flex items-center gap-2 mb-2">
//                         <h3 className="font-semibold text-gray-800 text-xs max-[400px]:text-[10px] sm:text-base">
//                             {coupon.Title}
//                         </h3>
//                     </div>
//                     <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-3">
//                         <QRDisplay hash={coupon.Hash} className="w-20" />
//                         <a
//                             onClick={() => { downloadQR(coupon.Hash, coupon.Title) }}
//                             className="text-dark bg-blue-200/50 rounded-xl p-2 flex items-center gap-1 cursor-pointer"
//                         >
//                             <i className="bi bi-box-arrow-in-down text-2xl me-1"></i>
//                             <p className="mb-0 !no-underline">二维码下载</p>
//                         </a>
//                     </div>
//                 </div>

//                 {/* Right Column - Stats & Influencer */}
//                 <div className="space-y-4">
//                     {/* Scanned Count */}
//                     <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                             <Eye className="w-5 h-5 max-[400px]:w-3 max-[400px]:h-3 text-green-600" />
//                             <span className="font-medium text-gray-700 text-sm max-[400px]:text-xs sm:text-base">
//                                 Scanned
//                             </span>
//                         </div>
//                         <span className="text-xl max-[400px]:text-base sm:text-2xl font-bold text-green-600">
//                             {coupon.Scanned || 0}
//                         </span>
//                     </div>

//                     {/* Influencer */}
//                     <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
//                         <div className="flex items-center gap-3">
//                             <User className="w-5 h-5 max-[400px]:w-3 max-[400px]:h-3 text-purple-600" />
//                             <span className="font-medium text-gray-700 text-sm max-[400px]:text-xs sm:text-base">
//                                 Linked
//                             </span>
//                         </div>
//                         <span className="font-semibold text-purple-600 max-[400px]:text-[0.65rem] sm:text-base">
//                             {coupon.users_permissions_user?.influencer_profile?.personal_details?.name ||
//                                 "No influencer"}
//                         </span>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

//     if (!user) {
//         return (
//             <div className="seller-coupon-container">
//                 <p>Please log in to view your coupons.</p>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <div className="max-w-6xl mx-auto">
//                 {/* Header */}
//                 <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
//                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                         {/* 左侧欢迎信息 */}
//                         <div>
//                             <h2 className="text-1xl max-[400px]:text-xs sm:text-1xl font-bold text-gray-800 mb-1">
//                                 Your Coupons
//                             </h2>
//                             <p className="text-base max-[400px]:text-sm sm:text-lg text-gray-600">
//                                 Welcome back,{" "}
//                                 <span className="font-semibold text-indigo-600">
//                                     {user.username}
//                                 </span>
//                                 !
//                             </p>
//                         </div>
//                         {/* 右侧刷新按钮 */}
//                         <button
//                             onClick={fetchUserCoupons}
//                             disabled={loading}
//                             className="flex items-center justify-center gap-2 
//                                         bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 
//                                         text-white px-4 py-2 sm:px-5 sm:py-2 
//                                         rounded-lg font-medium transition-colors duration-200 
//                                         w-full sm:w-auto max-w-[300px] 
//                                         text-sm max-[400px]:text-xs"                  
//                         >
//                             <RefreshCw
//                                 className={`w-5 h-5 max-[400px]:w-4 max-[400px]:h-4 ${loading ? "animate-spin" : ""}`}
//                             />
//                             {loading ? "Refreshing..." : "Refresh Coupons"}
//                         </button>
//                     </div>
//                 </div>

//                 {/* Loading State */}
//                 {loading && (
//                     <div className="bg-white rounded-xl shadow-lg p-12 text-center">
//                         <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 max-[400px]:w-8 max-[400px]:h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
//                         <p className="text-gray-600 text-base max-[400px]:text-sm sm:text-lg">
//                             Loading coupons...
//                         </p>
//                     </div>
//                 )}

//                 {/* Error State */}
//                 {error && (
//                     <div className="bg-red-50 border border-red-200 rounded-xl mb-8 p-4">
//                         <div className="flex items-center gap-3">
//                             <div className="w-10 h-10 max-[400px]:w-8 max-[400px]:h-8 bg-red-100 rounded-full flex items-center justify-center">
//                                 <span className="text-red-600 font-bold">!</span>
//                             </div>
//                             <div>
//                                 <h3 className="font-semibold text-red-800 text-sm sm:text-base">
//                                     Error
//                                 </h3>
//                                 <p className="text-red-700 text-sm sm:text-base">{error}</p>
//                             </div>
//                         </div>
//                     </div>
//                 )}

//                 {/* Coupons Content */}
//                 {!loading && !error && (
//                     <div className="space-y-6">
//                         {coupons.length > 0 ? (
//                             <>
//                                 {/* Visible Coupons Section */}
//                                 {visibleCoupons.length > 0 && (
//                                     <>
//                                         <div className="bg-white rounded-xl shadow-lg p-6">
//                                             <h2 className="text-xl max-[400px]:text-lg sm:text-2xl font-bold text-gray-800 mb-1">
//                                                 Active Coupons
//                                             </h2>
//                                             <p className="text-gray-600 text-sm max-[400px]:text-xs sm:text-base mb-4">
//                                                 {visibleCoupons.length} {visibleCoupons.length === 1 ? "coupon" : "coupons"} visible
//                                             </p>
//                                         </div>

//                                         <div className="grid gap-4">
//                                             {visibleCoupons.map((coupon, index) => renderCouponCard(coupon, index, false))}
//                                         </div>
//                                     </>
//                                 )}

//                                 {/* Hidden Coupons Section */}
//                                 {hiddenCouponsList.length > 0 && (
//                                     <>
//                                         <div className="bg-white rounded-xl shadow-lg p-6">
//                                             <button
//                                                 onClick={() => setShowHiddenSection(!showHiddenSection)}
//                                                 className="flex items-center gap-2 w-full text-left"
//                                             >
//                                                 {showHiddenSection ? (
//                                                     <ChevronDown className="w-5 h-5 text-gray-500" />
//                                                 ) : (
//                                                     <ChevronRight className="w-5 h-5 text-gray-500" />
//                                                 )}
//                                                 <h2 className="text-xl max-[400px]:text-lg sm:text-2xl font-bold text-gray-800 mb-1">
//                                                     Hidden Coupons
//                                                 </h2>
//                                             </button>
//                                             <p className="text-gray-600 text-sm max-[400px]:text-xs sm:text-base ml-7">
//                                                 {hiddenCouponsList.length} {hiddenCouponsList.length === 1 ? "coupon" : "coupons"} hidden
//                                             </p>
//                                         </div>

//                                         {showHiddenSection && (
//                                             <div className="grid gap-4">
//                                                 {hiddenCouponsList.map((coupon, index) => renderCouponCard(coupon, index, true))}
//                                             </div>
//                                         )}
//                                     </>
//                                 )}

//                                 {/* No visible coupons message */}
//                                 {visibleCoupons.length === 0 && hiddenCouponsList.length > 0 && (
//                                     <div className="bg-white rounded-xl shadow-lg p-12 text-center">
//                                         <div className="w-16 h-16 max-[400px]:w-12 max-[400px]:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                             <EyeOff className="w-8 h-8 max-[400px]:w-6 max-[400px]:h-6 text-gray-400" />
//                                         </div>
//                                         <h3 className="text-lg max-[400px]:text-base sm:text-xl font-semibold text-gray-800 mb-2">
//                                             All Coupons Hidden
//                                         </h3>
//                                         <p className="text-gray-600 text-sm max-[400px]:text-xs sm:text-base">
//                                             All your coupons are currently hidden. Check the hidden section below to manage them.
//                                         </p>
//                                     </div>
//                                 )}
//                             </>
//                         ) : (
//                             <div className="bg-white rounded-xl shadow-lg p-12 text-center">
//                                 <div className="w-16 h-16 max-[400px]:w-12 max-[400px]:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                                     <Hash className="w-8 h-8 max-[400px]:w-6 max-[400px]:h-6 text-gray-400" />
//                                 </div>
//                                 <h3 className="text-lg max-[400px]:text-base sm:text-xl font-semibold text-gray-800 mb-2">
//                                     No Coupons Found
//                                 </h3>
//                                 <p className="text-gray-600 text-sm max-[400px]:text-xs sm:text-base">
//                                     No coupons found for your account. Try refreshing or check back later.
//                                 </p>
//                             </div>
//                         )}
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default SellerCoupon;

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, Eye, User, Hash, EyeOff, ChevronDown, ChevronRight, Search, X } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import QRCode from "qrcode";
import QRDisplay from '../utils/QRDisplay';

const DEBUG = import.meta.env.DEBUG;

// Helper for QR downloading
async function downloadQR(hash, filename) {
    const canvas = document.createElement("canvas");
    await QRCode.toCanvas(canvas, hash, { width: 512, margin: 1 });

    const link = document.createElement("a");
    link.download = `${filename}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
}

const SellerCoupon = () => {
    const { user } = useContext(AuthContext);
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hiddenCoupons, setHiddenCoupons] = useState(new Set());
    const [showHiddenSection, setShowHiddenSection] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    // Load Backend Host for API calls
    const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

    // Load hidden coupons from localStorage on component mount
    useEffect(() => {
        const savedHiddenCoupons = localStorage.getItem(`hiddenCoupons_${user?.documentId}`);
        if (savedHiddenCoupons) {
            setHiddenCoupons(new Set(JSON.parse(savedHiddenCoupons)));
        }
    }, [user]);

    // Save hidden coupons to localStorage whenever it changes
    useEffect(() => {
        if (user?.documentId) {
            localStorage.setItem(`hiddenCoupons_${user.documentId}`, JSON.stringify([...hiddenCoupons]));
        }
    }, [hiddenCoupons, user]);

    useEffect(() => {
        if (user && user.documentId) {
            fetchUserCoupons();
        }
    }, [user]);

    // Toggle coupon visibility
    const toggleCouponVisibility = (couponId) => {
        const newHiddenCoupons = new Set(hiddenCoupons);
        if (newHiddenCoupons.has(couponId)) {
            newHiddenCoupons.delete(couponId);
        } else {
            newHiddenCoupons.add(couponId);
        }
        setHiddenCoupons(newHiddenCoupons);
    };

    // Search filter function
    const filterCoupons = (couponsList) => {
        if (!searchTerm.trim()) {
            return couponsList;
        }

        const searchLower = searchTerm.toLowerCase();
        return couponsList.filter(coupon => {
            const title = coupon.Title?.toLowerCase() || '';
            const influencerName = coupon.users_permissions_user?.influencer_profile?.personal_details?.name?.toLowerCase() || '';
            const userName = coupon.users_permissions_user?.username?.toLowerCase() || '';
            const hash = coupon.Hash?.toLowerCase() || '';
            
            return title.includes(searchLower) || 
                   influencerName.includes(searchLower) || 
                   userName.includes(searchLower) ||
                   hash.includes(searchLower);
        });
    };

    // Apply search filter to visible and hidden coupons
    const filteredVisibleCoupons = filterCoupons(coupons.filter(coupon => !hiddenCoupons.has(coupon.documentId)));
    const filteredHiddenCoupons = filterCoupons(coupons.filter(coupon => hiddenCoupons.has(coupon.documentId)));

    const fetchUserCoupons = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // First, get the CouponSysAccount related to this user
            const couponSysAccountResponse = await axios.get(
                `${BACKEND_HOST}/api/coupon-sys-accounts?filters[users_permissions_user][documentId][$eq]=${user.documentId}&populate=*`,
                {
                    headers: {
                        Authorization: `Bearer ${getCookie('token')}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            if (DEBUG) console.log("CouponSysAccount response:", couponSysAccountResponse.data);

            if (couponSysAccountResponse.data.data && couponSysAccountResponse.data.data.length > 0) {
                const couponSysAccountDocumentId = couponSysAccountResponse.data.data[0].documentId;
                
                // Then, get all Coupons assigned from this CouponSysAccount
                const couponsResponse = await axios.get(
                    `${BACKEND_HOST}/api/coupons?filters[AssignedFrom][documentId][$eq]=${couponSysAccountDocumentId}&populate[users_permissions_user][populate][influencer_profile][populate]":"avatar`,
                    {
                        headers: {
                            Authorization: `Bearer ${getCookie('token')}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (DEBUG) console.log("Coupons response:", couponsResponse.data);

                if (couponsResponse.data.data) {
                    setCoupons(couponsResponse.data.data);
                }
            } else {
                if (DEBUG) console.log("No CouponSysAccount found for this user");
                setCoupons([]);
            }
        } catch (error) {
            console.error("Error fetching coupons:", error.response?.data || error.message);
            setError("Failed to fetch coupons. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    // Helper function to get cookie (mimic the Cookies.get functionality)
    const getCookie = (name) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
        return null;
    };

    // Clear search
    const clearSearch = () => {
        setSearchTerm('');
    };

    // Render coupon card
    const renderCouponCard = (coupon, index, isHidden = false) => (
        <div
            key={coupon.documentId || index}
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-3 relative ${isHidden ? 'opacity-75' : ''}`}
        >
            {/* Hide/Show Toggle Button */}
            <button
                onClick={() => toggleCouponVisibility(coupon.documentId)}
                className={`absolute top-2 right-2 p-2 rounded-lg transition-colors duration-200 ${
                    isHidden 
                        ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-600'
                }`}
                title={isHidden ? "Show coupon" : "Hide coupon"}
            >
                {isHidden ? (
                    <Eye className="w-4 h-4" />
                ) : (
                    <EyeOff className="w-4 h-4" />
                )}
            </button>

            <div className="grid md:grid-cols-2 gap-6 pr-12">
                {/* Left Column */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-800 text-xs max-[400px]:text-[10px] sm:text-base">
                            {coupon.Title}
                        </h3>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-2 flex items-center gap-3">
                        <QRDisplay hash={coupon.Hash} className="w-20" />
                        <a
                            onClick={() => { downloadQR(coupon.Hash, coupon.Title) }}
                            className="text-dark bg-blue-200/50 rounded-xl p-2 flex items-center gap-1 cursor-pointer"
                        >
                            <i className="bi bi-box-arrow-in-down text-2xl me-1"></i>
                            <p className="mb-0 !no-underline">二维码下载</p>
                        </a>
                    </div>
                </div>

                {/* Right Column - Stats & Influencer */}
                <div className="space-y-4">
                    {/* Scanned Count */}
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Eye className="w-5 h-5 max-[400px]:w-3 max-[400px]:h-3 text-green-600" />
                            <span className="font-medium text-gray-700 text-sm max-[400px]:text-xs sm:text-base">
                                Scanned
                            </span>
                        </div>
                        <span className="text-xl max-[400px]:text-base sm:text-2xl font-bold text-green-600">
                            {coupon.Scanned || 0}
                        </span>
                    </div>

                    {/* Influencer */}
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 max-[400px]:w-3 max-[400px]:h-3 text-purple-600" />
                            <span className="font-medium text-gray-700 text-sm max-[400px]:text-xs sm:text-base">
                                Linked
                            </span>
                        </div>
                        <span className="font-semibold text-purple-600 max-[400px]:text-[0.65rem] sm:text-base">
                            {coupon.users_permissions_user?.influencer_profile?.personal_details?.name ||
                                "No influencer"}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );

    if (!user) {
        return (
            <div className="seller-coupon-container">
                <p>Please log in to view your coupons.</p>
            </div>
        );
    }

    const totalVisibleResults = filteredVisibleCoupons.length;
    const totalHiddenResults = filteredHiddenCoupons.length;
    const isSearchActive = searchTerm.trim().length > 0;

    return (
        <div>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        {/* 左侧欢迎信息 */}
                        <div>
                            <h2 className="text-1xl max-[400px]:text-xs sm:text-1xl font-bold text-gray-800 mb-1">
                                Your Coupons
                            </h2>
                            <p className="text-base max-[400px]:text-sm sm:text-lg text-gray-600">
                                Welcome back,{" "}
                                <span className="font-semibold text-indigo-600">
                                    {user.username}
                                </span>
                                !
                            </p>
                        </div>
                        {/* 右侧刷新按钮 */}
                        <button
                            onClick={fetchUserCoupons}
                            disabled={loading}
                            className="flex items-center justify-center gap-2 
                                        bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 
                                        text-white px-4 py-2 sm:px-5 sm:py-2 
                                        rounded-lg font-medium transition-colors duration-200 
                                        w-full sm:w-auto max-w-[300px] 
                                        text-sm max-[400px]:text-xs"                  
                        >
                            <RefreshCw
                                className={`w-5 h-5 max-[400px]:w-4 max-[400px]:h-4 ${loading ? "animate-spin" : ""}`}
                            />
                            {loading ? "Refreshing..." : "Refresh Coupons"}
                        </button>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search by coupon title, influencer name, username, or hash..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg 
                                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 
                                     text-sm max-[400px]:text-xs sm:text-base
                                     transition-colors duration-200"
                        />
                        {searchTerm && (
                            <button
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 
                                         text-gray-400 hover:text-gray-600 transition-colors duration-200"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>
                    
                    {/* Search Results Info */}
                    {isSearchActive && (
                        <div className="mt-4 text-sm text-gray-600">
                            Found {totalVisibleResults + totalHiddenResults} coupon(s) matching "{searchTerm}"
                            {totalVisibleResults > 0 && ` (${totalVisibleResults} visible${totalHiddenResults > 0 ? `, ${totalHiddenResults} hidden` : ''})`}
                        </div>
                    )}
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <div className="animate-spin w-10 h-10 sm:w-12 sm:h-12 max-[400px]:w-8 max-[400px]:h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full mx-auto mb-4"></div>
                        <p className="text-gray-600 text-base max-[400px]:text-sm sm:text-lg">
                            Loading coupons...
                        </p>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-xl mb-8 p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 max-[400px]:w-8 max-[400px]:h-8 bg-red-100 rounded-full flex items-center justify-center">
                                <span className="text-red-600 font-bold">!</span>
                            </div>
                            <div>
                                <h3 className="font-semibold text-red-800 text-sm sm:text-base">
                                    Error
                                </h3>
                                <p className="text-red-700 text-sm sm:text-base">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Coupons Content */}
                {!loading && !error && (
                    <div className="space-y-6">
                        {coupons.length > 0 ? (
                            <>
                                {/* No Search Results */}
                                {isSearchActive && totalVisibleResults === 0 && totalHiddenResults === 0 && (
                                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                        <div className="w-16 h-16 max-[400px]:w-12 max-[400px]:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <Search className="w-8 h-8 max-[400px]:w-6 max-[400px]:h-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg max-[400px]:text-base sm:text-xl font-semibold text-gray-800 mb-2">
                                            No Results Found
                                        </h3>
                                        <p className="text-gray-600 text-sm max-[400px]:text-xs sm:text-base mb-4">
                                            No coupons match your search for "{searchTerm}". Try different keywords.
                                        </p>
                                        <button
                                            onClick={clearSearch}
                                            className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                                        >
                                            Clear search
                                        </button>
                                    </div>
                                )}

                                {/* Visible Coupons Section */}
                                {filteredVisibleCoupons.length > 0 && (
                                    <>
                                        <div className="bg-white rounded-xl shadow-lg p-6">
                                            <h2 className="text-xl max-[400px]:text-lg sm:text-2xl font-bold text-gray-800 mb-1">
                                                {isSearchActive ? "Search Results - Visible" : "Active Coupons"}
                                            </h2>
                                            <p className="text-gray-600 text-sm max-[400px]:text-xs sm:text-base mb-4">
                                                {filteredVisibleCoupons.length} {filteredVisibleCoupons.length === 1 ? "coupon" : "coupons"} 
                                                {isSearchActive ? " found" : " visible"}
                                            </p>
                                        </div>

                                        <div className="grid gap-4">
                                            {filteredVisibleCoupons.map((coupon, index) => renderCouponCard(coupon, index, false))}
                                        </div>
                                    </>
                                )}

                                {/* Hidden Coupons Section - Only show if there are results or if not searching */}
                                {(filteredHiddenCoupons.length > 0 || (!isSearchActive && coupons.filter(coupon => hiddenCoupons.has(coupon.documentId)).length > 0)) && (
                                    <>
                                        <div className="bg-white rounded-xl shadow-lg p-6">
                                            <button
                                                onClick={() => setShowHiddenSection(!showHiddenSection)}
                                                className="flex items-center gap-2 w-full text-left"
                                            >
                                                {showHiddenSection ? (
                                                    <ChevronDown className="w-5 h-5 text-gray-500" />
                                                ) : (
                                                    <ChevronRight className="w-5 h-5 text-gray-500" />
                                                )}
                                                <h2 className="text-xl max-[400px]:text-lg sm:text-2xl font-bold text-gray-800 mb-1">
                                                    {isSearchActive ? "Search Results - Hidden" : "Hidden Coupons"}
                                                </h2>
                                            </button>
                                            <p className="text-gray-600 text-sm max-[400px]:text-xs sm:text-base ml-7">
                                                {isSearchActive ? filteredHiddenCoupons.length : coupons.filter(coupon => hiddenCoupons.has(coupon.documentId)).length} {" "}
                                                {(isSearchActive ? filteredHiddenCoupons.length : coupons.filter(coupon => hiddenCoupons.has(coupon.documentId)).length) === 1 ? "coupon" : "coupons"} 
                                                {isSearchActive ? " found" : " hidden"}
                                            </p>
                                        </div>

                                        {showHiddenSection && (
                                            <div className="grid gap-4">
                                                {(isSearchActive ? filteredHiddenCoupons : coupons.filter(coupon => hiddenCoupons.has(coupon.documentId)))
                                                 .map((coupon, index) => renderCouponCard(coupon, index, true))}
                                            </div>
                                        )}
                                    </>
                                )}

                                {/* No visible coupons message - only when not searching */}
                                {!isSearchActive && filteredVisibleCoupons.length === 0 && coupons.filter(coupon => hiddenCoupons.has(coupon.documentId)).length > 0 && (
                                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                        <div className="w-16 h-16 max-[400px]:w-12 max-[400px]:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <EyeOff className="w-8 h-8 max-[400px]:w-6 max-[400px]:h-6 text-gray-400" />
                                        </div>
                                        <h3 className="text-lg max-[400px]:text-base sm:text-xl font-semibold text-gray-800 mb-2">
                                            All Coupons Hidden
                                        </h3>
                                        <p className="text-gray-600 text-sm max-[400px]:text-xs sm:text-base">
                                            All your coupons are currently hidden. Check the hidden section below to manage them.
                                        </p>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                                <div className="w-16 h-16 max-[400px]:w-12 max-[400px]:h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Hash className="w-8 h-8 max-[400px]:w-6 max-[400px]:h-6 text-gray-400" />
                                </div>
                                <h3 className="text-lg max-[400px]:text-base sm:text-xl font-semibold text-gray-800 mb-2">
                                    No Coupons Found
                                </h3>
                                <p className="text-gray-600 text-sm max-[400px]:text-xs sm:text-base">
                                    No coupons found for your account. Try refreshing or check back later.
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SellerCoupon;