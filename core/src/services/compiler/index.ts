import ts from 'typescript';

import getProjectPath from '../../tools/getProjectPath';
import reportDiagnostic from '../../util/reportDiagnostic';
import compileOptions from './compileOptions';
import formatHost from './formatHost';
import out from '../../util/out';
import { fullPath } from '../../util/terminalStyles';

const compileFile = async (
  rootFiles: string[],
  outDir: string,
  rootDir?: string,
  options: ts.CompilerOptions = {},
  transformers?: ts.CustomTransformers,
): Promise<void> => {
  const theRootDir = rootDir || (await getProjectPath());
  out.verbose(
    `Compiling rootFiles ${rootFiles
      .map((f): string => fullPath(f))
      .join(', ')} in working directory ${fullPath(process.cwd())} from rootDir ${fullPath(
      theRootDir,
    )} to outDir ${fullPath(outDir)} with options ${options}`,
  );
  
  const program = ts.createProgram(rootFiles, {
    ...compileOptions,
    ...options,
    outDir,
    rootDir: theRootDir,
  });

  const emitResult = program.emit(undefined, undefined, undefined, undefined, transformers);
  const diagnostics = [
    ...ts.getPreEmitDiagnostics(program),
    ...emitResult.diagnostics,
    ...program.getSyntacticDiagnostics(),
  ];

  if (diagnostics && diagnostics.length) {
    diagnostics.forEach((diagnostic): void => {
      reportDiagnostic(diagnostic, formatHost);
    });
  }
};

export * from '../../model/compiler';
export default compileFile;
