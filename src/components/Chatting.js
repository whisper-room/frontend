import styles from '../css/Chatting.module.css';
import { useEffect, useState } from 'react';
import socket from '../socket';

export default function Chatting({ roomId, username, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    // 방에 입장
    socket.emit('joinRoom', roomId);

    // 메시지 수신
    socket.on('receiveMessage', ({ sender, text }) => {
      setMessages((prev) => [...prev, { sender, text }]);
    });

    // 클린업
    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off('receiveMessage'); // 메모리 누수 방지
    };
  }, [roomId]);

  const handleSend = () => {
    if (text.trim() === '') return;
    socket.emit('sendMessage', {
      roomId,
      sender: userId,
      text,
    });
    setText('');
  };

  return (
    <div className={styles.div}>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx}>
            <strong>{msg.sender}:</strong> {msg.text}
          </p>
        ))}
      </div>
      <input
        className={styles.input}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="메시지를 입력하세요"
      />
      <button onClick={handleSend}>보내기</button>
    </div>
  );
}
