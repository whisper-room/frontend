import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/Login.module.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        navigate('/chatroom');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  return (
    <div className={styles.login}>
      <h1>로그인</h1>
      <form method="POST" onSubmit={handleSubmit}>
        <div className={styles.div}>
          <label>이메일</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className={styles.div}>
          <label>비밀번호</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default Login;
