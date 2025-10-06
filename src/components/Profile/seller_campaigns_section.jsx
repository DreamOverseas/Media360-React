import { Alert, Badge, Card, Col, Row, Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const SellerCampaignsSection = ({ sellerData, sellerLoading, sellerError }) => {
  const { t } = useTranslation();

  const handleMediaDownload = async (mediaItem) => {
    try {
      const response = await fetch(mediaItem.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = mediaItem.name || `media_${mediaItem.id}${mediaItem.ext || ""}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(t("profile.error.downloadFail"), error);
      alert(t("profile.page.sellerCampaignsSection.downloadFailedAlert"));
    }
  };

  const getFileTypeInfo = (mediaItem) => {
    const mime = mediaItem.mime || "";
    const ext = mediaItem.ext || "";

    if (mime.startsWith("image/")) {
      return { type: t("profile.page.sellerCampaignsSection.fileType.image"), variant: "success" };
    } else if (mime.startsWith("video/")) {
      return { type: t("profile.page.sellerCampaignsSection.fileType.video"), variant: "primary" };
    } else if (mime.startsWith("audio/")) {
      return { type: t("profile.page.sellerCampaignsSection.fileType.audio"), variant: "info" };
    } else if (mime.includes("pdf")) {
      return { type: "PDF", variant: "danger" };
    } else {
      return {
        type: ext.replace(".", "").toUpperCase() || t("profile.page.sellerCampaignsSection.fileType.generic"),
        variant: "secondary",
      };
    }
  };

  const formatFileSize = (sizeInKB) => {
    if (!sizeInKB) return "";
    if (sizeInKB < 1024) {
      return `${sizeInKB.toFixed(1)} KB`;
    } else {
      return `${(sizeInKB / 1024).toFixed(1)} MB`;
    }
  };

  if (sellerLoading) return <div>{t("profile.page.sellerCampaignsSection.loading")}</div>;
  if (sellerError) return <Alert variant="warning">{sellerError}</Alert>;
  if (!sellerData?.length) return <Alert variant="info">{t("profile.page.sellerCampaignsSection.noSellers")}</Alert>;

  return (
    <>
      {sellerData.map((shop, idx) => {
        const cd = shop.company_details || {};
        const cps = Array.isArray(shop.campaign_preferences) ? shop.campaign_preferences : [];
        const media = Array.isArray(shop.media) ? shop.media : [];

        return (
          <Card className="mb-4" key={idx}>
            <Card.Header>
              <strong>{cd.company_name || t("profile.page.sellerCampaignsSection.unnamedSeller")}</strong>
              {cd.industry && (
                <Badge bg="secondary" className="ms-2">
                  {cd.industry}
                </Badge>
              )}
            </Card.Header>
            <Card.Body>
              <Row className="mb-2">
                <Col md={6}>
                  <div>
                    <strong>{t("profile.page.sellerCampaignsSection.address")} </strong>
                    {cd.address || "—"}
                  </div>
                </Col>
                <Col md={6}>
                  <div>
                    <strong>ABN:  </strong>
                    {cd.abn || "—"}
                  </div>
                </Col>
              </Row>
              <div className="mb-3">
                <strong>{t("profile.page.sellerCampaignsSection.website")} </strong>
                {cd.website ? (
                  <a href={cd.website} target="_blank" rel="noreferrer">
                    {cd.website}
                  </a>
                ) : (
                  "—"
                )}
              </div>

              <h5 className="mt-3">{t("profile.page.sellerCampaignsSection.promotions")}</h5>
              <Row>
                {cps.length ? (
                  cps.map((cp, i) => (
                    <Col md={6} key={i} className="mb-3">
                      <Card className="h-100">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <strong>{cp.title || t("profile.page.sellerCampaignsSection.untitledPromotion")}</strong>
                            {cp.type && <Badge bg="info">{cp.type}</Badge>}
                          </div>
                          <div className="mb-2">{cp.description || "—"}</div>
                          <div>
                            <strong>{t("profile.page.sellerCampaignsSection.requirement")} </strong>
                            {cp.requirement || t("profile.page.sellerCampaignsSection.none")}
                          </div>
                          <div className="small text-muted">
                            {t("profile.page.sellerCampaignsSection.validUntil")} {cp.valid_until || "—"}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))
                ) : (
                  <Col>
                    <Alert variant="light">{t("profile.page.sellerCampaignsSection.noPromotions")}</Alert>
                  </Col>
                )}
              </Row>

              {/* Media Section */}
              {media.length > 0 && (
                <>
                  <h5 className="mt-3">{t("profile.page.sellerCampaignsSection.media")}</h5>
                  <Row className="mb-3">
                    {media.map((mediaItem, mediaIdx) => {
                      const fileInfo = getFileTypeInfo(mediaItem);
                      return (
                        <Col md={6} lg={4} key={mediaIdx} className="mb-2">
                          <Card className="h-100">
                            <Card.Body className="d-flex flex-column">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <Badge bg={fileInfo.variant} className="mb-1">
                                  {fileInfo.type}
                                </Badge>
                                {mediaItem.size && (
                                  <small className="text-muted">{formatFileSize(mediaItem.size)}</small>
                                )}
                              </div>

                              <div className="mb-2 flex-grow-1">
                                <div className="fw-bold small mb-1">
                                  {mediaItem.name || `${t("profile.page.sellerCampaignsSection.file")} ${mediaItem.id}`}
                                </div>
                                {mediaItem.caption && (
                                  <div className="small text-muted">{mediaItem.caption}</div>
                                )}
                              </div>

                              <div className="mt-auto">
                                <Button
                                  size="sm"
                                  variant="outline-primary"
                                  onClick={() => handleMediaDownload(mediaItem)}
                                  className="w-100"
                                >
                                  {t("profile.page.sellerCampaignsSection.download")}
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      );
                    })}
                  </Row>
                </>
              )}
            </Card.Body>
          </Card>
        );
      })}
    </>
  );
};

export default SellerCampaignsSection;
