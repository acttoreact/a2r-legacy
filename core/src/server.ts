import colors from "colors";
import {
  createServer,
  RequestListener,
  IncomingMessage,
  ServerResponse,
  Server
} from "http";
import { parse } from "url";
import next from "next";
import out from "./util/out";

const server = (dev: boolean, port: number): void => {
  const app = next({ dev });
  const handle = app.getRequestHandler();

  app.prepare().then(
    (): void => {
      const requestListener: RequestListener = (
        req: IncomingMessage,
        res: ServerResponse
      ): void => {
        if (req.url) {
          const parsedUrl = parse(req.url, true);
          handle(req, res, parsedUrl);
        }
      };

      const httpServer: Server = createServer(requestListener);
      httpServer.on(
        'listening',
        (): void => {
          out.info(
            colors.white.bold(
              `Listening ${colors.yellow.bold(
                `http://localhost:${  port.toString()}/`
              )}`
            )
          );
        }
      );
      httpServer.on('error', (err: Error): void =>{
        out.error(
          err.message
        );
      });
      httpServer.listen(port);
    }
  );
};

export default server;
