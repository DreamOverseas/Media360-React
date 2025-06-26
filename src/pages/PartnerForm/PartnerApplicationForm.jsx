import React, { useState } from "react";
import { Form, Button, Alert, Spinner, Container } from "react-bootstrap";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { FiX } from "react-icons/fi";
import { FiArrowLeft } from "react-icons/fi";

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
  advisorFirstName: "",
  advisorLastName: "",
  agreed: false,
};


const partnerTypeLabelMap = {
  lvyouzhongjie: "旅游中介",
  jiamengshang: "加盟商",
  liuxuezhongjie: "留学中介",
};

const getPartnerTypeLabel = (key) => partnerTypeLabelMap[key] || "合作伙伴";


const PartnerApplicationForm = () => {
  const { productName, partnerType } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState(initialFormData);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [asicCertificateFile, setAsicCertificateFile] = useState(null);
  const [advisorAvatar, setAdvisorAvatar] = useState(null);
  const [advisorLicenseFile, setAdvisorLicenseFile] = useState(null);
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
    const partnerTypeLabel = getPartnerTypeLabel(partnerType);

    const res = await axios.get(`${PRODUCT_URL}?filters[productName][$eq]=${encodeURIComponent(productName)}&filters[partnerType][$eq]=${encodeURIComponent(partnerTypeLabel)}&fields[0]=documentId`, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });

    const existing = res.data?.data?.[0];
    if (existing?.documentId) return existing.documentId;

    const createRes = await axios.post(PRODUCT_URL, {
      data: {
        productName,
        partnerType: partnerTypeLabel,
      },
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

    const partnerTypeLabel = getPartnerTypeLabel(partnerType);

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
      const advisorAvatarId = await handleUpload(advisorAvatar);
      const advisorLicenseId = await handleUpload(advisorLicenseFile);

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
          advisorFirstName: formData.advisorFirstName,
          advisorLastName: formData.advisorLastName,
          advisorAvatar: advisorAvatarId,
          advisorLicenseFile: advisorLicenseId,
          approved: false,
          cityLocation: formData.cityLocation,
          experienceYears: formData.experienceYears,
          productName,
          partnerType: partnerTypeLabel,  // 中文类型
        },
      }, {
        headers: { Authorization: `Bearer ${API_TOKEN}` },
      });

      const partnerDocumentId = partnerRes.data?.data?.documentId;
      if (!partnerDocumentId) throw new Error("获取新 Partner documentId 失败");

      const productDocumentId = await getOrCreateProductDocumentId();
      if (!productDocumentId) throw new Error("获取或创建 Product documentId 失败");

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
      setAdvisorAvatar(null);
      setAdvisorLicenseFile(null);

      setTimeout(() => {
        navigate(`/products/${encodeURIComponent(productName)}/${partnerType}/PartnerDetail`);
      }, 1000);

    } catch (err) {
      console.error(err);
      setError(err?.response?.data?.error?.message || "提交失败，请重试");
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

      <h2 className="my-4">加入我们</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">✅ 提交成功，页面即将跳转！</Alert>}

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
          <Form.Label>顾问姓名</Form.Label>
          <div style={{ display: "flex", gap: "10px" }}>
            <Form.Control
              type="text"
              placeholder="姓"
              value={formData.advisorLastName}
              onChange={(e) => setFormData({ ...formData, advisorLastName: e.target.value })}
              required
            />
            <Form.Control
              type="text"
              placeholder="名"
              value={formData.advisorFirstName}
              onChange={(e) => setFormData({ ...formData, advisorFirstName: e.target.value })}
              required
            />
          </div>
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
          <Form.Label>牌照信息（文件不得大于10MB且文件格式为PDF）</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf"
            onChange={(e) => setFormData({ ...formData, licenseFile: e.target.files[0] })}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>公司 Logo</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setCompanyLogo(e.target.files[0])}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>ASIC 证书（文件不得大于10MB且文件格式为PDF）</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setAsicCertificateFile(e.target.files[0])}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>顾问头像</Form.Label>
          <Form.Control
            type="file"
            accept="image/*"
            onChange={(e) => setAdvisorAvatar(e.target.files[0])}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>留学生中介牌照（文件不得大于10MB且文件格式为PDF）</Form.Label>
          <Form.Control
            type="file"
            accept=".pdf"
            onChange={(e) => setAdvisorLicenseFile(e.target.files[0])}
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
