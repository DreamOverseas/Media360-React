import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Alert } from 'react-bootstrap';
import "../css/Contact.css";

// Load Backend Host for API calls
const EMAIL_SUBSCRIPTION = process.env.REACT_APP_EMAIL_SUBSCRIPTION+"360media-contact/";

const Contact = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [responseMessage, setResponseMessage] = useState(null);

  // Function to handle form submission
  const addToSubscribe = async (e) => {
    e.preventDefault();

    // Construct the payload
    const payload = {
      email,
      firstName,
      lastName,
      message,
    };

    try {
      // Make the POST request to the Express API
      const response = await fetch(EMAIL_SUBSCRIPTION, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccessMsg("Successfully Subscribed!");
      } else {
        setResponseMessage(result.error || 'An error occurred while subscribing');
      }
    } catch (error) {
      setResponseMessage(EMAIL_SUBSCRIPTION);
      // setResponseMessage('Network error or server issue');
    }
  };

  const { t } = useTranslation();

  return (
    <div className='contact-page'>
      <div className='contact-content'>
        <div className='contact-image'>
          <img src='Contact.png' alt='Contact' />
        </div>
        <div className='contact-form'>
          <h2>{t("contact.title")}</h2>
          <form onSubmit={addToSubscribe}>
            <div className='form-group'>
              <Row>
                <Col>
                  <label htmlFor='firstname'>{t("contact.firstname")}</label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </Col>
                <Col>
                  <label htmlFor='lastname'>{t("contact.lastname")}</label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </Col>
              </Row>
            </div>
            <div className='form-group'>
              <label htmlFor='email'>{t("contact.email_address")}</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className='form-group'>
              <label htmlFor='message'>{t("contact.message")}</label>
              <textarea
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <button type='submit'>{t("contact.send")}</button>
            {responseMessage && <Alert variant="danger">{responseMessage}</Alert>}
            {successMsg && <Alert variant="success">{successMsg}</Alert>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
