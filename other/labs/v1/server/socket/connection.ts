import io from 'socket.io';

export interface SocketEvent {
  (socket: io.Socket): void;
}

export const socketList: { [id: string]: io.Socket } = {};

export default {
  socketList,
};
