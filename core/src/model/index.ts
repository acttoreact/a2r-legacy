/**
 * Framework internal settings
 */
export interface FrameworkSettings {
  defaultDevLogLevel: string;
  defaultLogLevel: string;
  defaultPort: number;
  socketPath: string;
  minNodeVersion: string;
  taskConcurrency: number;
  boilerplatePath: string;
};

/**
 * Element that can be closed
 */
export interface Closeable {
  close: () => void;
}

/**
 * Response from terminal after executing command
 */
export interface CommandResponse {
  /**
   * Executed command
   * @type {string}
   * @memberof CommandResponse
   */
  command: string;
  /**
   * Args passed to command
   * @type {string}
   * @memberof CommandResponse
   */
  args: string;
  /**
   * Command exit code
   * @type {number}
   * @memberof CommandResponse
   */
  code: number;
  /**
   * Output from `stdout`
   * @type {string}
   * @memberof CommandResponse
   */
  out: string;
  /**
   * Error (if any)
   * @type {(Error | null)}
   * @memberof CommandResponse
   */
  error: Error | null;
};
