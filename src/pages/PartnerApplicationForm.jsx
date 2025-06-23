import React, { useState } from "react";
import { Form, Button, Alert, Spinner, Container } from "react-bootstrap";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const STRAPI_HOST = import.meta.env.VITE_STRAPI_HOST;
const PRODUCT_URL = `${STRAPI_HOST}/api/product-application-submissions`;
const PARTNER_URL = `${STRAPI_HOST}/api/partner-application-submissions`;
const UPLOAD_URL = `${STRAPI_HOST}/api/upload`;
const API_TOKEN = import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD;
const MAIL_NOTIFY_API = import.meta.env.VITE_360_MEDIA_PARTNER_APPLICATION_FORM_NOTIFICATION;

const initialFormData = {
  companyName: "",
  Phone: "",
  Email: "",
  Notes: "",
  abnNumber: "",
  companyUrlLink: "",
  cityLocation: "",
  experienceYears: "",
  licenseFile: "",
  agreed: false,
};

const PartnerApplicationForm = () => {
  const { productName } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [asicCertificateFile, setAsicCertificateFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (file) => {
    if (!file) return null;
    const data = new FormData();
    data.append("files", file);
    const res = await axios.post(UPLOAD_URL, data, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    return res.data?.[0]?.id || null;
  };

  const getOrCreateProductDocumentId = async () => {
    const res = await axios.get(`${PRODUCT_URL}?filters[productName][$eq]=${encodeURIComponent(productName)}&fields[0]=documentId`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    const existing = res.data?.data?.[0];
    if (existing?.documentId) return existing.documentId;

    const createRes = await axios.post(PRODUCT_URL, {
      data: { productName },
    }, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    return createRes.data?.data?.documentId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    if (!productName) {
      setError("缺少产品信息，请正确跳转！");
      setLoading(false);
      return;
    }
    if (!formData.agreed) {
      setError("请同意条款与条件再提交！");
      setLoading(false);
      return;
    }

    try {
      const logoId = await handleUpload(companyLogo);
      const certId = await handleUpload(asicCertificateFile);
      const licenseId = await handleUpload(formData.licenseFile);

      const partnerID = uuidv4();

      const partnerRes = await axios.post(PARTNER_URL, {
        data: {
          companyName: formData.companyName,
          partnerID,
          Phone: formData.Phone,
          Email: formData.Email,
          Notes: formData.Notes,
          abnNumber: formData.abnNumber,
          companyUrlLink: formData.companyUrlLink,
          companyLogo: logoId,
          asicCertificate: certId,
          licenseFile: licenseId,
          approved: false,
          cityLocation: formData.cityLocation,
          experienceYears: formData.experienceYears,
          productName,
        },
      }, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });

      const partnerDocumentId = partnerRes.data?.data?.documentId;
      if (!partnerDocumentId) throw new Error("获取新 Partner documentId 失败");

      const productDocumentId = await getOrCreateProductDocumentId();
      if (!productDocumentId) throw new Error("获取或创建 Product documentId 失败");

      // 用 documentId 规范更新关系
      await axios.put(`${PRODUCT_URL}/${productDocumentId}`, {
        data: {
          Partner: {
            connect: [partnerDocumentId],
          },
        },
      }, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });

      axios.post(MAIL_NOTIFY_API, {
        ...formData,
        partnerID,
        productName,
      }).catch(err => console.warn("邮件通知失败", err));

      setSuccess(true);
      setFormData(initialFormData);
      setCompanyLogo(null);
      setAsicCertificateFile(null);

    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error?.message || "提交失败，请重试");
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
          <Form.Label>ABN 编号</Form.Label>
          <Form.Control
            type="text"
            value={formData.abnNumber}
            onChange={(e) => setFormData({ ...formData, abnNumber: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>公司地点（城市）</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.cityLocation}
            onChange={(e) => setFormData({ ...formData, cityLocation: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>公司网站地址</Form.Label>
          <Form.Control
            type="text"
            value={formData.companyUrlLink}
            onChange={(e) => setFormData({ ...formData, companyUrlLink: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>从业经验</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            value={formData.experienceYears}
            onChange={(e) => setFormData({ ...formData, experienceYears: e.target.value })}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>牌照信息（PDF）</Form.Label>
          <Form.Control type="file" accept=".pdf" onChange={(e) => setFormData({ ...formData, licenseFile: e.target.files[0] })} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>公司 Logo</Form.Label>
          <Form.Control type="file" onChange={(e) => setCompanyLogo(e.target.files[0])} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label>ASIC 证书</Form.Label>
          <Form.Control type="file" onChange={(e) => setAsicCertificateFile(e.target.files[0])} />
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
          <Form.Check
            type="checkbox"
            id="agree-terms"
            label={
              <>
                我已阅读并同意
                <Link to={`/products/${encodeURIComponent(productName)}/PartnerApplicationForm/terms-and-conditions`} style={{ marginLeft: 4 }}>
                  条款与条件
                </Link>
              </>
            }
            checked={formData.agreed}
            onChange={(e) => setFormData({ ...formData, agreed: e.target.checked })}
            required
          />
        </Form.Group>

        <Button type="submit" disabled={loading || !formData.agreed}>
          {loading ? <Spinner animation="border" size="sm" /> : "提交"}
        </Button>
      </Form>
    </Container>
  );
};

export default PartnerApplicationForm;
