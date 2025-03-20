// socket.js
import { io } from 'socket.io-client';

// 백엔드 서버 주소 (포트 주의! 백엔드에서 socket.io 서버가 열려있는 포트)
const socket = io('http://localhost:3000'); // 또는 배포 주소

export default socket;
