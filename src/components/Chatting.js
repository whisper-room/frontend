import styles from '../css/Chatting.module.css';
import { useEffect, useState } from 'react';
import socket from '../socket';

export default function Chatting({ roomId, username, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');

  // 방 클릭 시 초기 메시지 가져옴
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:3000/chat/${roomId}`, {
          credentials: 'include',
        });
        const data = await res.json();
        setMessages(data.messages); // 메시지 배열로 세팅
        console.log(data.messages);
      } catch (error) {
        console.error('메시지 불러오기 실패:', error);
      }
    };

    fetchMessages();
  }, [roomId]);

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
            <img
              src={`http://localhost:3000/${msg.sender.profile}`}
              alt="프로필"
              style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '5px' }}
            />
            <strong>{msg.sender?.username || '알 수 없음'}:</strong> {msg.text}
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
