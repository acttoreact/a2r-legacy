import io from 'socket.io-client';

import settings from '../../config/settings';

const { socketPath } = settings;

let socket: SocketIOClient.Socket | null = null;

const getSocket = (): SocketIOClient.Socket | null => {
  return socket;
};

export const setup = (port: number): void => {
  socket = io(`http://localhost:${port}`, {
    autoConnect: false,
    path: socketPath,
  });
};

export default getSocket;