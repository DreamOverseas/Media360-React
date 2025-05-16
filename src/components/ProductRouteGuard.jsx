import React, { useEffect, useState } from "react";
import { Outlet, useNavigate} from "react-router-dom";
import axios from "axios";

const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;

const setWithExpiry = (key, value, ttl) => {
  const item = { value, expiry: Date.now() + ttl };
  localStorage.setItem(key, JSON.stringify(item));
};
const getWithExpiry = (key) => {
  const itemStr = localStorage.getItem(key);
  if (!itemStr) return null;
  const item = JSON.parse(itemStr);
  if (Date.now() > item.expiry) {
    localStorage.removeItem(key);
    return null;
  }
  return item.value;
};

export default function ProductRouteGuard() {
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false);
  

  useEffect(() => {
    (async () => {
      let countryCode = getWithExpiry("user_country_code");
      if (!countryCode) {
        const ipRes = await axios.get("https://ipapi.co/json/");
        countryCode = ipRes.data.country_code;
        setWithExpiry("user_country_code", countryCode, 24 * 60 * 60 * 1000);
      }

      const path = location.pathname.replace("/products/", "");
      const segments = path.split('/').filter(seg => seg);
      const slug =segments[0];
      try {
        const res = await axios.get(`${BACKEND_HOST}/api/products`, {
          params: {
            "filters[url][$eq]": slug,
            populate: "*",
          },
        });
        const mainProduct = res.data.data[0];

        if ((countryCode === "AU" && mainProduct?.BlockInChina && mainProduct?.MainCollectionProduct) || (countryCode === "AU" && mainProduct?.BlockInChina && mainProduct?.SingleProduct)) {
          return navigate("/", { replace: true });
        }
      } catch (err) {
        console.error("Guard: fetch mainProduct failed", err);
        return navigate("/", { replace: true });
      }
      setChecked(true);
    })();
  }, [location.pathname]);

  if (!checked) return null;

  return <Outlet />;
}