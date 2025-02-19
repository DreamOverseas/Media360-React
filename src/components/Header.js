import React, { useContext, useState } from "react";
import { Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import LoginModal from "./LoginModal";
import "../css/Header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [showLanguageDrawer, setShowLanguageDrawer] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    Cookies.set("i18next", lng, { expires: 7 });
    setShowLanguageDrawer(false); // 关闭抽屉
  };

  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
    document.body.classList.toggle("menu-open", !showDrawer);
  };

  const toggleLanguageDrawer = () => {
    setShowLanguageDrawer(!showLanguageDrawer);
    document.body.classList.toggle("menu-open", !showLanguageDrawer);
  };

  return (
    <div>
      <Navbar bg="light" expand="md" fixed="top" className="navbar-custom">
        <Nav.Link href="/">
          <Image className="nav-logo" src="/header_logo.png" alt="360 Media" />
        </Nav.Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto nav-custom">
            <Nav.Link href="/">{t("home")}</Nav.Link>
            <Nav.Link href="/brands">{t("brands")}</Nav.Link>
            <Nav.Link href="/productpage">{t("product")}</Nav.Link>

            {/* 星潮汇 - 桌面端 Hover，移动端 Click */}
            <Nav.Item className="d-flex align-items-center dropdown-container">
              <Nav.Link href="#" onClick={toggleDrawer}>
                星潮汇
              </Nav.Link>
              <div className={`dropdown-menu drawer-menu ${showDrawer ? "show" : ""}`}>
                <NavDropdown.Item href="/founders">品牌创始人</NavDropdown.Item>
                <NavDropdown.Item href="/kols">产品意见领袖</NavDropdown.Item>
                <NavDropdown.Item href="/ambassadors">产品代言人</NavDropdown.Item>
              </div>
            </Nav.Item>

            {/* 媒体中心 - 桌面端 Hover，移动端 Click */}
            <Nav.Item className="d-flex align-items-center dropdown-container">
              <Nav.Link href="#" onClick={toggleDrawer}>
                媒体中心
              </Nav.Link>
              <div className={`dropdown-menu drawer-menu ${showDrawer ? "show" : ""}`}>
                <NavDropdown.Item href="/news">新闻</NavDropdown.Item>
                <NavDropdown.Item href="/events">活动</NavDropdown.Item>
              </div>
            </Nav.Item>

            <Nav.Link href="/join-us">{t("joinus")}</Nav.Link>

            {/* 语言切换 - 现在与“星潮汇”一致 */}
            <Nav.Item className="d-flex align-items-center dropdown-container">
              <Nav.Link href="#" onClick={toggleLanguageDrawer}>
                {t("language")}
              </Nav.Link>
              <div className={`dropdown-menu drawer-menu ${showLanguageDrawer ? "show" : ""}`}>
                <NavDropdown.Item onClick={() => changeLanguage("en")}>
                  English
                </NavDropdown.Item>
                <NavDropdown.Item onClick={() => changeLanguage("zh")}>
                  中文
                </NavDropdown.Item>
              </div>
            </Nav.Item>

            {/* 登录 / 个人信息 */}
            {user ? (
              <>
                <Nav.Link href="/cart">
                  <i className="bi bi-cart nav-icon"></i>
                </Nav.Link>
                <NavDropdown title={user.username} id="basic-nav-dropdown">
                  <NavDropdown.Item href="/profile">
                    {t("myProfile")}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="/" onClick={logout}>
                    {t("logout")}
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link onClick={setShowLoginModal}>
                <i className="bi bi-person nav-icon"></i>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* 登录模态框 */}
      <LoginModal show={showLoginModal} handleClose={() => setShowLoginModal(false)} />
    </div>
  );
};

export default Header;