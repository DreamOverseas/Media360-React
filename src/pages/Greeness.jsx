import React from "react";
import { Image, Row, Col } from "react-bootstrap";

const Greeness = () => {
    return (
        <div style={{ marginLeft: '30px', marginRight: '30px' }}>
            <Row>
                <Col md={1} className="d-flex align-items-center justify-content-center">
                    <Image
                        src="/sponsors/greeness_logo.png"
                        alt="GreenessLogo"
                        style={{ height: '140px', width: 'auto' }}
                    />
                </Col>
                <Col className="d-flex align-items-center justify-content-center">
                    <h2 className="text-center" style={{ fontSize: '36px', color: 'limegreen' }}>
                        Greeness, 将绿色能源带到生活的每个角落
                    </h2>
                </Col>
            </Row>

            <Row className="align-items-center my-4 flex-column-reverse flex-md-row">
                <Col md={6} className="text-center">
                    <p>
                        Greeness是一家致力于绿色清洁能源产品研发的公司。我们坚信，绿色能源是未来可持续发展的关键，而家庭用电与户外用电相结合的能源中心将成为未来的主流趋势。在Greeness，我们不断研究推动清洁能源进步的技术，还致力于为家庭和社区提供高效、环保的能源解决方案。
                        我们的口号“将绿色能源带入生活的每个角落”完美诠释了我们的理念，通过创新的绿色清洁能源产品，提供可持续、环保的能源选择，从而共同推动现有能源结构向更清洁、可再生的方向发展。
                        我们的目标是打造家庭用电和户外用电相结合的能源中心，让每个家庭都能够自主、高效地利用清洁能源，从而减少对传统能源的依赖，降低碳排放，实现共同的绿色未来。
                    </p>
                </Col>
                <Col md={6} className="text-center">
                    <Image
                        src="/sponsors/greeness_product.png"
                        alt="Greeness Product"
                        fluid
                    />
                </Col>
            </Row>

            <Row className="align-items-center my-4 flex-column-reverse flex-md-row">
                <Col md={6} className="text-center">
                    <p>
                        GreenVolt是一款时尚的家庭能源存储解决方案，通过太阳能或在低价时段储存电能，在需要时放出，让您节省更多电费。当电网故障时，GreenVolt依然保持您家中的供电，并让您保持安心。
                    </p>
                </Col>
                <Col md={6} className="text-center" style={{ maxHeight: '600px', overflowX: 'auto' }}>
                    <Image
                        src="/sponsors/greenvolt.png"
                        alt="GreenVolt"
                        fluid
                    />
                </Col>
            </Row>

            <Row className="align-items-center my-4 flex-column-reverse flex-md-row">
                <Col md={6} className="text-center">
                    <h4>小巧的G4电池，让您随时随地使用清洁能源！</h4>
                    <p>
                        G4电池为您带来便捷的电力体验。配备 G4 电池，无论是出行、为工具供电，还是参加户外冒险，只需拿起它就能出发。G4 电池小巧便携，并使用标准化接口设计，赋予您在不同场合轻松充电的灵活性，不会错过任何机会。体验真正的能源自由，拥有一款能够适应您需求的电池，无论您身在何处
                    </p>
                </Col>
                <Col md={6} className="text-center" style={{ maxHeight: '600px', overflowX: 'auto' }}>
                    <Image
                        src="/sponsors/g4battery.png"
                        alt="G4 Battery"
                        fluid
                    />
                </Col>
            </Row>

            <Row className="align-items-center my-4 flex-column-reverse flex-md-row">
                <Col md={6} className="text-center">
                    <p>
                        Greeness的卓越产品设计提供了全面的全屋备份解决方案，能够支持您的房屋100% 的用电负载。这确保了即使在停电期间也能为您的家庭需求提供不间断的电力供应。当极端天气导致电网损坏且在停电期间电池耗尽时，Greeness的灾难模式起到了至关重要的作用。此独特功能激活了并网逆变器，使太阳能系统能够为电池充电并为家庭提供基本的电力需求，完全离网运行，在最具挑战的条件下提供安心。
                    </p>
                </Col>
                <Col md={6} className="text-center">
                    <Image
                        src="/sponsors/housepowersupply.png"
                        alt="House Power Supply"
                        fluid
                    />
                </Col>
            </Row>

            <Row className="align-items-center my-4 flex-column-reverse flex-md-row">
                <Col md={6} className="text-center">
                    <p>
                        智能发电机和智能涡轮系统，体验 Greeness带来的能源独立。
                    </p>
                </Col>
                <Col md={6} className="text-center">
                    <Image
                        src="/sponsors/generator.png"
                        alt="E Generator"
                        fluid
                    />
                </Col>
            </Row>
        </div>
    );
};

export default Greeness;
