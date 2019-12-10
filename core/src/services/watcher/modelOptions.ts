import path from 'path';

import { WatcherOptions } from "./watcher";
import out from '../../util/out';
import fs from '../../util/fs';
import { watcher, fullPath } from '../../util/terminalStyles';
import { addTask } from './queue';
import { addCommand } from '../commands/consoleCommands';
import getProjectPath from "../../tools/getProjectPath";
import compileFile from '../model';

const sourceDir = 'model';

const getOptions = async (): Promise<WatcherOptions> => {
  const projectPath = await getProjectPath();
  const destDir = path.resolve(projectPath, 'node_modules/model/dist');

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

            await compileFile(rootFile, destPath);
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
          out.verbose(`${watcher}: Model Updated`);
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
      out.verbose(`${watcher}: Ready. Starting Model Setup.`);
      out.verbose(
        `${watcher}: API ready and watching for changes at ${fullPath(
          sourcePath,
        )}`,
      );
      addCommand({
        name: 'modelWatcherSource',
        description: `Prints the path ${watcher} is using as Model source`,
        onExecute: async (write): Promise<void> => {
          write(
            `${watcher}: Model source path is ${fullPath(
              sourcePath,
            )}`,
          );
        },
      });
      addCommand({
        name: 'modelWatcherDest',
        description: `Prints the path ${watcher} is using as model compilation destination`,
        onExecute: async (write): Promise<void> => {
          write(
            `${watcher}: Model destination path is ${fullPath(
              destPath,
            )}`,
          );
        },
      });
    },
    onError: (ex): void => {
      out.error(`${watcher} Model Error: ${ex.message}\n${ex.stack}`);
    },
  };
}

export default getOptions;
