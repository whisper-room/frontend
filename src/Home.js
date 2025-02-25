import styles from './css/Home.module.css';

function Home() {
  return (
    <div>
      <h1>whisper room</h1>
      <div>
        <button className={styles.first_button}>회원가입</button>
        <button>로그인</button>
      </div>
    </div>
  );
}

export default Home;
