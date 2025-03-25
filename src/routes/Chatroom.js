import styles from '../css/Chatroom.module.css';
import ProfileCard from '../components/Profile';
import ProfileModal from '../components/ProfileModal';
import CreateChatModal from '../components/CreateChatModal';
import Chatting from '../components/Chatting';
import ChatList from '../components/ChatList';
import ChattingHeader from '../components/ChattingHeader';
import { useNavigate } from 'react-router-dom';
import { IoSearch } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa6';
import { useEffect, useState, useRef } from 'react';

function Chatroom() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [roomname, setRoomName] = useState([]);
  const [roomimg, setRoomImg] = useState([]);
  const [roomIds, setRoomIds] = useState([]);
  const [showInput, setShowInput] = useState(false); //돋보기 아이콘 클릭 여부 확인
  const [showPenIcon, setShowPenIcon] = useState(false); //프로필 수정 아이콘 클릭 여부 확인
  const [showPlusIcon, setShowPlusIcon] = useState(false); //채팅방 추가 아이콘 클릭 여부 확인
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [selectedRoomName, setSelectedRoomName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
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

  const fetchChatList = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/chatlist', {
        method: 'GET',
        credentials: 'include',
      });

      const data = await res.json();
      const roomNames = data.map((room) => room.roomname);
      const roomImgs = data.map((room) => room.roomimg);
      const ids = data.map((room) => room._id);
      setRoomName(roomNames);
      setRoomImg(roomImgs);
      setRoomIds(ids);
    } catch (error) {
      console.error('채팅방 리스트 가져오기 오류:', error);
    }
  };

  // user가 있을 때만 호출
  useEffect(() => {
    if (!user) return;
    fetchChatList();
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

  // 프로필 수정 아이콘 클릭시 모달창 상태 변화
  const handleEditClick = () => {
    setShowPenIcon(true);
  };

  const handlePlusIcon = () => {
    setShowPlusIcon(true);
    console.log(showPlusIcon);
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRooms = roomname
    .map((name, index) => ({
      name,
      img: roomimg[index],
      id: roomIds[index],
    }))
    .filter((room) => room.name.includes(searchQuery));

  return (
    <div>
      <div className={styles.header}>
        <h1>whisper room</h1>
        <button onClick={handleClick}>로그아웃</button>
      </div>
      <div className={styles.chatroom_container}>
        <div>
          <IoSearch className={styles.first_icon} onClick={handleSearchClick} ref={searchIconRef} />
          {!showInput && <FaPlus className={styles.first_icon} onClick={handlePlusIcon} />}
          {showInput && (
            <input
              ref={inputRef}
              value={searchQuery}
              onChange={handleSearchChange}
              className={styles.search_input}
              type="text"
              placeholder="채팅방 이름을 입력하세요."
            />
          )}
        </div>
        <div>{selectedRoomId && <ChattingHeader selectedRoomName={selectedRoomName} />}</div>
        <div>
          <ChatList
            roomname={filteredRooms.map((room) => room.name)}
            roomimg={filteredRooms.map((room) => room.img)}
            roomIds={filteredRooms.map((room) => room.id)}
            onClick={(roomId, roomName) => {
              setSelectedRoomId(roomId);
              setSelectedRoomName(roomName);
            }}
          />
        </div>
        <div>{selectedRoomId && <Chatting roomId={selectedRoomId} username={user?.username} userId={user?._id} />}</div>
        <div className={styles.profile_container}>
          <ProfileCard user={user} onEditClick={handleEditClick} />
        </div>
      </div>
      {showPenIcon && <ProfileModal user={user} setUser={setUser} setShowPenIcon={setShowPenIcon} />}
      {showPlusIcon && <CreateChatModal setShowPlusIcon={setShowPlusIcon} fetchChatList={fetchChatList} />}
    </div>
  );
}

export default Chatroom;
