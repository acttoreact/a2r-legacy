import path from 'path';
import fs from '../../util/fs';

const getDataContent = `import generateId from 'shortid';
import { ParsedUrlQuery } from 'querystring';
import { AppContext } from 'a2r/app';
import { getSessionId, getDataByServer } from 'a2r';
import { AppData, SocketMessage, DataProviderCall } from '../dist/';

import socket from './socket';

const getDataBySocket = (
  pathname: string,
  query: ParsedUrlQuery,
): Promise<AppData & { data: any }> => {
  return new Promise((resolve, reject) => {
    if (socket) {
      if (socket.disconnected) {
        console.log('socket disconnected, connecting');
        socket.connect();
      }
      const id = generateId();
      socket.on(id, (res: SocketMessage): void => {
        console.log('Socket data callback', res);
        socket.off(id);
        if (res.o) {
          const appData = {
            sessionId: socket.sessionId,
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

      socket.emit('data', call);
    } else {
      console.error('No client socket available!');
      reject(new Error('No client socket available!'));
    }
  });
};

const getData = async <GlobalProps>(appContext: AppContext): Promise<AppData & { data: any }> => {
  const { ctx, router: { pathname, query } } = appContext;
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
