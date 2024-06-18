import React from "react";
import "../css/Header.css";

const Header = () => {
  return (
    <header className='App-header'>
      <nav>
        <ul>
          <li>
            <a href='/'>HOME</a>
          </li>
          <li>
            <a href='/products'>PRODUCTS</a>
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
