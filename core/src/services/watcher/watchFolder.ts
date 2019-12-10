import path from 'path';
import chokidar from 'chokidar';

import { WatcherOptions } from '../../model/watcher';
import getFrameworkPath from '../../tools/getFrameworkPath';
import getProjectPath from '../../tools/getProjectPath';
import fs from '../../util/fs';
import out from '../../util/out';
import {
  watcher as watcherOnLogs,
  api as apiOnLogs,
  fullPath,
  terminalCommand,
} from '../../util/terminalStyles';

/**
 * Watch project API folder recursively for files changes
 *
 * @param {WatcherOptions} watcherOptions
 */
const watchFolder = async (watcherOptions: WatcherOptions): Promise<void> =>
  new Promise(
    async (resolve): Promise<void> => {
      const { sourceDir, destDir, handler, onReady, onError, options } = watcherOptions;
      const modulePath = await getFrameworkPath();
      const projectPath = await getProjectPath();
      const sourcePath = path.isAbsolute(sourceDir) ? sourceDir : path.join(projectPath, sourceDir);
      const normalizedSourcePath = path.normalize(sourcePath);
      const sourceExists = await fs.exists(normalizedSourcePath);

      out.verbose(`${watcherOnLogs}: Initializing at ${fullPath(normalizedSourcePath)}`);

      if (sourceExists) {
        const destPath = path.isAbsolute(destDir) ? destDir : path.resolve(modulePath, destDir);
        const normalizedDestPath = path.normalize(destPath);
        const destExists = await fs.exists(normalizedDestPath);

        if (destExists) {
          try {
            await fs.rimraf(normalizedDestPath);
          } catch (ex) {
            out.error(
              `${watcherOnLogs}: Error calling ${terminalCommand('rimraf')}: ${
                ex.message
              }\n${ex.stack}`,
            );
          }
        }

        await fs.mkDir(normalizedDestPath, { recursive: true });

        out.verbose(`${watcherOnLogs}: Init`);
        const watcher = chokidar.watch(normalizedSourcePath, options);
        watcher.on('all', (eventName, eventPath, stats): void => {
          handler(normalizedSourcePath, normalizedDestPath, eventName, eventPath, stats);
        });
        watcher.on('error', onError);
        watcher.on('ready', (): void => {
          if (onReady) {
            onReady(normalizedSourcePath, normalizedDestPath);
          }
          resolve();
        });
      } else {
        out.error(
          `${watcherOnLogs}: ${apiOnLogs} main path not found: ${fullPath(normalizedSourcePath)}`,
        );
      }
    },
  );

export * from '../../model/watcher';
export * from './queue';

export default watchFolder;
