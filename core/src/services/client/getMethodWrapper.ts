const getMethodWrapper = (): string => {
  return `const methodWrapper = (method: string, ...args: any[]): Promise<any> => {
  console.log('methodWrapper', method, [...args]);
  return new Promise<model.SocketMessage>((resolve, reject): void => {
    console.log('socket connected?', socket && socket.connected);
    if (socket) {
      if (socket.disconnected) {
        console.log('socket disconnected, connecting');
        socket.connect();
      }
      const id = generateId();
      console.log('id', id);
      socket.on(id, (res: model.SocketMessage): void => {
        socket.off(id);
        if (res.o) {
          resolve(res.d);
        } else {
          const error = new Error(res.e);
          error.stack = res.s;
          reject(error);
        }
      });

      const call: model.MethodCall = {
        method,
        id,
        params: args,
      };
      
      console.log('before emit, call:', call);
      socket.emit('*', call);
    } else {
      console.error('No client socket available!');
    }
  });
};`;
};

export default getMethodWrapper;
