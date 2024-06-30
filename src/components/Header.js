import React from "react";
import { Nav, Navbar, Image } from "react-bootstrap";
import "../css/Header.css";

const Header = () => {
  return (
    <div>
      <Navbar bg="light" expand="lg" fixed="top" className='navbar-custom'>
        <Nav.Link href='/'><Image className="nav-logo" src="header_logo.png" alt="360 Media" /></Nav.Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="/kolpage">KOL</Nav.Link>
            <Nav.Link href="/eventpage">Events</Nav.Link>
            <Nav.Link href="/About-Us">Contact</Nav.Link>
            <Nav.Link href="/login"><i className="bi bi-person nav-icon"></i></Nav.Link>
            <Nav.Link href="/cart"><i className="bi bi-cart nav-icon"></i></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
