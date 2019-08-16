import ts from 'typescript';
import colors from 'colors';
import out from './util/out';

out.setLevel('verbose');

const formatHost: ts.FormatDiagnosticsHost = {
  getCanonicalFileName: (path): string => path,
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

/**
 * Prints a diagnostic every time the watch status changes.
 * This is mainly for messages like "Starting compilation" or "Compilation completed".
 */
function reportWatchStatusChanged(diagnostic: ts.Diagnostic): void {
  out.verbose(ts.formatDiagnostic(diagnostic, formatHost));
}

function watchMain(): void {
  const configPath = ts.findConfigFile(
    /* searchPath */ '../test',
    ts.sys.fileExists,
    'tsconfig.json'
  );
  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }

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
    oldProgram: ts.SemanticDiagnosticsBuilderProgram | undefined,
  ): ts.SemanticDiagnosticsBuilderProgram => {
    out.verbose("We're about to create the program!");
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
