import ts from 'typescript';
import path from 'path';
import chokidar from 'chokidar';
import colors from 'colors';
import fs from '../../util/fs';
import out from '../../util/out';
import { importModule, updateModule, disposeModule, buildApi } from '../api';

const watcherInLogs = colors.cyan.bold('Watcher');

const compileOptions = {
  declaration: true,
  module: ts.ModuleKind.CommonJS,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  skipLibCheck: true,
  sourceMap: true,
  strict: true,
  target: ts.ScriptTarget.ES2017,
};

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: (fileNamePath): string => fileNamePath,
  getCurrentDirectory: ts.sys.getCurrentDirectory,
  getNewLine: (): string => ts.sys.newLine,
};

let watcherReady = false;
let promiseRunning = false;
const promisesQueue: Function[] = [];

const processPromisesQueue = (): void => {
  if (!promiseRunning) {
    const promiseProvider = promisesQueue.shift();
    if (promiseProvider) {
      promiseRunning = true;
      promiseProvider().catch((ex: Error): void => {
        out.error(`${watcherInLogs}: Error removing path: ${ex.message}\n${ex.stack}`);
      }).finally((): void => {
        promiseRunning = false;
        processPromisesQueue();
      });
    }
  }
};

/**
 * Watch folder recursively for files changes
 *
 * @param {string} sourcePath Main folder to be watched and whose contents will be processed
 * @param {string} destPath Destination path where processed contents are placed
 * @param {WatcherOptions} options WatchOptions for [chokidar](https://github.com/paulmillr/chokidar#api)
 */
const watchFolder = async (
  sourcePath: string,
  destPath: string,
  options?: chokidar.WatchOptions,
): Promise<void> => {
  const normalizedSourcePath = path.normalize(sourcePath);
  const sourceExists = await fs.exists(normalizedSourcePath);

  if (sourceExists) {
    const normalizedDestPath = path.normalize(destPath);
    const destExists = await fs.exists(normalizedDestPath);

    if (destExists) {
      try {
        await fs.rimraf(normalizedDestPath);
      } catch (ex) {
        out.error(`${watcherInLogs}: Error calling ${colors.bgRed.white('rimraf')}: ${ex.message}\n${ex.stack}`);
      }
    }
    await fs.mkDir(normalizedDestPath, { recursive: true });

    const apiPath = path.join(normalizedDestPath, 'api');
    const rootDir = path.resolve(normalizedSourcePath, '../');

    const watcher = chokidar.watch(normalizedSourcePath, options);
    watcher.on('all', async (eventName, eventPath, stats): Promise<void> => {
      const rootFile = path.relative(process.cwd(), eventPath);
      const relativePath = path.relative(normalizedSourcePath, eventPath);
      const jsDestPath = path.join(apiPath, relativePath.replace(/\.ts$/, '.js'));
      const isFile = await fs.isFile(eventPath, stats);
      const fileAdded = eventName === 'add';
      const fileChanged = eventName === 'change' && isFile;
      const fileRemoved = eventName === 'unlink';
      const folderRemoved = eventName === 'unlinkDir';
      // const folderRemoved = eventName === 'unlink' && !isFile;
      if (fileAdded || fileChanged) {
        if (watcherReady) {
          out.verbose(`${watcherInLogs}: File ${fileAdded ? 'added' : 'changed'}: ${eventPath}`);
        }
        const program = ts.createProgram([rootFile], {
          ...compileOptions,
          rootDir,
          outDir: normalizedDestPath,
        });

        const emitResult = program.emit();
        const diagnostics = [...ts.getPreEmitDiagnostics(program), ...emitResult.diagnostics];
        if (diagnostics && diagnostics.length) {
          diagnostics.forEach((diagnostic): void => {
            out.verbose(ts.formatDiagnostic(diagnostic, formatHost));
          });
        }
        
        if (watcherReady) {
          const method = fileAdded ? importModule : updateModule;
          const api = await method(jsDestPath);
          out.verbose(`${watcherInLogs}: API Updated:`, api);
        }
      }

      if (fileRemoved) {
        out.verbose(`${watcherInLogs}: File removed: ${eventPath}`);
        const mapDestPath = `${jsDestPath}.map`;
        const dtsDestPath = jsDestPath.replace(/\.js$/, '.d.ts');
        promisesQueue.push((): Promise<void> => fs.unlink(jsDestPath));
        promisesQueue.push((): Promise<void> => fs.unlink(mapDestPath));
        promisesQueue.push((): Promise<void> => fs.unlink(dtsDestPath));
        processPromisesQueue();
        const api = await disposeModule(jsDestPath);
        out.verbose(`${watcherInLogs}: API Updated:`, api);
      }

      if (folderRemoved) {
        promisesQueue.push((): Promise<void> => fs.rmDir(jsDestPath));
        processPromisesQueue();
      }
    });
    
    watcher.on('ready', async (): Promise<void> => {
      watcherReady = true;
      out.verbose(`${watcherInLogs}: Ready`);
      const api = await buildApi(normalizedDestPath);
      out.verbose('', api);
    });

    watcher.on('error', (ex): void => {
      out.error(`${watcherInLogs}: Error: ${ex.message}\n${ex.stack}`);
    });
  } else {
    out.error(`${watcherInLogs}: API main path not found: ${colors.grey(normalizedSourcePath)}`);
  }
};

export default watchFolder;
