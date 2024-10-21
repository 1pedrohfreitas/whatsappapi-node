// src/socket.ts
import { Server } from 'socket.io';

export function initializeSocket(server: any) {
  const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] },
  });

  return io;
}
