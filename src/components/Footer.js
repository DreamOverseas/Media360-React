import React from "react";
import "../css/Footer.css";

const Footer = () => {
  return (
    <footer className='footer'>
      <div className='footer-column logo-contact'>
        <img src='path/to/your/logo.png' alt='Logo' className='footer-logo' />
        <div className='contact-info'>
          <p>360 Media Street, Melbourne 3000</p>
          <p>0404 123 456</p>
          <p>abcd@gmail.com</p>
        </div>
      </div>
      <div className='footer-column'>
        <h2>OUR PEOPLE</h2>
      </div>
      <div className='footer-column'>
        <h2>OUR MISSION</h2>
      </div>
      <div className='footer-column'>
        <h2>OUR EVENT</h2>
      </div>
      <div className='footer-column newsletter'>
        <h2>Join Our Newsletter</h2>
        <p>
          Sign up for our newsletter to enjoy free marketing tips, inspirations,
          and more.
        </p>
        <input type='email' placeholder='E-mail Address' />
        <button>Subscribe</button>
      </div>
      <div className='footer-column qr-social'>
        <img src='path/to/your/qr-code.png' alt='QR Code' className='qr-code' />
        <p>Scan Me</p>
        <div className='social-icons'>
          <img src='path/to/your/facebook-icon.png' alt='Facebook' />
          <img src='path/to/your/instagram-icon.png' alt='Instagram' />
          <img src='path/to/your/share-icon.png' alt='Share' />
        </div>
      </div>
    </footer>
  );
};

export default Footer;
