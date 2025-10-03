import axios from "axios";
import React, { useState } from "react";
import { Col, Container, Row, Image, Button, Modal, Alert, Spinner } from "react-bootstrap";
import { useMediaQuery } from "react-responsive";
import { useTranslation } from "react-i18next";
// import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
import MerchantUploadForm from "../components/MerchantUploadForm.jsx";
import PayPalButton from "../components/PayPalButton.jsx";
import "../css/MerchantPromotion.css"


const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
const API_KEY_MERCHANT_UPLOAD = import.meta.env.VITE_API_KEY_MERCHANT_UPLOAD
const MERCHANT_UPLOAD_EMAIL_NOTIFY = import.meta.env.VITE_360_MEDIA_MERCHANT_UPLOAD_NOTIFICATION;
const DEBUG = import.meta.env.DEBUG;

const MerchantPromotion = () => {
  const { t } = useTranslation();
  const [show, setShow] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClose = () => setShow(false);
  const handleUpload = () => setShow(true);
  const onDesktop = useMediaQuery({ query: "(min-width: 768px)" });
  
  const renderSuccessModal = () => (
    <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>提交成功</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="success">您的资料已成功上传！</Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="success" onClick={() => setShowSuccessModal(false)}>
          关闭
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const renderErrorModal = () => (
    <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
      <Modal.Header closeButton>
        <Modal.Title>提交失败</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="danger">资料提交失败，请检查网络或稍后重试！</Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="danger" onClick={() => handleUpload()}>
          重试
        </Button>
        <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
          关闭
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const tabs = [
    { key: "enterprise_package", label: t("企业定制套餐") },
    { key: "premium_package", label: t("卓越尊享套餐") },
    { key: "elite_package", label: t("精英基础套餐") },
  ];


  const uploadFiles = async (files) => {
    if (!files || files.length === 0) return { urls: [], ids: [] };
  
    const uploadPromises = files.map(async (file) => {
      const formDataToUpload = new FormData();
      formDataToUpload.append("files", file);
  
      try {
        const uploadResponse = await fetch(`${BACKEND_HOST}/api/upload`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${API_KEY_MERCHANT_UPLOAD}`,
          },
          body: formDataToUpload,
        });
  
        const uploadResult = await uploadResponse.json();
        if (uploadResponse.ok && uploadResult.length > 0) {
          return { url: uploadResult[0].url, id: uploadResult[0].id };
        } else {
          console.error("Upload failed:", uploadResult);
          return null;
        }
      } catch (error) {
        console.error("Error during file upload:", error);
        return null;
      }
    });
  
    const uploadedFiles = (await Promise.all(uploadPromises)).filter(Boolean);
  
    return {
      urls: uploadedFiles.map((f) => f.url),
      ids: uploadedFiles.map((f) => f.id),
    };
  };
  
  const handleSubmit = async (formData) => {
  
    setLoading(true);
  
    const [portraitData, productImageData, recommendedPortraitData] = await Promise.all([
      uploadFiles(formData.portrait),
      uploadFiles(formData.product_image),
      uploadFiles(formData.recommended_person_portrait),
    ]);

    const cleanData = (data) =>
      Object.fromEntries(Object.entries(data).filter(([_, value]) => value && value.length > 0));

    const finalFormData = cleanData({
      First_Name: formData.firstName,
      Last_Name: formData.lastName,
      Email: formData.email,
      Phone: formData.phone,
      Person_Title: formData.person_title,
      Person_Type: formData.person_type || null,
      Person_Introduction: formData.person_introduction,
      Portrait: portraitData.ids,
      Product_Introduction: formData.product_introduction,
      Product_Image: productImageData.ids,
      Recommended_Person_First_Name: formData.recommended_person_firstName,
      Recommended_Person_Last_Name: formData.recommended_person_lastName,
      Recommended_Person_Email: formData.recommended_person_email,
      Recommended_Person_Phone: formData.recommended_person_phone,
      Recommended_Person_Title: formData.recommended_person_title,
      Recommended_Person_Type: formData.recommended_person_type || null,
      Recommended_Person_Introduction: formData.recommended_person_introduction,
      Recommended_Person_Portrait: recommendedPortraitData.ids,
      From: "360"
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
    if (DEBUG) console.log(result);
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
      setShowSuccessModal(true);
    } else {
      setShowErrorModal(true);
    }
  } catch (error) {
    console.error('Error during form submission:', error);
    setShowErrorModal(true);
  } 

  handleClose();
  setLoading(false);
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
            {/* <Link to={`/products/360-media-service-enterprise-package`} className="merchant-product-link" ><Button className="merchant-funtion-btn">{t("即刻订购")}</Button></Link> */}
            <h5 className="purchase-text">{t("即刻订购")}</h5>
            <PayPalButton
              amount="5500"              
              currency="AUD"
              description={tabs[0].label}
            />
          </div>
        ),
        premium_package: (
          <div style={{backgroundColor:"#f8e6a0"}}className="package-tab-content">
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
            {/* <Link to={`/products/360-media-service-premium-package`} className="merchant-product-link" ><Button className="merchant-funtion-btn">{t("即刻订购")}</Button></Link> */}
            <h5 className="purchase-text">{t("即刻订购")}</h5>
            <PayPalButton
              amount="3300"              
              currency="AUD"
              description={tabs[1].label}
            />
          </div>
        ),
        elite_package: (
          <div style={{backgroundColor:"#b1e84f"}} className="package-tab-content">
            <div className="package-info">
              <h5>{t("360传媒 精英基础套餐")}</h5>
              <h5>AU $990</h5>
              <h6>{t("我们提供6个月套餐包含以下服务")}</h6>
              {t("elite_package").split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
            
            {/* <Link to={`/products/360-media-service-standard-package`} className="merchant-product-link" ><Button className="merchant-funtion-btn">{t("即刻订购")}</Button></Link> */}
            <h5 className="purchase-text">{t("即刻订购")}</h5>
            <PayPalButton
              amount="990"              
              currency="AUD"
              description={tabs[2].label}
            />
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
      <Container className="join-us-container">
          <section>
              <h2>我们的服务</h2>
              <p>{t("merchant_text")}</p>
          </section>

          <section className="package-section">
              <h2>360传媒推广服务套餐</h2>
              {onDesktop?(
                  <Row>
                    <Col>
                      <div className="package-content">
                        <div>
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
                        {/* <Link to={`/products/360-media-service-enterprise-package`} className="merchant-product-link" ><Button className="merchant-funtion-btn">{t("即刻订购")}</Button></Link> */}
                      </div>
                      <div>
                      <h5 className="purchase-text">{t("即刻订购")}</h5>
                        <PayPalButton
                          amount="5500"              
                          currency="AUD"
                          description={tabs[0].label}
                        />
                      </div>
                    </Col>

                    <Col>
                      <div style={{backgroundColor:"#f8e6a0"}} className="package-content">
                        <div>
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
                        {/* <Link to={`/products/360-media-service-premium-package`} className="merchant-product-link" ><Button className="merchant-funtion-btn">{t("即刻订购")}</Button></Link> */}
                      </div>
                      <div>
                      <h5 className="purchase-text">{t("即刻订购")}</h5>
                        <PayPalButton
                          amount="3300"              
                          currency="AUD"
                          description={tabs[1].label}
                        />
                      </div>
                    </Col>

                    <Col>
                      <div style={{backgroundColor:"#b1e84f"}} className="package-content">
                        <div>
                          <h5>{t("360传媒 精英基础套餐")}</h5>
                          <h5>AU $990</h5>
                          <h6>{t("我们提供6个月套餐包含以下服务")}</h6>
                          {t("elite_package").split("\n").map((line, index) => (
                            <p key={index}>{line}</p>
                          ))}
                        </div>
                        {/* <Link to={`/products/360-media-service-standard-package`} className="merchant-product-link" ><Button className="merchant-funtion-btn">{t("即刻订购")}</Button></Link> */}
                      </div>
                      <div>
                        <h5 className="purchase-text">{t("即刻订购")}</h5>
                        <PayPalButton
                          //amount="0.01"
                          amount="3300"              
                          currency="AUD"
                          description={tabs[1].label}
                        />
                      </div>
                    </Col>
                  </Row>
              ):(
              <PackageTabComponent/>)
              }
              

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
                  {loading ? (
                    <div className="text-center">
                      <Spinner animation="border" size="lg" />
                      <p className="mt-3">正在上传，请稍候...</p>
                    </div>
                  ) : (
                    <MerchantUploadForm onSubmit={handleSubmit} />
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleClose}>
                    关闭
                  </Button>
                </Modal.Footer>
              </Modal>

              {/* ✅ 成功和失败弹窗 */}
              {renderSuccessModal()}
              {renderErrorModal()}
              
          </section>
          
      </Container>
  );
};
  
  export default MerchantPromotion;