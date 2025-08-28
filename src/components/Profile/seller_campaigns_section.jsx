import { Alert, Badge, Card, Col, Row } from "react-bootstrap";

const SellerCampaignsSection = ({ sellerData, sellerLoading, sellerError }) => {
  if (sellerLoading) return <div>正在加载商家优惠...</div>;
  if (sellerError) return <Alert variant='warning'>{sellerError}</Alert>;

  if (!sellerData?.length) {
    return <Alert variant='info'>暂无商家</Alert>;
  }

  return (
    <>
      {sellerData.map((shop, idx) => {
        const cd = shop.company_details || {};
        const cps = Array.isArray(shop.campaign_preferences) ? shop.campaign_preferences : [];
        
        return (
          <Card className='mb-4' key={idx}>
            <Card.Header>
              <strong>{cd.company_name || "未命名商家"}</strong>
              {cd.industry && (
                <Badge bg='secondary' className='ms-2'>
                  {cd.industry}
                </Badge>
              )}
            </Card.Header>
            <Card.Body>
              <Row className='mb-2'>
                <Col md={6}>
                  <div>
                    <strong>地址：</strong>
                    {cd.address || "—"}
                  </div>
                </Col>
                <Col md={6}>
                  <div>
                    <strong>ABN：</strong>
                    {cd.abn || "—"}
                  </div>
                </Col>
              </Row>
              <Row className='mb-2'>
                <Col md={6}>
                  <div>
                    <strong>邮箱：</strong>
                    {cd.contact_email ? (
                      <a href={`mailto:${cd.contact_email}`}>
                        {cd.contact_email}
                      </a>
                    ) : (
                      "—"
                    )}
                  </div>
                </Col>
                <Col md={6}>
                  <div>
                    <strong>电话：</strong>
                    {cd.contact_phone || "—"}
                  </div>
                </Col>
              </Row>
              <div className='mb-3'>
                <strong>官网：</strong>
                {cd.website ? (
                  <a href={cd.website} target='_blank' rel='noreferrer'>
                    {cd.website}
                  </a>
                ) : (
                  "—"
                )}
              </div>

              <h5 className='mt-3'>活动优惠</h5>
              <Row>
                {cps.length ? (
                  cps.map((cp, i) => (
                    <Col md={6} key={i} className='mb-3'>
                      <Card className='h-100'>
                        <Card.Body>
                          <div className='d-flex justify-content-between align-items-center mb-2'>
                            <strong>{cp.title || "未命名优惠"}</strong>
                            {cp.type && <Badge bg='info'>{cp.type}</Badge>}
                          </div>
                          <div className='mb-2'>
                            {cp.description || "—"}
                          </div>
                          <div className='small text-muted'>
                            有效期至：{cp.valid_until || "—"}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <Alert variant='light'>暂无优惠活动</Alert>
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
};

export default SellerCampaignsSection;