import path from 'path';
import fs from '../../util/fs';

const getDataContent = `import generateId from 'shortid';
import { ParsedUrlQuery } from 'querystring';
import { getSessionId, getDataByServer, AppData, SocketMessage, DataProviderCall } from 'a2r';
import { NextPageContext } from 'a2r/next';

import socket from './socket';

interface A2RSocket extends SocketIOClient.Socket {
  sessionId: string;
}

const getDataBySocket = (
  pathname: string,
  query: ParsedUrlQuery,
): Promise<AppData & { data: any }> => {
  return new Promise((resolve, reject) => {
    if (socket) {
      const a2rSocket = socket as A2RSocket;
      if (a2rSocket.disconnected) {
        console.log('socket disconnected, connecting');
        a2rSocket.connect();
      }
      const id = generateId();
      a2rSocket.on(id, (res: SocketMessage): void => {
        console.log('Socket data callback', pathname, res);
        a2rSocket.off(id);
        if (res.o) {
          const appData = {
            sessionId: a2rSocket.sessionId,
            data: res.d,
          };
          resolve(appData);
        } else {
          const error = new Error(res.e);
          error.stack = res.s;
          reject(error);
        }
      });

      const call: DataProviderCall = {
        id,
        pathname,
        query,
      };

      a2rSocket.emit('data', call);
    } else {
      console.error('No client socket available!');
      reject(new Error('No client socket available!'));
    }
  });
};

const getData = async <GlobalProps>(ctx: NextPageContext): Promise<AppData & { data: any }> => {
  const { pathname, query } = ctx;
  if (process.browser) {
    return getDataBySocket(pathname, query);
  }
  const sessionId = await getSessionId(ctx);
  return getDataByServer<GlobalProps>(pathname, query, sessionId);
};

export default getData;
`;

const buildDataProvider = async (clientApiPath: string): Promise<void> => {
  const filePath = path.resolve(clientApiPath, 'getData.ts');
  await fs.writeFile(filePath, getDataContent);
};

export default buildDataProvider;
