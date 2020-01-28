import path from 'path';
import { WatcherOptions } from '../../model/watcher';
import { addTask, processTasks } from '../watcher/watchFolder';
import compileFile from '../compiler';
import { watcher as watcherOnLogs, fullPath } from '../../util/terminalStyles';
import out from '../../util/out';
import fs from '../../util/fs';
import getFrameworkPath from '../../tools/getFrameworkPath';
import touchTsConfig from '../../tools/touchTsConfig';
import { removeModuleCacheFromFilePath } from './cache';

const sourceDir = 'data';
const destDir = 'server';
const watcher = `${watcherOnLogs} (Model)`;
const priority = 20;

let ready = false;

const getOptions = async (): Promise<WatcherOptions> => {
  const modulePath = await getFrameworkPath();

  return {
    sourceDir,
    destDir,
    handler: async (sourcePath, destPath, eventName, eventPath, stats): Promise<void> => {
      out.verbose(`${watcher}: Event ${eventName} from path ${fullPath(eventPath)}`);
      const rootFile = path.relative(process.cwd(), eventPath);
      const relativePath = path.relative(sourcePath, eventPath);
      const jsDestPath = path.join(
        modulePath,
        destDir,
        sourceDir,
        relativePath.replace(/\.ts$/, '.js'),
      );

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
              const dataCopyPath = path.resolve(destPath, sourceDir, relativePath);
              await fs.ensureDir(path.dirname(dataCopyPath));
              await touchTsConfig();
              await compileFile([rootFile], destPath);
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
              removeModuleCacheFromFilePath(jsDestPath);
              await fs.unlink(jsDestPath);
              await fs.unlink(mapDestPath);
              await fs.unlink(dtsDestPath);
            },
            priority,
          },
          ready,
        );
      }

      if (folderRemoved) {
        const folderPath = path.join(modulePath, destDir, sourceDir, relativePath);
        addTask(
          {
            path: eventPath,
            handler: async (): Promise<void> => {
              out.verbose(`${watcher}: API Folder removed: ${eventPath}`);
              await fs.rmDir(folderPath);
            },
            priority,
          },
          ready,
        );
      }
    },
    onReady: (sourcePath): void => {
      out.verbose(`${watcher}: Ready. Starting Data folder setup.`);
      ready = true;
      processTasks();
      out.verbose(`${watcher}: Setup ready and watching for changes at ${fullPath(sourcePath)}`);
    },
    onError: (ex): void => {
      out.error(`${watcher} Error: ${ex.message}\n${ex.stack}`);
    },
  };
};

export default getOptions;
