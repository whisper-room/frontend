import { IoMdMenu } from 'react-icons/io';
import styles from '../css/ChattingHeader.module.css';

function ChattingHeader({ selectedRoomName }) {
  return (
    <div className={styles.div}>
      <span>{selectedRoomName}</span>
      <IoMdMenu className={styles.icon} />
    </div>
  );
}

export default ChattingHeader;
