import colors from 'colors';

import { ConsoleCommand } from '../../commands/consoleCommands';
import { api as apiOnLogs } from '../../../util/terminalStyles';
import api from '../api';

const apiMethods: ConsoleCommand = {
  name: 'apiMethods',
  description: `Lists ${apiOnLogs} modules`,
  onExecute: async (write): Promise<void> => {
    write(
      `There are ${colors.green.bold(Object.keys(api).length.toString())} ${apiOnLogs} methods:\n`,
    );
    Object.keys(api).forEach((methodKey): void => {
      write(`- ${colors.green(methodKey)}\n`);
    });
  },
};

export default apiMethods;
