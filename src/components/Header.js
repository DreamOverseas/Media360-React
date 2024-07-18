import React, { useContext } from "react";
import { Image, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import "../css/Header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div>
      <Navbar bg='light' expand='lg' fixed='top' className='navbar-custom'>
        <Nav.Link href='/'>
          <Image className='nav-logo' src='header_logo.png' alt='360 Media' />
        </Nav.Link>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            <Nav.Link href='/kolpage'>KOL</Nav.Link>
            <Nav.Link href='/eventpage'>Events</Nav.Link>
            <Nav.Link href='/Contact'>Contact</Nav.Link>
            <Nav.Link href='/cart'>
              <i className='bi bi-cart nav-icon'></i>
            </Nav.Link>

            {user ? (
              <NavDropdown title={user.username} id='basic-nav-dropdown'>
                <NavDropdown.Item href='/profile'>
                  My Profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href='/' onClick={logout}>
                  Logout
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
