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
  modelPath: string;
};

/**
 * Element that can be closed
 */
export interface Closeable {
  /**
   * Method call when closing
   * @memberof Closeable
   */
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

/**
 * Dependencies on `package.json`
 */
export interface DependencyMap {
  [dependencyName: string]: string;
}

/**
 * Scripts on `package.json`
 */
export interface ScriptsMap {
  [scriptName: string]: string;
}

/**
 * Structure for `package.json` content
 */
export interface PackageJSON extends Object {
  name: string;
  version: string;
  dependencies: DependencyMap;
  devDependencies: DependencyMap;
  scripts: ScriptsMap;
}

/**
 * Package manager (`package.json`)
 */
export interface PackageManager {
  loadPackage: () => Promise<PackageJSON>;
  savePackage: (newPackage: PackageJSON) => Promise<void>;
}
