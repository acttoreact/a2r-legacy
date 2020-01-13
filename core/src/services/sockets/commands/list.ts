import colors from 'colors';

import { ConsoleCommand } from '../../../model/commands';
import { socketList } from '../connection';

const list: ConsoleCommand = {
  name: 'listConnectedUsers',
  description: 'List all users connected to the server',
  onExecute: async (write): Promise<void> => {
    write(
      `${colors.green.bold(
        Object.keys(socketList).length.toString(),
      )} active connections:\n`,
    );
    Object.keys(socketList).forEach((id): void => {
      const socket = socketList[id];
      write(
        `- ${colors.green.bold(id)} from remote IP ${colors.red.bold(
          socket.client.conn.remoteAddress,
        )}\n`,
      );
    });
  },
};

export default list;
