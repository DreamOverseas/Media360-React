import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Row, Col, Alert, Nav, Accordion, Tab } from 'react-bootstrap';
import ReactMarkdown from "react-markdown";
import axios from 'axios';
import moment from 'moment';
import "../css/Contact.css";

// Load Backend Host for API calls
const EMAIL_SUBSCRIPTION = process.env.REACT_APP_EMAIL_SUBSCRIPTION + "360media-contact/";
// Load Backend Host for API calls
const BACKEND_HOST = process.env.REACT_APP_STRAPI_HOST;

const Contact = () => {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [message, setMessage] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [responseMessage, setResponseMessage] = useState(null);
  const [jobs, setJobs] = useState([]);
  // active keys indicates activated tab, it's either recruitment / apply / contact
  const [activeKey, setActiveKey] = useState("recruitment");

  useEffect(() => {
    axios.get(`${BACKEND_HOST}/api/recruitments`)
      .then(response => {
        // Filter Active === True 
        const activeJobs = response.data.data.filter(job => job.attributes.Active);
        setJobs(activeJobs);
      })
      .catch(error => {
        console.error('Error fetching jobs:', error);
      });
  }, []);

  const calculateTimeAgo = (publishedDate) => {
    return moment(publishedDate).fromNow();
  };


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
        setResponseMessage('');
        setSuccessMsg("Successfully Subscribed!");
      } else {
        setSuccessMsg('');
        setResponseMessage(result.error || 'An error occurred while subscribing');
      }
    } catch (error) {
      setSuccessMsg('');
      setResponseMessage('Network error or server issue');
    }
  };

  const { t } = useTranslation();

  return (
    <div className='contact-page'>
      <Tab.Container
        activeKey={activeKey}
        onSelect={(key) => setActiveKey(key)}
      >
        <Row>
          <Col className="text-center" >
            <Nav.Link
              eventKey='recruitment'
              className={`nav-link-Login ${activeKey === "recruitment" ? "active" : ""
                }`}
              onClick={() => setActiveKey("recruitment")}
            >
              {t("recruitment")}
            </Nav.Link>
          </Col>
          <Col className="text-center" >
            <Nav.Link
              eventKey='apply'
              className={`nav-link-Login ${activeKey === "apply" ? "active" : ""
                }`}
              onClick={() => setActiveKey("apply")}
            >
              {t("apply")}
            </Nav.Link>
          </Col>
          <Col className="text-center" >
            <Nav.Link
              eventKey='contact'
              className={`nav-link-Login ${activeKey === "contact" ? "active" : ""
                }`}
              onClick={() => setActiveKey("contact")}
            >
              {t("contact")}
            </Nav.Link>
          </Col>
        </Row>
        <br />

        <Tab.Content>
          {/* 招聘信息栏位 */}
          <Tab.Pane eventKey="recruitment">
            <h2 className="text-center my-4">岗位详情</h2>
            {/* If no job is actively recuiting */}
            {jobs.length === 0 ? (
              <p className="text-center">当前暂无招聘信息，请持续关注我们的新动态。</p>
            ) : (
              <Accordion>
                {jobs.map((job, index) => (
                  <Accordion.Item eventKey={index.toString()} key={job.id}>
                    <Accordion.Header>
                      <div style={{ flex: 1 }}>
                        <div className="fw-bold" style={{ fontSize: 20 }}>{job.attributes.Job_Title_zh}</div> <br />
                        <div>
                          {/* Second row：Type & Participation */}
                          <Row>
                            <Col>
                              <strong>类型：</strong>{' '}
                              {job.attributes.Type}
                            </Col>
                            <Col>
                              <strong>参与方式：</strong>{' '}
                              {job.attributes.Participation}
                            </Col>
                          </Row>
                          {/* Third row：Location */}
                          <Row className="mt-2">
                            <Col>
                              <strong>工作地点：</strong>{' '}
                              {job.attributes.Location}
                            </Col>
                            <Col className="text-end">
                              <small>
                                {calculateTimeAgo(job.attributes.Published)}
                              </small>
                            </Col>
                          </Row>
                        </div>
                      </div>

                    </Accordion.Header>
                    <Accordion.Body>
                      {/* OnShow：Intro */}
                      <strong>职位介绍：</strong>
                      <ReactMarkdown>{job.attributes.Intro_zh}</ReactMarkdown>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            )}
          </Tab.Pane>
          <Tab.Pane eventKey="apply">
            <p>Please send your CV to john.du@do360.com, stating your basic information and the job title you're applying, and we'll get back to you later.</p>
          </Tab.Pane>
          <Tab.Pane eventKey="contact">
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
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
    </div>
  );
};

export default Contact;
