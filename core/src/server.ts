import http from 'http';
import express from 'express';
import colors from 'colors';
import next from 'next';
import open from 'open';
import './services/data/getDataProvider';
import './services/data/getCookieKey';
import out from './util/out';
import services from './services';
import sockets from './services/sockets';

interface ServerResponse {
  server: http.Server;
  close: () => void;
}

const createServer = (dev: boolean, port: number): Promise<ServerResponse> =>
  new Promise<ServerResponse>((resolve, reject): void => {
    services(port).then((): void => {
      try {
        const app = next({ dev });
        const handle = app.getRequestHandler();
  
        app.prepare().then((): void => {
          const httpServer = express();
  
          httpServer.get(
            '*',
            (req: http.IncomingMessage, res: http.ServerResponse): Promise<void> => {
              return handle(req, res);
            },
          );
  
          // TODO: middlewares?
          // TODO: handlers
  
          const server = http.createServer(httpServer);
          sockets(server);
  
          const listener = server.listen(port, (): void => {
            out.info(
              colors.white.bold(
                `Listening ${colors.yellow.bold(`http://localhost:${port.toString()}/`)}`,
              ),
            );
            if (dev) {
              open(`http://localhost:${port.toString()}/`);
            }
          });
          listener.on('close', (): void => {
            out.info(colors.white.bold('Http server closed'));
          });
          const close = (): void => {
            listener.close();
          };
          resolve({ server: listener, close });
        });
      } catch (ex) {
        reject(ex);
      }
    }).catch(reject);
  });

export default createServer;
