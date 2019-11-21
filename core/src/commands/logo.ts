import { ConsoleCommand } from '../services/commands/consoleCommands';
import { logo as logoOnLogs } from '../util/terminalStyles';

const logo: ConsoleCommand = {
  name: 'logo',
  description: 'Display A2R Logo',
  onExecute: async (write): Promise<void> => {
    write(`${logoOnLogs}\n`);
  },
};

export default logo;
