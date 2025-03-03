import styles from '../css/Join.module.css';
import { IoCameraOutline } from 'react-icons/io5';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Join() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [imgFile, setImgFile] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });

  const saveImgFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImgFile(reader.result);
      };
    }
  };

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append('username', formData.username);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('password', formData.password);

    if (fileInputRef.current.files[0]) {
      formDataToSend.append('profile', fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch('http://localhost:3000/join', {
        method: 'POST',
        body: formDataToSend,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        navigate('/');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Fetch Error:', error);
    }
  };

  return (
    <div className={styles.join}>
      <h1>회원가입</h1>
      <div className={styles.img_div}>
        {imgFile ? <img src={imgFile} alt="프로필 이미지" /> : null}
        <div className={styles.icon_div} onClick={handleIconClick}>
          <IoCameraOutline className={styles.camera} />
        </div>
        <input
          type="file"
          name="profile"
          ref={fileInputRef}
          className={styles.hidden_input}
          accept="image/*"
          onChange={saveImgFile}
        />
      </div>
      <form method="POST" onSubmit={handleSubmit}>
        <div className={styles.input_div}>
          <label>닉네임</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />
        </div>
        <div className={styles.input_div}>
          <label>비밀번호</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div className={styles.input_div}>
          <label>이메일</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <button className={styles.button} type="submit">
          가입하기
        </button>
      </form>
    </div>
  );
}

export default Join;
