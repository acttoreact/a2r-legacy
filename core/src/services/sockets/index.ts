/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint no-param-reassign: ["error", { "props": false }] */

import http from 'http';
import path from 'path';
import io from 'socket.io';
import colors from 'colors';
import Cookies from 'universal-cookie';

import { socketList } from './connection';
import { A2RSocket, MethodCall, DataProviderCall } from '../../model/sockets';
import { Session } from '../../model/session'
import out from '../../util/out';
import api from '../api';
import addCommandsFromPath from '../commands/addCommandsFromPath';
import getCookieKey from '../data/getCookieKey';
import { sockets as socketsInLogs } from '../../util/terminalStyles';
import getDataByServer from '../data/getDataByServer';

import settings from '../../config/settings';

const options = { path: settings.socketPath };

const sessions = new Map<string, Session>();

const setupSession = (sessionId: string): void => {
  const session = sessions.get(sessionId);
  if (!session) {
    sessions.set(sessionId, {
      id: sessionId,
    });
  }
}

const onDisconnect = (socket: A2RSocket): void => {
  delete socketList[socket.id];
  sessions.delete(socket.sessionId);
  out.verbose(colors.white.bold(`${socketsInLogs} Disconnected ${colors.yellow.bold(socket.id)}`));
};

const setup = (httpServer: http.Server): void => {
  const ioServer = io(httpServer, options);

  ioServer.on('connection', async (socket: A2RSocket): Promise<void> => {
    const cookieKey = await getCookieKey();
    const header = socket.handshake.headers && socket.handshake.headers.cookie;
    const cookies = new Cookies(header);
    const sessionId = cookies.get(cookieKey);
    setupSession(sessionId);
    socket.sessionId = sessionId;

    out.verbose(colors.white.bold(`${socketsInLogs} Connected ${colors.yellow.bold(socket.id)}`));

    socketList[socket.id] = socket;

    socket.on(
      '*',
      async (info: MethodCall): Promise<void> => {
        const { id, method, params } = info;
        out.verbose(
          `${socketsInLogs} Message received: id ${id}, method: ${method}, params: ${params.length}`,
        );
        const apiModule = api[method];
        try {
          const result = await apiModule.default(...params);
          socket.emit(id, { o: 1, d: result });
        } catch (ex) {
          socket.emit(id, { o: 0, e: ex.message, s: ex.stack });
        }
      },
    );

    socket.on(
      'data',
      async (info: DataProviderCall): Promise<void> => {
        const { id, pathname, query } = info;
        out.verbose(`${socketsInLogs} Data request by socket with id ${socket.id}`);
        try {
          const { data } = await getDataByServer(pathname, query, socket.sessionId);
          socket.emit(id, { o: 1, d: data });
        } catch (ex) {
          socket.emit(id, { o: 0, e: ex.message, s: ex.stack });
        }
      },
    );

    socket.on('disconnect', (): void => onDisconnect(socket));
  });

  const commandsPath = path.join(__dirname, 'commands');
  addCommandsFromPath(commandsPath);
};

export default setup;
