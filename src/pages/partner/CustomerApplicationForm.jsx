import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FiX } from "react-icons/fi";

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
  const [error, setError] = useState("");
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
    setError("");
    setLoading(true);

    try {
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
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );

      const customerDocumentId = customerRes.data?.data?.documentId;
      if (!customerDocumentId) throw new Error("创建用户失败");

      const query = `?filters[productName][$eq]=${encodeURIComponent(
        productName
      )}&filters[partnerID][$eq]=${encodeURIComponent(partnerID)}&fields[0]=documentId`;

      const partnerRes = await axios.get(`${PARTNER_URL}${query}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });

      const partnerEntry = partnerRes.data?.data?.[0];
      if (!partnerEntry) throw new Error("未找到对应合作伙伴");

      const partnerDocumentId = partnerEntry?.documentId;
      if (!partnerDocumentId) throw new Error("合作伙伴缺少 documentId");

      await axios.put(
        `${PARTNER_URL}/${partnerDocumentId}`,
        {
          data: {
            Customer: {
              connect: [customerDocumentId],
            },
          },
        },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );

      axios
        .post(MAIL_NOTIFY_API, {
          ...formData,
          partnerID,
          productName,
        })
        .catch((err) => console.warn("邮件通知失败", err));

      setSuccess(true);
      setFormData({ Name: "", Email: "", isInAustralia: "yes" });

      // 1秒后跳转回 PartnerDetail 页面
      setTimeout(() => {
        navigate(`/products/${encodeURIComponent(productName)}/PartnerDetail`);
      }, 1000);

    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error?.message || "提交失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container style={{ position: "relative" }}>
      
      {/* 右上角 X 关闭按钮 */}
      <div
        onClick={() => navigate(`/products/${encodeURIComponent(productName)}/PartnerDetail`)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          cursor: "pointer",
          fontSize: "24px",
          color: "#555",
        }}
        title="关闭"
      >
        <FiX />
      </div>

      <h2 className="my-4">申请信息</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">✅ 提交成功！</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>姓名</Form.Label>
          <Form.Control
            type="text"
            name="Name"
            value={formData.Name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>邮箱</Form.Label>
          <Form.Control
            type="email"
            name="Email"
            value={formData.Email}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>是否在澳洲</Form.Label>
          <div>
            <Form.Check
              inline
              label="是"
              name="isInAustralia"
              type="radio"
              value="yes"
              checked={formData.isInAustralia === "yes"}
              onChange={handleChange}
            />
            <Form.Check
              inline
              label="否"
              name="isInAustralia"
              type="radio"
              value="no"
              checked={formData.isInAustralia === "no"}
              onChange={handleChange}
            />
          </div>
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "提交申请信息"}
        </Button>
      </Form>
    </Container>
  );
};

export default CustomerApplicationForm;
