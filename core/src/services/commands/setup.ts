import path from 'path';
import ReadLine from 'readline';

import { addCommand } from './consoleCommands';
import modulePath from '../../config/modulePath';
import addCommandsFromPath from './addCommandsFromPath';
import { framework } from '../../util/terminalStyles';

/**
 * Element that can be closed
 */
interface Closeable {
  close: () => void;
}

/**
 * Setups all the commands that can be used by te console
 * @param rl Console Interface
 * @param serverListener Server Information
 */
const setup = async (
  rl: ReadLine.Interface,
  serverListener: Closeable
): Promise<void> => {
  addCommand({
    name: 'exit',
    description: `Exit the ${framework}`,
    onExecute: async (write): Promise<void> => {
      write(`Exiting ${framework}\n`);
      serverListener.close();
      rl.close();
      process.stdin.destroy();
      process.exit();
    },
  });

  const commandsPath = path.join(modulePath, 'dist', 'commands');
  addCommandsFromPath(commandsPath);
};

export default setup;
