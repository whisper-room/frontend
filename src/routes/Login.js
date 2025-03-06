import styles from '../css/Login.module.css';

function Login() {
  return (
    <div className={styles.login}>
      <h1>로그인</h1>
      <form>
        <div className={styles.div}>
          <label>이메일</label>
          <input type="email" required></input>
        </div>
        <div className={styles.div}>
          <label>비밀번호</label>
          <input type="password" required></input>
        </div>
        <button>로그인</button>
      </form>
    </div>
  );
}

export default Login;
