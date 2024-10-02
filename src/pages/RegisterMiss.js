import React, { useState } from "react";
import "../css/Forms.css";
import axios from 'axios';
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
// import { saveAs } from 'file-saver';

// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;
const API_KEY_MI = "774cd7539026322d69c227b2ffec7810a8457c25b94357a655a6b911ad0f4bcbb42a0487cad1cb5f58483118b65e4ff13e120960a186110ef2a2835c1c8a679922f1b37d8e2baa37fcf80d05b899be4cb07d8940ad2f9044abd0667b935e332c0521104490af9c9497c0e2116be875da51d41621bd354f632e36278e39238be7";

// Load Backend Host for API calls
const EMAIL_NOTIFY = process.env.REACT_APP_MISS_NOTIFICATION;

const initialFormData = {
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
  SocialMediaAccounts: [],
  Gallery: []
};


const RegisterMiss = () => {
  const [formData, setFormData] = useState(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      setErrors({ ...errors, Gallery: '最多上传5张图片 (Max images allowed: 5)' });
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

  const removeSocialMedia = (index) => {
    const newAccounts = [...formData.SocialMediaAccounts];
    newAccounts.splice(index, 1);
    setFormData({ ...formData, SocialMediaAccounts: newAccounts });
  };

  const validateForm = () => {
    const newErrors = {};
    const requiredFields = [
      'Name_zh', 'Name_en', 'Age', 'Height', 'Weight', 'Talent',
      'Nationality', 'IDType', 'IDNumber', 'Phone', 'WechatID', 'Email'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = t("miss_reg_please_fill");
      }
    });

    if (formData.Gallery.length === 0) {
      newErrors.Gallery = t("miss_reg_please_upload");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Function that handles email notification
   */
  const notify_by_email = async () => {
    setErrors('');
    const name = formData.Name_zh;
    const email = formData.Email;
    try {
      await axios.post(EMAIL_NOTIFY, {
        name,
        email
      });
      setErrors('');
    } catch (error) {
      setErrors(error);
      alert(`${error}, Email not sent... But you are recorded if no other errors occured!`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form before processing
    if (!validateForm()) {
      return;
    }
    setIsSubmitting(true);

    // Step 1: Upload files to Media Library
    const uploadedImageUrls = [];
    const uploadedImageIds = [];
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
          uploadedImageIds.push(uploadResult[0].id);
        } else {
          console.error('Failed to upload image:', uploadResult);
          alert('图片上传失败，请重试 (Please retry image uploading.)');
          setIsSubmitting(false);
          return;
        }
      } catch (error) {
        console.error('Error during file upload:', error);
        alert('图片上传时出现错误 (Error on image uploading, mind the maximum image size will be 5M)');
        setIsSubmitting(false);
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
      Gallery: uploadedImageIds.map((id) => ({ Photo: id })),
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
        notify_by_email();
        alert(t("miss_reg_success"));
        setFormData(initialFormData); // Clear out on submit
      } else {
        alert(t("miss_reg_fail"));
        console.log(result);
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Language change migrated from Navbar
  const { t, i18n } = useTranslation();
  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    Cookies.set("i18next", lng, { expires: 7 });
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
          <h2 className="text-center miss-reg-form-title">
            {t("miss_reg_contest_title")}
          </h2>
        </div>
        <div className="col-auto">
          <select id="language-select" onChange={(e) => changeLanguage(e.target.value)}>
            <option value="en">EN</option>
            <option value="zh">ZH</option>
          </select>
        </div>
      </div>
      <br />
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>{t("miss_reg_name_zh")}</label>
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
            <div className="form-group">
              <label>{t("miss_reg_name_en")}</label>
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
            <div className="form-group">
              <label>{t("miss_reg_age")}</label>
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
            <div className="form-group">
              <label>{t("miss_reg_height")}</label>
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
            <div className="form-group">
              <label>{t("miss_reg_weight")}</label>
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
            <div className="form-group">
              <label>{t("miss_reg_phone")}</label>
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
            <div className="form-group">
              <label>{t("miss_reg_email")}</label>
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
            <div className="form-group">
              <label>{t("miss_reg_id_nationality")}</label>
              <input
                list="IDNationality"
                type="text"
                name="Nationality"
                className="form-control"
                value={formData.Nationality}
                onChange={handleInputChange}
                required
              />
              <datalist id="IDNationality">
                <option value="中国(China)" />
                <option value="澳大利亚(Australia)" />
              </datalist>
              {errors.Nationality && <small className="text-danger">{errors.Nationality}</small>}
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>{t("miss_reg_id_type")}</label>
              <input
                list="IDType"
                type="text"
                name="IDType"
                className="form-control"
                value={formData.IDType}
                onChange={handleInputChange}
                required
              />
              <datalist id="IDType">
                <option value="护照(Passport)" />
                <option value="澳洲驾照(AU Driver's Licence)" />
                <option value="国际驾照(International Driver's Licence)" />
                <option value="海员执照(VIC Marine Licence)" />
                <option value="其他种类(Other Genre)" />
              </datalist>
              {errors.IDType && <small className="text-danger">{errors.IDType}</small>}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>{t("miss_reg_id_number")}</label>
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

        <div className="form-group">
          <label>{t("miss_reg_location")}</label>
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

        <div className="row">
          <div className="col">
            <div className="form-group">
              <label>{t("miss_reg_occupation_now")}</label>
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
            <div className="form-group">
              <label>{t("miss_reg_occupation_hoped")}</label>
              <input
                list="OccupationHopedOptions"
                name="OccupationHoped"
                className="form-control"
                value={formData.OccupationHoped}
                onChange={handleInputChange}
              />
              <datalist id="OccupationHopedOptions">
                <option value="跨国MCN公司(International MCN)" />
                <option value="传媒公司(Media)" />
                <option value="金融公司(Finace)" />
                <option value="市场营销公司(Marketing)" />
                <option value="地产公司(Real Estate)" />
                <option value="私人俱乐部(Private Club)" />
                <option value="生态营地管理(Eco-campsite Management)" />
                <option value="餐厅(Restaurant)" />
                <option value="建筑(Builder)" />
                <option value="技工(Technitian)" />
                <option value="其他(Others)" />
              </datalist>
              {errors.OccupationHoped && <small className="text-danger">{errors.OccupationHoped}</small>}
            </div>
          </div>
        </div>

        <div className="form-group">
          <label>{t("miss_reg_company_school")}</label>
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
            <div className="form-group">
              <label>{t("miss_reg_education")}</label>
              <input
                list="EducationLvl"
                type="text"
                name="Education"
                className="form-control"
                value={formData.Education}
                onChange={handleInputChange}
              />
              <datalist id="EducationLvl">
                <option value="专科(Collage)" />
                <option value="本科(Bachelor)" />
                <option value="研究生(Masters)" />
                <option value="博士(PhD)" />
              </datalist>
            </div>
          </div>
          <div className="col">
            <div className="form-group">
              <label>{t("miss_reg_major")}</label>
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

        <div className="form-group">
          <label>{t("miss_reg_talent")}</label>
          <input
            type="text"
            name="Talent"
            className="form-control"
            value={formData.Talent}
            onChange={handleInputChange}
            required
          />
          {errors.Talent && <small className="text-danger">{errors.Talent}</small>}
        </div>

        <div className="form-group">
          <label>{t("miss_reg_wechat")}</label>
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

        <div className="form-group">
          <label>{t("miss_reg_social_media")}</label>
          {formData.SocialMediaAccounts.map((account, index) => (
            <div key={index} className="d-flex align-items-center mb-2">
              <input
                list="MediaPlatformOptions"
                type="text"
                name="Platform"
                placeholder="平台(Platform)"
                className="form-control mr-2"
                value={account.Platform}
                onChange={(e) => handleSocialMediaChange(index, e)}
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
              <input
                type="number"
                name="Fans"
                placeholder="粉丝数(Fan Number)"
                className="form-control mr-2"
                value={account.Fans}
                onChange={(e) => handleSocialMediaChange(index, e)}
              />
              <button
                type="button"
                className="btn btn-danger"
                onClick={() => removeSocialMedia(index)}
              >
                <i className="bi bi-dash"></i>
              </button>
            </div>
          ))}
          <button type="button" className="btn btn-secondary mt-2" onClick={addSocialMedia}>
          {t("miss_reg_add_media")}
          </button>
        </div>

        <div className="form-group">
          <label>{t("miss_reg_photo_upload")}</label>
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
          <button type="submit" className="btn btn-primary mt-3" style={{ width: '200px' }} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                {t("miss_reg_submitting")}
              </>
            ) : (
              t("miss_reg_submit")
            )}
          </button>
        </div>
        <br />
      </form>
      <div class="row">
        <div class="col text-center">
          <p>{t("miss_reg_joint_organizers")}</p>
          <img src="/miss_reg_form/MissInternational.png" alt="Miss International" class="sponsor-logo" />
          <img src="/miss_reg_form/MissWeb3.png" alt="Miss Web3" class="sponsor-logo" />
        </div>

        <div class="col text-center">
          <p>{t("miss_reg_title_sponsor")}</p>
          <img src="/miss_reg_form/Greeness.png" alt="Greeness" class="sponsor-logo" />
        </div>

        <div class="col text-center">
          <p>{t("miss_reg_authorization")}</p>
          <img src="/miss_reg_form/NewShell.png" alt="New Shell" class="sponsor-logo" />
        </div>
      </div>
    </div>
  );
}

export default RegisterMiss;
