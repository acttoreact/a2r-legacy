import http from 'http';
import express from 'express';
import next from 'next';
import colors from 'colors';

import out from '../util/out';
import applyMiddlewares from './applyMiddlewares';
import socket from './socket';

import settings from '../config/settings';

interface ServerResponse {
  server: http.Server;
  close: () => void;
}

const createServer = (dev: boolean, port: number): Promise<ServerResponse> => {
  return new Promise<ServerResponse>((resolve): void => {
    const app = next({ dev: settings.dev });
    app.prepare().then((): void => {
      const requestHandler = app.getRequestHandler();
      const expressApp = express();
      applyMiddlewares(expressApp);
      expressApp.all('*', (req, res): Promise<void> => {
        return requestHandler(req, res);
      });
      const server = http.createServer(expressApp);
      socket(server);
      const listener = server.listen(port, (): void => {
        out.info(
          colors.white.bold(
            `Listening ${colors.yellow.bold(`http://localhost:${port}/`)}`,
          ),
        );
      });
      listener.on('close', (): void => {
        out.info(colors.white.bold('Http server closed'));
      });
      listener.on('error', (err): void => {
        out.error(`Server error: ${colors.red.bold(err.message)}${err.stack ? `\n${colors.red(err.stack)}` : ''}`);
      });
      const close = (): void => {
        listener.close();
      };
      resolve({ server: listener, close });
    });
  });
};

export default createServer;
