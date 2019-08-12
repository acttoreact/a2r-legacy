import http from 'http';
import express from 'express';
import colors from 'colors';
import next from 'next';
import open from 'open';
import out from './util/out';
import socket from './util/socket';

const server = (dev: boolean, port: number): void => {
  const app = next({ dev });
  const handle = app.getRequestHandler();

  app.prepare().then(
    (): void => {
      const httpServer = express();

      httpServer.get(
        '*',
        (req, res): Promise<void> => {
          return handle(req, res);
        }
      );

      socket(http);
      http.createServer(httpServer);

      httpServer.listen(
        port,
        (err): void => {
          if (err) {
            out.error(err.message);
          } else {
            out.info(
              colors.white.bold(
                `Listening ${colors.yellow.bold(
                  `http://localhost:${port.toString()}/`
                )}`
              )
            );

            open(`http://localhost:${port.toString()}/`);
          }
        }
      );
    }
  );
};

export default server;
