
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { AuthContext } from "../context/AuthContext";

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
                    `${BACKEND_HOST}/api/coupons?filters[AssignedFrom][documentId][$eq]=${couponSysAccountDocumentId}&populate=*`,
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
        <div className="seller-coupon-container">
            <h2>Your Coupons</h2>
            <p>Welcome, {user.username}!</p>
            
            {loading && <p>Loading coupons...</p>}
            
            {error && (
                <div className="error-message" style={{ color: 'red', padding: '10px', marginBottom: '10px' }}>
                    {error}
                </div>
            )}
            
            {!loading && !error && (
                <div className="coupons-list">
                    {coupons.length > 0 ? (
                        <>
                            <h3>Coupon Hashes ({coupons.length} found):</h3>
                            <ul>
                                {coupons.map((coupon, index) => (
                                    <li key={coupon.documentId || index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px' }}>
                                        <strong>Hash:</strong> {coupon.Hash || 'No hash available'}
                                        {coupon.documentId && <span style={{ marginLeft: '10px', color: '#666' }}>Document ID: {coupon.documentId}</span>}
                                    </li>
                                ))}
                            </ul>
                        </>
                    ) : (
                        <p>No coupons found for your account.</p>
                    )}
                </div>
            )}
            
            <button onClick={fetchUserCoupons} disabled={loading} style={{ marginTop: '20px', padding: '10px 20px' }}>
                {loading ? 'Refreshing...' : 'Refresh Coupons'}
            </button>
        </div>
    );
};

export default SellerCoupon;