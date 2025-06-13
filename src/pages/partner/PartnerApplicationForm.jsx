import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "../../css/PartnerApplicationForm.css";

const PartnerApplicationForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Name: "",
    Email: "",
    isInAustralia: "yes"
  });

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [partnerID, setPartnerID] = useState(null);

  useEffect(() => {
    const pid = location.state?.partnerID;
    if (!pid) {
      alert("非法访问：缺少 Partner ID。");
      navigate("/");
    } else {
      setPartnerID(pid);
    }
  }, [location.state, navigate]);

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
      const fetchURL = `${import.meta.env.VITE_STRAPI_HOST}/api/partner-application-submissions?filters[Partner][partnerID][$eq]=${partnerID}&populate=*`;
      const res = await fetch(fetchURL, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD}`
        }
      });
      const data = await res.json();

      const matchedEntry = data?.data?.[0];
      if (!matchedEntry) throw new Error("未找到匹配的 Partner 记录");

      const id = matchedEntry.id;
      const existingPartner = matchedEntry.attributes.Partner[0];
      const updatedPartner = {
        ...existingPartner,
        Customer: [
          {
            customerID: uuidv4(),
            Name: formData.Name,
            Email: formData.Email,
            isInAustralia: formData.isInAustralia === "yes"
          }
        ]
      };

      await fetch(`${import.meta.env.VITE_STRAPI_HOST}/api/partner-application-submissions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD}`
        },
        body: JSON.stringify({
          data: {
            Partner: [updatedPartner]
          }
        })
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
        <input type="text" name="Name" value={formData.Name} onChange={handleChange} required />

        <label>邮箱：</label>
        <input type="email" name="Email" value={formData.Email} onChange={handleChange} required />

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
