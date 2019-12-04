/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
// import generateId from 'shortid';

// import getPath from './getPath';
// import getSocket from './getSocket';
// import { MethodCall, SocketMessage } from '../sockets/sockets';
import getFrameworkPath from '../../tools/getFrameworkPath';
// import out from '../../util/out';
import build from './build';

// const methodWrapper = (method: string, ...args: any[]): Promise<any> =>
//   new Promise<SocketMessage>((resolve, reject): void => {
//     const socket = getSocket();

//     if (socket) {
//       const id = generateId();
//       socket.on(id, (res: SocketMessage): void => {
//         socket.off(id);
//         if (res.o) {
//           resolve(res.d);
//         } else {
//           const error = new Error(res.e);
//           error.stack = res.s;
//           reject(error);
//         }
//       });

//       const call: MethodCall = {
//         method,
//         id,
//         params: args,
//       };
      
//       socket.emit('*', call);
//     } else {
//       out.error('No client socket available!');
//     }
//   });

// Add docs from original method here
// const usersLogin = (...args: any[]): Promise<any> =>
//   methodWrapper('users.login', ...args);
  
// (...args: any[]): Promise<SocketMessage> => methodWrapper('users.login', ...args)

// const apiObject = {
//   users: {
//     login: usersLogin,
//   },
// };

// export { setup as setupSocket } from './getSocket';

const buildClientApi = async(): Promise<void> => {
  const frameworkPath = await getFrameworkPath();
  const mainFilePath = path.resolve(frameworkPath, 'server', 'api.ts');
  await build(mainFilePath);
  // const clientApiPath = await getPath();
  // Copy files
  // Compile?
  // Build main file: imports, export default like an object
  // Build package.json and stuff
  // Copy contents to node_modules/api
};

export default buildClientApi;
