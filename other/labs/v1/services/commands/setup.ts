import readline from 'readline';
import colors from 'colors';
import out from '../../util/out';
import { addCommand, getCommands, getCommandFunction } from './index';

/**
 * Element that can be closed
 */
interface Closeable {
  close: () => void;
}


/**
 * Writes input on console using `process.stdout`
 * @param {string} text Input
 */
const write = (text: string): void => {
  process.stdout.write(text);
};

/**
 * Setups all the commands that can by used by te console
 * @param rl Console Interface
 * @param value Server Information
 */
const setup = (
  value: Closeable
): void => {
  const rl = readline.createInterface(process.stdin, process.stdout);

  rl.on(
    'line',
    async (cmd: string): Promise<void> => {
      const params = cmd.trim().split(' ');
      let command = params[0];
      if (command) {
        if (command === 'quit') command = 'exit';

        const onExecute = getCommandFunction(command);

        if (onExecute) {
          try {
            const [, ...rest] = params;
            await onExecute(write, ...rest);
          } catch (err) {
            out.error(err.message, { stack: err.stack });
          }
          write('\n');
        } else {
          write(
            `Unknown command: ${colors.red(command)}.\nUse ${colors.green(
              'help',
            )} for the command list.\n`,
          );
        }
      }
    },
  );

  addCommand({
    name: 'exit',
    description: 'Exits server',
    onExecute: async (): Promise<void> => {
      write(`Exiting ${colors.magenta('A2R')} Server\n`);
      value.close();
      rl.close();
      process.stdin.destroy();
      process.exit();
    },
  });

  addCommand({
    name: 'help',
    description: 'Displays this help window',
    onExecute: async (): Promise<void> => {
      write(`Commands:\n`);
      getCommands().forEach(
        (command): void => {
          write(
            `  ${colors.green(command.name.padEnd(25))} ${
              command.description
            }\n`
          );
        }
      );

      write('\n');
    },
  });

  addCommand({
    name: 'setLogLevel',
    description:
      'Sets the log level to the value specified: error, warning, info or verbose',
    onExecute: async (_, param?: string): Promise<void> => {
      if (param) {
        const level = param.toLowerCase();
        out.setLevel(level);
        write(`Log level set to ${colors.green(level)}.\n`);
      } else {
        write(
          `You need to specify a log level.\nUse ${colors.green(
            'help'
          )} for the command list.\n`
        );
      }
    },
  });
};

export default setup;
