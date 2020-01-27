import path from 'path';

import { WatcherOptions, addTask, processTasks } from '../watcher/watchFolder';
import out from '../../util/out';
import fs from '../../util/fs';
import { watcher as watcherOnLogs, fullPath } from '../../util/terminalStyles';
import { addCommand } from '../commands/consoleCommands';
import getExportsIdentifiers from './getExportsIdentifiers';
import { addKeys, removeKeys } from './model';
import build from './build';
import { setupModel } from '.';
import getFrameworkPath from '../../tools/getFrameworkPath';
import { getSettings } from '../..';
import getProjectPath from '../../tools/getProjectPath';
import touchTsConfig from '../../tools/touchTsConfig';

import settings from '../../config/settings';

const { modelPath } = settings;
const watcher = `${watcherOnLogs} (Model)`;
const priority = 10;

let ready = false;

const getOptions = async (): Promise<WatcherOptions> => {
  const frameworkPath = await getFrameworkPath();
  const destDir = path.resolve(frameworkPath, modelPath);

  const projectSettings = getSettings();
  const { modelDestinationPaths } = projectSettings;
  const destinationPaths = new Array<string>();
  if (modelDestinationPaths && modelDestinationPaths.length) {
    const projectPath = await getProjectPath();
    destinationPaths.push(
      ...modelDestinationPaths.map(p => {
        if (path.isAbsolute(p)) {
          return p;
        }
        return path.resolve(projectPath, p);
      }),
    );
  }

  return {
    sourceDir: modelPath,
    destDir,
    handler: async (sourcePath, destPath, eventName, eventPath, stats): Promise<void> => {
      out.verbose(`${watcher}: Event ${eventName} from path ${fullPath(eventPath)}`);
      const rootFile = path.relative(process.cwd(), eventPath);
      const relativePath = path.relative(sourcePath, eventPath);

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
              const modelCopyPath = path.resolve(destPath, modelPath, relativePath);
              await fs.ensureDir(path.dirname(modelCopyPath));
              await touchTsConfig();
              out.verbose(
                `${watcher}: Copying file ${fullPath(eventPath)} to ${fullPath(modelCopyPath)}`,
              );
              await Promise.all(
                destinationPaths.map(async p => {
                  const dest = path.resolve(p, relativePath);
                  await fs.ensureDir(path.dirname(dest));
                  await fs.copyFile(eventPath, dest);
                }),
              );
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
        const jsDestPath = path.join(destPath, relativePath.replace(/\.ts$/, '.js'));
        out.verbose(`${watcher}: js file destination path => ${fullPath(jsDestPath)}`);
        addTask(
          {
            path: eventPath,
            handler: async (): Promise<void> => {
              out.verbose(`${watcher}: File removed: ${eventPath}`);
              const mapDestPath = `${jsDestPath}.map`;
              const dtsDestPath = jsDestPath.replace(/\.js$/, '.d.ts');
              await Promise.all(
                destinationPaths.map(p => fs.unlink(path.resolve(p, relativePath))),
              );
              await fs.unlink(jsDestPath);
              await fs.unlink(mapDestPath);
              await fs.unlink(dtsDestPath);
              removeKeys(rootFile);
              await build();
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
              await Promise.all(
                destinationPaths.map(p => fs.rmDir(path.resolve(p, relativePath))),
              );
              await fs.rmDir(eventPath);
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
        onExecute: (write): void => {
          write(`${watcher}: Model source path is ${fullPath(sourcePath)}`);
        },
      });
      addCommand({
        name: 'modelWatcherDest',
        description: `Prints the path ${watcher} is using as model compilation destination`,
        onExecute: (write): void => {
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
