import { io } from "socket.io-client";
const socket = io('http://localhost:3001')
socket.emit("terminal:write", '\n')
export default socket;