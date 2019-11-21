import colors from 'colors';

import out from '../../util/out';

export interface WriteMethod {
  (text: string): void;
}

/**
 * Interface of the function tha will be executed by a console command
 */
export interface OnExecute {
  (write: WriteMethod, param1?: string, param2?: string): Promise<void>;
}

/**
 * Interface used to implement a console command
 */
export interface ConsoleCommand {
  /**
   * Name of the command
   * @type {string}
   * @memberof ConsoleCommand
   */
  name: string;
  /**
   * Description used in the help
   * @type {string}
   * @memberof ConsoleCommand
   */
  description: string;
  /**
   * Method called when the user executes de command in the console
   * @type {OnExecute}
   * @memberof ConsoleCommand
   */
  onExecute: OnExecute;
}

/**
 * Private list of commands
 */
const commandList: { [key: string]: ConsoleCommand } = {};

/**
 * Adds a command to the commands that are available for the console
 * @param command
 */
const addCommand = (command: ConsoleCommand): void => {
  commandList[command.name] = command;
  out.verbose(
    `Added console command ${colors.cyan(
      command.name,
    )} ${command.onExecute ? colors.green('with') : colors.red('without')} for a total of ${colors.green(
      Object.keys(commandList).length.toString(),
    )} commands`,
  );
};

/**
 * Removes a command by its name
 * @param commandName
 */
const removeCommand = (commandName: string): void => {
  delete commandList[commandName];
};

/**
 * Get an ordered list of commands
 */
const getCommands = (): ConsoleCommand[] => {
  return Object.keys(commandList)
    .sort((a, b): number => a.localeCompare(b))
    .map((commandName): ConsoleCommand => commandList[commandName]);
};

/**
 * Gets the function to run a command
 * @param commandName Name of the command to run
 */
const getCommandFunction = (commandName: string): OnExecute | null => {
  if (commandList[commandName]) {
    return commandList[commandName].onExecute;
  }
  return null;
};

export { addCommand, removeCommand, getCommands, getCommandFunction };
