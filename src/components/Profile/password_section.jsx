import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const PasswordSection = ({ BACKEND_HOST }) => {
  const { t } = useTranslation();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg(t("profile.page.passwordSection.msg.fillAll"));
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg(t("profile.page.passwordSection.msg.mismatch"));
      return;
    }
    if (oldPassword === newPassword) {
      setPasswordMsg(t("profile.page.passwordSection.msg.sameAsOld"));
      return;
    }

    try {
      const token = Cookies.get("token");
      await axios.post(
        `${BACKEND_HOST}/api/auth/change-password`,
        {
          currentPassword: oldPassword,
          password: newPassword,
          passwordConfirmation: confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setPasswordMsg(t("profile.page.passwordSection.msg.success"));
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg(t("profile.page.passwordSection.msg.failure"));
    }
  };

  return (
    <div className="password-section">
      <h3>{t("profile.page.passwordSection.title")}</h3>
      <hr />
      <Form onSubmit={handlePasswordChange}>
        <Form.Group className="mb-3" controlId="oldPassword">
          <Form.Label>{t("profile.page.passwordSection.oldPassword")}</Form.Label>
          <Form.Control
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="newPassword">
          <Form.Label>{t("profile.page.passwordSection.newPassword")}</Form.Label>
          <Form.Control
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>{t("profile.page.passwordSection.confirmPassword")}</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        {passwordMsg && (
          <Alert
            variant={passwordMsg.includes(t("profile.page.passwordSection.keywordSuccess"))
              ? "success"
              : "danger"}
          >
            {passwordMsg}
          </Alert>
        )}

        <Button variant="primary" type="submit">
          {t("profile.page.passwordSection.save")}
        </Button>
      </Form>
    </div>
  );
};

export default PasswordSection;
