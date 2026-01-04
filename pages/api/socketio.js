import { Server } from "socket.io";

export default async (req, res) => {
  if (!res.socket.server.io) {
    const httpServer = res.socket.server;
    const io = new Server(httpServer, {
      path: '/api/socketio',
    });
    res.socket.server.io = io;
  }
  res.end();
};
