import React from "react";
import { Nav, Navbar, Image } from "react-bootstrap";
import "../css/Header.css";

const Header = () => {
  return (
    <div>
      {/* ====== ! Commented for deprecated version ! =====
        <header className='App-header'>
          <Navbar expand='lg' className='navbar-custom'>
          <Nav.Link href='/'><Image className="nav-logo" src="header_logo.png" alt="360 Media" /></Nav.Link>
            <Nav className="ml-auto">
                <Nav.Link href='/kolpage' className="text-nav-link">KOL</Nav.Link>
                <Nav.Link href='/About-Us' className="text-nav-link">EVENTS</Nav.Link>
                <Nav.Link href='/About-Us' className="text-nav-link">CONTACT</Nav.Link>
                <Nav.Link href='/login'><i class="bi bi-person"></i></Nav.Link>
                <Nav.Link href='/cart'><i class="bi bi-cart2"></i></Nav.Link>
            </Nav>
          </Navbar>
        </header>
      */}
      <Navbar bg="light" expand="lg" className='navbar-custom'>
        <Nav.Link href='/'><Image className="nav-logo" src="header_logo.png" alt="360 Media" /></Nav.Link>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link href="#kolpage">KOL</Nav.Link>
            <Nav.Link href="#About-Us">Events</Nav.Link>
            <Nav.Link href="#About-Us">Contact</Nav.Link>
            <Nav.Link href="#login"><i className="bi bi-person nav-icon"></i></Nav.Link>
            <Nav.Link href="#cart"><i className="bi bi-cart nav-icon"></i></Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
};

export default Header;
