import fs from 'fs';
import chokidar from 'chokidar';

/**
 * A2R Watcher options
 * @export
 * @interface WatcherOptions
 */
export interface WatcherOptions {
  /**
   * Path that should be watched for changes
   * @type {string}
   * @memberof WatcherOptions
   */
  sourceDir: string;
  /**
   * Compilation destination path
   * @type {string}
   * @memberof WatcherOptions
   */
  destDir: string;
  /**
   * Detected changes handler
   * @memberof WatcherOptions
   */
  handler: (
    sourcePath: string,
    destPath: string,
    eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
    eventPath: string,
    stats?: fs.Stats | undefined,
  ) => {};
  /**
   * Errors handler
   * @memberof WatcherOptions
   */
  onError: (er: Error) => void | Promise<void>;
  /**
   * Method executed once internal watcher (chokidar) is ready
   * @memberof WatcherOptions
   */
  onReady?: (
    sourcePath: string,
    destPath: string,
  ) => void | Promise<void>;
  /**
   * Internal watcher options:
   * WatchOptions from [chokidar](https://github.com/paulmillr/chokidar#api)
   * @type {chokidar.WatchOptions}
   * @memberof WatcherOptions
   */
  options?: chokidar.WatchOptions;
}

/**
 * Watcher event info for queue management purposes
 * @export
 * @interface WatcherEventInfo
 */
export interface WatcherEventInfo {
  /**
   * Path that generated the event
   * @type {string}
   * @memberof WatcherEventInfo
   */
  path: string;
  /**
   * Resulting task priority. Higher priority (with 0 being highest) tasks will be processed first.
   * @type {number}
   * @memberof WatcherEventInfo
   */
  priority?: number;
  /**
   * Handler for this event
   * @memberof WatcherEventInfo
   */
  handler: () => Promise<void>;
  /**
   * Optional error handler (if not provided, an regular error will be displayed on terminal)
   * @memberof WatcherEventInfo
   */
  onError?: (er: Error) => void;
}
