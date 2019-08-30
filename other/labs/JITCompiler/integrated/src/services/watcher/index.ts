import path from 'path';
import chokidar from 'chokidar';
import colors from 'colors';
import fs from '../../util/fs';
import out from '../../util/out';
// import { importModule, updateModule, disposeModule } from '../apiBuilder/index';

/**
 * Watch folder for files and folders changes
 * 
 * @param {string} folderPath Main folder to be watched and whose contents will be processed
 * @param {string} destPath Destination path where processed contents are placed
 * @param {WatcherOptions} options WatchOptions for [chokidar](https://github.com/paulmillr/chokidar#api)
 */
const watchFolder = async (folderPath: string, destPath: string, options: chokidar.WatchOptions): Promise<void> => {
  const normalizedPath = path.normalize(folderPath);
  const exists = await fs.exists(normalizedPath);
  if (exists) {
    const watcher = chokidar.watch(normalizedPath, options);
    // 'add'|'addDir'|'change'|'unlink'|'unlinkDir'
    watcher.on('all', (eventName, eventPath, stats): void => {
      if (eventName === 'add') {
        // importModule(eventPath);
      }

      if (eventName === 'change' && stats && stats.isFile()) {
        // updateModule(eventPath);
      }

      if (eventName === 'unlink' || eventName === 'unlinkDir') {
        // disposeModule(eventPath);
      }
    });

  } else {
    out.error(`API main path not found: ${colors.grey(normalizedPath)}`);
  }
};

export default watchFolder;
