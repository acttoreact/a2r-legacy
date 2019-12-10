import path from 'path';

import { WatcherOptions } from './watcher';
import fs from '../../util/fs';
import out from '../../util/out';
import { watcher, api, fullPath } from '../../util/terminalStyles';
import { addTask } from './queue';
import compileFile, { ValidationErrorLevel } from '../compiler';
import { setupApi } from '../api';
import importModule from '../api/importModule';
import updateModule from '../api/updateModule';
import disposeModule from '../api/disposeModule';
import { addCommand } from '../commands/consoleCommands';

const sourceDir = 'api';
const destDir = 'server';

const getOptions = async (): Promise<WatcherOptions> => {
  return {
    sourceDir,
    destDir,
    handler: async (sourcePath, destPath, eventName, eventPath, stats): Promise<void> => {
      out.verbose(
        `${watcher}: Event ${eventName} from path ${fullPath(
          eventPath,
        )}`,
      );
      const rootFile = path.relative(process.cwd(), eventPath);
      const relativePath = path.relative(sourcePath, eventPath);
      out.verbose(
        `${watcher}: file relative path => ${fullPath(relativePath)}`,
      );
      const apiPath = path.join(destDir, sourceDir);
      const jsDestPath = path.join(
        apiPath,
        relativePath.replace(/\.ts$/, '.js'),
      );
      out.verbose(
        `${watcher}: js file destination path => ${fullPath(jsDestPath)}`,
      );
      const isFile = await fs.isFile(eventPath, stats);
      const fileAdded = eventName === 'add';
      const fileChanged = eventName === 'change' && isFile;
      const fileRemoved = eventName === 'unlink';
      const folderRemoved = eventName === 'unlinkDir';

      if (fileAdded || fileChanged) {
        addTask({
          path: eventPath,
          handler: async (): Promise<void> => {
            out.verbose(
              `${watcher}: File ${
                fileAdded ? 'added' : 'changed'
              }: ${eventPath}`,
            );

            const compilerInfo = await compileFile(rootFile, destPath);

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
                const method = fileAdded ? importModule : updateModule;
                out.verbose(
                  `${watcher}: ${
                    fileAdded ? 'Importing' : 'Updating'
                  } ${api} method from ${fullPath(jsDestPath)}`,
                );
                await method(jsDestPath, compilerInfo);
                out.verbose(`${watcher}: ${api} Updated`);

              }
            } else {
              throw Error(`there is no main method or it's not exported as default`);
            }
          },
          onError: (ex): void => {
            out.error(
              `${watcher}: Error(s) compiling file ${fullPath(
                rootFile,
              )}: ${ex.message}`,
            );
          }
        });
      }

      if (fileRemoved) {
        addTask({ path: eventPath, handler: async (): Promise<void> => {
          out.verbose(`${watcher}: File removed: ${eventPath}`);
          const mapDestPath = `${jsDestPath}.map`;
          const dtsDestPath = jsDestPath.replace(/\.js$/, '.d.ts');
          await fs.unlink(jsDestPath);
          await fs.unlink(mapDestPath);
          await fs.unlink(dtsDestPath);
          await disposeModule(jsDestPath);
          out.verbose(`${watcher}: ${api} Updated`);
        }});
      }

      if (folderRemoved) {
        addTask({ path: eventPath, handler: async (): Promise<void> => {
          out.verbose(`${watcher}: Folder removed: ${eventPath}`);
          await fs.rmDir(jsDestPath);
        }});
      }
    },
    onReady: async (sourcePath, destPath): Promise<void> => {
      out.verbose(`${watcher}: Ready. Starting API Setup.`);
      await setupApi(destPath);
      out.verbose(
        `${watcher}: Model ready and watching for changes at ${fullPath(
          sourcePath,
        )}`,
      );
      addCommand({
        name: 'apiWatcherSource',
        description: `Prints the path ${watcher} is using as ${api} source`,
        onExecute: async (write): Promise<void> => {
          write(
            `${watcher}: API source path is ${fullPath(
              sourcePath,
            )}`,
          );
        },
      });
      addCommand({
        name: 'apiWatcherDest',
        description: `Prints the path ${watcher} is using as ${api} compilation destination`,
        onExecute: async (write): Promise<void> => {
          write(
            `${watcher}: API destination path is ${fullPath(
              destPath,
            )}`,
          );
        },
      });
    },
    onError: (ex): void => {
      out.error(`${watcher} ${api} Error: ${ex.message}\n${ex.stack}`);
    },
  };
};

export default getOptions;
