import styles from './css/Join.module.css';
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
    <div>
      <h1 className={styles.join_h1}>회원가입</h1>
      <div className={styles.join_img_div}>
        {imgFile ? <img src={imgFile} alt="프로필 이미지" className={styles.join_image} /> : null}
        <div className={styles.join_icon_div} onClick={handleIconClick}>
          <IoCameraOutline className={styles.join_camera} />
        </div>
        <input type="file" ref={fileInputRef} className={styles.hidden_input} accept="image/*" onChange={saveImgFile} />
      </div>
      <form className={styles.join_form}>
        <div className={styles.join_input_div}>
          <label className={styles.join_label}>닉네임</label>
          <input type="text" className={styles.join_input} />
        </div>
        <div className={styles.join_input_div}>
          <label className={styles.join_label}>비밀번호</label>
          <input type="password" className={styles.join_input_password} />
        </div>
        <div className={styles.join_input_div}>
          <label className={styles.join_label}>이메일</label>
          <input type="email" className={styles.join_input} />
        </div>
        <button className={styles.join_button} type="submit">
          가입하기
        </button>
      </form>
    </div>
  );
}

export default Join;
