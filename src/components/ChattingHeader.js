import styles from '../css/ChattingHeader.module.css';
import ChatRoomOptionModal from '../components/ChatRoomOptionModal';
import { IoMdMenu } from 'react-icons/io';
import { useState, useRef, useEffect } from 'react';

function ChattingHeader({ selectedRoomName, selectedRoomId, fetchChatList }) {
  const [showOption, setShowOption] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowOption(false);
      }
    };

    if (showOption) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showOption]);
  return (
    <div className={styles.div}>
      <span>{selectedRoomName}</span>
      <IoMdMenu className={styles.icon} onClick={() => setShowOption((prev) => !prev)} />

      {showOption && (
        <ChatRoomOptionModal
          setShowOption={setShowOption}
          fetchChatList={fetchChatList}
          selectedRoomId={selectedRoomId}
          modalRef={modalRef}
        />
      )}
    </div>
  );
}

export default ChattingHeader;
