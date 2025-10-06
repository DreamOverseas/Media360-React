import { Alert, Button, Form, Modal } from "react-bootstrap";
import { useTranslation } from "react-i18next";

const ProfileEditModal = ({
  show,
  username,
  bio,
  avatar,
  errorMessage,
  warning,
  maxNameLen,
  maxBioLen,
  setUsername,
  setBio,
  setAvatar,
  setWarning,
  handleSave,
  handleCancel,
  handleDiscardChanges,
  handleUsernameChange,
  handleBioChange,
  handleFileChange
}) => {
  const { t } = useTranslation();

  return (
    <>
      {/* Edit Profile Modal */}
      <Modal show={show} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>{t("profile.page.profileEditModal.title")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
          <Form>
            <Form.Group controlId="formUsername">
              <Form.Label>{t("profile.page.profileEditModal.username")}</Form.Label>
              <Form.Control
                type="text"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder={t("profile.page.profileEditModal.usernamePlaceholder")}
                maxLength={maxNameLen}
              />
            </Form.Group>

            <Form.Group controlId="formBio" className="mt-3">
              <Form.Label>{t("profile.page.profileEditModal.bio")}</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={bio}
                onChange={(e) => handleBioChange(e.target.value)}
                placeholder={t("profile.page.profileEditModal.bioPlaceholder")}
                maxLength={maxBioLen}
              />
            </Form.Group>

            <Form.Group controlId="formAvatar" className="mt-3">
              <Form.Label>{t("profile.page.profileEditModal.avatar")}</Form.Label>
              <Form.Control type="file" accept="image/*" onChange={handleFileChange} />
              <Form.Text muted>
                {t("profile.page.profileEditModal.avatarTip")}
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCancel}>
            {t("profile.page.profileEditModal.cancel")}
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {t("profile.page.profileEditModal.save")}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Discard Changes Warning Modal */}
      <Modal show={warning} onHide={() => setWarning(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{t("profile.page.profileEditModal.discardTitle")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{t("profile.page.profileEditModal.discardMessage")}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setWarning(false)}>
            {t("profile.page.profileEditModal.continueEditing")}
          </Button>
          <Button variant="danger" onClick={handleDiscardChanges}>
            {t("profile.page.profileEditModal.discardChanges")}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileEditModal;