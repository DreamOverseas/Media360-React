import React, { useState } from "react";
import axios from "axios";
import { Button, Modal, Alert, Spinner } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import MerchantRegistrationForm from "../Components/ApplicationForms/MerchantRegistrationForm.jsx";

const API_KEY_UPLOAD = import.meta.env.VITE_API_KEY_REGISTRATION_UPLOAD;
const MERCHANT_UPLOAD_EMAIL_NOTIFY = import.meta.env.VITE_360_MEDIA_WHDS_BIZ_UPLOAD_NOTIFICATION;
const BACKEND_HOST = import.meta.env.VITE_STRAPI_HOST;
const DEBUG = import.meta.env.DEBUG;

const Application = () => {
  const { t } = useTranslation();
  const [showSuccessSubmissionModal, setShowSuccessSubmissionModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMerchantRegistrationSubmit = async (formData) => {
    setLoading(true);

    const cleanData = (data) =>
      Object.fromEntries(Object.entries(data).filter(([, value]) => value && value.length > 0));

    const finalFormData = cleanData({
      Company_Name: formData.companyName,
      Industry_Category: formData.industryCategory,
      Contact_Person_First_Name: formData.contactPersonFirstName,
      Contact_Person_Last_Name: formData.contactPersonLastName,
      Email: formData.email,
      Phone: formData.phone,
      Company_Description: formData.companyDescription,
      Company_Website: formData.companyWebsite,
      Sponsorship_Format: formData.sponsorshipFormat,
      Exclusive: formData.exclusive,
      Reference: formData.reference,
      Additional_Requirements: formData.additionalRequirements,
      From: formData.from,
    });

    try {
      const response = await fetch(`${BACKEND_HOST}/api/influencer-contest-merchant-registrations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY_UPLOAD}`,
        },
        body: JSON.stringify({ data: finalFormData }),
      });

      const result = await response.json();
      if (DEBUG) console.log(result);

      if (response.ok) {
        if (MERCHANT_UPLOAD_EMAIL_NOTIFY) {
          const firstName = finalFormData.Contact_Person_First_Name;
          const lastName = finalFormData.Contact_Person_Last_Name;
          const name = `${firstName} ${lastName}`;
          const email = finalFormData.Email;
          try {
            await axios.post(MERCHANT_UPLOAD_EMAIL_NOTIFY, { name, email });
          } catch (error) {
            alert(`${error}, Email not sent... But you are recorded if no other errors occured!`);
          }
        }
        setShowSuccessSubmissionModal(true);
      } else {
        setShowErrorModal(true);
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      setShowErrorModal(true);
    }

    setLoading(false);
  };

  return (
    <div className="container mt-4 py-4">
      <h2 className="text-2xl font-bold mb-4">{t("whds_page.registration_method")}</h2>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" size="lg" />
          <p className="mt-3">{t("whds_page.uploading")}</p>
        </div>
      ) : (
        <MerchantRegistrationForm onSubmit={handleMerchantRegistrationSubmit} />
      )}

      <Modal show={showSuccessSubmissionModal} onHide={() => setShowSuccessSubmissionModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("whds_page.submit_success")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="success">{t("whds_page.submit_success_msg")}</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={() => setShowSuccessSubmissionModal(false)}>
            {t("whds_page.close")}
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{t("whds_page.submit_error")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">{t("whds_page.submit_error_msg")}</Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            {t("whds_page.close")}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Application;