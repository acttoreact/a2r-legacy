/* eslint-disable @typescript-eslint/no-explicit-any */
import http from 'http';
import io from 'socket.io';
import colors from 'colors';

import out from "../util/out";
import { socketList } from './connection';
import { addCommand } from '../commands';

import settings from '../config/settings';

interface MethodCall {
  method: string;
  id: string;
  params: any[];
}

type apiFN = (...arg: any) => Promise<any>;

interface APIStructure {
  [id: string]: apiFN;
}

const apiMethods: APIStructure = {};

const options = { path: settings.socketPath };
let ioServer: io.Server | undefined;

const onDisconnect = (socket: io.Socket): void => {
  out.verbose(
    colors.white.bold(`Disconnected ${colors.yellow.bold(socket.id)}`),
  );
  delete socketList[socket.id];
};

const setup = (httpServer: http.Server): void => {
  ioServer = io(httpServer, options);
  ioServer.on('connection', (socket): void => {
    out.verbose(
      colors.white.bold(`Connected ${colors.yellow.bold(socket.id)}`),
    );
    socketList[socket.id] = socket;

    socket.on('*', async (info: MethodCall): Promise<void> => {
      const { method, params, id } = info;
      const fn = apiMethods[method] as apiFN;
      try {
        const result = await fn(...params);
        socket.emit(id, { o: 1, d: result });  
      } catch (ex) {
        socket.emit(id, { o: 0, e: ex.message, s: ex.stack });  
      }
    });

    socket.on('disconnect', (): void => onDisconnect(socket));
  });

  addCommand({
    name: 'list',
    description: 'List all users connected to the server',
    onExecute: async (write): Promise<void> => {
      write(
        `${colors.green.bold(
          Object.keys(socketList).length.toString(),
        )} active connections`,
      );
      Object.keys(socketList).forEach((id): void => {
        const socket = socketList[id];
        write(
          ` ${colors.green.bold(id)} from remote IP ${colors.red.bold(
            socket.client.conn.remoteAddress,
          )}`,
        );
      });
    },
  });
};

export const emit = (
  eventName: string,
  ...params: [string | object | number]
): void => {
  if (ioServer) {
    ioServer.emit(eventName, params);
  }
};

export default setup;
