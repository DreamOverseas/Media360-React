import React, { useState, useRef } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";


const initialFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  person_title: "",
  person_type: "",
  person_introduction: "",
  portrait: [],
  product_introduction:"",
  product_image:[],
  recommended_person_firstName: "",
  recommended_person_lastName: "",
  recommended_person_email: "",
  recommended_person_phone: "",
  recommended_person_title: "",
  recommended_person_type: "",
  recommended_person_introduction: "",
  recommended_person_portrait: []
}

const MerchantUploadForm = ({ onSubmit }) => {
    
  const fileInputRef_portrait = useRef(null);
  const fileInputRef_product = useRef(null);
  const fileInputRef_recommended_person_portrait = useRef(null);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState(initialFormData);

  const [errors, setErrors] = useState({});

 
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

    // 处理文件上传（多张图片）
    const handlePortraitFileChange = (event) => {
        const files = Array.from(event.target.files);

      
        const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
        const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);

        if (invalidFiles.length > 0) {
          setErrors((prevErrors) => ({
          ...prevErrors,
          portrait: "部分文件大小超过 5MB，未添加！",
          }));
        }

        setFormData((prevData) => ({
            ...prevData,
            portrait: [...(prevData.portrait || []), ...validFiles],
        }));

        setErrors((prevErrors) => ({ ...prevErrors, portrait: "" }));

        // ✅ 清空文件上传框
        if (fileInputRef_portrait.current) {
            fileInputRef_portrait.current.value = "";
        }
    };

    const handleRecommendedPortraitFileChange = (event) => {
      const files = Array.from(event.target.files);
      const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
      const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);

      if (invalidFiles.length > 0) {
          setErrors((prevErrors) => ({
          ...prevErrors,
          recommended_person_portrait: "部分文件大小超过 5MB，未添加！",
          }));
      }

      setFormData((prevData) => ({
          ...prevData,
          recommended_person_portrait: [...(prevData.recommended_person_portrait || []), ...validFiles],
      }));

      setErrors((prevErrors) => ({ ...prevErrors, recommended_person_portrait: "" }));

      // ✅ 清空文件上传框
      if (fileInputRef_recommended_person_portrait.current) {
          fileInputRef_recommended_person_portrait.current.value = "";
      }
    };

    const handleProductFileChange = (event) => {
      const files = Array.from(event.target.files);

    
      const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
      const invalidFiles = files.filter(file => file.size > 5 * 1024 * 1024);

      if (invalidFiles.length > 0) {
          setErrors((prevErrors) => ({
          ...prevErrors,
          product_image: "部分文件大小超过 5MB，未添加！",
          }));
      }

      setFormData((prevData) => ({
          ...prevData,
          product_image: [...(prevData.product_image || []), ...validFiles],
      }));

      setErrors((prevErrors) => ({ ...prevErrors, product_image: "" }));

      // ✅ 清空文件上传框
      if (fileInputRef_product.current) {
          fileInputRef_product.current.value = "";
      }
    };

  
    const handleRemovePortraitFile = (index) => {
        setFormData((prevData) => ({
          ...prevData,
          portrait: prevData.portrait.filter((_, i) => i !== index),
        }));
      
        // ✅ 清空文件上传框
        if (fileInputRef_portrait.current) {
          fileInputRef_portrait.current.value = "";
        }
    };


    const handleRemoveRecommendedPortraitFile = (index) => {
      setFormData((prevData) => ({
        ...prevData,
        recommended_person_portrait: prevData.recommended_person_portrait.filter((_, i) => i !== index),
      }));
    
      // ✅ 清空文件上传框
      if (fileInputRef_recommended_person_portrait.current) {
        fileInputRef_recommended_person_portrait.current.value = "";
      }
    };

    const handleRemoveProductFile = (index) => {
      setFormData((prevData) => ({
        ...prevData,
        product_image: prevData.product_image.filter((_, i) => i !== index),
      }));
    
      // ✅ 清空文件上传框
      if (fileInputRef_product.current) {
        fileInputRef_product.current.value = "";
      }
  };
  
  const validateStep = () => {
    let newErrors = {};
    
    if (step === 1) {
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

      if (
        formData.person_title.trim() !== "" ||
        formData.person_type.trim() !== "" ||
        formData.person_introduction.trim() !== "" ||
        formData.portrait.length !== 0
      ) {
        if (!formData.person_title.trim())
          newErrors.person_title = "人物头衔不能为空";
        if (!formData.person_type.trim())
          newErrors.person_type = "人物类型不能为空";
        if (!formData.person_introduction.trim())
          newErrors.person_introduction = "人物介绍不能为空";
        if (formData.portrait.length < 2) 
          newErrors.portrait = "请上传至少两张符合规格的照片";
      }
    }

    if (step === 2) {

      if (
        formData.product_introduction.trim() !== "" ||
        formData.product_image.length !== 0
      ) {
        if (!formData.product_introduction.trim()) 
          newErrors.product_introduction = "产品介绍不能为空";
        if (formData.product_image.length < 5) 
          newErrors.product_image = "请上传至少五张符合规格的照片";
      }
    }

    if (step === 3) {
      if (
        formData.recommended_person_firstName.trim() !== "" ||
        formData.recommended_person_lastName.trim() !== "" ||
        formData.recommended_person_email.trim() !== "" ||
        formData.recommended_person_phone.trim() !== "" ||
        formData.recommended_person_portrait.length !== 0
      ) {
        if (!formData.recommended_person_firstName.trim()) 
          newErrors.recommended_person_firstName = "推荐人名字不能为空";
        if (!formData.recommended_person_lastName.trim()) 
          newErrors.recommended_person_lastName = "推荐人姓不能为空";
        if (!formData.recommended_person_email.trim()) {
          newErrors.recommended_person_email = "推荐人电子邮箱不能为空";
        } else if (!/\S+@\S+\.\S+/.test(formData.recommended_person_email)) {
          newErrors.recommended_person_email = "推荐人电子邮箱格式不正确";
        }
        if (!formData.recommended_person_phone.trim()) {
          newErrors.recommended_person_phone = "推荐人电话不能为空";
        } else if (!/^\d{10,15}$/.test(formData.recommended_person_phone)) {
          newErrors.recommended_person_phone = "推荐人电话格式不正确";
        }

        if (!formData.recommended_person_title.trim())
          newErrors.recommended_person_title = "人物头衔不能为空";
        if (!formData.recommended_person_type.trim())
          newErrors.recommended_person_type = "人物类型不能为空";
        if (!formData.recommended_person_introduction.trim())
          newErrors.recommended_person_introduction = "人物介绍不能为空";
        if (formData.recommended_person_portrait.length < 2) 
          newErrors.recommended_person_portrait = "请上传至少两张符合规格的照片";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  // 进入下一步
  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  // 返回上一步
  const handlePrevious = () => {
    setStep(step - 1);
  };

  // 处理表单提交
  const handleSubmit = (event) => {
    event.preventDefault();

    if (validateStep()) {
      onSubmit(formData)
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
       {step === 1 && (
        <>
          <h1>您的个人信息</h1>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>名字 *</Form.Label>
                <Form.Control
                  type="text"
                  name="firstName"
                  placeholder="输入名字"
                  value={formData.firstName}
                  onChange={handleChange}
                  isInvalid={!!errors.firstName}
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
                  isInvalid={!!errors.lastName}
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
                  isInvalid={!!errors.email}
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
                  isInvalid={!!errors.phone}
                />
                <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <h1>代言人信息（选填）</h1>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>人物头衔</Form.Label>
                <Form.Control
                  type="text"
                  name="person_title"
                  placeholder="输入人物头衔"
                  value={formData.person_title}
                  isInvalid={!!errors.person_title}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">{errors.person_title}</Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>人物类型</Form.Label>
                <Form.Select
                  name="person_type"
                  value={formData.person_type}
                  onChange={handleChange}
                  isInvalid={!!errors.person_type}
                >
                  <option value="">请选择人物类型</option>
                  <option value="Founder">品牌创始人</option>
                  <option value="Kol">意见领袖</option>
                  <option value="Ambassador">代言人</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.person_type}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          <Form.Group className="mb-3">
            <Form.Label>人物介绍</Form.Label>
            <Form.Control
              as="textarea"
              name="person_introduction"
              rows={3}
              placeholder="输入人物介绍"
              value={formData.person_introduction}
              onChange={handleChange}
              isInvalid={!!errors.person_introduction}
            />
            <Form.Control.Feedback type="invalid">{errors.person_introduction}</Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>人物肖像照片</Form.Label>
            {/* 文件上传框 */}
            <Form.Control
                type="file"
                multiple
                name="portrait"
                onChange={handlePortraitFileChange}
                ref={fileInputRef_portrait}
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
                        <Button variant="danger" size="sm" onClick={() => handleRemovePortraitFile(index)} className="ms-2">
                        删除
                        </Button>
                    </li>
                    ))}
                </ul>
              </div>
            )}
            {errors.portrait && <p className="text-danger mt-2">{errors.portrait}</p>}
          </Form.Group>
          <Button variant="primary" onClick={handleNext}>下一步</Button>
        </>
      )}
      

      {step === 2 && (
        <>
          <h1>产品图文介绍（选填）</h1>
          <Form.Group className="mb-3">
            <Form.Label>产品介绍</Form.Label>
            <Form.Control
              as="textarea"
              name="product_introduction"
              rows={3}
              placeholder="输入产品介绍"
              value={formData.product_introduction}
              onChange={handleChange}
              isInvalid={!!errors.product_introduction}
            />
            <Form.Control.Feedback type="invalid">{errors.product_introduction}</Form.Control.Feedback>
          </Form.Group>


          <Form.Group className="mb-3">
                <Form.Label>产品照片</Form.Label>

                {/* 文件上传框 */}
                <Form.Control
                    type="file"
                    multiple
                    name="product_image"
                    onChange={handleProductFileChange}
                    ref={fileInputRef_product}
                />
                <Form.Control.Feedback type="invalid">{errors.product_image}</Form.Control.Feedback>

                {/* 显示已上传的文件 */}
                {formData.product_image.length > 0 && (
                    <div className="mt-2">
                    <strong>已上传文件：</strong>
                    <ul className="list-group mt-2">
                        {formData.product_image.map((file, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span className="file-name">
                            {file.name.length > 20 ? file.name.substring(0, 10) + "..." + file.name.slice(-10) : file.name}
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

                {errors.product_image && <p className="text-danger mt-2">{errors.product_image}</p>}
          </Form.Group>
          <Button variant="secondary" onClick={handlePrevious}>上一步</Button>
          <Button variant="primary" onClick={handleNext} className="ms-2">下一步</Button>
        </>
      )}


      {step === 3 && (
        <>
      <h1>推荐您信任的代言人(选填)</h1>
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>名字</Form.Label>
            <Form.Control
              type="text"
              name="recommended_person_firstName"
              placeholder="输入名字"
              value={formData.recommended_person_firstName}
              onChange={handleChange}
              isInvalid={!!errors.recommended_person_firstName}
            />
            <Form.Control.Feedback type="invalid">{errors.recommended_person_firstName}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>姓</Form.Label>
            <Form.Control
              type="text"
              name="recommended_person_lastName"
              placeholder="输入姓"
              value={formData.recommended_person_lastName}
              onChange={handleChange}
              isInvalid={!!errors.recommended_person_lastName}
            />
            <Form.Control.Feedback type="invalid">{errors.recommended_person_lastName}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>电子邮箱</Form.Label>
            <Form.Control
              type="email"
              name="recommended_person_email"
              placeholder="输入电子邮箱"
              value={formData.recommended_person_email}
              onChange={handleChange}
              isInvalid={!!errors.recommended_person_email}
            />
            <Form.Control.Feedback type="invalid">{errors.recommended_person_email}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>电话</Form.Label>
            <Form.Control
              type="text"
              name="recommended_person_phone"
              placeholder="输入电话"
              value={formData.recommended_person_phone}
              onChange={handleChange}
              isInvalid={!!errors.recommended_person_phone}
            />
            <Form.Control.Feedback type="invalid">{errors.recommended_person_phone}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <Form.Group>
            <Form.Label>人物头衔</Form.Label>
            <Form.Control
              type="text"
              name="recommended_person_title"
              placeholder="输入人物头衔"
              value={formData.recommended_person_title}
              onChange={handleChange}
              isInvalid={!!errors.recommended_person_title}
            />
            <Form.Control.Feedback type="invalid">{errors.recommended_person_title}</Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>人物类型</Form.Label>
            <Form.Select
              name="recommended_person_type"
              value={formData.recommended_person_type}
              onChange={handleChange}
              isInvalid={!!errors.recommended_person_type}
            >
              <option value="">请选择人物类型</option>
              <option value="Founder">品牌创始人</option>
              <option value="Kol">意见领袖</option>
              <option value="Ambassador">代言人</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">{errors.recommended_person_type}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Label>人物介绍</Form.Label>
        <Form.Control
          as="textarea"
          name="recommended_person_introduction"
          rows={3}
          placeholder="输入人物介绍"
          value={formData.recommended_person_introduction}
          onChange={handleChange}
          isInvalid={!!errors.recommended_person_introduction}
        />
        <Form.Control.Feedback type="invalid">{errors.recommended_person_introduction}</Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>人物肖像照片</Form.Label>

        {/* 文件上传框 */}
        <Form.Control
            type="file"
            multiple
            name="recommended_person_portrait"
            onChange={handleRecommendedPortraitFileChange}
            ref={fileInputRef_recommended_person_portrait}
        />
        <Form.Control.Feedback type="invalid">{errors.recommended_person_portrait}</Form.Control.Feedback>

        {/* 显示已上传的文件 */}
        {formData.recommended_person_portrait.length > 0 && (
            <div className="mt-2">
              <strong>已上传文件：</strong>
              <ul className="list-group mt-2">
                  {formData.recommended_person_portrait.map((file, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      <span className="file-name">
                      {file.name.length > 20 ? file.name.substring(0, 10) + "..." + file.name.slice(-10) : file.name}
                      </span>
                      <span className="file-size ms-auto">（{(file.size / 1024 / 1024).toFixed(2)} MB）</span>
                      <Button variant="danger" size="sm" onClick={() => handleRemoveRecommendedPortraitFile(index)} className="ms-2">
                      删除
                      </Button>
                  </li>
                  ))}
              </ul>
            </div>
         )}

        {errors.recommended_person_portrait && <p className="text-danger mt-2">{errors.recommended_person_portrait}</p>}
      </Form.Group>


        <Button variant="secondary" onClick={handlePrevious}>
            上一步
          </Button>
          <Button variant="success" type="submit" className="ms-2">
            提交
          </Button>
      </>
      )}
    </Form>
  );
};

export default MerchantUploadForm;