import util from 'util';

import { ConsoleCommand } from '../../commands/consoleCommands';
import { api as apiOnLogs, terminalCommand } from '../../../util/terminalStyles';
import api from '../api';

const apiStructureWithInspect: ConsoleCommand = {
  name: 'apiStructureWithInspect',
  description: `Prints ${apiOnLogs} structure using ${terminalCommand('util.inspect')}`,
  onExecute: async (write): Promise<void> => {
    write(
      `${apiOnLogs} structure:\n${util.inspect(api, true, 10, true)}`,
    );
  },
};

export default apiStructureWithInspect;
