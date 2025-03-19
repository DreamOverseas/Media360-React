import React, { useState, useRef } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";

const MerchantUploadForm = ({ onSubmit }) => {
    
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    person_title: "",
    person_type: "",
    person_introduction: "",
    portrait: [],
  });

  const [errors, setErrors] = useState({}); // 存储错误信息
  const [submitted, setSubmitted] = useState(false); // 控制提交后显示错误信息

  // 处理输入框变化
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" })); // 清除错误信息
  };

  // 处理文件上传（多张图片）
    // 处理文件上传（多张图片）
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files); // 获取用户选择的文件

        // 过滤掉超过 5MB 的文件
        const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
        const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);

        if (invalidFiles.length > 0) {
            setErrors((prevErrors) => ({
            ...prevErrors,
            portrait: "部分文件大小超过 5MB，未添加！",
            }));
        }

        // **正确追加新文件，而不是覆盖旧文件**
        setFormData((prevData) => ({
            ...prevData,
            portrait: [...(prevData.portrait || []), ...validFiles],
        }));

        setErrors((prevErrors) => ({ ...prevErrors, portrait: "" }));

        // ✅ 清空文件上传框
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
  

    const handleRemoveFile = (index) => {
        setFormData((prevData) => ({
          ...prevData,
          portrait: prevData.portrait.filter((_, i) => i !== index),
        }));
      
        // ✅ 清空文件上传框
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
    };
  

  // 处理表单提交
  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);

    // 检查必填项
    let newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "名字不能为空";
    if (!formData.lastName.trim()) newErrors.lastName = "姓不能为空";
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
    if (!formData.person_introduction.trim()) newErrors.person_introduction = "人物介绍不能为空";
    if (!formData.portrait) newErrors.portrait = "请上传人物肖像照";

    // 如果有错误，不提交表单
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 调用父组件的 onSubmit
    onSubmit(formData);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row className="mb-3">
        <h1>上传人信息</h1>
        <Col md={6}>
          <Form.Group>
            <Form.Label>名字 *</Form.Label>
            <Form.Control
              type="text"
              name="firstName"
              placeholder="输入名字"
              value={formData.firstName}
              onChange={handleChange}
              isInvalid={submitted && !!errors.firstName}
            />
            <Form.Control.Feedback type="invalid">{errors.firstName}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>姓 *</Form.Label>
            <Form.Control
              type="text"
              name="lastName"
              placeholder="输入姓"
              value={formData.lastName}
              onChange={handleChange}
              isInvalid={submitted && !!errors.lastName}
            />
            <Form.Control.Feedback type="invalid">{errors.lastName}</Form.Control.Feedback>
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
              isInvalid={submitted && !!errors.email}
            />
            <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>电话 *</Form.Label>
            <Form.Control
              type="text"
              name="phone"
              placeholder="输入电话"
              value={formData.phone}
              onChange={handleChange}
              isInvalid={submitted && !!errors.phone}
            />
            <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>人物头衔</Form.Label>
            <Form.Control
              type="text"
              name="person_title"
              placeholder="输入人物头衔"
              value={formData.person_title}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>人物类型</Form.Label>
            <Form.Select
              name="person_type"
              value={formData.person_type}
              onChange={handleChange}
            >
              <option value="">请选择人物类型</option>
              <option value="品牌创始人">品牌创始人</option>
              <option value="意见领袖">意见领袖</option>
              <option value="代言人">代言人</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>人物介绍 *</Form.Label>
        <Form.Control
          as="textarea"
          name="person_introduction"
          rows={3}
          placeholder="输入人物介绍"
          value={formData.person_introduction}
          onChange={handleChange}
          isInvalid={submitted && !!errors.person_introduction}
        />
        <Form.Control.Feedback type="invalid">{errors.person_introduction}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
            <Form.Label>人物肖像照片 *</Form.Label>

            {/* 文件上传框 */}
            <Form.Control
                type="file"
                multiple
                name="portrait"
                onChange={handleFileChange}
                ref={fileInputRef}
            />
            <Form.Control.Feedback type="invalid">{errors.portrait}</Form.Control.Feedback>

            {/* 显示已上传的文件 */}
            {formData.portrait.length > 0 && (
                <div className="mt-2">
                <strong>已上传文件：</strong>
                <ul className="list-group mt-2">
                    {formData.portrait.map((file, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <span className="file-name">
                        {file.name.length > 20 ? file.name.substring(0, 10) + "..." + file.name.slice(-10) : file.name}
                        </span>
                        <span className="file-size ms-auto">（{(file.size / 1024 / 1024).toFixed(2)} MB）</span>
                        <Button variant="danger" size="sm" onClick={() => handleRemoveFile(index)} className="ms-2">
                        删除
                        </Button>
                    </li>
                    ))}
                </ul>
                </div>
            )}

            {errors.portrait && <p className="text-danger mt-2">{errors.portrait}</p>}
      </Form.Group>


      <Button variant="primary" type="submit">
        提交
      </Button>
    </Form>
  );
};

export default MerchantUploadForm;