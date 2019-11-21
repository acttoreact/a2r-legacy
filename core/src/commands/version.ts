import { ConsoleCommand } from '../services/commands/consoleCommands';
import getVersion from '../tools/getVersion';

const version: ConsoleCommand = {
  name: 'version',
  description: 'Gets the current version of the A2R Framework',
  onExecute: async (): Promise<void> => {
    await getVersion();
  },
};

export default version;


