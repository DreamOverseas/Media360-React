import React from "react";
import { Nav, Navbar, Image } from "react-bootstrap";
import "../css/Header.css";

const Header = () => {
  return (
    <header className='App-header'>
      <Navbar expand='lg' className='navbar-custom'>
        {/* <Image className="nav-logo" src="logo192.png" /> */}
        <Navbar.Brand href='/' className='navbar-brand'>
          360 Media
        </Navbar.Brand>
        <div className='navbar-content'>
            <Nav.Link href='/home'>HOME</Nav.Link>
            <Nav.Link href='/kolpage'>KOL</Nav.Link>
            <Nav.Link href='/About-Us'>EVENTS</Nav.Link>
            <Nav.Link href='/About-Us'>GET IN TOUCH</Nav.Link>
            <Nav.Link href='/login'>LOGIN</Nav.Link>
        </div>
      </Navbar>
    </header>
  );
};

export default Header;
