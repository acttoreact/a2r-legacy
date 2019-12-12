import colors from 'colors';

import { ConsoleCommand } from '../model/commands';
import { getCommands } from '../services/commands/consoleCommands';
import { logo } from '../util/terminalStyles';

const help: ConsoleCommand = {
  name: 'help',
  description: 'Displays this help window',
  onExecute: async (write): Promise<void> => {
    write(`${logo}\n\n`);
    write(`Commands:\n`);

    getCommands().forEach(
      (command): void => {
        write(
          `  ${colors.green(command.name.padEnd(25))} ${
            command.description
          }\n`
        );
      }
    );

    write('\n');
  },
};

export default help;
