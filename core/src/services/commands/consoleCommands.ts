import colors from 'colors';

import { ConsoleCommand, OnExecute } from '../../model/commands';
import out from '../../util/out';

/**
 * Private list of commands
 */
const commandList: { [key: string]: ConsoleCommand } = {};

/**
 * Adds a command to the commands that are available for the console
 * @param command Command info
 */
export const addCommand = (command: ConsoleCommand): void => {
  commandList[command.name] = command;
  out.verbose(
    `Added console command ${colors.cyan(
      command.name,
    )} for a total of ${colors.green(
      Object.keys(commandList).length.toString(),
    )} commands`,
  );
};

/**
 * Removes a command by its name
 * @param commandName Command name
 */
export const removeCommand = (commandName: string): void => {
  delete commandList[commandName];
};

/**
 * Get an ordered list of commands
 */
export const getCommands = (): ConsoleCommand[] => {
  return Object.keys(commandList)
    .sort((a, b): number => a.localeCompare(b))
    .map((commandName): ConsoleCommand => commandList[commandName]);
};

/**
 * Gets the function to run a command
 * @param commandName Name of the command to run
 */
export const getCommandFunction = (commandName: string): OnExecute | null => {
  if (commandList[commandName]) {
    return commandList[commandName].onExecute;
  }
  return null;
};
