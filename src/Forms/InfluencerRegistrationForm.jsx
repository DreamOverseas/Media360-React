import React, { useState, useRef } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

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
  pastCollaborations: "",
  // portfolioLinks: "",
  // portfolioFiles: [],
  // personalIntroduction: "",
  // personalImages: [],

  // 大赛相关信息
  preferredProductCategories: [],
  // acceptedPromotionFormats: [], // checkbox形式
  training: "",
  additionalRequirements: "",
  agreeToRules: false, // checkbox
  allowContentUsage: false, // checkbox
  from: "360 Influencer Contest influencer registration"
};

const InfluencerRegistrationForm = ({ onSubmit }) => {
  const fileInputRef = useRef(null);
  const personalImagesRef = useRef(null);
  const [formData, setFormData] = useState(initialInfluencerFormData);
  const [errors, setErrors] = useState({});

  const { t } = useTranslation();

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

  const handleCheckbox = (value) => {
    setFormData({
      ...formData,
      training: value,
    });
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
    if (!formData.training || (formData.training !== 'need' && formData.training !== 'no_need')) {
      newErrors.training = '请选择是否需要培训服务';
    }

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
        <h2 className="text-primary">{t("whds_form_inf.title")}</h2>
        <p className="text-muted">{t("whds_form_inf.subtitle")}</p>
      </div>

      {/* 基本信息 */}
      <div className="mb-4">
        <h4>{t("whds_form_inf.basic_info.title")}</h4>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>{t("whds_form_inf.basic_info.name")}</Form.Label>
              <Form.Control
                type="text"
                name="name"
                placeholder={t("whds_form_inf.basic_info.name_ph")}
                value={formData.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>{t("whds_form_inf.basic_info.gender")}</Form.Label>
              <Form.Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                isInvalid={!!errors.gender}
              >
                <option value="">{t("whds_form_inf.basic_info.gender_select")}</option>
                <option value="Male">{t("whds_form_inf.basic_info.gender_male")}</option>
                <option value="Female">{t("whds_form_inf.basic_info.gender_female")}</option>
                <option value="Others">{t("whds_form_inf.basic_info.gender_other")}</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.gender}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>{t("whds_form_inf.basic_info.age")}</Form.Label>
              <Form.Control
                type="number"
                name="age"
                placeholder={t("whds_form_inf.basic_info.age_ph")}
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
              <Form.Label>{t("whds_form_inf.basic_info.phone")}</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder={t("whds_form_inf.basic_info.phone_ph")}
                value={formData.phone}
                onChange={handleChange}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>{t("whds_form_inf.basic_info.email")}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={t("whds_form_inf.basic_info.email_ph")}
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
              <Form.Label>{t("whds_form_inf.basic_info.location")}</Form.Label>
              <Form.Control
                type="text"
                name="location"
                placeholder={t("whds_form_inf.basic_info.location_ph")}
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
        <h4>{t("whds_form_inf.social_media.title")}</h4>
        <Form.Group className="mb-3">
          <Form.Label>{t("whds_form_inf.social_media.account")}</Form.Label>
          {formData.socialMedia.map((account, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <Form.Control
                type="text"
                name="Platform"
                placeholder={t("whds_form_inf.social_media.platform_ph")}
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
                placeholder={t("whds_form_inf.social_media.nickname_ph")}
                className="me-2"
                value={account.PlatformNickname}
                onChange={(e) => handleSocialMediaChange(index, e)}
                style={{ flex: 1 }}
              />
              <Form.Control
                type="number"
                name="Fans"
                placeholder={t("whds_form_inf.social_media.fans_ph")}
                className="me-2"
                value={account.Fans}
                onChange={(e) => handleSocialMediaChange(index, e)}
                style={{ flex: 1 }}
              />
              <Button variant="danger" size="sm" onClick={() => removeSocialMedia(index)}>
                <i className="bi bi-dash"></i>
              </Button>
            </div>
          ))}

          <Button variant="secondary" size="sm" className="mt-2" onClick={addSocialMedia}>
            {t("whds_form_inf.social_media.add_account")}
          </Button>

          {errors.socialMedia && (
            <div className="text-danger small mt-2">{errors.socialMedia}</div>
          )}
        </Form.Group>
      </div>

      {/* 内容及经验 */}
      <div className="mb-4">
        <h4>{t("whds_form_inf.experience.title")}</h4>
        <Form.Group className="mb-3">
          <Form.Label>{t("whds_form_inf.experience.past")}</Form.Label>
          <Form.Control
            as="textarea"
            name="pastCollaborations"
            rows={3}
            placeholder={t("whds_form_inf.experience.past_ph")}
            value={formData.pastCollaborations}
            onChange={handleChange}
          />
        </Form.Group>
      </div>

      {/* 大赛相关信息 */}
      <div className="mb-4">
        <h5>{t("whds_form_inf.training.title")}</h5>
        <Form.Group className="mb-3">
          <Form.Label>{t("whds_form_inf.training.need_label")}</Form.Label>
          <div className={`border rounded p-3 ${errors.training ? 'border-danger' : ''}`}>
            <Form.Check
              type="radio"
              name="training"
              label={t("whds_form_inf.training.need")}
              value="need"
              checked={formData.training === "need"}
              onChange={(e) => handleCheckbox(e.target.value)}
              className="mb-2"
            />
            <Form.Check
              type="radio"
              name="training"
              label={t("whds_form_inf.training.no_need")}
              value="no_need"
              checked={formData.training === "no_need"}
              onChange={(e) => handleCheckbox(e.target.value)}
              className="mb-2"
            />
          </div>
          {errors.training && <div className="text-danger small mt-2">{errors.training}</div>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("whds_form_inf.categories.title")}</Form.Label>
          <div className={`border rounded p-3 ${errors.preferredProductCategories ? 'border-danger' : ''}`}>
            {[
              { value: "food_beverage", label: t("whds_form_inf.categories.food_beverage") },
              { value: "cosmetics", label: t("whds_form_inf.categories.cosmetics") },
              { value: "travel", label: t("whds_form_inf.categories.travel") },
              { value: "fashion", label: t("whds_form_inf.categories.fashion") },
              { value: "electronics", label: t("whds_form_inf.categories.electronics") },
              { value: "home", label: t("whds_form_inf.categories.home") },
              { value: "health", label: t("whds_form_inf.categories.health") },
              { value: "education", label: t("whds_form_inf.categories.education") },
              { value: "finance", label: t("whds_form_inf.categories.finance") },
              { value: "entertainment", label: t("whds_form_inf.categories.entertainment") },
              { value: "automotive", label: t("whds_form_inf.categories.automotive") },
              { value: "mother_baby", label: t("whds_form_inf.categories.mother_baby") },
              { value: "othera", label: t("whds_form_inf.categories.other") },
            ].map((category) => (
              <Form.Check
                key={category.value}
                type="checkbox"
                label={category.label}
                value={category.value}
                checked={formData.preferredProductCategories.includes(category.value)}
                onChange={(e) => handleCheckboxChange(e, "preferredProductCategories")}
                className="mb-2 me-4 d-inline-block"
              />
            ))}
          </div>
          {errors.preferredProductCategories && (
            <div className="text-danger small">{errors.preferredProductCategories}</div>
          )}
        </Form.Group>

        <div className="mb-3">
          <h5>{t("whds_form_inf.endorsement.title")}</h5>
          <Form.Group className="mb-3">
            <Form.Control
              as="textarea"
              name="additionalRequirements"
              rows={3}
              placeholder={t("whds_form_inf.endorsement.placeholder")}
              value={formData.additionalRequirements}
              onChange={handleChange}
            />
          </Form.Group>
        </div>

        <div className="mb-3">
          <h5>{t("whds_form_inf.commitment.title")}</h5>
          <Form.Check
            type="checkbox"
            label={t("whds_form_inf.commitment.rules")}
            name="agreeToRules"
            checked={formData.agreeToRules}
            onChange={handleChange}
            isInvalid={!!errors.agreeToRules}
            className="mb-2"
          />
          {errors.agreeToRules && <div className="text-danger small">{errors.agreeToRules}</div>}

          <Form.Check
            type="checkbox"
            label={t("whds_form_inf.commitment.usage")}
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
          {t("whds_form_inf.submit")}
        </Button>
      </div>
    </Form>
  );
};

export default InfluencerRegistrationForm;