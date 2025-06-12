import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { Alert } from "react-bootstrap";
import "../../css/PartnerApplicationForm.css";

const PartnerApplicationForm = () => {
  const { companyId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    isInAustralia: "yes",
  });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        isInAustralia: formData.isInAustralia === "yes",
      };

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
      console.error("❌ 提交失败", err);
      setError("提交失败，请稍后再试。");
    }
  };

  return (
    <div className="partner-application-form">
      <h2>申请加入合作伙伴</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">提交成功！我们会尽快与您联系。</Alert>}

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

        <button type="submit" className="primary-submit-btn">提交申请</button>
      </form>
    </div>
  );
};

export default PartnerApplicationForm;
