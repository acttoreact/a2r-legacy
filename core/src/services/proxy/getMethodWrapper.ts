const getMethodWrapper = (): string => {
  return `const methodWrapper = (method: string, ...args: any[]): Promise<any> => {
  console.log('methodWrapper', method, [...args]);
  if (!process.browser) {
    console.log('on server side, executing api method directly');
    try {
      const apiModule = getModule(method);
      return apiModule.default(...args);
    } catch (ex) {
      console.log('Error loading API module at server', ex.message, ex.stack);
    }
  }
  return new Promise<any>((resolve, reject): void => {
    console.log('socket connected?', socket && socket.connected);
    if (socket) {
      if (socket.disconnected) {
        console.log('socket disconnected, connecting');
        socket.connect();
      }
      const id = generateId();
      console.log('id', id);
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

      const call: MethodCall = {
        method,
        id,
        params: args,
      };
      
      console.log('before emit, call:', call);
      socket.emit('*', call);
    } else {
      console.error('No client socket available!');
      reject(new Error('No client socket available!'));
    }
  });
};`;
};

export default getMethodWrapper;
