import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Container, Row, Image, Button, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";
// import { useNavigate } from "react-router-dom";
import MerchantUploadForm from "../components/MerchantUploadForm";
import "../css/MerchantPromotion.css"


const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const MerchantPromotion = () => {
    const { t } = useTranslation();
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleUpload = () => setShow(true);

    const handleSubmit = async (formData) => {
      try {
        const data = new FormData();
        data.append("firstName", formData.firstName);
        data.append("lastName", formData.lastName);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("description", formData.description);
        if (formData.file) {
          data.append("file", formData.file);
        }
  
        const response = await axios.post(`${BACKEND_HOST}/api/upload`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
  
        alert("提交成功！");
        console.log(response.data);
        setShow(false); // 关闭弹窗
      } catch (error) {
        console.error("上传失败:", error);
        alert("提交失败，请重试！");
      }
    };



    const PackageTabComponent = () => {
      const defaultTab = "enterprise_package"; 
      const [activeTab, setActiveTab] = useState(defaultTab);
      
        const tabs = [
          { key: "enterprise_package", label: t("企业定制套餐") },
          { key: "premium_package", label: t("卓越尊享套餐") },
          { key: "elite_package", label: t("精英基础套餐") },
        ];
      
        // 定义内容翻译
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