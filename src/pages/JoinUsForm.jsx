import React, { useState, useRef, useEffect } from "react";
import { Form, Button, Alert, Spinner, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useLocation } from 'react-router-dom';

const STRAPI_HOST = import.meta.env.VITE_STRAPI_HOST;
const API_URL = `${STRAPI_HOST}/api/product-screen-join-applications`;
const UPLOAD_URL = `${STRAPI_HOST}/api/upload`;
const API_TOKEN = import.meta.env.VITE_API_KEY_PRODUCT_JOIN_APPLICATIONS;

const initialFormData = {
  companyName: "",
  Phone: "",
  Email: "",
  Notes: "",
  companyUrlLink: "",
  abnNumber: "",
};

const JoinUsForm = () => {
  const location = useLocation();
  const [formData, setFormData] = useState(initialFormData);
  const [companyLogo, setCompanyLogo] = useState(null);
  const [asicCertificateFile, setAsicCertificateFile] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();
  const asicFileInputRef = useRef();

  const [sourceProductName, setSourceProductName] = useState(null);
  const [sourceProductUrl, setSourceProductUrl] = useState(null);

  useEffect(() => {
    if (location.state?.productName) setSourceProductName(location.state.productName);
    if (location.state?.productUrl) setSourceProductUrl(location.state.productUrl);
  }, [location.state]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const uploadFileToStrapi = async (file) => {
    const data = new FormData();
    data.append("files", file);
    const res = await axios.post(UPLOAD_URL, data, {
      headers: { Authorization: `Bearer ${API_TOKEN}` },
    });
    return res.data[0]?.id || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      let companyLogoId = null;
      let asicCertificateId = null;

      if (companyLogo) {
        companyLogoId = await uploadFileToStrapi(companyLogo);
        if (!companyLogoId) throw new Error("公司 Logo 上传失败");
      }

      if (asicCertificateFile) {
        asicCertificateId = await uploadFileToStrapi(asicCertificateFile);
        if (!asicCertificateId) throw new Error("ASIC 文件上传失败");
      }

      const finalData = {
        ...formData,
        companyLogo: companyLogoId,
        asicCertificate: asicCertificateId,
        sourceProductName,
        sourceProductUrl,
      };

      const response = await axios.post(API_URL, { data: finalData }, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_TOKEN}`,
        },
      });

      console.log("✅ 成功:", response.data);
      setSuccess(true);
      setFormData(initialFormData);
      setCompanyLogo(null);
      setAsicCertificateFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (asicFileInputRef.current) asicFileInputRef.current.value = "";

    } catch (err) {
      console.error("❌ 提交失败", err);
      if (err.response) {
        console.error("🔍 Strapi 返回的错误：", err.response.data);
        console.error("完整错误信息", JSON.stringify(err.response.data, null, 2));
      }
      setError("提交失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <h2 className="mb-4">加入我们</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">提交成功！我们会尽快与您联系。</Alert>}

          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>公司名称</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>电话</Form.Label>
              <Form.Control
                type="text"
                name="Phone"
                value={formData.Phone}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>邮箱</Form.Label>
              <Form.Control
                type="email"
                name="Email"
                value={formData.Email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ABN 号码</Form.Label>
              <Form.Control
                type="text"
                name="abnNumber"
                value={formData.abnNumber}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>备注（公司地址、营业执照等）</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="Notes"
                value={formData.Notes}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>公司网站地址</Form.Label>
              <Form.Control
                type="text"
                name="companyUrlLink"
                value={formData.companyUrlLink}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>上传公司 Logo</Form.Label>
              <div className="d-flex align-items-center">
                <Button
                  variant="secondary"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                  className="me-3"
                >
                  选择文件
                </Button>
                <span>{companyLogo ? companyLogo.name : "未选择文件"}</span>
              </div>
              <Form.Control
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={(e) => setCompanyLogo(e.target.files[0])}
                style={{ display: "none" }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>ASIC 公司注册证书（PDF 或图片）</Form.Label>
              <div className="d-flex align-items-center">
                <Button
                  variant="secondary"
                  onClick={() => asicFileInputRef.current && asicFileInputRef.current.click()}
                  className="me-3"
                >
                  选择文件
                </Button>
                <span>{asicCertificateFile ? asicCertificateFile.name : "未选择文件"}</span>
              </div>
              <Form.Control
                type="file"
                accept=".pdf,image/*"
                ref={asicFileInputRef}
                onChange={(e) => setAsicCertificateFile(e.target.files[0])}
                style={{ display: "none" }}
              />
            </Form.Group>

            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "提交申请"}
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default JoinUsForm;
