import React, { useState } from "react";
import { Form, Button, Alert, Spinner, Container } from "react-bootstrap";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const STRAPI_HOST = import.meta.env.VITE_STRAPI_HOST;
const API_URL = `${STRAPI_HOST}/api/partner-application-submission1s`;
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
  const params = new URLSearchParams(location.search);
  const partnerName = params.get("partnerName") || "";

  const [formData, setFormData] = useState(initialFormData);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [asicCertificateFile, setAsicCertificateFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // 上传文件
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

    if (!partnerName) {
      setError("partnerName 不能为空，请通过产品详情页正确跳转！");
      setLoading(false);
      return;
    }

    try {
      // 1. 文件上传
      const logoId = await handleUpload(companyLogo);
      const certId = await handleUpload(asicCertificateFile);
      const partnerID = uuidv4();

      // 2. 构建新的Partner数据
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

      // 3. 查找是否已存在该 partnerName 的 entry
      const query = new URLSearchParams({
        'filters[partnerName][$eq]': partnerName,
        'populate': 'Partner'
      }).toString();
      const url = `${API_URL}?${query}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });

      const existing = res.data?.data?.[0];

      if (existing && (existing.documentId || existing.id)) {
        // 取 documentId 或 id
        const docId = existing.documentId || existing.id;
        let currentPartners = [];
        if (existing.Partner && Array.isArray(existing.Partner)) {
          currentPartners = existing.Partner;
        } else if (
          existing.attributes &&
          Array.isArray(existing.attributes.Partner)
        ) {
          currentPartners = existing.attributes.Partner;
        }

        // 去除 id 字段，防止 Strapi 校验报错
        const cleanPartnerList = (list) =>
          list.map(({ id, ...rest }) => ({ ...rest }));
        const updatedPartners = cleanPartnerList([
          ...currentPartners,
          newPartner
        ]);

        // PUT时带上partnerName
        const putBody = {
          data: {
            partnerName,
            Partner: updatedPartners
          }
        };

        await axios.put(`${API_URL}/${docId}`, putBody, {
          headers: { Authorization: `Bearer ${API_TOKEN}` }
        });
      } else {
        // 没有则新建
        const payload = {
          data: {
            partnerName, // 只写 partnerName
            Partner: [newPartner]
          }
        };

        await axios.post(API_URL, payload, {
          headers: { Authorization: `Bearer ${API_TOKEN}` }
        });
      }

      setSuccess(true);
      setFormData(initialFormData);
      setCompanyLogo(null);
      setAsicCertificateFile(null);
    } catch (err) {
      setError(
        err?.response?.data?.error?.message ||
        JSON.stringify(err?.response?.data || err?.toJSON?.() || err)
      );
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
