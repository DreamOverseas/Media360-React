import axios from "axios";
import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Image, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";


const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const MerchantPromotion = () => {
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();



    const PackageTabComponent = () => {
        const [activeTab, setActiveTab] = useState("企业定制套餐");
      
        const tabs = ["企业定制套餐", "卓越尊享套餐", "精英基础套餐"];
        
        const tabContent = {
          "企业定制套餐": (
            <div className="tab-content">
              <h2>360传媒 企业定制策略套餐</h2>
              <p>AU $5,500</p>
              <h3>套餐包含权益</h3>
              <ul>
                <li>提供西方精准访谈服务，帮助品牌曝光。</li>
                <li>信息上传到 360Media 平台，提升品牌可信度。</li>
                <li>MCN 推广服务，提高社交媒体影响力。</li>
                <li>广告投放、活动拍摄、市场推广等多项服务。</li>
              </ul>
              <Button className="order-button">即刻订购</Button>
            </div>
          ),
          "卓越尊享套餐": (
            <div className="tab-content">
              <h2>卓越尊享套餐</h2>
              <p>价格与服务详情待定</p>
              <p>包含高级定制推广方案，适合高端品牌和企业宣传。</p>
              <button className="order-button">即刻订购</button>
            </div>
          ),
          "精英基础套餐": (
            <div className="tab-content">
              <h2>精英基础套餐</h2>
              <p>价格与服务详情待定</p>
              <p>适合初创企业和个人品牌，提供基础营销支持。</p>
              <Button className="order-button">即刻订购</Button>
            </div>
          ),
        };
      
        return (
          <div className="tab-container">
            <div className="tab-menu">
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
            <div className="tab-content-container">{tabContent[activeTab]}</div>
          </div>
        );
    };


    const FileUploadTabComponent = () => {
        const [activeTab, setActiveTab] = useState("人物肖像及简介");
      
        const tabs = ["人物肖像及简介", "产品图文介绍", "视频格式"];
      
        const tabContent = {
          "人物肖像及简介": (
            <div className="tab-content">
              <h2>人物肖像及简介</h2>
              <div className="example-images">
                <div>
                  <p>示例图片</p>
                  <img src="https://via.placeholder.com/200" alt="示例图片" />
                  <p>姓名</p>
                  <p>职业 / 身份</p>
                </div>
                <div>
                  <p>示例图片</p>
                  <img src="https://via.placeholder.com/200" alt="示例图片" />
                  <p>人物简介</p>
                </div>
              </div>
              <p>提供至少 2 张宽高比 2:3 的半身照。</p>
              <p>提供至少 1 张正方形照片。</p>
              <p>需提供人物中英文姓名及人物头衔：</p>
              <ul>
                <li>中文少于 10 字</li>
                <li>英文少于 6 个单词</li>
              </ul>
              <p>需提供中英文人物简介。</p>
            </div>
          ),
          "产品图文介绍": (
            <div className="tab-content">
              <h2>产品图文介绍</h2>
              <p>在此添加产品相关信息，包括图片、文字说明、规格等。</p>
            </div>
          ),
          "视频格式": (
            <div className="tab-content">
              <h2>视频格式</h2>
              <p>在此添加视频格式要求，如分辨率、时长、文件类型等。</p>
            </div>
          ),
        };
      
        return (
          <div className="tab-container">
            <div className="tab-menu">
              {tabs.map((tab) => (
                <Button
                  key={tab}
                  className={activeTab === tab ? "active" : ""}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </div>
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