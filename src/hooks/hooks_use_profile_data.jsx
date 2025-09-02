import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState, useCallback } from "react";

export const useInfluencerProfile = (user, BACKEND_HOST) => {
  const [inflLoading, setInflLoading] = useState(false);
  const [inflError, setInflError] = useState("");
  const [influencerProfile, setInfluencerProfile] = useState(null);

  useEffect(() => {
    const fetchInfluencerProfile = async () => {
      if (!user || user?.roletype !== "Influencer") return;

      console.groupCollapsed("%c[InfluencerProfile] fetch start", "color:#0aa");
      const token = Cookies.get("token");

      const setFromRecord = (record, label) => {
        if (!record) {
          setInfluencerProfile(null);
          return false;
        }
        const attrs = record.attributes ?? record;
        const personal_details = attrs?.personal_details ?? null;
        const social_platforms = attrs?.social_platforms ?? null;
        setInfluencerProfile({ personal_details, social_platforms });
        return true;
      };

      try {
        setInflLoading(true);
        setInflError("");

        // A) /users/me + populate
        try {
          const r = await axios.get(`${BACKEND_HOST}/api/users/me`, {
            params: { "populate[influencer_profile][populate]": "*" },
            headers: { Authorization: `Bearer ${token}` },
          });
          let prof = r?.data?.influencer_profile ?? null;
          if (prof?.data) prof = prof.data;
          if (Array.isArray(prof)) prof = prof[0] ?? null;
          if (setFromRecord(prof, "A:/users/me")) {
            console.groupEnd();
            return;
          }
        } catch (eA) {
          // 继续走 B
        }

        // helper: /api/influencer-profiles
        const fetchByFilter = async filterObj => {
          const r = await axios.get(`${BACKEND_HOST}/api/influencer-profiles`, {
            params: {
              ...filterObj,
              "fields[0]": "personal_details",
              "fields[1]": "social_platforms",
            },
            headers: { Authorization: `Bearer ${token}` },
          });
          const list = r?.data?.data ?? [];
          return list[0] ?? null;
        };

        // B1) users_permissions_user.id
        try {
          const p1 = await fetchByFilter({
            "filters[users_permissions_user][id][$eq]": user.id,
          });
          if (setFromRecord(p1, "B1:/influencer-profiles by users_permissions_user.id")) {
            console.groupEnd();
            return;
          }
        } catch {}

        // B2) users_permissions_user.documentId（Strapi v5）
        try {
          const p2 = await fetchByFilter({
            "filters[users_permissions_user][documentId][$eq]": user.documentId,
          });
          if (setFromRecord(p2, "B2:/influencer-profiles by users_permissions_user.documentId")) {
            console.groupEnd();
            return;
          }
        } catch {}

        // B3) 字段若含 user
        try {
          const p3 = await fetchByFilter({ "filters[user][id][$eq]": user.id });
          if (setFromRecord(p3, "B3:/influencer-profiles by user.id")) {
            console.groupEnd();
            return;
          }
        } catch {}

        setInfluencerProfile(null);
      } catch (err) {
        setInflError(
          err?.response?.data?.error?.message ||
            err?.message ||
            "Failed to load influencer profile."
        );
      } finally {
        setInflLoading(false);
        console.groupEnd();
      }
    };

    fetchInfluencerProfile();
  }, [user, BACKEND_HOST]);

  return { inflLoading, inflError, influencerProfile };
};

export const useCoupons = (user, BACKEND_HOST) => {
  const [couponList, setCouponList] = useState([]);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");

  const fetchCouponForUser = useCallback(async () => {
    if (!user?.id || user?.roletype !== "Influencer") return;
    try {
      setCouponLoading(true);
      setCouponError("");
      const token = Cookies.get("token");
      if (!token) { 
        setCouponList([]); 
        setCouponError("未登录或 token 缺失"); 
        setCouponLoading(false); 
        return; 
      }

      const tryFetch = async (filters) => {
        return axios.get(`${BACKEND_HOST}/api/coupons`, {
          params: {
            ...filters,
            populate: "*",
            "pagination[pageSize]": 100,
          },
          headers: { Authorization: `Bearer ${token}` },
        });
      };

      let res;
      // 1) 常见：users_permissions_user.id
      try {
        res = await tryFetch({ "filters[users_permissions_user][id][$eq]": user.id });
      } catch {}
      // 2) 备选：user.id（若你的关系字段名为 user）
      if (!res?.data?.data?.length) {
        try { res = await tryFetch({ "filters[user][id][$eq]": user.id }); } catch {}
      }
      // 3) v5：users_permissions_user.documentId
      if (!res?.data?.data?.length && user.documentId) {
        try { res = await tryFetch({ "filters[users_permissions_user][documentId][$eq]": user.documentId }); } catch {}
      }

      const items = res?.data?.data ?? [];
      setCouponList(items);
    } catch (e) {
      console.error("[Coupon] fetch error:", e?.response || e);
      setCouponError(e?.response?.data?.error?.message || e?.message || "Failed to load coupon.");
      setCouponList([]);
    } finally {
      setCouponLoading(false);
    }
  }, [user, BACKEND_HOST]);

  useEffect(() => {
    fetchCouponForUser();
  }, [fetchCouponForUser]);

  // Return the refresh function along with the state
  return { 
    couponList, 
    couponLoading, 
    couponError, 
    refreshCoupons: fetchCouponForUser 
  };
};

export const useSellerData = (user, BACKEND_HOST) => {
  const [sellerData, setSellerData] = useState([]);
  const [sellerLoading, setSellerLoading] = useState(false);
  const [sellerError, setSellerError] = useState("");

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!user || user?.roletype !== "Influencer") return;

      try {
        setSellerLoading(true);
        setSellerError("");

        const token = Cookies.get("token");

        const r = await axios.get(`${BACKEND_HOST}/api/seller-profiles`, {
          params: { populate: "*" }, // 展开所有关联，包括 media
          headers: { Authorization: `Bearer ${token}` },
        });

        let list = r?.data?.data ?? [];

        list = list.map(a => ({
          company_details: a?.company_details ?? null,
          campaign_preferences: Array.isArray(a?.campaign_preferences)
            ? a.campaign_preferences
            : a?.campaign_preferences
            ? [a.campaign_preferences]
            : [],
          documentId: a?.documentId ?? null,
          // media 处理：null -> 空数组，url 拼接完整地址
          media: Array.isArray(a?.media)
            ? a.media.map(m => ({
                ...m,
                url: m.url.startsWith("http")
                  ? m.url
                  : `${BACKEND_HOST}${m.url}`,
              }))
            : [],
        }));

        setSellerData(list);
      } catch (e) {
        console.error("[SellerCampaigns] fetch error:", e?.response || e);
        setSellerError(
          e?.response?.data?.error?.message ||
            e?.message ||
            "Failed to load seller campaigns."
        );
        setSellerData([]);
      } finally {
        setSellerLoading(false);
      }
    };

    fetchSellerData();
  }, [user, BACKEND_HOST]);

  console.log(sellerData)

  return { sellerData, sellerLoading, sellerError };
};