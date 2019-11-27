import path from 'path';
import chokidar from 'chokidar';

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
import replacer from '../../util/apiStringifyReplacer';
import compileFile from '../compiler';
import { buildApi } from '../api';
import importModule from '../api/importModule';
import updateModule from '../api/updateModule';
import disposeModule from '../api/disposeModule';
import { addCommand } from '../commands/consoleCommands';
import { promisesQueue, processPromisesQueue } from './queue';

let watcherReady = false;

/**
 * Watch project API folder recursively for files changes
 *
 * @param {WatcherOptions} options WatchOptions for [chokidar](https://github.com/paulmillr/chokidar#api)
 */
const watchFolder = async (options?: chokidar.WatchOptions): Promise<void> =>
  new Promise(
    async (resolve): Promise<void> => {
      const modulePath = await getFrameworkPath();
      const projectPath = await getProjectPath();
      const sourcePath = path.join(projectPath, 'api');
      const normalizedSourcePath = path.normalize(sourcePath);
      const sourceExists = await fs.exists(normalizedSourcePath);
      const destPath = path.join(modulePath, 'server');

      if (sourceExists) {
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

        const apiPath = path.join(normalizedDestPath, 'api');
        const rootDir = path.resolve(normalizedSourcePath, '../');

        const watcherStart = +new Date();
        out.verbose(`${watcherOnLogs}: Init`);
        const watcher = chokidar.watch(normalizedSourcePath, options);
        watcher.on(
          'all',
          async (eventName, eventPath, stats): Promise<void> => {
            out.verbose(
              `${watcherOnLogs}: Event ${eventName} from path ${fullPath(
                eventPath,
              )}`,
            );
            const rootFile = path.relative(process.cwd(), eventPath);
            const relativePath = path.relative(normalizedSourcePath, eventPath);
            out.verbose(
              `${watcherOnLogs}: relativePath => ${fullPath(relativePath)}`,
            );
            const jsDestPath = path.join(
              apiPath,
              relativePath.replace(/\.ts$/, '.js'),
            );
            out.verbose(
              `${watcherOnLogs}: jsDestPath => ${fullPath(jsDestPath)}`,
            );
            const isFile = await fs.isFile(eventPath, stats);
            const fileAdded = eventName === 'add';
            const fileChanged = eventName === 'change' && isFile;
            const fileRemoved = eventName === 'unlink';
            const folderRemoved = eventName === 'unlinkDir';

            if (fileAdded || fileChanged) {
              if (watcherReady) {
                out.verbose(
                  `${watcherOnLogs}: File ${
                    fileAdded ? 'added' : 'changed'
                  }: ${eventPath}`,
                );
              }

              try {
                await compileFile(rootFile, rootDir, normalizedDestPath);

                if (watcherReady) {
                  const method = fileAdded ? importModule : updateModule;
                  out.verbose(
                    `${watcherOnLogs}: ${
                      fileAdded ? 'Importing' : 'Updating'
                    } ${apiOnLogs} method from ${fullPath(jsDestPath)}`,
                  );
                  const api = await method(jsDestPath);
                  out.verbose(
                    `${watcherOnLogs}: ${apiOnLogs} Updated:\n${JSON.stringify(
                      api,
                      replacer,
                      2,
                    )}`,
                  );
                }
              } catch (ex) {
                out.error(
                  `${watcherOnLogs}: Error compiling file ${fullPath(
                    rootFile,
                  )}: ${ex.message}`,
                );
              }
            }

            if (fileRemoved) {
              out.verbose(`${watcherOnLogs}: File removed: ${eventPath}`);
              const mapDestPath = `${jsDestPath}.map`;
              const dtsDestPath = jsDestPath.replace(/\.js$/, '.d.ts');
              promisesQueue.push((): Promise<void> => fs.unlink(jsDestPath));
              promisesQueue.push((): Promise<void> => fs.unlink(mapDestPath));
              promisesQueue.push((): Promise<void> => fs.unlink(dtsDestPath));
              processPromisesQueue();
              const api = await disposeModule(jsDestPath);
              out.verbose(
                `${watcherOnLogs}: ${apiOnLogs} Updated:\n${JSON.stringify(
                  api,
                  replacer,
                  2,
                )}`,
              );
            }

            if (folderRemoved) {
              promisesQueue.push((): Promise<void> => fs.rmDir(jsDestPath));
              processPromisesQueue();
            }
          },
        );

        watcher.on(
          'ready',
          async (): Promise<void> => {
            watcherReady = true;
            out.verbose(
              `${watcherOnLogs}: Ready in ${+new Date() -
                watcherStart}ms. Starting API.`,
            );
            const start = +new Date();
            await buildApi(normalizedDestPath);
            out.verbose(
              `${watcherOnLogs}: API built in ${+new Date() -
                start}ms and watching for changes at ${fullPath(
                normalizedSourcePath,
              )}`,
            );
            resolve();
            addCommand({
              name: 'watcherSource',
              description: `Prints the path ${watcherOnLogs} is using as ${apiOnLogs} source`,
              onExecute: async (write): Promise<void> => {
                write(
                  `${watcherOnLogs}: Source path is ${fullPath(
                    normalizedSourcePath,
                  )}`,
                );
              },
            });
            addCommand({
              name: 'watcherDest',
              description: `Prints the path ${watcherOnLogs} is using as compilation destination`,
              onExecute: async (write): Promise<void> => {
                write(
                  `${watcherOnLogs}: Dest path is ${fullPath(
                    normalizedDestPath,
                  )}`,
                );
              },
            });
          },
        );

        watcher.on('error', (ex): void => {
          out.error(`${watcherOnLogs}: Error: ${ex.message}\n${ex.stack}`);
        });
      } else {
        out.error(
          `${watcherOnLogs}: ${apiOnLogs} main path not found: ${fullPath(
            normalizedSourcePath,
          )}`,
        );
      }
    },
  );

export default watchFolder;
