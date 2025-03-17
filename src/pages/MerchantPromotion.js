import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Image, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const MerchantPromotion = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();



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
            <div className="tab-content">
              <h4>{t("360传媒 企业定制策略套餐")}</h4>
              <p>AU $5,500</p>
              <h3>{t("我们提供12个月套餐包含以下服务")}</h3>
              {t("enterprise_package").split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              <Button className="order-button">{t("即刻订购")}</Button>
            </div>
          ),
          premium_package: (
            <div className="tab-content">
              <h4>{t("360传媒 卓越尊享套餐")}</h4>
              <p>AU $3,300</p>
              <h3>{t("我们提供6个月套餐包含以下服务")}</h3>
              <></>
              {t("premium_package").split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              <Button className="order-button">{t("即刻订购")}</Button>
            </div>
          ),
          elite_package: (
            <div className="tab-content">
              <h4>{t("360传媒 精英基础套餐")}</h4>
              <p>AU $990</p>
              <h3>{t("我们提供6个月套餐包含以下服务")}</h3>
              {t("elite_package").split("\n").map((line, index) => (
                <p key={index}>{line}</p>
              ))}
              <Button className="order-button">{t("即刻订购")}</Button>
            </div>
          ),
        };
      
        return (
          <div className="package-tab-container">
              <Row className="justify-content-center">
                {tabs.map((tab) => (
                  <Col xs={4} key={tab.key} className="text-center">
                    <Button
                      className={activeTab === tab.key ? "active" : ""}
                      onClick={() => setActiveTab(tab.key)}
                    >
                      {tab.label}
                    </Button>
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
        { key: "portrait_info", label: t("人物肖像及简介") },
        { key: "product_description", label: t("产品图文介绍") },
        { key: "video_format", label: t("视频格式") },
      ];
    
      // 选项卡内容
      const tabContent = {
        portrait_info: (
          <div className="tab-content">
            <h2>{t("人物肖像及简介")}</h2>
            <div className="example-images">
              <div>
                <p>{t("示例图片")}</p>
                <img src="https://via.placeholder.com/200" alt={t("示例图片")} />
                <p>{t("姓名")}</p>
                <p>{t("职业 / 身份")}</p>
              </div>
              <div>
                <p>{t("示例图片")}</p>
                <img src="https://via.placeholder.com/200" alt={t("示例图片")} />
                <p>{t("人物简介")}</p>
              </div>
            </div>
            <p>{t("提供至少 2 张宽高比 2:3 的半身照。")}</p>
            <p>{t("提供至少 1 张正方形照片。")}</p>
            <p>{t("需提供人物中英文姓名及人物头衔：")}</p>
            <ul>
              <li>{t("中文少于 10 字")}</li>
              <li>{t("英文少于 6 个单词")}</li>
            </ul>
            <p>{t("需提供中英文人物简介。")}</p>
          </div>
        ),
        product_description: (
          <div className="tab-content">
            <h2>{t("产品图文介绍")}</h2>
            <p>{t("在此添加产品相关信息，包括图片、文字说明、规格等。")}</p>
          </div>
        ),
        video_format: (
          <div className="tab-content">
            <h2>{t("视频格式")}</h2>
            <p>{t("在此添加视频格式要求，如分辨率、时长、文件类型等。")}</p>
          </div>
        ),
      };
    
      return (
        <div className="file-upload-tab-container">
          <Row className="justify-content-center">
            {tabs.map((tab) => (
              <Col xs={4} key={tab.key} className="text-center">
                <Button
                  className={activeTab === tab.key ? "active" : ""}
                  onClick={() => setActiveTab(tab.key)}
                >
                  {tab.label}
                </Button>
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
                
                <p>360传媒 提供三个核心服务套餐：精英套餐、优质套餐，以及企业与战略套餐，旨在满足从初创企业到大型品牌的各种业务需求。
                    加入我们，打造品牌影响力！
                    在这里，您可以上传品牌创始人、产品意见领袖、产品代言人，分享品牌故事，塑造行业影响力。
                    同时，推荐优质产品、意见领袖以及代言人，拓展合作渠道，助力品牌曝光，让更多目标用户关注并信赖您的品牌
                </p>
            </section>

            <section>
                <h2>360传媒推广服务套餐</h2>
                <PackageTabComponent/>
            </section>

            <section>
                <h2>360传媒平台上传要求</h2>
                <FileUploadTabComponent/>
                <Button>即刻上传资料</Button>
            </section>
            
        </Container>
    );
};
  
  export default MerchantPromotion;