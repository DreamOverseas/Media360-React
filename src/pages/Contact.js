import React from "react";
import { useTranslation } from "react-i18next";
import "../css/Contact.css";
const Contact = () => {
  const { t } = useTranslation();

  return (
    <div className='contact-page'>
      <div className='contact-content'>
        <div className='contact-image'>
          <img src='Contact.png' alt='Contact' />
        </div>
        <div className='contact-form'>
          <h2>{t("contact.title")}</h2>
          <form>
            <div className='form-group'>
              <label htmlFor='name'>{t("contact.full_name")}</label>
              <input type='text' id='name' name='name' />
            </div>
            <div className='form-group'>
              <label htmlFor='email'>{t("contact.email_address")}</label>
              <input type='email' id='email' name='email' />
            </div>
            <div className='form-group'>
              <label htmlFor='message'>{t("contact.message")}</label>
              <textarea id='message' name='message' rows='4'></textarea>
            </div>
            <button type='submit'>{t("contact.send")}</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
