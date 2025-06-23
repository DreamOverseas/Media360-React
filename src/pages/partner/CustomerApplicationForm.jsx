import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "../../css/CustomerApplicationForm.css";

const STRAPI_HOST = import.meta.env.VITE_STRAPI_HOST;
const CUSTOMER_URL = `${STRAPI_HOST}/api/partner-application-forms`;
const PARTNER_URL = `${STRAPI_HOST}/api/partner-application-submissions`;
const API_TOKEN = import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD;
const MAIL_NOTIFY_API = import.meta.env.VITE_360_MEDIA_CUSTOMER_APPLICATION_NOTIFICATION;

const CustomerApplicationForm = () => {
  const { productName } = useParams();
  const { partnerID } = Object.fromEntries(new URLSearchParams(useLocation().search));
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
      alert("缺少必要参数，非法访问！");
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
      // 1. 创建 Customer 数据
      const customerRes = await axios.post(
        CUSTOMER_URL,
        {
          data: {
            customerID: uuidv4(),
            Name: formData.Name,
            Email: formData.Email,
            isInAustralia: formData.isInAustralia === "yes",
          },
        },
        {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        }
      );

      const customerDocumentId = customerRes.data?.data?.documentId;
      if (!customerDocumentId) throw new Error("创建用户失败");

      console.log("✅ Customer documentId:", customerDocumentId);

      // 2. 查找目标 Partner documentId
      const query = `?filters[productName][$eq]=${encodeURIComponent(
        productName
      )}&filters[partnerID][$eq]=${encodeURIComponent(partnerID)}&fields[0]=documentId`;

      const partnerRes = await axios.get(`${PARTNER_URL}${query}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });

      console.log("✅ Partner 查询结果:", partnerRes.data);

      const partnerEntry = partnerRes.data?.data?.[0];
      if (!partnerEntry) throw new Error("未找到对应合作伙伴");

      const partnerDocumentId = partnerEntry?.documentId;
      if (!partnerDocumentId) throw new Error("合作伙伴缺少 documentId");

      console.log("✅ Partner documentId:", partnerDocumentId);

      // 3. 执行关联
      console.log("✅ 最终 PUT 请求地址:", `${PARTNER_URL}/${partnerDocumentId}`);

      await axios.put(
        `${PARTNER_URL}/${partnerDocumentId}`,
        {
          data: {
            Customer: {
              connect: [customerDocumentId],
            },
          },
        },
        {
          headers: { Authorization: `Bearer ${API_TOKEN}` },
        }
      );

      // 4. 邮件通知
      axios
        .post(MAIL_NOTIFY_API, {
          ...formData,
          partnerID,
          productName,
        })
        .catch((err) => console.warn("邮件通知失败", err));

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
