import styles from '../css/Chatroom.module.css';
import { data, useNavigate } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import { IoCameraOutline } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa6';
import { FaPen } from 'react-icons/fa';
import { RxCross2 } from 'react-icons/rx';
import { useEffect, useState, useRef } from 'react';

function Chatroom() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showInput, setShowInput] = useState(false); //돋보기 아이콘 클릭 여부 확인
  const [showPenIcon, setShowPenIcon] = useState(false); //프로필 수정 아이콘 클릭 여부 확인
  const [imgFile, setImgFile] = useState('');
  const [nickname, setNickname] = useState('');
  const inputRef = useRef(null);
  const searchIconRef = useRef(null);
  const fileInputRef = useRef(null);
  // useRef는 React에서 DOM 요소에 직접 접근하거나 컴포넌트가 리렌더링될 때도 값이 유지되도록 도와줌
  //<input> 태그에 ref={inputRef}를 설정하면, 해당 요소에 대한 참조를 inputRef.current에 저장하여 직접 해당 input 요소에 접근 가능

  // 세션 확인해서 내 프로필 표시
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:3000/session', {
          method: 'GET',
          credentials: 'include',
        });

        const data = await res.json();
        if (data.loggedIn) {
          setUser(data.user);
          console.log(data.user);
        } else {
          console.log('User not logged in');
        }
      } catch (error) {
        console.error('세션 확인 오류:', error);
      }
    };

    fetchUser();
  }, [user]);

  // 로그아웃 버튼 클릭시 로그아웃
  const handleClick = async () => {
    try {
      const response = await fetch('http://localhost:3000/logout', {
        method: 'POST',
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
        navigate('/');
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Login Error:', error);
    }
  };

  // 검색 아이콘 클릭 시 input 표시
  const handleSearchClick = (event) => {
    setShowInput(true);
  };

  // input 외부 클릭 시 input 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !inputRef.current.contains(event.target) &&
        !searchIconRef.current.contains(event.target) // 검색 아이콘도 클릭 예외 처리
      ) {
        setShowInput(false);
      }
    };

    if (showInput) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showInput]);

  // 프로필 수정 아키노 클릭시 모달창 상태 변화
  const handleEditClick = () => {
    setShowPenIcon(true);
  };

  // 카메라 아이콘 클릭시 파일input 클릭
  const handleIconClick = () => {
    fileInputRef.current.click();
  };

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
        setUser((prevUser) => ({
          ...prevUser,
          username: nickname || prevUser.username,
          //nickname이 변경 되었다면 nickname을 저장, 변경되지 않았다면 기존값(prevUser)유지
          profile: imgFile || prevUser.profile,
        }));
        console.log(data.user);
        handleModal();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('프로필 업데이트 오류:', error);
    }
  };

  return (
    <div>
      <div className={styles.header}>
        <h1>whisper room</h1>
        <button onClick={handleClick}>로그아웃</button>
      </div>
      <div className={styles.chatroom_container}>
        <div>
          <IoSearch className={styles.first_icon} onClick={handleSearchClick} ref={searchIconRef} />
          {!showInput && <FaPlus className={styles.first_icon} />}
          {showInput && (
            <input ref={inputRef} className={styles.search_input} type="text" placeholder="채팅방 이름을 입력하세요." />
          )}
        </div>
        <div></div>
        <div></div>
        <div></div>
        <div className={styles.profile_container}>
          <div>
            <span>내 프로필</span>
          </div>
          <div>
            <img
              className={styles.img}
              src={user ? `http://localhost:3000/${user.profile}` : '기본이미지.jpg'}
              alt="프로필"
            />
            <div>
              <span>{user ? user.username : null}</span>
              <span>{user ? user.email : null}</span>
            </div>
            <FaPen className={styles.icon_pen} onClick={handleEditClick} />
          </div>
        </div>
      </div>
      {showPenIcon && (
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
      )}
    </div>
  );
}

export default Chatroom;
