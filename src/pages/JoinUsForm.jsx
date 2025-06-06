import React, { useState } from "react";
import axios from "axios";
import { Container, Form, Button, Row, Col, Alert } from "react-bootstrap";

const STRAPI_HOST = import.meta.env.VITE_STRAPI_HOST;
const STRAPI_TOKEN = import.meta.env.VITE_API_KEY_PRODUCT_JOIN_APPLICATIONS;
const STRAPI_API_URL = `${STRAPI_HOST}/api/product-screen-join-applications`;

const defaultFormData = {
  applicantName: "",
  companyName: "",
  applicantPhone: "",
  applicantEmail: "",
  productIntro: "",
  productPhone: "",
  productEmail: "",
  productLink: "",
};

const JoinUsForm = () => {
  const [formData, setFormData] = useState(defaultFormData);
  const [logoFile, setLogoFile] = useState(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setLogoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    try {
      console.log("🚀 正在提交的数据:", formData);
      if (logoFile) console.log("🖼️ 文件内容:", logoFile);

      // ✅ Step 1: 上传图片文件（可选）
      let uploadedLogoId = null;
      if (logoFile) {
        const imageData = new FormData();
        imageData.append("files", logoFile);

        const uploadRes = await axios.post(`${STRAPI_HOST}/api/upload`, imageData, {
          headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
          },
        });

        uploadedLogoId = uploadRes.data?.[0]?.id;
      }

      // ✅ Step 2: 提交主表单 JSON 数据
      const finalPayload = {
        ...formData,
        productLogo: uploadedLogoId,
      };

      const res = await axios.post(
        STRAPI_API_URL,
        { data: finalPayload },
        {
          headers: {
            Authorization: `Bearer ${STRAPI_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ 提交成功", res.data);
      setSuccess(true);
      setFormData(defaultFormData);
      setLogoFile(null);
    } catch (err) {
      console.error("❌ 提交失败:", err);
      if (err.response) {
        console.error("📩 Strapi 返回的错误:", err.response.data);
      }
      setError("提交失败，请稍后再试。");
    }
  };

  return (
    <Container className="mt-5">
      <h3>加入我们 - 申请表单</h3>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>申请人姓名</Form.Label>
              <Form.Control
                type="text"
                name="applicantName"
                value={formData.applicantName}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>公司名称</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>电话</Form.Label>
              <Form.Control
                type="text"
                name="applicantPhone"
                value={formData.applicantPhone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>邮箱</Form.Label>
              <Form.Control
                type="email"
                name="applicantEmail"
                value={formData.applicantEmail}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>产品简介</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="productIntro"
                value={formData.productIntro}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>产品电话</Form.Label>
              <Form.Control
                type="text"
                name="productPhone"
                value={formData.productPhone}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>产品邮箱</Form.Label>
              <Form.Control
                type="email"
                name="productEmail"
                value={formData.productEmail}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>产品链接</Form.Label>
              <Form.Control
                type="text"
                name="productLink"
                value={formData.productLink}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>上传产品 Logo</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Col>
        </Row>

        <Button type="submit">提交申请</Button>
      </Form>

      {success && <Alert variant="success" className="mt-3">申请已提交！我们会尽快联系您。</Alert>}
      {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
    </Container>
  );
};

export default JoinUsForm;
