import colors from 'colors';

import { ConsoleCommand } from '../services/commands/consoleCommands';
import out from '../util/out';

const setLogLevel: ConsoleCommand = {
  name: 'setLogLevel',
  description:
    'Set the log level to the value specified: error, warning, info or verbose',
  onExecute: async (write, param?: string): Promise<void> => {
    if (param) {
      const level = param.toLowerCase();
      out.setLevel(level);
      write(`Log level set to ${colors.green(level)}.\n`);
    } else {
      write(
        `You need to specify a log level.\nUse ${colors.green(
          'help'
        )} for the command list.\n`
      );
    }
  },
};

export default setLogLevel;