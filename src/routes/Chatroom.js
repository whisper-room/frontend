import styles from '../css/Chatroom.module.css';

function Chatroom() {
  return (
    <div>
      <div className={styles.header}>
        <h1>whisper room</h1>
        <button>로그아웃</button>
      </div>
    </div>
  );
}
export default Chatroom;
