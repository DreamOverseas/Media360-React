import React from "react";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer>
      <div className='footer-column'>
        <h2>OUR PEOPLE</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className='footer-column'>
        <h2>OUR MISSION</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className='footer-column'>
        <h2>OUR EVENT</h2>
        <p>Lorem ipsum dolor sit amet.</p>
      </div>
      <div className='footer-column'>
        <h2>Join Our Newsletter</h2>
        <p>
          Sign up for our newsletter to enjoy free marketing tips, updates, and
          more.
        </p>
        <input type='email' placeholder='Email Address' />
        <button>Subscribe</button>
      </div>
    </footer>
  );
};

export default Footer;
