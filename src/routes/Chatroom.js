import styles from '../css/Chatroom.module.css';
import { IoSearch } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa6';
import { FaPen } from 'react-icons/fa';

function Chatroom() {
  return (
    <div>
      <div className={styles.header}>
        <h1>whisper room</h1>
        <button>로그아웃</button>
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
