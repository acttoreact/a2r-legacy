import path from 'path';

import { WatcherOptions, addTask } from '../watcher/watchFolder';
import out from '../../util/out';
import fs from '../../util/fs';
import { watcher, fullPath } from '../../util/terminalStyles';
import { addCommand } from '../commands/consoleCommands';
import getProjectPath from '../../tools/getProjectPath';
import compileFile from '../compiler';
import getExportsIdentifiers from './getExportsIdentifiers';
import { addKeys } from './model';
import build from './build';

const sourceDir = 'model';

const getOptions = async (): Promise<WatcherOptions> => {
  const projectPath = await getProjectPath();
  const destDir = path.resolve(projectPath, 'node_modules/model/dist');
  const mainModelFile = path.resolve(destDir, 'index.ts');

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
        addTask({
          path: eventPath,
          handler: async (): Promise<void> => {
            out.verbose(`${watcher}: File ${fileAdded ? 'added' : 'changed'}: ${eventPath}`);
            const modelKeys = await getExportsIdentifiers(rootFile);
            await compileFile(rootFile, destPath);
            addKeys(modelKeys, rootFile);
            build(mainModelFile);
            // update model
          },
          onError: (ex): void => {
            out.error(`${watcher}: Error(s) compiling file ${fullPath(rootFile)}: ${ex.message}`);
          },
        });
      }

      if (fileRemoved) {
        addTask({
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
        });
      }

      if (folderRemoved) {
        addTask({
          path: eventPath,
          handler: async (): Promise<void> => {
            out.verbose(`${watcher}: Folder removed: ${eventPath}`);
            await fs.rmDir(jsDestPath);
          },
        });
      }
    },
    onReady: async (sourcePath, destPath): Promise<void> => {
      out.verbose(`${watcher}: Ready. Starting model setup.`);
      out.verbose(`${watcher}: Model ready and watching for changes at ${fullPath(sourcePath)}`);
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
