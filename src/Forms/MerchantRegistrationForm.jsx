import React, { useState, useRef } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";

const initialMerchantFormData = {
  companyName: "",
  businessLicense: [],
  industryCategory: "",
  contactPersonFirstName: "",
  contactPersonLastName: "",
  email: "",
  phone: "",
  companyDescription: "",
  companyWebsite: "",
  productDescription: "",
  productImages: [],
  targetAudience: "",
  marketingBudget: "",
  campaignGoals: "",
  additionalRequirements: "",
  from: "360 Influencer Contest merchant registration"
}

const MerchantRegistrationForm = ({ onSubmit }) => {
  const fileInputRef_license = useRef(null);
  const fileInputRef_product = useRef(null);
  const [formData, setFormData] = useState(initialMerchantFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  // 处理资格证书文件上传
  const handleLicenseFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // 10MB限制
    const invalidFiles = files.filter(file => file.size > 10 * 1024 * 1024);

    if (invalidFiles.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        businessLicense: "部分文件大小超过 10MB，未添加！",
      }));
    }

    setFormData((prevData) => ({
      ...prevData,
      businessLicense: [...(prevData.businessLicense || []), ...validFiles],
    }));

    setErrors((prevErrors) => ({ ...prevErrors, businessLicense: "" }));

    if (fileInputRef_license.current) {
      fileInputRef_license.current.value = "";
    }
  };

  // 处理产品图片上传
  const handleProductFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024); // 5MB限制
    const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);

    if (invalidFiles.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        productImages: "部分文件大小超过 5MB，未添加！",
      }));
    }

    setFormData((prevData) => ({
      ...prevData,
      productImages: [...(prevData.productImages || []), ...validFiles],
    }));

    setErrors((prevErrors) => ({ ...prevErrors, productImages: "" }));

    if (fileInputRef_product.current) {
      fileInputRef_product.current.value = "";
    }
  };

  // 删除资格证书文件
  const handleRemoveLicenseFile = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      businessLicense: prevData.businessLicense.filter((_, i) => i !== index),
    }));

    if (fileInputRef_license.current) {
      fileInputRef_license.current.value = "";
    }
  };

  // 删除产品图片
  const handleRemoveProductFile = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      productImages: prevData.productImages.filter((_, i) => i !== index),
    }));

    if (fileInputRef_product.current) {
      fileInputRef_product.current.value = "";
    }
  };

  const validateForm = () => {
    let newErrors = {};
    
    // 基本信息验证
    if (!formData.companyName.trim()) newErrors.companyName = "商家名称不能为空";
    if (!formData.companyDescription.trim()) newErrors.companyDescription = "请填写相关公司简介";
    if (!formData.industryCategory.trim()) newErrors.industryCategory = "请选择行业类别";
    if (!formData.contactPersonFirstName.trim()) newErrors.contactPersonFirstName = "负责人名字不能为空";
    if (!formData.contactPersonLastName.trim()) newErrors.contactPersonLastName = "负责人姓不能为空";
    
    if (!formData.email.trim()) {
      newErrors.email = "电子邮箱不能为空";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "电子邮箱格式不正确";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "电话不能为空";
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "电话格式不正确";
    }

    // 资格证书验证
    if (formData.businessLicense.length === 0) {
      newErrors.businessLicense = "请上传至少一张资格证书";
    }

    // 产品信息验证
    if (!formData.productDescription.trim()) {
      newErrors.productDescription = "产品/服务描述不能为空";
    }
    
    if (formData.productImages.length < 3) {
      newErrors.productImages = "请上传至少三张产品图片";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-4">
        <h2 className="text-primary">商家/赞助商注册</h2>
        <p className="text-muted">请填写以下信息完成注册，参与网红推广大赛</p>
      </div>

      {/* 基本商家信息 */}
      <div className="mb-4">
        <h4>基本信息</h4>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>商家名称 *</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                placeholder="请输入商家/公司名称"
                value={formData.companyName}
                onChange={handleChange}
                isInvalid={!!errors.companyName}
              />
              <Form.Control.Feedback type="invalid">{errors.companyName}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>行业类别 *</Form.Label>
              <Form.Select
                name="industryCategory"
                value={formData.industryCategory}
                onChange={handleChange}
                isInvalid={!!errors.industryCategory}
              >
                <option value="">请选择行业类别</option>
                <option value="beauty">美妆护肤</option>
                <option value="fashion">时尚服饰</option>
                <option value="food">食品饮料</option>
                <option value="electronics">数码电子</option>
                <option value="home">家居用品</option>
                <option value="health">健康保健</option>
                <option value="education">教育培训</option>
                <option value="travel">旅游出行</option>
                <option value="finance">金融服务</option>
                <option value="entertainment">娱乐游戏</option>
                <option value="other">其他</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.industryCategory}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>公司网站</Form.Label>
              <Form.Control
                type="url"
                name="companyWebsite"
                placeholder="https://www.example.com"
                value={formData.companyWebsite}
                onChange={handleChange}
                isInvalid={!!errors.companyWebsite}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>公司描述</Form.Label>
              <Form.Control
                as="textarea"
                name="companyDescription"
                rows={3}
                placeholder="简要描述您的公司业务、品牌理念和发展历程"
                value={formData.companyDescription}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* 负责人信息 */}
      <div className="mb-4">
        <h4>负责人信息</h4>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>负责人名字 *</Form.Label>
              <Form.Control
                type="text"
                name="contactPersonFirstName"
                placeholder="输入名字"
                value={formData.contactPersonFirstName}
                onChange={handleChange}
                isInvalid={!!errors.contactPersonFirstName}
              />
              <Form.Control.Feedback type="invalid">{errors.contactPersonFirstName}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>负责人姓 *</Form.Label>
              <Form.Control
                type="text"
                name="contactPersonLastName"
                placeholder="输入姓"
                value={formData.contactPersonLastName}
                onChange={handleChange}
                isInvalid={!!errors.contactPersonLastName}
              />
              <Form.Control.Feedback type="invalid">{errors.contactPersonLastName}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>电子邮箱 *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="输入电子邮箱"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>联系电话 *</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder="输入联系电话"
                value={formData.phone}
                onChange={handleChange}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* 资格证书 */}
      <div className="mb-4">
        <h4>资格证书</h4>
        <Form.Group className="mb-3">
          <Form.Label>营业执照/资格证书 *</Form.Label>
          <Form.Control
            type="file"
            multiple
            name="businessLicense"
            accept=".jpg,.jpeg,.png,.pdf"
            onChange={handleLicenseFileChange}
            ref={fileInputRef_license}
            isInvalid={!!errors.businessLicense}
          />
          <Form.Text className="text-muted">
            支持 JPG、PNG、PDF 格式，单个文件不超过 10MB
          </Form.Text>
          <Form.Control.Feedback type="invalid">{errors.businessLicense}</Form.Control.Feedback>

          {formData.businessLicense.length > 0 && (
            <div className="mt-2">
              <strong>已上传文件：</strong>
              <ul className="list-group mt-2">
                {formData.businessLicense.map((file, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="file-name">
                      {file.name.length > 30 ? file.name.substring(0, 15) + "..." + file.name.slice(-15) : file.name}
                    </span>
                    <span className="file-size ms-auto">（{(file.size / 1024 / 1024).toFixed(2)} MB）</span>
                    <Button variant="danger" size="sm" onClick={() => handleRemoveLicenseFile(index)} className="ms-2">
                      删除
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Form.Group>
      </div>

      {/* 产品/服务信息 */}
      <div className="mb-4">
        <h4>推广产品/服务</h4>
        <Form.Group className="mb-3">
          <Form.Label>产品/服务描述 *</Form.Label>
          <Form.Control
            as="textarea"
            name="productDescription"
            rows={4}
            placeholder="详细描述您希望网红推广的产品或服务，包括特色、优势、目标受众等"
            value={formData.productDescription}
            onChange={handleChange}
            isInvalid={!!errors.productDescription}
          />
          <Form.Control.Feedback type="invalid">{errors.productDescription}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>产品图片 *</Form.Label>
          <Form.Control
            type="file"
            multiple
            name="productImages"
            accept=".jpg,.jpeg,.png"
            onChange={handleProductFileChange}
            ref={fileInputRef_product}
            isInvalid={!!errors.productImages}
          />
          <Form.Text className="text-muted">
            请上传产品高清图片，支持 JPG、PNG 格式，单个文件不超过 5MB，至少上传3张
          </Form.Text>
          <Form.Control.Feedback type="invalid">{errors.productImages}</Form.Control.Feedback>

          {formData.productImages.length > 0 && (
            <div className="mt-2">
              <strong>已上传图片：</strong>
              <ul className="list-group mt-2">
                {formData.productImages.map((file, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="file-name">
                      {file.name.length > 30 ? file.name.substring(0, 15) + "..." + file.name.slice(-15) : file.name}
                    </span>
                    <span className="file-size ms-auto">（{(file.size / 1024 / 1024).toFixed(2)} MB）</span>
                    <Button variant="danger" size="sm" onClick={() => handleRemoveProductFile(index)} className="ms-2">
                      删除
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Form.Group>
      </div>

      {/* 推广需求 */}
      <div className="mb-4">
        <h4>推广需求</h4>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>目标受众</Form.Label>
              <Form.Control
                type="text"
                name="targetAudience"
                placeholder="例：18-35岁女性，关注美妆时尚"
                value={formData.targetAudience}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>预期营销预算</Form.Label>
              <Form.Select
                name="marketingBudget"
                value={formData.marketingBudget}
                onChange={handleChange}
              >
                <option value="">请选择预算范围</option>
                <option value="Under_5k">5000元以下</option>
                <option value="From_5k_to_20k">5000-20000元</option>
                <option value="From_20k_to_50k">20000-50000元</option>
                <option value="From_50k_to_100k">50000-100000元</option>
                <option value="Over_100k">100000元以上</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>推广目标</Form.Label>
          <Form.Control
            as="textarea"
            name="campaignGoals"
            rows={3}
            placeholder="请描述您希望通过网红推广达到的目标，如品牌曝光、销量提升、用户增长等"
            value={formData.campaignGoals}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>其他要求</Form.Label>
          <Form.Control
            as="textarea"
            name="additionalRequirements"
            rows={2}
            placeholder="对网红的特殊要求或合作期望（选填）"
            value={formData.additionalRequirements}
            onChange={handleChange}
          />
        </Form.Group>
      </div>

      <div className="d-grid gap-2">
        <Button variant="primary" type="submit" size="lg">
          提交注册申请
        </Button>
      </div>
    </Form>
  );
};

export default MerchantRegistrationForm;