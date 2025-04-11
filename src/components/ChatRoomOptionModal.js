import styles from '../css/ChatRoomOptionModal.module.css';
import ChatRoomModify from '../components/ChatRoomModify';
import { useState } from 'react';

function ChatroomOptionsModal({
  modalRef,
  selectedRoomId,
  fetchChatList,
  setShowOption,
  setSelectedRoomId,
  setSelectedRoomName,
  selectedRoomImg,
}) {
  const [modifyClickCheck, setModifyClickCheck] = useState(false);
  const handleMessageDelete = async () => {
    try {
      const response = await fetch(`http://localhost:3000/chatroom/${selectedRoomId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        fetchChatList();
        setShowOption(false);
        setSelectedRoomId(null);
        setSelectedRoomName('');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('ChatRoom Delete Error:', error);
    }
  };
  const handleMessageModify = () => {
    setModifyClickCheck(true);
  };
  console.log(modifyClickCheck);
  return (
    <>
      {!modifyClickCheck && (
        <div ref={modalRef} className={styles.div}>
          <button onClick={handleMessageModify}>채팅방 수정</button>
          <button onClick={handleMessageDelete}>채팅방 삭제</button>
          <button>대화상대 초대</button>
        </div>
      )}
      {modifyClickCheck && (
        <ChatRoomModify
          roomImg={selectedRoomImg}
          roomId={selectedRoomId}
          fetchChatList={fetchChatList}
          setSelectedRoomName={setSelectedRoomName}
          setModifyClickCheck={setModifyClickCheck}
        />
      )}
    </>
  );
}
export default ChatroomOptionsModal;
