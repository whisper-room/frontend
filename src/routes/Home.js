import { useNavigate } from 'react-router-dom';
import styles from '../css/Home.module.css';

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <h1 className={styles.home_h1}>whisper room</h1>
      <div>
        <button className={`${styles.first_button} ${styles.home_button}`} onClick={() => navigate('/join')}>
          회원가입
        </button>
        <button className={styles.home_button} onClick={() => navigate('/login')}>
          로그인
        </button>
      </div>
    </div>
  );
}

export default Home;
