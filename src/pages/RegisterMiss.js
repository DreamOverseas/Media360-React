import React, { useState } from "react";
import "../css/Forms.css";
// import { saveAs } from 'file-saver';

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;
const API_KEY_MI = "774cd7539026322d69c227b2ffec7810a8457c25b94357a655a6b911ad0f4bcbb42a0487cad1cb5f58483118b65e4ff13e120960a186110ef2a2835c1c8a679922f1b37d8e2baa37fcf80d05b899be4cb07d8940ad2f9044abd0667b935e332c0521104490af9c9497c0e2116be875da51d41621bd354f632e36278e39238be7";

const RegisterMiss = () => {
  const [formData, setFormData] = useState({
    Name_zh: '',
    Name_en: '',
    OccupationNow: '',
    OccupationHoped: '',
    CompanyOrSchool: '',
    Education: '',
    MajorStudied: '',
    Age: '',
    Height: '',
    Weight: '',
    Talent: '',
    Nationality: '',
    IDType: '',
    IDNumber: '',
    Phone: '',
    WechatID: '',
    Email: '',
    Company: '',
    SocialMediaAccounts: [{ Platform: '', Fans: '' }],
    Gallery: []
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setErrors({ ...errors, Gallery: '最多上传5张图片' });
    } else {
      setFormData({ ...formData, Gallery: files });
      setErrors({ ...errors, Gallery: '' });
    }
  };

  const handleSocialMediaChange = (index, e) => {
    const { name, value } = e.target;
    const newAccounts = [...formData.SocialMediaAccounts];
    newAccounts[index][name] = value;
    setFormData({ ...formData, SocialMediaAccounts: newAccounts });
  };

  const addSocialMedia = () => {
    setFormData({
      ...formData,
      SocialMediaAccounts: [...formData.SocialMediaAccounts, { Platform: '', Fans: '' }]
    });
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'Name_zh', 'Name_en', 'Age', 'Height', 'Weight', 'Talent',
      'Nationality', 'IDType', 'IDNumber', 'Phone', 'WechatID', 'Email'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = '请填写此项';
      }
    });

    if (formData.Gallery.length === 0) {
      newErrors.Gallery = '请您上传至少一张图片';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before processing
    if (!validateForm()) {
      return;
    }

    // Step 1: Upload files to Media Library
    const uploadedImageUrls = [];
    for (let i = 0; i < formData.Gallery.length; i++) {
      const file = formData.Gallery[i];
      const formDataToUpload = new FormData();
      formDataToUpload.append('files', file);

      try {
        const uploadResponse = await fetch(`${BACKEND_HOST}/api/upload`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${API_KEY_MI}`,
          },
          body: formDataToUpload,
        });

        const uploadResult = await uploadResponse.json();
        if (uploadResponse.ok && uploadResult.length > 0) {
          // Push the image URL into the array
          uploadedImageUrls.push(uploadResult[0].url);
        } else {
          console.error('Failed to upload image:', uploadResult);
          alert('图片上传失败，请重试');
          return;
        }
      } catch (error) {
        console.error('Error during file upload:', error);
        alert('图片上传时出现错误');
        return;
      }
    }

    // Step 2: Create RegisteredMiss with image URLs in Gallery and wrap it in `data`
    const finalFormData = {
      Name_zh: formData.Name_zh,
      Name_en: formData.Name_en,
      OccupationNow: formData.OccupationNow,
      OccupationHoped: formData.OccupationHoped,
      OccupatedPlace: formData.CompanyOrSchool,
      Education: formData.Education,
      MajorStudied: formData.MajorStudied,
      Age: formData.Age,
      Height: formData.Height,
      Weight: formData.Weight,
      Talent: formData.Talent,
      IDInfo: {
        Nationality: formData.Nationality,
        Type: formData.IDType,
        Number: formData.IDNumber
      },
      Phone: formData.Phone,
      WechatID: formData.WechatID,
      Email: formData.Email,
      Company: formData.Company,
      MediaAccounts: formData.SocialMediaAccounts,
      Gallery: uploadedImageUrls.map((url) => ({ url })),
      Location: formData.Location
    };

    // // Output finalFormData to a file
    // const finalFormDataString = JSON.stringify({ data: finalFormData }, null, 2); // Convert to JSON string
    // const blob = new Blob([finalFormDataString], { type: 'application/json' }); // Create a Blob object
    // saveAs(blob, 'finalFormData.json'); // Save the file as finalFormData.json

    try {
      const response = await fetch(`${BACKEND_HOST}/api/registered-misses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY_MI}`,
        },
        body: JSON.stringify({ data: finalFormData }),
      });

      const result = await response.json();
      if (response.ok) {
        alert('表单提交成功，感谢您的耐心！');
      } else {
        alert('提交失败，请稍后重试...');
        console.log(result);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };


  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        <div className="col-auto">
          <img
            src="/miss_reg_form/MissUniverse.png"
            alt="MissUniverse"
            style={{ height: '140px', width: 'auto' }}
          />
        </div>
        <div className="col">
          <h2 className="text-center" style={{ fontSize: '36px', color: 'skyblue' }}>
            第73届环球小姐中国区大赛澳洲赛区-墨尔本2024
          </h2>
        </div>
      </div>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            {/* 中文姓名 */}
            <div className="form-group">
              <label>中文姓名*</label>
              <input
                type="text"
                name="Name_zh"
                className="form-control"
                value={formData.Name_zh}
                onChange={handleInputChange}
                required
              />
              {errors.Name_zh && <small className="text-danger">{errors.Name_zh}</small>}
            </div>
          </div>
          <div className="col">
            {/* 英文姓名 */}
            <div className="form-group">
              <label>英文姓名*</label>
              <input
                type="text"
                name="Name_en"
                className="form-control"
                value={formData.Name_en}
                onChange={handleInputChange}
                required
              />
              {errors.Name_en && <small className="text-danger">{errors.Name_en}</small>}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            {/* 年龄 */}
            <div className="form-group">
              <label>年龄*</label>
              <input
                type="number"
                name="Age"
                className="form-control"
                value={formData.Age}
                onChange={handleInputChange}
                required
              />
              {errors.Age && <small className="text-danger">{errors.Age}</small>}
            </div>
          </div>
          <div className="col">
            {/* 身高 */}
            <div className="form-group">
              <label>身高（cm）*</label>
              <input
                type="number"
                name="Height"
                className="form-control"
                value={formData.Height}
                onChange={handleInputChange}
                required
              />
              {errors.Height && <small className="text-danger">{errors.Height}</small>}
            </div>
          </div>
          <div className="col">
            {/* 体重 */}
            <div className="form-group">
              <label>体重（kg）*</label>
              <input
                type="number"
                name="Weight"
                className="form-control"
                value={formData.Weight}
                onChange={handleInputChange}
                required
              />
              {errors.Weight && <small className="text-danger">{errors.Weight}</small>}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            {/* 手机号 */}
            <div className="form-group">
              <label>手机号*</label>
              <input
                type="phone"
                name="Phone"
                className="form-control"
                value={formData.Phone}
                onChange={handleInputChange}
                required
              />
              {errors.Phone && <small className="text-danger">{errors.Phone}</small>}
            </div>
          </div>
          <div className="col">
            {/* 邮箱 */}
            <div className="form-group">
              <label>邮箱*</label>
              <input
                type="email"
                name="Email"
                className="form-control"
                value={formData.Email}
                onChange={handleInputChange}
                required
              />
              {errors.Email && <small className="text-danger">{errors.Email}</small>}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col">
            {/* 国籍 */}
            <div className="form-group">
              <label>ID证件国籍*</label>
              <input
                type="text"
                name="Nationality"
                className="form-control"
                value={formData.Nationality}
                onChange={handleInputChange}
                required
              />
              {errors.Nationality && <small className="text-danger">{errors.Nationality}</small>}
            </div>
          </div>
          <div className="col">
            {/* ID证件类型 */}
            <div className="form-group">
              <label>ID证件类型*</label>
              <input
                type="text"
                name="IDType"
                className="form-control"
                value={formData.IDType}
                onChange={handleInputChange}
                required
              />
              {errors.IDType && <small className="text-danger">{errors.IDType}</small>}
            </div>
          </div>
        </div>

        {/* 居住地 */}
        <div className="form-group">
          <label>居住地*</label>
          <input
            type="text"
            name="Location"
            className="form-control"
            value={formData.Location}
            onChange={handleInputChange}
            required
          />
          {errors.Location && <small className="text-danger">{errors.Location}</small>}
        </div>

        {/* ID证件号码 */}
        <div className="form-group">
          <label>ID证件号码*</label>
          <input
            type="text"
            name="IDNumber"
            className="form-control"
            value={formData.IDNumber}
            onChange={handleInputChange}
            required
          />
          {errors.IDNumber && <small className="text-danger">{errors.IDNumber}</small>}
        </div>

        <div className="row">
          <div className="col">
            {/* 目前职业 */}
            <div className="form-group">
              <label>目前职业</label>
              <input
                type="text"
                name="OccupationNow"
                className="form-control"
                value={formData.OccupationNow}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col">
            {/* 希望职业 */}
            <div className="form-group">
              <label>希望职业</label>
              <input
                list="OccupationHopedOptions"
                name="OccupationHoped"
                className="form-control"
                value={formData.OccupationHoped}
                onChange={handleInputChange}
              />
              <datalist id="OccupationHopedOptions">
                <option value="跨国MCN公司" />
                <option value="传媒公司" />
                <option value="金融公司" />
                <option value="市场营销公司" />
                <option value="地产公司" />
                <option value="私人俱乐部" />
                <option value="生态营地管理" />
                <option value="餐厅" />
                <option value="建筑" />
                <option value="技工" />
                <option value="其他" />
              </datalist>
              {errors.OccupationHoped && <small className="text-danger">{errors.OccupationHoped}</small>}
            </div>
          </div>
        </div>

        {/* 工作单位/学校 */}
        <div className="form-group">
          <label>工作单位/学校</label>
          <input
            type="text"
            name="CompanyOrSchool"
            className="form-control"
            value={formData.CompanyOrSchool}
            onChange={handleInputChange}
          />
        </div>

        <div className="row">
          <div className="col">
            {/* 学历 */}
            <div className="form-group">
              <label>学历</label>
              <input
                type="text"
                name="Education"
                className="form-control"
                value={formData.Education}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="col">
            {/* 专业 */}
            <div className="form-group">
              <label>专业</label>
              <input
                type="text"
                name="MajorStudied"
                className="form-control"
                value={formData.MajorStudied}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* 才艺 */}
        <div className="form-group">
          <label>才艺*</label>
          <input
            type="text"
            name="Talent"
            className="form-control"
            value={formData.Talent}
            onChange={handleInputChange}
            placeholder="舞蹈/歌唱/乐器/书法/表演等都可以"
            required
          />
          {errors.Talent && <small className="text-danger">{errors.Talent}</small>}
        </div>

        {/* 微信号 */}
        <div className="form-group">
          <label>微信号*</label>
          <input
            type="text"
            name="WechatID"
            className="form-control"
            value={formData.WechatID}
            onChange={handleInputChange}
            required
          />
          {errors.WechatID && <small className="text-danger">{errors.WechatID}</small>}
        </div>

        {/* 自媒体账号 */}
        <div className="form-group">
          <label>自媒体账号</label>
          {formData.SocialMediaAccounts.map((account, index) => (
            <div key={index} className="d-flex">
              <input
                list="MediaPlatformOptions"
                type="text"
                name="Platform"
                placeholder="平台"
                className="form-control mr-2"
                value={account.Platform}
                onChange={(e) => handleSocialMediaChange(index, e)}
              />
              <datalist id="MediaPlatformOptions">
                <option value="抖音" />
                <option value="小红书" />
                <option value="快手" />
                <option value="微博" />
                <option value="TikTok" />
                <option value="Instagram" />
                <option value="X(Twitter)" />
                <option value="Youtube" />
              </datalist>
              <input
                type="number"
                name="Fans"
                placeholder="粉丝数"
                className="form-control"
                value={account.Fans}
                onChange={(e) => handleSocialMediaChange(index, e)}
              />
            </div>
          ))}
          <button type="button" className="btn btn-secondary mt-2" onClick={addSocialMedia}>
            添加自媒体账号
          </button>
        </div>

        {/* 上传照片 */}
        <div className="form-group">
          <label>上传照片*（最多 5 张，1MB 限制）</label>
          <input
            type="file"
            className="form-control-file"
            name="Gallery"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />
          {errors.Gallery && <small className="text-danger">{errors.Gallery}</small>}
        </div>

        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary" style={{ width: '200px' }}>
            提交
          </button>
        </div>
        <br />
      </form>
      <div class="row">
        <div class="col text-center">
          <p>联合主办:</p>
          <img src="/miss_reg_form/MissInternational.png" alt="Miss International" class="sponsor-logo" />
          <img src="/miss_reg_form/MissWeb3.png" alt="Miss Web3" class="sponsor-logo" />
        </div>

        <div class="col text-center">
          <p>冠名赞助:</p>
          <img src="/miss_reg_form/Greeness.png" alt="Greeness" class="sponsor-logo" />
        </div>

        <div class="col text-center">
          <p>授权方:</p>
          <img src="/miss_reg_form/NewShell.png" alt="New Shell" class="sponsor-logo" />
        </div>
      </div>
    </div>
  );
}

export default RegisterMiss;
