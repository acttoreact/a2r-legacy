import io from 'socket.io';
import setting from '../config/settings';

const setup = (express: Express.Application): void => {
  const server = io(express, { path: setting.socketPath });

  server.on(
    'connection',
    (socket): void => {
      socket.emit('news', { hello: 'world' });
    }
  );
};

export default setup;
