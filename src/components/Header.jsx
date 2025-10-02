import Cookies from "js-cookie";
import React, { useState, useContext } from "react";
import { Image, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import "../css/Header.css";
import LoginModal from "./LoginModal.jsx";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [show, setShow] = useState(false);

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    Cookies.set("i18next", lng, { expires: 7 });
    console.log(`Set Lang to ${lng}.`);
    setShow(false);
  };

  return (
    <div>
      
      <Navbar expand='lg' className='navbar-custom'>
        <Navbar.Toggle aria-controls='basic-navbar-nav'/>
        <Navbar.Brand href='/' className='navbar-brand-custom'>
          <Image className='nav-logo' src='/360_logo.png' alt='360 Media' />
        </Navbar.Brand>
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='gap-3 nav-custom'>
            <Nav.Link href='/'>{t("home")}</Nav.Link>
            {/* <Nav.Link href='/brands'>{t("brands")}</Nav.Link>
            <Nav.Link href='/products'>{t("product")}</Nav.Link> */}

            {/* <NavDropdown
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

            <NavDropdown
              title='媒体中心'
              id='media-dropdown'
              className='dropdown-container'
            >
              <NavDropdown.Item href='/news'>新闻</NavDropdown.Item>
              <NavDropdown.Item href='/events'>活动</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown
              title={t("资源")}
              id='networks-dropdown'
              className='dropdown-container'
            >
              <NavDropdown.Item href='/influencer'>网红</NavDropdown.Item>
              <NavDropdown.Item href='/group'>社团</NavDropdown.Item>
            </NavDropdown>
            {/* <Nav.Link href='/networks'>{t("资源")}</Nav.Link> */}
            <Nav.Link href='/about-us'>{t("About_us")}</Nav.Link>
            {/* <Nav.Link href='/join-us'>{t("joinus")}</Nav.Link> */}

            <NavDropdown
              title={<i className="bi bi-translate"></i>}
              id="language-dropdown"
              className="dropdown-container"
              show={show}
              onToggle={(nextShow) => setShow(nextShow)}
            >
              <NavDropdown.Item onClick={() => changeLanguage("en")}>
                English
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage("zh")}>
                中文
              </NavDropdown.Item>
            </NavDropdown>

            {user ? (
              <>
                {/*
                <Nav.Link href='/cart'>
                  <i className='bi bi-cart nav-icon'></i>
                </Nav.Link>*/}

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
                <i className='bi bi-person nav-icon'>登录</i>
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
