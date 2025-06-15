import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../../css/PartnerApplicationForm.css";

// 获取 query 参数工具
function getQueryParams(search) {
  return Object.fromEntries(new URLSearchParams(search));
}

const PartnerApplicationForm = () => {
  // 从 path 获取 productName
  const { productName } = useParams();
  // 从 query 获取 partnerID
  const { partnerID } = getQueryParams(useLocation().search);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    isInAustralia: "yes",
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!productName || !partnerID) {
      alert("非法访问：缺少 productName 或 Partner ID。");
      navigate("/");
    }
  }, [productName, partnerID, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    setLoading(true);

    try {
      // 查找对应 productName 的 entry，并带出 Partner/Customer
      const fetchURL = `${import.meta.env.VITE_STRAPI_HOST}/api/partner-application-submission1s?filters[productName][$eq]=${encodeURIComponent(
        productName
      )}&populate[Partner][populate]=Customer`;

      const res = await fetch(fetchURL, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD}`,
        },
      });
      const data = await res.json();

      const matchedEntry = data?.data?.[0];
      if (!matchedEntry) throw new Error("未找到匹配的产品记录");

      const entryId = matchedEntry.id;
      const partners =
        matchedEntry.attributes?.Partner || matchedEntry.Partner || [];
      const partnerIndex = partners.findIndex(
        (p) =>
          (p.partnerID || p.attributes?.partnerID) === partnerID
      );
      if (partnerIndex === -1) throw new Error("未找到对应 Partner");

      const partner = partners[partnerIndex];
      const customers =
        partner.Customer ||
        partner.attributes?.Customer ||
        [];
      const newCustomer = {
        customerID: uuidv4(),
        Name: formData.Name,
        Email: formData.Email,
        isInAustralia: formData.isInAustralia === "yes",
      };
      const updatedCustomers = [
        ...customers.map((c) =>
          c.id ? { ...c } : { ...c }
        ),
        newCustomer,
      ];

      const updatedPartner = {
        ...(partner.id ? { id: partner.id } : {}),
        ...(partner.attributes || partner),
        Customer: updatedCustomers,
      };

      const updatedPartners = [...partners];
      updatedPartners[partnerIndex] = updatedPartner;

      const putPayload = {
        data: {
          Partner: updatedPartners,
        },
      };

      const putRes = await fetch(
        `${import.meta.env.VITE_STRAPI_HOST}/api/partner-application-submission1s/${entryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD}`,
          },
          body: JSON.stringify(putPayload),
        }
      );

      if (!putRes.ok) {
        throw new Error("PUT 请求失败：" + (await putRes.text()));
      }

      setSuccess(true);
      setFormData({ Name: "", Email: "", isInAustralia: "yes" });
    } catch (err) {
      console.error("❌ 提交失败", err);
      setError("提交失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partner-application-form">
      <h2>补充申请信息</h2>

      {success && <p className="success-message">✅ 提交成功！</p>}
      {error && <p className="error-message">❌ {error}</p>}

      <form onSubmit={handleSubmit}>
        <label>姓名：</label>
        <input
          type="text"
          name="Name"
          value={formData.Name}
          onChange={handleChange}
          required
        />

        <label>邮箱：</label>
        <input
          type="email"
          name="Email"
          value={formData.Email}
          onChange={handleChange}
          required
        />

        <label>是否在澳洲：</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="isInAustralia"
              value="yes"
              checked={formData.isInAustralia === "yes"}
              onChange={handleChange}
            />
            是
          </label>
          <label>
            <input
              type="radio"
              name="isInAustralia"
              value="no"
              checked={formData.isInAustralia === "no"}
              onChange={handleChange}
            />
            否
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "提交中..." : "提交补充信息"}
        </button>
      </form>
    </div>
  );
};

export default PartnerApplicationForm;
