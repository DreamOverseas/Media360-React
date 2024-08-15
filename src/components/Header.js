import React, { useContext } from "react";
import { Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import { AuthContext } from "../context/AuthContext";
import "../css/Header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { t, i18n } = useTranslation();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <Navbar bg='light' expand='lg' fixed='top' className='navbar-custom'>
        <Nav.Link href='/'>
          <Image className='nav-logo' src='/header_logo.png' alt='360 Media' />
        </Nav.Link>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link href='/kolpage'>{t("kol")}</Nav.Link>
            <Nav.Link href='/eventpage'>{t("events")}</Nav.Link>
            <Nav.Link href='/Contact'>{t("contact")}</Nav.Link>
            <Nav.Link href='/cart'>
              <i className='bi bi-cart nav-icon'></i>
            </Nav.Link>
            <NavDropdown title={t("language")} id='language-dropdown'>
              <NavDropdown.Item onClick={() => changeLanguage("en")}>
                {t("english")}
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => changeLanguage("zh")}>
                {t("chinese")}
              </NavDropdown.Item>
            </NavDropdown>

            {user ? (
              <NavDropdown title={user.username} id='basic-nav-dropdown'>
                <NavDropdown.Item href='/profile'>
                  {t("myProfile")}
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href='/' onClick={logout}>
                  {t("logout")}
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link href='/login'>
                <i className='bi bi-person nav-icon'></i>
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
