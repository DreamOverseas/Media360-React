import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { Container, Form, Button, Alert, Spinner } from "react-bootstrap";
import { FiArrowLeft } from "react-icons/fi";


const STRAPI_HOST = import.meta.env.VITE_STRAPI_HOST;
const CUSTOMER_URL = `${STRAPI_HOST}/api/partner-application-forms`;
const PARTNER_URL = `${STRAPI_HOST}/api/partner-application-submissions`;
const API_TOKEN = import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD;
const MAIL_NOTIFY_API = import.meta.env.VITE_360_MEDIA_CUSTOMER_APPLICATION_NOTIFICATION;


const partnerTypeLabelMap = {
  lvyouzhongjie: "旅游中介",
  jiamengshang: "加盟商",
  liuxuezhongjie: "留学中介",
  yiminguwen: "移民顾问",
};


const CustomerApplicationForm = () => {
  const { productName, partnerType } = useParams();
  const { partnerID } = Object.fromEntries(new URLSearchParams(useLocation().search));
  const navigate = useNavigate();
  

    const [formData, setFormData] = useState({
    surname: "",
    firstname: "",
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
      // 1. 获取 Partner 数据
      const query = `?filters[productName][$eq]=${encodeURIComponent(productName)}&filters[partnerID][$eq]=${encodeURIComponent(partnerID)}&fields[0]=documentId`;

      const partnerRes = await axios.get(`${PARTNER_URL}${query}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });

      const partnerEntry = partnerRes.data?.data?.[0];
      if (!partnerEntry) throw new Error("未找到对应合作伙伴");

      const partnerDocumentId = partnerEntry?.documentId;
      if (!partnerDocumentId) throw new Error("合作伙伴缺少 documentId");

      // 2. 创建 Customer 并绑定 Partner
      const customerRes = await axios.post(
        CUSTOMER_URL,
        {
          data: {
            customerID: uuidv4(),
            surname: formData.surname,
            firstname: formData.firstname,
            Email: formData.Email,
            isInAustralia: formData.isInAustralia === "yes",
            Partner: partnerDocumentId,
          },
        },
        { headers: { Authorization: `Bearer ${API_TOKEN}` } }
      );

      const customerDocumentId = customerRes.data?.data?.documentId;
      if (!customerDocumentId) throw new Error("创建用户失败");

      // 3. 反向绑定：Partner → Customer
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

      // 4. 邮件通知
      axios.post(MAIL_NOTIFY_API, {
          ...formData,
          partnerID,
          productName,
        })
        .catch((err) => console.warn("邮件通知失败", err));

      // 5. 成功处理
      setSuccess(true);
      setFormData({ Name: "", Email: "", isInAustralia: "yes" });

      setTimeout(() => {
        navigate(`/products/${encodeURIComponent(productName)}/${partnerType}/PartnerDetail`);
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
        onClick={() => navigate(`/products/${encodeURIComponent(productName)}/${partnerType}/PartnerDetail`)}
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          cursor: "pointer",
          fontSize: "24px",
          color: "#555",
          display: "flex",
          alignItems: "center",
          gap: "6px", // 图标和文字间距
        }}
        title="返回"
      >
        <FiArrowLeft />
        <span style={{ fontSize: "16px" }}>返回</span>
      </div>

      <h2 className="my-4">申请信息</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">✅ 提交成功！</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>姓名</Form.Label>
          <div style={{ display: "flex", gap: "10px" }}>
            <Form.Control
              type="text"
              placeholder="姓"
              value={formData.surname}
              onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
              required
            />
            <Form.Control
              type="text"
              placeholder="名"
              value={formData.firstname}
              onChange={(e) => setFormData({ ...formData, firstname: e.target.value })}
              required
            />
          </div>
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
