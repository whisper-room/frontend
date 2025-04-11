// import styles from '../css/ChatRoomModify.module.css';
import styles from '../css/ProfileModal.module.css';
import { IoCameraOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { useState, useRef } from 'react';

function ChatRoomModify({ roomImg, roomId, fetchChatList, setSelectedRoomName, setModifyClickCheck }) {
  const [imgFile, setImgFile] = useState('');
  const [roomname, setRoomName] = useState('');

  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  const saveImgFile = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImgFile(reader.result);
      };
    }
  };
  const handleInput = (event) => {
    if (event.target.value.length <= 20) {
      setRoomName(event.target.value);
    }
  };
  const handleRoomName = async () => {
    const formData = new FormData();
    if (imgFile) {
      formData.append('roomimg', fileInputRef.current.files[0]);
    }
    formData.append('roomname', roomname);

    try {
      const response = await fetch(`http://localhost:3000/chatroom/${roomId}`, {
        method: 'PATCH',
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        alert(data.message || '수정 실패');
        return;
      }

      alert('채팅방 정보가 수정되었습니다.');
    } catch (error) {
      console.error(error);
      alert('서버 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.chatroom_modal}>
      <div>
        <span>프로필 수정</span>
        <RxCross2 className={styles.cross_icon} />
      </div>
      <div className={styles.img_div}>
        <img src={imgFile || (roomImg ? `http://localhost:3000/${roomImg}` : '기본이미지.jpg')} alt="채팅방 이미지" />
        <div className={styles.icon_div} onClick={handleIconClick}>
          <IoCameraOutline className={styles.camera} />
        </div>
        <input
          type="file"
          name="profile"
          ref={fileInputRef}
          className={styles.hidden_input}
          accept="image/*"
          onChange={saveImgFile}
        />
      </div>
      <input
        className={styles.profile_input}
        value={roomname}
        onChange={handleInput}
        type="text"
        maxLength="20"
        placeholder="수정할 채팅방 이름을 입력해주세요."
      />
      <span className={styles.span}>{roomname.length}/20</span>
      <button onClick={handleRoomName}>수정완료</button>
    </div>
  );
}
export default ChatRoomModify;
