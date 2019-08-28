import http from 'http';
import express from 'express';
import colors from 'colors';
import next from 'next';
import open from 'open';
import out from './util/out';
import socket from './util/socket';
import services from './services';

interface ServerResponse {
  server: http.Server;
  close: () => void;
}

const server = (dev: boolean, port: number): Promise<ServerResponse> => {

  // Starts all the services
  services();

  return new Promise<ServerResponse>(
    (resolve, reject): void => {
      const app = next({ dev });
      const handle = app.getRequestHandler();

      app.prepare().then(
        (): void => {
          const httpServer = express();

          httpServer.get(
            '*',
            (
              req: http.IncomingMessage,
              res: http.ServerResponse
            ): Promise<void> => {
              return handle(req, res);
            }
          );

          socket(http);
          http.createServer(httpServer);

          const listener = httpServer.listen(
            port,
            (err: Error): void => {
              if (err) {
                out.error(err.message);
                reject(err);
              } else {
                out.info(
                  colors.white.bold(
                    `Listening ${colors.yellow.bold(
                      `http://localhost:${port.toString()}/`
                    )}`
                  )
                );
                if (dev) {
                  open(`http://localhost:${port.toString()}/`);
                }
              }
            }
          );
          listener.on(
            'close',
            (): void => {
              out.info(colors.white.bold('Http server closed'));
            }
          );
          const close = (): void => {
            listener.close();
          };
          resolve({ server: listener, close });
        }
      );
    }
  );
};

export default server;
