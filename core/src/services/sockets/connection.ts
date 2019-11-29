import io from 'socket.io';

export const socketList: { [id: string]: io.Socket } = {};

export default {
  socketList,
};
