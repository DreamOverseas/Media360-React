import React, { useState } from "react";
import { Form, Button, Alert, Spinner, Container } from "react-bootstrap";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const STRAPI_HOST = import.meta.env.VITE_STRAPI_HOST;
const API_URL = `${STRAPI_HOST}/api/partner-application-submissions`;
const UPLOAD_URL = `${STRAPI_HOST}/api/upload`;
const API_TOKEN = import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD;

const initialFormData = {
  companyName: "",
  Phone: "",
  Email: "",
  Notes: "",
  abnNumber: ""
};

const JoinUsForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState(initialFormData);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [asicCertificateFile, setAsicCertificateFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const partnerName = location.state?.productName || "";

  const handleUpload = async (file) => {
    if (!file) return null;
    const data = new FormData();
    data.append("files", file);
    const res = await axios.post(UPLOAD_URL, data, {
      headers: { Authorization: `Bearer ${API_TOKEN}` }
    });
    return res.data[0]?.id;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      console.log("🟡 开始上传文件...");
      const logoId = await handleUpload(companyLogo);
      const certId = await handleUpload(asicCertificateFile);
      const partnerID = uuidv4();

      const newPartner = {
        companyName: formData.companyName,
        partnerID,
        Phone: formData.Phone,
        Email: formData.Email,
        Notes: formData.Notes,
        abnNumber: formData.abnNumber,
        companyLogo: logoId,
        asicCertificate: certId,
        approved: false,
        Customer: []
      };

      console.log("🟡 构造的新 Partner 数据:", newPartner);

      const query = new URLSearchParams({
        'filters[partnerName][$eq]': partnerName,
        'populate': 'Partner'
      }).toString();
      const url = `${API_URL}?${query}`;

      console.log("🔵 正在 GET 查询:", url);
      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });

      console.log("🟢 查询结果:", res.data);
      const existing = res.data?.data?.[0];

      if (existing) {
        const id = existing.id;
        const currentPartners = existing.attributes.Partner || [];
        const updatedPartners = [...currentPartners, newPartner];

        console.log("🛠️ 正在更新 ID:", id);
        await axios.put(`${API_URL}/${id}`, {
          data: {
            Partner: updatedPartners
          }
        }, {
          headers: { Authorization: `Bearer ${API_TOKEN}` }
        });

        console.log("✅ 更新成功");
      } else {
        const payload = {
          data: {
            partnerName,
            Partner: [newPartner]
          }
        };

        console.log("🆕 正在创建新 entry:", payload);
        await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${API_TOKEN}` }
        });

        console.log("✅ 创建成功");
      }

      setSuccess(true);
      setFormData(initialFormData);
      setCompanyLogo(null);
      setAsicCertificateFile(null);
    } catch (err) {
      console.error("❌ 提交失败:", err);
      setError("提交失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <h2 className="my-4">加入我们</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">提交成功！</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>公司名称</Form.Label>
          <Form.Control
            type="text"
            value={formData.companyName}
            onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>电话</Form.Label>
          <Form.Control
            type="text"
            value={formData.Phone}
            onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>邮箱</Form.Label>
          <Form.Control
            type="email"
            value={formData.Email}
            onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>备注</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.Notes}
            onChange={(e) => setFormData({ ...formData, Notes: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>ABN 编号</Form.Label>
          <Form.Control
            type="text"
            value={formData.abnNumber}
            onChange={(e) => setFormData({ ...formData, abnNumber: e.target.value })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>公司 Logo</Form.Label>
          <Form.Control type="file" onChange={(e) => setCompanyLogo(e.target.files[0])} />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>ASIC 证书</Form.Label>
          <Form.Control type="file" onChange={(e) => setAsicCertificateFile(e.target.files[0])} />
        </Form.Group>

        <Button type="submit" disabled={loading}>
          {loading ? <Spinner animation="border" size="sm" /> : "提交"}
        </Button>
      </Form>
    </Container>
  );
};

export default JoinUsForm;
