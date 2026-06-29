import { io, Socket } from "socket.io-client";

type UserRole = "CLIENT" | "FREELANCER" | "ADMIN";

let socket: Socket | null = null;

const getSocketUrl = () => {
  return (
    (import.meta as any).env?.VITE_BACKEND_URL ||
    window.location.origin
  );
};

export const getSocket = (): Socket => {
  if (!socket) {
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");

    socket = io(getSocketUrl(), {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ["websocket", "polling"],
      auth: {
        token,
      },
    });

    socket.on("connect", () => {
      console.log("[Socket Client] Connected:", socket?.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("[Socket Client] Disconnected:", reason);
    });

    socket.on("connect_error", (error) => {
      console.error("[Socket Client] Connection Error:", error.message);
    });
  }

  return socket;
};

export const connectSocket = (user: {
  id: string;
  role: UserRole;
}) => {
  const s = getSocket();

  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("token");

  s.auth = { token };

  if (!s.connected) {
    s.connect();
  }

  s.emit("join:user", {
    userId: user.id,
    role: user.role,
  });

  s.emit("join:role", {
    role: user.role,
  });

  console.log(
    `[Socket Client] Joined user room ${user.id} and role room ${user.role}`
  );
};

export const joinConversation = (conversationId: string) => {
  const s = getSocket();

  s.emit("conversation:join", {
    conversationId,
  });
};

export const leaveConversation = (conversationId: string) => {
  const s = getSocket();

  s.emit("conversation:leave", {
    conversationId,
  });
};

export const sendSocketMessage = (payload: {
  conversationId: string;
  senderId: string;
  receiverId: string;
  text: string;
}) => {
  const s = getSocket();

  s.emit("message:send", payload);
};

export const sendTyping = (payload: {
  conversationId: string;
  userId: string;
  isTyping: boolean;
}) => {
  const s = getSocket();

  s.emit("message:typing", payload);
};

export const markMessageRead = (payload: {
  conversationId: string;
  messageId: string;
  userId: string;
}) => {
  const s = getSocket();

  s.emit("message:read", payload);
};

export const listenNotifications = (
  callback: (notification: any) => void
) => {
  const s = getSocket();

  s.off("notification:new");
  s.on("notification:new", callback);
};

export const listenNewMessage = (
  callback: (message: any) => void
) => {
  const s = getSocket();

  s.off("message:new");
  s.on("message:new", callback);
};

export const listenTyping = (
  callback: (data: any) => void
) => {
  const s = getSocket();

  s.off("message:typing");
  s.on("message:typing", callback);
};

export const listenBidUpdate = (
  callback: (data: any) => void
) => {
  const s = getSocket();

  s.off("bid:update");
  s.on("bid:update", callback);
};

export const listenContractUpdate = (
  callback: (data: any) => void
) => {
  const s = getSocket();

  s.off("contract:update");
  s.on("contract:update", callback);
};

export const listenPaymentUpdate = (
  callback: (data: any) => void
) => {
  const s = getSocket();

  s.off("payment:update");
  s.on("payment:update", callback);
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
    console.log("[Socket Client] Disconnected & cleaned");
  }
};