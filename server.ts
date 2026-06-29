import express from "express";
import path from "path";
import http from "http";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import app from "./src/express-app";

type SocketUserRole = "CLIENT" | "FREELANCER" | "ADMIN";

type SocketAuthUser = {
  id: string;
  email?: string;
  role: SocketUserRole;
  isVerified?: boolean;
};

async function startServer() {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:5173"],
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  app.set("io", io);

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("Socket token missing"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_ACCESS_SECRET || "innovexa_access_secret_key_12345"
      ) as SocketAuthUser;

      socket.data.user = decoded;

      next();
    } catch {
      next(new Error("Invalid socket token"));
    }
  });

  io.on("connection", (socket) => {
    const user = socket.data.user as SocketAuthUser;

    console.log(`[Socket] Connected: ${socket.id}, User: ${user.id}, Role: ${user.role}`);

    socket.join(`user:${user.id}`);
    socket.join(`role:${user.role}`);

    socket.on("join:user", (payload: { userId: string; role: SocketUserRole }) => {
      if (payload.userId !== user.id) return;

      socket.join(`user:${payload.userId}`);
      socket.join(`role:${payload.role}`);
    });

    socket.on("join:role", (payload: { role: SocketUserRole }) => {
      if (payload.role === user.role) {
        socket.join(`role:${payload.role}`);
      }
    });

    socket.on("conversation:join", (payload: { conversationId: string }) => {
      socket.join(`conversation:${payload.conversationId}`);
    });

    socket.on("conversation:leave", (payload: { conversationId: string }) => {
      socket.leave(`conversation:${payload.conversationId}`);
    });

    socket.on("message:send", (data) => {
      io.to(`conversation:${data.conversationId}`).emit("message:new", data);
      io.to(`user:${data.receiverId}`).emit("notification:new", {
        type: "message",
        title: "New message",
        description: data.text,
        conversationId: data.conversationId,
      });
    });

    socket.on("message:typing", (data) => {
      socket.to(`conversation:${data.conversationId}`).emit("message:typing", data);
    });

    socket.on("message:read", (data) => {
      socket.to(`conversation:${data.conversationId}`).emit("message:read", data);
    });

    // Old event support
    socket.on("join_conversation", (conversationId: string) => {
      socket.join(`conversation:${conversationId}`);
    });

    socket.on("send_message", (data) => {
      io.to(`conversation:${data.conversationId}`).emit("message:new", data);
    });

    socket.on("join_user_notifications", (userId: string) => {
      if (userId === user.id) {
        socket.join(`user:${userId}`);
      }
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] Disconnected: ${socket.id}`);
    });
  });

  const PORT = Number(process.env.PORT) || 3000;

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));

    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`[Catalyst Server] Running on http://localhost:${PORT}`);
  });
}

startServer();