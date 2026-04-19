import React from "react";
import "../Css/Contact.css";
import "../Css/HtmlBeautify.css";
import { useTranslation } from "react-i18next";
import { Container, Col, Row } from 'react-bootstrap';
import ContactForm from "../Components/ContactForm";
import PageTitle from "../Components/PageTitle";

const officeCardStyle = {
    background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)',
    border: '1px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '12px',
    padding: '1.4rem 1.6rem',
    marginBottom: '1.2rem',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.08)',
};

const siteCardStyle = {
    background: '#fafffe',
    border: '1px solid rgba(80, 180, 140, 0.25)',
    borderRadius: '10px',
    padding: '1rem 1.2rem',
    marginBottom: '0.9rem',
    boxShadow: '0 2px 8px rgba(80, 180, 140, 0.07)',
};

const sectionTitleStyle = {
    color: '#2c3e50',
    fontWeight: 700,
    fontSize: '1.05rem',
    borderLeft: '4px solid #667eea',
    paddingLeft: '10px',
    marginBottom: '0.75rem',
    display: 'block',
};

const regionLabelStyle = {
    fontSize: '0.78rem',
    fontWeight: 600,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    color: '#667eea',
    marginBottom: '0.5rem',
    marginTop: '1rem',
};

const noteStyle = {
    fontSize: '0.85rem',
    color: '#7f8c8d',
    fontStyle: 'italic',
    borderTop: '1px solid #eee',
    paddingTop: '0.9rem',
    marginTop: '0.5rem',
};

