import React, { useState, useEffect } from "react";
import { Form, Button, Alert, Spinner, Container } from "react-bootstrap";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const STRAPI_HOST = import.meta.env.VITE_STRAPI_HOST;
const API_URL = `${STRAPI_HOST}/api/partner-application-submission1s`;
const UPLOAD_URL = `${STRAPI_HOST}/api/upload`;
const API_TOKEN = import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD;
// 邮件服务接口（换成你的真实服务器地址）
const MAIL_NOTIFY_API = import.meta.env.VITE_360_MEDIA_PARTNER_APPLICATION_FORM_NOTIFICATION;

const initialFormData = {
  companyName: "",
  Phone: "",
  Email: "",
  Notes: "",
  abnNumber: "",
  companyUrlLink: "",
  agreed: false, // 同意条款与条件
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
  const [nextOrder, setNextOrder] = useState(1);

  // 获取下一个 Order
  useEffect(() => {
    if (!productName) return setNextOrder(1);
    const query = new URLSearchParams({
      'filters[productName][$eq]': productName,
      'populate[Partner][populate][0]': 'companyLogo',
      'populate[Partner][populate][1]': 'asicCertificate'
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

    if (!formData.agreed) {
      setError("请先同意条款与条件后再提交！");
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
        'populate[Partner][populate][0]': 'companyLogo',
        'populate[Partner][populate][1]': 'asicCertificate'
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

        console.log("旧数据 currentPartners：", currentPartners);
        // 移除 Strapi 内部 id 字段
        const cleanPartnerList = (list) =>
          list.map((item) => {
            const flat = item.attributes ? { ...item.attributes } : { ...item };
            const cleaned = { ...flat };

            // ✅ 保留媒体 ID
            if (cleaned.companyLogo && typeof cleaned.companyLogo === 'object' && cleaned.companyLogo.id) {
              cleaned.companyLogo = cleaned.companyLogo.id;
            }
            if (cleaned.asicCertificate && typeof cleaned.asicCertificate === 'object' && cleaned.asicCertificate.id) {
              cleaned.asicCertificate = cleaned.asicCertificate.id;
            }

            delete cleaned.id; // 去掉 Strapi 的 component id
            return cleaned;
          });



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

      // === 新增：自动发送邮件通知 ===
      axios.post(
        MAIL_NOTIFY_API,
        {
          ...formData,       // 传递所有表单字段
          productName,       // 单独补充产品名
        }
      ).catch((err) => {
        // 邮件发送失败不影响主流程，仅做警告
        console.warn("邮件通知发送失败", err);
      });

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

        {/* 条款与条件复选框（必须同意才可提交） */}
        <Form.Group className="mb-3">
          <Form.Check
            type="checkbox"
            id="agree-terms"
            label={
              <>
                我已阅读并同意
                <Link
                  to={`/products/${encodeURIComponent(productName)}/PartnerApplicationForm/terms-and-conditions`}
                  style={{ marginLeft: 4 }}
                >
                  条款与条件
                </Link>
              </>
            }
            checked={formData.agreed}
            onChange={(e) =>
              setFormData({ ...formData, agreed: e.target.checked })
            }
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
