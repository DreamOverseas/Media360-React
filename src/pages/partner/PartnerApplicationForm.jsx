import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import "../../css/PartnerApplicationForm.css";

// 环境变量配置
const STRAPI_HOST = import.meta.env.VITE_STRAPI_HOST;
const API_URL = `${STRAPI_HOST}/api/partner-application-submission1s`;
const API_TOKEN = import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD;

// 获取 query 参数
function getQueryParams(search) {
  return Object.fromEntries(new URLSearchParams(search));
}

// 移除所有 id 字段（包括嵌套）
function removeIdDeep(obj) {
  if (Array.isArray(obj)) {
    return obj.map(removeIdDeep);
  } else if (typeof obj === "object" && obj !== null) {
    const { id, ...rest } = obj;
    Object.keys(rest).forEach(key => {
      rest[key] = removeIdDeep(rest[key]);
    });
    return rest;
  }
  return obj;
}

const PartnerApplicationForm = () => {
  const { productName } = useParams();
  const { partnerID, documentId } = getQueryParams(useLocation().search);
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
      alert("非法访问：缺少 productName、Partner ID 或 documentId。");
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
      // 拉取当前 documentId 的 entry
      const query = `?filters[documentId][$eq]=${encodeURIComponent(documentId)}&populate[Partner][populate]=Customer`;
      const res = await axios.get(`${API_URL}${query}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });
      const entry = res.data?.data?.[0];
      if (!entry) throw new Error("未找到对应的产品数据（documentId）");

      // 获取 Partner 列表
      const partners = entry.Partner || entry.attributes?.Partner || [];
      const partnerIndex = partners.findIndex(
        p => (p.partnerID || p.attributes?.partnerID) === partnerID
      );
      if (partnerIndex === -1) throw new Error("未找到对应 Partner");

      // 构建新 Customer 并更新 Partner
      const partner = partners[partnerIndex];
      const customers = partner.Customer || partner.attributes?.Customer || [];
      const newCustomer = {
        customerID: uuidv4(),
        Name: formData.Name,
        Email: formData.Email,
        isInAustralia: formData.isInAustralia === "yes"
      };
      const updatedCustomers = [...customers, newCustomer];

      // 组装 partner，不带 id 字段
      const updatedPartner = {
        ...(partner.partnerID ? { partnerID: partner.partnerID } : {}),
        ...(partner.companyName ? { companyName: partner.companyName } : {}),
        ...(partner.Phone ? { Phone: partner.Phone } : {}),
        ...(partner.Email ? { Email: partner.Email } : {}),
        ...(partner.Notes ? { Notes: partner.Notes } : {}),
        ...(partner.companyUrlLink ? { companyUrlLink: partner.companyUrlLink } : {}),
        ...(partner.companyLogo ? { companyLogo: partner.companyLogo } : {}),
        ...(partner.abnNumber ? { abnNumber: partner.abnNumber } : {}),
        ...(partner.asicCertificate ? { asicCertificate: partner.asicCertificate } : {}),
        ...(partner.approved !== undefined ? { approved: partner.approved } : {}),
        ...(partner.Order !== undefined ? { Order: partner.Order } : {}),
        Customer: updatedCustomers
      };

      // 替换原 partner 数组目标项
      const updatedPartners = [...partners];
      updatedPartners[partnerIndex] = updatedPartner;
      const cleanedPartners = removeIdDeep(updatedPartners);

      // 组装 PUT payload
      const putPayload = {
        data: {
          productName,  // 保持产品名（和 joinusform 一致）
          Partner: cleanedPartners
        }
      };

      // 用 documentId 作为主键 PUT
      const putUrl = `${API_URL}/${documentId}`;
      console.log("PartnerApplicationForm PUT URL:", putUrl); // 调试用
      await axios.put(putUrl, putPayload, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });

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
