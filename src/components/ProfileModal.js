import styles from '../css/ProfileModal.module.css';
import { IoCameraOutline } from 'react-icons/io5';
import { RxCross2 } from 'react-icons/rx';
import { useState, useRef } from 'react';

function ProfileModal({ user, setUser, setShowPenIcon }) {
  const [imgFile, setImgFile] = useState('');
  const [nickname, setNickname] = useState('');

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
      setNickname(event.target.value);
    }
  };
  // 카메라 아이콘 클릭시 파일input 클릭
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  // modal 닫으면 내용 초기화
  const handleModal = () => {
    setShowPenIcon(false);
    setNickname('');
    setImgFile('');
  };

  // 프로필 수정 API
  const handleProfile = async () => {
    const formData = new FormData();
    if (imgFile) {
      formData.append('profile', fileInputRef.current.files[0]);
    }
    formData.append('username', nickname);

    try {
      const response = await fetch('http://localhost:3000/user/edit', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        alert('프로필이 성공적으로 업데이트되었습니다.');
        setUser(result.user); //서버 최신 유저 정보
        handleModal();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
    }
  };

  return (
    <div className={styles.profile_modal}>
      <div>
        <span>프로필 수정</span>
        <RxCross2 className={styles.cross_icon} onClick={handleModal} />
      </div>
      <div className={styles.img_div}>
        <img src={imgFile || (user ? `http://localhost:3000/${user.profile}` : '기본이미지.jpg')} alt="프로필" />
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
        value={nickname}
        onChange={handleInput}
        type="text"
        maxLength="20"
        placeholder="수정할 닉네임을 입력해주세요."
      />
      <span>{nickname.length}/20</span>
      <button onClick={handleProfile}>수정완료</button>
    </div>
  );
}

export default ProfileModal;
