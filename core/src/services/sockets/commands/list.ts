import colors from 'colors';

import { ConsoleCommand } from '../../commands/consoleCommands';
import { socketList } from '../connection';

const list: ConsoleCommand = {
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
};

export default list;
