/* eslint-disable @typescript-eslint/no-explicit-any */
import io from 'socket.io-client';
import generateId from 'shortid';

import { MethodCall, SocketMessage } from '../sockets/sockets';

const socket = io('url', {
  autoConnect: false,
  path: '/ws',
});

const methodWrapper = (method: string, ...args: any[]): Promise<any> =>
  new Promise<SocketMessage>((resolve, reject): void => {
    const id = generateId();

    if (socket) {
      socket.on(id, (res: SocketMessage): void => {
        socket.off(id);
        if (res.o) {
          resolve(res.d);
        } else {
          const error = new Error(res.e);
          error.stack = res.s;
          reject(error);
        }
      });
    }

    const call: MethodCall = {
      method,
      id,
      params: args,
    };
    
    socket.emit('*', call);
  });

// Add docs from original method here
const usersLogin = (...args: any[]): Promise<any> =>
  methodWrapper('users.login', ...args);
  
// (...args: any[]): Promise<SocketMessage> => methodWrapper('users.login', ...args)

const apiObject = {
  users: {
    login: usersLogin,
  },
};

export const buildClientApi = (): void => {
// Copy files
// Compile?
// Build main file: imports, export default like an object
// Build package.json and stuff
// Copy contents to node_modules/api
};

export default apiObject;
