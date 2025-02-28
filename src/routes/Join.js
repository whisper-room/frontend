import styles from '../css/Join.module.css';
import { IoCameraOutline } from 'react-icons/io5';
import { useRef, useState } from 'react';

function Join() {
  const fileInputRef = useRef(null);
  const [imgFile, setImgFile] = useState('');

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

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className={styles.join}>
      <h1>회원가입</h1>
      <div className={styles.img_div}>
        {imgFile ? <img src={imgFile} alt="프로필 이미지" /> : null}
        <div className={styles.icon_div} onClick={handleIconClick}>
          <IoCameraOutline className={styles.camera} />
        </div>
        <input type="file" ref={fileInputRef} className={styles.hidden_input} accept="image/*" onChange={saveImgFile} />
      </div>
      <form>
        <div className={styles.input_div}>
          <label>닉네임</label>
          <input type="text" />
        </div>
        <div className={styles.input_div}>
          <label>비밀번호</label>
          <input type="password" />
        </div>
        <div className={styles.input_div}>
          <label>이메일</label>
          <input type="email" />
        </div>
        <button className={styles.button} type="submit">
          가입하기
        </button>
      </form>
    </div>
  );
}

export default Join;
