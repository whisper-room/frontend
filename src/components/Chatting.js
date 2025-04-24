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

  //포커스 여부 체크하여 읽음 처리
  useEffect(() => {
    const handleFocus = () => {
      if (!roomId || !userId) return;
      socket.emit('markAsRead', { roomId, userId });
    };

    const current = chatWindowRef.current;
    if (current) {
      current.addEventListener('mouseenter', handleFocus); // 마우스 올라왔을 때
    }

    return () => {
      if (current) {
        current.removeEventListener('mouseenter', handleFocus);
      }
    };
  }, [roomId, userId]);

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
    socket.on('receiveMessage', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('updateMessages', (updatedMessages) => {
      console.log('업데이트된 메시지:', updatedMessages);
      setMessages(updatedMessages);
    });

    return () => {
      socket.emit('leaveRoom', roomId);
      socket.off('receiveMessage');
      socket.off('updateMessages'); // 클린업도 꼭 해주세요!
    };
  }, [roomId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!roomId || !userId) return;

    const timeout = setTimeout(() => {
      socket.emit('markAsRead', { roomId, userId });
    }, 500); // 약간의 지연으로 '실제로 화면에 표시되었음'을 보장

    return () => clearTimeout(timeout);
  }, [roomId, userId, messages.length]);

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
    <div className={styles.div} ref={chatWindowRef}>
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
                  {msg.unreadCount > 0 && <span className={styles.unreadCount}>{msg.unreadCount}명 안 읽음</span>}
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
