import ts, { createCompilerHost } from 'typescript';
import path from 'path';
import chokidar from 'chokidar';
import colors from 'colors';
import fs from '../../util/fs';
import out from '../../util/out';
import { importModule, updateModule, disposeModule } from '../api';

let working = false;

const createProgram = (eventPath: string, jsDestFolder: string, normalizedPath: string, formatHost: ts.FormatDiagnosticsHost): void => {
  if (!working) {
    working = true;
    console.log('creating program');
    console.log('eventPath', eventPath);
    console.log('jsDestFolder', jsDestFolder);
    console.log('normalizedPath', normalizedPath);
    const program = ts.createProgram([eventPath], {
      composite: true,
      declaration: true,
      declarationDir: jsDestFolder,
      module: ts.ModuleKind.CommonJS,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      outDir: jsDestFolder,
      rootDir: normalizedPath,
      skipLibCheck: true,
      sourceMap: true,
      strict: true,
      target: ts.ScriptTarget.ES2017,
    });
    const emitResult = program.emit();
    const diagnostics = [...ts.getPreEmitDiagnostics(program), ...emitResult.diagnostics];
    if (diagnostics && diagnostics.length) {
      diagnostics.forEach((diagnostic): void => {
        out.verbose(ts.formatDiagnostic(diagnostic, formatHost));
      });
    }

    console.log('emittedFiles: ', emitResult.emittedFiles);
  }
};

/**
 * Watch folder for files and folders changes
 *
 * @param {string} sourcePath Main folder to be watched and whose contents will be processed
 * @param {string} destPath Destination path where processed contents are placed
 * @param {WatcherOptions} options WatchOptions for [chokidar](https://github.com/paulmillr/chokidar#api)
 */
const watchFolder = async (
  sourcePath: string,
  destPath: string,
  configPath: string,
  options?: chokidar.WatchOptions,
): Promise<void> => {
  const normalizedPath = path.normalize(sourcePath);
  const sourceExists = await fs.exists(normalizedPath);
  console.log('sourcePath', sourcePath);
  console.log('destPath', destPath);

  if (sourceExists) {
    const destExists = await fs.exists(destPath);

    if (destExists) {
      try {
        await fs.rimraf(destPath);
        await fs.mkDir(destPath);
      } catch (ex) {
        out.error(`Error calling ${colors.bgRed.white('rimraf')}: ${ex.message}\n${ex.stack}`);
      }
    }

    const formatHost: ts.FormatDiagnosticsHost = {
      getCanonicalFileName: (fileNamePath): string => fileNamePath,
      getCurrentDirectory: ts.sys.getCurrentDirectory,
      getNewLine: (): string => ts.sys.newLine,
    };

    const watcher = chokidar.watch(normalizedPath, options);
    watcher.on('all', async (eventName, eventPath, stats): Promise<void> => {
      // console.log(eventName, eventPath, stats!.isFile());
      if (eventName === 'add') {
        // const content = await fs.readFile(eventPath, 'utf8');
        const relativePath = path.relative(sourcePath, eventPath);
        const jsDestFolder = path.join(destPath, path.dirname(relativePath));
        await fs.ensureDir(jsDestFolder);
        // const cleanName = path.basename(eventPath, path.extname(eventPath));
        // const jsDestPath = path.join(jsDestFolder, `${cleanName}.js`);
        // const dtsDestPath = path.join(jsDestFolder, `${cleanName}.d.ts`);
        // const mapDestPath = `${jsDestPath}.map`;
        createProgram(eventPath, jsDestFolder, normalizedPath, formatHost);
        // const result = ts.transpileModule(content, {
        //   fileName: eventPath,
        //   moduleName: cleanName,
        //   reportDiagnostics: true,
        //   compilerOptions: {
        //     composite: true,
        //     declaration: true,
        //     declarationDir: '.',
        //     module: ts.ModuleKind.CommonJS,
        //     moduleResolution: ts.ModuleResolutionKind.NodeJs,
        //     skipLibCheck: true,
        //     sourceMap: true,
        //     strict: true,
        //     target: ts.ScriptTarget.ES2017,
        //   },
        // });
        // const { outputText, sourceMapText } = result;
        // if (diagnostics) {
        //   diagnostics.forEach((diagnostic): void => {
        //     out.verbose(ts.formatDiagnostic(diagnostic, formatHost));
        //   });
        // }
        // console.log(sourceFile.getFullText())
        // await fs.writeFile(jsDestPath, outputText);
        // await fs.writeFile(mapDestPath, sourceMapText);
        // importModule(jsDestPath);
      }

      if (eventName === 'change' && stats && stats.isFile()) {
        // updateModule(eventPath);
      }

      if (eventName === 'unlink' || eventName === 'unlinkDir') {
        // disposeModule(eventPath);
      }
    });
    watcher.on('ready', (): void => {
      console.log('Watcher ready');
    });
    watcher.on('error', (ex): void => {
      out.error(`Watcher error: ${ex.message}\n${ex.stack}`);
    });
  } else {
    out.error(`API main path not found: ${colors.grey(normalizedPath)}`);
  }
};

export default watchFolder;