const Contact = () => {

    const { t } = useTranslation();

    return (
        <div>
            <PageTitle pageTitle={t("Contact_title")} />
            <Container style={{ padding: '3rem' }}>
                <div className="html-content">
                    <Row className="align-items-start">
                        <Col md={6}>
                            <h5>{t("Contact_intro_title")}</h5>
                            <p>{t("Contact_intro_text")}</p>
                            <ContactForm />
                        </Col>
                        <Col md={6} className="contact-info-col">

                            {/* Melbourne Office */}
                            <div style={officeCardStyle}>
                                <span style={sectionTitleStyle}>{t("contact_melbourne_title")}</span>
                                <p style={{ marginBottom: '0.4rem' }}><i className="bi bi-geo-alt"></i> &nbsp; {t("contact_melbourne_address")}</p>
                                <p style={{ marginBottom: '0.4rem' }}><i className="bi bi-globe2"></i> &nbsp; <a href="https://do360.com" target="_blank" rel="noreferrer">{t("contact_melbourne_website")}</a></p>
                                <p style={{ marginBottom: '0.4rem' }}><i className="bi bi-person"></i> &nbsp; {t("contact_melbourne_contact")}</p>
                                <p style={{ marginBottom: '0.4rem' }}><i className="bi bi-telephone"></i> &nbsp; {t("contact_melbourne_mobile")}</p>
                                <p style={{ marginBottom: 0 }}><i className="bi bi-envelope"></i> &nbsp; <a href={`mailto:${t("contact_melbourne_email")}`}>{t("contact_melbourne_email")}</a></p>
                            </div>

                            {/* Sydney Authorised Office */}
                            <div style={officeCardStyle}>
                                <span style={sectionTitleStyle}>{t("contact_sydney_title")}</span>
                                <p style={{ marginBottom: '0.4rem' }}><i className="bi bi-geo-alt"></i> &nbsp; {t("contact_sydney_address")}</p>
                                <p style={{ marginBottom: '0.4rem' }}><i className="bi bi-person"></i> &nbsp; {t("contact_sydney_contact")}</p>
                                <p style={{ marginBottom: '0.4rem' }}><i className="bi bi-telephone"></i> &nbsp; {t("contact_sydney_mobile")}</p>
                                <p style={{ marginBottom: 0 }}><i className="bi bi-envelope"></i> &nbsp; <a href={`mailto:${t("contact_sydney_email")}`}>{t("contact_sydney_email")}</a></p>
                            </div>

                            {/* Eco Living Demo Sites */}
                            <div style={{ ...officeCardStyle, background: 'linear-gradient(135deg, #f0fff8 0%, #ffffff 100%)', borderColor: 'rgba(80,180,140,0.25)' }}>
                                <span style={{ ...sectionTitleStyle, borderLeftColor: '#50b48c' }}>{t("contact_ecosites_title")}</span>
                                <p style={{ fontSize: '0.92rem', color: '#4a6360', marginBottom: '0.8rem' }}>{t("contact_ecosites_intro")}</p>

                                <p style={regionLabelStyle}>&#127462;&#127482; {t("contact_vic_label")}</p>
                                <div style={siteCardStyle}>
                                    <strong style={{ fontSize: '0.95rem', color: '#2c3e50', display: 'block', marginBottom: '0.35rem' }}>{t("contact_rhp_title")}</strong>
                                    <p style={{ marginBottom: '0.25rem', fontSize: '0.88rem' }}><i className="bi bi-layers"></i> &nbsp; {t("contact_rhp_zone")}</p>
                                    <p style={{ marginBottom: '0.25rem', fontSize: '0.88rem' }}><i className="bi bi-geo-alt"></i> &nbsp; {t("contact_rhp_address")}</p>
                                    <p style={{ marginBottom: 0, fontSize: '0.88rem' }}><i className="bi bi-globe2"></i> &nbsp; <a href="https://do360.com/rhp" target="_blank" rel="noreferrer">{t("contact_rhp_website")}</a></p>
                                </div>

                                <p style={regionLabelStyle}>&#127462;&#127482; {t("contact_nsw_label")}</p>
                                <div style={siteCardStyle}>
                                    <strong style={{ fontSize: '0.95rem', color: '#2c3e50', display: 'block', marginBottom: '0.35rem' }}>{t("contact_jilliby_title")}</strong>
                                    <p style={{ marginBottom: '0.25rem', fontSize: '0.88rem' }}><i className="bi bi-layers"></i> &nbsp; {t("contact_jilliby_zone")}</p>
                                    <p style={{ marginBottom: '0.25rem', fontSize: '0.88rem' }}><i className="bi bi-geo-alt"></i> &nbsp; {t("contact_jilliby_address")}</p>
                                    <p style={{ marginBottom: 0, fontSize: '0.88rem' }}><i className="bi bi-globe2"></i> &nbsp; <a href="https://do360.com/Jilliby" target="_blank" rel="noreferrer">{t("contact_jilliby_website")}</a></p>
                                </div>

                                <div style={siteCardStyle}>
                                    <strong style={{ fontSize: '0.95rem', color: '#2c3e50', display: 'block', marginBottom: '0.35rem' }}>{t("contact_berowra_title")}</strong>
                                    <p style={{ marginBottom: '0.25rem', fontSize: '0.88rem' }}><i className="bi bi-layers"></i> &nbsp; {t("contact_berowra_zone")}</p>
                                    <p style={{ marginBottom: '0.25rem', fontSize: '0.88rem' }}><i className="bi bi-geo-alt"></i> &nbsp; {t("contact_berowra_address")}</p>
                                    <p style={{ marginBottom: 0, fontSize: '0.88rem' }}><i className="bi bi-globe2"></i> &nbsp; <a href="https://do360.com/fishmenshack" target="_blank" rel="noreferrer">{t("contact_berowra_website")}</a></p>
                                </div>

                                <div style={siteCardStyle}>
                                    <strong style={{ fontSize: '0.95rem', color: '#2c3e50', display: 'block', marginBottom: '0.35rem' }}>{t("contact_chateau_title")}</strong>
                                    <p style={{ marginBottom: '0.25rem', fontSize: '0.88rem' }}><i className="bi bi-layers"></i> &nbsp; {t("contact_chateau_zone")}</p>
                                    <p style={{ marginBottom: '0.25rem', fontSize: '0.88rem' }}><i className="bi bi-geo-alt"></i> &nbsp; {t("contact_chateau_address")}</p>
                                    <p style={{ marginBottom: 0, fontSize: '0.88rem' }}><i className="bi bi-globe2"></i> &nbsp; <a href="https://do360.com/chateaulemarais" target="_blank" rel="noreferrer">{t("contact_chateau_website")}</a></p>
                                </div>

                                <p style={noteStyle}>{t("contact_sites_note")}</p>
                            </div>

                        </Col>
                    </Row>
                </div>
            </Container>
        </div>
    );
};

export default Contact;