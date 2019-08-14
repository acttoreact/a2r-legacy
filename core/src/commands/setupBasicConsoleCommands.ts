import ReadLine from 'readline';
import colors from 'colors';
import out from '../util/out';
import logo from './logo';
import { addCommand, getCommands } from './consoleCommands';

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
const setupBasicConsoleCommands = (
  rl: ReadLine.Interface,
  value: Closeable
): void => {
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

  addCommand({
    name: 'logo',
    description: 'Display A2R Logo',
    onExecute: async (): Promise<void> => {
      process.stdout.write(`${logo}\n`);
    },
  });

  addCommand({
    name: 'help',
    description: 'Displays this help window',
    onExecute: async (): Promise<void> => {
      process.stdout.write(`${logo}\n\n`);
      process.stdout.write(`Commands:\n`);

      getCommands().forEach(
        (command): void => {
          process.stdout.write(
            `  ${colors.green(command.name.padEnd(20))} ${
              command.description
            }\n`
          );
        }
      );

      process.stdout.write('\n');
    },
  });

  addCommand({
    name: 'setLogLevel',
    description:
      'Set the log leve to the value specified: error, warning, info or verbose',
    onExecute: async (param?: string): Promise<void> => {
      if (param) {
        const level = param.toLowerCase();
        out.setLevel(level);
        process.stdout.write(`Log level set to ${colors.green(level)}.\n`);
      } else {
        process.stdout.write(
          `You need to specify a log level.\nUse ${colors.green(
            'help'
          )} for the command list.\n`
        );
      }
    },
  });
};

export default setupBasicConsoleCommands;
