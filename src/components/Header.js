import React, { useContext } from "react";
import { Nav, Navbar } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import "../css/Header.css";

const Header = () => {
  const { user, logout } = useContext(AuthContext);

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
          <Nav.Link href='/Contact'>GET IN TOUCH</Nav.Link>
          {user ? (
            <>
              <Nav.Link href='/' onClick={logout}>
                {user.username}
              </Nav.Link>
            </>
          ) : (
            <Nav.Link href='/login'>LOGIN</Nav.Link>
          )}
        </div>
      </Navbar>
    </header>
  );
};

export default Header;
