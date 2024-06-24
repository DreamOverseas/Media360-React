import React from "react";
import { Link } from "react-router-dom";
import "../css/Header.css";

const Header = () => {
  return (
    <header className='App-header'>
      <nav>
        <ul>
          <li>
            <Link to='/'>HOME</Link>
          </li>
          <li>
            <Link to='/products'>PRODUCTS</Link>
          </li>
          <li>
            <Link to='/kolpage'>KOL</Link>
          </li>
          <li>EVENTS</li>
          <li>GET IN TOUCH</li>
          <li>LOGIN</li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
