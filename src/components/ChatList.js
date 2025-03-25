import styles from '../css/ChatList.module.css';

function ChatList({ roomname, roomimg, roomIds, onClick }) {
  return (
    <div className={styles.div}>
      {roomname.map((name, index) => (
        <div key={index} onClick={() => onClick(roomIds[index], name)}>
          <img className={styles.img} src={`http://localhost:3000/${roomimg[index]}`} alt="프로필 이미지" />
          <span className={styles.span}>{name}</span>
        </div>
      ))}
    </div>
  );
}

export default ChatList;
