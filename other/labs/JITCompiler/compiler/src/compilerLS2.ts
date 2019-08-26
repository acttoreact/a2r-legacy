import * as fs from 'fs';
import * as ts from 'typescript';
import path from 'path';
import out from './util/out';

out.setLevel('verbose');

function watch(rootFileNames: string[], options: ts.CompilerOptions): void {
  const files: ts.MapLike<{ version: number }> = {};

  // initialize the list of files
  rootFileNames.forEach((fileName): void => {
    files[fileName] = { version: 0 };
  });

  // Create the language service host to allow the LS to communicate with the host
  const servicesHost: ts.LanguageServiceHost = {
    getScriptFileNames: (): string[] => rootFileNames,
    getScriptVersion: (fileName): string =>
      files[fileName] && files[fileName].version.toString(),
    getScriptSnapshot: (fileName: string): ts.IScriptSnapshot | undefined => {
      if (!fs.existsSync(fileName)) {
        return undefined;
      }

      return ts.ScriptSnapshot.fromString(fs.readFileSync(fileName).toString());
    },
    getCurrentDirectory: (): string => process.cwd(),
    getCompilationSettings: (): ts.CompilerOptions => options,
    getDefaultLibFileName: (localOptions: ts.CompilerOptions): string =>
      ts.getDefaultLibFilePath(localOptions),
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
  };

  // Create the language service files
  const services = ts.createLanguageService(
    servicesHost,
    ts.createDocumentRegistry()
  );

  function logErrors(fileName: string): void {
    const allDiagnostics = services
      .getCompilerOptionsDiagnostics()
      .concat(services.getSyntacticDiagnostics(fileName))
      .concat(services.getSemanticDiagnostics(fileName));

    allDiagnostics.forEach((diagnostic): void => {
      const message = ts.flattenDiagnosticMessageText(
        diagnostic.messageText,
        '\n'
      );
      if (diagnostic.file) {
        const {
          line,
          character,
        } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start!);
        out.error(
          `  Error ${diagnostic.file.fileName} (${line + 1},${character +
            1}): ${message}`
        );
      } else {
        out.error(`  Error: ${message}`);
      }
    });
  }

  function emitFile(fileName: string): void {
    const output = services.getEmitOutput(fileName);

    console.log(output);

    if (!output.emitSkipped) {
      out.verbose(`Emitting ${fileName}`);
    } else {
      out.verbose(`Emitting ${fileName} failed`);
      logErrors(fileName);
    }

    output.outputFiles.forEach((outputFile): void => {
      fs.writeFileSync(outputFile.name, outputFile.text, 'utf8');
    });
  }

  // Now let's watch the files
  rootFileNames.forEach((fileName): void => {
    // First time around, emit all files
    emitFile(fileName);

    // Add a watch on the file to handle next change
    fs.watchFile(
      fileName,
      { persistent: true, interval: 250 },
      (curr, prev): void => {
        // Check timestamp
        if (+curr.mtime <= +prev.mtime) {
          return;
        }

        // Update the version to signal a change in the file
        files[fileName].version++;

        // write the changes to disk
        emitFile(fileName);
      }
    );
  });
}

const sourcesPath = path.join(__dirname, '../../test/api');
const rootDir = path.join(__dirname, '../../test/api');
const outDir = path.join(__dirname, '../../test/server');

// Initialize files constituting the program as all .ts files in the current directory
const currentDirectoryFiles = fs
  .readdirSync(sourcesPath)
  .filter(
    (fileName): boolean =>
      fileName.length >= 3 && fileName.substr(fileName.length - 3, 3) === '.ts'
  )
  .map((fileName): string => `${sourcesPath}/${fileName}`);

// Start the watcher
watch(currentDirectoryFiles, {
  module: ts.ModuleKind.CommonJS,
  outDir,
  rootDir,
  declaration: true,
  strict: true,
  moduleResolution: ts.ModuleResolutionKind.NodeJs,
  esModuleInterop: true,
});
