/**
 * Framework internal settings
 */
export interface FrameworkSettings {
  /**
   * Specific default log level when running `--dev` command
   * @type {string}
   * @memberof FrameworkSettings
   */
  defaultDevLogLevel: string;
  /**
   * Default log level when running without `--frameworkLogLevel` option
   * @type {string}
   * @memberof FrameworkSettings
   */
  defaultLogLevel: string;
  /**
   * Default port used when running without `--port` option
   * @type {number}
   * @memberof FrameworkSettings
   */
  defaultPort: number;
  /**
   * Socket path where sockets must connect
   * @type {string}
   * @memberof FrameworkSettings
   */
  socketPath: string;
  /**
   * Minimum Node.js version needed
   * @type {string}
   * @memberof FrameworkSettings
   */
  minNodeVersion: string;
  /**
   * Max task concurrency allowed by internal task queue
   * @type {number}
   * @memberof FrameworkSettings
   */
  taskConcurrency: number;
  /**
   * Folder name where framework boilerplate contents can be found
   * (will be project initial contents when using `--init` to create one)
   * @type {string}
   * @memberof FrameworkSettings
   */
  boilerplatePath: string;
  /**
   * Name of model folder. Used by core to look for model files and build model sub-module
   * @type {string}
   * @memberof FrameworkSettings
   */
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
  /**
   * Package name
   * @type {string}
   * @memberof PackageJSON
   */
  name: string;
  /**
   * Current version
   * @type {string}
   * @memberof PackageJSON
   */
  version: string;
  /**
   * List of dependencies in object/map style
   * @type {DependencyMap}
   * @memberof PackageJSON
   */
  dependencies: DependencyMap;
  /**
   * List of development dependencies in object/map style
   * @type {DependencyMap}
   * @memberof PackageJSON
   */
  devDependencies: DependencyMap;
  /**
   * List of available scripts available for `npm run`
   * @type {ScriptsMap}
   * @memberof PackageJSON
   */
  scripts: ScriptsMap;
}

/**
 * Package manager (`package.json`)
 */
export interface PackageManager {
  /**
   * Reads package info
   * @memberof PackageManager
   */
  loadPackage: () => Promise<PackageJSON>;
  /**
   * Writes (and overwrites) package info
   * @memberof PackageManager
   */
  savePackage: (newPackage: PackageJSON) => Promise<void>;
}
