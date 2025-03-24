import styles from '../css/Chatting.module.css';
import socket from '../socket';
import { useEffect, useState, useRef } from 'react';
import { LuSend } from 'react-icons/lu';

export default function Chatting({ roomId, username, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

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
      <div className={styles.messageContainer} ref={messagesEndRef}>
        {messages.map((msg, idx) => {
          const isMine = msg.sender._id === userId;
          return (
            <div key={idx} className={isMine ? styles.my_chat_div : styles.other_chat_div}>
              {isMine ? (
                <span className={styles.my_message}>{msg.text}</span>
              ) : (
                <>
                  <img
                    src={`http://localhost:3000/${msg.sender.profile}`}
                    alt="프로필"
                    className={styles.profile_image}
                  />
                  <strong className={styles.strong}>{msg.sender?.username || '알 수 없음'}</strong>
                  <span className={styles.other_message}>{msg.text}</span>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.input}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <LuSend onClick={handleSend} />
      </div>
    </div>
  );
}
