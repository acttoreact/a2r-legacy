const getMethodWrapper = (): string => {
  return `const methodWrapper = (method: string, ...args: any[]): Promise<any> =>
  new Promise<model.SocketMessage>((resolve, reject): void => {
    const socket = getSocket();

    if (socket) {
      const id = generateId();
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
      
      socket.emit('*', call);
    } else {
      console.error('No client socket available!');
    }
  });`;
};

export default getMethodWrapper;
