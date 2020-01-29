import path from 'path';

import { WatcherOptions } from '../../model/watcher';
import { ValidationErrorLevel } from '../../model/compiler';
import { addTask, processTasks } from '../watcher/watchFolder';
import { addCommand } from '../commands/consoleCommands';
import fs from '../../util/fs';
import out from '../../util/out';
import { watcher as watcherOnLogs, api, fullPath } from '../../util/terminalStyles';
import compileFile from '../compiler';
import getModuleInfo from '../compiler/getModuleInfo';
import getFrameworkPath from '../../tools/getFrameworkPath';
import importModule from './importModule';
import updateModule from './updateModule';
import disposeModule from './disposeModule';
import { setupApi } from '.';
import { getSettings } from '../..';
import getProjectPath from '../../tools/getProjectPath';
import touchTsConfig from '../../tools/touchTsConfig';

const watcher = `${watcherOnLogs} (API)`;
const sourceDir = 'api';
const destDir = 'server';
const priority = 20;

let ready = false;

const getOptions = async (): Promise<WatcherOptions> => {
  const modulePath = await getFrameworkPath();
  const settings = getSettings();
  const { apiDestinationPaths } = settings;
  const destinationPaths = new Array<string>();
  const projectPath = await getProjectPath();
  if (apiDestinationPaths && apiDestinationPaths.length) {
    destinationPaths.push(
      ...apiDestinationPaths.map(p => {
        if (path.isAbsolute(p)) {
          return p;
        }
        return path.resolve(projectPath, p);
      }),
    );
  }

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
              out.verbose(`${watcher}: file relative path => ${fullPath(relativePath)}`);
              out.verbose(`${watcher}: js file destination path => ${fullPath(jsDestPath)}`);

              await touchTsConfig();
              const compilerInfo = await getModuleInfo(rootFile);
              await compileFile([rootFile], destPath);

              if (compilerInfo && compilerInfo.mainMethodNode) {
                if (compilerInfo.validationErrors.length) {
                  const errors = compilerInfo.validationErrors.reduce((t, e): string[] => {
                    if (e.level === ValidationErrorLevel.Error) {
                      t.push(e.message);
                    }
                    return t;
                  }, new Array<string>());
                  throw Error(`${errors.length > 1 ? '\n- ' : ''}${errors.join('\n- ')}`);
                } else {
                  await Promise.all(
                    destinationPaths.map(async p => {
                      const dest = path.resolve(p, relativePath);
                      await fs.ensureDir(path.dirname(dest));
                      await fs.copyFile(eventPath, dest);
                    }),
                  );
                  const method = fileAdded ? importModule : updateModule;
                  out.verbose(
                    `${watcher}: ${
                      fileAdded ? 'Importing' : 'Updating'
                    } ${api} method from ${fullPath(jsDestPath)}`,
                  );
                  await method(jsDestPath, compilerInfo);
                  out.verbose(`${watcher}: API Updated`);
                }
              } else {
                throw Error(`there is no main method or it's not exported as default`);
              }
            },
            onError: (ex): void => {
              out.error(
                `${watcher}: Error(s) compiling API file ${fullPath(rootFile)}: ${ex.message}`,
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
              await Promise.all(
                destinationPaths.map(p => fs.unlink(path.resolve(p, relativePath))),
              );
              await fs.unlink(jsDestPath);
              await fs.unlink(mapDestPath);
              await fs.unlink(dtsDestPath);
              await disposeModule(jsDestPath);
              out.verbose(`${watcher}: API Updated`);
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
              await Promise.all(
                destinationPaths.map(p => fs.rmDir(path.resolve(p, relativePath))),
              );
              await fs.rmDir(folderPath);
            },
            priority,
          },
          ready,
        );
      }
    },
    onReady: async (sourcePath, destPath): Promise<void> => {
      out.verbose(`${watcher}: Ready. Starting API Setup.`);
      ready = true;
      await setupApi(destPath);
      processTasks();
      out.verbose(`${watcher}: Setup ready and watching for changes at ${fullPath(sourcePath)}`);
      addCommand({
        name: 'apiWatcherSource',
        description: `Prints the path ${watcher} is using as ${api} source`,
        onExecute: (write): void => {
          write(`${watcher}: API source path is ${fullPath(sourcePath)}`);
        },
      });
      addCommand({
        name: 'apiWatcherDest',
        description: `Prints the path ${watcher} is using as ${api} compilation destination`,
        onExecute: (write): void => {
          write(`${watcher}: API destination path is ${fullPath(destPath)}`);
        },
      });
    },
    onError: (ex): void => {
      out.error(`${watcher} Error: ${ex.message}\n${ex.stack}`);
    },
  };
};

export default getOptions;
