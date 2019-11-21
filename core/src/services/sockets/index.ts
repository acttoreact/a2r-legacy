/* eslint-disable @typescript-eslint/no-explicit-any */
import path from 'path';
import io from 'socket.io';
import colors from 'colors';

import out from '../../util/out';
import { socketList } from './connection';
import api from '../api';
import { APIModule } from '../api/api';
import addCommandsFromPath from '../commands/addCommandsFromPath';
import { sockets as socketsInLogs } from '../../util/terminalStyles';

import settings from '../../config/settings';

const options = { path: settings.socketPath };
let ioServer: io.Server | undefined;

export interface MethodCall {
  method: string;
  id: string;
  params: any[];
};

const onDisconnect = (socket: io.Socket): void => {
  out.verbose(
    colors.white.bold(`${socketsInLogs}: Disconnected ${colors.yellow.bold(socket.id)}`),
  );
  delete socketList[socket.id];
};

const setup = (express: Express.Application): void => {
  ioServer = io(express, options);
  
  ioServer.on('connection', (socket): void => {
    out.verbose(
      colors.white.bold(`${socketsInLogs} Connected ${colors.yellow.bold(socket.id)}`),
    );

    socketList[socket.id] = socket;

    socket.on('*', async (info: MethodCall): Promise<void> => {
      const { method, params, id } = info;
      const apiModule = api[method] as APIModule;
      try {
        const result = await apiModule.default(...params);
        socket.emit(id, { o: 1, d: result });
      } catch (ex) {
        socket.emit(id, { o: 0, e: ex.message, s: ex.stack });  
      }
    });

    socket.on('disconnect', (): void => onDisconnect(socket));
  });

  const commandsPath = path.join(__dirname, 'commands');
  addCommandsFromPath(commandsPath)
}

export default setup;
