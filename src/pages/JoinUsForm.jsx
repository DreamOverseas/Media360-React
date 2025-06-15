import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner, Container } from "react-bootstrap";
import axios from "axios";
import { useParams } from "react-router-dom";
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
  abnNumber: "",
  companyUrlLink: ""
};

const JoinUsForm = () => {
  // 只用 useParams 获取 productName
  const { productName } = useParams();

  const [formData, setFormData] = useState(initialFormData);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [asicCertificateFile, setAsicCertificateFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nextOrder, setNextOrder] = useState(1);

  // 自动获取当前产品的下一个 Order
  useEffect(() => {
    if (!productName) return setNextOrder(1);
    const query = new URLSearchParams({
      'filters[productName][$eq]': productName,
      'populate': 'Partner'
    }).toString();
    axios
      .get(`${API_URL}?${query}`, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      })
      .then((res) => {
        const existing = res.data?.data?.[0];
        if (existing && Array.isArray(existing.Partner)) {
          setNextOrder(existing.Partner.length + 1);
        } else if (existing && Array.isArray(existing.attributes?.Partner)) {
          setNextOrder(existing.attributes.Partner.length + 1);
        } else {
          setNextOrder(1);
        }
      })
      .catch(() => setNextOrder(1));
  }, [productName]);

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

    if (!productName) {
      setError("productName 不能为空，请通过产品详情页正确跳转！");
      setLoading(false);
      return;
    }

    try {
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
        companyUrlLink: formData.companyUrlLink,
        companyLogo: logoId,
        asicCertificate: certId,
        approved: false,
        Order: nextOrder,
        Customer: []
      };

      const query = new URLSearchParams({
        'filters[productName][$eq]': productName,
        'populate': 'Partner'
      }).toString();
      const url = `${API_URL}?${query}`;

      const res = await axios.get(url, {
        headers: { Authorization: `Bearer ${API_TOKEN}` }
      });

      const existing = res.data?.data?.[0];

      if (existing && (existing.documentId || existing.id)) {
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
        // 移除 Strapi 内部 id 字段
        const cleanPartnerList = (list) =>
          list.map(({ id, ...rest }) => ({ ...rest }));
        const updatedPartners = cleanPartnerList([
          ...currentPartners,
          newPartner
        ]);
        const putBody = {
          data: {
            productName,
            Partner: updatedPartners
          }
        };
        await axios.put(`${API_URL}/${docId}`, putBody, {
          headers: { Authorization: `Bearer ${API_TOKEN}` }
        });
      } else {
        const payload = {
          data: {
            productName,
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
      setNextOrder((n) => n + 1);
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
          <Form.Label>公司网站地址</Form.Label>
          <Form.Control
            type="text"
            value={formData.companyUrlLink}
            onChange={e => setFormData({ ...formData, companyUrlLink: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>公司 Logo</Form.Label>
          <Form.Control type="file" onChange={(e) => setCompanyLogo(e.target.files[0])} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>ASIC 证书 (大小不能大于10MB)</Form.Label>
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
