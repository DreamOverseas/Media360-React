import React, { useState, useRef } from "react";
import { Form, Button, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

const API_URL = "https://api.do360.com/api/product-screen-join-applications";
const UPLOAD_URL = "https://api.do360.com/api/upload";
const API_TOKEN = import.meta.env.VITE_API_KEY_PRODUCT_JOIN_APPLICATIONS;

const initialFormData = {
  applicantName: "",
  productName: "",
  applicantPhone: "",
  applicantEmail: "",
  productIntro: "",
  productPhone: "",
  productEmail: "",
  productLink: "",
  type: "Study Abroad Agency",
};

const JoinUsForm = () => {
  const [formData, setFormData] = useState(initialFormData);
  const [productLogo, setProductLogo] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProductLogo(e.target.files[0]);
  };

  const uploadFileToStrapi = async (file) => {
    const data = new FormData();
    data.append("files", file);

    const res = await axios.post(UPLOAD_URL, data, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
      },
    });

    return res.data[0]?.id || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      let productLogoId = null;

      if (productLogo) {
        productLogoId = await uploadFileToStrapi(productLogo);
        if (!productLogoId) throw new Error("图片上传失败");
      }

      const finalData = {
        ...formData,
        productLogo: productLogoId,
      };

      const response = await axios.post(
        API_URL,
        { data: finalData },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_TOKEN}`,
          },
        }
      );

      console.log("✅ 成功:", response.data);
      setSuccess(true);
      setFormData(initialFormData);
      setProductLogo(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("❌ 提交失败", err);
      if (err.response) {
        console.error("🔍 Strapi 返回的错误：", err.response.data);
      }
      setError("提交失败，请稍后再试。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>加入我们</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">提交成功！我们会尽快与您联系。</Alert>}

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
        <Form.Label>产品名称</Form.Label>
        <Form.Control
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>申请人电话</Form.Label>
        <Form.Control
          type="text"
          name="applicantPhone"
          value={formData.applicantPhone}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>申请人邮箱</Form.Label>
        <Form.Control
          type="email"
          name="applicantEmail"
          value={formData.applicantEmail}
          onChange={handleChange}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>产品介绍</Form.Label>
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
        <Form.Label>类型</Form.Label>
        <Form.Select name="type" value={formData.type} onChange={handleChange} required>
          <option value="Study Abroad Agency">Study Abroad Agency</option>
          <option value="Brand Merchants">Brand Merchants</option>
          <option value="Educational Services">Educational Services</option>
        </Form.Select>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>上传Logo</Form.Label>
        <Form.Control
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          ref={fileInputRef}
        />
      </Form.Group>

      <Button type="submit" variant="primary" disabled={loading}>
        {loading ? <Spinner animation="border" size="sm" /> : "提交申请"}
      </Button>
    </Form>
  );
};

export default JoinUsForm;
