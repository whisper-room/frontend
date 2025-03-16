import styles from '../css/ChatList.module.css';

function ChatList({ roomname, roomimg }) {
  console.log(roomname);
  console.log(roomimg);
  return (
    <div className={styles.div}>
      {roomname.map((name, index) => (
        <div key={index}>
          <img className={styles.img} src={`http://localhost:3000/${roomimg[index]}`} alt="프로필 이미지" />
          <span className={styles.span}>{name}</span>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
