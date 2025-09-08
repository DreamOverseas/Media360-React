
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCw, Eye, User, Hash } from 'lucide-react';
import { AuthContext } from "../context/AuthContext";
import QRCode from "qrcode";
import QRDisplay from '../utils/QRDisplay';

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

    // Load Backend Host for API calls
    const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

    useEffect(() => {
        if (user && user.documentId) {
            fetchUserCoupons();
        }
    }, [user]);

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

            console.log("CouponSysAccount response:", couponSysAccountResponse.data);

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

                console.log("Coupons response:", couponsResponse.data);

                if (couponsResponse.data.data) {
                    setCoupons(couponsResponse.data.data);
                }
            } else {
                console.log("No CouponSysAccount found for this user");
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

    if (!user) {
        return (
            <div className="seller-coupon-container">
                <p>Please log in to view your coupons.</p>
            </div>
        );
    }

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
                <div className="bg-red-50 border border-red-200 rounded-xl mb-8">
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

                {/* Coupons Grid */}
                {!loading && !error && (
                <div className="space-y-6">
                    {coupons.length > 0 ? (
                    <>
                        <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-xs max-[400px]:text-xs sm:text-2xl font-bold text-gray-800 mb-1">
                            Coupon Overview
                        </h2>
                        <p className="text-gray-600 text-sm max-[400px]:text-xs sm:text-base mb-4">
                            {coupons.length} {coupons.length === 1 ? "coupon" : "coupons"} found
                        </p>
                        </div>

                        <div className="grid gap-4">
                        {coupons.map((coupon, index) => (
                            <div
                            key={coupon.documentId || index}
                            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-3"
                            >
                            <div className="grid md:grid-cols-2 gap-6">
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
                                        className="text-dark bg-blue-200/50 rounded-xl p-2 flex items-center gap-1"
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
                        ))}
                        </div>
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