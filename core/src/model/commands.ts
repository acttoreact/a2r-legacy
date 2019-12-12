/**
 * Console command write method
 */
export interface WriteMethod {
  (text: string): void;
}

/**
 * Console command function to be executed when command is invoked
 */
export interface OnExecute {
  (write: WriteMethod, param1?: string, param2?: string): Promise<void> | void;
}

/**
 * A2R Framework console command
 */
export interface ConsoleCommand {
  /**
   * Command name
   * @type {string}
   * @memberof ConsoleCommand
   */
  name: string;
  /**
   * Command description (displayed on `help` command)
   * @type {string}
   * @memberof ConsoleCommand
   */
  description: string;
  /**
   * Console command function to be executed when command is invoked
   * @type {OnExecute}
   * @memberof ConsoleCommand
   */
  onExecute: OnExecute;
}