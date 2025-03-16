import styles from '../css/ProfileModal.module.css';
import { IoCameraOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { useState, useRef } from 'react';

function CreateChatModal({ setShowPlusIcon, fetchChatList }) {
  const [imgFile, setImgFile] = useState('');
  const [roomname, setRoomName] = useState('');
  const [userarray, setUserArray] = useState('');

  const fileInputRef = useRef(null);

  // input으로 받은 image 표시
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
  // input 20자 제한
  const handleInput = (event) => {
    if (event.target.value.length <= 20) {
      setRoomName(event.target.value);
    }
  };
  const handleUsersInput = (event) => {
    setUserArray(event.target.value);
  };
  // 카메라 아이콘 클릭시 파일input 클릭
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  // modal 닫으면 내용 초기화
  const handleModal = () => {
    setShowPlusIcon(false);
    setRoomName('');
    setImgFile('');
    setUserArray('');
  };

  const handleCreateChat = async () => {
    const usernames = userarray
      .split(',')
      .map((user) => user.trim()) //각 요소의 앞 뒤 공백 제거
      .filter((user) => user !== ''); //빈 문자열 제거

    console.log(usernames);

    const formData = new FormData();
    formData.append('roomname', roomname);
    formData.append('usernames', JSON.stringify(usernames)); // 배열을 문자열로 변환하여 추가
    if (fileInputRef.current.files[0]) {
      formData.append('roomimg', fileInputRef.current.files[0]);
    }

    try {
      const response = await fetch('http://localhost:3000/chatroom/createroom', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        alert('채팅방이 생성되었습니다!');
        fetchChatList();
        handleModal();
      } else {
        alert(data.message || '채팅방 생성 실패');
      }
    } catch (error) {
      console.error('채팅방 생성 오류:', error);
      alert('채팅방을 생성하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.profile_modal}>
      <div>
        <span>채팅방 만들기</span>
        <RxCross2 className={styles.cross_icon} onClick={handleModal} />
      </div>
      <div className={styles.img_div}>
        {imgFile ? <img src={imgFile} alt="프로필 이미지" /> : null}
        <div className={styles.icon_div} onClick={handleIconClick}>
          <IoCameraOutline className={styles.camera} />
        </div>
        <input
          type="file"
          name="roomimg"
          ref={fileInputRef}
          className={styles.hidden_input}
          accept="image/*"
          onChange={saveImgFile}
        />
      </div>
      <div className={styles.input_div}>
        <input
          className={styles.createChat_input}
          value={roomname}
          onChange={handleInput}
          type="text"
          maxLength="20"
          placeholder="채팅방 이름을 입력해 주세요."
        />
        <span className={styles.span}>{roomname.length}/20</span>
      </div>
      <div className={styles.input_div}>
        <input
          className={styles.createChat_input}
          value={userarray}
          onChange={handleUsersInput}
          type="text"
          maxLength="20"
          placeholder="초대할 대화상대 닉네임을 입력해주세요."
        />
        <span className={styles.span}>{roomname.length}/20</span>
      </div>

      <button onClick={handleCreateChat}>완료</button>
    </div>
  );
}

export default CreateChatModal;
