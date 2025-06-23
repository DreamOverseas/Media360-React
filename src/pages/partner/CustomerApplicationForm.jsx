import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "../../css/CustomerApplicationForm.css";

const STRAPI_HOST = import.meta.env.VITE_STRAPI_HOST;
const CUSTOMER_URL = `${STRAPI_HOST}/api/customer-application-submissions`;
const PARTNER_URL = `${STRAPI_HOST}/api/partner-application-submissions`;
const API_TOKEN = import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD;
const MAIL_NOTIFY_API = import.meta.env.VITE_360_MEDIA_CUSTOMER_APPLICATION_NOTIFICATION;

const CustomerApplicationForm = () => {
  const { productName } = useParams();
  const { partnerID, documentId } = Object.fromEntries(new URLSearchParams(useLocation().search));
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
    if (!productName || !partnerID || !documentId) {
      alert("缺少必要参数，非法访问！");
      navigate("/");
    }
  }, [productName, partnerID, documentId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    setLoading(true);

    try {
      // 1. 创建 Customer 数据
      const customerRes = await axios.post(CUSTOMER_URL, {
        data: {
          customerID: uuidv4(),
          Name: formData.Name,
          Email: formData.Email,
          isInAustralia: formData.isInAustralia === "yes"
        }
      }, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });

      const customerDocumentId = customerRes.data?.data?.documentId;
      if (!customerDocumentId) throw new Error("创建用户失败");

      // 2. 通过 productName 和 partnerID 找到目标 Partner
      const query = `?filters[productName][$eq]=${encodeURIComponent(productName)}&populate[Partner]=true`;
      const productRes = await axios.get(`${PARTNER_URL}${query}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });

      const productEntry = productRes.data?.data?.[0];
      if (!productEntry) throw new Error("未找到对应产品数据");

      const matchedPartner = productEntry.Partner?.find(p => p.partnerID === partnerID);
      if (!matchedPartner?.documentId) throw new Error("未找到对应合作伙伴");

      const partnerDocumentId = matchedPartner.documentId;

      // 3. 用 connect 方式，把 Customer 关联到 Partner
      await axios.put(`${PARTNER_URL}/${partnerDocumentId}`, {
        data: {
          Customer: {
            connect: [customerDocumentId]
          }
        }
      }, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });

      // 4. 邮件通知
      axios.post(MAIL_NOTIFY_API, {
        ...formData,
        partnerID,
        productName,
        documentId
      }).catch(err => console.warn("邮件通知失败", err));

      setSuccess(true);
      setFormData({ Name: "", Email: "", isInAustralia: "yes" });

    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error?.message || "提交失败，请稍后重试");
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

export default CustomerApplicationForm;
