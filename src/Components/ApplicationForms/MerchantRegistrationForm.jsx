import React, { useState } from "react";
import { Button, Row, Col, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const initialMerchantFormData = {
  companyName: "",
  industryCategory: "",
  contactPersonFirstName: "",
  contactPersonLastName: "",
  email: "",
  phone: "",
  companyDescription: "",
  companyWebsite: "",
  sponsorshipFormat: "",
  exclusive: "",
  reference: "",
  additionalRequirements: "",
  from: "360 Influencer Contest merchant registration",
};

const MerchantRegistrationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState(initialMerchantFormData);
  const [errors, setErrors] = useState({});
  const { t } = useTranslation();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setErrors((prevErrors) => ({ ...prevErrors, [name]: "" }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.companyName.trim()) newErrors.companyName = t("whds_errors.company_name_required");
    if (!formData.companyDescription.trim()) newErrors.companyDescription = t("whds_errors.company_description_required");
    if (!formData.industryCategory.trim()) newErrors.industryCategory = t("whds_errors.industry_required");
    if (!formData.contactPersonFirstName.trim()) newErrors.contactPersonFirstName = t("whds_errors.contact_firstname_required");
    if (!formData.contactPersonLastName.trim()) newErrors.contactPersonLastName = t("whds_errors.contact_lastname_required");

    if (!formData.email.trim()) {
      newErrors.email = t("whds_errors.email_required");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t("whds_errors.email_invalid");
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t("whds_errors.phone_required");
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      newErrors.phone = t("whds_errors.phone_invalid");
    }

    if (!formData.sponsorshipFormat.trim()) newErrors.sponsorshipFormat = t("whds_errors.sponsorship_required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-4">
        <h2 className="text-primary">{t("whds_form_mch.title")}</h2>
        <p className="text-muted">{t("whds_form_mch.subtitle")}</p>
      </div>

      <div className="mb-4">
        <h4>{t("whds_form_mch.basic_info.title")}</h4>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>{t("whds_form_mch.basic_info.company_name")}</Form.Label>
              <Form.Control
                type="text"
                name="companyName"
                placeholder={t("whds_form_mch.basic_info.company_name_ph")}
                value={formData.companyName}
                onChange={handleChange}
                isInvalid={!!errors.companyName}
              />
              <Form.Control.Feedback type="invalid">{errors.companyName}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>{t("whds_form_mch.basic_info.industry")}</Form.Label>
              <Form.Select
                name="industryCategory"
                value={formData.industryCategory}
                onChange={handleChange}
                isInvalid={!!errors.industryCategory}
              >
                <option value="">{t("whds_form_mch.basic_info.industry_select")}</option>
                <option value="beauty">{t("whds_form_mch.basic_info.industry_beauty")}</option>
                <option value="fashion">{t("whds_form_mch.basic_info.industry_fashion")}</option>
                <option value="food">{t("whds_form_mch.basic_info.industry_food")}</option>
                <option value="electronics">{t("whds_form_mch.basic_info.industry_electronics")}</option>
                <option value="home">{t("whds_form_mch.basic_info.industry_home")}</option>
                <option value="health">{t("whds_form_mch.basic_info.industry_health")}</option>
                <option value="education">{t("whds_form_mch.basic_info.industry_education")}</option>
                <option value="travel">{t("whds_form_mch.basic_info.industry_travel")}</option>
                <option value="finance">{t("whds_form_mch.basic_info.industry_finance")}</option>
                <option value="entertainment">{t("whds_form_mch.basic_info.industry_entertainment")}</option>
                <option value="other">{t("whds_form_mch.basic_info.industry_other")}</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">{errors.industryCategory}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>{t("whds_form_mch.basic_info.website")}</Form.Label>
              <Form.Control
                type="url"
                name="companyWebsite"
                placeholder="https://www.example.com"
                value={formData.companyWebsite}
                onChange={handleChange}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={12}>
            <Form.Group>
              <Form.Label>{t("whds_form_mch.basic_info.description")}</Form.Label>
              <Form.Control
                as="textarea"
                name="companyDescription"
                rows={3}
                placeholder={t("whds_form_mch.basic_info.description_ph")}
                value={formData.companyDescription}
                onChange={handleChange}
                isInvalid={!!errors.companyDescription}
              />
              <Form.Control.Feedback type="invalid">{errors.companyDescription}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </div>

      <div className="mb-4">
        <h4>{t("whds_form_mch.contact.title")}</h4>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>{t("whds_form_mch.contact.lastname")}</Form.Label>
              <Form.Control
                type="text"
                name="contactPersonLastName"
                placeholder={t("whds_form_mch.contact.lastname_ph")}
                value={formData.contactPersonLastName}
                onChange={handleChange}
                isInvalid={!!errors.contactPersonLastName}
              />
              <Form.Control.Feedback type="invalid">{errors.contactPersonLastName}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>{t("whds_form_mch.contact.firstname")}</Form.Label>
              <Form.Control
                type="text"
                name="contactPersonFirstName"
                placeholder={t("whds_form_mch.contact.firstname_ph")}
                value={formData.contactPersonFirstName}
                onChange={handleChange}
                isInvalid={!!errors.contactPersonFirstName}
              />
              <Form.Control.Feedback type="invalid">{errors.contactPersonFirstName}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>{t("whds_form_mch.contact.email")}</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={t("whds_form_mch.contact.email_ph")}
                value={formData.email}
                onChange={handleChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>{t("whds_form_mch.contact.phone")}</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                placeholder={t("whds_form_mch.contact.phone_ph")}
                value={formData.phone}
                onChange={handleChange}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </div>

      <div className="mb-4">
        <h4>{t("whds_form_mch.terms.title")}</h4>

        <Form.Group className="mb-3">
          <Form.Label>{t("whds_form_mch.terms.sponsorship")}</Form.Label>
          <Form.Control
            as="textarea"
            name="sponsorshipFormat"
            rows={3}
            placeholder={t("whds_form_mch.terms.sponsorship_ph")}
            value={formData.sponsorshipFormat}
            onChange={handleChange}
            isInvalid={!!errors.sponsorshipFormat}
          />
          <Form.Control.Feedback type="invalid">{errors.sponsorshipFormat}</Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("whds_form_mch.terms.exclusive")}</Form.Label>
          <Form.Control
            as="textarea"
            name="exclusive"
            rows={3}
            placeholder={t("whds_form_mch.terms.exclusive_ph")}
            value={formData.exclusive}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("whds_form_mch.terms.reference")}</Form.Label>
          <Form.Control
            as="textarea"
            name="reference"
            rows={2}
            placeholder={t("whds_form_mch.terms.reference_ph")}
            value={formData.reference}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>{t("whds_form_mch.terms.additional")}</Form.Label>
          <Form.Control
            as="textarea"
            name="additionalRequirements"
            rows={2}
            placeholder={t("whds_form_mch.terms.additional_ph")}
            value={formData.additionalRequirements}
            onChange={handleChange}
          />
        </Form.Group>
      </div>

      <div className="d-grid gap-2">
        <Button variant="primary" type="submit" size="lg">
          {t("whds_form_mch.submit")}
        </Button>
      </div>
    </Form>
  );
};

export default MerchantRegistrationForm;