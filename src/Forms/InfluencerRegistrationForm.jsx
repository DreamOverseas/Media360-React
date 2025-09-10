import React, { useState, useRef } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";

const initialInfluencerFormData = {
  name: "",
  gender: "",
  age: "",
  phone: "",
  email: "",
  location: "",
  
  // 社交媒体信息
  socialMedia: [], // 多选平台
  
  // 内容及经验
  // contentCategories: [],
  // pastCollaborations: "",
  // portfolioLinks: "",
  // portfolioFiles: [],
  // personalIntroduction: "",
  // personalImages: [],
  
  // 大赛相关信息
  preferredProductCategories: [],
  // acceptedPromotionFormats: [], // checkbox形式
  agreeToRules: false, // checkbox
  allowContentUsage: false, // checkbox
  
  from: "360 Influencer Contest influencer registration"
};

const InfluencerRegistrationForm = ({ onSubmit }) => {
  const fileInputRef = useRef(null);
  const personalImagesRef = useRef(null);
  const [formData, setFormData] = useState(initialInfluencerFormData);
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    
    if (type === 'checkbox') {
      setFormData((prevData) => ({ ...prevData, [name]: checked }));
    } else {
      setFormData((prevData) => ({ ...prevData, [name]: value }));
    }
    
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };


  const handleSocialMediaChange = (index, e) => {
    const { name, value, } = e.target;
    const newAccounts = [...formData.socialMedia];
    newAccounts[index][name] = value;
    setFormData({ ...formData, socialMedia: newAccounts });
  };

  const addSocialMedia = () => {
    setFormData({
      ...formData,
      socialMedia: [...formData.socialMedia, { Platform: '', Fans: '', PlatformNickname: '' }]
    });
  };

  const removeSocialMedia = (index) => {
    const newAccounts = [...formData.socialMedia];
    newAccounts.splice(index, 1);
    setFormData({ ...formData, socialMedia: newAccounts });
  };

  // 处理多选checkbox
  const handleCheckboxChange = (event, fieldName) => {
    const { value, checked } = event.target;
    
    setFormData((prevData) => {
      const currentValues = prevData[fieldName] || [];
      if (checked) {
        return { ...prevData, [fieldName]: [...currentValues, value] };
      } else {
        return { ...prevData, [fieldName]: currentValues.filter(v => v !== value) };
      }
    });
    
    setErrors((prevErrors) => ({ ...prevErrors, [fieldName]: "" }));
  };

  // 处理作品文件上传
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024); // 10MB限制
    const invalidFiles = files.filter(file => file.size > 10 * 1024 * 1024);

    if (invalidFiles.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        portfolioFiles: "部分文件大小超过 10MB，未添加！",
      }));
    }

    setFormData((prevData) => ({
      ...prevData,
      portfolioFiles: [...(prevData.portfolioFiles || []), ...validFiles],
    }));

    setErrors((prevErrors) => ({ ...prevErrors, portfolioFiles: "" }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // 删除作品文件
  const handleRemoveFile = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      portfolioFiles: prevData.portfolioFiles.filter((_, i) => i !== index),
    }));

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handlePersonalImagesChange = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => file.size <= 10 * 1024 * 1024);
    const invalidFiles = files.filter(file => file.size > 10 * 1024 * 1024);

    if (invalidFiles.length > 0) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        personalImages: "部分文件大小超过 10MB，未添加！",
      }));
    }

    setFormData((prevData) => ({
      ...prevData,
      personalImages: [...(prevData.personalImages || []), ...validFiles],
    }));

    setErrors((prevErrors) => ({ ...prevErrors, personalImages: "" }));

    if (personalImagesRef.current) {
      personalImagesRef.current.value = "";
    }
  };


  const handleRemovePersonalImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      personalImages: prevData.personalImages.filter((_, i) => i !== index),
    }));

    if (personalImagesRef.current) {
      personalImagesRef.current.value = "";
    }
  };

  const validateForm = () => {
    let newErrors = {};
    
    // 基本信息验证
    if (!formData.name.trim()) newErrors.name = "姓名不能为空";

    if (!formData.gender.trim()) newErrors.gender = "请填写性别";

    if (!formData.age.trim()) newErrors.age = "请填写年龄";
    
    if (!formData.email.trim()) {
      newErrors.email = "邮箱不能为空";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "邮箱格式不正确";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "联系电话不能为空";
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = "电话格式不正确";
    }

    if (!formData.location.trim()) newErrors.location = "所在城市/国家不能为空";

    // 社交媒体信息验证
   if (formData.socialMedia.length === 0) {
      newErrors.socialMedia = "请至少填写一个主力社交平台";
    } else {
      formData.socialMedia.forEach((account, index) => {
        const { Platform, PlatformNickname, Fans } = account;

        const hasAny = Platform.trim() || PlatformNickname.trim() || Fans.toString().trim();
        const allFilled = Platform.trim() && PlatformNickname.trim() && Fans.toString().trim();

        if (hasAny && !allFilled) {
          newErrors.socialMedia = `第 ${index + 1} 个社交媒体账号未完整填写（平台/昵称/粉丝数必须同时填写）`;
        }
      });
    }

    // // 内容及经验验证
    // if (formData.contentCategories.length === 0) {
    //   newErrors.contentCategories = "请至少选择一个主要创作领域";
    // }

    // if (!formData.personalIntroduction.trim()) {
    //   newErrors.personalIntroduction = "个人介绍不能为空";
    // }

    // if (formData.personalImages.length < 3) {
    //   newErrors.personalImages = "请上传至少三张个人形象照片";
    // }

    // 大赛相关信息验证
    if (formData.preferredProductCategories.length === 0) {
      newErrors.preferredProductCategories = "请至少选择一个愿意宣传的商品/服务类别";
    }

    // if (formData.acceptedPromotionFormats.length === 0) {
    //   newErrors.acceptedPromotionFormats = "请至少选择一种接受的推广形式";
    // }

    if (!formData.agreeToRules) {
      newErrors.agreeToRules = "请同意遵守比赛规则";
    }

    if (!formData.allowContentUsage) {
      newErrors.allowContentUsage = "请同意主办方使用参赛作品做宣传";
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
        <h2 className="text-primary">网红达人注册</h2>
        <p className="text-muted">请填写以下信息完成注册，参与网红推广大赛</p>
      </div>

      {/* 基本信息 */}
      <div className="mb-4">
        <h4>基本信息</h4>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>姓名 *</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder="请输入您的姓名"
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>性别 *</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                isInvalid={!!errors.gender}
              >
                <option value="">请选择</option>
                <option value="Male">男</option>
                <option value="Female">女</option>
                <option value="Others">其他</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>年龄 *</Form.Label>
              <Form.Control
                type="number"
                name="age"
                placeholder="年龄"
                min="13"
                max="100"
                value={formData.age}
                onChange={handleChange}
                isInvalid={!!errors.age}
              />
              <Form.Control.Feedback type="invalid">{errors.age}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
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
          <Col md={6}>
            <Form.Group>
              <Form.Label>邮箱 *</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="输入邮箱地址"
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>所在城市/国家 *</Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder="例：北京，中国"
                value={formData.location}
                onChange={handleChange}
                isInvalid={!!errors.location}
              />
              <Form.Control.Feedback type="invalid">{errors.location}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </div>

      {/* 社交媒体信息 */}
      <div className="mb-4">
        <h4>社交媒体信息</h4>
        
        <Form.Group className="mb-3">
          <Form.Label>媒体账号 *</Form.Label>
          {formData.socialMedia.map((account, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <Form.Control
                type="text"
                name="Platform"
                placeholder="平台(Platform)"
                className="me-2"
                value={account.Platform}
                onChange={(e) => handleSocialMediaChange(index, e)}
                list="MediaPlatformOptions"
                style={{ flex: 1 }}
                isInvalid={!!errors.socialMedia}
              />
              <datalist id="MediaPlatformOptions">
                <option value="抖音" />
                <option value="小红书(REDNote)" />
                <option value="快手(Kuaishou)" />
                <option value="微博(Weibo)" />
                <option value="TikTok" />
                <option value="Instagram" />
                <option value="X(Twitter)" />
                <option value="Youtube" />
              </datalist>

              <Form.Control
                type="text"
                name="PlatformNickname"
                placeholder="平台昵称/id"
                className="me-2"
                value={account.PlatformNickname}
                onChange={(e) => handleSocialMediaChange(index, e)}
                style={{ flex: 1 }}
              />
              
              <Form.Control
                type="number"
                name="Fans"
                placeholder="粉丝数(Fan Number)"
                className="me-2"
                value={account.Fans}
                onChange={(e) => handleSocialMediaChange(index, e)}
                style={{ flex: 1 }}
              />

              
              
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeSocialMedia(index)}
              >
                <i className="bi bi-dash"></i>
              </Button>
            </div>
          ))}
          
          <Button 
            variant="secondary" 
            size="sm" 
            className="mt-2" 
            onClick={addSocialMedia}
          >
            添加媒体账号
          </Button>

          {errors.socialMedia && (
            <div className="text-danger small mt-2">{errors.socialMedia}</div>
          )}

        </Form.Group>

      </div>

      {/* 内容及经验 */}
      {/* <div className="mb-4">
        <h4>内容及经验</h4>
        
        <Form.Group className="mb-3">
          <Form.Label>主要创作领域 * (可多选)</Form.Label>
          <div className={`border rounded p-3 ${errors.contentCategories ? 'border-danger' : ''}`}>
            {[
              { value: 'beauty', label: '美妆' },
              { value: 'food', label: '美食' },
              { value: 'travel', label: '旅行' },
              { value: 'fitness', label: '健身' },
              { value: 'lifestyle', label: '生活方式' },
              { value: 'education', label: '教育' },
              { value: 'fashion', label: '时尚' },
              { value: 'tech', label: '科技' },
              { value: 'gaming', label: '游戏' },
              { value: 'entertainment', label: '娱乐' },
              { value: 'parenting', label: '育儿' },
              { value: 'other', label: '其他' }
            ].map((category) => (
              <Form.Check
                key={category.value}
                type="checkbox"
                label={category.label}
                value={category.value}
                checked={formData.contentCategories.includes(category.value)}
                onChange={(e) => handleCheckboxChange(e, 'contentCategories')}
                className="mb-2 me-4 d-inline-block"
              />
            ))}
          </div>
          {errors.contentCategories && <div className="text-danger small">{errors.contentCategories}</div>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>过往合作品牌/案例（可选）</Form.Label>
          <Form.Control
            as="textarea"
            name="pastCollaborations"
            rows={3}
            placeholder="请简要描述您过往的品牌合作经验和成功案例"
            value={formData.pastCollaborations}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>代表作品链接</Form.Label>
          <Form.Control
            as="textarea"
            name="portfolioLinks"
            rows={2}
            placeholder="请提供您的代表作品链接，每行一个链接"
            value={formData.portfolioLinks}
            onChange={handleChange}
          />
          <Form.Text className="text-muted">
            可以是视频链接、社交媒体帖子链接等
          </Form.Text>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>作品上传（可选）</Form.Label>
          <Form.Control
            type="file"
            multiple
            name="portfolioFiles"
            accept=".jpg,.jpeg,.png,.mp4,.mov,.avi"
            onChange={handleFileChange}
            ref={fileInputRef}
            isInvalid={!!errors.portfolioFiles}
          />
          <Form.Text className="text-muted">
            支持图片(JPG、PNG) 单个文件不超过10MB；
            视频(MP4、MOV、AVI)格式请单独发送至info@do360.com
          </Form.Text>
          <Form.Control.Feedback type="invalid">{errors.portfolioFiles}</Form.Control.Feedback>

          {formData.portfolioFiles.length > 0 && (
            <div className="mt-2">
              <strong>已上传文件：</strong>
              <ul className="list-group mt-2">
                {formData.portfolioFiles.map((file, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="file-name">
                      {file.name.length > 30 ? file.name.substring(0, 15) + "..." + file.name.slice(-15) : file.name}
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
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>个人介绍 / 自我推荐 *</Form.Label>
          <Form.Control
            as="textarea"
            name="personalIntroduction"
            rows={4}
            placeholder="请介绍您自己，说明为什么想要参加这次比赛，以及您能为品牌带来什么价值"
            value={formData.personalIntroduction}
            onChange={handleChange}
            isInvalid={!!errors.personalIntroduction}
          />
          <Form.Control.Feedback type="invalid">{errors.personalIntroduction}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>个人形象照片上传 *</Form.Label>
          <Form.Control
            type="file"
            multiple
            name="personalImages"
            accept=".jpg,.jpeg,.png"
            onChange={handlePersonalImagesChange}
            ref={personalImagesRef}
            isInvalid={!!errors.personalImages}
          />
          <Form.Text className="text-muted">
            支持 JPG、PNG，单个文件不超过 10MB
          </Form.Text>
          <Form.Control.Feedback type="invalid">
            {errors.personalImages}
          </Form.Control.Feedback>

          {formData.personalImages.length > 0 && (
            <div className="mt-2">
              <strong>已上传照片：</strong>
              <ul className="list-group mt-2">
                {formData.personalImages.map((file, index) => (
                  <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                    <span className="file-name">
                      {file.name.length > 30 ? file.name.substring(0, 15) + "..." + file.name.slice(-15) : file.name}
                    </span>
                    <span className="file-size ms-auto">（{(file.size / 1024 / 1024).toFixed(2)} MB）</span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemovePersonalImage(index)}
                      className="ms-2"
                    >
                      删除
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Form.Group>

      </div> */}

      {/* 大赛相关信息 */}
      <div className="mb-4">
        <h4>大赛相关信息</h4>
        
        <Form.Group className="mb-3">
          <Form.Label>愿意宣传的商品/服务类别 * (可多选)</Form.Label>
          <div className={`border rounded p-3 ${errors.preferredProductCategories ? 'border-danger' : ''}`}>
            {[
              { value: 'food_beverage', label: '食品饮料' },
              { value: 'cosmetics', label: '化妆品' },
              { value: 'travel', label: '旅游产品' },
              { value: 'fashion', label: '时尚服饰' },
              { value: 'electronics', label: '数码电子' },
              { value: 'home', label: '家居用品' },
              { value: 'health', label: '健康保健' },
              { value: 'education', label: '教育培训' },
              { value: 'finance', label: '金融服务' },
              { value: 'entertainment', label: '娱乐游戏' },
              { value: 'automotive', label: '汽车用品' },
              { value: 'mother_baby', label: '母婴用品' }
            ].map((category) => (
              <Form.Check
                key={category.value}
                type="checkbox"
                label={category.label}
                value={category.value}
                checked={formData.preferredProductCategories.includes(category.value)}
                onChange={(e) => handleCheckboxChange(e, 'preferredProductCategories')}
                className="mb-2 me-4 d-inline-block"
              />
            ))}
          </div>
          {errors.preferredProductCategories && <div className="text-danger small">{errors.preferredProductCategories}</div>}
        </Form.Group>

        {/* <Form.Group className="mb-3">
          <Form.Label>接受的推广形式 * (可多选)</Form.Label>
          <div className={`border rounded p-3 ${errors.acceptedPromotionFormats ? 'border-danger' : ''}`}>
            <Form.Check
              type="checkbox"
              label="短视频推广"
              value="short_video"
              checked={formData.acceptedPromotionFormats.includes('short_video')}
              onChange={(e) => handleCheckboxChange(e, 'acceptedPromotionFormats')}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              label="直播推广"
              value="live_streaming"
              checked={formData.acceptedPromotionFormats.includes('live_streaming')}
              onChange={(e) => handleCheckboxChange(e, 'acceptedPromotionFormats')}
              className="mb-2"
            />
            <Form.Check
              type="checkbox"
              label="图文种草"
              value="content_seeding"
              checked={formData.acceptedPromotionFormats.includes('content_seeding')}
              onChange={(e) => handleCheckboxChange(e, 'acceptedPromotionFormats')}
              className="mb-2"
            />
          </div>
          {errors.acceptedPromotionFormats && <div className="text-danger small">{errors.acceptedPromotionFormats}</div>}
        </Form.Group> */}

        <div className="mb-3">
          <h5>参赛承诺</h5>
          <Form.Check
            type="checkbox"
            label="我同意遵守比赛规则和要求 *"
            name="agreeToRules"
            checked={formData.agreeToRules}
            onChange={handleChange}
            isInvalid={!!errors.agreeToRules}
            className="mb-2"
          />
          {errors.agreeToRules && <div className="text-danger small">{errors.agreeToRules}</div>}
          
          <Form.Check
            type="checkbox"
            label="我允许主办方使用我的参赛作品进行宣传推广 *"
            name="allowContentUsage"
            checked={formData.allowContentUsage}
            onChange={handleChange}
            isInvalid={!!errors.allowContentUsage}
            className="mb-2"
          />
          {errors.allowContentUsage && <div className="text-danger small">{errors.allowContentUsage}</div>}
        </div>
      </div>

      <div className="d-grid gap-2">
        <Button variant="primary" type="submit" size="lg">
          提交注册申请
        </Button>
      </div>
    </Form>
  );
};

export default InfluencerRegistrationForm;