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
        const UsesLeft = rec.UsesLeft ?? null;
        const Active = rec.Active ?? null;
        const Hide = rec.Hide ?? null;
        const expiry = rec.Expiry ?? rec.expiry ?? null;

        return (
          <Col md={6} className='mb-3' key={recItem?.id ?? idx}>
            <Card className='h-100'>
              <Card.Header>{title}</Card.Header>
              <Card.Body>
                <div><strong>Hash：</strong>{hash}</div>
                <div><strong>被扫次数：</strong>{9999 - UsesLeft}</div>
                <div><strong>状态：</strong>{Active ? "已激活" : "未激活"}</div>
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