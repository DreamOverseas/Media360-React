import { Alert, Card, Col, Row, Button, Form } from "react-bootstrap";
import { Eye, EyeOff, ChevronDown, ChevronUp, Search, X } from "lucide-react";
import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import QRCode from "qrcode";
import { useTranslation } from "react-i18next";

// Helper for QR downloading
async function downloadQR(hash, filename) {
  const canvas = document.createElement("canvas");
  const { t } = useTranslation();

  await QRCode.toCanvas(canvas, hash, { width: 512, margin: 1 });

  const link = document.createElement("a");
  link.download = `${filename}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

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
      // TODO: 这里可以添加错误提示
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
    return <Alert variant='info'>{t("profile.page.noCouponInfo")}</Alert>;
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
    const scanned = rec.Scanned ?? 0;
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
      <Col md={6} className="mb-3" key={recItem?.documentId ?? idx}>
        <Card className={`h-100 border-${cardVariant} ${isHidden ? "opacity-75" : ""}`}>
          <Card.Header
            className={`d-flex justify-content-between align-items-center bg-${cardVariant} text-white`}
          >
            <span className="fw-bold">{title}</span>
            <Button
              variant="light"
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
                  {t("profile.page.couponDisplay.show")}
                </>
              ) : (
                <>
                  <EyeOff size={16} className="me-1" />
                  {t("profile.page.couponDisplay.hide")}
                </>
              )}
            </Button>
          </Card.Header>

          <Card.Body>
            <Row>
              <Col sm={6} md={8}>
                <div>
                  <strong>{t("profile.page.couponDisplay.scanned")}</strong>
                  {scanned}
                </div>
                <div>
                  <strong>{t("profile.page.couponDisplay.remaining")}</strong>
                  {UsesLeft}
                </div>
                <div>
                  <strong>{t("profile.page.couponDisplay.status")}</strong>
                  <span className={`fw-bold text-${cardVariant}`}>
                    {Active
                      ? t("profile.page.couponDisplay.active")
                      : t("profile.page.couponDisplay.inactive")}
                    {expiry && new Date(expiry) < new Date() && ` (${t("profile.page.couponDisplay.expired")})`}
                  </span>
                </div>
                {expiry && (
                  <div>
                    <strong>{t("profile.page.couponDisplay.expiry")}</strong>
                    {expiry}
                  </div>
                )}
              </Col>
              <Col sm={6} md={4} className="d-flex justify-content-center align-items-start">
                <Button
                  variant="light"
                  size="sm"
                  onClick={() => downloadQR(hash, title)}
                  className="text-dark"
                >
                  <i className="bi bi-box-arrow-in-down text-4xl me-1"></i>
                  <p className="mb-0">{t("profile.page.couponDisplay.downloadQR")}</p>
                </Button>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Col>
    );
  };

  return (
    <div>
      {/* Search box */}
      <div className="mb-4">
        <Form.Group>
          <div className="position-relative">
            <Form.Control
              type="text"
              placeholder={t("profile.page.couponDisplay.searchPlaceholder")}
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

      {/* Visible coupons */}
      {filteredVisibleCoupons.length > 0 && (
        <div className="mb-4">
          <h5 className="mb-3 text-success">
            <Eye size={18} className="me-2" />
            {t("profile.page.couponDisplay.visibleCoupons")} (
            {filteredVisibleCoupons.length}
            {searchTerm && `/${visibleCoupons.length}`})
          </h5>
          <Row>
            {filteredVisibleCoupons.map((item, idx) =>
              renderCouponCard(item, idx, false)
            )}
          </Row>
        </div>
      )}

      {/* Hidden coupons (collapsible) */}
      {filteredHiddenCoupons.length > 0 && (
        <div>
          <div className="d-flex align-items-center justify-content-between mb-3">
            <h5 className="mb-0 text-muted">
              <EyeOff size={18} className="me-2" />
              {t("profile.page.couponDisplay.hiddenCoupons")} (
              {filteredHiddenCoupons.length}
              {searchTerm && `/${hiddenCoupons.length}`})
            </h5>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={() => setShowHiddenCoupons(!showHiddenCoupons)}
            >
              {showHiddenCoupons ? (
                <>
                  <ChevronUp size={16} className="me-1" />
                  {t("profile.page.couponDisplay.hide")}
                </>
              ) : (
                <>
                  <ChevronDown size={16} className="me-1" />
                  {t("profile.page.couponDisplay.view")}
                </>
              )}
            </Button>
          </div>

          {showHiddenCoupons && (
            <Row>
              {filteredHiddenCoupons.map((item, idx) =>
                renderCouponCard(item, idx, true)
              )}
            </Row>
          )}
        </div>
      )}

      {/* No search results */}
      {searchTerm &&
        filteredVisibleCoupons.length === 0 &&
        filteredHiddenCoupons.length === 0 && (
          <Alert variant="info">
            {t("profile.page.couponDisplay.noSearchResults", { searchTerm })}
          </Alert>
        )}

      {/* No coupons at all */}
      {!searchTerm &&
        visibleCoupons.length === 0 &&
        hiddenCoupons.length === 0 && (
          <Alert variant="info">
            {t("profile.page.couponDisplay.noCoupons")}
          </Alert>
        )}
    </div>
  );
};

export default CouponDisplay;
