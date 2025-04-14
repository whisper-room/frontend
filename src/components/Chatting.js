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
    socket.emit('joinRoom', roomId);
    socket.emit('markAsRead', { roomId, userId });

    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('updateMessages', (updatedMessages) => {
      // 읽음 처리된 메시지들에 대해 UI 업데이트
      setMessages(updatedMessages);
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off('receiveMessage');
      socket.off('updateMessages');
    };
  }, [roomId, userId]);

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

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    console.log(file);
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

      const data = await res.json();
      if (res.ok) {
        console.log('이미지 메시지 전송 성공:', data);
      } else {
        console.error(data.message);
      }
    } catch (err) {
      console.error('이미지 전송 실패:', err);
    }
  };

  return (
    <div className={styles.div}>
      <div className={styles.messageContainer} ref={messagesEndRef}>
        {messages.map((msg, idx) => {
          const isMine = msg.sender._id === userId;
          return (
            <div key={idx} className={isMine ? styles.my_chat_div : styles.other_chat_div}>
              {isMine ? (
                <div className={styles.my_chat_div}>
                  {msg.text && <span className={styles.my_message}>{msg.text}</span>}
                  {msg.img_url && (
                    <img src={`http://localhost:3000/${msg.img_url}`} alt="보낸 이미지" className={styles.chat_image} />
                  )}
                  {msg.unreadCount > 0 && <div className={styles.unread}>{msg.unreadCount}</div>}
                </div>
              ) : (
                <>
                  <img
                    src={`http://localhost:3000/${msg.sender.profile}`}
                    alt="프로필"
                    className={styles.profile_image}
                  />
                  <div className={styles.other_chat_div}>
                    <strong className={styles.strong}>{msg.sender?.username || '알 수 없음'}</strong>
                    {msg.text && <span className={styles.other_message}>{msg.text}</span>}
                    {msg.img_url && (
                      <img
                        src={`http://localhost:3000/${msg.img_url}`}
                        alt="받은 이미지"
                        className={styles.chat_image}
                      />
                    )}
                    {msg.unreadCount > 0 && <div className={styles.unread}>{msg.unreadCount}</div>}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.input}>
        <input value={text} onChange={(e) => setText(e.target.value)} />
        <LuSend onClick={handleSend} className={styles.icon} />
        <IoImageOutline className={styles.icon_image} onClick={handleImageClick} />
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
