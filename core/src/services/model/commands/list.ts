import colors from 'colors';

import { ConsoleCommand } from '../../../model/commands';
import { getKeys } from '../model';

const list: ConsoleCommand = {
  name: 'listModelKeys',
  description: 'List model existing keys',
  onExecute: async (write): Promise<void> => {
    const keys = getKeys();
    write(
      `There are ${colors.green.bold(keys.length.toString())} existing model keys:\n`,
    );
    keys.forEach((key): void => {
      write(`- ${colors.green.bold(key)}`);
    });
  },
};

export default list;
