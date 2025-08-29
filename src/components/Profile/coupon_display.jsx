import { Alert, Card, Col, Row, Button } from "react-bootstrap";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

const CouponDisplay = ({ couponList, couponLoading, couponError, onCouponUpdate }) => {
  const [updating, setUpdating] = useState(new Set());

  const handleToggleHide = async (coupon, shouldHide) => {
    const documentId = coupon?.documentId;
    if (!documentId) {
      console.error("No documentId found for coupon");
      return;
    }

    setUpdating(prev => new Set([...prev, documentId]));

    try {
      const token = Cookies.get("token");
      const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
      
      await axios.put(
        `${BACKEND_HOST}/api/coupons/${documentId}`,
        {
          data: {
            Hide: shouldHide
          }
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // 调用父组件的更新函数来刷新优惠券列表
      if (onCouponUpdate) {
        onCouponUpdate();
      }
    } catch (error) {
      console.error("Failed to update coupon:", error);
      // 这里可以添加错误提示
    } finally {
      setUpdating(prev => {
        const newSet = new Set(prev);
        newSet.delete(documentId);
        return newSet;
      });
    }
  };

  if (couponLoading) return <div>正在加载专属优惠券...</div>;
  if (couponError) return <Alert variant='warning'>{couponError}</Alert>;

  if (!Array.isArray(couponList) || couponList.length === 0) {
    return <Alert variant='info'>暂无专属优惠券信息</Alert>;
  }

  // 分离显示和隐藏的优惠券
  const visibleCoupons = couponList.filter(item => {
    const rec = item?.attributes ?? item;
    return !rec.Hide;
  });

  const hiddenCoupons = couponList.filter(item => {
    const rec = item?.attributes ?? item;
    return rec.Hide;
  });

  const renderCouponCard = (recItem, idx, isHidden = false) => {
    const rec = recItem?.attributes ?? recItem;
    const title = rec.Title ?? rec.title ?? "—";
    const hash = rec.Hash ?? rec.hash ?? "—";
    const UsesLeft = rec.UsesLeft ?? null;
    const Active = rec.Active ?? null;
    const expiry = rec.Expiry ?? rec.expiry ?? null;
    const documentId = recItem?.documentId;
    const isUpdating = updating.has(documentId);

    return (
      <Col md={6} className='mb-3' key={recItem?.documentId ?? idx}>
        <Card className={`h-100 ${isHidden ? 'border-secondary' : ''}`}>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>{title}</span>
            <Button
              variant={isHidden ? "outline-success" : "outline-secondary"}
              size="sm"
              onClick={() => handleToggleHide(recItem, !isHidden)}
              disabled={isUpdating}
            >
              {isUpdating ? (
                <span>...</span>
              ) : isHidden ? (
                <>
                  <Eye size={16} className="me-1" />
                  显示
                </>
              ) : (
                <>
                  <EyeOff size={16} className="me-1" />
                  隐藏
                </>
              )}
            </Button>
          </Card.Header>
          <Card.Body>
            <div><strong>Hash：</strong>{hash}</div>
            <div><strong>被扫次数：</strong>{9999 - UsesLeft}</div>
            <div><strong>状态：</strong>{Active ? "已激活" : "未激活"}</div>
            {expiry && <div><strong>到期时间：</strong>{expiry}</div>}
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <div>
      {/* 显示的优惠券 */}
      {visibleCoupons.length > 0 && (
        <div className="mb-4">
          <h5 className="mb-3 text-success">
            <Eye size={18} className="me-2" />
            显示的优惠券 ({visibleCoupons.length})
          </h5>
          <Row>
            {visibleCoupons.map((item, idx) => renderCouponCard(item, idx, false))}
          </Row>
        </div>
      )}

      {/* 隐藏的优惠券 */}
      {hiddenCoupons.length > 0 && (
        <div>
          <h5 className="mb-3 text-muted">
            <EyeOff size={18} className="me-2" />
            隐藏的优惠券 ({hiddenCoupons.length})
          </h5>
          <Row>
            {hiddenCoupons.map((item, idx) => renderCouponCard(item, idx, true))}
          </Row>
        </div>
      )}

      {visibleCoupons.length === 0 && hiddenCoupons.length === 0 && (
        <Alert variant='info'>暂无专属优惠券信息</Alert>
      )}
    </div>
  );
};

export default CouponDisplay;