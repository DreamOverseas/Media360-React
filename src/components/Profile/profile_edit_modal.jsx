import { Alert, Button, Form, Modal } from "react-bootstrap";

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
  return (
    <>
      {/* 编辑个人信息弹窗 */}
      <Modal show={show} onHide={handleCancel}>
        <Modal.Header closeButton>
          <Modal.Title>编辑个人信息</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <Alert variant='danger'>{errorMessage}</Alert>}
          <Form>
            <Form.Group controlId='formUsername'>
              <Form.Label>用户名</Form.Label>
              <Form.Control
                type='text'
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
                placeholder='请输入用户名'
                maxLength={maxNameLen}
              />
            </Form.Group>

            <Form.Group controlId='formBio' className='mt-3'>
              <Form.Label>简介</Form.Label>
              <Form.Control
                as='textarea'
                rows={3}
                value={bio}
                onChange={(e) => handleBioChange(e.target.value)}
                placeholder='请输入简介'
                maxLength={maxBioLen}
              />
            </Form.Group>

            <Form.Group controlId='formAvatar' className='mt-3'>
              <Form.Label>头像</Form.Label>
              <Form.Control
                type='file'
                accept='image/*'
                onChange={handleFileChange}
              />
              <Form.Text muted>建议选择方形图片以获得最佳显示效果</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={handleCancel}>
            取消
          </Button>
          <Button variant='primary' onClick={handleSave}>
            保存
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 放弃更改警告弹窗 */}
      <Modal show={warning} onHide={() => setWarning(false)}>
        <Modal.Header closeButton>
          <Modal.Title>放弃更改？</Modal.Title>
        </Modal.Header>
        <Modal.Body>你有未保存的更改，确定要放弃吗？</Modal.Body>
        <Modal.Footer>
          <Button variant='secondary' onClick={() => setWarning(false)}>
            继续编辑
          </Button>
          <Button variant='danger' onClick={handleDiscardChanges}>
            放弃更改
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ProfileEditModal;