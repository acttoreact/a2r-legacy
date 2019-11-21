import path from 'path';
import ReadLine from 'readline';
import colors from 'colors';

import { addCommand } from './consoleCommands';
import modulePath from '../../config/modulePath';
import addCommandsFromPath from './addCommandsFromPath';

/**
 * Element that can be closed
 */
interface Closeable {
  close: () => void;
}

/**
 * Setups all the commands that can by used by te console
 * @param rl Console Interface
 * @param value Server Information
 */
const setup = async (
  rl: ReadLine.Interface,
  value: Closeable
): Promise<void> => {
  addCommand({
    name: 'exit',
    description: 'Exit the A2R Framework',
    onExecute: async (): Promise<void> => {
      process.stdout.write(`Exiting  ${colors.magenta('A2R')} Framework\n`);
      value.close();
      rl.close();
      process.stdin.destroy();
      process.exit();
    },
  });

  const commandsPath = path.join(modulePath, 'src', 'commands');
  addCommandsFromPath(commandsPath);
};

export default setup;
