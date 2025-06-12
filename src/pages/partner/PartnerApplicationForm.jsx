import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../../css/PartnerApplicationForm.css";

const PartnerApplicationForm = () => {
  const { companyId } = useParams();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    isInAustralia: "yes",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("提交的数据:", formData);
    // TODO: 提交到后端处理
  };

  return (
    <div className="partner-application-form">
      <h2>申请加入合作伙伴</h2>
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
