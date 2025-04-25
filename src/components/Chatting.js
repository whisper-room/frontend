import styles from '../css/Chatting.module.css';
import socket from '../socket';
import { useEffect, useState, useRef } from 'react';
import { LuSend } from 'react-icons/lu';
import { IoImageOutline } from 'react-icons/io5';

export default function Chatting({ roomId, username, userId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatWindowRef = useRef(null);

  // 채팅방 입장 + 메시지 수신 처리
  useEffect(() => {
    if (!roomId) return;

    socket.emit('joinRoom', roomId);
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });
    socket.on('updateMessages', setMessages);

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off('receiveMessage');
      socket.off('updateMessages');
    };
  }, [roomId]);

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

  // 자동 스크롤
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  // 읽음 처리 (지연 + 마우스 진입)
  useEffect(() => {
    if (!roomId || !userId) return;

    const markRead = () => socket.emit('markAsRead', { roomId, userId });

    const timeout = setTimeout(markRead, 500);
    const current = chatWindowRef.current;
    current?.addEventListener('mouseenter', markRead);

    return () => {
      clearTimeout(timeout);
      current?.removeEventListener('mouseenter', markRead);
    };
  }, [roomId, userId, messages.length]);

  // 텍스트 전송
  const handleSend = () => {
    if (text.trim()) {
      socket.emit('sendMessage', { roomId, sender: userId, text });
      setText('');
    }
  };

  // 이미지 전송
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('img_url', file);
    formData.append('roomId', roomId);
    formData.append('sender', userId);

    try {
      const res = await fetch('http://localhost:3000/chat', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });
      if (!res.ok) throw new Error('이미지 업로드 실패');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.div} ref={chatWindowRef}>
      <div className={styles.messageContainer} ref={messagesEndRef}>
        {messages.map((msg, idx) => {
          const isMine = msg.sender._id === userId;
          return (
            <div key={idx} className={isMine ? styles.my_chat_div : styles.other_chat_div}>
              {!isMine && (
                <img
                  src={`http://localhost:3000/${msg.sender.profile}`}
                  alt="프로필"
                  className={styles.profile_image}
                />
              )}
              <div className={isMine ? styles.my_chat_div : styles.other_chat_div}>
                {!isMine && <strong className={styles.strong}>{msg.sender?.username}</strong>}
                {isMine && msg.unreadCount > 0 && <span className={styles.unreadCountLeft}>{msg.unreadCount}</span>}
                {msg.text && <span className={isMine ? styles.my_message : styles.other_message}>{msg.text}</span>}
                {msg.img_url && (
                  <img src={`http://localhost:3000/${msg.img_url}`} alt="채팅 이미지" className={styles.chat_image} />
                )}
                {!isMine && msg.unreadCount > 0 && <span className={styles.unreadCountRight}>{msg.unreadCount}</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className={styles.input}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <LuSend onClick={handleSend} className={styles.icon} />
        <IoImageOutline onClick={() => fileInputRef.current.click()} className={styles.icon_image} />
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
}
