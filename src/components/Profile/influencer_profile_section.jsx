import { Alert, Badge, Card, Col, Row } from "react-bootstrap";

const InfluencerProfileSection = ({ inflLoading, inflError, influencerProfile }) => {
  const fmt = (v) => (typeof v === "number" ? v.toLocaleString() : v ?? "—");
  const arr = (v) => (Array.isArray(v) ? v : v ? [v] : []);
  const isObj = (v) => v && typeof v === "object";

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
      <Card className='mb-3'>
        <Card.Header>
          <strong>个人信息</strong>
        </Card.Header>
        <Card.Body>
          <Row className='mb-2'>
            <Col md={6}>
              <div>
                <strong>姓名：</strong>
                {fmt(name)}
              </div>
            </Col>
            <Col md={6}>
              <div>
                <strong>性别：</strong>
                {fmt(gender)}
              </div>
            </Col>
          </Row>
          <Row className='mb-2'>
            <Col md={6}>
              <div>
                <strong>年龄：</strong>
                {fmt(age)}
              </div>
            </Col>
            <Col md={6}>
              <div>
                <strong>所在城市：</strong>
                {fmt(location)}
              </div>
            </Col>
          </Row>

          <Row className='mb-2'>
            <Col md={6}>
              <div className='mb-1'>
                <strong>语言：</strong>
              </div>
              {arr(languages).length
                ? arr(languages).map((l, i) => (
                    <Badge key={i} bg='secondary' className='me-2'>
                      {l}
                    </Badge>
                  ))
                : "—"}
            </Col>
            <Col md={6}>
              <div className='mb-1'>
                <strong>内容领域：</strong>
              </div>
              {arr(categories).length
                ? arr(categories).map((c, i) => (
                    <Badge key={i} bg='info' className='me-2'>
                      {c}
                    </Badge>
                  ))
                : "—"}
            </Col>
          </Row>

          <Row className='mb-3'>
            <Col md={4}>
              <Card className='text-center'>
                <Card.Body>
                  <div className='small text-muted'>Instagram 粉丝</div>
                  <div className='fs-4'>{fmt(fIG)}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className='text-center'>
                <Card.Body>
                  <div className='small text-muted'>TikTok 粉丝</div>
                  <div className='fs-4'>{fmt(fTT)}</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className='text-center'>
                <Card.Body>
                  <div className='small text-muted'>YouTube 订阅</div>
                  <div className='fs-4'>{fmt(fYT)}</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <div>
            <strong>联系邮箱：</strong>
            {contact_email ? (
              <a href={`mailto:${contact_email}`} className='ms-1'>
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
    if (!isObj(sp)) return <Alert variant='light'>暂无社交平台信息</Alert>;

    const platformCards = [];

    if (sp.instagram) {
      const ig = sp.instagram;
      platformCards.push(
        <Col md={4} key='ig' className='mb-3'>
          <Card className='h-100'>
            <Card.Header>Instagram</Card.Header>
            <Card.Body>
              <div className='mb-2'>
                <strong>账号：</strong>
                {fmt(ig.handle)}
              </div>
              <div className='mb-2'>
                <strong>互动率：</strong>
                {fmt(ig.engagement_rate)}
              </div>
              <SocialButton url={ig.url} label='查看主页' />
            </Card.Body>
          </Card>
        </Col>
      );
    }

    if (sp.tiktok) {
      const tt = sp.tiktok;
      platformCards.push(
        <Col md={4} key='tt' className='mb-3'>
          <Card className='h-100'>
            <Card.Header>TikTok</Card.Header>
            <Card.Body>
              <div className='mb-2'>
                <strong>账号：</strong>
                {fmt(tt.handle)}
              </div>
              <div className='mb-2'>
                <strong>互动率：</strong>
                {fmt(tt.engagement_rate)}
              </div>
              <SocialButton url={tt.url} label='查看主页' />
            </Card.Body>
          </Card>
        </Col>
      );
    }

    if (sp.youtube) {
      const yt = sp.youtube;
      platformCards.push(
        <Col md={4} key='yt' className='mb-3'>
          <Card className='h-100'>
            <Card.Header>YouTube</Card.Header>
            <Card.Body>
              <div className='mb-2'>
                <strong>频道：</strong>
                {fmt(yt.channel_name)}
              </div>
              <div className='mb-2'>
                <strong>订阅数：</strong>
                {fmt(yt.subscribers)}
              </div>
              <SocialButton url={yt.url} label='查看频道' />
            </Card.Body>
          </Card>
        </Col>
      );
    }

    // 其他平台处理
    const known = ["instagram", "tiktok", "youtube"];
    Object.keys(sp).forEach((k) => {
      if (!known.includes(k)) {
        const v = sp[k];
        platformCards.push(
          <Col md={4} key={k} className='mb-3'>
            <Card className='h-100'>
              <Card.Header>{k}</Card.Header>
              <Card.Body>
                {isObj(v) ? (
                  <>
                    {Object.entries(v).map(([kk, vv]) => (
                      <div className='mb-2' key={kk}>
                        <strong>{kk}：</strong>
                        {fmt(vv)}
                      </div>
                    ))}
                    <SocialButton url={v?.url} label='访问' />
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
          <strong>社交平台</strong>
        </Card.Header>
        <Card.Body>
          <Row>
            {platformCards.length ? (
              platformCards
            ) : (
              <Col>
                <Alert variant='light'>暂无数据</Alert>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    );
  };

  if (inflLoading) return <div>正在加载网红资料...</div>;
  if (inflError) return <Alert variant='danger'>{inflError}</Alert>;
  
  if (!influencerProfile) {
    return (
      <Alert variant='info' className='mt-2'>
        暂无网红资料，你可以在后台（influencer_profile）为该用户填写
        <code> personal_details </code> 和{" "}
        <code> social_platforms </code> 两个 JSON 字段。
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