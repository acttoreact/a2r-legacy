import http from 'http';
import express from 'express';
import colors from 'colors';

import out from '../util/out';
import applyMiddlewares from './applyMiddlewares';
import socket from './socket';

interface ServerResponse {
  server: http.Server;
  close: () => void;
}

const createServer = (port: number): Promise<ServerResponse> => {
  return new Promise<ServerResponse>((resolve): void => {
    const expressApp = express();
    applyMiddlewares(expressApp);
    const server = http.createServer(expressApp);
    socket(server);
    const listener = server.listen(port, (): void => {
      out.info(
        colors.white.bold(
          `Listening ${colors.yellow.bold(
            `http://localhost:${port.toString()}/`,
          )}`,
        ),
      );
    });
    listener.on('close', (): void => {
      out.info(colors.white.bold('Http server closed'));
    });
    const close = (): void => {
      listener.close();
    };
    resolve({ server: listener, close });
  });
};

export default createServer;
