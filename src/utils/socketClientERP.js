import { io } from "socket.io-client";
import { api } from "../config";

let socketInstance = null;

/**
 * Returns a singleton socket.io connection to the ERP server.
 * Uses websocket transport only (no polling) for React Native compatibility.
 */
const getSocketClientERP = () => {
	if (!socketInstance || !socketInstance.connected) {
		socketInstance = io(api.API_URL, {
			transports: ["websocket"],
			upgrade: false,
			reconnection: true,
			reconnectionAttempts: 5,
			reconnectionDelay: 2000,
		});
	}
	return socketInstance;
};

export default getSocketClientERP;
