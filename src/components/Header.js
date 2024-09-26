import React, { useContext, useState } from "react";
import {
  Image,
  Nav,
  Navbar,
  NavDropdown,
} from "react-bootstrap";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import LoginModal from "./LoginModal"; // Import the new LoginModal component
import "../css/Header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();
  const [showLoginModal, setShowLoginModal] = useState(false); // Manage modal visibility

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    Cookies.set("i18next", lng, { expires: 7 });
  };

  const handleLoginModalOpen = () => setShowLoginModal(true);
  const handleLoginModalClose = () => setShowLoginModal(false);

  return (
    <div>
      <Navbar bg='light' expand='md' fixed='top' className='navbar-custom'>
        <Nav.Link href='/'>
          <Image className='nav-logo' src='/header_logo.png' alt='360 Media' />
        </Nav.Link>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto nav-custom'>
            <Nav.Link href='/productpage'>{t("product")}</Nav.Link>
            <Nav.Link href='/kolpage'>{t("kol")}</Nav.Link>
            <Nav.Link href='/eventpage'>{t("event")}</Nav.Link>
            <Nav.Link href='/sponsor'>{t("sponsor")}</Nav.Link>
            <Nav.Link href='/Contact'>{t("joinus")}</Nav.Link>
            <NavDropdown title={t("language")} id='language-dropdown'>
              <NavDropdown.Item onClick={() => changeLanguage("en")}>
                English
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage("zh")}>
                中文
              </NavDropdown.Item>
            </NavDropdown>

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
              <Nav.Link onClick={handleLoginModalOpen}>
                <i className='bi bi-person nav-icon'></i>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      {/* Login Modal */}
      <LoginModal show={showLoginModal} handleClose={handleLoginModalClose} />
    </div>
  );
};

export default Header;
