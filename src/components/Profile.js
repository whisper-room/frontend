import styles from '../css/Profile.module.css';
import { FaPen } from 'react-icons/fa';

function ProfileCard({ user, onEditClick }) {
  return (
    <div className={styles.profile_container}>
      <div>
        <span>내 프로필</span>
      </div>
      <div>
        <img
          className={styles.img}
          src={user ? `http://localhost:3000/${user.profile}` : '기본이미지.jpg'}
          alt="프로필"
        />
        <div>
          <span>{user ? user.username : null}</span>
          <span>{user ? user.email : null}</span>
        </div>
        <FaPen className={styles.icon_pen} onClick={onEditClick} />
      </div>
    </div>
  );
}

export default ProfileCard;
