import Cookies from "js-cookie";
import React, { useContext, useState } from "react";
import { Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import "../css/Header.css";
import LoginModal from "./LoginModal";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    Cookies.set("i18next", lng, { expires: 7 });
  };

  return (
    <div>
      <Navbar bg='light' expand='lg' fixed='top' className='navbar-custom'>
        <Navbar.Brand href='/'>
          <Image className='nav-logo' src='/header_logo.png' alt='360 Media' />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto nav-custom'>
            <Nav.Link href='/'>{t("home")}</Nav.Link>
            {/*<Nav.Link href='/brands'>{t("brands")}</Nav.Link> */}
            <Nav.Link href='/products'>{t("product")}</Nav.Link>

            {/* 星潮汇 - 桌面端 Hover，移动端 Click */}
            {/*<NavDropdown
              title='星潮汇'
              id='star-dropdown'
              className='dropdown-container'
            >
              <NavDropdown.Item href='/founders'>品牌创始人</NavDropdown.Item>
              <NavDropdown.Item href='/kols'>产品意见领袖</NavDropdown.Item>
              <NavDropdown.Item href='/ambassadors'>
                产品代言人
              </NavDropdown.Item>
            </NavDropdown> */}

            {/* 媒体中心 - 桌面端 Hover，移动端 Click */}
            {/*<NavDropdown
              title='媒体中心'
              id='media-dropdown'
              className='dropdown-container'
            >
              <NavDropdown.Item href='/news'>新闻</NavDropdown.Item>
              <NavDropdown.Item href='/events'>活动</NavDropdown.Item>
            </NavDropdown> */}

            <Nav.Link href='/join-us'>{t("joinus")}</Nav.Link>

            {/* 语言切换 */}
            <NavDropdown
              title={t("language")}
              id='language-dropdown'
              className='dropdown-container'
            >
              <NavDropdown.Item onClick={() => changeLanguage("en")}>
                English
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage("zh")}>
                中文
              </NavDropdown.Item>
            </NavDropdown>

            {/* 登录 / 个人信息 */}
            {user ? (
              <>
                <Nav.Link href='/cart'>
                  <i className='bi bi-cart nav-icon'></i>
                </Nav.Link>
                <NavDropdown title={user.username} id='basic-nav-dropdown'>
                  <NavDropdown.Item href='/profile'>
                    {t("myProfile")}
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href='/' onClick={logout}>
                    {t("logout")}
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link onClick={() => setShowLoginModal(true)}>
                <i className='bi bi-person nav-icon'></i>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* 登录模态框 */}
      <LoginModal
        show={showLoginModal}
        handleClose={() => setShowLoginModal(false)}
      />
    </div>
  );
};

export default Header;
