import { Alert, Badge, Card, Col, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const InfluencerProfileSection = ({ inflLoading, inflError, influencerProfile }) => {
  const fmt = (v) => (typeof v === "number" ? v.toLocaleString() : v ?? "—");
  const arr = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  const isObj = (v) => v && typeof v === "object";
  const { t } = useTranslation();

  const SocialButton = ({ url, label }) => {
    if (!url) return null;
    return (
      <a
        href={url}
        target='_blank'
        rel='noreferrer'
        className='btn btn-outline-primary btn-sm'
      >
        {label || "Visit"}
      </a>
    );
  };

  const renderPersonalDetails = (pd) => {
    if (!isObj(pd)) return <Alert variant='light'>暂无个人信息</Alert>;
    const {
      name,
      gender,
      age,
      location,
      languages,
      categories,
      followers,
      contact_email,
    } = pd;

    const fIG = followers?.instagram;
    const fTT = followers?.tiktok;
    const fYT = followers?.youtube;

    return (
      <Card className="mb-3">
        <Card.Header>
          <strong>{t("profile.page.influencerProfileSection.title")}</strong>
        </Card.Header>
        <Card.Body>
          <Row className="mb-2">
            <Col md={6}>
              <div>
                <strong>{t("profile.page.influencerProfileSection.name")}</strong>
                {fmt(name)}
              </div>
            </Col>
            <Col md={6}>
              <div>
                <strong>{t("profile.page.influencerProfileSection.gender")}</strong>
                {fmt(gender)}
              </div>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <div>
                <strong>{t("profile.page.influencerProfileSection.age")}</strong>
                {fmt(age)}
              </div>
            </Col>
            <Col md={6}>
              <div>
                <strong>{t("profile.page.influencerProfileSection.city")}</strong>
                {fmt(location)}
              </div>
            </Col>
          </Row>

          <Row className="mb-2">
            <Col md={6}>
              <div className="mb-1">
                <strong>{t("profile.page.influencerProfileSection.languages")}</strong>
              </div>
              {arr(languages).length
                ? arr(languages).map((l, i) => (
                  <Badge key={i} bg="secondary" className="me-2">
                    {l}
                  </Badge>
                ))
                : "—"}
            </Col>
            <Col md={6}>
              <div className="mb-1">
                <strong>{t("profile.page.influencerProfileSection.categories")}</strong>
              </div>
              {arr(categories).length
                ? arr(categories).map((c, i) => (
                  <Badge key={i} bg="info" className="me-2">
                    {c}
                  </Badge>
                ))
                : "—"}
            </Col>
          </Row>

          <Row className="mb-3">
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <div className="small text-muted">
                    {t("profile.page.influencerProfileSection.instagramFollowers")}
                  </div>
                  <div className="fs-4">{fmt(fIG)}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <div className="small text-muted">
                    {t("profile.page.influencerProfileSection.tiktokFollowers")}
                  </div>
                  <div className="fs-4">{fmt(fTT)}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="text-center">
                <Card.Body>
                  <div className="small text-muted">
                    {t("profile.page.influencerProfileSection.youtubeSubscribers")}
                  </div>
                  <div className="fs-4">{fmt(fYT)}</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div>
            <strong>{t("profile.page.influencerProfileSection.email")}</strong>
            {contact_email ? (
              <a href={`mailto:${contact_email}`} className="ms-1">
                {contact_email}
              </a>
            ) : (
              "—"
            )}
          </div>
        </Card.Body>
      </Card>
    );
  };

  const renderSocialPlatforms = (sp) => {
    if (!isObj(sp)) {
      return (
        <Alert variant="light">
          {t("profile.page.influencerProfileSection.noSocialPlatforms")}
        </Alert>
      );
    }

    const platformCards = [];

    if (sp.instagram) {
      const ig = sp.instagram;
      platformCards.push(
        <Col md={4} key="ig" className="mb-3">
          <Card className="h-100">
            <Card.Header>Instagram</Card.Header>
            <Card.Body>
              <div className="mb-2">
                <strong>{t("profile.page.influencerProfileSection.account")}</strong>
                {fmt(ig.handle)}
              </div>
              <div className="mb-2">
                <strong>{t("profile.page.influencerProfileSection.engagementRate")}</strong>
                {fmt(ig.engagement_rate)}
              </div>
              <SocialButton url={ig.url} label={t("profile.page.influencerProfileSection.viewProfile")} />
            </Card.Body>
          </Card>
        </Col>
      );
    }

    if (sp.tiktok) {
      const tt = sp.tiktok;
      platformCards.push(
        <Col md={4} key="tt" className="mb-3">
          <Card className="h-100">
            <Card.Header>TikTok</Card.Header>
            <Card.Body>
              <div className="mb-2">
                <strong>{t("profile.page.influencerProfileSection.account")}</strong>
                {fmt(tt.handle)}
              </div>
              <div className="mb-2">
                <strong>{t("profile.page.influencerProfileSection.engagementRate")}</strong>
                {fmt(tt.engagement_rate)}
              </div>
              <SocialButton url={tt.url} label={t("profile.page.influencerProfileSection.viewProfile")} />
            </Card.Body>
          </Card>
        </Col>
      );
    }

    if (sp.youtube) {
      const yt = sp.youtube;
      platformCards.push(
        <Col md={4} key="yt" className="mb-3">
          <Card className="h-100">
            <Card.Header>YouTube</Card.Header>
            <Card.Body>
              <div className="mb-2">
                <strong>{t("profile.page.influencerProfileSection.channel")}</strong>
                {fmt(yt.channel_name)}
              </div>
              <div className="mb-2">
                <strong>{t("profile.page.influencerProfileSection.subscribers")}</strong>
                {fmt(yt.subscribers)}
              </div>
              <SocialButton url={yt.url} label={t("profile.page.influencerProfileSection.viewChannel")} />
            </Card.Body>
          </Card>
        </Col>
      );
    }

    const known = ["instagram", "tiktok", "youtube"];
    Object.keys(sp).forEach((k) => {
      if (!known.includes(k)) {
        const v = sp[k];
        platformCards.push(
          <Col md={4} key={k} className="mb-3">
            <Card className="h-100">
              <Card.Header>{k}</Card.Header>
              <Card.Body>
                {isObj(v) ? (
                  <>
                    {Object.entries(v).map(([kk, vv]) => (
                      <div className="mb-2" key={kk}>
                        <strong>{kk}：</strong>
                        {fmt(vv)}
                      </div>
                    ))}
                    <SocialButton url={v?.url} label={t("profile.page.influencerProfileSection.visit")} />
                  </>
                ) : (
                  <div>{fmt(v)}</div>
                )}
              </Card.Body>
            </Card>
          </Col>
        );
      }
    });

    return (
      <Card>
        <Card.Header>
          <strong>{t("profile.page.influencerProfileSection.socialPlatforms")}</strong>
        </Card.Header>
        <Card.Body>
          <Row>
            {platformCards.length ? (
              platformCards
            ) : (
              <Col>
                <Alert variant="light">
                  {t("profile.page.influencerProfileSection.noData")}
                </Alert>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    );
  };

  if (inflLoading) return <div>{t("profile.page.influencerProfileSection.loading")}</div>;
  if (inflError) return <Alert variant="danger">{inflError}</Alert>;

  if (!influencerProfile) {
    return (
      <Alert variant="info" className="mt-2">
        {t("profile.page.influencerProfileSection.noProfile")}
      </Alert>
    );
  }

  return (
    <>
      {renderPersonalDetails(influencerProfile.personal_details)}
      {renderSocialPlatforms(influencerProfile.social_platforms)}
    </>
  );
};

export default InfluencerProfileSection;