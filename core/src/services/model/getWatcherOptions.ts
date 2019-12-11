import path from 'path';

import { WatcherOptions, addTask, processTasks } from '../watcher/watchFolder';
import out from '../../util/out';
import fs from '../../util/fs';
import { watcher as watcherOnLogs, fullPath } from '../../util/terminalStyles';
import { addCommand } from '../commands/consoleCommands';
import getExportsIdentifiers from './getExportsIdentifiers';
import { addKeys } from './model';
import build from './build';
import { setupModel } from '.';
import getFrameworkPath from '../../tools/getFrameworkPath';

import settings from '../../config/settings';

const { modelPath: sourceDir } = settings;
const watcher = `${watcherOnLogs} (Model)`;
const priority = 10;

let ready = false;

const getOptions = async (): Promise<WatcherOptions> => {
  const frameworkPath = await getFrameworkPath();
  const destDir = path.resolve(frameworkPath, sourceDir);

  return {
    sourceDir,
    destDir,
    handler: async (sourcePath, destPath, eventName, eventPath, stats): Promise<void> => {
      out.verbose(`${watcher}: Event ${eventName} from path ${fullPath(eventPath)}`);
      const rootFile = path.relative(process.cwd(), eventPath);
      const relativePath = path.relative(sourcePath, eventPath);
      const jsDestPath = path.join(destDir, sourceDir, relativePath.replace(/\.ts$/, '.js'));
      out.verbose(`${watcher}: file relative path => ${fullPath(relativePath)}`);
      out.verbose(`${watcher}: js file destination path => ${fullPath(jsDestPath)}`);

      const isFile = await fs.isFile(eventPath, stats);
      const fileAdded = eventName === 'add';
      const fileChanged = eventName === 'change' && isFile;
      const fileRemoved = eventName === 'unlink';
      const folderRemoved = eventName === 'unlinkDir';

      if (fileAdded || fileChanged) {
        addTask(
          {
            path: eventPath,
            handler: async (): Promise<void> => {
              out.verbose(`${watcher}: File ${fileAdded ? 'added' : 'changed'}: ${eventPath}`);
              const modelKeys = await getExportsIdentifiers(rootFile);
              const modelCopyPath = path.resolve(destDir, sourceDir, relativePath);
              await fs.ensureDir(path.dirname(modelCopyPath));
              out.verbose(`${watcher}: Copying file ${fullPath(eventPath)} to ${fullPath(modelCopyPath)}`)
              await fs.copyFile(eventPath, modelCopyPath);
              addKeys(modelKeys, rootFile);
              await build();
            },
            onError: (ex): void => {
              out.error(
                `${watcher}: Error(s) processing model file ${fullPath(rootFile)}: ${ex.message}\n${
                  ex.stack
                }`,
              );
            },
            priority,
          },
          ready,
        );
      }

      if (fileRemoved) {
        addTask(
          {
            path: eventPath,
            handler: async (): Promise<void> => {
              out.verbose(`${watcher}: File removed: ${eventPath}`);
              const mapDestPath = `${jsDestPath}.map`;
              const dtsDestPath = jsDestPath.replace(/\.js$/, '.d.ts');
              await fs.unlink(jsDestPath);
              await fs.unlink(mapDestPath);
              await fs.unlink(dtsDestPath);
              out.verbose(`${watcher}: Model Updated`);
            },
            priority,
          },
          ready,
        );
      }

      if (folderRemoved) {
        addTask(
          {
            path: eventPath,
            handler: async (): Promise<void> => {
              out.verbose(`${watcher}: Folder removed: ${eventPath}`);
              await fs.rmDir(jsDestPath);
            },
            priority,
          },
          ready,
        );
      }
    },
    onReady: async (sourcePath, destPath): Promise<void> => {
      out.verbose(`${watcher}: Ready. Starting model setup.`);
      ready = true;
      await setupModel();
      out.verbose(`${watcher}: Setup ready. Watching for changes at ${fullPath(sourcePath)}`);
      processTasks();
      addCommand({
        name: 'modelWatcherSource',
        description: `Prints the path ${watcher} is using as Model source`,
        onExecute: async (write): Promise<void> => {
          write(`${watcher}: Model source path is ${fullPath(sourcePath)}`);
        },
      });
      addCommand({
        name: 'modelWatcherDest',
        description: `Prints the path ${watcher} is using as model compilation destination`,
        onExecute: async (write): Promise<void> => {
          write(`${watcher}: Model destination path is ${fullPath(destPath)}`);
        },
      });
    },
    onError: (ex): void => {
      out.error(`${watcher} Model Error: ${ex.message}\n${ex.stack}`);
    },
  };
};

export default getOptions;
