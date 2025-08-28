import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const useProfileEdit = (user, BACKEND_HOST, setUser) => {
  const [show, setShow] = useState(false);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [avatar, setAvatar] = useState(null);
  const [warning, setWarning] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(null);

  const maxNameLen = 16;
  const maxBioLen = 500;

  useEffect(() => {
    if (user && user.avatar) {
      setAvatarUrl(`${BACKEND_HOST}${user.avatar.url}`);
    } else {
      setAvatarUrl("default-avatar.jpg");
    }
  }, [BACKEND_HOST, user]);

  const handleFileChange = (e) => setAvatar(e.target.files[0]);

  const openEdit = () => {
    setUsername(user.username);
    setBio(user.bio);
    setShow(true);
  };

  const closeEdit = () => setShow(false);

  const handleUsernameChange = (value) =>
    value.length <= maxNameLen && setUsername(value);
  
  const handleBioChange = (value) => 
    value.length <= maxBioLen && setBio(value);

  const handleSave = async () => {
    if (username === user.username && bio === user.bio && avatar == null) {
      closeEdit();
      return;
    }
    
    try {
      const token = Cookies.get("token");
      let avatarId = user.avatar?.id;

      if (avatar && avatar !== null) {
        const formData = new FormData();
        formData.append("files", avatar);
        const uploadRes = await axios.post(
          `${BACKEND_HOST}/api/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        avatarId = uploadRes.data[0].id;
      }

      const res = await axios.put(
        `${BACKEND_HOST}/api/users/${user.id}`,
        {
          username,
          bio,
          avatar: avatarId,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data);
      closeEdit();
      window.location.reload();
    } catch (error) {
      setErrorMessage("Error saving profile. Please try again.");
    }
  };

  const handleCancel = () => {
    if (username !== user.username || bio !== user.bio || avatar !== null) {
      setWarning(true);
    } else {
      closeEdit();
    }
  };

  const handleDiscardChanges = () => {
    setWarning(false);
    closeEdit();
  };

  return {
    show,
    username,
    bio,
    avatar,
    warning,
    errorMessage,
    avatarUrl,
    maxNameLen,
    maxBioLen,
    setUsername,
    setBio,
    setAvatar,
    setWarning,
    openEdit,
    closeEdit,
    handleFileChange,
    handleUsernameChange,
    handleBioChange,
    handleSave,
    handleCancel,
    handleDiscardChanges,
  };
};