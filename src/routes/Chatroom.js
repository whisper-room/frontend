import styles from '../css/Chatroom.module.css';
import { useNavigate } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa6';
import { FaPen } from 'react-icons/fa';
import { useEffect, useState, useRef } from 'react';

function Chatroom() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [showInput, setShowInput] = useState(false);
  const inputRef = useRef(null);
  const searchIconRef = useRef(null);
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
        } else {
          console.log('User not logged in');
        }
      } catch (error) {
        console.error('세션 확인 오류:', error);
      }
    };

    fetchUser();
  }, []);

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
            <FaPen className={styles.icon_pen} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chatroom;
