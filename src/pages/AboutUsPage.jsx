import { Col, Container, Row, Image, Button} from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import "../css/AboutUsPage.css";

const AboutUsPage = () => {
  const { t } = useTranslation();
  const onDesktop = useMediaQuery({ query: "(min-width: 768px)" });

  const tabs = [
    { key: "enterprise_package", label: t("企业定制套餐") },
    { key: "premium_package", label: t("卓越尊享套餐") },
    { key: "elite_package", label: t("精英基础套餐") },
  ];

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
          <div>
            <div>
              <Row style={{backgroundColor:"#b1e84f"}} className="d-flex text-center">
                <h5>{t("360传媒 企业定制策略套餐")}</h5>
                <h5>AU $5,500</h5>
              </Row>
              <h6>{t("我们提供12个月套餐包含以下服务")}</h6>
              <h6 className="basic-info-text">{t("基础服务")}</h6>
              <p>{t("（精英基础套餐和卓越尊享套餐服务均已包含）")}</p>
              <h6>{t("额外服务")}</h6>
              <div dangerouslySetInnerHTML={{ __html: t('enterprise_package_extra_homepage') }}/>
            </div>
          </div>
        ),
        premium_package: (
          <div>
            <div>
              <Row style={{backgroundColor:"#b1e84f"}} className="d-flex text-center">
                <h5>{t("360传媒 卓越尊享套餐")}</h5>
                <h5>AU $3,300</h5>
              </Row>
              <h6>{t("我们提供6个月套餐包含以下服务")}</h6>
              <h6 className="basic-info-text">{t("基础服务")}</h6>
              <p>{t("（精英基础套餐服务均已包含）")}</p>
              <h6>{t("额外服务")}</h6>
              <div dangerouslySetInnerHTML={{ __html: t('premium_package_extra_homepage') }}/>
            </div>
          </div>
        ),
        elite_package: (
          <div>
            <div>
              <Row style={{backgroundColor:"#b1e84f"}} className="d-flex text-center">
                <h5>{t("360传媒 精英基础套餐")}</h5>
                <h5>AU $990</h5>
              </Row>
              <h6>{t("我们提供6个月套餐包含以下服务")}</h6>
              <div dangerouslySetInnerHTML={{ __html: t('elite_package_homepage') }}/>
            </div>
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

  return (
    <Container>
        <section>
          <Row className="d-flex text-center">
            <h4>About Us</h4>
            <h4>关于我们</h4>
          </Row>
          <br/>
          <Row className="d-flex text-center">
          {t("about_us").split("\n").map((line, index) => (
            <p className="about-text" key={index}>{line}</p>
          ))}
          </Row>
        </section>
        <br/>
        <section>
          <h5>Our Services</h5>
          <h6>我们的服务</h6>
          <Row>
              <Col>
                <Row>
                  <Col md={4}>
                    <Image src="/homepage/brand-image.png"/>
                  </Col>
                  <Col md={8}>
                    <div className="feature-text" dangerouslySetInnerHTML={{ __html: t('feature_1') }}/>
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row>
                  <Col md={4}>
                    <Image src="/homepage/web-design.png"/>
                  </Col>
                  <Col md={8}>
                    <div className="feature-text" dangerouslySetInnerHTML={{ __html: t('feature_2') }}/>
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row>
                  <Col md={4}>
                    <Image src="/homepage/social-media.png"/>
                  </Col>
                  <Col md={8}>
                    <div className="feature-text" dangerouslySetInnerHTML={{ __html: t('feature_3') }}/>
                  </Col>
                </Row>
              </Col>
          </Row>
          <br/>
          <Row>
            <Col>
              <Row>
                <Col md={4}>
                  <Image src="/homepage/lecture.png"/>
                </Col>
                <Col md={8}>
                  <div className="feature-text" dangerouslySetInnerHTML={{ __html: t('feature_4') }}/>
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col md={4}>
                  <Image src="/homepage/content.png"/>
                </Col>
                <Col md={8}>
                  <div className="feature-text" dangerouslySetInnerHTML={{ __html: t('feature_5') }}/>
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col md={4}>
                  <Image src="/homepage/team.png"/>
                </Col>
                <Col md={8}>
                  <div className="feature-text" dangerouslySetInnerHTML={{ __html: t('feature_6') }}/>
                </Col>
              </Row>
            </Col>
          </Row>
        </section>
        <br/>
        <section>
          <h5>Join Us</h5>
          <h6>加入我们</h6>
          {onDesktop?(
            <Row>
              <Col>
                <div className="home-service-package">
                  <div>
                    <Row style={{backgroundColor:"#f8e6a0"}} className="d-flex text-center">
                      <h5>{t("360传媒 企业定制策略套餐")}</h5>
                      <h5>AU $5,500</h5>
                    </Row>
                    <h6>{t("我们提供12个月套餐包含以下服务")}</h6>
                    <p>{t("（精英基础套餐和卓越尊享套餐服务均已包含）")}</p>
                    <h6>{t("额外服务")}</h6>
                    <div dangerouslySetInnerHTML={{ __html: t('enterprise_package_extra_homepage') }}/>
                  </div>
                </div>
              </Col>

              <Col>
                <div className="home-service-package">
                  <div>
                    <Row style={{backgroundColor:"#f8e6a0"}} className="d-flex text-center">
                      <h5>{t("360传媒 卓越尊享套餐")}</h5>
                      <h5>AU $3,300</h5>
                    </Row>
                    <h6>{t("我们提供6个月套餐包含以下服务")}</h6>
                    <p>{t("（精英基础套餐服务均已包含）")}</p>
                    <h6>{t("额外服务")}</h6>
                    <div dangerouslySetInnerHTML={{ __html: t('premium_package_extra_homepage') }}/>
                  </div>
                </div>
              </Col>

              <Col>
                <div className="home-service-package">
                  <div>
                    <Row style={{backgroundColor:"#b1e84f"}} className="d-flex text-center">
                      <h5>{t("360传媒 精英基础套餐")}</h5>
                      <h5>AU $990</h5>
                    </Row>
                    <h6>{t("我们提供6个月套餐包含以下服务")}</h6>
                    <div dangerouslySetInnerHTML={{ __html: t('elite_package_homepage') }}/>
                  </div>
                </div>
              </Col>
            </Row>
            ):(
            <PackageTabComponent/>)
          }
          <Row className="d-flex text-center">
            <Link to={`/merchant/360-media-promotion-service`}>
              <Button className='update-function-btn'>{t("moreDetails")}</Button>
            </Link>
          </Row>
          
        </section>
      </Container>
  );
};
  
  export default AboutUsPage;