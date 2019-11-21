import colors from 'colors';

import { ConsoleCommand } from '../../commands/consoleCommands';
import api from '../api';

const apiMethods: ConsoleCommand = {
  name: 'apiMethods',
  description: 'Prints API Structure',
  onExecute: async (write): Promise<void> => {
    write(
      `${colors.green.bold(Object.keys(api).length.toString())} API methods:`,
    );
    Object.keys(api).forEach((methodKey): void => {
      write(`${colors.green(methodKey)}`);
    });
  },
};

export default apiMethods;
