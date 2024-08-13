import React from "react";
import "../css/Contact.css";

const Contact = () => {
  return (
    <div className='contact-page'>
      <div className='contact-content'>
        <div className='contact-image'>
          <img src='Contact.png' alt='Contact' />
        </div>
        <div className='contact-form'>
          <h2>Contact us</h2>
          <form>
            <div className='form-group'>
              <label htmlFor='name'>Full name</label>
              <input type='text' id='name' name='name' />
            </div>
            <div className='form-group'>
              <label htmlFor='email'>E-mail address</label>
              <input type='email' id='email' name='email' />
            </div>
            <div className='form-group'>
              <label htmlFor='message'>Message</label>
              <textarea id='message' name='message' rows='4'></textarea>
            </div>
            <button type='submit'>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;

