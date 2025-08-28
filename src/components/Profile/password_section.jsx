import axios from "axios";
import Cookies from "js-cookie";
import { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";

const PasswordSection = ({ BACKEND_HOST }) => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordMsg("");

    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordMsg("请填写所有字段");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg("两次新密码输入不一致");
      return;
    }
    if (oldPassword === newPassword) {
      setPasswordMsg("新密码不能与原密码相同");
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

      setPasswordMsg("密码修改成功");
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMsg("密码修改失败，请检查原密码是否正确");
    }
  };

  return (
    <div className='password-section'>
      <h3>修改密码</h3>
      <hr />
      <Form onSubmit={handlePasswordChange}>
        <Form.Group className='mb-3' controlId='oldPassword'>
          <Form.Label>原密码</Form.Label>
          <Form.Control
            type='password'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='newPassword'>
          <Form.Label>新密码</Form.Label>
          <Form.Control
            type='password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </Form.Group>

        <Form.Group className='mb-3' controlId='confirmPassword'>
          <Form.Label>确认新密码</Form.Label>
          <Form.Control
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Form.Group>

        {passwordMsg && (
          <Alert
            variant={
              passwordMsg.includes("成功") ? "success" : "danger"
            }
          >
            {passwordMsg}
          </Alert>
        )}

        <Button variant='primary' type='submit'>
          保存
        </Button>
      </Form>
    </div>
  );
};

export default PasswordSection;