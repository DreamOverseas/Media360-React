import axios from "axios";
import Cookies from "js-cookie";
import { useContext, useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Nav,
  Row,
} from "react-bootstrap";
import SellerCoupon from "../components/SellerCoupon.jsx";
import { AuthContext } from "../context/AuthContext.jsx";
import "../css/Profile.css";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [warning, setWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);

  // 修改密码相关
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  // 网红资料
  const [inflLoading, setInflLoading] = useState(false);
  const [inflError, setInflError] = useState("");
  const [influencerProfile, setInfluencerProfile] = useState(null);

  const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
  const maxNameLen = 16;
  const maxBioLen = 500;

  useEffect(() => {
    if (user && user.avatar) {
      setAvatarUrl(`${BACKEND_HOST}${user.avatar.url}`);
    } else {
      setAvatarUrl("default-avatar.jpg");
    }
  }, [BACKEND_HOST, user]);

  // —— 拉取 influencer_profile，多策略（/users/me 优先，失败则反查内容类型）
  useEffect(() => {
    const fetchInfluencerProfile = async () => {
      if (!user || user?.roletype !== "Influencer") return;

      console.groupCollapsed("%c[InfluencerProfile] fetch start", "color:#0aa");
      const token = Cookies.get("token");

      const setFromRecord = (record, label) => {
        if (!record) {
          setInfluencerProfile(null);
          return false;
        }
        const attrs = record.attributes ?? record;
        const personal_details = attrs?.personal_details ?? null;
        const social_platforms = attrs?.social_platforms ?? null;
        setInfluencerProfile({ personal_details, social_platforms });
        return true;
      };

      try {
        setInflLoading(true);
        setInflError("");

        // A) /users/me + populate
        try {
          const r = await axios.get(`${BACKEND_HOST}/api/users/me`, {
            params: { "populate[influencer_profile][populate]": "*" },
            headers: { Authorization: `Bearer ${token}` },
          });
          let prof = r?.data?.influencer_profile ?? null;
          if (prof?.data) prof = prof.data;
          if (Array.isArray(prof)) prof = prof[0] ?? null;
          if (setFromRecord(prof, "A:/users/me")) {
            console.groupEnd();
            return;
          }
        } catch (eA) {
          // 继续走 B
        }

        // helper: /api/influencer-profiles
        const fetchByFilter = async filterObj => {
          const r = await axios.get(`${BACKEND_HOST}/api/influencer-profiles`, {
            params: {
              ...filterObj,
              "fields[0]": "personal_details",
              "fields[1]": "social_platforms",
            },
            headers: { Authorization: `Bearer ${token}` },
          });
          const list = r?.data?.data ?? [];
          return list[0] ?? null;
        };

        // B1) users_permissions_user.id
        try {
          const p1 = await fetchByFilter({
            "filters[users_permissions_user][id][$eq]": user.id,
          });
          if (
            setFromRecord(
              p1,
              "B1:/influencer-profiles by users_permissions_user.id"
            )
          ) {
            console.groupEnd();
            return;
          }
        } catch {}

        // B2) users_permissions_user.documentId（Strapi v5）
        try {
          const p2 = await fetchByFilter({
            "filters[users_permissions_user][documentId][$eq]": user.documentId,
          });
          if (
            setFromRecord(
              p2,
              "B2:/influencer-profiles by users_permissions_user.documentId"
            )
          ) {
            console.groupEnd();
            return;
          }
        } catch {}

        // B3) 字段若叫 user
        try {
          const p3 = await fetchByFilter({ "filters[user][id][$eq]": user.id });
          if (setFromRecord(p3, "B3:/influencer-profiles by user.id")) {
            console.groupEnd();
            return;
          }
        } catch {}

        setInfluencerProfile(null);
      } catch (err) {
        setInflError(
          err?.response?.data?.error?.message ||
            err?.message ||
            "Failed to load influencer profile."
        );
      } finally {
        setInflLoading(false);
        console.groupEnd();
      }
    };

    fetchInfluencerProfile();
  }, [user, BACKEND_HOST]);

  const handleFileChange = e => setAvatar(e.target.files[0]);

  const openEdit = () => {
    setUsername(user.username);
    setBio(user.bio);
    setShow(true);
  };

  const closeEdit = () => setShow(false);

  const handleUsernameChange = value =>
    value.length <= maxNameLen && setUsername(value);
  const handleBioChange = value => value.length <= maxBioLen && setBio(value);

  const handleSave = async () => {
    if (username === user.username && bio === user.bio && avatar == null) {
      closeEdit();
    }
    try {
      const token = Cookies.get("token");
      let avatarId = user.avatar?.id;

      if (avatar && avatar !== null) {
        const formData = new FormData();
        formData.append("files", avatar);
        const uploadRes = await axios.post(
          `${BACKEND_HOST}/api/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        avatarId = uploadRes.data[0].id;
      }

      const res = await axios.put(
        `${BACKEND_HOST}/api/users/${user.id}`,
        {
          username,
          bio,
          avatar: avatarId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data);
      closeEdit();
    } catch (error) {
      setErrorMessage("Error saving profile. Please try again.");
    }
    window.location.reload();
  };

  const handleCancel = () => {
    if (username !== user.username || bio !== user.bio || avatar !== null) {
      setWarning(true);
    } else {
      closeEdit();
    }
  };

  const handleDiscardChanges = () => {
    setWarning(false);
    closeEdit();
  };

  const handlePasswordChange = async e => {
    e.preventDefault();
    setPasswordMsg("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg("请填写所有字段");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("两次新密码输入不一致");
      return;
    }
    if (oldPassword === newPassword) {
      setPasswordMsg("新密码不能与原密码相同");
      return;
    }

    try {
      const token = Cookies.get("token");
      await axios.post(
        `${BACKEND_HOST}/api/auth/change-password`,
        {
          currentPassword: oldPassword,
          password: newPassword,
          passwordConfirmation: confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPasswordMsg("密码修改成功");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg("密码修改失败，请检查原密码是否正确");
    }
  };

  // --------- 展示用工具函数 ----------
  const fmt = v => (typeof v === "number" ? v.toLocaleString() : v ?? "—");
  const arr = v => (Array.isArray(v) ? v : v ? [v] : []);
  const isObj = v => v && typeof v === "object";

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

  const renderPersonalDetails = pd => {
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

  const renderSocialPlatforms = sp => {
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

    // 其他平台（如有）兜底展示
    const known = ["instagram", "tiktok", "youtube"];
    Object.keys(sp).forEach(k => {
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

  return (
    <Container
      className='profile-dashboard-container py-4'
      style={{ minHeight: "80vh" }}
    >
      <Row className='gx-4 align-items-start'>
        {/* 左侧菜单 */}
        <Col md={3} className='dashboard-sidebar'>
          <div className='sidebar-menu'>
            <div className='d-flex flex-column align-items-center sidebar-avatar text-center mb-4'>
              <img
                src={avatarUrl}
                alt='Profile'
                className='img-fluid rounded-circle profile-avatar'
                style={{ width: 100, height: 100, objectFit: "cover" }}
              />
              <div className='mt-2'>{user?.username}</div>
            </div>
            <Nav
              variant='pills'
              className='flex-column'
              activeKey={activeTab}
              onSelect={setActiveTab}
            >
              <Nav.Item>
                <Nav.Link eventKey='profile'>个人信息</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey='password'>修改密码</Nav.Link>
              </Nav.Item>
              {user?.roletype === "Influencer" && (
                <Nav.Item>
                  <Nav.Link eventKey='influencer'>网红信息</Nav.Link>
                </Nav.Item>
              )}
              {user?.roletype === "Seller" && (
                <Nav.Item>
                  <Nav.Link eventKey='seller'>卖家信息</Nav.Link>
                </Nav.Item>
              )}
            </Nav>
          </div>
        </Col>

        {/* 右侧内容 */}
        <Col md={9} className='dashboard-content mt-0'>
          {activeTab === "profile" && (
            <div className='profile-info-section' style={{ marginTop: 0 }}>
              <div className='d-flex justify-content-between align-items-center'>
                <h3>个人信息</h3>
                <Button variant='primary' onClick={openEdit}>
                  编辑
                </Button>
              </div>
              <hr />
              <Row>
                <Col md={3}>
                  <strong>用户名：</strong>
                </Col>
                <Col md={9}>{user?.username}</Col>
              </Row>
              <Row className='mt-2'>
                <Col md={3}>
                  <strong>简介：</strong>
                </Col>
                <Col md={9}>{user?.bio}</Col>
              </Row>
            </div>
          )}

          {activeTab === "password" && (
            <div className='password-section'>
              <h3>修改密码</h3>
              <hr />
              <Form onSubmit={handlePasswordChange}>
                <Form.Group className='mb-3' controlId='oldPassword'>
                  <Form.Label>原密码</Form.Label>
                  <Form.Control
                    type='password'
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className='mb-3' controlId='newPassword'>
                  <Form.Label>新密码</Form.Label>
                  <Form.Control
                    type='password'
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className='mb-3' controlId='confirmPassword'>
                  <Form.Label>确认新密码</Form.Label>
                  <Form.Control
                    type='password'
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                </Form.Group>

                {passwordMsg && (
                  <Alert
                    variant={
                      passwordMsg.includes("成功") ? "success" : "danger"
                    }
                  >
                    {passwordMsg}
                  </Alert>
                )}

                <Button variant='primary' type='submit'>
                  保存
                </Button>
              </Form>
            </div>
          )}

          {activeTab === "influencer" && user?.roletype === "Influencer" && (
            <div className='influencer-section'>
              <h3>网红信息</h3>
              <hr />

              {inflLoading && <div>正在加载网红资料...</div>}
              {inflError && <Alert variant='danger'>{inflError}</Alert>}

              {!inflLoading &&
                !inflError &&
                (influencerProfile ? (
                  <>
                    {renderPersonalDetails(influencerProfile.personal_details)}
                    {renderSocialPlatforms(influencerProfile.social_platforms)}
                  </>
                ) : (
                  <Alert variant='info' className='mt-2'>
                    暂无网红资料，你可以在后台（influencer_profile）为该用户填写
                    <code> personal_details </code> 和{" "}
                    <code> social_platforms </code> 两个 JSON 字段。
                  </Alert>
                ))}
            </div>
          )}

          {activeTab === "seller" && user?.roletype === "Seller" && (
            <div className='seller-section'>
              <h3>卖家信息</h3>
              <hr />
              <SellerCoupon user={user} />
            </div>
          )}
        </Col>
      </Row>

      {/* 编辑个人信息弹窗 */}
      <Modal show={show} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>编辑个人信息</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
          <Form>
            <Form.Group controlId='formUsername'>
              <Form.Label>用户名</Form.Label>
              <Form.Control
                type='text'
                value={username}
                onChange={e => handleUsernameChange(e.target.value)}
                placeholder='请输入用户名'
                maxLength={maxNameLen}
              />
            </Form.Group>

            <Form.Group controlId='formBio' className='mt-3'>
              <Form.Label>简介</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                value={bio}
                onChange={e => handleBioChange(e.target.value)}
                placeholder='请输入简介'
                maxLength={maxBioLen}
              />
            </Form.Group>

            <Form.Group controlId='formAvatar' className='mt-3'>
              <Form.Label>头像</Form.Label>
              <Form.Control
                type='file'
                accept='image/*'
                onChange={handleFileChange}
              />
              <Form.Text muted>建议选择方形图片以获得最佳显示效果</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCancel}>
            取消
          </Button>
          <Button variant='primary' onClick={handleSave}>
            保存
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 放弃更改警告弹窗 */}
      <Modal show={warning} onHide={() => setWarning(false)}>
        <Modal.Header closeButton>
          <Modal.Title>放弃更改？</Modal.Title>
        </Modal.Header>
        <Modal.Body>你有未保存的更改，确定要放弃吗？</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setWarning(false)}>
            继续编辑
          </Button>
          <Button variant='danger' onClick={handleDiscardChanges}>
            放弃更改
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Profile;
