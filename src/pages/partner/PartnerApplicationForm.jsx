import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../../css/PartnerApplicationForm.css";

const PartnerApplicationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ 非法访问校验：location.state 不存在时跳转或显示提示
  useEffect(() => {
    if (!location.state?.productName || !location.state?.companyName) {
      alert("非法访问：请从产品页面进入申请表单。");
      navigate("/"); // 返回首页或你想跳转的 fallback 页面
    }
  }, [location.state, navigate]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    isInAustralia: "yes",
  });

  const [sourceProductName, setSourceProductName] = useState(null);
  const [sourceCompanyName, setSourceCompanyName] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state?.productName) setSourceProductName(location.state.productName);
    if (location.state?.companyName) setSourceCompanyName(location.state.companyName);
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    setLoading(true);

    const payload = {
      ...formData,
      isInAustralia: formData.isInAustralia === "yes",
      sourceProductName,
      sourceCompanyName,
    };

    console.log("🚀 即将上传的 payload:", payload);

    try {
      const res = await fetch(`${import.meta.env.VITE_STRAPI_HOST}/api/partner-application-forms`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD}`,
        },
        body: JSON.stringify({ data: payload }),
      });

      if (!res.ok) throw new Error("提交失败");

      setSuccess(true);
      setFormData({ name: "", email: "", isInAustralia: "yes" });
    } catch (err) {
      console.error("❌ 上传失败", err);
      setError("提交失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="partner-application-form">
      <h2>申请加入合作伙伴</h2>

      {success && <p className="success-message">✅ 提交成功！我们会尽快与您联系。</p>}
      {error && <p className="error-message">❌ {error}</p>}

      <form onSubmit={handleSubmit}>
        <label>姓名：</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>邮箱：</label>
        <input
          type="email"
          name="email"
          value={formData.email}
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

        <button type="submit" className="primary-submit-btn" disabled={loading}>
          {loading ? "提交中..." : "提交申请"}
        </button>
      </form>
    </div>
  );
};

export default PartnerApplicationForm;
