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
  name: string /** Name of the command */;
  description: string /** Description used in the help */;
  onExecute: OnExecute /** Method called when the user executes de command in the console */;
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
