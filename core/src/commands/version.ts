import { ConsoleCommand } from '../services/commands/consoleCommands';
import { framework } from '../util/terminalStyles';
import getVersion from '../tools/getVersion';

const version: ConsoleCommand = {
  name: 'version',
  description: `Gets the current version of the ${framework}`,
  onExecute: async (): Promise<void> => {
    await getVersion();
  },
};

export default version;


