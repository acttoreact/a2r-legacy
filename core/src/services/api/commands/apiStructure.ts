import { ConsoleCommand } from '../../../model/commands';
import { api as apiOnLogs } from '../../../util/terminalStyles';
import replacer from '../../../util/apiStringifyReplacer';
import api from '../api';

const apiStructure: ConsoleCommand = {
  name: 'apiStructure',
  description: `Prints ${apiOnLogs} structure`,
  onExecute: async (write): Promise<void> => {
    write(
      `${apiOnLogs} structure:\n${JSON.stringify(api, replacer, 2)}`,
    );
  },
};

export default apiStructure;
