import styles from '../css/Chatroom.module.css';
import { useNavigate } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa6';
import { FaPen } from 'react-icons/fa';

function Chatroom() {
  const navigate = useNavigate();
  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        navigate('/');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  };
  return (
    <div>
      <div className={styles.header}>
        <h1>whisper room</h1>
        <button onClick={handleClick}>로그아웃</button>
      </div>
      <div className={styles.chatroom_container}>
        <div>
          <IoSearch className={styles.first_icon} />
          <FaPlus className={styles.first_icon} />
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div className={styles.profile_container}>
          <div>
            <span>내 프로필</span>
          </div>
          <div>
            <img className={styles.img} src="face.jpg" alt="" />
            <div>
              <span>닉네임</span>
              <span>nickname@naver.com</span>
            </div>
            <FaPen className={styles.icon_pen} />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Chatroom;
