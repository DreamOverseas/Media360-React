import { Alert, Card, Col, Row } from "react-bootstrap";

const CouponDisplay = ({ couponList, couponLoading, couponError }) => {
  if (couponLoading) return <div>正在加载专属优惠券...</div>;
  if (couponError) return <Alert variant='warning'>{couponError}</Alert>;

  if (!Array.isArray(couponList) || couponList.length === 0) {
    return <Alert variant='info'>暂无专属优惠券信息</Alert>;
  }

  return (
    <Row className='mb-3'>
      {couponList.map((recItem, idx) => {
        const rec = recItem?.attributes ?? recItem;
        const title = rec.Title ?? rec.title ?? "—";
        const hash = rec.Hash ?? rec.hash ?? "—";
        const expiry = rec.Expiry ?? rec.expiry ?? null;

        return (
          <Col md={6} className='mb-3' key={recItem?.id ?? idx}>
            <Card className='h-100'>
              <Card.Header>专属优惠券</Card.Header>
              <Card.Body>
                <div><strong>标题：</strong>{title}</div>
                <div><strong>Hash：</strong>{hash}</div>
                {expiry && <div><strong>到期时间：</strong>{expiry}</div>}
              </Card.Body>
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default CouponDisplay;