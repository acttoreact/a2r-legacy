import { ConsoleCommand } from '../../../model/commands';
import { api as apiOnLogs } from '../../../util/terminalStyles';
// import api from '../api';

const apiStructure: ConsoleCommand = {
  name: 'apiStructure',
  description: `Prints ${apiOnLogs} structure`,
  onExecute: (write): void => {
    write(
      `${apiOnLogs} structure: ...on construction...`,
    );
  },
};

export default apiStructure;
