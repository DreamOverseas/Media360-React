import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Image, Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";
import MerchantUploadForm from "../components/MerchantUploadForm";
import "../css/MerchantPromotion.css"


const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;
const API_KEY_MERCHANT_UPLOAD = "5ee3ef11e0d3b22e9f2ac8c5b6f3a132121b6f4394c5cc8c3ecea1ea0bf4f1f76890f779555c96d3812008a32d6c3e25785008ae7a1ff176bfa96fefbea0ae36bbc6502c8bfcf46062e242adad589c6c68d19fa53507363447e865326ab467f96032e59630553003c7dbab360541d1596a6d274a98c4998a141ac4afe90a36ca";
const MERCHANT_UPLOAD_EMAIL_NOTIFY = process.env.REACT_APP_360_MEDIA_MERCHANT_UPLOAD_NOTIFICATION;

const MerchantPromotion = () => {
    const { t } = useTranslation();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleUpload = () => setShow(true);
    const handleSubmit = async (formData) => {

      // Step 1: Upload files to Media Library
    const uploadedPortraitUrls = [];
    const uploadedPortraitIds = [];
    const uploadedProductImageUrls = [];
    const uploadedProductImageIds = [];
    const uploadedRecommendedPortraitUrls = [];
    const uploadedRecommendedPortraitIds = [];
    if (formData.portrait.length > 0) {
      for (let i = 0; i < formData.portrait.length; i++) {
        const file = formData.portrait[i];
        const formDataToUpload = new FormData();
        formDataToUpload.append('files', file);

        try {
          const uploadResponse = await fetch(`${BACKEND_HOST}/api/upload`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${API_KEY_MERCHANT_UPLOAD}`,
            },
            body: formDataToUpload,
          });

          const uploadResult = await uploadResponse.json();
          if (uploadResponse.ok && uploadResult.length > 0) {
            // Push the image URL into the array
            uploadedPortraitUrls.push(uploadResult[0].url);
            uploadedPortraitIds.push(uploadResult[0].id);
          } else {
            console.error('Failed to upload image:', uploadResult);
            alert('图片上传失败，请重试 (Please retry image uploading.)');
            return;
          }
        } catch (error) {
          console.error('Error during file upload:', error);
          alert('图片上传时出现错误 (Error on image uploading, mind the maximum image size will be 5M)');
          return;
        }
      }  
    }

    if (formData.product_image.length > 0) {
      for (let i = 0; i < formData.product_image.length; i++) {
        const file = formData.product_image[i];
        const formDataToUpload = new FormData();
        formDataToUpload.append('files', file);

        try {
          const uploadResponse = await fetch(`${BACKEND_HOST}/api/upload`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${API_KEY_MERCHANT_UPLOAD}`,
            },
            body: formDataToUpload,
          });

          const uploadResult = await uploadResponse.json();
          if (uploadResponse.ok && uploadResult.length > 0) {
            // 保存上传后返回的 URL 和 id
            uploadedProductImageUrls.push(uploadResult[0].url);
            uploadedProductImageIds.push(uploadResult[0].id);
          } else {
            console.error('Failed to upload product image:', uploadResult);
            alert('产品图片上传失败，请重试 (Please retry product image uploading.)');
            return;
          }
        } catch (error) {
          console.error('Error during product image upload:', error);
          alert('产品图片上传时出现错误 (Error on product image uploading, mind the maximum image size will be 5M)');
          return;
        }
      }
    }

    // 上传推荐人头像
    if (formData.recommended_person_portrait.length > 0) {
      for (let i = 0; i < formData.recommended_person_portrait.length; i++) {
        const file = formData.recommended_person_portrait[i];
        const formDataToUpload = new FormData();
        formDataToUpload.append('files', file);

        try {
          const uploadResponse = await fetch(`${BACKEND_HOST}/api/upload`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${API_KEY_MERCHANT_UPLOAD}`,
            },
            body: formDataToUpload,
          });

          const uploadResult = await uploadResponse.json();
          if (uploadResponse.ok && uploadResult.length > 0) {
            // 保存上传后返回的 URL 和 id
            uploadedRecommendedPortraitUrls.push(uploadResult[0].url);
            uploadedRecommendedPortraitIds.push(uploadResult[0].id);
          } else {
            console.error('Failed to upload recommended person portrait:', uploadResult);
            alert('推荐代言人头像上传失败，请重试 (Please retry recommended person portrait uploading.)');
            return;
          }
        } catch (error) {
          console.error('Error during recommended person portrait upload:', error);
          alert('推荐代言人头像上传时出现错误 (Error on recommended person portrait uploading, mind the maximum image size will be 5M)');
          return;
        }
      }
    }

    // Step 2: Create RegisteredMiss with image URLs in Gallery and wrap it in `data`
    const formatArrayField = (arr) => (arr.length > 0 ? arr.map((id) => ({ id })) : undefined);

    const formatEnumField = (value) => (value === "" ? null : value);

    const cleanData = (data) => {
        return Object.fromEntries(
            Object.entries(data).filter(([key, value]) => {
                if (Array.isArray(value)) return value.length > 0;
                if (value === "") return false;
                if (value === undefined) return false;
                return true;
            })
        );
    };

    const finalFormData = cleanData({
        First_Name: formData.firstName,
        Last_Name: formData.lastName,
        Email: formData.email,
        Phone: formData.phone,
        Person_Title: formData.person_title,
        Person_Type: formatEnumField(formData.person_type),
        Person_Introduction: formData.person_introduction,
        Portrait: formatArrayField(uploadedPortraitIds),
        Product_Introduction: formData.product_introduction,
        Product_Image: formatArrayField(uploadedProductImageIds),
        Recommended_Person_First_Name: formData.recommended_person_firstName,
        Recommended_Person_Last_Name: formData.recommended_person_lastName,
        Recommended_Person_Email: formData.recommended_person_email,
        Recommended_Person_Phone: formData.recommended_person_phone,
        Recommended_Person_Title: formData.recommended_person_title,
        Recommended_Person_Type: formatEnumField(formData.recommended_person_type),
        Recommended_Person_Introduction: formData.recommended_person_introduction,
        Recommended_Person_Portrait: formatArrayField(uploadedRecommendedPortraitIds),
    });

    try {
      const response = await fetch(`${BACKEND_HOST}/api/merchant-form-uploads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${API_KEY_MERCHANT_UPLOAD}`,
        },
        body: JSON.stringify({data: finalFormData}),
      });

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        const firstName = finalFormData.First_Name;
        const lastName = finalFormData.Last_Name;
        const email = finalFormData.Email;
        try {
          await axios.post(MERCHANT_UPLOAD_EMAIL_NOTIFY, {
            firstName,
            lastName,
            email
          });
        } catch (error) {
          alert(`${error}, Email not sent... But you are recorded if no other errors occured!`);
        }
        alert(t("上传成功"));
      } else {
        alert(t("上传失败，请稍后再试"));
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    } 
    handleClose();
  };

  const PackageTabComponent = () => {
    const defaultTab = "enterprise_package"; 
    const [activeTab, setActiveTab] = useState(defaultTab);
    
      const tabs = [
        { key: "enterprise_package", label: t("企业定制套餐") },
        { key: "premium_package", label: t("卓越尊享套餐") },
        { key: "elite_package", label: t("精英基础套餐") },
      ];
    
      const tabContent = {
        enterprise_package: (
          <div className="package-tab-content">
            <div className="package-info">
              <h5>{t("360传媒 企业定制策略套餐")}</h5>
              <h5>AU $5,500</h5>
              <h6>{t("我们提供12个月套餐包含以下服务")}</h6>
              <h6 className="basic-info-text">{t("基础服务")}</h6>
              <p>{t("（精英基础套餐服务和卓越尊享套餐服务均已包含）")}</p>
              {t("enterprise_package").split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              <h6>{t("额外服务")}</h6>
              {t("enterprise_package_extra").split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <Button className="merchant-funtion-btn">{t("即刻订购")}</Button>
          </div>
        ),
        premium_package: (
          <div className="package-tab-content">
            <div className="package-info">
              <h5>{t("360传媒 卓越尊享套餐")}</h5>
              <h5>AU $3,300</h5>
              <h6>{t("我们提供6个月套餐包含以下服务")}</h6>
              <h6 className="basic-info-text">{t("基础服务")}</h6>
              <p>{t("（精英基础套餐服务均已包含）")}</p>
              {t("premium_package").split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              <h6>{t("额外服务")}</h6>
              {t("premium_package_extra").split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <Button className="merchant-funtion-btn">{t("即刻订购")}</Button>
          </div>
        ),
        elite_package: (
          <div className="package-tab-content">
            <div className="package-info">
              <h5>{t("360传媒 精英基础套餐")}</h5>
              <h5>AU $990</h5>
              <h6>{t("我们提供6个月套餐包含以下服务")}</h6>
              {t("elite_package").split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            <Button className="merchant-funtion-btn">{t("即刻订购")}</Button>
          </div>
        ),
      };
    
      return (
        <div className="package-tab-container">
            <Row className="package-tab-row">
              {tabs.map((tab) => (
                <Col xs={4} key={tab.key} className="package-text-center">
                  <button
                    className={`package-tab-button ${activeTab === tab.key ? "active" : ""}`}
                    onClick={() => setActiveTab(tab.key)}
                  >
                    {tab.label}
                  </button>
                </Col>
              ))}
            </Row>
          <div className="tab-content-container">{tabContent[activeTab]}</div>
        </div>
      );
  };


    const FileUploadTabComponent = () => {
      const defaultTab = "portrait_info";
      const [activeTab, setActiveTab] = useState(defaultTab);
    
      // 选项卡信息
      const tabs = [
        { key: "portrait_info", label: t("人物肖像简介") },
        { key: "product_description", label: t("产品图文介绍") },
        { key: "video_format", label: t("视频格式") },
      ];
    
      // 选项卡内容
      const tabContent = {
        portrait_info: (
          <div className="media-tab-content">
            <div className="example-images">
              <Row>
                <Col xs={4}>
                  <Image src="/media-upload/example-2.png" alt={t("示例图片")} fluid />
                </Col>
                <Col xs={8}>
                  <Image src="/media-upload/example-1.png" alt={t("示例图片")} fluid />
                </Col>
              </Row>
              {t("portrait_info").split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        ),
        product_description: (
          <div className="media-tab-content">
            <Row>
                <Image src="/media-upload/product-example-1.png" alt={t("示例图片")} fluid />
                <Image src="/media-upload/product-example-2.png" alt={t("示例图片")} fluid />
              </Row>
            {t("product_specification").split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
          </div>
        ),
        video_format: (
          <div className="media-tab-content">
            {t("video_specification").split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
          </div>
        ),
      };
    
      return (
        <div className="media-tab-container">
          <Row className="media-tab-row">
            {tabs.map((tab) => (
              <Col xs={4} key={tab.key} className="media-text-center">
                <button
                  className={`media-tab-button ${activeTab === tab.key ? "active" : ""}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </button>
              </Col>
            ))}
          </Row>
          <div className="tab-content-container">{tabContent[activeTab]}</div>
        </div>
      );
    };

    
    return (
        <Container>
            <section>
                <h2>我们的服务</h2>
                <p>{t("merchant_text")}</p>
            </section>

            <section className="package-section">
                <h2>360传媒推广服务套餐</h2>
                <PackageTabComponent/>
            </section>

            <section>
                <h2>360传媒平台上传要求</h2>
                <FileUploadTabComponent/>
                <Button className="merchant-funtion-btn" onClick={handleUpload}>即刻上传资料</Button>


                <Modal show={show} onHide={handleClose} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>上传资料</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <MerchantUploadForm onSubmit={handleSubmit} />
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                      关闭
                    </Button>
                  </Modal.Footer>
                </Modal>
            </section>
            
        </Container>
    );
};
  
  export default MerchantPromotion;