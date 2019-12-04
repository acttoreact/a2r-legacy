import path from 'path';
import ReadLine from 'readline';

import { Closeable } from '../../types';
import { addCommand } from './consoleCommands';
import { framework } from '../../util/terminalStyles';
import exit from '../../util/exit';
import getFrameworkPath from '../../tools/getFrameworkPath';
import addCommandsFromPath from './addCommandsFromPath';

/**
 * Setups all the commands that can be used by te console
 * 
 * @param rl Console interface
 * @param server Server instance
 */
const setup = async (
  rl: ReadLine.Interface,
  server: Closeable
): Promise<void> => {
  addCommand({
    name: 'exit',
    description: `Exit the ${framework}`,
    onExecute: async (write): Promise<void> => {
      write(`Exiting ${framework}\n`);
      exit(server, rl);
    },
  });

  const modulePath = await getFrameworkPath();
  const commandsPath = path.join(modulePath, 'dist', 'commands');
  addCommandsFromPath(commandsPath);
};

export default setup;
