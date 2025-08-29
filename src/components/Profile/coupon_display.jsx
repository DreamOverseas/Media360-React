import { Alert, Card, Col, Row, Button, Form } from "react-bootstrap";
import { Eye, EyeOff, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";

const CouponDisplay = ({ couponList, couponLoading, couponError, onCouponUpdate }) => {
  const [updating, setUpdating] = useState(new Set());
  const [showHiddenCoupons, setShowHiddenCoupons] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  // 根据搜索词过滤优惠券
  const filterCouponsBySearch = (coupons) => {
    if (!searchTerm.trim()) return coupons;
    
    return coupons.filter(item => {
      const rec = item?.attributes ?? item;
      const title = rec.Title ?? rec.title ?? "";
      return title.toLowerCase().includes(searchTerm.toLowerCase());
    });
  };

  const filteredVisibleCoupons = filterCouponsBySearch(visibleCoupons);
  const filteredHiddenCoupons = filterCouponsBySearch(hiddenCoupons);

  const renderCouponCard = (recItem, idx, isHidden = false) => {
    const rec = recItem?.attributes ?? recItem;
    const title = rec.Title ?? rec.title ?? "—";
    const hash = rec.Hash ?? rec.hash ?? "—";
    const UsesLeft = rec.UsesLeft ?? null;
    const Active = rec.Active ?? null;
    const expiry = rec.Expiry ?? rec.expiry ?? null;
    const documentId = recItem?.documentId;
    const isUpdating = updating.has(documentId);

    // 判断优惠券状态并设置颜色
    const getCardVariant = () => {
      // 检查是否过期
      if (expiry) {
        const expiryDate = new Date(expiry);
        const now = new Date();
        if (expiryDate < now) {
          return 'danger'; // 红色 - 已过期
        }
      }
      
      // 检查是否激活
      if (!Active) {
        return 'warning'; // 黄色 - 未激活
      }
      
      return 'success'; // 绿色 - 正常状态
    };

    const cardVariant = getCardVariant();

    return (
      <Col md={6} className='mb-3' key={recItem?.documentId ?? idx}>
        <Card className={`h-100 border-${cardVariant} ${isHidden ? 'opacity-75' : ''}`}>
          <Card.Header className={`d-flex justify-content-between align-items-center bg-${cardVariant} text-white`}>
            <span className="fw-bold">{title}</span>
            <Button
              variant={isHidden ? "light" : "light"}
              size="sm"
              onClick={() => handleToggleHide(recItem, !isHidden)}
              disabled={isUpdating}
              className="text-dark"
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
            <div><strong>状态：</strong>
              <span className={`fw-bold text-${cardVariant}`}>
                {Active ? "已激活" : "未激活"}
                {expiry && new Date(expiry) < new Date() && " (已过期)"}
              </span>
            </div>
            {expiry && <div><strong>到期时间：</strong>{expiry}</div>}
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <div>
      {/* 搜索框 */}
      <div className="mb-4">
        <Form.Group>
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder="搜索优惠券标题..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pe-5"
            />
            <div className="position-absolute top-50 end-0 translate-middle-y me-3">
              {searchTerm ? (
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 text-secondary"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={16} />
                </Button>
              ) : (
                <Search size={16} className="text-muted" />
              )}
            </div>
          </div>
        </Form.Group>
      </div>

      {/* 显示的优惠券 */}
      {filteredVisibleCoupons.length > 0 && (
        <div className="mb-4">
          <h5 className="mb-3 text-success">
            <Eye size={18} className="me-2" />
            显示的优惠券 ({filteredVisibleCoupons.length}{searchTerm && `/${visibleCoupons.length}`})
          </h5>
          <Row>
            {filteredVisibleCoupons.map((item, idx) => renderCouponCard(item, idx, false))}
          </Row>
        </div>
      )}

      {/* 隐藏的优惠券 - 可折叠 */}
      {filteredHiddenCoupons.length > 0 && (
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="mb-0 text-muted">
              <EyeOff size={18} className="me-2" />
              隐藏的优惠券 ({filteredHiddenCoupons.length}{searchTerm && `/${hiddenCoupons.length}`})
            </h5>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowHiddenCoupons(!showHiddenCoupons)}
            >
              {showHiddenCoupons ? (
                <>
                  <ChevronUp size={16} className="me-1" />
                  隐藏
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="me-1" />
                  查看
                </>
              )}
            </Button>
          </div>
          
          {showHiddenCoupons && (
            <Row>
              {filteredHiddenCoupons.map((item, idx) => renderCouponCard(item, idx, true))}
            </Row>
          )}
        </div>
      )}

      {/* 无搜索结果提示 */}
      {searchTerm && filteredVisibleCoupons.length === 0 && filteredHiddenCoupons.length === 0 && (
        <Alert variant='info'>
          没有找到标题包含 "{searchTerm}" 的优惠券
        </Alert>
      )}

      {/* 无优惠券提示 */}
      {!searchTerm && visibleCoupons.length === 0 && hiddenCoupons.length === 0 && (
        <Alert variant='info'>暂无专属优惠券信息</Alert>
      )}
    </div>
  );
};

export default CouponDisplay;