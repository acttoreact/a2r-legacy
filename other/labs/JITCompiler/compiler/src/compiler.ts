import ts from 'typescript';
import chokidar from 'chokidar';
import colors from 'colors';
import path from 'path';
import out from './util/out';
import fs from './util/fs';

out.setLevel('verbose');

const sorcePath = path.join(__dirname, '../../test/api');
const destPath = path.join(__dirname, '../../test/server');

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

const deleteIfExists = async (fileNameToDelete:string): Promise<void> => {
  console.log(fileNameToDelete);
}

// Purge removed files
chokidar.watch(sorcePath).on(
  'unlink',
  async (fileNamePath: string): Promise<void> => {
    out.verbose(
      `Watcher detected file deletion (unlink): ${fileNamePath} with extension ${path.extname(
        fileNamePath
      )}`
    );
    const fileInfo = path.parse(fileNamePath);
    if (fileInfo.ext.toLowerCase() === '.ts') {
      await deleteIfExists(path.join(destPath, `./${fileInfo.name}.js`));
      await deleteIfExists(path.join(destPath, `./${fileInfo.name}.d.ts`));
      await deleteIfExists(path.join(destPath, `./${fileInfo.name}.js.map`));
      
    }
  }
);

/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic: ts.Diagnostic): void {
  out.verbose(ts.formatDiagnostic(diagnostic, formatHost));
}

function watchMain(): void {
  const configPath = path.join(sorcePath, '../tsconfig-api.json');

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
    out.info('We finished making the program!');
    origPostProgramCreate!(program);
  };

  // `createWatchProgram` creates an initial program, watches files, and updates
  // the program over time.
  ts.createWatchProgram(host);
}

watchMain();
