import fs from 'fs';
import chokidar from 'chokidar';

export interface WatcherOptions {
  sourceDir: string;
  destDir: string;
  handler: (
    sourcePath: string,
    destPath: string,
    eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir',
    eventPath: string,
    stats?: fs.Stats | undefined,
  ) => {};
  onError: (er: Error) => void;
  onReady?: (
    sourcePath: string,
    destPath: string,
  ) => {};
  options?: chokidar.WatchOptions;
}

export interface WatcherEventInfo {
  path: string;
  handler: () => Promise<void>;
  onError?: (er: Error) => void;
}
