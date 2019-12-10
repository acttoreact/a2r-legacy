import { ConsoleCommand } from '../model/commands';
import { logo as logoOnLogs, framework } from '../util/terminalStyles';

const logo: ConsoleCommand = {
  name: 'logo',
  description: `Display ${framework} Logo`,
  onExecute: async (write): Promise<void> => {
    write(`${logoOnLogs}\n`);
  },
};

export default logo;
