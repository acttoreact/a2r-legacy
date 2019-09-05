import ts from 'typescript';
import chokidar from 'chokidar';
import colors from 'colors';
import path from 'path';
import out from '../../util/out';
import fs from '../../util/fs';

const compileFiles = async (
  sourcePath: string,
  destPath: string
): Promise<void> => {
  const existsDestPath = await fs.exists(destPath);

  if (existsDestPath) {
    try {
      await fs.rimraf(destPath);
      await fs.mkDir(destPath);
    } catch (ex) {    
      out.error(
        `Error calling ${colors.bgRed.white('rimraf')}: ${ex.message}\n${ex.stack}`);
    }
  }  

  const formatHost: ts.FormatDiagnosticsHost = {
    getCanonicalFileName: (fileNamePath): string => fileNamePath,
    getCurrentDirectory: ts.sys.getCurrentDirectory,
    getNewLine: (): string => ts.sys.newLine,
  };

  function reportDiagnostic(diagnostic: ts.Diagnostic): void {
    out.error(
      `Error code ${colors.bgRed.white(
        diagnostic.code.toString()
      )} compiling A2R Framework API File:\n${ts.formatDiagnosticsWithColorAndContext(
        [diagnostic],
        formatHost
      )}`
    );
  }

  const deleteIfExists = async (fileNameToDelete: string): Promise<void> => {
    const exists = await fs.exists(fileNameToDelete);
    out.verbose(`Exists file ${fileNameToDelete}: ${exists}`);    
    if (exists) {
      const info = await fs.lStat(fileNameToDelete);
      if (info.isFile()) {
        out.verbose(`Deleting file ${fileNameToDelete}...`);    
        await fs.unlink(fileNameToDelete);
      }
    }
  };

  // Purge removed files
  chokidar.watch(sourcePath).on(
    'unlink',
    async (fileNamePath: string): Promise<void> => {
      out.verbose(
        `Watcher detected file deletion (unlink): ${fileNamePath} with extension ${path.extname(
          fileNamePath
        )}`
      );
      const fileInfo = path.parse(fileNamePath);
      const relative = path.relative(sourcePath, fileInfo.dir);
      if (fileInfo.ext.toLowerCase() === '.ts') {
        await deleteIfExists(path.join(destPath, `${relative}/${fileInfo.name}.js`));
        await deleteIfExists(path.join(destPath, `${relative}/${fileInfo.name}.d.ts`));
        await deleteIfExists(path.join(destPath, `${relative}/${fileInfo.name}.js.map`));
      }
    }
  );

  /**
   * Prints a diagnostic every time the watch status changes.
   * This is mainly for messages like "Starting compilation" or "Compilation completed".
   */
  function reportWatchStatusChanged(diagnostic: ts.Diagnostic): void {
    if(diagnostic.messageText.toString().indexOf('0 errors') !== -1) {
      out.info(`${colors.yellow.bold('API')} transpilation ${colors.green.bold('OK')}`)
    }    
    out.verbose(ts.formatDiagnostic(diagnostic, formatHost));
  }

  function watchMain(): void {
    const configPath = path.join(sourcePath, '../tsconfig-api.json');
    console.log('configPath: ', configPath);

    const createProgram = ts.createSemanticDiagnosticsBuilderProgram;

    // Note that there is another overload for `createWatchCompilerHost` that takes
    // a set of root files.
    const host = ts.createWatchCompilerHost(
      configPath,
      {},
      ts.sys,
      createProgram,
      reportDiagnostic,
      reportWatchStatusChanged
    );

    // You can technically override any given hook on the host, though you probably
    // don't need to.
    const origCreateProgram = host.createProgram;

    host.createProgram = (
      rootNames: readonly string[] | undefined,
      options: ts.CompilerOptions | undefined,
      currentHost: ts.CompilerHost | undefined,
      oldProgram: ts.SemanticDiagnosticsBuilderProgram | undefined
    ): ts.SemanticDiagnosticsBuilderProgram => {
      out.verbose('We are about to create the program!');
      return origCreateProgram(rootNames, options, currentHost, oldProgram);
    };

    const origPostProgramCreate = host.afterProgramCreate;

    host.afterProgramCreate = (program): void => {
      out.verbose('We finished making the program!');      
      origPostProgramCreate!(program);
    };

    // `createWatchProgram` creates an initial program, watches files, and updates
    // the program over time.
    ts.createWatchProgram(host);
  }

  watchMain();
};

export default compileFiles;
